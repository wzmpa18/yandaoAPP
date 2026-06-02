import React, { useState, useCallback, useRef, useEffect } from 'react';
import { FloatingBack } from './FloatingBack';

interface Phoneme {
  symbol: string;
  ipa: string;
  description: string;
  tonguePosition: string;
  mouthShape: string;
  tip: string;
}

interface WordAnalysis {
  word: string;
  phonemes: {
    text: string;
    ipa: string;
    correct: boolean;
    confidence: number;
    tip?: string;
  }[];
  stressIndex: number;
}

const PHONEME_DATA: Record<string, Phoneme> = {
  'sh': { symbol: 'sh', ipa: 'ʃ', description: '清腭擦音', tonguePosition: '舌面抬起靠近硬腭', mouthShape: '双唇前伸呈圆形', tip: '舌尖不要碰到牙齿' },
  'ch': { symbol: 'ch', ipa: 'tʃ', description: '清腭塞擦音', tonguePosition: '舌尖抵住硬腭', mouthShape: '双唇微张', tip: '发音短促有力' },
  'th': { symbol: 'th', ipa: 'θ', description: '清齿擦音', tonguePosition: '舌尖轻触上齿背', mouthShape: '牙齿微露', tip: '送气，声音很轻' },
  'th_v': { symbol: 'th', ipa: 'ð', description: '浊齿擦音', tonguePosition: '舌尖轻触上齿背', mouthShape: '牙齿微露', tip: '声带振动' },
  'r': { symbol: 'r', ipa: 'r', description: '浊卷舌音', tonguePosition: '舌尖卷起', mouthShape: '双唇突出', tip: '舌头不要太紧张' },
  'l': { symbol: 'l', ipa: 'l', description: '浊边音', tonguePosition: '舌尖抵住上齿龈', mouthShape: '口腔打开', tip: '气流从舌头两侧通过' },
  'v': { symbol: 'v', ipa: 'v', description: '浊唇齿擦音', tonguePosition: '自然', mouthShape: '上齿轻咬下唇', tip: '声带振动' },
  'w': { symbol: 'w', ipa: 'w', description: '圆唇软腭半元音', tonguePosition: '舌根抬起', mouthShape: '双唇突出呈圆形', tip: '快速滑向后面的元音' },
  'y': { symbol: 'y', ipa: 'j', description: '硬腭半元音', tonguePosition: '舌面抬起', mouthShape: '双唇微张', tip: '快速滑向后面的元音' },
};

const PRACTICE_WORDS = [
  { word: 'sheep', phonemes: ['sh', 'ee', 'p'], ipa: 'ʃiːp', meaning: '绵羊' },
  { word: 'chair', phonemes: ['ch', 'air'], ipa: 'tʃeər', meaning: '椅子' },
  { word: 'think', phonemes: ['th', 'i', 'nk'], ipa: 'θɪŋk', meaning: '思考' },
  { word: 'this', phonemes: ['th_v', 'i', 's'], ipa: 'ðɪs', meaning: '这个' },
  { word: 'rabbit', phonemes: ['r', 'a', 'b', 'b', 'i', 't'], ipa: 'ˈræbɪt', meaning: '兔子' },
  { word: 'love', phonemes: ['l', 'o', 'v'], ipa: 'lʌv', meaning: '爱' },
  { word: 'water', phonemes: ['w', 'a', 't', 'er'], ipa: 'ˈwɔːtər', meaning: '水' },
  { word: 'yellow', phonemes: ['y', 'e', 'll', 'o', 'w'], ipa: 'ˈjeləʊ', meaning: '黄色' },
];

