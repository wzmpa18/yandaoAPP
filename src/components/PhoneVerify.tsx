import React, { useEffect, useState } from 'react';
import { supabase } from '../data/supabase';

interface PhoneVerifyProps {
  sessionKey: string;
  onVerified: () => void;
  onSkip?: () => void;
}

type Step = 'phone' | 'code' | 'done';

const PhoneVerify: React.FC<PhoneVerifyProps> = ({ sessionKey, onVerified, onSkip }) => {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [step, setStep] = useState<Step>('phone');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkExisting = async () => {
      const { data } = await supabase
        .from('user_phone_verifications')
        .select('is_verified')
        .eq('session_key', sessionKey)
        .single();
      if (data?.is_verified) {
        onVerified();
      }
    };
    checkExisting();
  }, [sessionKey, onVerified]);

  const sendCode = async () => {
    if (!phone.trim()) {
      setError('请输入手机号码');
      return;
    }
    setSending(true);
    setError('');

    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    const phoneMasked = phone.slice(-4).padStart(phone.length, '*');

    const { error: upsertError } = await supabase
      .from('user_phone_verifications')
      .upsert({
        session_key: sessionKey,
        phone_masked: phoneMasked,
        verify_code: generatedCode,
        is_verified: false,
        attempts: 0,
      }, { onConflict: 'session_key' });

    setSending(false);

    if (upsertError) {
      setError('发送失败，请重试');
      return;
    }

    setSentCode(generatedCode);
    setStep('code');
  };

  const verifyCode = async () => {
    if (!code.trim()) {
      setError('请输入验证码');
      return;
    }
    setVerifying(true);
    setError('');

    if (code === sentCode) {
      await supabase
        .from('user_phone_verifications')
        .update({ is_verified: true, verified_at: new Date().toISOString() })
        .eq('session_key', sessionKey);

      setVerifying(false);
      setStep('done');
      setTimeout(() => {
        onVerified();
      }, 1000);
    } else {
      await supabase.rpc('increment_verify_attempts', { p_session_key: sessionKey }).catch(() => {
        supabase
          .from('user_phone_verifications')
          .select('attempts')
          .eq('session_key', sessionKey)
          .single()
          .then(({ data }) => {
            if (data) {
              supabase
                .from('user_phone_verifications')
                .update({ attempts: (data.attempts ?? 0) + 1 })
                .eq('session_key', sessionKey);
            }
          });
      });

      setVerifying(false);
      setError('验证码错误，请重试');
    }
  };

  const maskedPhone = phone
    ? phone.slice(-4).padStart(phone.length, '*')
    : '';

  return (
    <div className="pv-overlay">
      <div className="pv-modal">
        {step === 'phone' && (
          <>
            <div className="pv-step-indicator">1 / 2</div>
            <h2 className="pv-title">手机验证</h2>
            <p className="pv-sub">用于激活邀请佣金解冻</p>

            <input
              className="pv-input"
              type="tel"
              placeholder="+86 手机号码"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setError('');
              }}
              disabled={sending}
            />

            {error && <p className="pv-error">{error}</p>}

            <button
              className="pv-btn"
              onClick={sendCode}
              disabled={sending}
            >
              {sending ? '发送中…' : '获取验证码'}
            </button>

            {onSkip && (
              <span className="pv-skip-link" onClick={onSkip}>
                暂时跳过
              </span>
            )}
          </>
        )}

        {step === 'code' && (
          <>
            <div className="pv-step-indicator">2 / 2</div>
            <h2 className="pv-title">输入验证码</h2>
            <p className="pv-sub">已发送至 {maskedPhone}</p>

            <div className="pv-mock-sms">
              <strong>模拟短信：</strong>验证码为 <strong>{sentCode}</strong>
              <br />
              <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                （实际上线后将通过真实短信发送）
              </span>
            </div>

            <input
              className="pv-input"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="6位验证码"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.replace(/\D/g, ''));
                setError('');
              }}
              disabled={verifying}
            />

            {error && <p className="pv-error">{error}</p>}

            <button
              className="pv-btn"
              onClick={verifyCode}
              disabled={verifying}
            >
              {verifying ? '验证中…' : '确认验证'}
            </button>

            <span
              className="pv-skip-link"
              onClick={() => {
                setCode('');
                setError('');
                setStep('phone');
              }}
            >
              重新发送
            </span>
          </>
        )}

        {step === 'done' && (
          <div className="pv-success">
            <div className="pv-success-icon">✓</div>
            <h2 className="pv-title">验证成功！</h2>
            <p className="pv-sub">佣金将在好友打卡满3天后解冻</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneVerify;
