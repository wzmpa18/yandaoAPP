import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, stripe-signature",
};

/**
 * Stripe Webhook Handler
 *
 * Handles the following events:
 *   - payment_intent.succeeded          → grant one-time purchase (exam, ai_speech, partner_slot, langpack)
 *   - customer.subscription.created     → grant vip_monthly / vip_yearly
 *   - customer.subscription.updated     → update vip_expiry
 *   - customer.subscription.deleted     → revoke VIP
 *   - invoice.payment_failed            → mark subscription past_due
 *   - charge.refunded                   → mark order refunded, optionally revoke
 *
 * For MOCK mode (no Stripe configured), the frontend calls this endpoint directly
 * with a simplified JSON payload: { event: 'mock_payment', plan_key, session_key, currency, amount_cents, metadata }
 */

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const stripeWebhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");

    const rawBody = await req.text();
    const stripeSignature = req.headers.get("stripe-signature");

    // ── MOCK mode: no Stripe keys configured ──
    if (!stripeSecretKey || !stripeWebhookSecret) {
      const payload = JSON.parse(rawBody);
      if (payload.event === "mock_payment") {
        await handleMockPayment(supabase, payload);
        return new Response(JSON.stringify({ received: true, mode: "mock" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "Stripe not configured" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── LIVE Stripe mode: verify webhook signature ──
    // Signature verification requires the Stripe Node SDK or manual HMAC check.
    // We do manual HMAC-SHA256 verification here (no external dependency needed).
    if (!stripeSignature) {
      return new Response(JSON.stringify({ error: "Missing stripe-signature" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sigParts = Object.fromEntries(
      stripeSignature.split(",").map((p) => p.split("=") as [string, string])
    );
    const timestamp = sigParts["t"];
    const receivedSig = sigParts["v1"];
    const signedPayload = `${timestamp}.${rawBody}`;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw", encoder.encode(stripeWebhookSecret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
    );
    const mac = await crypto.subtle.sign("HMAC", key, encoder.encode(signedPayload));
    const expectedSig = Array.from(new Uint8Array(mac)).map((b) => b.toString(16).padStart(2, "0")).join("");
    if (expectedSig !== receivedSig) {
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const event = JSON.parse(rawBody);
    await handleStripeEvent(supabase, event);

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

// ── Mock payment handler ──────────────────────────────────────────────────────
async function handleMockPayment(supabase: ReturnType<typeof createClient>, payload: {
  plan_key: string;
  session_key: string;
  currency: string;
  amount_cents: number;
  metadata?: Record<string, string>;
}) {
  const { plan_key, session_key, currency, amount_cents, metadata } = payload;

  // Record order
  await supabase.from("payment_orders").insert({
    session_key,
    plan_key,
    currency,
    amount_cents,
    status: "paid",
    payment_provider: "mock",
    is_simulated: true,
    metadata: metadata ?? null,
    paid_at: new Date().toISOString(),
  });

  await grantEntitlement(supabase, plan_key, session_key, metadata);
}

// ── Live Stripe event handler ────────────────────────────────────────────────
async function handleStripeEvent(supabase: ReturnType<typeof createClient>, event: { type: string; data: { object: Record<string, unknown> } }) {
  const obj = event.data.object;

  switch (event.type) {
    case "payment_intent.succeeded": {
      const pi = obj as { id: string; metadata?: Record<string, string>; amount: number; currency: string };
      const sessionKey = pi.metadata?.session_key;
      const planKey = pi.metadata?.plan_key;
      if (!sessionKey || !planKey) break;

      await supabase.from("payment_orders").update({
        status: "paid",
        stripe_payment_intent_id: pi.id,
        paid_at: new Date().toISOString(),
      }).eq("session_key", sessionKey).eq("plan_key", planKey).eq("status", "pending");

      await grantEntitlement(supabase, planKey, sessionKey, pi.metadata);
      break;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = obj as {
        id: string; status: string; metadata?: Record<string, string>;
        current_period_end: number; customer: string;
      };
      const sessionKey = sub.metadata?.session_key;
      const planKey = sub.metadata?.plan_key ?? "vip_monthly";
      if (!sessionKey) break;

      const periodEnd = new Date(sub.current_period_end * 1000).toISOString();
      await supabase.from("user_profiles").update({
        vip_expiry: periodEnd,
        stripe_customer_id: sub.customer,
      }).eq("session_key", sessionKey);

      await supabase.from("user_subscriptions").upsert({
        session_key: sessionKey,
        plan_key: planKey,
        stripe_subscription_id: sub.id,
        stripe_customer_id: sub.customer as string,
        status: sub.status === "active" ? "active" : "past_due",
        current_period_end: periodEnd,
        is_simulated: false,
        payment_provider: "stripe",
        currency: "USD",
        amount_cents: 0,
      }, { onConflict: "stripe_subscription_id" });
      break;
    }

    case "customer.subscription.deleted": {
      const sub = obj as { id: string; metadata?: Record<string, string> };
      const sessionKey = sub.metadata?.session_key;
      if (!sessionKey) break;
      await supabase.from("user_profiles").update({ vip_expiry: null }).eq("session_key", sessionKey);
      await supabase.from("user_subscriptions").update({ status: "cancelled", cancelled_at: new Date().toISOString() })
        .eq("stripe_subscription_id", sub.id);
      break;
    }

    case "invoice.payment_failed": {
      const inv = obj as { subscription?: string };
      if (inv.subscription) {
        await supabase.from("user_subscriptions").update({ status: "past_due" })
          .eq("stripe_subscription_id", inv.subscription);
      }
      break;
    }

    case "charge.refunded": {
      const charge = obj as { payment_intent?: string };
      if (charge.payment_intent) {
        await supabase.from("payment_orders").update({ status: "refunded" })
          .eq("stripe_payment_intent_id", charge.payment_intent);
      }
      break;
    }
  }
}

// ── Entitlement granter ───────────────────────────────────────────────────────
async function grantEntitlement(
  supabase: ReturnType<typeof createClient>,
  planKey: string,
  sessionKey: string,
  meta?: Record<string, string>,
) {
  const now = new Date();

  switch (planKey) {
    case "vip_monthly": {
      const expiry = new Date(now.getTime() + 30 * 86400 * 1000).toISOString();
      await supabase.from("user_profiles").update({ vip_expiry: expiry }).eq("session_key", sessionKey);
      break;
    }
    case "vip_yearly": {
      const expiry = new Date(now.getTime() + 365 * 86400 * 1000).toISOString();
      await supabase.from("user_profiles").update({ vip_expiry: expiry }).eq("session_key", sessionKey);
      break;
    }
    case "exam_single": {
      const { data: p } = await supabase.from("user_profiles").select("exam_credits").eq("session_key", sessionKey).maybeSingle();
      await supabase.from("user_profiles").update({ exam_credits: (p?.exam_credits ?? 0) + 1 }).eq("session_key", sessionKey);
      break;
    }
    case "ai_speech": {
      const { data: p } = await supabase.from("user_profiles").select("ai_speech_credits").eq("session_key", sessionKey).maybeSingle();
      await supabase.from("user_profiles").update({ ai_speech_credits: (p?.ai_speech_credits ?? 0) + 5 }).eq("session_key", sessionKey);
      break;
    }
    case "partner_slot": {
      const { data: p } = await supabase.from("user_profiles").select("extra_partner_count").eq("session_key", sessionKey).maybeSingle();
      await supabase.from("user_profiles").update({ extra_partner_count: (p?.extra_partner_count ?? 0) + 1 }).eq("session_key", sessionKey);
      break;
    }
    case "langpack": {
      const lang = meta?.lang;
      if (!lang) break;
      const { data: p } = await supabase.from("user_profiles").select("unlocked_lang_packs").eq("session_key", sessionKey).maybeSingle();
      const current: string[] = p?.unlocked_lang_packs ?? [];
      if (!current.includes(lang)) {
        await supabase.from("user_profiles").update({ unlocked_lang_packs: [...current, lang] }).eq("session_key", sessionKey);
      }
      break;
    }
  }
}
