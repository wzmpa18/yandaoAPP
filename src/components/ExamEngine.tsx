import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../data/supabase';
import { FloatingBack } from './FloatingBack';
import { Confetti } from './Confetti';
import { speakWithPreset } from '../lib/voiceProfile';

interface Question {
  id: string;
  language_code: string;
  level: string;
  type: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  audio_text: string;
}

interface ExamEngineProps {
  languageCode: string;
  languageName: string;
  level: string;
  onBack: () => void;
}

const TYPE_LABELS: Record<string, { icon: string; label: string }> = {
  listening_choice:      { icon: '🎧', label: 'Listening' },
  grammar_error:         { icon: '✏️', label: 'Grammar Fix' },
  sentence_build:        { icon: '🔤', label: 'Sentence Build' },
  reading_comprehension: { icon: '📖', label: 'Reading' },
};

const EXAM_DURATION = 600;

/* 考试类型 */
const EXAM_TYPES = [
  { key: 'all', label: '综合', icon: '📋' },
  { key: 'jlpt', label: 'JLPT', icon: '🇯🇵' },
  { key: 'daily', label: '日常会话', icon: '💬' },
  { key: 'business', label: '商务日语', icon: '💼' },
  { key: 'toefl', label: 'TOEFL', icon: '🇺🇸' },
  { key: 'hsk', label: 'HSK', icon: '🇨🇳' },
] as const;

