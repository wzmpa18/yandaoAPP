import React, { useState, useEffect, useCallback, useRef } from 'react';
import { InfiniteGameGenerator } from '../../lib/InfiniteGameGenerator';

interface SentenceBuilderProps {
  langCode: string;
  langName?: string;
  onXP: (delta: number) => void;
  onHeartLost: () => void;
  onBack: () => void;
}

interface Question {
  id: number;
  words: string[];
  correct: string;
  translation: string;
}

const FALLBACK_QUESTIONS: Record<string, Question[]> = {
  ja: [
    { id: 1, words: ['私', 'は', '学生', 'です'], correct: '私は学生です', translation: '我是学生' },
    { id: 2, words: ['今日', 'は', 'いい', '天気', 'です'], correct: '今日はいい天気です', translation: '今天天气很好' },
    { id: 3, words: ['猫', 'が', '好き', 'です'], correct: '猫が好きです', translation: '我喜欢猫' },
    { id: 4, words: ['図書館', 'で', '本', 'を', '読みます'], correct: '図書館で本を読みます', translation: '在图书馆看书' },
  ],
  en: [
    { id: 1, words: ['I', 'am', 'a', 'student'], correct: 'I am a student', translation: '我是学生' },
    { id: 2, words: ['The', 'weather', 'is', 'nice', 'today'], correct: 'The weather is nice today', translation: '今天天气很好' },
    { id: 3, words: ['I', 'like', 'cats'], correct: 'I like cats', translation: '我喜欢猫' },
    { id: 4, words: ['I', 'read', 'books', 'at', 'the', 'library'], correct: 'I read books at the library', translation: '我在图书馆看书' },
  ],
  ko: [
    { id: 1, words: ['저는', '학생', '입니다'], correct: '저는 학생입니다', translation: '我是学生' },
    { id: 2, words: ['오늘', '날씨가', '좋습니다'], correct: '오늘 날씨가 좋습니다', translation: '今天天气很好' },
    { id: 3, words: ['고양이를', '좋아합니다'], correct: '고양이를 좋아합니다', translation: '我喜欢猫' },
  ],
  fr: [
    { id: 1, words: ['Je', 'suis', 'étudiant'], correct: 'Je suis étudiant', translation: '我是学生' },
    { id: 2, words: ['Il', 'fait', 'beau', "aujourd'hui"], correct: "Il fait beau aujourd'hui", translation: '今天天气很好' },
    { id: 3, words: ["J'aime", 'les', 'chats'], correct: "J'aime les chats", translation: '我喜欢猫' },
  ],
  es: [
    { id: 1, words: ['Yo', 'soy', 'estudiante'], correct: 'Yo soy estudiante', translation: '我是学生' },
    { id: 2, words: ['Hace', 'buen', 'tiempo', 'hoy'], correct: 'Hace buen tiempo hoy', translation: '今天天气很好' },
    { id: 3, words: ['Me', 'gustan', 'los', 'gatos'], correct: 'Me gustan los gatos', translation: '我喜欢猫' },
  ],
  de: [
    { id: 1, words: ['Ich', 'bin', 'Student'], correct: 'Ich bin Student', translation: '我是学生' },
    { id: 2, words: ['Heute', 'ist', 'schönes', 'Wetter'], correct: 'Heute ist schönes Wetter', translation: '今天天气很好' },
  ],
  it: [
    { id: 1, words: ['Io', 'sono', 'studente'], correct: 'Io sono studente', translation: '我是学生' },
    { id: 2, words: ['Oggi', 'fa', 'bel', 'tempo'], correct: 'Oggi fa bel tempo', translation: '今天天气很好' },
  ],
  pt: [
    { id: 1, words: ['Eu', 'sou', 'estudante'], correct: 'Eu sou estudante', translation: '我是学生' },
    { id: 2, words: ['Hoje', 'está', 'bom', 'tempo'], correct: 'Hoje está bom tempo', translation: '今天天气很好' },
  ],
};

