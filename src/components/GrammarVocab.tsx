import React, { useState } from 'react';
import { FloatingBack } from './FloatingBack';
import { ExamTargetTab } from './gv/ExamTargetTab';
import { MnemonicTab } from './gv/MnemonicTab';
import { MasterTipsTab } from './gv/MasterTipsTab';
import { TextbookTab } from './gv/TextbookTab';
import { WrongAnswersTab } from './gv/WrongAnswersTab';

const SESSION_KEY_STORE = 'yandao_session_v5';
function getSessionKey(): string { return localStorage.getItem(SESSION_KEY_STORE) ?? 'anon'; }

type GVTab = 'exam' | 'mnemonic' | 'tips' | 'textbook' | 'wrong';

interface GrammarVocabProps {
  languageCode: string;
  languageName: string;
  onBack: () => void;
}

export const GrammarVocab: React.FC<GrammarVocabProps> = ({ languageCode, languageName, onBack }) => {
  const [tab, setTab] = useState<GVTab>('exam');
  const sessionKey = getSessionKey();
  const TABS: { key: GVTab; icon: string; label: string }[] = [
    { key: 'exam',     icon: '🎯', label: '考试靶向' },
    { key: 'mnemonic', icon: '🧠', label: '记忆工坊' },
    { key: 'tips',     icon: '🏆', label: '大咖秘籍' },
    { key: 'textbook', icon: '📖', label: '教材同步' },
    { key: 'wrong',    icon: '📌', label: '错题本' },
  ];
  return (
    <div className="gv2-wrap">
      <FloatingBack onClick={onBack} />
      <div className="gv2-header">
        <h1 className="gv2-title">{languageName} · 智能学习</h1>
        <p className="gv2-sub">考试靶向 · 记忆法 · 教材同步</p>
      </div>
      <div className="gv2-tabs">
        {TABS.map((t) => (
          <button key={t.key} className={`gv2-tab ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
            <span className="gv2-tab-icon">{t.icon}</span>
            <span className="gv2-tab-label">{t.label}</span>
          </button>
        ))}
      </div>
      <div className="gv2-body">
        {tab === 'exam'     && <ExamTargetTab  key={`exam-${languageCode}`}     sessionKey={sessionKey} languageCode={languageCode} languageName={languageName} />}
        {tab === 'mnemonic' && <MnemonicTab    key={`mnemonic-${languageCode}`} sessionKey={sessionKey} languageCode={languageCode} />}
        {tab === 'tips'     && <MasterTipsTab  key={`tips-${languageCode}`}     sessionKey={sessionKey} languageCode={languageCode} />}
        {tab === 'textbook' && <TextbookTab    key={`textbook-${languageCode}`} sessionKey={sessionKey} languageCode={languageCode} languageName={languageName} />}
        {tab === 'wrong'    && <WrongAnswersTab key={`wrong-${languageCode}`}   sessionKey={sessionKey} languageCode={languageCode} />}
      </div>
    </div>
  );
};
