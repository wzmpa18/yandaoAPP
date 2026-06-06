import React, { useMemo, useState } from 'react';
import { getLearningStats } from '../lib/AIMonitor';

interface AILearningReportProps {
  onClose: () => void;
}

const AREA_COLORS: Record<string, string> = {
  vocabulary: '#5B8FA8',
  grammar: '#7A9B71',
  reading: '#C9A574',
  speaking: '#C9553D',
  listening: '#8B5CF6',
  writing: '#E05580',
};

const AREA_ZH: Record<string, string> = {
  vocabulary: '词汇', grammar: '语法', reading: '阅读',
  speaking: '口语', listening: '听力', writing: '写作',
};

export const AILearningReport: React.FC<AILearningReportProps> = ({ onClose }) => {
  const [stats] = useState(() => getLearningStats());

  const areas = useMemo(() => {
    return Object.entries(AREA_ZH).map(([key, label]) => {
      const areaData = stats.recentEvents.filter(e => {
        const map: Record<string, string> = {
          quiz: 'vocabulary', game: 'vocabulary', reading: 'reading',
          grammar: 'grammar', voice: 'speaking', chat: 'speaking',
          exam: 'vocabulary', vocab: 'vocabulary',
        };
        return map[e.type] === key;
      });
      return { key, label, count: areaData.length, maxCount: 10 };
    });
  }, [stats]);

  const maxCount = Math.max(1, ...areas.map(a => a.count));

  return (
    <div className="alr-overlay" onClick={onClose}>
      <div className="alr-panel" onClick={(e) => e.stopPropagation()}>
        <div className="alr-header">
          <div className="alr-header-icon">🤖</div>
          <h3>AI 学习报告</h3>
          <p style={{ fontSize: 13, color: '#999', margin: '4px 0 0' }}>近7天数据</p>
        </div>

        <div className="alr-stats">
          <div className="alr-stat">
            <span className="alr-stat-val">{Math.round(stats.totalMinutes)}</span>
            <span className="alr-stat-label">学习时长(分)</span>
          </div>
          <div className="alr-stat">
            <span className="alr-stat-val">{stats.totalQuizzes}</span>
            <span className="alr-stat-label">做题数量</span>
          </div>
          <div className="alr-stat">
            <span className="alr-stat-val">{stats.totalGames}</span>
            <span className="alr-stat-label">游戏次数</span>
          </div>
          <div className="alr-stat">
            <span className="alr-stat-val">{stats.weeklyXP}</span>
            <span className="alr-stat-label">本周XP</span>
          </div>
        </div>

        <div className="alr-areas">
          <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>各领域练习统计</h4>
          {areas.map(a => (
            <div className="alr-area" key={a.key}>
              <span>{a.label}</span>
              <div className="alr-area-bar">
                <div
                  className="alr-area-fill"
                  style={{
                    width: `${(a.count / maxCount) * 100}%`,
                    background: AREA_COLORS[a.key] || '#5B8FA8',
                  }}
                />
              </div>
              <span style={{ fontSize: 12, color: '#999' }}>{a.count}次</span>
            </div>
          ))}
          <p style={{ fontSize: 12, color: '#999', marginTop: 8, textAlign: 'center' }}>
            💪 强项: {AREA_ZH[stats.strongestArea]} · 📈 待提升: {AREA_ZH[stats.weakestArea]}
          </p>
        </div>

        {stats.suggestedPath.length > 0 && (
          <div className="alr-suggestions">
            <h4>💡 AI 学习建议</h4>
            {stats.suggestedPath.map((s, i) => (
              <div className="alr-suggestion" key={i}>{s}</div>
            ))}
          </div>
        )}

        {stats.recentEvents.length === 0 && (
          <div style={{ padding: '20px', textAlign: 'center', color: '#999', fontSize: 14 }}>
            暂无学习数据。开始学习后，AI将为你生成个性化报告！
          </div>
        )}

        <button className="alr-close-btn" onClick={onClose}>我知道了</button>
      </div>
    </div>
  );
};