// Template question generators — produce infinite unique questions per language/level
// Each generator returns a Question object with a unique id derived from seed
function makeGrammarQ(lang: string, level: string, seed: number): Question {
  const banks: Record<string, Array<{ q: string; opts: string[]; ans: string; exp: string }>> = {
    ja: [
      { q: '「食べる」の丁寧形は？', opts: ['食べます', '食べた', '食べない', '食べよう'], ans: '食べます', exp: '丁寧形（ます形）は食べます。日常会話で最もよく使われます。' },
      { q: '「私___学生です」に入る助詞は？', opts: ['は', 'が', 'を', 'に'], ans: 'は', exp: 'トピックマーカー「は」を使います。例：私は学生です。' },
      { q: '「どこ___行きますか」の正しい助詞は？', opts: ['に', 'を', 'が', 'で'], ans: 'に', exp: '方向・目的地を示す助詞「に」を使います。' },
      { q: '「見る」の可能形は？', opts: ['見られる', '見える', '見た', '見ない'], ans: '見られる', exp: '可能形は「見られる」。一段動詞は語幹+られるで可能形を作ります。' },
      { q: '「猫が三___います」に入る助数詞は？', opts: ['匹（びき）', '頭（とう）', '羽（わ）', '個（こ）'], ans: '匹（びき）', exp: '猫などの小動物には「匹（ひき/びき/ぴき）」を使います。' },
      { q: '「雨___降っています」の正しい助詞は？', opts: ['が', 'を', 'に', 'で'], ans: 'が', exp: '自然現象の主語には「が」を使います。例：雨が降る、風が吹く。' },
      { q: '「本を読む___、コーヒーを飲みます」に入る接続詞は？', opts: ['ながら', 'から', 'ので', 'でも'], ans: 'ながら', exp: '「〜ながら」は同時進行の動作を表します。「Vます形＋ながら」で接続します。' },
      { q: '「明日は雨が降る___。」の正しい文末は？', opts: ['でしょう', 'ます', 'ました', 'ません'], ans: 'でしょう', exp: '「でしょう」は推量を表します。丁寧な推量表現です。' },
    ],
    fr: [
      { q: 'Quel est le pluriel de "cheval" ?', opts: ['chevals', 'chevaux', 'chevales', 'cheval'], ans: 'chevaux', exp: 'Cheval → chevaux. Les mots en -al font leur pluriel en -aux.' },
      { q: 'Comment dit-on "I am happy" en français ?', opts: ['Je suis heureux', 'Je suis content', 'Je suis bien', 'Je suis bon'], ans: 'Je suis heureux', exp: '"Je suis heureux/heureuse" est la traduction directe de "I am happy".' },
      { q: 'Quel est le féminin de "acteur" ?', opts: ['acteuse', 'actrice', 'acteure', 'acteur'], ans: 'actrice', exp: 'Acteur → actrice. Le suffixe -teur devient souvent -trice au féminin.' },
      { q: 'Complétez: "Je ___ allé au cinéma hier."', opts: ['suis', 'ai', 'est', 'a'], ans: 'suis', exp: 'Avec "aller", on utilise l\'auxiliaire "être": je suis allé(e).' },
      { q: 'Quel est l\'article défini pour "amie" ?', opts: ['le', 'la', 'les', 'l\''], ans: 'l\'', exp: 'Devant une voyelle, l\'article défini s\'élide: l\'amie.' },
      { q: 'Choisissez la bonne préposition: "Je vais ___ Paris."', opts: ['à', 'en', 'au', 'dans'], ans: 'à', exp: 'Pour les villes, on utilise "à": Je vais à Paris. Pour les pays féminins: en.' },
    ],
    ko: [
      { q: '"먹다"의 존댓말은?', opts: ['먹어요', '드세요', '드십니다', '드세요'], ans: '드세요', exp: '먹다의 존댓말은 드시다입니다. 드세요는 부탁/권유 형태입니다.' },
      { q: '"어디에 가세요?"에서 "에"의 역할은?', opts: ['방향', '시간', '원인', '수단'], ans: '방향', exp: '조사 "에"는 장소나 방향을 나타냅니다.' },
      { q: '"보다"의 과거형은?', opts: ['봤어요', '볼 거예요', '보고 있어요', '보세요'], ans: '봤어요', exp: '보다의 과거형은 봤어요입니다. "보았어요"의 축약형입니다.' },
      { q: '"공부하___ 학교에 가요" 알맞은 연결어미는?', opts: ['러', '려고', '면', '고'], ans: '러', exp: '"-(으)러"는 목적을 나타내는 연결어미입니다. 동작동사에 붙습니다.' },
      { q: '"이 책은 ___ 재미있어요" 알맞은 부사는?', opts: ['아주', '너무', '조금', '많이'], ans: '아주', exp: '"아주"는 "とても/とても"의 의미로 긍정적인 강조 표현입니다.' },
      { q: '"오늘 날씨가 ___?" 알맞은 의문형 어미는?', opts: ['어때요', '었어요', '을까요', '읍시다'], ans: '어때요', exp: '"어때요"는 "어떠해요"의 축약형으로 상태를 묻는 의문형입니다.' },
    ],
    es: [
      { q: '¿Cuál es el pretérito de "hablar" (yo)?', opts: ['hablé', 'habló', 'hablaba', 'hable'], ans: 'hablé', exp: 'El pretérito indefinido de hablar en primera persona es "hablé".' },
      { q: '¿Cuál es el plural de "el lápiz"?', opts: ['los lápizes', 'los lápices', 'los lapis', 'los lápiz'], ans: 'los lápices', exp: 'Los sustantivos en -z forman el plural cambiando -z por -ces: lápiz → lápices.' },
      { q: '¿Cuál es la diferencia entre "ser" y "estar"?', opts: ['Ser=permanente, Estar=temporal', 'Ser=temporal, Estar=permanente', 'Son iguales', 'Ser=pasado, Estar=futuro'], ans: 'Ser=permanente, Estar=temporal', exp: 'Ser se usa para características permanentes. Estar para estados temporales.' },
      { q: '¿Cuál es el imperativo de "comer" (tú)?', opts: ['come', 'comes', 'comas', 'comiste'], ans: 'come', exp: 'El imperativo afirmativo de "tú" para verbos -er es la 3ª persona singular: come.' },
      { q: 'Elige el posesivo correcto: "___ casa es grande."', opts: ['Mi', 'Mío', 'Mí', 'Yo'], ans: 'Mi', exp: '"Mi" es el adjetivo posesivo que va antes del sustantivo. "Mío" va después.' },
      { q: '¿Cuál es el subjuntivo de "tener" (yo)?', opts: ['tenga', 'tengo', 'tenía', 'tendré'], ans: 'tenga', exp: 'El presente de subjuntivo de tener en 1ª persona es "tenga".' },
    ],
    de: [
      { q: 'Was ist der Artikel von "Haus"?', opts: ['der', 'die', 'das', 'ein'], ans: 'das', exp: 'Haus ist ein Neutrum: das Haus. Neutrale Nomen haben den Artikel "das".' },
      { q: 'Wie konjugiert man "gehen" für "ich"?', opts: ['gehe', 'gehst', 'geht', 'gehen'], ans: 'gehe', exp: '"ich gehe" — regelmäßige Konjugation. Ich gehe, du gehst, er/sie/es geht.' },
      { q: 'Welcher Fall folgt auf "mit"?', opts: ['Dativ', 'Akkusativ', 'Nominativ', 'Genitiv'], ans: 'Dativ', exp: '"Mit" ist eine Dativ-Präposition. Immer Dativ: mit dem Mann, mit der Frau.' },
      { q: 'Was ist das Perfekt von "essen"?', opts: ['hat gegessen', 'hat geesst', 'ist gegessen', 'hat gegesst'], ans: 'hat gegessen', exp: 'Essen → hat gegessen. Unregelmäßiges Partizip II.' },
      { q: 'Setze ein: "Ich freue mich ___ das Geschenk."', opts: ['auf', 'über', 'für', 'an'], ans: 'über', exp: '"sich freuen über" + Akkusativ = sich über etwas Bestehendes freuen. "auf" = auf Zukünftiges.' },
      { q: 'Welches Modalverb bedeutet "dürfen"?', opts: ['Erlaubnis', 'Fähigkeit', 'Wunsch', 'Möglichkeit'], ans: 'Erlaubnis', exp: '"Dürfen" drückt Erlaubnis aus. "Können" = Fähigkeit, "wollen" = Wunsch, "mögen" = mögen.' },
    ],
    en: [
      { q: 'Choose the correct form: "She ___ to the store."', opts: ['go', 'goes', 'going', 'gone'], ans: 'goes', exp: 'Third person singular (she/he/it) takes -s in simple present: goes.' },
      { q: 'Which is correct: "fewer" or "less"?', opts: ['less problems', 'fewer problems', 'less problem', 'fewer problem'], ans: 'fewer problems', exp: 'Use "fewer" with countable nouns (problems) and "less" with uncountable nouns (water).' },
      { q: 'Complete: "If I ___ rich, I would travel."', opts: ['was', 'were', 'am', 'be'], ans: 'were', exp: 'In subjunctive/conditional clauses, use "were" for all persons: If I were, if she were.' },
      { q: 'Which tense: "I have been waiting for an hour."', opts: ['Present Perfect Continuous', 'Past Perfect', 'Present Continuous', 'Past Continuous'], ans: 'Present Perfect Continuous', exp: '"Have been + -ing" indicates an action that started in the past and continues to the present.' },
      { q: 'Choose correct: "Neither John ___ Mary is here."', opts: ['nor', 'or', 'and', 'but'], ans: 'nor', exp: '"Neither...nor" is the correct correlative conjunction pair. "Either...or" is the positive version.' },
      { q: 'What is the passive of "They built this house"?', opts: ['This house was built', 'This house is built', 'This house has been built', 'This house built'], ans: 'This house was built', exp: 'Passive voice: be + past participle. Past tense passive: was/were + past participle.' },
      { q: 'Choose: "I wish I ___ there."', opts: ['had been', 'was', 'am', 'will be'], ans: 'had been', exp: '"I wish" + past perfect expresses regret about a past situation. "I wish I had been there."' },
      { q: 'Which is a relative clause?', opts: ['The book that I read was great.', 'I read the book.', 'The book is great.', 'Reading is fun.'], ans: 'The book that I read was great.', exp: 'A relative clause uses "that/which/who" to modify a noun. "that I read" modifies "the book".' },
    ],
    it: [
      { q: 'Come si forma il plurale di "libro"?', opts: ['libros', 'libri', 'libre', 'libra'], ans: 'libri', exp: 'In italiano, i nomi maschili in -o formano il plurale in -i: libro → libri.' },
      { q: 'Qual è il passato prossimo di "andare" (io)?', opts: ['sono andato', 'ho andato', 'sono andare', 'ho andare'], ans: 'sono andato', exp: '"Andare" usa l\'ausiliare "essere": io sono andato/a.' },
      { q: 'Scegli l\'articolo: "___ studente"', opts: ['lo', 'il', 'la', 'l\''], ans: 'lo', exp: 'Si usa "lo" davanti a s+consonante: lo studente, lo sport.' },
      { q: 'Qual è il condizionale di "avere" (io)?', opts: ['avrei', 'avevo', 'avrò', 'abbia'], ans: 'avrei', exp: 'Il condizionale presente di avere: io avrei, tu avresti, lui avrebbe.' },
      { q: 'Completa: "Penso che lui ___ bravo."', opts: ['sia', 'è', 'sarà', 'era'], ans: 'sia', exp: 'Dopo "penso che" si usa il congiuntivo: sia (essere, congiuntivo presente).' },
      { q: 'Qual è il superlativo di "buono"?', opts: ['buonissimo', 'molto buono', 'più buono', 'il più buono'], ans: 'buonissimo', exp: 'Il superlativo assoluto di buono è "buonissimo" o "ottimo".' },
    ],
    pt: [
      { q: 'Qual é o plural de "irmão"?', opts: ['irmãos', 'irmões', 'irmanos', 'irmâos'], ans: 'irmãos', exp: 'A maioria das palavras em -ão forma o plural em -ãos: irmão → irmãos.' },
      { q: 'Qual é o pretérito de "falar" (eu)?', opts: ['falei', 'falou', 'falava', 'falarei'], ans: 'falei', exp: 'O pretérito perfeito de falar na 1ª pessoa é "falei". Verbos -ar regulares.' },
      { q: 'Escolha: "Eu ___ ao cinema ontem."', opts: ['fui', 'foi', 'ia', 'vou'], ans: 'fui', exp: 'O pretérito perfeito de "ir" é irregular: eu fui, você foi, nós fomos.' },
      { q: 'Qual é o artigo definido feminino?', opts: ['a', 'o', 'as', 'um'], ans: 'a', exp: 'Artigo definido feminino singular: a. Plural: as. Masculino: o/os.' },
      { q: 'Complete: "Espero que você ___ bem."', opts: ['esteja', 'está', 'estava', 'estará'], ans: 'esteja', exp: 'Depois de "espero que" usa-se o presente do subjuntivo: esteja.' },
      { q: 'Qual é o futuro de "fazer" (eu)?', opts: ['farei', 'fazerei', 'fiz', 'faço'], ans: 'farei', exp: 'O futuro de fazer é irregular: eu farei, você fará. Perde o "z".' },
    ],
    zh: [
      { q: '"把"字句的基本结构是？', opts: ['主+把+宾+动', '主+动+把+宾', '把+主+动+宾', '主+宾+把+动'], ans: '主+把+宾+动', exp: '把字句结构：主语+把+宾语+动词（+其他）。例：我把书放在桌上。' },
      { q: '"了"在句末表示什么？', opts: ['变化或新情况', '过去时', '进行中', '将来时'], ans: '变化或新情况', exp: '句末"了"表示情况变化或新状态出现。例：下雨了（开始下了）。' },
      { q: '"他比我高"中"比"是什么用法？', opts: ['比较句', '被动句', '比喻句', '把字句'], ans: '比较句', exp: '"比"是比较句的标志：A比B+形容词。表示A比B更…。' },
      { q: '"被"字句的语序是？', opts: ['受事+被+施事+动', '施事+被+受事+动', '被+受事+施事+动', '受事+动+被+施事'], ans: '受事+被+施事+动', exp: '被字句：受事主语+被+施事+动词+其他。例：书被我放在桌上了。' },
      { q: '"着"在动词后表示什么？', opts: ['动作持续或状态', '动作完成', '动作开始', '动作即将发生'], ans: '动作持续或状态', exp: '"着"表示动作或状态的持续。例：门开着（状态）、看着书（动作进行中）。' },
      { q: '"虽然…但是…"是什么关系？', opts: ['转折关系', '因果关系', '并列关系', '递进关系'], ans: '转折关系', exp: '"虽然…但是…"表示转折。前半句承认事实，后半句提出相反或不同的情况。' },
    ],
    ar: [
      { q: 'ما جمع كلمة "كتاب"؟', opts: ['كتابات', 'كتب', 'كتبان', 'كاتبون'], ans: 'كتب', exp: 'جمع "كتاب" هو "كتب" — وهو جمع تكسير شائع في العربية.' },
      { q: 'ما هو الفعل الماضي من "يكتب"؟', opts: ['كَتَبَ', 'يَكْتُبُ', 'اُكْتُبْ', 'كَاتِب'], ans: 'كَتَبَ', exp: 'الفعل الماضي من "يكتب" هو "كَتَبَ". المضارع: يكتب، الأمر: اكتب.' },
      { q: 'أي حرف جر يستخدم مع "ذهبت"؟', opts: ['إلى', 'في', 'على', 'من'], ans: 'إلى', exp: '"إلى" حرف جر يدل على الاتجاه أو الغاية: ذهبت إلى المدرسة.' },
      { q: 'ما هو المثنى من "طالب"؟', opts: ['طالبان', 'طالبين', 'طلاب', 'طالبات'], ans: 'طالبان', exp: 'المثنى المرفوع: طالبان. المنصوب والمجرور: طالبين.' },
      { q: '"إنَّ" تدخل على الجملة الاسمية فـ...', opts: ['تنصب المبتدأ', 'ترفع المبتدأ', 'تجر المبتدأ', 'لا تغيره'], ans: 'تنصب المبتدأ', exp: '"إنَّ" وأخواتها تنصب المبتدأ وترفع الخبر. إنَّ الطالبَ مجتهدٌ.' },
      { q: 'ما هو وزن الفعل "استعمل"؟', opts: ['استفعل', 'افتعل', 'تفاعل', 'انفعل'], ans: 'استفعل', exp: '"استعمل" على وزن "استفعل" الذي يفيد الطلب. استفعل = طلب الفعل.' },
    ],
  };
  const pool = banks[lang] || banks.en;
  const item = pool[seed % pool.length];
  const levelSuffix = level === 'advanced' ? ' (Advanced)' : level === 'intermediate' ? ' (Int.)' : '';
  return {
    id: `gen-grammar-${lang}-${seed}`,
    language_code: lang,
    level,
    type: 'grammar_error',
    question_text: item.q + (seed >= pool.length ? ` #${Math.floor(seed / pool.length) + 1}` : '') + levelSuffix,
    options: item.opts,
    correct_answer: item.ans,
    explanation: item.exp,
    audio_text: '',
  };
}

