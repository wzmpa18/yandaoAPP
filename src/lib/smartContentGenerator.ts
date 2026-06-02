/**
 * SmartContentGenerator
 * Offline-first AI-style content generation for language learning.
 * All methods return deterministic or lightly randomised content based
 * on the provided language data — no external API required.
 */

export interface Vocab { word: string; reading?: string; meaning: string }
export interface GrammarPoint { pattern: string; explanation: string; example: string }

export interface MatchingGamePair { id: string; target: string; translation: string }
export interface MatchingGame { pairs: MatchingGamePair[]; langCode: string; title: string }

export interface SentencePuzzle {
  words: string[];
  answer: string;
  hint: string;
  translation: string;
}

export interface Dialogue {
  title: string;
  scenario: string;
  turns: { speaker: 'A' | 'B'; text: string; translation: string }[];
}

export interface FunnySkit {
  title: string;
  setup: string;
  punchline: string;
  vocab: string[];
}

export interface GrammarMnemonic {
  pattern: string;
  mnemonic: string;
  visualHook: string;
  exampleSentence: string;
  errorToAvoid: string;
}

export interface ExamQuestion {
  id: string;
  type: 'multiple_choice' | 'fill_blank' | 'true_false';
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

// ── Helpers ──────────────────────────────────────────────────────────
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - .5); }
function uid(): string { return Math.random().toString(36).slice(2, 9); }

// ── Locale-aware data scaffolds ───────────────────────────────────────
const SCENARIO_MAP: Record<string, string[]> = {
  ja: ['コンビニで', '駅の改札前で', 'カフェで', 'アルバイト初日', '友達の誕生日パーティー'],
  ko: ['편의점에서', '지하철역에서', '카페에서', '첫 출근날', '친구 생일 파티에서'],
  en: ['At a coffee shop', 'At the airport', 'At the office', "At a friend's party", 'At a supermarket'],
  fr: ['Au café', 'À la gare', 'Au bureau', 'Chez un ami', 'Au supermarché'],
  es: ['En la cafetería', 'En el aeropuerto', 'En la oficina', 'En casa de un amigo', 'En el mercado'],
  de: ['Im Café', 'Am Bahnhof', 'Im Büro', 'Bei einem Freund', 'Im Supermarkt'],
  it: ['Al bar', 'In stazione', 'In ufficio', "A casa di un amico", 'Al supermercato'],
  pt: ['No café', 'Na estação', 'No escritório', 'Na casa de um amigo', 'No supermercado'],
  ar: ['في المقهى', 'في المحطة', 'في المكتب', 'عند صديق', 'في السوق'],
  zh: ['在咖啡厅', '在地铁站', '在公司', '在朋友家', '在超市'],
};

const SKIT_SETUPS: string[] = [
  '学生把"老师"叫成了"爸爸"……',
  '点菜时说成了"我要吃服务员"……',
  '问"厕所"结果说成了"图书馆"……',
  '道歉时越说越像骂人……',
  '说"我很饿"却听起来像"我很饿死了你"……',
];

// ═══════════════════════════════════════════════════════════════════════
export class SmartContentGenerator {

  // 1. Matching game ─────────────────────────────────────────────────
  static generateMatchingGame(vocab: Vocab[], langCode: string, count = 6): MatchingGame {
    const pool = shuffle(vocab).slice(0, Math.max(count, 3));
    return {
      langCode,
      title: `词汇配对 · ${pool.length} 对`,
      pairs: pool.map((v) => ({
        id: uid(),
        target: v.word,
        translation: v.meaning,
      })),
    };
  }

  // 2. Sentence puzzle ───────────────────────────────────────────────
  static generateSentencePuzzle(sentence: string, translation: string, langCode: string): SentencePuzzle {
    // Split on spaces/particles; for CJK add spaces between each char
    const raw = langCode === 'zh' || langCode === 'ja' || langCode === 'ko'
      ? sentence.split('').filter((c) => c.trim())
      : sentence.split(' ').filter(Boolean);
    const distractors = [`___`, `???`, `～`];
    const words = shuffle([...raw, ...distractors.slice(0, Math.min(2, raw.length))]);
    return { words, answer: sentence, translation, hint: `共 ${raw.length} 个词` };
  }

