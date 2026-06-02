import React from 'react';
import { UpsellPlan } from '../lib/featureGate';

interface PaywallModalProps {
  blockReason: string;
  upsellPlan?: UpsellPlan;
  onBuy: (plan: UpsellPlan) => void;
  onUpgradeVip: () => void;
  onClose: () => void;
}

const PLAN_ICON: Record<string, string> = {
  exam_single:  '📝',
  vip_monthly:  '💎',
  vip_yearly:   '👑',
  partner_slot: '🤝',
  langpack:     '📚',
  ai_speech:    '🎙️',
};

export const PaywallModal: React.FC<PaywallModalProps> = ({
  blockReason, upsellPlan, onBuy, onUpgradeVip, onClose,
}) => {
  const isVipPlan = upsellPlan?.planKey.startsWith('vip_');

  return (
    <div className="pw-overlay" onClick={onClose}>
      <div className="pw-modal" onClick={(e) => e.stopPropagation()}>
        <button className="pw-close" onClick={onClose}>✕</button>

        <div className="pw-lock-icon">🔒</div>
        <h3 className="pw-title">功能受限</h3>
        <p className="pw-reason">{blockReason}</p>

        {upsellPlan && (
          <div className="pw-plan-card">
            <span className="pw-plan-icon">{PLAN_ICON[upsellPlan.planKey] ?? '⭐'}</span>
            <div className="pw-plan-info">
              <span className="pw-plan-label">{upsellPlan.label}</span>
              <span className="pw-plan-price">{upsellPlan.priceLabel}</span>
              <p className="pw-plan-desc">{upsellPlan.description}</p>
            </div>
          </div>
        )}

        <div className="pw-actions">
          {upsellPlan && (
            <button className="pw-buy-btn" onClick={() => onBuy(upsellPlan)}>
              立即购买 · {upsellPlan.priceLabel}
            </button>
          )}
          {!isVipPlan && (
            <button className="pw-vip-btn" onClick={onUpgradeVip}>
              💎 升级会员（更划算）
            </button>
          )}
          <button className="pw-cancel-btn" onClick={onClose}>暂不购买</button>
        </div>

        <p className="pw-footer">测试模式 · 无需真实付款 · 点击即可体验完整流程</p>
      </div>
    </div>
  );
};
