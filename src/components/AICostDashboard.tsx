import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../data/supabase';

interface CostConfig {
  price_per_1m_input_usd: number;
  price_per_1m_output_usd: number;
  daily_budget_usd: number;
  alert_threshold_pct: number;
  fallback_on_exceed: boolean;
}

interface DayStat {
  date: string;       // YYYY-MM-DD
  calls: number;
  cost_usd: number;
  mock_calls: number;
}

interface PeriodStat {
  calls: number;
  cost_usd: number;
  mock_calls: number;
}

const DEFAULT_CFG: CostConfig = {
  price_per_1m_input_usd: 5.0,
  price_per_1m_output_usd: 15.0,
  daily_budget_usd: 10.0,
  alert_threshold_pct: 80,
  fallback_on_exceed: true,
};

function fmtUsd(n: number): string {
  return n < 0.01 ? `$${n.toFixed(6)}` : `$${n.toFixed(4)}`;
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export const AICostDashboard: React.FC = () => {
  const [cfg, setCfg] = useState<CostConfig>(DEFAULT_CFG);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [todayStat, setTodayStat] = useState<PeriodStat>({ calls: 0, cost_usd: 0, mock_calls: 0 });
  const [weekStat, setWeekStat] = useState<PeriodStat>({ calls: 0, cost_usd: 0, mock_calls: 0 });
  const [monthStat, setMonthStat] = useState<PeriodStat>({ calls: 0, cost_usd: 0, mock_calls: 0 });
  const [trend, setTrend] = useState<DayStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [overBudget, setOverBudget] = useState(false);
  const [nearAlert, setNearAlert] = useState(false);

  const loadConfig = useCallback(async () => {
    const { data } = await supabase
      .from('ai_cost_config')
      .select('*')
      .eq('id', 1)
      .maybeSingle();
    if (data) setCfg(data as CostConfig);
  }, []);

  const loadStats = useCallback(async () => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6).toISOString();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const trendStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6).toISOString();

    const [todayRes, weekRes, monthRes, trendRes] = await Promise.all([
      supabase.from('ai_call_logs').select('cost_usd, is_mock').gte('created_at', todayStart),
      supabase.from('ai_call_logs').select('cost_usd, is_mock').gte('created_at', weekStart),
      supabase.from('ai_call_logs').select('cost_usd, is_mock').gte('created_at', monthStart),
      supabase.from('ai_call_logs').select('cost_usd, is_mock, created_at').gte('created_at', trendStart).order('created_at'),
    ]);

    function aggregate(rows: Array<{ cost_usd: number; is_mock: boolean }>): PeriodStat {
      return rows.reduce(
        (acc, r) => ({ calls: acc.calls + 1, cost_usd: acc.cost_usd + Number(r.cost_usd), mock_calls: acc.mock_calls + (r.is_mock ? 1 : 0) }),
        { calls: 0, cost_usd: 0, mock_calls: 0 },
      );
    }

    const td = aggregate((todayRes.data ?? []) as Array<{ cost_usd: number; is_mock: boolean }>);
    setTodayStat(td);
    setWeekStat(aggregate((weekRes.data ?? []) as Array<{ cost_usd: number; is_mock: boolean }>));
    setMonthStat(aggregate((monthRes.data ?? []) as Array<{ cost_usd: number; is_mock: boolean }>));

    // Build 7-day trend
    const dayMap: Record<string, DayStat> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      dayMap[key] = { date: key, calls: 0, cost_usd: 0, mock_calls: 0 };
    }
    for (const r of (trendRes.data ?? []) as Array<{ cost_usd: number; is_mock: boolean; created_at: string }>) {
      const key = r.created_at.slice(0, 10);
      if (dayMap[key]) {
        dayMap[key].calls += 1;
        dayMap[key].cost_usd += Number(r.cost_usd);
        dayMap[key].mock_calls += r.is_mock ? 1 : 0;
      }
    }
    setTrend(Object.values(dayMap));

    setLoading(false);
    return td;
  }, []);

  useEffect(() => {
    Promise.all([loadConfig(), loadStats()]);
  }, [loadConfig, loadStats]);

  useEffect(() => {
    const todayCost = todayStat.cost_usd;
    setOverBudget(todayCost >= cfg.daily_budget_usd && cfg.daily_budget_usd > 0);
    setNearAlert(todayCost >= (cfg.daily_budget_usd * cfg.alert_threshold_pct) / 100 && cfg.daily_budget_usd > 0 && !overBudget);
  }, [todayStat, cfg, overBudget]);

  async function saveCfg() {
    setSaving(true);
    await supabase.from('ai_cost_config').update({ ...cfg, updated_at: new Date().toISOString() }).eq('id', 1);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const maxCost = Math.max(...trend.map((d) => d.cost_usd), 0.0001);
  const maxCalls = Math.max(...trend.map((d) => d.calls), 1);
  const todayPct = cfg.daily_budget_usd > 0 ? Math.min((todayStat.cost_usd / cfg.daily_budget_usd) * 100, 100) : 0;

  return (
    <div className="aicost-wrap">
      {/* Header */}
      <div className="aicost-header">
        <div className="aicost-header-icon">⚡</div>
        <div>
          <h3 className="aicost-title">AI 调用成本看板</h3>
          <p className="aicost-sub">实时追踪 · 预算管控 · 自动降级</p>
        </div>
      </div>

      {/* Alert banners */}
      {overBudget && (
        <div className="aicost-alert danger">
          <span className="aicost-alert-icon">🚨</span>
          <div>
            <strong>已超出今日预算</strong>
            <span>AI 调用已自动降级为模拟回复，保护成本安全</span>
          </div>
        </div>
      )}
      {nearAlert && !overBudget && (
        <div className="aicost-alert warning">
          <span className="aicost-alert-icon">⚠️</span>
          <div>
            <strong>接近预算告警线（{cfg.alert_threshold_pct}%）</strong>
            <span>今日已消耗 {fmtUsd(todayStat.cost_usd)} / {fmtUsd(cfg.daily_budget_usd)}</span>
          </div>
        </div>
      )}

      {/* Period stats */}
      {loading ? (
        <div className="aicost-loading">加载中…</div>
      ) : (
        <>
          <div className="aicost-stats-row">
            <div className="aicost-stat-card today">
              <span className="aicost-stat-period">今日</span>
              <span className="aicost-stat-calls">{todayStat.calls.toLocaleString()} 次</span>
              <span className="aicost-stat-cost">{fmtUsd(todayStat.cost_usd)}</span>
              {todayStat.mock_calls > 0 && (
                <span className="aicost-stat-mock">{todayStat.mock_calls} 次模拟</span>
              )}
            </div>
            <div className="aicost-stat-card week">
              <span className="aicost-stat-period">本周</span>
              <span className="aicost-stat-calls">{weekStat.calls.toLocaleString()} 次</span>
              <span className="aicost-stat-cost">{fmtUsd(weekStat.cost_usd)}</span>
            </div>
            <div className="aicost-stat-card month">
              <span className="aicost-stat-period">本月</span>
              <span className="aicost-stat-calls">{monthStat.calls.toLocaleString()} 次</span>
              <span className="aicost-stat-cost">{fmtUsd(monthStat.cost_usd)}</span>
            </div>
          </div>

          {/* Daily budget gauge */}
          <div className="aicost-budget-gauge">
            <div className="aicost-gauge-labels">
              <span>今日预算进度</span>
              <span>{todayPct.toFixed(1)}% · {fmtUsd(todayStat.cost_usd)} / {fmtUsd(cfg.daily_budget_usd)}</span>
            </div>
            <div className="aicost-gauge-track">
              <div
                className={`aicost-gauge-fill ${overBudget ? 'danger' : nearAlert ? 'warning' : 'ok'}`}
                style={{ width: `${todayPct}%` }}
              />
              {cfg.alert_threshold_pct < 100 && (
                <div
                  className="aicost-gauge-threshold"
                  style={{ left: `${cfg.alert_threshold_pct}%` }}
                  title={`告警线 ${cfg.alert_threshold_pct}%`}
                />
              )}
            </div>
          </div>

          {/* 7-day trend chart */}
          <div className="aicost-trend">
            <div className="aicost-trend-title">近 7 天调用趋势</div>
            <div className="aicost-chart">
              {trend.map((d) => (
                <div key={d.date} className="aicost-chart-col">
                  <div className="aicost-chart-bars">
                    {/* Cost bar */}
                    <div
                      className="aicost-bar cost-bar"
                      style={{ height: `${(d.cost_usd / maxCost) * 80}px` }}
                      title={fmtUsd(d.cost_usd)}
                    />
                    {/* Calls bar */}
                    <div
                      className="aicost-bar calls-bar"
                      style={{ height: `${(d.calls / maxCalls) * 80}px` }}
                      title={`${d.calls} 次`}
                    />
                  </div>
                  <span className="aicost-chart-label">{fmtDate(d.date)}</span>
                  <span className="aicost-chart-val">{d.calls}</span>
                </div>
              ))}
            </div>
            <div className="aicost-chart-legend">
              <span className="aicost-legend-dot cost" />费用
              <span className="aicost-legend-dot calls" />调用次数
            </div>
          </div>
        </>
      )}

      {/* Config panel */}
      <div className="aicost-config">
        <div className="aicost-config-title">价格 &amp; 预算配置</div>

        <div className="aicost-config-row">
          <label className="aicost-config-label">输入 Token 价格（每百万）</label>
          <div className="aicost-input-wrap">
            <span className="aicost-input-prefix">$</span>
            <input
              type="number" min="0" step="0.5" className="aicost-num-input"
              value={cfg.price_per_1m_input_usd}
              onChange={(e) => setCfg((c) => ({ ...c, price_per_1m_input_usd: parseFloat(e.target.value) || 0 }))}
            />
          </div>
        </div>

        <div className="aicost-config-row">
          <label className="aicost-config-label">输出 Token 价格（每百万）</label>
          <div className="aicost-input-wrap">
            <span className="aicost-input-prefix">$</span>
            <input
              type="number" min="0" step="0.5" className="aicost-num-input"
              value={cfg.price_per_1m_output_usd}
              onChange={(e) => setCfg((c) => ({ ...c, price_per_1m_output_usd: parseFloat(e.target.value) || 0 }))}
            />
          </div>
        </div>

        <div className="aicost-config-row">
          <label className="aicost-config-label">每日预算上限</label>
          <div className="aicost-input-wrap">
            <span className="aicost-input-prefix">$</span>
            <input
              type="number" min="0.1" step="1" className="aicost-num-input"
              value={cfg.daily_budget_usd}
              onChange={(e) => setCfg((c) => ({ ...c, daily_budget_usd: parseFloat(e.target.value) || 1 }))}
            />
          </div>
        </div>

        <div className="aicost-config-row">
          <label className="aicost-config-label">告警阈值（占预算 %）</label>
          <div className="aicost-slider-wrap">
            <span className="aicost-slider-val">{cfg.alert_threshold_pct}%</span>
            <input
              type="range" min="10" max="99" step="5" className="aicost-slider"
              value={cfg.alert_threshold_pct}
              onChange={(e) => setCfg((c) => ({ ...c, alert_threshold_pct: parseInt(e.target.value) }))}
            />
            <div className="aicost-slider-labels"><span>10%</span><span>99%</span></div>
          </div>
        </div>

        <div className="aicost-config-row aicost-toggle-row">
          <label className="aicost-config-label">
            超预算自动降级为模拟回复
            <span className="aicost-config-hint">关闭后仍会提示但不阻断</span>
          </label>
          <label className="admin-toggle">
            <input
              type="checkbox" checked={cfg.fallback_on_exceed}
              onChange={(e) => setCfg((c) => ({ ...c, fallback_on_exceed: e.target.checked }))}
            />
            <span className="admin-toggle-track" />
          </label>
        </div>

        <button className="aicost-save-btn" onClick={saveCfg} disabled={saving}>
          {saved ? '已保存 ✓' : saving ? '保存中…' : '保存配置'}
        </button>
      </div>
    </div>
  );
};

