import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../data/supabase';

interface GroupShopProps {
  groupId: string;
  groupName: string;
  ownerKey: string;
  sessionKey: string;
  groupType: string;
  onClose: () => void;
}

interface Product {
  id: string;
  group_id: string;
  owner_key: string;
  name: string;
  description: string;
  price_fen: number;
  stock: number;
  sold_count: number;
  is_active: boolean;
}

interface Order {
  id: string;
  product_id: string;
  buyer_key: string;
  quantity: number;
  total_fen: number;
  commission_fen: number;
  seller_income_fen: number;
  payment_status: string;
  is_simulated: boolean;
  created_at: string;
  product?: Product;
}

interface Wallet {
  owner_key: string;
  balance_fen: number;
  total_earned: number;
  total_withdrawn: number;
}

type ShopTab = 'products' | 'add' | 'orders' | 'wallet';

const SHOP_TYPES = ['mid', 'large', 'vip'];

function fenToYuan(fen: number): string {
  return `¥${(fen / 100).toFixed(2)}`;
}

function canOpenShop(groupType: string): boolean {
  return SHOP_TYPES.includes(groupType);
}

export const GroupShop: React.FC<GroupShopProps> = ({
  groupId, groupName, ownerKey, sessionKey, groupType, onClose,
}) => {
  const isOwner = ownerKey === sessionKey;
  const shopAllowed = canOpenShop(groupType);

  const [tab, setTab] = useState<ShopTab>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [commissionPct, setCommissionPct] = useState(20);
  const [minWithdrawalFen, setMinWithdrawalFen] = useState(1000);
  const [loading, setLoading] = useState(true);

  // Add product form
  const [addName, setAddName] = useState('');
  const [addDesc, setAddDesc] = useState('');
  const [addPrice, setAddPrice] = useState('');
  const [addStock, setAddStock] = useState('10');
  const [addSaving, setAddSaving] = useState(false);
  const [addDone, setAddDone] = useState(false);

  // Order modal
  const [orderTarget, setOrderTarget] = useState<Product | null>(null);
  const [orderQty, setOrderQty] = useState(1);
  const [ordering, setOrdering] = useState(false);
  const [orderDone, setOrderDone] = useState(false);

  // Withdrawal
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawDone, setWithdrawDone] = useState(false);

  const loadConfig = useCallback(async () => {
    const { data } = await supabase.from('platform_configs')
      .select('key,value')
      .in('key', ['shop_commission_pct', 'min_withdrawal_fen']);
    if (!data) return;
    data.forEach((r) => {
      if (r.key === 'shop_commission_pct') setCommissionPct(parseInt(r.value) || 20);
      if (r.key === 'min_withdrawal_fen') setMinWithdrawalFen(parseInt(r.value) || 1000);
    });
  }, []);

  const loadProducts = useCallback(async () => {
    const { data } = await supabase.from('group_products')
      .select('*').eq('group_id', groupId).eq('is_active', true)
      .order('created_at', { ascending: false });
    setProducts((data ?? []) as Product[]);
  }, [groupId]);

  const loadOrders = useCallback(async () => {
    const { data } = await supabase.from('group_orders')
      .select('*').eq('buyer_key', sessionKey).eq('group_id', groupId)
      .order('created_at', { ascending: false });
    if (!data) return;
    const enriched: Order[] = [];
    for (const o of data) {
      const { data: p } = await supabase.from('group_products').select('*').eq('id', o.product_id).maybeSingle();
      enriched.push({ ...o, product: p ?? undefined });
    }
    setMyOrders(enriched);
  }, [sessionKey, groupId]);

  const loadWallet = useCallback(async () => {
    const { data } = await supabase.from('platform_wallets')
      .select('*').eq('owner_key', sessionKey).maybeSingle();
    setWallet(data as Wallet | null);
  }, [sessionKey]);

  useEffect(() => {
    setLoading(true);
    Promise.all([loadConfig(), loadProducts(), loadWallet()]).finally(() => setLoading(false));
  }, [loadConfig, loadProducts, loadWallet]);

  useEffect(() => {
    if (tab === 'orders') loadOrders();
    if (tab === 'wallet') loadWallet();
  }, [tab, loadOrders, loadWallet]);

  async function addProduct() {
    if (!addName.trim() || !addPrice) return;
    setAddSaving(true);
    const priceFen = Math.round(parseFloat(addPrice) * 100);
    await supabase.from('group_products').insert({
      group_id: groupId,
      owner_key: sessionKey,
      name: addName.trim(),
      description: addDesc.trim(),
      price_fen: priceFen,
      stock: parseInt(addStock) || 0,
    });
    setAddDone(true);
    setAddName(''); setAddDesc(''); setAddPrice(''); setAddStock('10');
    await loadProducts();
    setAddSaving(false);
    setTimeout(() => { setAddDone(false); setTab('products'); }, 1500);
  }

  async function toggleProduct(p: Product) {
    await supabase.from('group_products').update({ is_active: !p.is_active }).eq('id', p.id);
    loadProducts();
  }

  async function placeOrder() {
    if (!orderTarget) return;
    setOrdering(true);
    const totalFen = orderTarget.price_fen * orderQty;
    const commissionFen = Math.round(totalFen * commissionPct / 100);
    const sellerFen = totalFen - commissionFen;

    // Simulated payment — insert order as paid immediately
    await supabase.from('group_orders').insert({
      group_id: groupId,
      product_id: orderTarget.id,
      buyer_key: sessionKey,
      seller_key: orderTarget.owner_key,
      quantity: orderQty,
      unit_price_fen: orderTarget.price_fen,
      total_fen: totalFen,
      commission_fen: commissionFen,
      seller_income_fen: sellerFen,
      is_simulated: true,
      payment_status: 'paid',
      paid_at: new Date().toISOString(),
    });

    // Deduct stock
    await supabase.from('group_products').update({
      stock: Math.max(0, orderTarget.stock - orderQty),
      sold_count: orderTarget.sold_count + orderQty,
    }).eq('id', orderTarget.id);

    // Credit seller wallet (upsert)
    const existing = await supabase.from('platform_wallets')
      .select('*').eq('owner_key', orderTarget.owner_key).maybeSingle();
    if (existing.data) {
      await supabase.from('platform_wallets').update({
        balance_fen: existing.data.balance_fen + sellerFen,
        total_earned: existing.data.total_earned + sellerFen,
        updated_at: new Date().toISOString(),
      }).eq('owner_key', orderTarget.owner_key);
    } else {
      await supabase.from('platform_wallets').insert({
        owner_key: orderTarget.owner_key,
        wallet_type: 'seller',
        balance_fen: sellerFen,
        total_earned: sellerFen,
      });
    }

    setOrderDone(true);
    setOrdering(false);
    await loadProducts();
  }

  async function requestWithdrawal() {
    if (!wallet || wallet.balance_fen < minWithdrawalFen) return;
    setWithdrawing(true);
    await supabase.from('withdrawals').insert({
      owner_key: sessionKey,
      amount_fen: wallet.balance_fen,
      status: 'pending',
      note: '模拟提现申请',
    });
    await supabase.from('platform_wallets').update({
      balance_fen: 0,
      total_withdrawn: wallet.total_withdrawn + wallet.balance_fen,
      updated_at: new Date().toISOString(),
    }).eq('owner_key', sessionKey);
    setWithdrawDone(true);
    setWithdrawing(false);
    loadWallet();
  }

  if (!shopAllowed) {
    return (
      <div className="gs-wrap">
        <div className="gs-topbar">
          <span className="gs-group-name">{groupName} · 橱窗</span>
          <button className="gs-close" onClick={onClose}>✕</button>
        </div>
        <div className="gs-lock">
          <span className="gs-lock-icon">🔒</span>
          <p className="gs-lock-text">商品橱窗仅限中群及以上开启</p>
          <p className="gs-lock-hint">升级到中群（≤50人）即可使用</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gs-wrap">
      <div className="gs-topbar">
        <span className="gs-group-name">{groupName} · 橱窗</span>
        <button className="gs-close" onClick={onClose}>✕</button>
      </div>

      <div className="gs-commission-bar">
        <span>平台抽成 {commissionPct}%</span>
        <span>·</span>
        <span>群主得 {100 - commissionPct}%</span>
        <span>·</span>
        <span>模拟支付模式</span>
      </div>

      {/* Tabs */}
      <div className="gs-tabs">
        <button className={`gs-tab ${tab === 'products' ? 'active' : ''}`} onClick={() => setTab('products')}>
          商品列表
        </button>
        {isOwner && (
          <button className={`gs-tab ${tab === 'add' ? 'active' : ''}`} onClick={() => setTab('add')}>
            上架商品
          </button>
        )}
        <button className={`gs-tab ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>
          我的订单
        </button>
        <button className={`gs-tab ${tab === 'wallet' ? 'active' : ''}`} onClick={() => setTab('wallet')}>
          钱包
        </button>
      </div>

      {/* ── PRODUCTS ── */}
      {tab === 'products' && (
        <div className="gs-product-list">
          {loading && <div className="gs-loading">加载商品…</div>}
          {!loading && products.length === 0 && (
            <div className="gs-empty">
              {isOwner ? '还没有商品，点击「上架商品」添加' : '本群暂无商品'}
            </div>
          )}
          {products.map((p) => (
            <div className="gs-product-card" key={p.id}>
              <div className="gs-product-info">
                <span className="gs-product-name">{p.name}</span>
                {p.description && <p className="gs-product-desc">{p.description}</p>}
                <div className="gs-product-meta">
                  <span className="gs-product-price">{fenToYuan(p.price_fen)}</span>
                  <span className="gs-product-stock">库存 {p.stock}</span>
                  <span className="gs-product-sold">已售 {p.sold_count}</span>
                </div>
              </div>
              <div className="gs-product-actions">
                {!isOwner && p.stock > 0 && sessionKey !== p.owner_key && (
                  <button className="gs-buy-btn" onClick={() => { setOrderTarget(p); setOrderQty(1); setOrderDone(false); }}>
                    购买
                  </button>
                )}
                {isOwner && (
                  <button className="gs-toggle-btn" onClick={() => toggleProduct(p)}>
                    下架
                  </button>
                )}
                {p.stock === 0 && !isOwner && (
                  <span className="gs-sold-out">已售罄</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── ADD PRODUCT ── */}
      {tab === 'add' && isOwner && (
        <div className="gs-add-form">
          {addDone ? (
            <div className="gs-add-done">
              <span className="gs-done-icon">✅</span>
              <p>商品已上架！</p>
            </div>
          ) : (
            <>
              <h3 className="gs-add-title">上架新商品</h3>
              <div className="gs-field">
                <label className="gs-label">商品名称</label>
                <input className="gs-input" value={addName} maxLength={40} placeholder="例：日语会话私教课（1小时）"
                  onChange={(e) => setAddName(e.target.value)} />
              </div>
              <div className="gs-field">
                <label className="gs-label">商品描述（可选）</label>
                <textarea className="gs-textarea" value={addDesc} maxLength={200} rows={3} placeholder="介绍商品内容、适合人群…"
                  onChange={(e) => setAddDesc(e.target.value)} />
              </div>
              <div className="gs-field-row">
                <div className="gs-field half">
                  <label className="gs-label">价格（元）</label>
                  <input className="gs-input" type="number" min="0.01" step="0.01" value={addPrice} placeholder="9.90"
                    onChange={(e) => setAddPrice(e.target.value)} />
                </div>
                <div className="gs-field half">
                  <label className="gs-label">库存数量</label>
                  <input className="gs-input" type="number" min="1" value={addStock}
                    onChange={(e) => setAddStock(e.target.value)} />
                </div>
              </div>
              {addPrice && (
                <div className="gs-commission-preview">
                  <span>售价 {fenToYuan(Math.round(parseFloat(addPrice || '0') * 100))}</span>
                  <span>→ 平台 {fenToYuan(Math.round(parseFloat(addPrice || '0') * 100 * commissionPct / 100))}</span>
                  <span>→ 你得 {fenToYuan(Math.round(parseFloat(addPrice || '0') * 100 * (100 - commissionPct) / 100))}</span>
                </div>
              )}
              <button className="gs-add-btn" disabled={addSaving || !addName.trim() || !addPrice}
                onClick={addProduct}>
                {addSaving ? '上架中…' : '确认上架'}
              </button>
            </>
          )}
        </div>
      )}

      {/* ── ORDERS ── */}
      {tab === 'orders' && (
        <div className="gs-order-list">
          {myOrders.length === 0 && <div className="gs-empty">暂无订单记录</div>}
          {myOrders.map((o) => (
            <div className="gs-order-card" key={o.id}>
              <div className="gs-order-top">
                <span className="gs-order-name">{o.product?.name ?? '商品已下架'}</span>
                <span className={`gs-order-status ${o.payment_status}`}>{
                  o.payment_status === 'paid' ? '✓ 已支付' :
                  o.payment_status === 'pending' ? '待支付' :
                  o.payment_status === 'refunded' ? '已退款' : '失败'
                }</span>
              </div>
              <div className="gs-order-meta">
                <span>×{o.quantity}</span>
                <span className="gs-order-total">{fenToYuan(o.total_fen)}</span>
                {o.is_simulated && <span className="gs-sim-tag">模拟</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── WALLET ── */}
      {tab === 'wallet' && (
        <div className="gs-wallet">
          <div className="gs-wallet-card">
            <span className="gs-wallet-label">可提现余额</span>
            <span className="gs-wallet-balance">{fenToYuan(wallet?.balance_fen ?? 0)}</span>
            <div className="gs-wallet-stats">
              <div className="gs-wallet-stat">
                <span>累计收入</span>
                <strong>{fenToYuan(wallet?.total_earned ?? 0)}</strong>
              </div>
              <div className="gs-wallet-stat">
                <span>已提现</span>
                <strong>{fenToYuan(wallet?.total_withdrawn ?? 0)}</strong>
              </div>
            </div>
          </div>
          <p className="gs-withdraw-hint">最低提现额：{fenToYuan(minWithdrawalFen)}</p>
          {withdrawDone ? (
            <div className="gs-withdraw-done">✅ 提现申请已提交，预计1-3工作日到账</div>
          ) : (
            <button
              className="gs-withdraw-btn"
              disabled={withdrawing || (wallet?.balance_fen ?? 0) < minWithdrawalFen}
              onClick={requestWithdrawal}
            >
              {withdrawing ? '申请中…' : `申请提现 ${fenToYuan(wallet?.balance_fen ?? 0)}`}
            </button>
          )}
          <p className="gs-wallet-notice">当前为模拟支付模式。真实支付上线后，资金将通过支付宝/微信实际到账。</p>
        </div>
      )}

      {/* ── ORDER MODAL ── */}
      {orderTarget && (
        <div className="gs-modal-overlay" onClick={() => { if (!ordering) { setOrderTarget(null); setOrderDone(false); } }}>
          <div className="gs-modal" onClick={(e) => e.stopPropagation()}>
            {orderDone ? (
              <div className="gs-order-success">
                <span className="gs-done-icon">🎉</span>
                <p className="gs-order-success-title">购买成功！</p>
                <p className="gs-order-success-sub">
                  {fenToYuan(orderTarget.price_fen * orderQty)} 已支付（模拟）
                </p>
                <button className="gs-modal-confirm" onClick={() => { setOrderTarget(null); setOrderDone(false); setTab('orders'); }}>
                  查看订单
                </button>
              </div>
            ) : (
              <>
                <h3 className="gs-modal-title">确认购买</h3>
                <p className="gs-modal-product-name">{orderTarget.name}</p>
                {orderTarget.description && <p className="gs-modal-product-desc">{orderTarget.description}</p>}
                <div className="gs-qty-row">
                  <label className="gs-label">数量</label>
                  <div className="gs-qty-ctrl">
                    <button className="gs-qty-btn" onClick={() => setOrderQty(Math.max(1, orderQty - 1))}>−</button>
                    <span className="gs-qty-val">{orderQty}</span>
                    <button className="gs-qty-btn" onClick={() => setOrderQty(Math.min(orderTarget.stock, orderQty + 1))}>+</button>
                  </div>
                </div>
                <div className="gs-order-summary">
                  <div className="gs-summary-row">
                    <span>单价</span><span>{fenToYuan(orderTarget.price_fen)}</span>
                  </div>
                  <div className="gs-summary-row">
                    <span>数量</span><span>×{orderQty}</span>
                  </div>
                  <div className="gs-summary-row total">
                    <span>合计</span><span>{fenToYuan(orderTarget.price_fen * orderQty)}</span>
                  </div>
                </div>
                <p className="gs-sim-notice">模拟支付 — 无需真实付款，数据自动结算</p>
                <div className="gs-modal-actions">
                  <button className="gs-modal-confirm" disabled={ordering} onClick={placeOrder}>
                    {ordering ? '支付中…' : `确认支付 ${fenToYuan(orderTarget.price_fen * orderQty)}`}
                  </button>
                  <button className="gs-modal-cancel" onClick={() => setOrderTarget(null)}>取消</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
