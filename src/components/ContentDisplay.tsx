import { useState, useEffect } from 'react';
import { generateJoke, generateRadioScript, generateGrammarQuestion, generateStory, generateNurseryRhyme, getInitialContent, type GeneratedContent } from '../content-generator';
import { supabaseDatabase } from '../data/supabase';

interface ContentDisplayProps {
  type: 'joke' | 'radio' | 'grammar' | 'story' | 'nursery_rhyme';
  language: string;
}

export const ContentDisplay = ({ type, language }: ContentDisplayProps) => {
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<GeneratedContent[]>([]);
  const [serverConnected, setServerConnected] = useState(false);

  const fetchFromServer = async (): Promise<GeneratedContent | null> => {
    try {
      const items = await supabaseDatabase.getItems(type, language, 20);
      if (items.length > 0) {
        const randomItem = items[Math.floor(Math.random() * items.length)];
        return {
          id: randomItem.id,
          type: randomItem.type as GeneratedContent['type'],
          language: randomItem.language,
          content: randomItem.content,
          title: randomItem.title,
          translation: randomItem.translation,
          level: randomItem.level,
          age_group: randomItem.age_group,
          templateId: 'server',
          variablesUsed: {},
          isAI: randomItem.source === 'ai',
          timestamp: randomItem.created_at,
        };
      }
    } catch {
      // Silent fallback to local content
    }
    return null;
  };

  const generateContent = async () => {
    setLoading(true);
    let newContent: GeneratedContent;
    
    const serverContent = await fetchFromServer();
    
    if (serverContent) {
      setServerConnected(true);
      newContent = serverContent;
    } else {
      setServerConnected(false);
      newContent = await generateContentByType();
    }
    
    setContent(newContent);
    setHistory(prev => [newContent, ...prev].slice(0, 20));
    setLoading(false);
  };

  const generateContentByType = async (): Promise<GeneratedContent> => {
    switch (type) {
      case 'joke':
        return await generateJoke(language);
      case 'radio':
        return await generateRadioScript(language);
      case 'grammar':
        return await generateGrammarQuestion(language);
      case 'story':
        return await generateStory(language);
      case 'nursery_rhyme':
        return await generateNurseryRhyme(language);
      default:
        return await generateJoke(language);
    }
  };

  useEffect(() => {
    generateContent();
  }, [type, language]);

  const getTypeLabel = () => {
    switch (type) {
      case 'joke': return '🎭 笑话';
      case 'radio': return '🎙️ 电台';
      case 'grammar': return '📝 语法练习';
      case 'story': return '📚 故事';
      case 'nursery_rhyme': return '🎵 儿歌';
      default: return '内容';
    }
  };

  const getLanguageLabel = () => {
    const langMap: Record<string, string> = {
      en: '英语',
      ja: '日语',
      ko: '韩语',
      fr: '法语',
      es: '西班牙语',
      de: '德语',
    };
    return langMap[language] || language;
  };

  return (
    <div className="content-display">
      <div className="content-header">
        <div className="header-info">
          <h2 className="content-title">{getTypeLabel()} - {getLanguageLabel()}</h2>
          <span className={`server-status ${serverConnected ? 'connected' : 'disconnected'}`}>
            {serverConnected ? '🌐 云端' : '📦 本地'}
          </span>
        </div>
        <button className="refresh-btn" onClick={() => generateContent()} disabled={loading}>
          {loading ? '生成中...' : '🔄 换一个'}
        </button>
      </div>

      {content && (
        <div className="content-card">
          {content.title && <h3 className="content-title-small">{content.title}</h3>}
          <p className="content-text">{content.content}</p>
          {content.translation && (
            <p className="content-translation">{content.translation}</p>
          )}
          <div className="content-meta">
            {content.level && (
              <span className="level-badge">
                📊 {content.level}
              </span>
            )}
            {content.age_group && (
              <span className="age-badge">
                👥 {content.age_group === 'kids' ? '儿童' : content.age_group === 'teenagers' ? '青少年' : '成人'}
              </span>
            )}
            <span className={`source-badge ${content.isAI ? 'ai' : 'template'}`}>
              {content.isAI ? '🤖 AI生成' : content.templateId === 'preloaded' ? '📦 预置内容' : '📋 模板组合'}
            </span>
            <span className="time-badge">
              {new Date(content.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      )}

      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>正在加载内容...</p>
        </div>
      )}

      {history.length > 0 && (
        <div className="history-section">
          <h3 className="history-title">历史记录</h3>
          <div className="history-list">
            {history.slice(1).map((item) => (
              <div key={item.id} className="history-item" onClick={() => setContent(item)}>
                <p className="history-text">{item.content.slice(0, 50)}{item.content.length > 50 ? '...' : ''}</p>
                <span className={`mini-badge ${item.isAI ? 'ai' : item.templateId === 'preloaded' ? 'preloaded' : 'template'}`}>
                  {item.isAI ? 'AI' : item.templateId === 'preloaded' ? 'P' : 'T'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};