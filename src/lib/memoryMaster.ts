/**
 * 学习达人记忆法引擎 (MemoryMaster Engine)
 * 
 * 集成世界顶级语言学习者的记忆技巧：
 * - 艾宾浩斯遗忘曲线 (Ebbinghaus Forgetting Curve)
 * - 联想记忆法 (Association)
 * - 间隔重复 (Spaced Repetition)
 * - 记忆宫殿 (Memory Palace)
 * - 费曼技巧 (Feynman Technique)
 * - 词根词缀法 (Etymology)
 * 
 * 每个方法提供10语种的具体记忆辅助内容
 */

// ── 间隔重复调度表 (Ebbinghaus) ──────────────────────────────────────────────
// 最佳复习时间点：1天、2天、4天、7天、15天、30天
export const SPACED_REPETITION_SCHEDULE = [1, 2, 4, 7, 15, 30];

export interface MemoryTip {
  id: string;
  method: string;
  title: string;
  description: string;
  language: string;
  example: string;
  tags: string[];
}

// ── 核心记忆法数据 (10语种) ──────────────────────────────────────────────────

export const MEMORY_TIPS: Record<string, MemoryTip[]> = {
  en: [
    { id: 'mem_en_1', method: 'association', title: 'Sound Association', description: 'Link the sound of a new word to something you already know. Example: "chaos" sounds like "kay-os" — imagine a kayak in total chaos.', language: 'en', example: 'chaos → kayak in storm', tags: ['beginner', 'vocabulary'] },
    { id: 'mem_en_2', method: 'etymology', title: 'Word Roots', description: 'Learn common Latin/Greek roots. "tele" = far, "phone" = sound → telephone = far sound.', language: 'en', example: 'tele + phone = far + sound', tags: ['intermediate', 'vocabulary'] },
    { id: 'mem_en_3', method: 'memory_palace', title: 'Memory Palace for Vocabulary', description: 'Place words in familiar locations in your house. Kitchen = cooking words, Bedroom = sleep/rest words.', language: 'en', example: 'Kitchen: recipe, ingredient, stir, bake', tags: ['advanced', 'vocabulary'] },
    { id: 'mem_en_4', method: 'feynman', title: 'Teach to Learn', description: 'Explain a grammar rule to an imaginary 5-year-old. If you cannot explain it simply, you don\'t understand it well enough.', language: 'en', example: 'Explain present perfect to a child using "I have eaten" vs "I ate"', tags: ['intermediate', 'grammar'] },
    { id: 'mem_en_5', method: 'spaced_repetition', title: 'The 1-2-4-7-15-30 Rule', description: 'Review new words after 1 day, 2 days, 4 days, 7 days, 15 days, and 30 days. This transfers knowledge from short-term to long-term memory.', language: 'en', example: 'Day 1: learn 10 words → Day 2: review → Day 4: review → Day 7: review → Day 15: review → Day 30: review', tags: ['beginner', 'vocabulary'] },
  ],
  ja: [
    { id: 'mem_ja_1', method: 'association', title: '音の連想', description: '新しい単語の音を既知のものと結びつけましょう。例：「ねこ」(neko) → 「寝転ぶ猫」のイメージ。', language: 'ja', example: 'ねこ (neko) → 寝転ぶ猫', tags: ['beginner', 'vocabulary'] },
    { id: 'mem_ja_2', method: 'etymology', title: '漢字の部首', description: '漢字の部首を学ぶことで意味を推測できます。「氵」(さんずい) = 水関連、「木」= 木関連。', language: 'ja', example: '海(umi)=氵+毎 → 水に関係する', tags: ['intermediate', 'vocabulary'] },
    { id: 'mem_ja_3', method: 'memory_palace', title: '記憶の宮殿', description: '自宅の各部屋に単語を配置します。玄関=挨拶、リビング=日常会話、キッチン=食べ物。', language: 'ja', example: '玄関: おはよう、こんにちは、さようなら', tags: ['advanced', 'vocabulary'] },
    { id: 'mem_ja_4', method: 'feynman', title: '教えることで学ぶ', description: '文法ルールを5歳の子供に説明するつもりで。簡単に説明できなければ、十分に理解していない証拠。', language: 'ja', example: '「て形」の作り方を子供に説明してみる', tags: ['intermediate', 'grammar'] },
    { id: 'mem_ja_5', method: 'spaced_repetition', title: '1-2-4-7-15-30ルール', description: '新出単語は1日後、2日後、4日後、7日後、15日後、30日後に復習。短期記憶から長期記憶へ。', language: 'ja', example: '1日目:10単語学習→2日目:復習→4日目:復習→7日目:復習→15日目:復習→30日目:復習', tags: ['beginner', 'vocabulary'] },
  ],
  ko: [
    { id: 'mem_ko_1', method: 'association', title: '소리 연상', description: '새 단어의 소리를 이미 알고 있는 것과 연결하세요. 예: "사랑"(sa-rang) → "사랑은 사탕처럼 달콤하다"', language: 'ko', example: '사랑 → 사탕처럼 달콤한', tags: ['beginner', 'vocabulary'] },
    { id: 'mem_ko_2', method: 'etymology', title: '한자 어원', description: '한국어 단어의 60% 이상이 한자어입니다. 한자를 알면 단어의 의미를 추측할 수 있습니다.', language: 'ko', example: '학교(學校) = 배울 학 + 학교 교', tags: ['intermediate', 'vocabulary'] },
    { id: 'mem_ko_3', method: 'memory_palace', title: '기억의 궁전', description: '집 안의 각 방에 단어를 배치하세요. 현관=인사말, 거실=일상대화, 주방=음식 관련 단어.', language: 'ko', example: '현관: 안녕하세요, 반갑습니다, 잘 가요', tags: ['advanced', 'vocabulary'] },
    { id: 'mem_ko_4', method: 'feynman', title: '가르치며 배우기', description: '문법 규칙을 5살 아이에게 설명한다고 상상하세요. 간단히 설명할 수 없다면 충분히 이해하지 못한 것입니다.', language: 'ko', example: '은/는 vs 이/가 의 차이를 아이에게 설명하기', tags: ['intermediate', 'grammar'] },
    { id: 'mem_ko_5', method: 'spaced_repetition', title: '1-2-4-7-15-30 규칙', description: '새 단어를 1일, 2일, 4일, 7일, 15일, 30일 후에 복습하세요.', language: 'ko', example: '1일차: 10단어 학습 → 2일차: 복습 → 4일차: 복습 → ...', tags: ['beginner', 'vocabulary'] },
  ],
  fr: [
    { id: 'mem_fr_1', method: 'association', title: 'Association sonore', description: 'Associez le son d\'un nouveau mot à quelque chose que vous connaissez. Ex: "pomme" → imaginez une pomme qui pompe de l\'eau!', language: 'fr', example: 'pomme → pomper une pomme', tags: ['beginner', 'vocabulary'] },
    { id: 'mem_fr_2', method: 'etymology', title: 'Racines latines', description: 'Le français vient du latin. Connaître les racines latines aide à deviner le sens des mots.', language: 'fr', example: 'aqua = eau → aquarium, aquatique, aquarelle', tags: ['intermediate', 'vocabulary'] },
    { id: 'mem_fr_3', method: 'memory_palace', title: 'Palais de la mémoire', description: 'Placez des mots dans chaque pièce de votre maison. Entrée = salutations, Cuisine = nourriture.', language: 'fr', example: 'Entrée: bonjour, salut, au revoir', tags: ['advanced', 'vocabulary'] },
    { id: 'mem_fr_4', method: 'feynman', title: 'Enseigner pour apprendre', description: 'Expliquez une règle de grammaire à un enfant de 5 ans. Si vous ne pouvez pas l\'expliquer simplement, vous ne la comprenez pas assez.', language: 'fr', example: 'Expliquer le subjonctif à un enfant', tags: ['intermediate', 'grammar'] },
    { id: 'mem_fr_5', method: 'spaced_repetition', title: 'Règle 1-2-4-7-15-30', description: 'Révisez les nouveaux mots après 1, 2, 4, 7, 15 et 30 jours pour les ancrer dans la mémoire à long terme.', language: 'fr', example: 'Jour 1: 10 mots → Jour 2: révision → Jour 4: révision → ...', tags: ['beginner', 'vocabulary'] },
  ],
  es: [
    { id: 'mem_es_1', method: 'association', title: 'Asociación sonora', description: 'Asocia el sonido de una palabra nueva con algo conocido. Ej: "perro" → imagina un perro que "perfora" el suelo.', language: 'es', example: 'perro → perforar (suena parecido)', tags: ['beginner', 'vocabulary'] },
    { id: 'mem_es_2', method: 'etymology', title: 'Raíces latinas', description: 'El español deriva del latín. Reconocer raíces latinas te ayuda a entender miles de palabras.', language: 'es', example: 'bene = bien → beneficio, benévolo, bendición', tags: ['intermediate', 'vocabulary'] },
    { id: 'mem_es_3', method: 'memory_palace', title: 'Palacio de la memoria', description: 'Coloca palabras en cada habitación de tu casa. Entrada = saludos, Cocina = comida.', language: 'es', example: 'Entrada: hola, buenos días, adiós', tags: ['advanced', 'vocabulary'] },
    { id: 'mem_es_4', method: 'feynman', title: 'Enseñar para aprender', description: 'Explica una regla gramatical a un niño de 5 años. Si no puedes explicarlo simple, no lo entiendes bien.', language: 'es', example: 'Explicar ser vs estar a un niño', tags: ['intermediate', 'grammar'] },
    { id: 'mem_es_5', method: 'spaced_repetition', title: 'Regla 1-2-4-7-15-30', description: 'Repasa palabras nuevas después de 1, 2, 4, 7, 15 y 30 días para transferirlas a la memoria a largo plazo.', language: 'es', example: 'Día 1: 10 palabras → Día 2: repaso → Día 4: repaso → ...', tags: ['beginner', 'vocabulary'] },
  ],
  de: [
    { id: 'mem_de_1', method: 'association', title: 'Klang-Assoziation', description: 'Verbinde den Klang eines neuen Wortes mit etwas Bekanntem. Beispiel: "Katze" klingt wie "Kätzchen" — stell dir eine süße Katze vor.', language: 'de', example: 'Katze → süßes Kätzchen', tags: ['beginner', 'vocabulary'] },
    { id: 'mem_de_2', method: 'etymology', title: 'Wortherkunft', description: 'Deutsch hat viele zusammengesetzte Wörter. Zerlege sie: Hand+schuh = Handschuh, Wasser+Flasche = Wasserflasche.', language: 'de', example: 'Hand + Schuh = Handschuh (guante)', tags: ['intermediate', 'vocabulary'] },
    { id: 'mem_de_3', method: 'memory_palace', title: 'Gedächtnispalast', description: 'Platziere Wörter in jedem Zimmer. Eingang = Begrüßungen, Küche = Essen.', language: 'de', example: 'Eingang: Hallo, Guten Morgen, Tschüss', tags: ['advanced', 'vocabulary'] },
    { id: 'mem_de_4', method: 'feynman', title: 'Lehren zum Lernen', description: 'Erkläre eine Grammatikregel einem 5-Jährigen. Wenn du es nicht einfach erklären kannst, verstehst du es nicht gut genug.', language: 'de', example: 'Der/Die/Das einem Kind erklären', tags: ['intermediate', 'grammar'] },
    { id: 'mem_de_5', method: 'spaced_repetition', title: '1-2-4-7-15-30-Regel', description: 'Wiederhole neue Wörter nach 1, 2, 4, 7, 15 und 30 Tagen.', language: 'de', example: 'Tag 1: 10 Wörter → Tag 2: Wiederholung → Tag 4: Wiederholung → ...', tags: ['beginner', 'vocabulary'] },
  ],
  it: [
    { id: 'mem_it_1', method: 'association', title: 'Associazione sonora', description: 'Associa il suono di una nuova parola a qualcosa che conosci. Es: "gatto" → immagina un gatto che fa "gatton gatton".', language: 'it', example: 'gatto → gatton gatton', tags: ['beginner', 'vocabulary'] },
    { id: 'mem_it_2', method: 'etymology', title: 'Radici latine', description: 'L\'italiano deriva dal latino. Riconoscere le radici latine aiuta a capire migliaia di parole.', language: 'it', example: 'bene = buono → beneficio, benevolo, benedizione', tags: ['intermediate', 'vocabulary'] },
    { id: 'mem_it_3', method: 'memory_palace', title: 'Palazzo della memoria', description: 'Posiziona le parole in ogni stanza. Ingresso = saluti, Cucina = cibo.', language: 'it', example: 'Ingresso: ciao, buongiorno, arrivederci', tags: ['advanced', 'vocabulary'] },
    { id: 'mem_it_4', method: 'feynman', title: 'Insegnare per imparare', description: 'Spiega una regola grammaticale a un bambino di 5 anni. Se non puoi spiegarlo semplicemente, non lo capisci abbastanza.', language: 'it', example: 'Spiegare il congiuntivo a un bambino', tags: ['intermediate', 'grammar'] },
    { id: 'mem_it_5', method: 'spaced_repetition', title: 'Regola 1-2-4-7-15-30', description: 'Ripassa le nuove parole dopo 1, 2, 4, 7, 15 e 30 giorni.', language: 'it', example: 'Giorno 1: 10 parole → Giorno 2: ripasso → Giorno 4: ripasso → ...', tags: ['beginner', 'vocabulary'] },
  ],
  pt: [
    { id: 'mem_pt_1', method: 'association', title: 'Associação sonora', description: 'Associe o som de uma palavra nova a algo conhecido. Ex: "gato" → imagine um gato "gatando" (engatinhando).', language: 'pt', example: 'gato → engatinhando como gato', tags: ['beginner', 'vocabulary'] },
    { id: 'mem_pt_2', method: 'etymology', title: 'Raízes latinas', description: 'O português deriva do latim. Reconhecer raízes latinas ajuda a entender milhares de palavras.', language: 'pt', example: 'bene = bem → benefício, benevolente, bênção', tags: ['intermediate', 'vocabulary'] },
    { id: 'mem_pt_3', method: 'memory_palace', title: 'Palácio da memória', description: 'Coloque palavras em cada cômodo. Entrada = saudações, Cozinha = comida.', language: 'pt', example: 'Entrada: olá, bom dia, tchau', tags: ['advanced', 'vocabulary'] },
    { id: 'mem_pt_4', method: 'feynman', title: 'Ensinar para aprender', description: 'Explique uma regra gramatical para uma criança de 5 anos. Se não consegue explicar simples, não entendeu bem.', language: 'pt', example: 'Explicar ser vs estar para uma criança', tags: ['intermediate', 'grammar'] },
    { id: 'mem_pt_5', method: 'spaced_repetition', title: 'Regra 1-2-4-7-15-30', description: 'Revise palavras novas após 1, 2, 4, 7, 15 e 30 dias.', language: 'pt', example: 'Dia 1: 10 palavras → Dia 2: revisão → Dia 4: revisão → ...', tags: ['beginner', 'vocabulary'] },
  ],
  ar: [
    { id: 'mem_ar_1', method: 'association', title: 'الترابط الصوتي', description: 'اربط صوت الكلمة الجديدة بشيء تعرفه. مثال: "كتاب" (kitaab) → تخيل كتاباً يكتب نفسه.', language: 'ar', example: 'كتاب → يكتب', tags: ['beginner', 'vocabulary'] },
    { id: 'mem_ar_2', method: 'etymology', title: 'الجذور الثلاثية', description: 'معظم الكلمات العربية مبنية على جذور ثلاثية. مثال: جذر "ك-ت-ب" → كتاب، مكتب، كاتب، مكتوب.', language: 'ar', example: 'ك-ت-ب → كتاب + مكتب + كاتب + مكتوب', tags: ['intermediate', 'vocabulary'] },
    { id: 'mem_ar_3', method: 'memory_palace', title: 'قصر الذاكرة', description: 'ضع الكلمات في كل غرفة. المدخل = تحيات، المطبخ = طعام.', language: 'ar', example: 'المدخل: مرحباً، صباح الخير، مع السلامة', tags: ['advanced', 'vocabulary'] },
    { id: 'mem_ar_4', method: 'feynman', title: 'التعليم للتعلم', description: 'اشرح قاعدة نحوية لطفل عمره 5 سنوات. إذا لم تستطع شرحها ببساطة، فأنت لا تفهمها جيداً.', language: 'ar', example: 'شرح الفعل الماضي والمضارع لطفل', tags: ['intermediate', 'grammar'] },
    { id: 'mem_ar_5', method: 'spaced_repetition', title: 'قاعدة 1-2-4-7-15-30', description: 'راجع الكلمات الجديدة بعد 1، 2، 4، 7، 15، و30 يوماً.', language: 'ar', example: 'اليوم 1: 10 كلمات → اليوم 2: مراجعة → اليوم 4: مراجعة → ...', tags: ['beginner', 'vocabulary'] },
  ],
  zh: [
    { id: 'mem_zh_1', method: 'association', title: '字形联想', description: '汉字是象形文字。把字形和意思联系起来。例：「山」看起来就像一座山。', language: 'zh', example: '山 → 像三座山峰', tags: ['beginner', 'vocabulary'] },
    { id: 'mem_zh_2', method: 'etymology', title: '部首记忆法', description: '汉字由部首组成。学会214个部首就能推测90%汉字的意思。例：木字旁 = 与树木相关。', language: 'zh', example: '木 → 树、林、森、板、桌、椅', tags: ['intermediate', 'vocabulary'] },
    { id: 'mem_zh_3', method: 'memory_palace', title: '记忆宫殿', description: '在每个房间放置词汇。玄关=问候语，厨房=食物，卧室=休息。', language: 'zh', example: '玄关: 你好、早上好、再见', tags: ['advanced', 'vocabulary'] },
    { id: 'mem_zh_4', method: 'feynman', title: '以教为学', description: '向5岁小孩解释一个语法点。如果不能简单说明白，就是还没真懂。', language: 'zh', example: '向小孩解释"了"的用法', tags: ['intermediate', 'grammar'] },
    { id: 'mem_zh_5', method: 'spaced_repetition', title: '1-2-4-7-15-30法则', description: '新词在1天、2天、4天、7天、15天、30天后复习。这是艾宾浩斯遗忘曲线的最优复习间隔。', language: 'zh', example: '第1天: 学10词 → 第2天: 复习 → 第4天: 复习 → 第7天: 复习 → 第15天: 复习 → 第30天: 复习', tags: ['beginner', 'vocabulary'] },
  ],
};