  // 3. Dialogue ──────────────────────────────────────────────────────
  static generateDialogue(langCode: string, scenario?: string): Dialogue {
    const sc = scenario ?? pick(SCENARIO_MAP[langCode] ?? SCENARIO_MAP.en);
    const templates: Record<string, Dialogue> = {
      ja: {
        title: `日常会話 · ${sc}`,
        scenario: sc,
        turns: [
          { speaker: 'A', text: 'すみません、これはいくらですか？', translation: '请问这个多少钱？' },
          { speaker: 'B', text: '580円になります。', translation: '580日元。' },
          { speaker: 'A', text: 'じゃ、これをください。', translation: '那我要这个。' },
          { speaker: 'B', text: 'ありがとうございます！', translation: '谢谢您！' },
        ],
      },
      ko: {
        title: `일상 대화 · ${sc}`,
        scenario: sc,
        turns: [
          { speaker: 'A', text: '이거 얼마예요?', translation: '这个多少钱？' },
          { speaker: 'B', text: '오천 원이에요.', translation: '5000韩元。' },
          { speaker: 'A', text: '이걸로 할게요.', translation: '我要这个。' },
          { speaker: 'B', text: '감사합니다!', translation: '谢谢！' },
        ],
      },
      en: {
        title: `Daily Conversation · ${sc}`,
        scenario: sc,
        turns: [
          { speaker: 'A', text: 'Excuse me, how much is this?', translation: '请问这个多少钱？' },
          { speaker: 'B', text: "It's $5.80.", translation: '5.8美元。' },
          { speaker: 'A', text: "I'll take it, please.", translation: '请给我这个。' },
          { speaker: 'B', text: 'Thank you! Have a nice day!', translation: '谢谢！祝您愉快！' },
        ],
      },
    };
    const fallback: Dialogue = {
      title: `Conversation · ${sc}`,
      scenario: sc,
      turns: [
        { speaker: 'A', text: '¿Cuánto cuesta esto?', translation: '这个多少钱？' },
        { speaker: 'B', text: 'Son 5 euros.', translation: '5欧元。' },
        { speaker: 'A', text: 'Me lo llevo, gracias.', translation: '我要了，谢谢。' },
        { speaker: 'B', text: '¡De nada!', translation: '不客气！' },
      ],
    };
    return templates[langCode] ?? fallback;
  }

  // 4. Funny skit ────────────────────────────────────────────────────
  static generateFunnySkit(vocab: Vocab[], langCode: string): FunnySkit {
    const setup = pick(SKIT_SETUPS);
    const target = vocab.length ? pick(vocab) : { word: '?', meaning: '?' };
    return {
      title: `语言学习翻车现场`,
      setup,
      punchline: `记住："${target.word}" = "${target.meaning}"，别再搞混了！`,
      vocab: vocab.slice(0, 4).map((v) => `${v.word}→${v.meaning}`),
    };
  }

  // 5. Grammar mnemonics ─────────────────────────────────────────────
  static generateGrammarMnemonics(grammar: GrammarPoint, langCode: string): GrammarMnemonic {
    const hooks: Record<string, string> = {
      ja: '想象一棵樱花树 🌸，花瓣飘落的路径就是句子结构',
      ko: '想象汉江桥 🌉，主语和谓语分别在两端',
      en: '想象一条直线铁轨 🚂：主语→谓语→宾语，永不拐弯',
      fr: '想象埃菲尔铁塔 🗼，形容词就像铁塔上的装饰挂件',
      es: '想象斗牛场 🐂，动词变位是斗牛士的动作，随人称变化',
      de: '想象一扇德式大门 🚪：动词总在第二位把守',
      default: '想象这个句型是一座桥 🌉，连接意思的两端',
    };
    return {
      pattern: grammar.pattern,
      mnemonic: `【${grammar.pattern}】→ 中文对应"${grammar.explanation}"`,
      visualHook: hooks[langCode] ?? hooks.default,
      exampleSentence: grammar.example,
      errorToAvoid: `不要把"${grammar.pattern}"和相似句型混用，注意语序差异`,
    };
  }

  // 6. Exam question ─────────────────────────────────────────────────
  static generateExamQuestion(
    vocab: Vocab[],
    grammar: GrammarPoint | null,
    difficulty: 'easy' | 'medium' | 'hard' = 'medium',
    type: 'multiple_choice' | 'fill_blank' | 'true_false' = 'multiple_choice',
  ): ExamQuestion {
    if (type === 'multiple_choice' && vocab.length >= 4) {
      const correct = pick(vocab);
      const distractors = shuffle(vocab.filter((v) => v.word !== correct.word)).slice(0, 3);
      const options = shuffle([correct.meaning, ...distractors.map((d) => d.meaning)]);
      return {
        id: uid(),
        type: 'multiple_choice',
        question: `"${correct.word}" 的意思是？`,
        options,
        answer: correct.meaning,
        explanation: `"${correct.word}"${correct.reading ? `（${correct.reading}）` : ''} = ${correct.meaning}`,
        difficulty,
      };
    }

    if (type === 'fill_blank' && grammar) {
      const blank = grammar.example.replace(grammar.pattern, '______');
      return {
        id: uid(),
        type: 'fill_blank',
        question: `请用"${grammar.pattern}"完成句子：${blank}`,
        answer: grammar.pattern,
        explanation: grammar.explanation,
        difficulty,
      };
    }

    // true_false fallback
    const item = vocab.length ? pick(vocab) : null;
    const isTrue = Math.random() > .5;
    const shownMeaning = isTrue ? item?.meaning ?? '正确' : `不是"${item?.meaning ?? '正确'}"`;
    return {
      id: uid(),
      type: 'true_false',
      question: item ? `"${item.word}" 的意思是"${shownMeaning}"，对吗？` : '请判断以下说法是否正确',
      options: ['正确', '错误'],
      answer: isTrue ? '正确' : '错误',
      explanation: item ? `"${item.word}" = "${item.meaning}"` : '',
      difficulty,
    };
  }
}
