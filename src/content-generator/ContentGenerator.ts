import { jokeTemplates, radioTemplates, grammarTemplates, wordBanks, extraVariables, type Template } from './templates';
import { mockDatabase, type ContentItem } from '../data/database';
import { supabase } from '../data/supabase';

export interface GeneratedContent {
  id: string;
  type: 'joke' | 'radio' | 'grammar' | 'story' | 'nursery_rhyme';
  language: string;
  content: string;
  title?: string;
  translation?: string;
  level?: string;
  age_group?: 'kids' | 'teenagers' | 'adults';
  templateId: string;
  variablesUsed: Record<string, string>;
  isAI: boolean;
  timestamp: number;
}

export interface GrammarQuestion extends GeneratedContent {
  options?: string[];
  correctAnswer?: string;
}

interface ContentCache {
  [key: string]: GeneratedContent[];
}

interface GeneratedRecord {
  id: string;
  type: string;
  language: string;
  content: string;
  templateId: string;
  variablesUsed: Record<string, string>;
  createdAt: number;
  usageCount: number;
}

class ContentGenerator {
  private cache: ContentCache = {};
  private generatedRecords: GeneratedRecord[] = [];
  private maxCacheSize = 100;
  private maxRecordAge = 30 * 24 * 60 * 60 * 1000;
  private initialized = false;
  private initialContent: GeneratedContent[] = [];
  private aiGeneratedCache: Map<string, GeneratedContent[]> = new Map();

  private async initialize(): Promise<void> {
    if (this.initialized) return;
    
    const items = await mockDatabase.getItems();
    this.initialContent = items.map(item => ({
      id: item.id,
      type: item.type as GeneratedContent['type'],
      language: item.language,
      content: item.content,
      title: item.title,
      translation: item.translation,
      level: item.level,
      age_group: item.age_group,
      templateId: 'preloaded',
      variablesUsed: {},
      isAI: item.source === 'ai',
      timestamp: item.created_at,
    }));

    this.initialContent.forEach(content => {
      const cacheKey = this.getCacheKey(content.type, content.language);
      if (!this.cache[cacheKey]) {
        this.cache[cacheKey] = [];
      }
      this.cache[cacheKey].push(content);
    });

    this.initialized = true;
  }