/** Log an AI call to the database. Call this from AIAssistant whenever a response is generated. */
export async function logAICall(params: {
  sessionKey: string;
  callType: 'chat' | 'text' | 'voice' | 'camera';
  langCode: string;
  model?: string;
  inputTokens?: number;
  outputTokens?: number;
  isMock?: boolean;
}) {
  const { data: cfgData } = await supabase
    .from('ai_cost_config')
    .select('price_per_1m_input_usd, price_per_1m_output_usd')
    .eq('id', 1)
    .maybeSingle();

  const inputPrice = cfgData?.price_per_1m_input_usd ?? 5.0;
  const outputPrice = cfgData?.price_per_1m_output_usd ?? 15.0;
  const inputToks = params.inputTokens ?? 0;
  const outputToks = params.outputTokens ?? 0;
  const costUsd = (inputToks / 1_000_000) * inputPrice + (outputToks / 1_000_000) * outputPrice;

  await supabase.from('ai_call_logs').insert({
    session_key: params.sessionKey,
    call_type: params.callType,
    lang_code: params.langCode,
    model: params.model ?? 'simulated',
    input_tokens: inputToks,
    output_tokens: outputToks,
    cost_usd: costUsd,
    is_mock: params.isMock ?? true,
  });
}

/** Returns true if today's spend has exceeded the configured daily budget. */
export async function isOverBudget(): Promise<boolean> {
  const { data: cfg } = await supabase
    .from('ai_cost_config')
    .select('daily_budget_usd, fallback_on_exceed')
    .eq('id', 1)
    .maybeSingle();

  if (!cfg || !cfg.fallback_on_exceed || cfg.daily_budget_usd <= 0) return false;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const { data: rows } = await supabase
    .from('ai_call_logs')
    .select('cost_usd')
    .gte('created_at', todayStart.toISOString());

  const total = (rows ?? []).reduce((s: number, r: { cost_usd: number }) => s + Number(r.cost_usd), 0);
  return total >= cfg.daily_budget_usd;
}
