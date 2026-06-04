import { useState, useEffect } from 'react';
import { getAllFavorites, removeFromFavorites, clearAllFavorites } from '../lib/historyService';
import type { FavoriteItem } from '../lib/historyService';

interface FavoriteCardProps {
  item: FavoriteItem;
  onRemove: (contentId: string) => void;
  onClick: (item: FavoriteItem) => void;
}

function FavoriteCard({ item, onRemove, onClick }: FavoriteCardProps) {
  return (
    <div className="favorite-card" onClick={() => onClick(item)}>
      <div className="favorite-content">
        <div className="favorite-header">
          <span className="favorite-type badge">{item.type}</span>
          <span className="favorite-lang">{item.language}</span>
        </div>
        <h4 className="favorite-title">{item.title}</h4>
        <p className="favorite-content-text">{item.content}</p>
        <div className="favorite-footer">
          <span className="favorite-time">
            {new Date(item.favoritedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      <button
        className="remove-btn"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(item.contentId);
        }}
      >
        ✕
      </button>
    </div>
  );
}

export function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    setFavorites(getAllFavorites());
  };

  const handleRemove = (contentId: string) => {
    removeFromFavorites(contentId);
    loadFavorites();
  };

  const handleClearAll = () => {
    if (confirm('确定要清空所有收藏吗？')) {
      clearAllFavorites();
      loadFavorites();
    }
  };

  const handleItemClick = (item: FavoriteItem) => {
    // Navigate to content or display it
    const detailUrl = item.contentId ? `#/content/${encodeURIComponent(item.contentId)}` : null;
    if (detailUrl) {
      window.location.hash = detailUrl;
    }
    // Fallback: show as alert with title and content
    if (item.title) {
      alert(`${item.title}\n\n${item.content?.substring(0, 200) || ''}`);
    }
  };

  return (
    <div className="favorites-page">
      <div className="page-header">
        <h1>我的收藏</h1>
        {favorites.length > 0 && (
          <button className="clear-btn" onClick={handleClearAll}>
            清空收藏
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">❤️</div>
          <h2>暂无收藏</h2>
          <p>浏览内容时点击收藏按钮，将喜欢的内容保存到这里</p>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((item) => (
            <FavoriteCard
              key={item.id}
              item={item}
              onRemove={handleRemove}
              onClick={handleItemClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;