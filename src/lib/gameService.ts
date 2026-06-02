import { supabase } from '../data/supabase';
import { contentGenerator, type GeneratedContent } from '../content-generator/ContentGenerator';

export type GameMode = 'infinite' | 'repeat';

export type GameType = 'word_hunter' | 'grammar_planet' | 'sentence_builder' | 'vocab_quiz';

export interface Question {
  id: string;
  gameType: GameType;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  content?: GeneratedContent;
}

export interface QuestionSet {
  id: string;
  gameType: GameType;
  questions: Question[];
  mode: GameMode;
  createdAt: number;
}

export interface GameRecord {
  id: string;
  userId: string;
  gameType: GameType;
  questionSetId: string;
  mode: GameMode;
  score: number;
  totalQuestions: number;
  completed: boolean;
  createdAt: number;
  updatedAt: number;
}

class GameService {
  private questionSets: Map<string, QuestionSet> = new Map();
  private userQuestionSets: Map<string, string[]> = new Map();

  private async generateWordHunterQuestion(language: string): Promise<Question> {
    const vocabResult = await supabase
      .from('contents')
      .select('*')
      .eq('type', 'vocab')
      .eq('language', language)
      .limit(1)
      .single();

    if (vocabResult.data) {
      const vocab = vocabResult.data;
      const distractors = await this.getDistractors(language, vocab.content);
      
      return {
        id: `qh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        gameType: 'word_hunter',
        question: `Find the correct translation for: ${vocab.content}`,
        options: this.shuffleArray([vocab.translation || '???', ...distractors]),
        correctAnswer: vocab.translation || '',
        explanation: `This word means "${vocab.translation}"`,
      };
    }

    return {
      id: `qh_${Date.now()}`,
      gameType: 'word_hunter',
      question: 'What is the meaning of "hello"?',
      options: ['你好', '再见', '谢谢', '对不起'],
      correctAnswer: '你好',
      explanation: '"hello" means "你好" in Chinese',
    };
  }

  private async generateGrammarQuestion(language: string): Promise<Question> {
    const content = await contentGenerator.generate('grammar', language);
    
    const options = this.generateGrammarOptions(content.content);
    
    return {
      id: `qg_${Date.now()}`,
      gameType: 'grammar_planet',
      question: content.content,
      options,
      correctAnswer: options[0],
      explanation: 'Grammar explanation here',
      content,
    };
  }

  private async generateSentenceBuilderQuestion(language: string): Promise<Question> {
    const vocabResult = await supabase
      .from('contents')
      .select('*')
      .eq('type', 'vocab')
      .eq('language', language)
      .limit(5);

    const words = vocabResult.data?.map(v => v.content) || ['I', 'love', 'learning', 'language'];
    const shuffled = this.shuffleArray([...words]);
    
    return {
      id: `qs_${Date.now()}`,
      gameType: 'sentence_builder',
      question: `Arrange the words to make a sentence: ${shuffled.join(' - ')}`,
      correctAnswer: words.join(' '),
      explanation: `Correct sentence: ${words.join(' ')}`,
    };
  }

  private async generateVocabQuizQuestion(language: string): Promise<Question> {
    const vocabResult = await supabase
      .from('contents')
      .select('*')
      .eq('type', 'vocab')
      .eq('language', language)
      .limit(1)
      .single();

    if (vocabResult.data) {
      const vocab = vocabResult.data;
      const distractors = await this.getDistractors(language, vocab.content);
      
      return {
        id: `qv_${Date.now()}`,
        gameType: 'vocab_quiz',
        question: `What is "${vocab.content}"?`,
        options: this.shuffleArray([vocab.translation || '???', ...distractors]),
        correctAnswer: vocab.translation || '',
        explanation: `Definition: ${vocab.translation}`,
      };
    }

    return {
      id: `qv_${Date.now()}`,
      gameType: 'vocab_quiz',
      question: 'What is "bonjour"?',
      options: ['hello', 'goodbye', 'thank you', 'please'],
      correctAnswer: 'hello',
      explanation: '"bonjour" means "hello" in French',
    };
  }

  private async getDistractors(language: string, exclude: string): Promise<string[]> {
    const result = await supabase
      .from('contents')
      .select('translation')
      .eq('language', language)
      .neq('content', exclude)
      .limit(3);

    return result.data?.map(r => r.translation || '') || ['distractor1', 'distractor2', 'distractor3'];
  }

  private generateGrammarOptions(question: string): string[] {
    if (question.includes('___')) {
      return ['study', 'studies', 'studying', 'studied'];
    }
    return ['correct', 'incorrect1', 'incorrect2', 'incorrect3'];
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  public async generateQuestionSet(gameType: GameType, language: string, count: number = 10): Promise<QuestionSet> {
    const questions: Question[] = [];
    const setId = `set_${gameType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    for (let i = 0; i < count; i++) {
      let question: Question;
      
      switch (gameType) {
        case 'word_hunter':
          question = await this.generateWordHunterQuestion(language);
          break;
        case 'grammar_planet':
          question = await this.generateGrammarQuestion(language);
          break;
        case 'sentence_builder':
          question = await this.generateSentenceBuilderQuestion(language);
          break;
        case 'vocab_quiz':
        default:
          question = await this.generateVocabQuizQuestion(language);
      }

      questions.push(question);
    }

    const questionSet: QuestionSet = {
      id: setId,
      gameType,
      questions,
      mode: 'infinite',
      createdAt: Date.now(),
    };

    this.questionSets.set(setId, questionSet);

    return questionSet;
  }

  public async createRepeatSet(userId: string, gameType: GameType, language: string, count: number = 10): Promise<QuestionSet> {
    const questionSet = await this.generateQuestionSet(gameType, language, count);
    questionSet.mode = 'repeat';

    if (!this.userQuestionSets.has(userId)) {
      this.userQuestionSets.set(userId, []);
    }
    this.userQuestionSets.get(userId)!.push(questionSet.id);

    await supabase.from('game_records').insert([{
      id: questionSet.id,
      user_id: userId,
      game_type: gameType,
      question_set: JSON.stringify(questionSet.questions),
      mode: 'repeat',
      completed: false,
      score: 0,
    }]);

    return questionSet;
  }

  public async getQuestionSet(setId: string): Promise<QuestionSet | null> {
    return this.questionSets.get(setId) || null;
  }

  public async getUserRepeatSets(userId: string): Promise<QuestionSet[]> {
    const setIds = this.userQuestionSets.get(userId) || [];
    return setIds.map(id => this.questionSets.get(id)).filter(Boolean) as QuestionSet[];
  }

  public async saveGameRecord(userId: string, questionSetId: string, score: number, totalQuestions: number, completed: boolean): Promise<void> {
    const existing = await supabase
      .from('game_records')
      .select('*')
      .eq('id', questionSetId)
      .single();

    if (existing.data) {
      await supabase.from('game_records').update({
        score,
        completed,
        updated_at: new Date().toISOString(),
      }).eq('id', questionSetId);
    } else {
      await supabase.from('game_records').insert([{
        id: questionSetId,
        user_id: userId,
        game_type: '',
        question_set: '',
        mode: 'infinite',
        completed,
        score,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }]);
    }
  }

  public async getGameRecords(userId: string): Promise<GameRecord[]> {
    const { data, error } = await supabase
      .from('game_records')
      .select('*')
      .eq('user_id', userId);

    if (error || !data) return [];

    return data.map(record => ({
      id: record.id,
      userId: record.user_id,
      gameType: record.game_type as GameType,
      questionSetId: record.id,
      mode: record.mode as GameMode,
      score: record.score,
      totalQuestions: 10,
      completed: record.completed,
      createdAt: record.created_at ? new Date(record.created_at).getTime() : Date.now(),
      updatedAt: record.updated_at ? new Date(record.updated_at).getTime() : Date.now(),
    }));
  }

  public async getNextQuestion(gameType: GameType, language: string): Promise<Question> {
    switch (gameType) {
      case 'word_hunter':
        return this.generateWordHunterQuestion(language);
      case 'grammar_planet':
        return this.generateGrammarQuestion(language);
      case 'sentence_builder':
        return this.generateSentenceBuilderQuestion(language);
      case 'vocab_quiz':
      default:
        return this.generateVocabQuizQuestion(language);
    }
  }
}

export const gameService = new GameService();

export async function startGame(gameType: GameType, language: string, mode: GameMode = 'infinite', count: number = 10): Promise<QuestionSet> {
  if (mode === 'repeat') {
    const userId = 'current_user';
    return gameService.createRepeatSet(userId, gameType, language, count);
  }
  return gameService.generateQuestionSet(gameType, language, count);
}

export async function getQuestion(setId: string, index: number): Promise<Question | null> {
  const set = await gameService.getQuestionSet(setId);
  return set?.questions[index] || null;
}

export async function submitAnswer(setId: string, questionId: string, answer: string): Promise<boolean> {
  const set = await gameService.getQuestionSet(setId);
  const question = set?.questions.find(q => q.id === questionId);
  return question?.correctAnswer === answer;
}

export async function saveScore(userId: string, setId: string, score: number, totalQuestions: number, completed: boolean): Promise<void> {
  await gameService.saveGameRecord(userId, setId, score, totalQuestions, completed);
}

export async function getUserGameHistory(userId: string): Promise<GameRecord[]> {
  return gameService.getGameRecords(userId);
}