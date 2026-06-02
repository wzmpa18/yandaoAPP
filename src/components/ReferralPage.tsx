import { useState, useEffect } from 'react';
import { getReferralInfo, createReferralCode, getReferralRecords, ReferralInfo, ReferralRecord } from '../lib/referralService';
import './ReferralPage.css';

export function ReferralPage() {
  const [referralInfo, setReferralInfo] = useState<ReferralInfo | null>(null);
  const [records, setRecords] = useState<ReferralRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReferralData();
  }, []);

  async function loadReferralData() {
    setLoading(true);
    const info = await getReferralInfo();
    if (info) {
      setReferralInfo(info);
    }
    const referralRecords = await getReferralRecords();
    setRecords(referralRecords);
    setLoading(false);
  }

  async function handleGenerateCode() {
    const info = await createReferralCode();
    if (info) {
      setReferralInfo(info);
    }
  }

  async function handleCopyLink() {
    if (referralInfo?.referral_link) {
      await navigator.clipboard.writeText(referralInfo.referral_link);
      alert('推广链接已复制到剪贴板！');
    }
  }

  if (loading) {
    return (
      <div className="referral-page">
        <div className="loading">加载中...</div>
      </div>
    );
  }

  return (
    <div className="referral-page">
      <div className="referral-header">
        <h1>🎁 推广中心</h1>
        <p className="subtitle">分享链接，赚取佣金</p>
      </div>

      <div className="referral-card">
        <div className="card-header">
          <h2>我的推广信息</h2>
        </div>
        
        {referralInfo ? (
          <div className="referral-content">
            <div className="referral-code">
              <span className="label">推广码</span>
              <span className="code">{referralInfo.referral_code}</span>
            </div>
            
            <div className="referral-link">
              <span className="label">推广链接</span>
              <input type="text" value={referralInfo.referral_link} readOnly />
              <button onClick={handleCopyLink} className="copy-btn">复制链接</button>
            </div>
            
            <div className="stats">
              <div className="stat-item">
                <span className="stat-value">{referralInfo.referred_users}</span>
                <span className="stat-label">推荐人数</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">¥{referralInfo.total_commission.toFixed(2)}</span>
                <span className="stat-label">累计佣金</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">¥{referralInfo.available_commission.toFixed(2)}</span>
                <span className="stat-label">可提现</span>
              </div>
            </div>
          </div>
        ) : (
          <button onClick={handleGenerateCode} className="generate-btn">
            生成推广码
          </button>
        )}
      </div>

      <div className="referral-card">
        <div className="card-header">
          <h2>推广记录</h2>
        </div>
        
        {records.length > 0 ? (
          <div className="records-list">
            {records.map(record => (
              <div key={record.id} className="record-item">
                <div className="record-info">
                  <span className="record-date">{new Date(record.created_at).toLocaleDateString()}</span>
                  <span className={`record-status ${record.status}`}>
                    {record.status === 'pending' ? '待确认' : record.status === 'confirmed' ? '已确认' : '已结算'}
                  </span>
                </div>
                <span className="record-amount">+¥{record.commission.toFixed(2)}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>暂无推广记录</p>
            <p className="hint">分享您的推广链接，邀请好友注册即可获得佣金</p>
          </div>
        )}
      </div>

      <div className="referral-card">
        <div className="card-header">
          <h2>推广规则</h2>
        </div>
        <div className="rules">
          <ul>
            <li>🎯 每成功邀请一位好友注册，可获得 ¥10 佣金</li>
            <li>🔗 好友通过您的专属链接注册即可自动绑定</li>
            <li>💰 佣金满 ¥100 可申请提现</li>
            <li>📊 支持二级推广，下级推广可获得额外奖励</li>
          </ul>
        </div>
      </div>
    </div>
  );
}