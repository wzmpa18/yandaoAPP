import { useState, useEffect } from 'react';
import { getTodayViewed, getRecentViewed, getMostViewed, clearAllHistory, getHistoryStatistics } from '../lib/historyService';
import type { HistoryItem } from '../lib/historyService';

interface HistorySectionProps {
  title: string;
  items: HistoryItem[];
  onItemClick?: (item: HistoryItem) => void;
}

function HistorySection({ title, items, onItemClick }: HistorySectionProps) {
  if (items.length === 0) {
    return (
      <div className="history-section">
        <h3 className="section-title">{title}</h3>
        <p className="empty-message">暂无内容</p>
      </div>
    );
  }

  return (
    <div className="history-section">
      <h3 className="section-title">{title} ({items.length})</h3>
      <div className="history-list">
        {items.map((item) => (
          <div
            key={item.id}
            className="history-item"
            onClick={() => onItemClick?.(item)}
          >
            <div className="history-item-header">
              <span className="history-type badge">{item.type}</span>
              <span className="history-lang">{item.language}</span>
            </div>
            <h4 className="history-title">{item.title}</h4>
            <p className="history-content">{item.content}</p>
            <div className="history-footer">
              <span className="view-count">查看 {item.viewCount} 次</span>
              <span className="view-time">
                {new Date(item.viewedAt).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HistoryPage() {
  const [todayHistory, setTodayHistory] = useState<HistoryItem[]>([]);
  const [recentHistory, setRecentHistory] = useState<HistoryItem[]>([]);
  const [mostViewed, setMostViewed] = useState<HistoryItem[]>([]);
  const [stats, setStats] = useState({ totalItems: 0, todayCount: 0, favoriteCount: 0, mostViewedType: '' });

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    setTodayHistory(getTodayViewed());
    setRecentHistory(getRecentViewed(20));
    setMostViewed(getMostViewed(10));
    setStats(getHistoryStatistics());
  };

  const handleClearHistory = () => {
    if (confirm('确定要清除所有浏览记录吗？')) {
      clearAllHistory();
      loadHistory();
    }
  };

  const handleItemClick = (item: HistoryItem) => {
    console.log('Clicked history item:', item);
  };

  return (
    <div className="history-page">
      <div className="page-header">
        <h1>浏览历史</h1>
        <button className="clear-btn" onClick={handleClearHistory}>
          清除历史记录
        </button>
      </div>

      <div className="stats-card">
        <div className="stat-item">
          <span className="stat-value">{stats.totalItems}</span>
          <span className="stat-label">总浏览</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{stats.todayCount}</span>
          <span className="stat-label">今日浏览</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{stats.favoriteCount}</span>
          <span className="stat-label">收藏数</span>
        </div>
      </div>

      <HistorySection
        title="今日浏览"
        items={todayHistory}
        onItemClick={handleItemClick}
      />

      <HistorySection
        title="最近浏览"
        items={recentHistory.slice(0, 10)}
        onItemClick={handleItemClick}
      />

      <HistorySection
        title="最常查看"
        items={mostViewed}
        onItemClick={handleItemClick}
      />
    </div>
  );
}

export default HistoryPage;