// ── 发音纠正核心数据 ────────────────────────────────────────────────────────

export interface PronunciationTip {
  language: string;
  sound: string;
  description: string;
  examples: string[];
  commonMistakes: string[];
  tonguePosition: string;
}

export const PRONUNCIATION_GUIDE: PronunciationTip[] = [
  // English
  { language: 'en', sound: 'th /θ/', description: 'Voiceless TH — tongue between teeth, blow air', examples: ['think', 'three', 'thank', 'through'], commonMistakes: ['sink', 'tree', 'tank'], tonguePosition: 'Tongue tip between upper and lower teeth, blow air without voice' },
  { language: 'en', sound: 'th /ð/', description: 'Voiced TH — tongue between teeth, use voice', examples: ['this', 'that', 'the', 'there'], commonMistakes: ['dis', 'dat', 'de'], tonguePosition: 'Tongue tip between teeth, vibrate vocal cords' },
  { language: 'en', sound: 'r /ɹ/', description: 'Retroflex R — curl tongue back, don\'t touch roof', examples: ['red', 'run', 'right', 'river'], commonMistakes: ['led', 'lun'], tonguePosition: 'Tongue curled back, tip near but not touching alveolar ridge' },
  { language: 'en', sound: 'l /l/', description: 'Light L — tongue tip on alveolar ridge', examples: ['light', 'love', 'little'], commonMistakes: ['right', 'rove'], tonguePosition: 'Tongue tip touches the bump behind upper teeth' },
  // Japanese
  { language: 'ja', sound: 'つ (tsu)', description: 'Unlike English "tsu", Japanese つ is a single consonant', examples: ['つき (moon)', 'つよい (strong)', 'ひとつ (one)'], commonMistakes: ['su-ki', 'su-yoi'], tonguePosition: 'Tongue tip behind upper teeth, release air as single burst' },
  { language: 'ja', sound: 'らりるれろ', description: 'Japanese R — between English L and D, single tap', examples: ['らくだ (camel)', 'りんご (apple)', 'るす (absence)'], commonMistakes: ['la-ku-da', 'ling-go'], tonguePosition: 'Tongue tip taps alveolar ridge once, like a soft D' },
  // Korean
  { language: 'ko', sound: 'ㄹ (rieul)', description: 'Korean ㄹ — flap between L and R', examples: ['사랑 (love)', '나라 (country)', '우리 (we)'], commonMistakes: ['sa-lang', 'na-la'], tonguePosition: 'Tongue tip flaps against alveolar ridge, similar to Spanish single R' },
  { language: 'ko', sound: '어 vs 오', description: 'eo (ㅓ) vs o (ㅗ) — open vs rounded', examples: ['어머니 (mother) vs 오늘 (today)'], commonMistakes: ['Confusing the two vowels'], tonguePosition: 'ㅓ: mouth slightly open, tongue neutral. ㅗ: lips rounded, tongue back' },
  // French
  { language: 'fr', sound: 'R /ʁ/', description: 'French R — guttural, from the throat', examples: ['rouge', 'Paris', 'merci', 'trois'], commonMistakes: ['English R (too hard)'], tonguePosition: 'Back of tongue near uvula, create friction in throat' },
  { language: 'fr', sound: 'u /y/', description: 'French U — tongue like "ee", lips rounded like "oo"', examples: ['tu', 'rue', 'lune', 'sur'], commonMistakes: ['too (English oo)'], tonguePosition: 'Say "ee" (i), then round your lips without moving your tongue' },
  { language: 'fr', sound: 'Nasal vowels', description: 'an/en/in/on/un — air through nose and mouth', examples: ['pain (bread)', 'bon (good)', 'un (one)'], commonMistakes: ['Adding n sound at end'], tonguePosition: 'Lower soft palate so air flows through nose, never pronounce the N' },
  // Spanish
  { language: 'es', sound: 'R /r/', description: 'Spanish rolled R — multiple tongue taps', examples: ['perro', 'carro', 'arroz'], commonMistakes: ['pedo (soft single R)'], tonguePosition: 'Relaxed tongue tip, air flow makes it vibrate against alveolar ridge' },
  { language: 'es', sound: 'J /x/', description: 'Spanish J — guttural, like German ch in Bach', examples: ['jefe', 'trabajar', 'rojo'], commonMistakes: ['English H sound'], tonguePosition: 'Back of tongue near soft palate, create friction, no voice' },
  // German
  { language: 'de', sound: 'ch /ç/ and /x/', description: 'Ich-Laut (soft) vs Ach-Laut (hard)', examples: ['ich (soft)', 'nacht (hard)', 'sprechen'], commonMistakes: ['ick (k sound)', 'ish (sh sound)'], tonguePosition: 'Soft: tongue near hard palate. Hard: tongue near uvula' },
  { language: 'de', sound: 'ö /øː/ and ü /yː/', description: 'Umlauts — front rounded vowels', examples: ['schön', 'früh', 'Tür', 'hören'], commonMistakes: ['shon', 'fruh'], tonguePosition: 'ö: say "ay" then round lips. ü: say "ee" then round lips' },
  // Italian
  { language: 'it', sound: 'R /r/', description: 'Italian rolled R — similar to Spanish', examples: ['rosso', 'arrivederci', 'caro'], commonMistakes: ['English R'], tonguePosition: 'Tongue tip vibrates against alveolar ridge' },
  { language: 'it', sound: 'Gli /ʎ/', description: 'Palatal lateral — like "million" but merged', examples: ['famiglia', 'figlio', 'aglio'], commonMistakes: ['fa-mig-lia', 'fig-li-o'], tonguePosition: 'Middle of tongue touches hard palate, air flows around sides' },
  // Portuguese
  { language: 'pt', sound: 'ão /ɐ̃w̃/', description: 'Nasal diphthong — air through nose', examples: ['não', 'pão', 'coração'], commonMistakes: ['na-o (two syllables)'], tonguePosition: 'Single syllable, air through nose, lips round at end' },
  { language: 'pt', sound: 'lh /ʎ/', description: 'Palatal lateral — like Italian gli', examples: ['filho', 'trabalho', 'melhor'], commonMistakes: ['fil-yo', 'tra-bal-yo'], tonguePosition: 'Middle tongue to hard palate, air around sides' },
  // Arabic
  { language: 'ar', sound: 'ع (Ayn)', description: 'Pharyngeal voiced fricative — from deep throat', examples: ['عربي', 'علم', 'شارع'], commonMistakes: ['Skipping the sound', 'Using glottal stop'], tonguePosition: 'Constrict pharynx, vibrate vocal cords, no tongue involvement' },
  { language: 'ar', sound: 'ح (Ha)', description: 'Pharyngeal voiceless fricative — breathy H', examples: ['حبيب', 'مرحباً', 'حلو'], commonMistakes: ['English H (too light)'], tonguePosition: 'Constrict pharynx, breathe out hard, like fogging glasses' },
  // Chinese
  { language: 'zh', sound: 'ü /y/', description: 'Round front vowel — tongue like "ee", lips like "oo"', examples: ['女 (nǚ)', '绿 (lǜ)', '鱼 (yú)'], commonMistakes: ['nu', 'lu', 'yu (oo sound)'], tonguePosition: 'Say "ee", then round lips without moving tongue' },
  { language: 'zh', sound: 'zh/ch/sh vs j/q/x', description: 'Retroflex vs palatal — tongue position key', examples: ['知道 vs 鸡蛋', '吃饭 vs 七个', '是 vs 西'], commonMistakes: ['Confusing the two series'], tonguePosition: 'zh/ch/sh: tongue curled back. j/q/x: tongue flat against lower teeth' },
  { language: 'zh', sound: 'Tones (四声)', description: '4 tones + neutral: mā má mǎ mà ma', examples: ['妈 (mother) 麻 (hemp) 马 (horse) 骂 (scold) 吗 (question)'], commonMistakes: ['Flat intonation'], tonguePosition: '1st: high level. 2nd: rising. 3rd: dip then rise. 4th: falling sharply' },
];

