import { getProviderSync } from '../providers';

// 延迟获取 data provider，避免模块初始化时序问题
function dp() { try { return getProviderSync().data; } catch { throw new Error('[QuestionGenerator] Provider not available'); } }

export type QuestionType = 'single_choice' | 'fill_blank' | 'reading';
export type QuestionDifficulty = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface Question {
  id: string;
  type: QuestionType;
  language: string;
  difficulty: QuestionDifficulty;
  topic: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  timestamp: number;
}

interface GrammarRule {
  id: string;
  topic: string;
  pattern: string;
  examples: string[];
  difficulty: QuestionDifficulty;
}

interface VocabItem {
  word: string;
  translation: string;
  partOfSpeech: string;
  example: string;
}

class QuestionGenerator {
  private grammarRules: Record<string, GrammarRule[]> = {};
  private vocabCache: Record<string, VocabItem[]> = {};
  private initialized = false;

  private grammarTemplates: Record<string, { template: string; difficulty: QuestionDifficulty }[]> = {
    en: [
      {
        template: 'Choose the correct form of the verb: She ___ to school every day. (go/goes/went/going)',
        difficulty: 1,
      },
      {
        template: 'Choose the correct tense: By next year, I ___ my degree. (will finish/will have finished/finished)',
        difficulty: 5,
      },
      {
        template: 'Choose the correct preposition: He is good ___ math. (at/in/on/for)',
        difficulty: 2,
      },
      {
        template: 'Choose the correct article: I saw ___ interesting movie yesterday. (a/an/the/)',
        difficulty: 1,
      },
      {
        template: 'Choose the correct pronoun: ___ is my friend. (He/His/Him)',
        difficulty: 1,
      },
      {
        template: 'Choose the correct form: The weather is getting ___ . (cold/colder/coldest)',
        difficulty: 2,
      },
      {
        template: 'Choose the correct conjunction: I like coffee ___ I dont like tea. (but/and/or)',
        difficulty: 1,
      },
      {
        template: 'Choose the correct passive form: The letter ___ yesterday. (was sent/sent/is sent)',
        difficulty: 4,
      },
      {
        template: 'Choose the correct modal: You ___ study hard for the exam. (should/must/can)',
        difficulty: 2,
      },
      {
        template: 'Choose the correct conditional: If I ___ rich, I would travel. (am/was/were)',
        difficulty: 6,
      },
    ],
    ja: [
      {
        template: '正しい助詞を選んでください：私___学生です。(は/が/を/に)',
        difficulty: 1,
      },
      {
        template: '正しい動詞形を選んでください：毎朝7時に___。(起きる/起きます/起きた)',
        difficulty: 2,
      },
      {
        template: '正しい敬語を選んでください：社長は明日___。(来る/来ます/いらっしゃる)',
        difficulty: 6,
      },
      {
        template: '正しい否定形を選んでください：学校に___。(行かない/行くない/行ない)',
        difficulty: 2,
      },
      {
        template: '正しい過去形を選んでください：昨日、公園で___。(遊ぶ/遊んだ/遊びました)',
        difficulty: 3,
      },
    ],
    ko: [
      {
        template: '옳은 조사를 선택하세요: 저___ 학생입니다. (은/는/이/가)',
        difficulty: 1,
      },
      {
        template: '옳은 동사 형태를 선택하세요: 매일 아침 7시에___. (일어나다/일어납니다/일어났다)',
        difficulty: 2,
      },
      {
        template: '옳은 격식 표현을 선택하세요: 선생님께서는 내일___. (오다/오십니다/오셨다)',
        difficulty: 6,
      },
    ],
    fr: [
      {
        template: 'Choisissez la bonne forme: Je ___ étudiant. (suis/est/ai)',
        difficulty: 1,
      },
      {
        template: 'Choisissez le bon verbe: Il ___ au travail. (aller/va/allons)',
        difficulty: 2,
      },
      {
        template: 'Choisissez le bon article: Jai vu ___ film intéressant. (un/une/le)',
        difficulty: 2,
      },
    ],
    es: [
      {
        template: 'Elige la forma correcta: Yo ___ estudiante. (soy/estoy/son)',
        difficulty: 1,
      },
      {
        template: 'Elige el verbo correcto: Ella ___ a la escuela. (ir/va/vamos)',
        difficulty: 2,
      },
    ],
    de: [
      {
        template: 'Wähle die richtige Form: Ich ___ Student. (bin/ist/sind)',
        difficulty: 1,
      },
      {
        template: 'Wähle das richtige Verb: Er ___ zur Schule. (gehen/geht/gehe)',
        difficulty: 2,
      },
    ],
    it: [
      {
        template: 'Scegli la forma corretta: Io ___ studente. (sono/sei/è)',
        difficulty: 1,
      },
      {
        template: 'Scegli il verbo corretto: Lei ___ a scuola. (andare/va/vanno)',
        difficulty: 2,
      },
      {
        template: 'Scegli l\'articolo corretto: ___ libro è interessante. (Il/Lo/La)',
        difficulty: 2,
      },
    ],
    pt: [
      {
        template: 'Escolha a forma correta: Eu ___ estudante. (sou/é/estou)',
        difficulty: 1,
      },
      {
        template: 'Escolha o verbo correto: Ela ___ para a escola. (ir/vai/vamos)',
        difficulty: 2,
      },
      {
        template: 'Escolha o artigo correto: ___ livro é interessante. (O/A/Os)',
        difficulty: 2,
      },
    ],
    ar: [
      {
        template: 'اختر الصيغة الصحيحة: أنا ___ طالب. (أكون/يكون/تكون)',
        difficulty: 1,
      },
      {
        template: 'اختر الفعل الصحيح: هو ___ إلى المدرسة. (يذهب/تذهب/أذهب)',
        difficulty: 2,
      },
      {
        template: 'اختر حرف الجر الصحيح: ذهبت ___ المدرسة. (إلى/على/في)',
        difficulty: 2,
      },
    ],
    zh: [
      {
        template: '选择正确的量词：一___书。(本/个/只/张)',
        difficulty: 1,
      },
      {
        template: '选择正确的"的/地/得"：他跑___很快。(的/地/得)',
        difficulty: 3,
      },
      {
        template: '选择正确的词语：这个苹果很___。(好吃/好吃吗/好吃吧)',
        difficulty: 1,
      },
    ],
  };