function makeListeningQ(lang: string, level: string, seed: number): Question {
  const banks: Record<string, Array<{ audio: string; q: string; opts: string[]; ans: string; exp: string }>> = {
    ja: [
      { audio: 'ありがとうございます', q: 'What does the speaker say?', opts: ['Thank you', 'Good morning', 'Excuse me', 'Goodbye'], ans: 'Thank you', exp: 'ありがとうございます means "Thank you very much" — the most formal expression of gratitude.' },
      { audio: 'すみません、トイレはどこですか', q: 'What is the speaker asking for?', opts: ['The toilet', 'The exit', 'The restaurant', 'The hotel'], ans: 'The toilet', exp: 'トイレはどこですか means "Where is the toilet?" — an essential travel phrase.' },
      { audio: 'おはようございます', q: 'When would you hear this?', opts: ['In the morning', 'At night', 'At lunch', 'When saying goodbye'], ans: 'In the morning', exp: 'おはようございます is "Good morning" (polite form). Used until around 10-11 AM.' },
      { audio: 'いくらですか', q: 'What is the speaker asking?', opts: ['How much is it?', 'Where is it?', 'What time is it?', 'Who is it?'], ans: 'How much is it?', exp: 'いくらですか = How much (does it cost)? Essential for shopping in Japan.' },
    ],
    fr: [
      { audio: "Où est la gare, s'il vous plaît ?", q: 'What is the speaker asking?', opts: ['Where is the station?', 'Where is the hotel?', 'Where is the restaurant?', 'Where is the airport?'], ans: 'Where is the station?', exp: "La gare = the (train) station. S'il vous plaît = please." },
      { audio: 'Je voudrais un café, s\'il vous plaît.', q: 'What does the speaker want?', opts: ['A coffee', 'A tea', 'A croissant', 'A water'], ans: 'A coffee', exp: '"Je voudrais" = I would like. "Un café" = a coffee. Polite ordering phrase.' },
      { audio: 'Quelle heure est-il ?', q: 'What is the speaker asking?', opts: ['What time is it?', 'Where is it?', 'How are you?', 'What is this?'], ans: 'What time is it?', exp: '"Quelle heure est-il ?" = What time is it? A very common daily phrase.' },
    ],
    ko: [
      { audio: '화장실이 어디에 있어요?', q: 'What is the speaker looking for?', opts: ['The bathroom', 'The exit', 'The bus stop', 'The pharmacy'], ans: 'The bathroom', exp: '화장실 = bathroom/toilet. 어디에 있어요 = where is it?' },
      { audio: '감사합니다!', q: 'What is the speaker expressing?', opts: ['Gratitude', 'Apology', 'Greeting', 'Farewell'], ans: 'Gratitude', exp: '감사합니다 = Thank you (formal). One of the most important Korean phrases.' },
      { audio: '이거 얼마예요?', q: 'What is the speaker asking about?', opts: ['The price', 'The time', 'The location', 'The name'], ans: 'The price', exp: '이거 얼마예요? = How much is this? Essential for shopping in Korea.' },
    ],
    es: [
      { audio: '¿Cuánto cuesta esto?', q: 'What is the speaker asking?', opts: ['How much does this cost?', 'Where is this?', 'What time is it?', 'How far is it?'], ans: 'How much does this cost?', exp: '¿Cuánto cuesta? = How much does it cost? Essential shopping phrase.' },
      { audio: 'Mucho gusto.', q: 'When would you hear this?', opts: ['When meeting someone', 'When leaving', 'When ordering food', 'When apologizing'], ans: 'When meeting someone', exp: '"Mucho gusto" = Nice to meet you. Standard greeting when being introduced.' },
      { audio: '¿Dónde está el baño?', q: 'What is the speaker looking for?', opts: ['The bathroom', 'The exit', 'The kitchen', 'The bedroom'], ans: 'The bathroom', exp: '"¿Dónde está el baño?" = Where is the bathroom? Essential travel phrase.' },
    ],
    de: [
      { audio: 'Wo ist der Bahnhof?', q: 'What is the speaker asking?', opts: ['Where is the train station?', 'Where is the bus stop?', 'Where is the hotel?', 'Where is the airport?'], ans: 'Where is the train station?', exp: 'Bahnhof = train station. Wo ist = where is.' },
      { audio: 'Guten Morgen! Wie geht es Ihnen?', q: 'What is this?', opts: ['A morning greeting', 'A farewell', 'An order', 'An apology'], ans: 'A morning greeting', exp: '"Guten Morgen" = Good morning. "Wie geht es Ihnen?" = How are you? (formal).' },
      { audio: 'Die Rechnung, bitte.', q: 'What does the speaker want?', opts: ['The bill', 'The menu', 'A drink', 'Directions'], ans: 'The bill', exp: '"Die Rechnung, bitte" = The bill/check, please. Essential restaurant phrase.' },
    ],
    en: [
      { audio: 'Could you repeat that, please?', q: 'What is the speaker requesting?', opts: ['Repetition', 'Help', 'Directions', 'A menu'], ans: 'Repetition', exp: '"Could you repeat that?" is a polite way to ask someone to say something again.' },
      { audio: 'I\'d like to make a reservation for two.', q: 'Where would you hear this?', opts: ['At a restaurant', 'At a hospital', 'At a school', 'At a gym'], ans: 'At a restaurant', exp: '"Make a reservation" is commonly used when booking a table at a restaurant.' },
      { audio: 'Excuse me, is this seat taken?', q: 'What is the speaker asking?', opts: ['If a seat is available', 'For directions', 'For the time', 'For the menu'], ans: 'If a seat is available', exp: '"Is this seat taken?" = Can I sit here? Common question in cafes, buses, etc.' },
    ],
    it: [
      { audio: 'Buongiorno! Come sta?', q: 'What is the speaker saying?', opts: ['Good morning, how are you?', 'Good evening, goodbye!', 'Hello, what is this?', 'Hi, where are you?'], ans: 'Good morning, how are you?', exp: '"Buongiorno" = Good morning/day. "Come sta?" = How are you? (formal).' },
      { audio: 'Il conto, per favore.', q: 'What does the speaker want?', opts: ['The bill', 'The menu', 'A reservation', 'A coffee'], ans: 'The bill', exp: '"Il conto, per favore" = The bill/check, please. Essential restaurant phrase in Italian.' },
    ],
    pt: [
      { audio: 'Bom dia! Tudo bem?', q: 'What is the speaker saying?', opts: ['Good morning, how are you?', 'Good night, sleep well!', 'Hello, where is it?', 'Hi, what is this?'], ans: 'Good morning, how are you?', exp: '"Bom dia" = Good morning. "Tudo bem?" = How are you? / Everything good? Very common greeting.' },
      { audio: 'A conta, por favor.', q: 'What does the speaker want?', opts: ['The bill', 'The menu', 'A drink', 'A taxi'], ans: 'The bill', exp: '"A conta, por favor" = The bill/check, please. Essential restaurant phrase in Portuguese.' },
    ],
    ar: [
      { audio: 'السلام عليكم', q: 'What is the speaker saying?', opts: ['Peace be upon you (greeting)', 'Goodbye', 'Thank you', 'How are you?'], ans: 'Peace be upon you (greeting)', exp: '"السلام عليكم" is the universal Islamic/Arabic greeting meaning "Peace be upon you."' },
      { audio: 'كم الساعة؟', q: 'What is the speaker asking?', opts: ['What time is it?', 'How much is it?', 'Where is it?', 'Who is this?'], ans: 'What time is it?', exp: '"كم الساعة؟" = What time is it? A very common daily question in Arabic.' },
    ],
    zh: [
      { audio: '你好，请问地铁站怎么走？', q: 'What is the speaker asking?', opts: ['Directions to the subway', 'The price of a ticket', 'The time of arrival', 'The weather'], ans: 'Directions to the subway', exp: '"怎么走" = How do I get there? "地铁站" = subway station. Common direction-asking phrase.' },
      { audio: '这个多少钱？', q: 'What is the speaker asking?', opts: ['The price', 'The time', 'The location', 'The name'], ans: 'The price', exp: '"多少钱" = How much money? The most common shopping question in Chinese.' },
    ],
    default: [
      { audio: 'Hello, how are you?', q: 'What did the speaker say?', opts: ['A greeting', 'A farewell', 'A question about directions', 'An apology'], ans: 'A greeting', exp: '"Hello, how are you?" is the most common English greeting.' },
    ],
  };
  const pool = banks[lang] || banks.default;
  const item = pool[seed % pool.length];
  return {
    id: `gen-listen-${lang}-${seed}`,
    language_code: lang,
    level,
    type: 'listening_choice',
    question_text: item.q,
    options: item.opts,
    correct_answer: item.ans,
    explanation: item.exp,
    audio_text: item.audio,
  };
}