  private getRandomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  private generateId(): string {
    return `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getVariableValue(language: string, variableName: string): string {
    const wordBank = wordBanks[language];
    const extras = extraVariables[language] || {};

    if (extras[variableName]) {
      return this.getRandomItem(extras[variableName]);
    }

    switch (variableName.toLowerCase()) {
      case 'person':
      case 'people':
      case '人物':
      case '職業':
      case '직업':
        return wordBank?.people ? this.getRandomItem(wordBank.people) : 'someone';
      case 'place':
      case 'places':
      case '場所':
      case '장소':
        return wordBank?.places ? this.getRandomItem(wordBank.places) : 'somewhere';
      case 'action':
      case 'actions':
      case '動作':
        return wordBank?.actions ? this.getRandomItem(wordBank.actions) : 'doing something';
      case 'adjective':
      case 'adjectives':
      case '形容詞':
      case '형용사':
        return wordBank?.adjectives ? this.getRandomItem(wordBank.adjectives) : 'nice';
      case 'noun':
      case 'nouns':
      case '名詞':
      case '명사':
        return wordBank?.nouns ? this.getRandomItem(wordBank.nouns) : 'thing';
      case 'adverb':
      case 'adverbs':
      case '副詞':
        return wordBank?.adverbs ? this.getRandomItem(wordBank.adverbs) : 'quickly';
      case 'time_of_day':
        return this.getRandomItem(['morning', 'afternoon', 'evening', 'night']);
      case 'day_of_week':
        return this.getRandomItem(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
      case 'topic':
        return this.getRandomItem(['learning languages', 'travel', 'food', 'technology', 'sports', 'music', 'books', 'movies']);
      case 'fun_fact':
        return this.getRandomItem([
          'The shortest war in history was between Britain and Zanzibar in 1896. It lasted 38 minutes.',
          'Honey never spoils.',
          'Octopuses have three hearts.',
          'Bananas are berries, but strawberries are not.',
        ]);
      case 'question':
        return this.getRandomItem([
          'What is your favorite way to learn?',
          'How do you practice speaking?',
          'What language are you learning now?',
          'Do you prefer reading or listening?',
        ]);
      case 'guest_name':
        return this.getRandomItem(['Alex', 'Sarah', 'Mike', 'Emma', 'David', 'Lisa']);
      case 'theme':
        return this.getRandomItem(['language learning tips', 'cultural insights', 'travel stories', 'study habits']);
      case 'point1':
      case 'point2':
      case 'point3':
        return this.getRandomItem([
          'setting realistic goals',
          'practicing daily',
          'using flashcards',
          'finding a language partner',
          'watching movies',
          'reading books',
        ]);
      case 'segment_name':
        return this.getRandomItem([
          'Ask the Expert',
          'Listener Stories',
          'Tips and Tricks',
          'Culture Corner',
        ]);
      case 'number':
        return this.getRandomItem(['3', '5', '7', '10']);
      case 'time':
        return this.getRandomItem(['one week', 'one month', 'three months', 'one year']);
      case 'verb':
        return this.getRandomItem(['study', 'learn', 'practice', 'speak', 'read', 'write']);
      case 'preposition':
        return this.getRandomItem(['at', 'in', 'on', 'to', 'for', 'with']);
      case 'article':
        return this.getRandomItem(['a', 'an', 'the', '-']);
      case 'pronoun':
        return this.getRandomItem(['He', 'She', 'They', 'We']);
      case 'conjunction':
        return this.getRandomItem(['and', 'but', 'or', 'because', 'so']);
      default:
        return variableName;
    }
  }

  private renderTemplate(template: Template): { content: string; variablesUsed: Record<string, string> } {
    let content = template.template;
    const variablesUsed: Record<string, string> = {};

    template.variables.forEach(variable => {
      const value = this.getVariableValue(template.language, variable);
      variablesUsed[variable] = value;
      
      const escapedVariable = variable.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      content = content.replace(new RegExp(`\\{${escapedVariable}\\}`, 'g'), value);
    });

    return { content, variablesUsed };
  }

  private async callAIGenerator(type: string, language: string): Promise<string> {
    return new Promise(resolve => {
      setTimeout(() => {
        const aiResponses: Record<string, string[]> = {
          joke_en: [
            'Why don\'t skeletons fight each other? They don\'t have the guts!',
            'I told my wife she should embrace her mistakes. She gave me a hug.',
            'Why did the scarecrow win an award? Because he was outstanding in his field!',
            'What do you call fake spaghetti? An impasta!',
            'Why don\'t scientists trust atoms? Because they make up everything!',
          ],
          joke_ja: [
            'なぜ数学の本は悲しいのか？問題が多すぎるから！',
            'コンピューターに休憩を求めたら、「私も休憩が必要です」と返されました',
            'カエルがバーに入ったら、バーテンダーが「カエルはお断りです」と言いました',
          ],
          joke_ko: [
            '왜 해골이 싸우지 않을까요? guts가 없기 때문입니다!',
            '컴퓨터에게 휴식을 요청했더니 "저도 휴식이 필요해요" 라고 답했어요',
          ],
          radio_en: [
            'Welcome to our language learning podcast! Today we\'re talking about effective study techniques. Remember, consistency is key!',
            'Hello listeners! In today\'s episode, we explore the culture behind the words. Language is more than just words.',
            'Good morning! Today we have a special guest who will share their journey of learning three languages.',
          ],
          grammar_en: [
            'Choose the correct form: She ___ to school every day.',
            'Complete the sentence: I have been ___ English for two years.',
            'Rewrite in passive: They built this building in 2020.',
          ],
        };

        const key = `${type}_${language}`;
        const responses = aiResponses[key] || aiResponses[`${type}_en`] || ['Interesting content generated by AI.'];
        resolve(this.getRandomItem(responses));
      }, 500);
    });
  }

  private getTemplates(type: string, language: string): Template[] {
    switch (type) {
      case 'joke':
        return jokeTemplates.filter(t => t.language === language);
      case 'radio':
        return radioTemplates.filter(t => t.language === language);
      case 'grammar':
        return grammarTemplates.filter(t => t.language === language);
      default:
        return [];
    }
  }

  private getCacheKey(type: string, language: string): string {
    return `${type}_${language}`;
  }

  private cleanOldRecords(): void {
    const now = Date.now();
    this.generatedRecords = this.generatedRecords.filter(
      record => now - record.createdAt < this.maxRecordAge
    );
  }

  private async saveToDatabase(content: GeneratedContent): Promise<void> {
    if (!content.isAI) return;
    
    try {
      const { error } = await supabase.from('contents').insert([{
        id: content.id,
        type: content.type,
        language: content.language,
        title: content.title || `Generated ${content.type}`,
        content: content.content,
        translation: content.translation || '',
        level: content.level || '1',
        source: 'ai_generated',
        usage_count: 1,
      }]);
      
      if (error) {
        console.warn('Failed to save AI-generated content to database:', error);
      } else {
        console.log('AI-generated content saved to database:', content.id);
      }
    } catch (e) {
      console.warn('Error saving to database:', e);
    }
  }

  private async tryReuseAIGenerated(type: string, language: string): Promise<GeneratedContent | null> {
    const cacheKey = `ai_${type}_${language}`;
    
    if (this.aiGeneratedCache.has(cacheKey)) {
      const cached = this.aiGeneratedCache.get(cacheKey)!;
      if (cached.length > 0) {
        return { ...this.getRandomItem(cached) };
      }
    }

    try {
      const { data, error } = await supabase
        .from('contents')
        .select('*')
        .eq('type', type)
        .eq('language', language)
        .eq('source', 'ai_generated')
        .limit(20);

      if (!error && data && data.length > 0) {
        const dbContent = data.map(item => ({
          id: item.id,
          type: item.type as GeneratedContent['type'],
          language: item.language,
          content: item.content,
          title: item.title,
          translation: item.translation,
          level: item.level,
          templateId: 'ai_generated',
          variablesUsed: {},
          isAI: true,
          timestamp: item.created_at ? new Date(item.created_at).getTime() : Date.now(),
        }));
        
        this.aiGeneratedCache.set(cacheKey, dbContent);
        
        if (dbContent.length > 0) {
          return { ...this.getRandomItem(dbContent) };
        }
      }
    } catch (e) {
      console.warn('Error fetching AI-generated content from database:', e);
    }

    return null;
  }

  public async generate(type: 'joke' | 'radio' | 'grammar' | 'story' | 'nursery_rhyme', language: string): Promise<GeneratedContent> {
    await this.initialize();
    
    const cacheKey = this.getCacheKey(type, language);
    const templates = this.getTemplates(type, language);

    if (!this.cache[cacheKey]) {
      this.cache[cacheKey] = [];
    }

    let generatedContent: GeneratedContent;
    let isAI = false;

    const availableTemplates = templates.length > 0;
    const availableInitialContent = this.cache[cacheKey].filter(c => c.templateId === 'preloaded').length > 0;
    
    const useInitialContent = availableInitialContent && Math.random() > 0.2;
    const useReusedAI = Math.random() > 0.5;
    
    if (useInitialContent) {
      const preloadedContent = this.cache[cacheKey].filter(c => c.templateId === 'preloaded');
      generatedContent = { ...this.getRandomItem(preloadedContent) };
    } else if (useReusedAI) {
      const reused = await this.tryReuseAIGenerated(type, language);
      if (reused) {
        generatedContent = reused;
        isAI = true;
      } else if (availableTemplates && Math.random() > 0.3) {
        const template = this.getRandomItem(templates);
        const { content, variablesUsed } = this.renderTemplate(template);
        
        generatedContent = {
          id: this.generateId(),
          type,
          language,
          content,
          templateId: template.id,
          variablesUsed,
          isAI: false,
          timestamp: Date.now(),
        };
      } else {
        const aiContent = await this.callAIGenerator(type, language);
        
        generatedContent = {
          id: this.generateId(),
          type,
          language,
          content: aiContent,
          templateId: 'ai_generated',
          variablesUsed: {},
          isAI: true,
          timestamp: Date.now(),
        };
        
        isAI = true;
        await this.saveToDatabase(generatedContent);
      }
    } else if (availableTemplates && Math.random() > 0.3) {
      const template = this.getRandomItem(templates);
      const { content, variablesUsed } = this.renderTemplate(template);
      
      generatedContent = {
        id: this.generateId(),
        type,
        language,
        content,
        templateId: template.id,
        variablesUsed,
        isAI: false,
        timestamp: Date.now(),
      };
    } else {
      const aiContent = await this.callAIGenerator(type, language);
      
      generatedContent = {
        id: this.generateId(),
        type,
        language,
        content: aiContent,
        templateId: 'ai_generated',
        variablesUsed: {},
        isAI: true,
        timestamp: Date.now(),
      };
      
      isAI = true;
      await this.saveToDatabase(generatedContent);
    }

    if (generatedContent.templateId !== 'preloaded') {
      this.cache[cacheKey].push(generatedContent);
      if (this.cache[cacheKey].length > this.maxCacheSize) {
        this.cache[cacheKey].shift();
      }

      this.generatedRecords.push({
        id: generatedContent.id,
        type,
        language,
        content: generatedContent.content,
        templateId: generatedContent.templateId,
        variablesUsed: generatedContent.variablesUsed,
        createdAt: Date.now(),
        usageCount: 1,
      });

      this.cleanOldRecords();
    }

    return generatedContent;
  }

  public async generateBatch(type: 'joke' | 'radio' | 'grammar' | 'story' | 'nursery_rhyme', language: string, count: number): Promise<GeneratedContent[]> {
    const results: GeneratedContent[] = [];
    for (let i = 0; i < count; i++) {
      results.push(await this.generate(type, language));
    }
    return results;
  }

  public async getInitialContent(type?: string, language?: string): Promise<GeneratedContent[]> {
    await this.initialize();
    
    let content = [...this.initialContent];
    
    if (type) {
      content = content.filter(c => c.type === type);
    }
    if (language) {
      content = content.filter(c => c.language === language);
    }
    
    return content;
  }

  public getCachedContent(type: string, language: string): GeneratedContent[] {
    const cacheKey = this.getCacheKey(type, language);
    return this.cache[cacheKey] || [];
  }

  public getRecordById(id: string): GeneratedRecord | undefined {
    return this.generatedRecords.find(record => record.id === id);
  }

  public incrementUsage(id: string): void {
    const record = this.generatedRecords.find(r => r.id === id);
    if (record) {
      record.usageCount++;
    }
  }

  public getStats(): {
    totalGenerated: number;
    templateBased: number;
    aiBased: number;
    cacheSize: number;
    preloadedCount: number;
  } {
    const totalGenerated = this.generatedRecords.length;
    const templateBased = this.generatedRecords.filter(r => r.templateId !== 'ai_generated').length;
    const aiBased = totalGenerated - templateBased;
    const cacheSize = Object.values(this.cache).reduce((sum, arr) => sum + arr.length, 0);
    const preloadedCount = this.initialContent.length;

    return { totalGenerated, templateBased, aiBased, cacheSize, preloadedCount };
  }
}

export const contentGenerator = new ContentGenerator();

export function generateJoke(language: string): Promise<GeneratedContent> {
  return contentGenerator.generate('joke', language);
}

export function generateRadioScript(language: string): Promise<GeneratedContent> {
  return contentGenerator.generate('radio', language);
}

export function generateGrammarQuestion(language: string): Promise<GeneratedContent> {
  return contentGenerator.generate('grammar', language);
}

export function generateStory(language: string): Promise<GeneratedContent> {
  return contentGenerator.generate('story', language);
}

export function generateNurseryRhyme(language: string): Promise<GeneratedContent> {
  return contentGenerator.generate('nursery_rhyme', language);
}

export function generateMultiple(type: 'joke' | 'radio' | 'grammar' | 'story' | 'nursery_rhyme', language: string, count: number): Promise<GeneratedContent[]> {
  return contentGenerator.generateBatch(type, language, count);
}

export function getInitialContent(type?: string, language?: string): Promise<GeneratedContent[]> {
  return contentGenerator.getInitialContent(type, language);
}