// ── 纠错短语库（用于发音教练反馈）───────────────────────────────────────────

export interface CorrectionPhrase {
  id: string;
  language: string;
  phrase: string;
  translation: string;
  difficulty: number;
  focus: string; // What pronunciation aspect this focuses on
  phonetic: string;
}

export const CORRECTION_PHRASES: Record<string, CorrectionPhrase[]> = {
  en: [
    { id: 'cp_en_1', language: 'en', phrase: 'The thirty-three thieves thought that they thrilled the throne throughout Thursday.', translation: '33个小偷认为他们在周四让王座激动不已', difficulty: 5, focus: 'th-sound', phonetic: 'ðə ˈθɜrti θri θivz θɔt ðæt ðeɪ θrɪld ðə θroʊn θruˈaʊt ˈθɜrzdeɪ' },
    { id: 'cp_en_2', language: 'en', phrase: 'She sells seashells by the seashore.', translation: '她在海边卖贝壳', difficulty: 3, focus: 'sh-s-sound', phonetic: 'ʃi sɛlz ˈsiʃɛlz baɪ ðə ˈsiʃɔr' },
    { id: 'cp_en_3', language: 'en', phrase: 'Peter Piper picked a peck of pickled peppers.', translation: '彼得派珀摘了一配克腌辣椒', difficulty: 3, focus: 'p-sound', phonetic: 'ˈpitər ˈpaɪpər pɪkt ə pɛk əv ˈpɪkəld ˈpɛpərz' },
    { id: 'cp_en_4', language: 'en', phrase: 'How much wood would a woodchuck chuck if a woodchuck could chuck wood?', translation: '如果土拨鼠能扔木头，它能扔多少？', difficulty: 4, focus: 'w-sound', phonetic: 'haʊ mʌtʃ wʊd wʊd ə ˈwʊdˌtʃʌk tʃʌk ɪf ə ˈwʊdˌtʃʌk kʊd tʃʌk wʊd' },
    { id: 'cp_en_5', language: 'en', phrase: 'Red lorry, yellow lorry.', translation: '红卡车，黄卡车', difficulty: 2, focus: 'r-l-sound', phonetic: 'rɛd ˈlɔri ˈjɛloʊ ˈlɔri' },
  ],
  ja: [
    { id: 'cp_ja_1', language: 'ja', phrase: '生麦生米生卵 (なまむぎなまごめなまたまご)', translation: '生小麦、生米、生鸡蛋', difficulty: 4, focus: 'm-n-sound', phonetic: 'na-ma-mu-gi-na-ma-go-me-na-ma-ta-ma-go' },
    { id: 'cp_ja_2', language: 'ja', phrase: '東京特許許可局 (とうきょうとっきょきょかきょく)', translation: '东京专利许可局', difficulty: 5, focus: 'k-kyo-sound', phonetic: 'to-u-kyo-u-to-kkyo-kyo-ka-kyo-ku' },
    { id: 'cp_ja_3', language: 'ja', phrase: '隣の客はよく柿食う客だ (となりのきゃくはよくかきくうきゃくだ)', translation: '隔壁的客人是经常吃柿子的客人', difficulty: 3, focus: 'k-sound', phonetic: 'to-na-ri-no-kya-ku-wa-yo-ku-ka-ki-ku-u-kya-ku-da' },
    { id: 'cp_ja_4', language: 'ja', phrase: '赤巻紙青巻紙黄巻紙 (あかまきがみあおまきがみきまきがみ)', translation: '红卷纸蓝卷纸黄卷纸', difficulty: 4, focus: 'k-g-sound', phonetic: 'a-ka-ma-ki-ga-mi-a-o-ma-ki-ga-mi-ki-ma-ki-ga-mi' },
    { id: 'cp_ja_5', language: 'ja', phrase: 'バスガス爆発 (ばすがすばくはつ)', translation: '巴士瓦斯爆炸', difficulty: 2, focus: 'b-g-explosive', phonetic: 'ba-su-ga-su-ba-ku-ha-tsu' },
  ],
  ko: [
    { id: 'cp_ko_1', language: 'ko', phrase: '간장 공장 공장장은 강 공장장이고 된장 공장 공장장은 공 공장장이다.', translation: '酱油工厂厂长是姜厂长，大酱工厂厂长是孔厂长', difficulty: 5, focus: 'g-k-sound', phonetic: 'gan-jang gong-jang gong-jang-jang-eun gang gong-jang-jang-i-go dwen-jang gong-jang gong-jang-jang-eun gong gong-jang-jang-i-da' },
    { id: 'cp_ko_2', language: 'ko', phrase: '내가 그린 기린 그림은 긴 기린 그림이고 네가 그린 기린 그림은 안 긴 기린 그림이다.', translation: '我画的长颈鹿画是长的长颈鹿画，你画的是不长的', difficulty: 4, focus: 'g-k-n-sound', phonetic: 'nae-ga geu-rin gi-rin geu-rim-eun gin gi-rin geu-rim-i-go ne-ga geu-rin gi-rin geu-rim-eun an gin gi-rin geu-rim-i-da' },
  ],
  fr: [
    { id: 'cp_fr_1', language: 'fr', phrase: 'Un chasseur sachant chasser sait chasser sans son chien.', translation: '一个会打猎的猎人知道不带狗也能打猎', difficulty: 4, focus: 'ch-s-sound', phonetic: 'œ̃ ʃasœʁ saʃɑ̃ ʃase sɛ ʃase sɑ̃ sɔ̃ ʃjɛ̃' },
    { id: 'cp_fr_2', language: 'fr', phrase: 'Les chemises de l\'archiduchesse sont-elles sèches, archi-sèches?', translation: '大公夫人的衬衫干了吗？', difficulty: 5, focus: 'sh-s-sound', phonetic: 'le ʃəmiz də laʁʃidyʃɛs sɔ̃tɛl sɛʃ aʁʃi sɛʃ' },
  ],
  es: [
    { id: 'cp_es_1', language: 'es', phrase: 'Tres tristes tigres tragaban trigo en un trigal.', translation: '三只悲伤的老虎在麦田里吃小麦', difficulty: 4, focus: 'tr-r-sound', phonetic: 'tres ˈtristes ˈtiɣɾes tɾaˈɣaβan ˈtɾiɣo en un tɾiˈɣal' },
    { id: 'cp_es_2', language: 'es', phrase: 'El perro de San Roque no tiene rabo porque Ramón Rodríguez se lo ha robado.', translation: '圣罗克的狗没有尾巴因为被偷了', difficulty: 3, focus: 'r-rr-sound', phonetic: 'el ˈpero de san ˈroke no ˈtjene ˈraβo poɾˈke raˈmon roˈðɾiɣeθ se lo a roˈβaðo' },
  ],
  de: [
    { id: 'cp_de_1', language: 'de', phrase: 'Fischers Fritz fischt frische Fische.', translation: '渔夫弗里茨钓新鲜的鱼', difficulty: 3, focus: 'f-sh-sound', phonetic: 'ˈfɪʃɐs fʁɪts fɪʃt ˈfʁɪʃə ˈfɪʃə' },
    { id: 'cp_de_2', language: 'de', phrase: 'Blaukraut bleibt Blaukraut und Brautkleid bleibt Brautkleid.', translation: '紫甘蓝还是紫甘蓝，婚纱还是婚纱', difficulty: 4, focus: 'b-bl-br-sound', phonetic: 'ˈblaʊkʁaʊt blaɪpt ˈblaʊkʁaʊt ʊnt ˈbʁaʊtklaɪt blaɪpt ˈbʁaʊtklaɪt' },
  ],
  it: [
    { id: 'cp_it_1', language: 'it', phrase: 'Trentatré trentini entrarono a Trento tutti e trentatré trotterellando.', translation: '33个特伦托人小跑着进入特伦托', difficulty: 5, focus: 'tr-r-sound', phonetic: 'trentaˈtre trenˈtini enˈtrarono a ˈtrento ˈtutti e trentaˈtre trotterelˈlando' },
    { id: 'cp_it_2', language: 'it', phrase: 'Sopra la panca la capra campa, sotto la panca la capra crepa.', translation: '长凳上羊活着，长凳下羊死了', difficulty: 3, focus: 'c-p-sound', phonetic: 'ˈsopra la ˈpanka la ˈkapra ˈkampa ˈsotto la ˈpanka la ˈkapra ˈkrɛpa' },
  ],
  pt: [
    { id: 'cp_pt_1', language: 'pt', phrase: 'O rato roeu a roupa do rei de Roma.', translation: '老鼠咬了罗马国王的衣服', difficulty: 3, focus: 'r-sound', phonetic: 'u ˈʁatu ʁoˈew a ˈʁowpa du ˈʁej dʒi ˈʁomɐ' },
    { id: 'cp_pt_2', language: 'pt', phrase: 'Três pratos de trigo para três tigres tristes.', translation: '三盘小麦给三只悲伤的老虎', difficulty: 4, focus: 'tr-sound', phonetic: 'tɾeʃ ˈpɾatuʃ dʒi ˈtɾigu paɾa tɾeʃ ˈtʃigɾiʃ ˈtɾiʃtʃiʃ' },
  ],
  ar: [
    { id: 'cp_ar_1', language: 'ar', phrase: 'خيط حرير على حيط خليل', translation: '丝绸线在Khalil的墙上', difficulty: 4, focus: 'kh-h-sound', phonetic: 'khayṭ ḥarīr ʿalā ḥayṭ khalīl' },
    { id: 'cp_ar_2', language: 'ar', phrase: 'قميص قفطان قنديل قندلفت', translation: '衬衫长袍灯笼鞋匠', difficulty: 5, focus: 'q-sound', phonetic: 'qamīṣ qufṭān qindīl qandalafat' },
  ],
  zh: [
    { id: 'cp_zh_1', language: 'zh', phrase: '四是四，十是十，十四是十四，四十是四十。', translation: 'Four is four, ten is ten', difficulty: 4, focus: 's-sh-sound', phonetic: 'sì shì sì, shí shì shí, shísì shì shísì, sìshí shì sìshí' },
    { id: 'cp_zh_2', language: 'zh', phrase: '黑化肥发灰，灰化肥发黑。', translation: 'Black fertilizer turns gray', difficulty: 5, focus: 'h-f-sound', phonetic: 'hēi huàféi fā huī, huī huàféi fā hēi' },
    { id: 'cp_zh_3', language: 'zh', phrase: '妈妈骑马，马慢，妈妈骂马。', translation: 'Mom rides horse, horse is slow, mom scolds horse', difficulty: 3, focus: 'm-tone', phonetic: 'māma qí mǎ, mǎ màn, māma mà mǎ' },
    { id: 'cp_zh_4', language: 'zh', phrase: '吃葡萄不吐葡萄皮，不吃葡萄倒吐葡萄皮。', translation: 'Eat grapes don\'t spit skin, don\'t eat grapes but spit skin', difficulty: 3, focus: 'p-t-sound', phonetic: 'chī pútao bù tǔ pútao pí, bù chī pútao dào tǔ pútao pí' },
    { id: 'cp_zh_5', language: 'zh', phrase: '扁担长，板凳宽，扁担没有板凳宽，板凳没有扁担长。', translation: 'Carrying pole long, bench wide', difficulty: 4, focus: 'b-d-sound', phonetic: 'biǎndan cháng, bǎndèng kuān, biǎndan méiyǒu bǎndèng kuān, bǎndèng méiyǒu biǎndan cháng' },
  ],
};

// ── 导出工具函数 ─────────────────────────────────────────────────────────────

/** 根据语言和难度获取记忆技巧 */
export function getMemoryTips(language: string, method?: string): MemoryTip[] {
  const tips = MEMORY_TIPS[language] || MEMORY_TIPS.en;
  return method ? tips.filter(t => t.method === method) : tips;
}

/** 根据语言获取发音指南 */
export function getPronunciationGuide(language: string): PronunciationTip[] {
  return PRONUNCIATION_GUIDE.filter(t => t.language === language);
}

/** 根据语言获取纠错短句 */
export function getCorrectionPhrases(language: string, difficulty?: number): CorrectionPhrase[] {
  const phrases = CORRECTION_PHRASES[language] || CORRECTION_PHRASES.en;
  return difficulty ? phrases.filter(p => p.difficulty <= difficulty) : phrases;
}

/** 获取艾宾浩斯复习计划 */
export function getReviewSchedule(startDate: Date = new Date()): { day: number; date: Date }[] {
  return SPACED_REPETITION_SCHEDULE.map(day => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + day);
    return { day, date: d };
  });
}