// Generate a batch of N synthesized questions from templates
function generateQuestions(lang: string, level: string, startSeed: number, count: number): Question[] {
  const out: Question[] = [];
  for (let i = 0; i < count; i++) {
    const seed = startSeed + i;
    out.push(seed % 2 === 0 ? makeGrammarQ(lang, level, seed) : makeListeningQ(lang, level, seed));
  }
  return out;
}

export const ExamEngine: React.FC<ExamEngineProps> = ({ languageCode, languageName, level, onBack }) => {
  const [questions, setQuestions]   = useState<Question[]>([]);
  const [qIndex, setQIndex]         = useState(0);
  const [selected, setSelected]     = useState<string | null>(null);
  const [revealed, setRevealed]     = useState(false);
  const [score, setScore]           = useState(0);
  const [examType, setExamType]     = useState<string>('all');
  const [wrongLog, setWrongLog]     = useState<Array<{ q: Question; chosen: string }>>([]);
  const [timeLeft, setTimeLeft]     = useState(EXAM_DURATION);
  const [phase, setPhase]           = useState<'loading' | 'exam' | 'done'>('loading');
  const [showAnalysis, setShowAnalysis] = useState<string | null>(null);
  const [confetti, setConfetti]     = useState(false);
  const [levelFilter, setLevelFilter] = useState(level);
  const [loadingMore, setLoadingMore] = useState(false);
  const seedRef                     = useRef(0);
  const timerRef                    = useRef<ReturnType<typeof setInterval> | null>(null);
  const synthRef                    = useRef<SpeechSynthesisUtterance | null>(null);
  const sentinelRef                 = useRef<HTMLDivElement>(null);

  const loadQuestions = useCallback(async () => {
    setPhase('loading');
    seedRef.current = 0;

    const { data } = await supabase
      .from('exam_questions')
      .select('*')
      .eq('language_code', languageCode)
      .eq('level', levelFilter)
      .order('order_hint');

    let qs: Question[] = (data || []).map((r: Question & { options: unknown }) => {
      try {
        return {
          ...r,
          options: Array.isArray(r.options) ? r.options : JSON.parse(r.options as string || '[]'),
        };
      } catch {
        return { ...r, options: [] as string[] };
      }
    });

    // Pad with generated questions to ensure at least 10
    if (qs.length < 10) {
      const fill = generateQuestions(languageCode, levelFilter, 0, 10 - qs.length);
      qs = [...qs, ...fill];
      seedRef.current = fill.length;
    }

    qs.sort(() => Math.random() - 0.5);
    setQuestions(qs);
    setQIndex(0);
    setSelected(null);
    setRevealed(false);
    setScore(0);
    setWrongLog([]);
    setTimeLeft(EXAM_DURATION);
    setPhase('exam');
  }, [languageCode, levelFilter]);

  useEffect(() => { loadQuestions(); }, [loadQuestions]);

  // Countdown
  useEffect(() => {
    if (phase !== 'exam') return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current!); setPhase('done'); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  // Infinite scroll: observe sentinel near bottom
  useEffect(() => {
    if (phase !== 'exam') return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore) {
          loadMoreQuestions();
        }
      },
      { threshold: 0.1 }
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  });

  function loadMoreQuestions() {
    setLoadingMore(true);
    const newBatch = generateQuestions(languageCode, levelFilter, seedRef.current, 5);
    seedRef.current += 5;
    setTimeout(() => {
      setQuestions((prev) => [...prev, ...newBatch]);
      setLoadingMore(false);
    }, 400);
  }

  function speakText(text: string) {
    if (!text) return;
    speakWithPreset(text, languageCode).catch(() => {});
  }

  function handleSelect(opt: string) {
    if (revealed) return;
    setSelected(opt);
  }

  function handleReveal() {
    if (!selected || revealed) return;
    const q = questions[qIndex];
    setRevealed(true);
    if (selected === q.correct_answer) {
      setScore((s) => s + 1);
    } else {
      setWrongLog((w) => [...w, { q, chosen: selected }]);
    }
  }

  function handleNext() {
    if (qIndex + 1 >= questions.length) {
      if (timerRef.current) clearInterval(timerRef.current);
      setPhase('done');
      const pct = Math.round((score / Math.max(questions.length, 1)) * 100);
      if (pct >= 70) { setConfetti(true); setTimeout(() => setConfetti(false), 3000); }
    } else {
      setQIndex((i) => i + 1);
      setSelected(null);
      setRevealed(false);
    }
  }

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  if (phase === 'loading') {
    return (
      <div className="exam-loading">
        <FloatingBack onClick={onBack} />
        <div className="exam-spinner" />
        <p>Loading questions…</p>
      </div>
    );
  }

  if (phase === 'done') {
    return (
      <>
        <Confetti active={confetti} />
        <div className="exam-result-wrap">
          <FloatingBack onClick={onBack} />
          <div className="exam-result-card">
            <div className="exam-result-score-ring">
              <svg viewBox="0 0 80 80" width="120" height="120">
                <circle cx="40" cy="40" r="34" fill="none" stroke="#CFC9BF" strokeWidth="6" />
                <circle
                  cx="40" cy="40" r="34" fill="none"
                  stroke={pct >= 70 ? '#7A9B71' : pct >= 40 ? '#C9A574' : '#C9553D'}
                  strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={`${(pct / 100) * 213.6} 213.6`}
                  transform="rotate(-90 40 40)"
                />
                <text x="40" y="44" textAnchor="middle" fontSize="16" fontWeight="800" fill="#3F3C37">
                  {pct}%
                </text>
              </svg>
            </div>
            <h2 className="exam-result-title">
              {pct >= 70 ? '🎉 Excellent!' : pct >= 40 ? '👍 Good effort' : '💪 Keep going'}
            </h2>
            <p className="exam-result-sub">{score} / {questions.length} correct · {languageName}</p>

            {wrongLog.length > 0 && (
              <div className="exam-wrong-section">
                <h3 className="exam-wrong-title">AI Error Analysis · 错题解析</h3>
                {wrongLog.map(({ q, chosen }, i) => (
                  <div key={i} className="exam-wrong-card">
                    <div className="exam-wrong-q">
                      <span className={`exam-type-chip ${q.type}`}>{TYPE_LABELS[q.type]?.icon} {TYPE_LABELS[q.type]?.label}</span>
                      <p className="exam-wrong-qtext">{q.question_text}</p>
                    </div>
                    <div className="exam-wrong-answers">
                      <span className="exam-wrong-yours">✗ Your answer: {chosen}</span>
                      <span className="exam-wrong-correct">✓ Correct: {q.correct_answer}</span>
                    </div>
                    <button
                      className="exam-analysis-toggle"
                      onClick={() => setShowAnalysis(showAnalysis === q.id ? null : q.id)}
                    >
                      {showAnalysis === q.id ? 'Hide' : 'AI Deep Analysis 🤖'}
                    </button>
                    {showAnalysis === q.id && (
                      <div className="exam-analysis-panel"><p>{q.explanation}</p></div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="exam-result-actions">
              <button className="exam-retry-btn" onClick={loadQuestions}>Retry Exam 重新测试</button>
              <button className="exam-back-btn" onClick={onBack}>Back to Home</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const q = questions[qIndex];
  if (!q) return null;
  const typeInfo = TYPE_LABELS[q.type] || { icon: '❓', label: q.type };

  return (
    <>
      <Confetti active={confetti} />
      <div className="exam-wrap">
        <FloatingBack onClick={onBack} />

        <div className="exam-topbar">
          <div className="exam-meta">
            <span className="exam-lang">{languageName}</span>
            <span className="exam-level-chip">{levelFilter}</span>
          </div>
          <div className={`exam-timer ${timeLeft < 60 ? 'urgent' : ''}`}>⏱ {fmt(timeLeft)}</div>
          <div className="exam-score-display">✨ {score}/{questions.length}</div>
        </div>

        <div className="exam-level-row">
          {(['beginner', 'intermediate', 'advanced'] as const).map((lv) => (
            <button
              key={lv}
              className={`exam-lv-btn ${levelFilter === lv ? 'active' : ''}`}
              onClick={() => setLevelFilter(lv)}
            >
              {lv === 'beginner' ? '🌱' : lv === 'intermediate' ? '🌿' : '🎋'} {lv}
            </button>
          ))}
        </div>

        {/* 考试类型选择 */}
        <div className="exam-type-row-select">
          <span className="exam-type-label">📝 考试类型：</span>
          {EXAM_TYPES.map(et => (
            <button
              key={et.key}
              className={`exam-type-btn ${examType === et.key ? 'active' : ''}`}
              onClick={() => setExamType(et.key)}
            >
              {et.icon} {et.label}
            </button>
          ))}
        </div>

        <div className="exam-progress-bar">
          <div
            className="exam-progress-fill"
            style={{ width: `${((qIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
        <p className="exam-progress-text">{qIndex + 1} / {questions.length}</p>

        <div className="exam-question-card">
          <div className="exam-type-row">
            <span className={`exam-type-chip ${q.type}`}>
              {typeInfo.icon} {typeInfo.label}
            </span>
            {q.audio_text && (
              <button className="exam-speak-btn" onClick={() => speakText(q.audio_text)}>
                🔊 Play
              </button>
            )}
          </div>

          <p className="exam-q-text">{q.question_text}</p>

          <div className="exam-options">
            {q.options.map((opt: string) => {
              let cls = 'exam-opt';
              if (revealed) {
                if (opt === q.correct_answer) cls += ' correct';
                else if (opt === selected) cls += ' wrong';
              } else if (opt === selected) {
                cls += ' chosen';
              }
              return (
                <button key={opt} className={cls} onClick={() => handleSelect(opt)}>
                  {opt}
                </button>
              );
            })}
          </div>

          {revealed && (
            <div className="exam-explanation">
              <span className="exam-exp-label">💡 Explanation</span>
              <p>{q.explanation}</p>
            </div>
          )}
        </div>

        <div className="exam-action-row">
          {!revealed ? (
            <button className="exam-confirm-btn" disabled={!selected} onClick={handleReveal}>
              Confirm Answer
            </button>
          ) : (
            <button className="exam-next-btn" onClick={handleNext}>
              {qIndex + 1 >= questions.length ? 'See Results 查看结果' : 'Next Question →'}
            </button>
          )}
        </div>

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="exam-sentinel">
          {loadingMore && <div className="exam-load-more-row"><div className="exam-spinner-sm" /> Loading more…</div>}
        </div>
      </div>
    </>
  );
};