  private topicKeywords: Record<string, string[]> = {
    en: ['verb tenses', 'prepositions', 'articles', 'pronouns', 'comparatives', 'conjunctions', 'passive voice', 'modals', 'conditionals', 'vocabulary'],
    ja: ['助詞', '動詞活用', '敬語', '否定形', '過去形', '現在形', '未来形', '名詞', '形容詞', '副詞'],
    ko: ['조사', '동사 활용', '격식 표현', '비격식 표현', '과거형', '현재형', '미래형'],
    fr: ['verbes', 'articles', 'adjectifs', 'prépositions', 'passé composé', 'imparfait'],
    es: ['verbos', 'artículos', 'adjetivos', 'preposiciones', 'pretérito', 'imperfecto'],
    de: ['Verben', 'Artikel', 'Adjektive', 'Präpositionen', 'Präteritum', 'Perfekt'],
    it: ['verbi', 'articoli', 'aggettivi', 'preposizioni', 'passato prossimo', 'imperfetto'],
    pt: ['verbos', 'artigos', 'adjetivos', 'preposições', 'pretérito perfeito', 'imperfeito'],
    ar: ['أفعال', 'حروف جر', 'صفات', 'أسماء', 'مذكر ومؤنث', 'جمع'],
    zh: ['量词', '动词', '形容词', '副词', '连词', '语气词', '的得地'],
  };

  private async initialize(): Promise<void> {
    if (this.initialized) return;
    
    await this.loadVocabFromDB();
    this.initialized = true;
  }

