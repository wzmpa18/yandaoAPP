import { supabase } from '../data/supabase';

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
  };

  private topicKeywords: Record<string, string[]> = {
    en: ['verb tenses', 'prepositions', 'articles', 'pronouns', 'comparatives', 'conjunctions', 'passive voice', 'modals', 'conditionals', 'vocabulary'],
    ja: ['助詞', '動詞活用', '敬語', '否定形', '過去形', '現在形', '未来形', '名詞', '形容詞', '副詞'],
    ko: ['조사', '동사 활용', '격식 표현', '비격식 표현', '과거형', '현재형', '미래형'],
    fr: ['verbes', 'articles', 'adjectifs', 'prépositions', 'passé composé', 'imparfait'],
    es: ['verbos', 'artículos', 'adjetivos', 'preposiciones', 'pretérito', 'imperfecto'],
    de: ['Verben', 'Artikel', 'Adjektive', 'Präpositionen', 'Präteritum', 'Perfekt'],
  };

  private async initialize(): Promise<void> {
    if (this.initialized) return;
    
    await this.loadVocabFromDB();
    this.initialized = true;
  }

  private async loadVocabFromDB(): Promise<void> {
    const languages = ['en', 'ja', 'ko', 'fr', 'es', 'de'];
    
    for (const lang of languages) {
      const { data, error } = await supabase
        .from('contents')
        .select('content, translation')
        .eq('type', 'vocab')
        .eq('language', lang)
        .limit(100);

      if (!error && data) {
        this.vocabCache[lang] = data.map(item => ({
          word: item.content,
          translation: item.translation || '',
          partOfSpeech: '',
          example: '',
        }));
      }
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

    switch (type) {
      case 'single_choice':
        return this.generateSingleChoice(language, difficulty, selectedTopic);
      case 'fill_blank':
        return this.generateFillBlank(language, difficulty, selectedTopic);
      case 'reading':
        return this.generateReading(language, difficulty, selectedTopic);
      default:
        return this.generateSingleChoice(language, difficulty, selectedTopic);
    }
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