export const SentenceBuilder: React.FC<SentenceBuilderProps> = ({ langCode, langName = '', onXP, onHeartLost, onBack }) => {
  const allQ = FALLBACK_QUESTIONS[langCode] || FALLBACK_QUESTIONS.en;
  const [level, setLevel] = useState(1);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [totalQ, setTotalQ] = useState(0);
  const [correctQ, setCorrectQ] = useState(0);

  const currentQ = allQ[qIndex % allQ.length];

  useEffect(() => {
    loadQuestion();
  }, [qIndex, level]);

  const loadQuestion = () => {
    const q = allQ[qIndex % allQ.length];
    setAvailableWords([...q.words].sort(() => Math.random() - 0.5));
    setSelectedWords([]);
    setAnswered(false);
    setIsCorrect(false);
  };

  const handleSelectWord = (word: string, index: number) => {
    if (answered) return;
    setSelectedWords(prev => [...prev, word]);
    setAvailableWords(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveWord = (index: number) => {
    if (answered) return;
    setAvailableWords(prev => [...prev, selectedWords[index]]);
    setSelectedWords(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (selectedWords.length === 0) return;
    const userSentence = selectedWords.join('');
    const correctSentence = currentQ.correct.replace(/\s/g, '');
    const isOK = userSentence === correctSentence;

    setIsCorrect(isOK);
    setAnswered(true);
    setTotalQ(t => t + 1);

    if (isOK) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      const earned = 15 + newCombo * 5;
      setScore(s => s + earned);
      setCorrectQ(c => c + 1);
      onXP(earned);
    } else {
      setCombo(0);
      onHeartLost();
    }
  };

  const nextQuestion = () => {
    if (totalQ >= level * 4) {
      setGameOver(true);
      return;
    }
    setQIndex(i => i + 1);
  };

  const resetGame = () => {
    setLevel(1);
    setQIndex(0);
    setScore(0);
    setCombo(0);
    setTotalQ(0);
    setCorrectQ(0);
    setGameOver(false);
    setAnswered(false);
  };

  if (gameOver) {
    const accuracy = totalQ > 0 ? Math.round((correctQ / totalQ) * 100) : 0;
    return (
      <div className="sb-wrap">
        <div className="sb-gameover">
          <h2>🏆 本轮结束！</h2>
          <p>第 {level} 关完成</p>
          <p>正确率: {accuracy}% ({correctQ}/{totalQ})</p>
          <p>得分: {score}</p>
          <div className="sb-go-btns">
            <button className="sb-restart-btn" onClick={resetGame}>🔄 再来一轮</button>
            <button className="sb-back-btn" onClick={onBack}>🏠 返回大厅</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sb-wrap">
      <div className="sb-header">
        <button className="sb-back" onClick={onBack}>← 返回</button>
        <div className="sb-stats">
          <span>⚡ Lv.{level}</span>
          <span>⭐ {score}分</span>
          <span>📝 {totalQ}/{level * 4}</span>
          {combo > 0 && <span className="sb-combo">🔥 {combo}连击</span>}
        </div>
      </div>

      <div className="sb-game-area">
        <h3 className="sb-title">句子构建器 · Sentence Builder</h3>
        <p className="sb-translation">翻译：{currentQ.translation}</p>

        {/* Built sentence area */}
        <div className="sb-built-area">
          {selectedWords.length === 0 && !answered && (
            <span className="sb-placeholder">点击下方单词拼出正确的句子...</span>
          )}
          {selectedWords.map((word, i) => (
            <button
              key={`sel-${i}`}
              className={`sb-word-chip selected ${answered ? (isCorrect ? 'correct' : 'wrong') : ''}`}
              onClick={() => handleRemoveWord(i)}
              disabled={answered}
            >
              {word}
            </button>
          ))}
          {answered && !isCorrect && (
            <div className="sb-correct-answer">
              正确答案：<strong>{currentQ.correct}</strong>
            </div>
          )}
        </div>

        {/* Available words */}
        <div className="sb-words-area">
          <p className="sb-words-label">可用单词：</p>
          <div className="sb-words-list">
            {availableWords.map((word, i) => (
              <button
                key={`av-${i}`}
                className="sb-word-chip available"
                onClick={() => handleSelectWord(word, i)}
                disabled={answered}
              >
                {word}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="sb-actions">
          {!answered ? (
            <button
              className="sb-submit-btn"
              onClick={handleSubmit}
              disabled={selectedWords.length === 0}
            >
              ✓ 提交答案
            </button>
          ) : (
            <button className="sb-next-btn" onClick={nextQuestion}>
              ▶ 下一题
            </button>
          )}
          <button className="sb-reset-btn-small" onClick={loadQuestion} disabled={answered}>
            🔄 重置
          </button>
        </div>

        {answered && (
          <div className={`sb-feedback ${isCorrect ? 'correct' : 'wrong'}`}>
            {isCorrect ? '✅ 正确！' + (combo > 1 ? ` ${combo}连击!` : '') : `❌ 错误！正确答案是「${currentQ.correct}」`}
          </div>
        )}
      </div>
    </div>
  );
};