  private async loadVocabFromDB(): Promise<void> {
    const languages = ['en', 'ja', 'ko', 'fr', 'es', 'de', 'it', 'pt', 'ar', 'zh'];
    
    for (const lang of languages) {
      try {
        const { data, error } = await supabase
          .from('contents')
          .select('content, translation')
          .eq('type', 'vocab')
          .eq('language', lang)
          .limit(100);

        if (!error && data && data.length > 0) {
          this.vocabCache[lang] = data.map(item => ({
            word: item.content,
            translation: item.translation || '',
            partOfSpeech: '',
            example: '',
          }));
        }
      } catch {
        // Offline: try localStorage fallback
        this.loadVocabFromLocalStorage(lang);
      }
    }
    
    // If any language still has no vocab, try offline data
    for (const lang of languages) {
      if (!this.vocabCache[lang] || this.vocabCache[lang].length === 0) {
        this.loadVocabFromLocalStorage(lang);
      }
    }
  }

  private loadVocabFromLocalStorage(lang: string): void {
    try {
      const cache = JSON.parse(localStorage.getItem('ai_question_vocab_cache') || '{}');
      if (cache[lang] && cache[lang].length > 0) {
        this.vocabCache[lang] = cache[lang];
        return;
      }
    } catch { /* ignore */ }
    
    // Fallback to built-in vocab
    const fallbackVocab: Record<string, VocabItem[]> = {
      en: [
        { word: 'beautiful', translation: '美丽的', partOfSpeech: 'adjective', example: 'The sunset is beautiful.' },
        { word: 'important', translation: '重要的', partOfSpeech: 'adjective', example: 'This is very important.' },
        { word: 'different', translation: '不同的', partOfSpeech: 'adjective', example: 'They are different.' },
        { word: 'together', translation: '一起', partOfSpeech: 'adverb', example: 'Let\'s go together.' },
        { word: 'remember', translation: '记得', partOfSpeech: 'verb', example: 'Remember to call me.' },
        { word: 'problem', translation: '问题', partOfSpeech: 'noun', example: 'No problem at all.' },
        { word: 'understand', translation: '理解', partOfSpeech: 'verb', example: 'I understand now.' },
        { word: 'experience', translation: '经验', partOfSpeech: 'noun', example: 'Good experience.' },
        { word: 'decision', translation: '决定', partOfSpeech: 'noun', example: 'Make a decision.' },
        { word: 'opportunity', translation: '机会', partOfSpeech: 'noun', example: 'Great opportunity.' },
      ],
      ja: [
        { word: '美しい', translation: '美丽的', partOfSpeech: 'adjective', example: '美しい花ですね。' },
        { word: '大切', translation: '重要的', partOfSpeech: 'adjective', example: 'これは大切です。' },
        { word: '違う', translation: '不同的', partOfSpeech: 'verb', example: '意見が違います。' },
        { word: '一緒に', translation: '一起', partOfSpeech: 'adverb', example: '一緒に行きましょう。' },
        { word: '覚える', translation: '记住', partOfSpeech: 'verb', example: '単語を覚える。' },
        { word: '問題', translation: '问题', partOfSpeech: 'noun', example: '問題を解く。' },
        { word: '経験', translation: '经验', partOfSpeech: 'noun', example: 'いい経験です。' },
        { word: '決める', translation: '决定', partOfSpeech: 'verb', example: '自分で決める。' },
        { word: '機会', translation: '机会', partOfSpeech: 'noun', example: 'いい機会です。' },
        { word: '頑張る', translation: '努力', partOfSpeech: 'verb', example: '一緒に頑張ろう！' },
      ],
      ko: [
        { word: '아름답다', translation: '美丽的', partOfSpeech: 'adjective', example: '꽃이 아름답습니다.' },
        { word: '중요하다', translation: '重要的', partOfSpeech: 'adjective', example: '이것은 중요합니다.' },
        { word: '다르다', translation: '不同的', partOfSpeech: 'adjective', example: '의견이 다릅니다.' },
        { word: '함께', translation: '一起', partOfSpeech: 'adverb', example: '함께 갑시다.' },
        { word: '기억하다', translation: '记住', partOfSpeech: 'verb', example: '단어를 기억하세요.' },
        { word: '문제', translation: '问题', partOfSpeech: 'noun', example: '문제를 풀어요.' },
        { word: '경험', translation: '经验', partOfSpeech: 'noun', example: '좋은 경험입니다.' },
        { word: '결정하다', translation: '决定', partOfSpeech: 'verb', example: '빨리 결정하세요.' },
        { word: '기회', translation: '机会', partOfSpeech: 'noun', example: '좋은 기회입니다.' },
        { word: '노력하다', translation: '努力', partOfSpeech: 'verb', example: '열심히 노력하세요.' },
      ],
      fr: [
        { word: 'important', translation: '重要的', partOfSpeech: 'adjective', example: 'C\'est très important.' },
        { word: 'ensemble', translation: '一起', partOfSpeech: 'adverb', example: 'Allons-y ensemble.' },
        { word: 'différent', translation: '不同的', partOfSpeech: 'adjective', example: 'Ils sont différents.' },
        { word: 'comprendre', translation: '理解', partOfSpeech: 'verb', example: 'Je comprends maintenant.' },
        { word: 'expérience', translation: '经验', partOfSpeech: 'noun', example: 'Bonne expérience.' },
        { word: 'décision', translation: '决定', partOfSpeech: 'noun', example: 'Prends une décision.' },
        { word: 'opportunité', translation: '机会', partOfSpeech: 'noun', example: 'Belle opportunité.' },
        { word: 'problème', translation: '问题', partOfSpeech: 'noun', example: 'Pas de problème.' },
        { word: 'souvenir', translation: '记住', partOfSpeech: 'verb', example: 'Je me souviens.' },
        { word: 'beau', translation: '美丽的', partOfSpeech: 'adjective', example: 'C\'est très beau.' },
      ],
      es: [
        { word: 'importante', translation: '重要的', partOfSpeech: 'adjective', example: 'Esto es muy importante.' },
        { word: 'juntos', translation: '一起', partOfSpeech: 'adverb', example: 'Vamos juntos.' },
        { word: 'diferente', translation: '不同的', partOfSpeech: 'adjective', example: 'Son diferentes.' },
        { word: 'entender', translation: '理解', partOfSpeech: 'verb', example: 'Ahora entiendo.' },
        { word: 'experiencia', translation: '经验', partOfSpeech: 'noun', example: 'Buena experiencia.' },
        { word: 'decisión', translation: '决定', partOfSpeech: 'noun', example: 'Toma una decisión.' },
        { word: 'oportunidad', translation: '机会', partOfSpeech: 'noun', example: 'Gran oportunidad.' },
        { word: 'problema', translation: '问题', partOfSpeech: 'noun', example: 'No hay problema.' },
        { word: 'recordar', translation: '记住', partOfSpeech: 'verb', example: 'Recuerda llamarme.' },
        { word: 'hermoso', translation: '美丽的', partOfSpeech: 'adjective', example: 'Es muy hermoso.' },
      ],
      de: [
        { word: 'wichtig', translation: '重要的', partOfSpeech: 'adjective', example: 'Das ist sehr wichtig.' },
        { word: 'zusammen', translation: '一起', partOfSpeech: 'adverb', example: 'Lass uns zusammen gehen.' },
        { word: 'verschieden', translation: '不同的', partOfSpeech: 'adjective', example: 'Sie sind verschieden.' },
        { word: 'verstehen', translation: '理解', partOfSpeech: 'verb', example: 'Ich verstehe jetzt.' },
        { word: 'Erfahrung', translation: '经验', partOfSpeech: 'noun', example: 'Gute Erfahrung.' },
        { word: 'Entscheidung', translation: '决定', partOfSpeech: 'noun', example: 'Triff eine Entscheidung.' },
        { word: 'Gelegenheit', translation: '机会', partOfSpeech: 'noun', example: 'Große Gelegenheit.' },
        { word: 'Problem', translation: '问题', partOfSpeech: 'noun', example: 'Kein Problem.' },
        { word: 'erinnern', translation: '记住', partOfSpeech: 'verb', example: 'Erinnere dich daran.' },
        { word: 'schön', translation: '美丽的', partOfSpeech: 'adjective', example: 'Das ist sehr schön.' },
      ],
      it: [
        { word: 'importante', translation: '重要的', partOfSpeech: 'adjective', example: 'È molto importante.' },
        { word: 'insieme', translation: '一起', partOfSpeech: 'adverb', example: 'Andiamo insieme.' },
        { word: 'diverso', translation: '不同的', partOfSpeech: 'adjective', example: 'Sono diversi.' },
        { word: 'capire', translation: '理解', partOfSpeech: 'verb', example: 'Ora capisco.' },
        { word: 'esperienza', translation: '经验', partOfSpeech: 'noun', example: 'Buona esperienza.' },
        { word: 'decisione', translation: '决定', partOfSpeech: 'noun', example: 'Prendi una decisione.' },
        { word: 'opportunità', translation: '机会', partOfSpeech: 'noun', example: 'Grande opportunità.' },
        { word: 'problema', translation: '问题', partOfSpeech: 'noun', example: 'Nessun problema.' },
        { word: 'ricordare', translation: '记住', partOfSpeech: 'verb', example: 'Ricorda di chiamarmi.' },
        { word: 'bello', translation: '美丽的', partOfSpeech: 'adjective', example: 'È molto bello.' },
      ],
      pt: [
        { word: 'importante', translation: '重要的', partOfSpeech: 'adjective', example: 'É muito importante.' },
        { word: 'juntos', translation: '一起', partOfSpeech: 'adverb', example: 'Vamos juntos.' },
        { word: 'diferente', translation: '不同的', partOfSpeech: 'adjective', example: 'São diferentes.' },
        { word: 'entender', translation: '理解', partOfSpeech: 'verb', example: 'Agora entendo.' },
        { word: 'experiência', translation: '经验', partOfSpeech: 'noun', example: 'Boa experiência.' },
        { word: 'decisão', translation: '决定', partOfSpeech: 'noun', example: 'Tome uma decisão.' },
        { word: 'oportunidade', translation: '机会', partOfSpeech: 'noun', example: 'Grande oportunidade.' },
        { word: 'problema', translation: '问题', partOfSpeech: 'noun', example: 'Sem problema.' },
        { word: 'lembrar', translation: '记住', partOfSpeech: 'verb', example: 'Lembre de me ligar.' },
        { word: 'bonito', translation: '美丽的', partOfSpeech: 'adjective', example: 'É muito bonito.' },
      ],
      ar: [
        { word: 'مهم', translation: '重要的', partOfSpeech: 'adjective', example: 'هذا مهم جداً.' },
        { word: 'معاً', translation: '一起', partOfSpeech: 'adverb', example: 'لنذهب معاً.' },
        { word: 'مختلف', translation: '不同的', partOfSpeech: 'adjective', example: 'هم مختلفون.' },
        { word: 'يفهم', translation: '理解', partOfSpeech: 'verb', example: 'أفهم الآن.' },
        { word: 'خبرة', translation: '经验', partOfSpeech: 'noun', example: 'خبرة جيدة.' },
        { word: 'قرار', translation: '决定', partOfSpeech: 'noun', example: 'اتخذ قراراً.' },
        { word: 'فرصة', translation: '机会', partOfSpeech: 'noun', example: 'فرصة عظيمة.' },
        { word: 'مشكلة', translation: '问题', partOfSpeech: 'noun', example: 'لا مشكلة.' },
        { word: 'يتذكر', translation: '记住', partOfSpeech: 'verb', example: 'تذكر أن تتصل بي.' },
        { word: 'جميل', translation: '美丽的', partOfSpeech: 'adjective', example: 'هذا جميل جداً.' },
      ],
      zh: [
        { word: '重要', translation: 'important', partOfSpeech: 'adjective', example: '这件事很重要。' },
        { word: '一起', translation: 'together', partOfSpeech: 'adverb', example: '我们一起走吧。' },
        { word: '不同', translation: 'different', partOfSpeech: 'adjective', example: '他们完全不同。' },
        { word: '理解', translation: 'understand', partOfSpeech: 'verb', example: '我现在理解了。' },
        { word: '经验', translation: 'experience', partOfSpeech: 'noun', example: '很好的经验。' },
        { word: '决定', translation: 'decision', partOfSpeech: 'noun', example: '请做出决定。' },
        { word: '机会', translation: 'opportunity', partOfSpeech: 'noun', example: '这是个好机会。' },
        { word: '问题', translation: 'problem', partOfSpeech: 'noun', example: '没问题。' },
        { word: '记得', translation: 'remember', partOfSpeech: 'verb', example: '记得给我打电话。' },
        { word: '美丽', translation: 'beautiful', partOfSpeech: 'adjective', example: '这里很美丽。' },
      ],
    };
    
    if (fallbackVocab[lang]) {
      this.vocabCache[lang] = fallbackVocab[lang];
    }
  }