function mockPhonemeAnalysis(word: string, userPronunciation: string): WordAnalysis {
  const practiceWord = PRACTICE_WORDS.find(w => w.word === word.toLowerCase());
  if (!practiceWord) {
    return {
      word,
      phonemes: [{ text: word, ipa: word, correct: true, confidence: 0.9 }],
      stressIndex: 0,
    };
  }

  const phonemes = practiceWord.phonemes.map((ph, idx) => {
    const userChar = userPronunciation.toLowerCase().charAt(idx);
    const isCorrect = Math.random() > 0.3;
    const phonemeData = PHONEME_DATA[ph];
    
    return {
      text: ph,
      ipa: phonemeData?.ipa || ph,
      correct: isCorrect,
      confidence: isCorrect ? 0.8 + Math.random() * 0.2 : 0.3 + Math.random() * 0.4,
      tip: !isCorrect && phonemeData ? phonemeData.tip : undefined,
    };
  });

  return {
    word: practiceWord.word,
    phonemes,
    stressIndex: practiceWord.word.indexOf('a') > 0 ? practiceWord.word.indexOf('a') : 0,
  };
}

export const PhonemeCoach: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedWord, setSelectedWord] = useState(PRACTICE_WORDS[0]);
  const [recording, setRecording] = useState(false);
  const [userPronunciation, setUserPronunciation] = useState('');
  const [analysis, setAnalysis] = useState<WordAnalysis | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startRecording = useCallback(() => {
    const SRClass = (window as Window & { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition
      || (window as Window & { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;

    if (!SRClass) {
      alert('此浏览器不支持语音识别，请使用 Chrome 或 Safari');
      return;
    }

    if (recording) {
      recognitionRef.current?.stop();
      return;
    }

    const rec = new SRClass();
    rec.lang = 'en-US';
    rec.continuous = false;
    rec.interimResults = true;

    rec.onstart = () => {
      setRecording(true);
      setUserPronunciation('');
    };

    rec.onresult = (e: SpeechRecognitionEvent) => {
      const transcript = Array.from(e.results).map((r) => r[0].transcript).join('');
      setUserPronunciation(transcript);
    };

    rec.onend = () => {
      setRecording(false);
      if (userPronunciation.trim()) {
        const result = mockPhonemeAnalysis(selectedWord.word, userPronunciation);
        setAnalysis(result);
        
        const correctCount = result.phonemes.filter(p => p.correct).length;
        const total = result.phonemes.length;
        setScore(Math.round((correctCount / total) * 100));
        setShowResult(true);
      }
    };

    recognitionRef.current = rec;
    rec.start();
  }, [recording, selectedWord.word, userPronunciation]);

  const nextWord = useCallback(() => {
    const currentIdx = PRACTICE_WORDS.findIndex(w => w.word === selectedWord.word);
    const nextIdx = (currentIdx + 1) % PRACTICE_WORDS.length;
    setSelectedWord(PRACTICE_WORDS[nextIdx]);
    setShowResult(false);
    setScore(null);
    setAnalysis(null);
    setUserPronunciation('');
  }, [selectedWord.word]);

  const getPhonemeInfo = (text: string): Phoneme | null => {
    return PHONEME_DATA[text] || PHONEME_DATA[text + '_v'] || null;
  };

  return (
    <div className="phoneme-coach">
      <FloatingBack onClick={onBack} />

      <div className="phoneme-header">
        <h1 className="phoneme-title">🎯 音素级纠音</h1>
        <p className="phoneme-sub">精准分析每个音节，给出舌位和嘴型建议</p>
      </div>

      <div className="word-selector">
        {PRACTICE_WORDS.map(word => (
          <button
            key={word.word}
            className={`word-btn ${selectedWord.word === word.word ? 'active' : ''}`}
            onClick={() => {
              setSelectedWord(word);
              setShowResult(false);
              setScore(null);
              setAnalysis(null);
            }}
          >
            {word.word}
          </button>
        ))}
      </div>

      <div className="practice-card">
        <div className="word-display">
          <span className="word-text">{selectedWord.word}</span>
          <span className="word-ipa">{selectedWord.ipa}</span>
        </div>
        <p className="word-meaning">{selectedWord.meaning}</p>

        <div className="phoneme-breakdown">
          <span className="breakdown-label">音节拆分：</span>
          {selectedWord.phonemes.map((ph, idx) => (
            <span key={idx} className="phoneme-chip">
              <span className="phoneme-text">{ph}</span>
              <span className="phoneme-ipa">{PHONEME_DATA[ph]?.ipa || ph}</span>
            </span>
          ))}
        </div>

        <button
          className={`record-btn ${recording ? 'recording' : ''}`}
          onClick={startRecording}
        >
          {recording ? (
            <div className="wave-animation">
              <span className="wave" />
              <span className="wave" />
              <span className="wave" />
            </div>
          ) : (
            '🎤 开始发音'
          )}
        </button>

        {recording && (
          <p className="recording-hint">请清晰读出单词：{selectedWord.word}</p>
        )}

        {userPronunciation && !recording && !showResult && (
          <p className="user-input">你说的是：{userPronunciation}</p>
        )}
      </div>

      {showResult && analysis && (
        <div className="result-section">
          <div className="score-display">
            <div className={`score-circle ${score !== null && score >= 80 ? 'excellent' : score !== null && score >= 60 ? 'good' : 'needs-work'}`}>
              {score !== null ? score : '--'}
            </div>
            <p className="score-label">发音得分</p>
            <p className="score-desc">
              {score !== null && score >= 80 ? '🎉 发音非常标准！' : 
               score !== null && score >= 60 ? '👍 不错，继续练习！' : 
               '💪 多练习几次会更好！'}
            </p>
          </div>

          <div className="phoneme-analysis">
            <h3 className="analysis-title">音节分析</h3>
            <div className="analysis-grid">
              {analysis.phonemes.map((ph, idx) => (
                <div 
                  key={idx} 
                  className={`analysis-item ${ph.correct ? 'correct' : 'incorrect'}`}
                >
                  <div className="analysis-phoneme">
                    <span className="analysis-text">{ph.text}</span>
                    <span className="analysis-ipa">[{ph.ipa}]</span>
                  </div>
                  <div className="analysis-indicator">
                    {ph.correct ? '✓' : '✗'}
                  </div>
                  <div className="analysis-confidence">
                    置信度: {Math.round(ph.confidence * 100)}%
                  </div>
                  {ph.tip && (
                    <div className="analysis-tip">
                      💡 {ph.tip}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {analysis.phonemes.some(p => !p.correct) && (
            <div className="correction-section">
              <h3 className="correction-title">🔍 改进建议</h3>
              {analysis.phonemes
                .filter(p => !p.correct)
                .map((ph, idx) => {
                  const info = getPhonemeInfo(ph.text);
                  return (
                    <div key={idx} className="correction-item">
                      <div className="correction-phoneme">
                        <span className="correction-symbol">{ph.text}</span>
                        <span className="correction-ipa">[{ph.ipa}]</span>
                        <span className="correction-desc">{info?.description}</span>
                      </div>
                      {info && (
                        <div className="correction-details">
                          <div className="detail-row">
                            <span className="detail-label">👅 舌位：</span>
                            <span className="detail-value">{info.tonguePosition}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">👄 嘴型：</span>
                            <span className="detail-value">{info.mouthShape}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">💡 提示：</span>
                            <span className="detail-value">{info.tip}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}

          <div className="result-actions">
            <button className="action-btn action-btn-secondary" onClick={startRecording}>
              🔄 再练一次
            </button>
            <button className="action-btn action-btn-primary" onClick={nextWord}>
              ➡️ 下一个单词
            </button>
          </div>
        </div>
      )}

      <div className="tips-section">
        <h3 className="tips-title">📌 发音小贴士</h3>
        <div className="tips-list">
          <div className="tip-item">
            <span className="tip-icon">🎧</span>
            <p>使用耳机可以更好地听到自己的发音</p>
          </div>
          <div className="tip-item">
            <span className="tip-icon">👀</span>
            <p>对着镜子练习，观察自己的嘴型</p>
          </div>
          <div className="tip-item">
            <span className="tip-icon">⏱️</span>
            <p>每个单词多练习几次，形成肌肉记忆</p>
          </div>
        </div>
      </div>
    </div>
  );
};