import type { GeneratedContent } from '../content-generator/ContentGenerator';

export interface HistoryItem {
  id: string;
  contentId: string;
  type: string;
  language: string;
  title: string;
  content: string;
  viewedAt: number;
  viewCount: number;
}

export interface FavoriteItem {
  id: string;
  contentId: string;
  type: string;
  language: string;
  title: string;
  content: string;
  favoritedAt: number;
}

const STORAGE_KEY_HISTORY = 'yd_user_history';
const STORAGE_KEY_FAVORITES = 'yd_user_favorites';

class HistoryService {
  private history: HistoryItem[] = [];
  private favorites: FavoriteItem[] = [];
  private maxHistorySize = 100;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const historyData = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (historyData) {
        this.history = JSON.parse(historyData);
      }

      const favoritesData = localStorage.getItem(STORAGE_KEY_FAVORITES);
      if (favoritesData) {
        this.favorites = JSON.parse(favoritesData);
      }
    } catch (e) {
      console.warn('Failed to load from localStorage:', e);
      this.history = [];
      this.favorites = [];
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(this.history));
      localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(this.favorites));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }

  public addToHistory(content: GeneratedContent): void {
    const existingIndex = this.history.findIndex(h => h.contentId === content.id);
    
    if (existingIndex >= 0) {
      this.history[existingIndex].viewedAt = Date.now();
      this.history[existingIndex].viewCount++;
      this.history.splice(existingIndex, 1);
    } else {
      const item: HistoryItem = {
        id: `hist_${Date.now()}`,
        contentId: content.id,
        type: content.type,
        language: content.language,
        title: content.title || `Content ${content.type}`,
        content: content.content.substring(0, 100) + (content.content.length > 100 ? '...' : ''),
        viewedAt: Date.now(),
        viewCount: 1,
      };
      this.history.unshift(item);
    }

    if (this.history.length > this.maxHistorySize) {
      this.history = this.history.slice(0, this.maxHistorySize);
    }

    this.saveToStorage();
  }

  public getTodayHistory(): HistoryItem[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today.getTime();

    return this.history.filter(h => h.viewedAt >= todayStart);
  }

  public getRecentHistory(count: number = 20): HistoryItem[] {
    return this.history.slice(0, count);
  }

  public getMostViewed(count: number = 10): HistoryItem[] {
    return [...this.history]
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, count);
  }

  public clearHistory(): void {
    this.history = [];
    this.saveToStorage();
  }

  public addFavorite(content: GeneratedContent): void {
    const existing = this.favorites.find(f => f.contentId === content.id);
    if (existing) return;

    const item: FavoriteItem = {
      id: `fav_${Date.now()}`,
      contentId: content.id,
      type: content.type,
      language: content.language,
      title: content.title || `Content ${content.type}`,
      content: content.content.substring(0, 100) + (content.content.length > 100 ? '...' : ''),
      favoritedAt: Date.now(),
    };

    this.favorites.unshift(item);
    this.saveToStorage();
  }

  public removeFavorite(contentId: string): void {
    this.favorites = this.favorites.filter(f => f.contentId !== contentId);
    this.saveToStorage();
  }

  public isFavorite(contentId: string): boolean {
    return this.favorites.some(f => f.contentId === contentId);
  }

  public getFavorites(): FavoriteItem[] {
    return [...this.favorites];
  }

  public clearFavorites(): void {
    this.favorites = [];
    this.saveToStorage();
  }

  public getHistoryStats(): {
    totalItems: number;
    todayCount: number;
    favoriteCount: number;
    mostViewedType: string;
  } {
    const todayCount = this.getTodayHistory().length;
    
    const typeCounts: Record<string, number> = {};
    this.history.forEach(h => {
      typeCounts[h.type] = (typeCounts[h.type] || 0) + 1;
    });
    
    const mostViewedType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'none';

    return {
      totalItems: this.history.length,
      todayCount,
      favoriteCount: this.favorites.length,
      mostViewedType,
    };
  }
}

export const historyService = new HistoryService();

export function trackView(content: GeneratedContent): void {
  historyService.addToHistory(content);
}

export function getTodayViewed(): HistoryItem[] {
  return historyService.getTodayHistory();
}

export function getRecentViewed(count?: number): HistoryItem[] {
  return historyService.getRecentHistory(count);
}

export function getMostViewed(count?: number): HistoryItem[] {
  return historyService.getMostViewed(count);
}

export function clearAllHistory(): void {
  historyService.clearHistory();
}

export function addToFavorites(content: GeneratedContent): void {
  historyService.addFavorite(content);
}

export function removeFromFavorites(contentId: string): void {
  historyService.removeFavorite(contentId);
}

export function checkFavorite(contentId: string): boolean {
  return historyService.isFavorite(contentId);
}

export function getAllFavorites(): FavoriteItem[] {
  return historyService.getFavorites();
}

export function clearAllFavorites(): void {
  historyService.clearFavorites();
}

export function getHistoryStatistics(): {
  totalItems: number;
  todayCount: number;
  favoriteCount: number;
  mostViewedType: string;
} {
  return historyService.getHistoryStats();
}