  private async saveQuestionToDatabase(question: Question): Promise<void> {
    // Save to localStorage for offline resilience
    try {
      const localCache = JSON.parse(localStorage.getItem('ai_question_cache') || '{}');
      const key = `${question.language}_${question.type}`;
      if (!localCache[key]) localCache[key] = [];
      localCache[key].push({
        id: question.id, type: question.type, language: question.language,
        difficulty: question.difficulty, topic: question.topic,
        question: question.question, options: question.options,
        correctAnswer: question.correctAnswer, explanation: question.explanation,
        source: 'ai_generated', created_at: new Date().toISOString(),
      });
      if (localCache[key].length > 50) localCache[key] = localCache[key].slice(-50);
      localStorage.setItem('ai_question_cache', JSON.stringify(localCache));
      
      // Also cache vocab for offline usage
      if (question.topic === 'vocabulary') {
        const vocabCache = JSON.parse(localStorage.getItem('ai_question_vocab_cache') || '{}');
        if (!vocabCache[question.language]) vocabCache[question.language] = [];
        const exists = vocabCache[question.language].some((v: VocabItem) => 
          v.word === question.correctAnswer || v.translation === question.correctAnswer
        );
        if (!exists) {
          vocabCache[question.language].push({
            word: question.correctAnswer,
            translation: question.correctAnswer,
            partOfSpeech: '',
            example: '',
          });
        }
        if (vocabCache[question.language].length > 100) {
          vocabCache[question.language] = vocabCache[question.language].slice(-100);
        }
        localStorage.setItem('ai_question_vocab_cache', JSON.stringify(vocabCache));
      }
    } catch { /* ignore localStorage errors */ }

    // Try to save to database via provider
    try {
      await dp().insert('questions', [{
        id: question.id,
        type: question.type,
        language: question.language,
        difficulty: question.difficulty,
        topic: question.topic,
        question: question.question,
        options: question.options ? JSON.stringify(question.options) : null,
        correct_answer: question.correctAnswer,
        explanation: question.explanation,
        source: 'ai_generated',
      }]);

      if (error) {
        console.warn('Failed to save question to database:', error);
      }
    } catch (e) {
      console.warn('Error saving question to database (offline, cached locally):', e);
    }
  }

