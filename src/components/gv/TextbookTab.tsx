import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../data/supabase';

interface TextbookTabProps {
  sessionKey: string;
  languageCode: string;
  languageName: string;
}

interface Textbook {
  id: string;
  lang_code: string;
  series_name: string;
  publisher: string;
  level_range: string;
  total_units: number;
  cover_emoji: string;
  description: string;
}

interface UserProgress {
  id: string;
  textbook_id: string;
  current_unit: number;
  completed_units: number[];
  notes: string;
}

interface UnitContent {
  unit: number;
  title: string;
  vocab: Array<{ word: string; reading?: string; meaning: string; notes?: string }>;
  grammar: Array<{ pattern: string; meaning: string; example: string }>;
  dialogue?: string;
}

const UNIT_DATA: Record<string, UnitContent[]> = {
  // Japanese
  minna_ja: [
    {
      unit: 1, title: 'はじめまして',
      vocab: [
        { word: '名前', reading: 'なまえ', meaning: '名字' },
        { word: '学生', reading: 'がくせい', meaning: '学生' },
        { word: '先生', reading: 'せんせい', meaning: '老师' },
        { word: '会社員', reading: 'かいしゃいん', meaning: '公司职员' },
        { word: '医者', reading: 'いしゃ', meaning: '医生' },
      ],
      grammar: [
        { pattern: '〜は〜です', meaning: '…是…', example: '私は学生です' },
        { pattern: '〜は〜ですか', meaning: '…是…吗？', example: 'あなたは学生ですか' },
      ],
      dialogue: '田中：はじめまして、田中です。どうぞよろしく。\nリー：はじめまして、リーです。こちらこそよろしく。',
    },
    {
      unit: 2, title: 'これはなんですか',
      vocab: [
        { word: 'これ', meaning: '这个' }, { word: 'それ', meaning: '那个' }, { word: 'あれ', meaning: '那个（远）' },
        { word: '本', reading: 'ほん', meaning: '书' }, { word: '辞書', reading: 'じしょ', meaning: '词典' },
      ],
      grammar: [
        { pattern: 'これ/それ/あれは〜です', meaning: '这/那是…', example: 'これは本です' },
        { pattern: '〜の〜', meaning: '…的…', example: '私の本' },
      ],
    },
    { unit: 3, title: 'ここはどこですか', vocab: [{ word: 'ここ', meaning: '这里' },{ word: 'そこ', meaning: '那里' },{ word: 'デパート', meaning: '百货公司' },{ word: '銀行', reading: 'ぎんこう', meaning: '银行' },{ word: '駅', reading: 'えき', meaning: '车站' }], grammar: [{ pattern: '〜はどこですか', meaning: '…在哪里？', example: 'トイレはどこですか' },{ pattern: '〜に〜があります', meaning: '在…有…', example: '駅の前に銀行があります' }] },
  ],
  genki_ja: [
    { unit: 1, title: 'New Friends', vocab: [{ word: '大学', reading: 'だいがく', meaning: '大学' },{ word: '専攻', reading: 'せんこう', meaning: '专业' },{ word: '出身', reading: 'しゅっしん', meaning: '出身' },{ word: '趣味', reading: 'しゅみ', meaning: '爱好' },{ word: '留学生', reading: 'りゅうがくせい', meaning: '留学生' }], grammar: [{ pattern: 'X は Y です', meaning: 'X是Y', example: '私はメアリーです' },{ pattern: 'X の Y', meaning: 'X的Y', example: 'メアリーさんの専攻' }], dialogue: 'メアリー：すみません、留学生ですか。\nたけし：はい、アメリカから来ました。' },
    { unit: 2, title: 'Shopping', vocab: [{ word: 'いくら', meaning: '多少钱' },{ word: '安い', reading: 'やすい', meaning: '便宜' },{ word: '高い', reading: 'たかい', meaning: '贵' },{ word: '買う', reading: 'かう', meaning: '买' },{ word: '店', reading: 'みせ', meaning: '商店' }], grammar: [{ pattern: '〜をください', meaning: '请给我…', example: 'これをください' },{ pattern: 'いくらですか', meaning: '多少钱？', example: 'このシャツはいくらですか' }] },
  ],
  // Korean
  topik_ko: [
    { unit: 1, title: '인사', vocab: [{ word: '안녕하세요', meaning: '你好' },{ word: '감사합니다', meaning: '谢谢' },{ word: '이름', meaning: '名字' },{ word: '학생', meaning: '学生' },{ word: '선생님', meaning: '老师' }], grammar: [{ pattern: '저는 〜입니다', meaning: '我是…', example: '저는 학생입니다' },{ pattern: '〜이/가 있어요', meaning: '有…', example: '책이 있어요' }] },
    { unit: 2, title: '가족', vocab: [{ word: '가족', meaning: '家庭' },{ word: '아버지', meaning: '爸爸' },{ word: '어머니', meaning: '妈妈' },{ word: '형', meaning: '哥哥' },{ word: '언니', meaning: '姐姐' }], grammar: [{ pattern: '〜이/가 몇 명이에요?', meaning: '有几口人？', example: '가족이 몇 명이에요?' },{ pattern: '〜하고', meaning: '和…', example: '아버지하고 어머니' }] },
  ],
  sejong_ko: [
    { unit: 1, title: '한국어 공부', vocab: [{ word: '한국어', meaning: '韩语' },{ word: '공부', meaning: '学习' },{ word: '책', meaning: '书' },{ word: '연필', meaning: '铅笔' },{ word: '공책', meaning: '笔记本' }], grammar: [{ pattern: '〜을/를 공부해요', meaning: '学习…', example: '한국어를 공부해요' }] },
  ],
  // English
  interchange_en: [
    { unit: 1, title: 'Nice to meet you!', vocab: [{ word: 'name', meaning: '名字' },{ word: 'teacher', meaning: '老师' },{ word: 'student', meaning: '学生' },{ word: 'friend', meaning: '朋友' },{ word: 'city', meaning: '城市' }], grammar: [{ pattern: 'I am / You are', meaning: '我是/你是', example: 'I am a student' },{ pattern: 'What is your name?', meaning: '你叫什么名字？', example: 'My name is John' }], dialogue: 'A: Hi, I\'m Sarah. What\'s your name?\nB: My name is Ken. Nice to meet you!' },
    { unit: 2, title: 'Where are you from?', vocab: [{ word: 'country', meaning: '国家' },{ word: 'language', meaning: '语言' },{ word: 'from', meaning: '来自' },{ word: 'live', meaning: '居住' },{ word: 'speak', meaning: '说' }], grammar: [{ pattern: 'Where are you from?', meaning: '你从哪里来？', example: 'I\'m from Canada' },{ pattern: 'Do you speak…?', meaning: '你说…吗？', example: 'Do you speak English?' }] },
  ],
  headway_en: [
    { unit: 1, title: 'Hello!', vocab: [{ word: 'hello', meaning: '你好' },{ word: 'goodbye', meaning: '再见' },{ word: 'please', meaning: '请' },{ word: 'thank you', meaning: '谢谢' },{ word: 'sorry', meaning: '对不起' }], grammar: [{ pattern: 'be + adjective', meaning: '描述', example: 'I am happy' },{ pattern: 'Present Simple', meaning: '一般现在时', example: 'I work in London' }] },
  ],
  // French
  alter_fr: [
    { unit: 1, title: 'Bonjour!', vocab: [{ word: 'bonjour', meaning: '你好' },{ word: 'merci', meaning: '谢谢' },{ word: 's\'il vous plaît', meaning: '请' },{ word: 'au revoir', meaning: '再见' },{ word: 'pardon', meaning: '对不起' }], grammar: [{ pattern: 'Je suis / Tu es', meaning: '我是/你是', example: 'Je suis français' },{ pattern: 'Comment tu t\'appelles?', meaning: '你叫什么？', example: 'Je m\'appelle Marie' }], dialogue: 'A: Bonjour! Comment ça va?\nB: Ça va bien, merci! Et toi?' },
    { unit: 2, title: 'Au café', vocab: [{ word: 'café', meaning: '咖啡' },{ word: 'croissant', meaning: '牛角包' },{ word: 'lait', meaning: '牛奶' },{ word: 'sucre', meaning: '糖' },{ word: 'pain', meaning: '面包' }], grammar: [{ pattern: 'Je voudrais…', meaning: '我想要…', example: 'Je voudrais un café' },{ pattern: 'Combien ça coûte?', meaning: '多少钱？', example: 'Ça coûte 2 euros' }] },
  ],
  edito_fr: [
    { unit: 1, title: 'Présentations', vocab: [{ word: 'nom', meaning: '姓' },{ word: 'prénom', meaning: '名' },{ word: 'nationalité', meaning: '国籍' },{ word: 'profession', meaning: '职业' },{ word: 'âge', meaning: '年龄' }], grammar: [{ pattern: 'Avoir + âge', meaning: '表达年龄', example: 'J\'ai 25 ans' },{ pattern: 'Être + nationalité', meaning: '表达国籍', example: 'Je suis chinois' }] },
  ],
  // Spanish
  aula_es: [
    { unit: 1, title: '¡Hola!', vocab: [{ word: 'hola', meaning: '你好' },{ word: 'gracias', meaning: '谢谢' },{ word: 'por favor', meaning: '请' },{ word: 'adiós', meaning: '再见' },{ word: 'perdón', meaning: '对不起' }], grammar: [{ pattern: 'Ser + nombre', meaning: '自我介绍', example: 'Soy Carlos' },{ pattern: '¿Cómo te llamas?', meaning: '你叫什么？', example: 'Me llamo Ana' }], dialogue: 'A: ¡Hola! ¿Cómo estás?\nB: Muy bien, ¿y tú?\nA: Bien, gracias.' },
    { unit: 2, title: 'En la cafetería', vocab: [{ word: 'café', meaning: '咖啡' },{ word: 'leche', meaning: '牛奶' },{ word: 'azúcar', meaning: '糖' },{ word: 'pan', meaning: '面包' },{ word: 'agua', meaning: '水' }], grammar: [{ pattern: 'Quiero…', meaning: '我要…', example: 'Quiero un café' },{ pattern: '¿Cuánto cuesta?', meaning: '多少钱？', example: 'Cuesta 2 euros' }] },
  ],
  prisma_es: [
    { unit: 1, title: 'Presentaciones', vocab: [{ word: 'nombre', meaning: '名字' },{ word: 'apellido', meaning: '姓' },{ word: 'país', meaning: '国家' },{ word: 'idioma', meaning: '语言' },{ word: 'edad', meaning: '年龄' }], grammar: [{ pattern: 'Tener + edad', meaning: '表达年龄', example: 'Tengo 20 años' },{ pattern: 'Hablar + idioma', meaning: '说语言', example: 'Hablo español' }] },
  ],
  // German
  menschen_de: [
    { unit: 1, title: 'Hallo!', vocab: [{ word: 'hallo', meaning: '你好' },{ word: 'danke', meaning: '谢谢' },{ word: 'bitte', meaning: '请' },{ word: 'tschüss', meaning: '再见' },{ word: 'Entschuldigung', meaning: '对不起' }], grammar: [{ pattern: 'Ich heiße…', meaning: '我叫…', example: 'Ich heiße Anna' },{ pattern: 'Wie heißt du?', meaning: '你叫什么？', example: 'Ich heiße Max' }], dialogue: 'A: Hallo! Wie geht\'s?\nB: Gut, danke! Und dir?\nA: Auch gut!' },
    { unit: 2, title: 'Im Café', vocab: [{ word: 'Kaffee', meaning: '咖啡' },{ word: 'Milch', meaning: '牛奶' },{ word: 'Zucker', meaning: '糖' },{ word: 'Brot', meaning: '面包' },{ word: 'Wasser', meaning: '水' }], grammar: [{ pattern: 'Ich möchte…', meaning: '我想要…', example: 'Ich möchte einen Kaffee' },{ pattern: 'Was kostet das?', meaning: '多少钱？', example: 'Das kostet 2 Euro' }] },
  ],
  schritte_de: [
    { unit: 1, title: 'Guten Tag', vocab: [{ word: 'Name', meaning: '名字' },{ word: 'Land', meaning: '国家' },{ word: 'Sprache', meaning: '语言' },{ word: 'Beruf', meaning: '职业' },{ word: 'Alter', meaning: '年龄' }], grammar: [{ pattern: 'Sein + Beruf', meaning: '表达职业', example: 'Ich bin Lehrer' },{ pattern: 'Kommen aus…', meaning: '来自…', example: 'Ich komme aus China' }] },
  ],
  // Italian
  nuovo_it: [
    { unit: 1, title: 'Ciao!', vocab: [{ word: 'ciao', meaning: '你好' },{ word: 'grazie', meaning: '谢谢' },{ word: 'per favore', meaning: '请' },{ word: 'arrivederci', meaning: '再见' },{ word: 'scusa', meaning: '对不起' }], grammar: [{ pattern: 'Io sono…', meaning: '我是…', example: 'Io sono Marco' },{ pattern: 'Come ti chiami?', meaning: '你叫什么？', example: 'Mi chiamo Laura' }], dialogue: 'A: Ciao! Come stai?\nB: Bene, grazie! E tu?\nA: Bene, grazie!' },
    { unit: 2, title: 'Al bar', vocab: [{ word: 'caffè', meaning: '咖啡' },{ word: 'latte', meaning: '牛奶' },{ word: 'zucchero', meaning: '糖' },{ word: 'pane', meaning: '面包' },{ word: 'acqua', meaning: '水' }], grammar: [{ pattern: 'Vorrei…', meaning: '我想要…', example: 'Vorrei un caffè' },{ pattern: 'Quanto costa?', meaning: '多少钱？', example: 'Costa 2 euro' }] },
  ],
  progetto_it: [
    { unit: 1, title: 'Presentazioni', vocab: [{ word: 'nome', meaning: '名字' },{ word: 'cognome', meaning: '姓' },{ word: 'nazionalità', meaning: '国籍' },{ word: 'professione', meaning: '职业' },{ word: 'età', meaning: '年龄' }], grammar: [{ pattern: 'Avere + età', meaning: '表达年龄', example: 'Ho 30 anni' },{ pattern: 'Parlare + lingua', meaning: '说语言', example: 'Parlo italiano' }] },
  ],
  // Portuguese
  bom_pt: [
    { unit: 1, title: 'Olá!', vocab: [{ word: 'olá', meaning: '你好' },{ word: 'obrigado', meaning: '谢谢' },{ word: 'por favor', meaning: '请' },{ word: 'tchau', meaning: '再见' },{ word: 'desculpe', meaning: '对不起' }], grammar: [{ pattern: 'Eu sou…', meaning: '我是…', example: 'Eu sou João' },{ pattern: 'Como você se chama?', meaning: '你叫什么？', example: 'Me chamo Ana' }], dialogue: 'A: Olá! Tudo bem?\nB: Tudo bem, e você?\nA: Tudo ótimo!' },
    { unit: 2, title: 'No café', vocab: [{ word: 'café', meaning: '咖啡' },{ word: 'leite', meaning: '牛奶' },{ word: 'açúcar', meaning: '糖' },{ word: 'pão', meaning: '面包' },{ word: 'água', meaning: '水' }], grammar: [{ pattern: 'Quero…', meaning: '我要…', example: 'Quero um café' },{ pattern: 'Quanto custa?', meaning: '多少钱？', example: 'Custa 2 reais' }] },
  ],
  novo_pt: [
    { unit: 1, title: 'Apresentações', vocab: [{ word: 'nome', meaning: '名字' },{ word: 'sobrenome', meaning: '姓' },{ word: 'país', meaning: '国家' },{ word: 'língua', meaning: '语言' },{ word: 'idade', meaning: '年龄' }], grammar: [{ pattern: 'Ter + idade', meaning: '表达年龄', example: 'Tenho 25 anos' },{ pattern: 'Falar + língua', meaning: '说语言', example: 'Falo português' }] },
  ],
  // Arabic
  kitab_ar: [
    { unit: 1, title: 'مرحباً', vocab: [{ word: 'مرحباً', meaning: '你好' },{ word: 'شكراً', meaning: '谢谢' },{ word: 'من فضلك', meaning: '请' },{ word: 'مع السلامة', meaning: '再见' },{ word: 'آسف', meaning: '对不起' }], grammar: [{ pattern: 'أنا…', meaning: '我是…', example: 'أنا طالب' },{ pattern: 'ما اسمك؟', meaning: '你叫什么？', example: 'اسمي أحمد' }], dialogue: 'أ: السلام عليكم! كيف حالك؟\nب: الحمد لله، بخير. وأنت؟\nأ: بخير، شكراً!' },
    { unit: 2, title: 'في المقهى', vocab: [{ word: 'قهوة', meaning: '咖啡' },{ word: 'حليب', meaning: '牛奶' },{ word: 'سكر', meaning: '糖' },{ word: 'خبز', meaning: '面包' },{ word: 'ماء', meaning: '水' }], grammar: [{ pattern: 'أريد…', meaning: '我要…', example: 'أريد قهوة' },{ pattern: 'كم السعر؟', meaning: '多少钱？', example: 'بكم هذا؟' }] },
  ],
  arabiyya_ar: [
    { unit: 1, title: 'التعارف', vocab: [{ word: 'اسم', meaning: '名字' },{ word: 'بلد', meaning: '国家' },{ word: 'لغة', meaning: '语言' },{ word: 'عمل', meaning: '工作' },{ word: 'عمر', meaning: '年龄' }], grammar: [{ pattern: 'عندي…', meaning: '我有…', example: 'عندي ٢٥ سنة' },{ pattern: 'أتحدث…', meaning: '我说…', example: 'أتحدث العربية' }] },
  ],
  // Chinese
  hsk_zh: [
    { unit: 1, title: '你好', vocab: [{ word: '你好', meaning: 'Hello' },{ word: '谢谢', meaning: 'Thanks' },{ word: '对不起', meaning: 'Sorry' },{ word: '再见', meaning: 'Goodbye' },{ word: '请', meaning: 'Please' }], grammar: [{ pattern: '是…的', meaning: 'Emphasis structure', example: '我是昨天来的' },{ pattern: '了 (completion)', meaning: 'Completed action', example: '我吃了饭' }], dialogue: 'A: 你好！你叫什么名字？\nB: 我叫小明，你呢？\nA: 我叫小红。' },
    { unit: 2, title: '买东西', vocab: [{ word: '这个', meaning: 'This' },{ word: '那个', meaning: 'That' },{ word: '多少', meaning: 'How much' },{ word: '钱', meaning: 'Money' },{ word: '贵', meaning: 'Expensive' }], grammar: [{ pattern: '多少钱？', meaning: 'How much?', example: '这个多少钱？' },{ pattern: '太…了', meaning: 'Too…', example: '太贵了！' }] },
  ],
  road_zh: [
    { unit: 1, title: '自我介绍', vocab: [{ word: '名字', meaning: 'Name' },{ word: '国家', meaning: 'Country' },{ word: '语言', meaning: 'Language' },{ word: '工作', meaning: 'Job' },{ word: '爱好', meaning: 'Hobby' }], grammar: [{ pattern: '我叫…', meaning: 'My name is…', example: '我叫大卫' },{ pattern: '我是…人', meaning: 'I am from…', example: '我是美国人' }] },
  ],
};

