import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mfwvwohgpxgeihmqludt.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'your_supabase_service_key_here';

const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Base vocabulary data for 10 languages
const baseVocab: Array<{
  language: string;
  word: string;
  meaning: string;
  example?: string;
  level: number;
}> = [
  // Japanese
  { language: 'ja', word: 'こんにちは', meaning: '你好', example: 'こんにちは、元気ですか？', level: 1 },
  { language: 'ja', word: 'ありがとう', meaning: '谢谢', example: 'ありがとうございます', level: 1 },
  { language: 'ja', word: 'すみません', meaning: '对不起', example: 'すみません、失礼します', level: 1 },
  { language: 'ja', word: 'はい', meaning: '是', example: 'はい、そうです', level: 1 },
  { language: 'ja', word: 'いいえ', meaning: '不是', example: 'いいえ、違います', level: 1 },
  { language: 'ja', word: '食べる', meaning: '吃', example: 'ご飯を食べる', level: 2 },
  { language: 'ja', word: '飲む', meaning: '喝', example: 'コーヒーを飲む', level: 2 },
  { language: 'ja', word: '行く', meaning: '去', example: '学校に行く', level: 2 },
  { language: 'ja', word: '見る', meaning: '看', example: 'テレビを見る', level: 2 },
  { language: 'ja', word: '話す', meaning: '说', example: '日本語を話す', level: 2 },
  
  // English
  { language: 'en', word: 'Hello', meaning: '你好', example: 'Hello, how are you?', level: 1 },
  { language: 'en', word: 'Thank you', meaning: '谢谢', example: 'Thank you very much', level: 1 },
  { language: 'en', word: 'Sorry', meaning: '对不起', example: 'I am sorry', level: 1 },
  { language: 'en', word: 'Yes', meaning: '是', example: 'Yes, I do', level: 1 },
  { language: 'en', word: 'No', meaning: '不是', example: 'No, I don\'t', level: 1 },
  { language: 'en', word: 'Eat', meaning: '吃', example: 'I eat breakfast', level: 2 },
  { language: 'en', word: 'Drink', meaning: '喝', example: 'I drink coffee', level: 2 },
  { language: 'en', word: 'Go', meaning: '去', example: 'I go to school', level: 2 },
  { language: 'en', word: 'See', meaning: '看', example: 'I see a movie', level: 2 },
  { language: 'en', word: 'Speak', meaning: '说', example: 'I speak English', level: 2 },
  
  // Korean
  { language: 'ko', word: '안녕하세요', meaning: '你好', example: '안녕하세요, 어떻게 지내세요?', level: 1 },
  { language: 'ko', word: '감사합니다', meaning: '谢谢', example: '정말 감사합니다', level: 1 },
  { language: 'ko', word: '죄송합니다', meaning: '对不起', example: '죄송합니다', level: 1 },
  { language: 'ko', word: '네', meaning: '是', example: '네, 맞아요', level: 1 },
  { language: 'ko', word: '아니요', meaning: '不是', example: '아니요, 아니에요', level: 1 },
  { language: 'ko', word: '먹다', meaning: '吃', example: '밥을 먹다', level: 2 },
  { language: 'ko', word: '마시다', meaning: '喝', example: '커피를 마시다', level: 2 },
  { language: 'ko', word: '가다', meaning: '去', example: '학교에 가다', level: 2 },
  { language: 'ko', word: '보다', meaning: '看', example: '텔레비전을 보다', level: 2 },
  { language: 'ko', word: '말하다', meaning: '说', example: '한국어를 말하다', level: 2 },
  
  // French
  { language: 'fr', word: 'Bonjour', meaning: '你好', example: 'Bonjour, comment ça va?', level: 1 },
  { language: 'fr', word: 'Merci', meaning: '谢谢', example: 'Merci beaucoup', level: 1 },
  { language: 'fr', word: 'Désolé', meaning: '对不起', example: 'Je suis désolé', level: 1 },
  { language: 'fr', word: 'Oui', meaning: '是', example: 'Oui, c\'est vrai', level: 1 },
  { language: 'fr', word: 'Non', meaning: '不是', example: 'Non, ce n\'est pas vrai', level: 1 },
  { language: 'fr', word: 'Manger', meaning: '吃', example: 'Je mange du pain', level: 2 },
  { language: 'fr', word: 'Boire', meaning: '喝', example: 'Je bois du café', level: 2 },
  { language: 'fr', word: 'Aller', meaning: '去', example: 'Je vais à l\'école', level: 2 },
  { language: 'fr', word: 'Regarder', meaning: '看', example: 'Je regarde la télévision', level: 2 },
  { language: 'fr', word: 'Parler', meaning: '说', example: 'Je parle français', level: 2 },
  
  // Spanish
  { language: 'es', word: 'Hola', meaning: '你好', example: 'Hola, ¿cómo estás?', level: 1 },
  { language: 'es', word: 'Gracias', meaning: '谢谢', example: 'Muchas gracias', level: 1 },
  { language: 'es', word: 'Lo siento', meaning: '对不起', example: 'Lo siento mucho', level: 1 },
  { language: 'es', word: 'Sí', meaning: '是', example: 'Sí, es verdad', level: 1 },
  { language: 'es', word: 'No', meaning: '不是', example: 'No, no es verdad', level: 1 },
  { language: 'es', word: 'Comer', meaning: '吃', example: 'Yo como pan', level: 2 },
  { language: 'es', word: 'Beber', meaning: '喝', example: 'Yo bebo café', level: 2 },
  { language: 'es', word: 'Ir', meaning: '去', example: 'Yo voy a la escuela', level: 2 },
  { language: 'es', word: 'Ver', meaning: '看', example: 'Yo veo la televisión', level: 2 },
  { language: 'es', word: 'Hablar', meaning: '说', example: 'Yo hablo español', level: 2 },
  
  // German
  { language: 'de', word: 'Hallo', meaning: '你好', example: 'Hallo, wie geht es dir?', level: 1 },
  { language: 'de', word: 'Danke', meaning: '谢谢', example: 'Vielen Dank', level: 1 },
  { language: 'de', word: 'Entschuldigung', meaning: '对不起', example: 'Es tut mir leid', level: 1 },
  { language: 'de', word: 'Ja', meaning: '是', example: 'Ja, das ist richtig', level: 1 },
  { language: 'de', word: 'Nein', meaning: '不是', example: 'Nein, das ist falsch', level: 1 },
  { language: 'de', word: 'Essen', meaning: '吃', example: 'Ich esse Brot', level: 2 },
  { language: 'de', word: 'Trinken', meaning: '喝', example: 'Ich trinke Kaffee', level: 2 },
  { language: 'de', word: 'Gehen', meaning: '去', example: 'Ich gehe zur Schule', level: 2 },
  { language: 'de', word: 'Sehen', meaning: '看', example: 'Ich sehe fern', level: 2 },
  { language: 'de', word: 'Sprechen', meaning: '说', example: 'Ich spreche Deutsch', level: 2 },
  
  // Italian
  { language: 'it', word: 'Ciao', meaning: '你好', example: 'Ciao, come stai?', level: 1 },
  { language: 'it', word: 'Grazie', meaning: '谢谢', example: 'Grazie mille', level: 1 },
  { language: 'it', word: 'Scusa', meaning: '对不起', example: 'Mi dispiace', level: 1 },
  { language: 'it', word: 'Sì', meaning: '是', example: 'Sì, è vero', level: 1 },
  { language: 'it', word: 'No', meaning: '不是', example: 'No, non è vero', level: 1 },
  { language: 'it', word: 'Mangiare', meaning: '吃', example: 'Io mangio pane', level: 2 },
  { language: 'it', word: 'Bere', meaning: '喝', example: 'Io bevo caffè', level: 2 },
  { language: 'it', word: 'Andare', meaning: '去', example: 'Io vado a scuola', level: 2 },
  { language: 'it', word: 'Vedere', meaning: '看', example: 'Io vedo la televisione', level: 2 },
  { language: 'it', word: 'Parlare', meaning: '说', example: 'Io parlo italiano', level: 2 },
  
  // Portuguese
  { language: 'pt', word: 'Olá', meaning: '你好', example: 'Olá, como você está?', level: 1 },
  { language: 'pt', word: 'Obrigado', meaning: '谢谢', example: 'Muito obrigado', level: 1 },
  { language: 'pt', word: 'Desculpe', meaning: '对不起', example: 'Desculpe-me', level: 1 },
  { language: 'pt', word: 'Sim', meaning: '是', example: 'Sim, é verdade', level: 1 },
  { language: 'pt', word: 'Não', meaning: '不是', example: 'Não, não é verdade', level: 1 },
  { language: 'pt', word: 'Comer', meaning: '吃', example: 'Eu como pão', level: 2 },
  { language: 'pt', word: 'Beber', meaning: '喝', example: 'Eu bebo café', level: 2 },
  { language: 'pt', word: 'Ir', meaning: '去', example: 'Eu vou para a escola', level: 2 },
  { language: 'pt', word: 'Ver', meaning: '看', example: 'Eu vejo televisão', level: 2 },
  { language: 'pt', word: 'Falar', meaning: '说', example: 'Eu falo português', level: 2 },
  
  // Arabic
  { language: 'ar', word: 'مرحبا', meaning: '你好', example: 'مرحبا، كيف حالك؟', level: 1 },
  { language: 'ar', word: 'شكرا', meaning: '谢谢', example: 'شكرا جزيلا', level: 1 },
  { language: 'ar', word: 'عفوا', meaning: '对不起', example: 'أنا آسف', level: 1 },
  { language: 'ar', word: 'نعم', meaning: '是', example: 'نعم، هذا صحيح', level: 1 },
  { language: 'ar', word: 'لا', meaning: '不是', example: 'لا، هذا خطأ', level: 1 },
  { language: 'ar', word: 'أكل', meaning: '吃', example: 'أنا آكل الخبز', level: 2 },
  { language: 'ar', word: 'شرب', meaning: '喝', example: 'أنا أشرب القهوة', level: 2 },
  { language: 'ar', word: 'ذهاب', meaning: '去', example: 'أنا أذهب إلى المدرسة', level: 2 },
  { language: 'ar', word: 'رؤية', meaning: '看', example: 'أنا أرى التلفزيون', level: 2 },
  { language: 'ar', word: 'تحدث', meaning: '说', example: 'أنا أتحدث العربية', level: 2 },
  
  // Chinese
  { language: 'zh', word: '你好', meaning: 'Hello', example: '你好，最近怎么样？', level: 1 },
  { language: 'zh', word: '谢谢', meaning: 'Thank you', example: '非常感谢你', level: 1 },
  { language: 'zh', word: '对不起', meaning: 'Sorry', example: '对不起，我迟到了', level: 1 },
  { language: 'zh', word: '是', meaning: 'Yes', example: '是的，没错', level: 1 },
  { language: 'zh', word: '不是', meaning: 'No', example: '不是这样的', level: 1 },
  { language: 'zh', word: '吃', meaning: 'Eat', example: '我在吃午饭', level: 2 },
  { language: 'zh', word: '喝', meaning: 'Drink', example: '我在喝咖啡', level: 2 },
  { language: 'zh', word: '去', meaning: 'Go', example: '我要去学校', level: 2 },
  { language: 'zh', word: '看', meaning: 'See', example: '我在看电视', level: 2 },
  { language: 'zh', word: '说', meaning: 'Speak', example: '我说中文', level: 2 },
];