  private generateId(): string {
    return `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private generateSingleChoice(language: string, difficulty: QuestionDifficulty, topic: string): Question {
    const templates = this.grammarTemplates[language] || this.grammarTemplates.en;
    const filteredTemplates = templates.filter(t => t.difficulty <= difficulty);
    const template = filteredTemplates[Math.floor(Math.random() * filteredTemplates.length)];
    
    const parts = template.template.split('(');
    const questionPart = parts[0].trim();
    const optionsStr = parts[1]?.replace(')', '').trim() || 'a/b/c/d';
    const options = optionsStr.split('/');
    
    const correctIndex = Math.floor(Math.random() * options.length);
    const correctAnswer = options[correctIndex];
    
    return {
      id: this.generateId(),
      type: 'single_choice',
      language,
      difficulty,
      topic,
      question: questionPart,
      options: this.shuffleArray([...options]),
      correctAnswer,
      explanation: `This question tests your understanding of ${topic}`,
      timestamp: Date.now(),
    };
  }

  private generateFillBlank(language: string, difficulty: QuestionDifficulty, topic: string): Question {
    const vocab = this.vocabCache[language] || [];
    
    if (vocab.length === 0) {
      return this.generateSingleChoice(language, difficulty, topic);
    }
    
    const randomVocab = vocab[Math.floor(Math.random() * vocab.length)];
    
    const sentences: Record<string, string[]> = {
      en: [
        `The word "${randomVocab.word}" means ____ in Chinese.`,
        `Translate: ${randomVocab.word} -> ____`,
        `What is the meaning of "${randomVocab.word}"? ____`,
      ],
      ja: [
        `${randomVocab.word} の意味は何ですか？ ____`,
        `${randomVocab.word} を中国語に訳してください： ____`,
      ],
      ko: [
        `${randomVocab.word} 의 의미는 무엇인가요? ____`,
        `${randomVocab.word} 를 중국어로 번역하세요: ____`,
      ],
      fr: [
        `Que signifie "${randomVocab.word}"? ____`,
        `Traduisez: ${randomVocab.word} -> ____`,
      ],
      es: [
        `¿Qué significa "${randomVocab.word}"? ____`,
        `Traduce: ${randomVocab.word} -> ____`,
      ],
      de: [
        `Was bedeutet "${randomVocab.word}"? ____`,
        `Übersetzen: ${randomVocab.word} -> ____`,
      ],
      it: [
        `Cosa significa "${randomVocab.word}"? ____`,
        `Traduci: ${randomVocab.word} -> ____`,
      ],
      pt: [
        `O que significa "${randomVocab.word}"? ____`,
        `Traduza: ${randomVocab.word} -> ____`,
      ],
      ar: [
        `ما معنى "${randomVocab.word}"؟ ____`,
        `ترجم: ${randomVocab.word} -> ____`,
      ],
      zh: [
        `"${randomVocab.word}" 的英文意思是什么？ ____`,
        `翻译："${randomVocab.word}" -> ____`,
      ],
    };
    
    const sentenceList = sentences[language] || sentences.en;
    const question = sentenceList[Math.floor(Math.random() * sentenceList.length)];
    
    return {
      id: this.generateId(),
      type: 'fill_blank',
      language,
      difficulty,
      topic: 'vocabulary',
      question,
      correctAnswer: randomVocab.translation,
      explanation: `"${randomVocab.word}" means "${randomVocab.translation}"`,
      timestamp: Date.now(),
    };
  }

  private generateReading(language: string, difficulty: QuestionDifficulty, topic: string): Question {
    const passages: Record<string, { text: string; questions: { question: string; answer: string }[] }[]> = {
      en: [
        {
          text: 'The Internet has changed the way we communicate. Today, people can send messages, share photos, and video call with friends and family anywhere in the world. Social media platforms like Facebook and Twitter allow us to stay connected with others instantly.',
          questions: [
            { question: 'What has changed the way we communicate?', answer: 'The Internet' },
            { question: 'What do social media platforms allow us to do?', answer: 'Stay connected with others instantly' },
          ],
        },
      ],
      ja: [
        {
          text: 'インターネットは私たちのコミュニケーションの方法を変えました。今日、人々は世界中のどこからでもメッセージを送信したり、写真を共有したり、家族や友達とビデオ通話をすることができます。',
          questions: [
            { question: '私たちのコミュニケーションの方法を変えたものは何ですか？', answer: 'インターネット' },
          ],
        },
      ],
      ko: [
        {
          text: '인터넷은 우리의 소통 방식을 바꾸었습니다. 오늘날 사람들은 전 세계 어디에서나 메시지를 보내고 사진을 공유하며 가족 및 친구와 영상 통화를 할 수 있습니다.',
          questions: [
            { question: '우리의 소통 방식을 바꾼 것은 무엇인가요?', answer: '인터넷' },
          ],
        },
      ],
      fr: [
        {
          text: 'Internet a changé notre façon de communiquer. Aujourd\'hui, les gens peuvent envoyer des messages, partager des photos et faire des appels vidéo avec leur famille et leurs amis partout dans le monde.',
          questions: [
            { question: 'Qu\'est-ce qui a changé notre façon de communiquer?', answer: 'Internet' },
          ],
        },
      ],
      es: [
        {
          text: 'Internet ha cambiado nuestra forma de comunicarnos. Hoy en día, las personas pueden enviar mensajes, compartir fotos y hacer videollamadas con familiares y amigos en cualquier parte del mundo.',
          questions: [
            { question: '¿Qué ha cambiado nuestra forma de comunicarnos?', answer: 'Internet' },
          ],
        },
      ],
      de: [
        {
          text: 'Das Internet hat unsere Art zu kommunizieren verändert. Heute können Menschen Nachrichten senden, Fotos teilen und Videoanrufe mit Familie und Freunden überall auf der Welt führen.',
          questions: [
            { question: 'Was hat unsere Art zu kommunizieren verändert?', answer: 'Das Internet' },
          ],
        },
      ],
      it: [
        {
          text: 'Internet ha cambiato il nostro modo di comunicare. Oggi le persone possono inviare messaggi, condividere foto e fare videochiamate con familiari e amici in tutto il mondo.',
          questions: [
            { question: 'Cosa ha cambiato il nostro modo di comunicare?', answer: 'Internet' },
          ],
        },
      ],
      pt: [
        {
          text: 'A Internet mudou a nossa forma de comunicar. Hoje, as pessoas podem enviar mensagens, partilhar fotos e fazer videochamadas com familiares e amigos em qualquer parte do mundo.',
          questions: [
            { question: 'O que mudou a nossa forma de comunicar?', answer: 'A Internet' },
          ],
        },
      ],
      ar: [
        {
          text: 'غير الإنترنت طريقة تواصلنا. اليوم، يمكن للناس إرسال الرسائل ومشاركة الصور وإجراء مكالمات الفيديو مع العائلة والأصدقاء في أي مكان في العالم.',
          questions: [
            { question: 'ما الذي غير طريقة تواصلنا؟', answer: 'الإنترنت' },
          ],
        },
      ],
      zh: [
        {
          text: '互联网改变了我们的沟通方式。如今，人们可以在世界任何地方发送信息、分享照片、与家人朋友视频通话。社交媒体让我们随时随地保持联系。',
          questions: [
            { question: '什么改变了我们的沟通方式？', answer: '互联网' },
          ],
        },
      ],
    };
    
    const passageList = passages[language] || passages.en;
    const passage = passageList[Math.floor(Math.random() * passageList.length)];
    const q = passage.questions[Math.floor(Math.random() * passage.questions.length)];
    
    return {
      id: this.generateId(),
      type: 'reading',
      language,
      difficulty,
      topic: 'reading comprehension',
      question: `${passage.text}\n\nQuestion: ${q.question}`,
      correctAnswer: q.answer,
      explanation: `This reading comprehension question tests your understanding of the passage about technology.`,
      timestamp: Date.now(),
    };
  }

  public async generate(
    language: string,
    type: QuestionType = 'single_choice',
    difficulty: QuestionDifficulty = 3,
    topic?: string
  ): Promise<Question> {
    await this.initialize();

    const topics = this.topicKeywords[language] || this.topicKeywords.en;
    const selectedTopic = topic || topics[Math.floor(Math.random() * topics.length)];

    let question: Question;
    switch (type) {
      case 'single_choice':
        question = this.generateSingleChoice(language, difficulty, selectedTopic);
        break;
      case 'fill_blank':
        question = this.generateFillBlank(language, difficulty, selectedTopic);
        break;
      case 'reading':
        question = this.generateReading(language, difficulty, selectedTopic);
        break;
      default:
        question = this.generateSingleChoice(language, difficulty, selectedTopic);
        break;
    }

    // Auto-save AI-generated questions to database + localStorage
    this.saveQuestionToDatabase(question).catch(() => {});

    return question;
  }

  public async generateBatch(
    language: string,
    count: number = 10,
    type: QuestionType = 'single_choice',
    difficulty: QuestionDifficulty = 3,
    topic?: string
  ): Promise<Question[]> {
    const questions: Question[] = [];
    
    for (let i = 0; i < count; i++) {
      const q = await this.generate(language, type, difficulty, topic);
      questions.push(q);
    }
    
    // Batch save all questions
    Promise.all(questions.map(q => this.saveQuestionToDatabase(q).catch(() => {}))).catch(() => {});
    
    return questions;
  }
}

export const questionGenerator = new QuestionGenerator();

export async function createQuestion(
  language: string,
  type: QuestionType = 'single_choice',
  difficulty: QuestionDifficulty = 3,
  topic?: string
): Promise<Question> {
  return questionGenerator.generate(language, type, difficulty, topic);
}

export async function createQuestionBatch(
  language: string,
  count: number = 10,
  type: QuestionType = 'single_choice',
  difficulty: QuestionDifficulty = 3,
  topic?: string
): Promise<Question[]> {
  return questionGenerator.generateBatch(language, count, type, difficulty, topic);
}