function getUnits(textbookId: string): UnitContent[] {
  // Check all keys for partial match
  for (const key of Object.keys(UNIT_DATA)) {
    if (textbookId.includes(key.replace(/_.*/, '')) || textbookId === key) {
      return UNIT_DATA[key] ?? [];
    }
  }
  // Fallback: first unit of first textbook in matching language
  const langPrefix = textbookId.split('_')[1] || '';
  for (const key of Object.keys(UNIT_DATA)) {
    if (key.endsWith('_' + langPrefix)) return UNIT_DATA[key] ?? [];
  }
  return UNIT_DATA['minna_ja'] ?? [];
}

function generateUnitQuiz(unit: UnitContent) {
  if (!unit.vocab.length) return null;
  const item = unit.vocab[Math.floor(Math.random() * unit.vocab.length)];
  const others = unit.vocab.filter((v) => v.meaning !== item.meaning).slice(0, 3).map((v) => v.meaning);
  if (others.length < 3) return null;
  const opts = [...others, item.meaning].sort(() => Math.random() - 0.5);
  return { question: `「${item.word}」的意思是？`, answer: item.meaning, options: opts };
}

export const TextbookTab: React.FC<TextbookTabProps> = ({ sessionKey, languageCode, languageName }) => {
  const [textbooks, setTextbooks] = useState<Textbook[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [selectedBook, setSelectedBook] = useState<Textbook | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<UnitContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'book' | 'unit'>('list');

  const [quizItem, setQuizItem] = useState<ReturnType<typeof generateUnitQuiz>>(null);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);

  const loadData = useCallback(async () => {
    const [bRes, pRes] = await Promise.all([
      supabase.from('textbook_index').select('*').eq('lang_code', languageCode).order('sort_order'),
      supabase.from('user_textbook_progress').select('*').eq('session_key', sessionKey).maybeSingle(),
    ]);
    const books = (bRes.data ?? []) as Textbook[];
    setTextbooks(books);
    if (pRes.data) setProgress(pRes.data as UserProgress);
  }, [sessionKey, languageCode]);

  useEffect(() => {
    setLoading(true);
    loadData().finally(() => setLoading(false));
  }, [loadData]);

  async function selectBook(book: Textbook) {
    setSelectedBook(book);
    setView('book');
    setSelectedUnit(null);
    const units = getUnits(book.id);
    if (!progress) {
      await supabase.from('user_textbook_progress').insert({
        session_key: sessionKey,
        textbook_id: book.id,
        current_unit: 1,
        completed_units: [],
        notes: '',
      });
      loadData();
    }
  }

  async function markUnitComplete(unitNum: number) {
    if (!progress || !selectedBook) return;
    const completed = [...(progress.completed_units ?? [])];
    if (!completed.includes(unitNum)) completed.push(unitNum);
    const next = Math.max(progress.current_unit, unitNum + 1);
    await supabase.from('user_textbook_progress')
      .update({ completed_units: completed, current_unit: next })
      .eq('id', progress.id);
    setProgress({ ...progress, completed_units: completed, current_unit: next });
  }

  function openUnit(unit: UnitContent) {
    setSelectedUnit(unit);
    setView('unit');
    setQuizItem(null);
    setQuizAnswer(null);
    setQuizScore(0);
  }

  function startQuiz() {
    if (!selectedUnit) return;
    const q = generateUnitQuiz(selectedUnit);
    setQuizItem(q);
    setQuizAnswer(null);
  }

  function answerQuiz(ans: string) {
    if (!quizItem || quizAnswer) return;
    setQuizAnswer(ans);
    if (ans === quizItem.answer) setQuizScore((s) => s + 1);
    setTimeout(() => {
      if (selectedUnit) {
        setQuizItem(generateUnitQuiz(selectedUnit));
        setQuizAnswer(null);
      }
    }, 1200);
  }

  const units = selectedBook ? getUnits(selectedBook.id) : [];

  if (loading) return <div className="tb-loading">加载教材数据…</div>;

  if (view === 'unit' && selectedUnit && selectedBook) {
    const isCompleted = progress?.completed_units?.includes(selectedUnit.unit);
    return (
      <div className="tb-wrap">
        <div className="tb-breadcrumb">
          <button className="tb-back-link" onClick={() => setView('book')}>← {selectedBook.series_name}</button>
          <span className="tb-sep">/</span>
          <span>第{selectedUnit.unit}课</span>
        </div>
        <div className="tb-unit-header">
          <h3 className="tb-unit-title">第{selectedUnit.unit}课 · {selectedUnit.title}</h3>
          {isCompleted
            ? <span className="tb-done-badge">已完成 ✓</span>
            : <button className="tb-complete-btn" onClick={() => markUnitComplete(selectedUnit.unit)}>标记完成</button>
          }
        </div>

        {selectedUnit.vocab.length > 0 && (
          <div className="tb-section">
            <h4 className="tb-section-title">本课词汇</h4>
            <div className="tb-vocab-grid">
              {selectedUnit.vocab.map((v, i) => (
                <div className="tb-vocab-card" key={i}>
                  <span className="tb-vocab-word">{v.word}</span>
                  {v.reading && <span className="tb-vocab-reading">{v.reading}</span>}
                  <span className="tb-vocab-meaning">{v.meaning}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedUnit.grammar.length > 0 && (
          <div className="tb-section">
            <h4 className="tb-section-title">语法要点</h4>
            {selectedUnit.grammar.map((g, i) => (
              <div className="tb-grammar-card" key={i}>
                <span className="tb-grammar-pattern">{g.pattern}</span>
                <span className="tb-grammar-meaning">{g.meaning}</span>
                <p className="tb-grammar-example">{g.example}</p>
              </div>
            ))}
          </div>
        )}

        {selectedUnit.dialogue && (
          <div className="tb-section">
            <h4 className="tb-section-title">对话示例</h4>
            <div className="tb-dialogue">{selectedUnit.dialogue}</div>
          </div>
        )}

        <div className="tb-section">
          <div className="tb-quiz-header">
            <h4 className="tb-section-title">单元测验</h4>
            <span className="tb-score">得分 {quizScore}</span>
            <button className="tb-quiz-btn" onClick={startQuiz}>开始</button>
          </div>
          {quizItem && (
            <div className="tb-quiz-card">
              <p className="tb-quiz-q">{quizItem.question}</p>
              <div className="tb-quiz-opts">
                {quizItem.options.map((opt) => (
                  <button key={opt}
                    className={`tb-quiz-opt ${quizAnswer === opt ? (opt === quizItem!.answer ? 'correct' : 'wrong') : ''} ${quizAnswer && opt === quizItem!.answer ? 'correct' : ''}`}
                    onClick={() => answerQuiz(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (view === 'book' && selectedBook) {
    const completedCount = progress?.completed_units?.length ?? 0;
    const pct = units.length > 0 ? Math.round((completedCount / units.length) * 100) : 0;
    return (
      <div className="tb-wrap">
        <button className="tb-back-link" onClick={() => setView('list')}>← 教材列表</button>
        <div className="tb-book-header">
          <span className="tb-book-cover">{selectedBook.cover_emoji}</span>
          <div>
            <h3 className="tb-book-title">{selectedBook.series_name}</h3>
            <p className="tb-book-meta">{selectedBook.publisher} · {selectedBook.level_range}</p>
            <div className="tb-prog-bar-wrap">
              <div className="tb-prog-fill" style={{ width: `${pct}%` }} />
            </div>
            <p className="tb-prog-text">{completedCount}/{units.length} 课 ({pct}%)</p>
          </div>
        </div>
        <div className="tb-units-list">
          {units.map((unit) => {
            const done = progress?.completed_units?.includes(unit.unit);
            const current = progress?.current_unit === unit.unit;
            return (
              <div className={`tb-unit-row ${current ? 'current' : ''} ${done ? 'done' : ''}`} key={unit.unit}
                onClick={() => openUnit(unit)}>
                <div className="tb-unit-num-box">
                  {done ? <span className="tb-unit-check">✓</span> : <span className="tb-unit-num">{unit.unit}</span>}
                </div>
                <div className="tb-unit-info">
                  <span className="tb-unit-name">第{unit.unit}课 · {unit.title}</span>
                  <span className="tb-unit-stats">{unit.vocab.length}词 · {unit.grammar.length}语法</span>
                </div>
                {current && <span className="tb-unit-badge">学习中</span>}
                <span className="tb-unit-arrow">›</span>
              </div>
            );
          })}
          {units.length === 0 && (
            <div className="tb-empty">该教材课程内容即将上线，敬请期待</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="tb-wrap">
      <div className="tb-list-header">
        <h3 className="tb-list-title">{languageName} 教材同步</h3>
        <p className="tb-list-sub">选择你的教材，与课程进度同步学习</p>
      </div>
      {textbooks.length === 0 && (
        <div className="tb-empty">该语言暂无教材配置，管理员可在后台添加</div>
      )}
      <div className="tb-book-grid">
        {textbooks.map((book) => (
          <div className="tb-book-card" key={book.id} onClick={() => selectBook(book)}>
            <span className="tb-book-emoji">{book.cover_emoji}</span>
            <div className="tb-book-card-info">
              <span className="tb-book-card-name">{book.series_name}</span>
              <span className="tb-book-card-pub">{book.publisher}</span>
              <span className="tb-book-card-level">{book.level_range}</span>
            </div>
            <span className="tb-book-units">{book.total_units}课</span>
          </div>
        ))}
      </div>
    </div>
  );
};