async function importVocab() {
  console.log(`📤 Importing ${baseVocab.length} vocabulary items...`);
  
  const itemsToInsert = baseVocab.map(item => ({
    type: 'vocab',
    language: item.language,
    title: item.word,
    content: item.word,
    translation: item.meaning,
    level: item.level.toString(),
    source: 'manual',
    usage_count: 0,
  }));

  const { error } = await adminClient.from('contents').insert(itemsToInsert);
  
  if (error) {
    console.error('❌ Error importing vocabulary:', error.message);
    return 0;
  }
  
  console.log(`✅ Successfully imported ${itemsToInsert.length} vocabulary items`);
  return itemsToInsert.length;
}

async function getStats() {
  const { data, error } = await adminClient.from('contents').select('*');
  
  if (error) {
    console.error('❌ Error getting stats:', error.message);
    return null;
  }
  
  const types: Record<string, number> = {};
  const languages: Record<string, number> = {};
  
  data.forEach((item: any) => {
    types[item.type] = (types[item.type] || 0) + 1;
    languages[item.language] = (languages[item.language] || 0) + 1;
  });
  
  return { total: data.length, types, languages };
}

async function main() {
  console.log('🚀 Starting vocabulary import...\n');
  
  console.log('🔌 Connecting to Supabase...');
  try {
    const { data } = await adminClient.from('contents').select('id').limit(1);
    console.log('✅ Connected to Supabase');
  } catch (error) {
    console.error('❌ Failed to connect:', error);
    process.exit(1);
  }

  await importVocab();
  
  const stats = await getStats();
  if (stats) {
    console.log('\n📊 Database Stats After Import:');
    console.log(`Total items: ${stats.total}`);
    console.log('Content Types:', stats.types);
    console.log('Languages:', stats.languages);
  }

  console.log('\n🎉 Vocabulary import complete!');
}

main().catch(console.error);