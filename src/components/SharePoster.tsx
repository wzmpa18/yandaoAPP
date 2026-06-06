import React, { useRef, useState } from 'react';

interface SharePosterProps {
  code: string;
  referralLink: string;
  onClose: () => void;
}

export const SharePoster: React.FC<SharePosterProps> = ({ code, referralLink, onClose }) => {
  const [saving, setSaving] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(referralLink)}`;

  const handleSave = async () => {
    setSaving(true);
    try {
      // Use html2canvas-like approach: create a canvas from the poster div
      const el = posterRef.current;
      if (!el) return;

      const canvas = document.createElement('canvas');
      canvas.width = 360;
      canvas.height = 520;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw gradient background
      const grad = ctx.createLinearGradient(0, 0, 0, 520);
      grad.addColorStop(0, '#667eea');
      grad.addColorStop(1, '#764ba2');
      ctx.fillStyle = grad;
      ctx.roundRect(0, 0, 360, 520, 20);
      ctx.fill();

      // Draw white card
      ctx.fillStyle = '#fff';
      ctx.roundRect(16, 64, 328, 440, 16);
      ctx.fill();

      // Title
      ctx.fillStyle = '#333';
      ctx.font = 'bold 22px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('言道学外语', 180, 110);

      ctx.fillStyle = '#999';
      ctx.font = '13px sans-serif';
      ctx.fillText('开心学语言 · 学到哈哈笑', 180, 132);

      // Features
      const features = ['10种语言', 'AI陪练', '记忆法', '模拟考试', '趣味游戏', '真人语伴'];
      let fx = 30, fy = 150;
      ctx.font = '11px sans-serif';
      features.forEach((f, i) => {
        const w = ctx.measureText(f).width + 20;
        if (fx + w > 340) { fx = 30; fy += 24; }
        ctx.fillStyle = '#f5f3ef';
        ctx.roundRect(fx, fy, w, 20, 10);
        ctx.fill();
        ctx.fillStyle = '#666';
        ctx.fillText(f, fx + w / 2, fy + 14);
        fx += w + 6;
      });

      // QR code (draw as placeholder rectangle + text)
      ctx.fillStyle = '#667eea';
      ctx.fillRect(105, 200, 150, 150);
      ctx.fillStyle = '#fff';
      ctx.fillRect(110, 205, 140, 140);
      
      try {
        // Try to load QR code image
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise<void>((resolve, reject) => {
          img.onload = () => { ctx.drawImage(img, 110, 205, 140, 140); resolve(); };
          img.onerror = () => { 
            // Draw QR placeholder
            ctx.fillStyle = '#764ba2';
            ctx.font = '24px sans-serif';
            ctx.fillText('扫码加入', 180, 282);
            resolve(); 
          };
          img.src = qrUrl;
        });
      } catch { /* use placeholder */ }

      // Invite code
      ctx.fillStyle = '#667eea';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(code, 180, 380);

      ctx.fillStyle = '#999';
      ctx.font = '12px sans-serif';
      ctx.fillText('扫码下载 App，开启语言学习之旅', 180, 400);

      // Download
      const link = document.createElement('a');
      link.download = `言道APP-分享海报-${code}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      const toast = document.createElement('div');
      toast.textContent = '✅ 海报已保存到本地';
      toast.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:99999;background:#10b981;color:#fff;padding:10px 24px;border-radius:99px;font-size:13px;font-weight:600;';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    } catch (err) {
      alert('保存失败，请重试');
    }
    setSaving(false);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '言道学外语 - 开心学语言',
          text: `加入言道学外语！用我的邀请码 ${code} 注册，一起学习吧！`,
          url: referralLink,
        });
      } catch { /* user cancelled */ }
    } else {
      navigator.clipboard?.writeText(referralLink).then(() => {
        const toast = document.createElement('div');
        toast.textContent = '✅ 链接已复制，快去分享吧！';
        toast.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:99999;background:#10b981;color:#fff;padding:10px 24px;border-radius:99px;font-size:13px;font-weight:600;';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
      });
    }
  };

  return (
    <div className="sp-overlay" onClick={onClose}>
      <div className="sp-poster" ref={posterRef} onClick={(e) => e.stopPropagation()}>
        <div className="sp-header">
          <span className="sp-title">📱 分享海报</span>
          <button className="sp-close" onClick={onClose}>✕</button>
        </div>
        <div className="sp-content">
          <div className="sp-app-name">言道学外语</div>
          <div className="sp-app-tagline">开心学语言 · 学到哈哈笑</div>

          <div className="sp-qr-wrap">
            <img
              src={qrUrl}
              alt="扫码下载"
              className="sp-qr-code"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>

          <div className="sp-code">{code}</div>
          <div className="sp-code-label">你的专属邀请码</div>

          <div className="sp-features">
            <span className="sp-feature">10种语言</span>
            <span className="sp-feature">AI陪练</span>
            <span className="sp-feature">记忆法大全</span>
            <span className="sp-feature">模拟考试</span>
            <span className="sp-feature">趣味游戏</span>
            <span className="sp-feature">真人语伴</span>
          </div>

          <div className="sp-actions">
            <button className="sp-save-btn" onClick={handleSave} disabled={saving}>
              {saving ? '保存中…' : '💾 保存海报'}
            </button>
            <button className="sp-share-btn" onClick={handleNativeShare}>
              📤 分享
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
