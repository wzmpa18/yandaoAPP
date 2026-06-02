import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// Base prices in USD cents
const BASE_PRICES_USD: Record<string, number> = {
  vip_monthly:  390,   // $3.90
  vip_yearly:   2900,  // $29.00
  exam_single:  99,    // $0.99
  partner_slot: 49,    // $0.49
  langpack:     190,   // $1.90
  ai_speech:    20,    // $0.20 per credit
};

// Supported currencies and their display decimals
const SUPPORTED: Record<string, { name: string; decimals: number }> = {
  USD: { name: 'US Dollar',       decimals: 2 },
  EUR: { name: 'Euro',            decimals: 2 },
  GBP: { name: 'British Pound',   decimals: 2 },
  JPY: { name: 'Japanese Yen',    decimals: 0 },
  KRW: { name: 'Korean Won',      decimals: 0 },
  CAD: { name: 'Canadian Dollar', decimals: 2 },
  AUD: { name: 'Australian Dollar', decimals: 2 },
  CNY: { name: 'Chinese Yuan',    decimals: 2 },
  SGD: { name: 'Singapore Dollar', decimals: 2 },
  HKD: { name: 'Hong Kong Dollar', decimals: 2 },
};

const FALLBACK_RATES: Record<string, number> = {
  USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.5, KRW: 1320,
  CAD: 1.36, AUD: 1.52, CNY: 7.24, SGD: 1.34, HKD: 7.82,
};

async function fetchRates(): Promise<Record<string, number>> {
  try {
    const res = await fetch(
      "https://open.er-api.com/v6/latest/USD",
      { signal: AbortSignal.timeout(4000) }
    );
    if (!res.ok) throw new Error("rate fetch failed");
    const json = await res.json() as { rates: Record<string, number>; result: string };
    if (json.result !== "success") throw new Error("bad result");
    return json.rates;
  } catch {
    return FALLBACK_RATES;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const currency = (url.searchParams.get("currency") ?? "USD").toUpperCase();
    const rates = await fetchRates();
    const rate = rates[currency] ?? 1;

    const converted: Record<string, { cents: number; display: string; currency: string }> = {};
    const info = SUPPORTED[currency] ?? { name: currency, decimals: 2 };

    for (const [planKey, usdCents] of Object.entries(BASE_PRICES_USD)) {
      const localCents = Math.round(usdCents * rate);
      const display = info.decimals === 0
        ? `${Math.round(localCents)} ${currency}`
        : `${(localCents / 100).toFixed(info.decimals)} ${currency}`;
      converted[planKey] = { cents: localCents, display, currency };
    }

    const payload = {
      base: "USD",
      currency,
      currencyName: info.name,
      rate,
      updatedAt: new Date().toISOString(),
      prices: converted,
      allRates: Object.fromEntries(
        Object.entries(SUPPORTED).map(([c]) => [c, rates[c] ?? FALLBACK_RATES[c] ?? 1])
      ),
    };

    return new Response(JSON.stringify(payload), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
