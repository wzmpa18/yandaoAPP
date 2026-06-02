export interface Template {
  id: string;
  type: 'joke' | 'radio' | 'grammar';
  language: string;
  template: string;
  variables: string[];
}

export interface WordBank {
  language: string;
  people: string[];
  places: string[];
  actions: string[];
  adjectives: string[];
  nouns: string[];
  adverbs: string[];
}

export const jokeTemplates: Template[] = [
  {
    id: 'joke_en_1',
    type: 'joke',
    language: 'en',
    template: 'Why did the {animal} cross the {place}? To get to the {adjective} side!',
    variables: ['animal', 'place', 'adjective']
  },
  {
    id: 'joke_en_2',
    type: 'joke',
    language: 'en',
    template: 'What do you call {number} {animal}s in a {container}? A {collective_noun}!',
    variables: ['number', 'animal', 'container', 'collective_noun']
  },
  {
    id: 'joke_en_3',
    type: 'joke',
    language: 'en',
    template: 'I told my computer I needed a break. It replied, "{computer_response}"',
    variables: ['computer_response']
  },
  {
    id: 'joke_en_4',
    type: 'joke',
    language: 'en',
    template: 'Why don\'t skeletons fight each other? They don\'t have the {body_part}!',
    variables: ['body_part']
  },
  {
    id: 'joke_en_5',
    type: 'joke',
    language: 'en',
    template: 'How does a {profession} {action}? With {tool}!',
    variables: ['profession', 'action', 'tool']
  },
  {
    id: 'joke_en_6',
    type: 'joke',
    language: 'en',
    template: 'What do you get when you mix {food1} and {food2}? {funny_result}!',
    variables: ['food1', 'food2', 'funny_result']
  },
  {
    id: 'joke_en_7',
    type: 'joke',
    language: 'en',
    template: 'Why was the math book sad? Because it had too many {problem_type}!',
    variables: ['problem_type']
  },
  {
    id: 'joke_en_8',
    type: 'joke',
    language: 'en',
    template: 'A {animal} walks into a bar. The bartender says, "{bartender_line}"',
    variables: ['animal', 'bartender_line']
  },
  {
    id: 'joke_ja_1',
    type: 'joke',
    language: 'ja',
    template: '{人物}が{場所}で{動作}をしていたら、突然{意外な出来事}が起きた！',
    variables: ['人物', '場所', '動作', '意外な出来事']
  },
  {
    id: 'joke_ja_2',
    type: 'joke',
    language: 'ja',
    template: 'なぜ{動物}が{場所}を渡ったのか？{理由}だから！',
    variables: ['動物', '場所', '理由']
  },
  {
    id: 'joke_ja_3',
    type: 'joke',
    language: 'ja',
    template: '{職業}の人が「{セリフ}」と言ったら、周りの人は{反応}した',
    variables: ['職業', 'セリフ', '反応']
  },
  {
    id: 'joke_ja_4',
    type: 'joke',
    language: 'ja',
    template: '{食べ物}と{食べ物}を混ぜると何になる？{面白い結果}！',
    variables: ['食べ物', '食べ物', '面白い結果']
  },
  {
    id: 'joke_ko_1',
    type: 'joke',
    language: 'ko',
    template: '{동물}이 {장소}를 건너려고 했는데 왔어? {이유} 때문이지!',
    variables: ['동물', '장소', '이유']
  },
  {
    id: 'joke_ko_2',
    type: 'joke',
    language: 'ko',
    template: '{직업}이 "{대사}"라고 말했을 때 주변 사람들은 {반응}했어',
    variables: ['직업', '대사', '반응']
  },
  {
    id: 'joke_fr_1',
    type: 'joke',
    language: 'fr',
    template: 'Pourquoi le {animal} a traversé la {place}? Pour aller du côté {adjective} !',
    variables: ['animal', 'place', 'adjective']
  },
  {
    id: 'joke_fr_2',
    type: 'joke',
    language: 'fr',
    template: 'Qu\'est-ce qu\'on obtient quand on mélange {food1} et {food2}? {resultat} !',
    variables: ['food1', 'food2', 'resultat']
  },
  {
    id: 'joke_es_1',
    type: 'joke',
    language: 'es',
    template: '¿Por qué cruzó el {animal} la {place}? ¡Para llegar al lado {adjective}!',
    variables: ['animal', 'place', 'adjective']
  },
  {
    id: 'joke_es_2',
    type: 'joke',
    language: 'es',
    template: '¿Qué se obtiene al mezclar {food1} y {food2}? {resultado}!',
    variables: ['food1', 'food2', 'resultado']
  },
  {
    id: 'joke_de_1',
    type: 'joke',
    language: 'de',
    template: 'Warum hat das {animal} die {place} überquert? Um zur {adjective} Seite zu kommen!',
    variables: ['animal', 'place', 'adjective']
  },
];

export const radioTemplates: Template[] = [
  {
    id: 'radio_en_1',
    type: 'radio',
    language: 'en',
    template: 'Welcome back to our show! Today we\'re talking about {topic}. Let\'s start with a fun fact: {fun_fact}. What do you think about {question}? Share your thoughts with us!',
    variables: ['topic', 'fun_fact', 'question']
  },
  {
    id: 'radio_en_2',
    type: 'radio',
    language: 'en',
    template: 'Good {time_of_day}, listeners! Today\'s special guest is {guest_name}, who will talk about {topic}. Let\'s dive right in!',
    variables: ['time_of_day', 'guest_name', 'topic']
  },
  {
    id: 'radio_en_3',
    type: 'radio',
    language: 'en',
    template: 'In today\'s episode, we explore {theme}. We\'ll cover {point1}, {point2}, and {point3}. Stay tuned for some great tips!',
    variables: ['theme', 'point1', 'point2', 'point3']
  },
  {
    id: 'radio_en_4',
    type: 'radio',
    language: 'en',
    template: 'Hello and welcome! Today we have a special segment: {segment_name}. We\'ll be discussing {topic} and answering your questions.',
    variables: ['segment_name', 'topic']
  },
  {
    id: 'radio_en_5',
    type: 'radio',
    language: 'en',
    template: 'Welcome to our {day_of_week} special! Today we\'re focusing on {topic}. Here are our top {number} tips for {action}.',
    variables: ['day_of_week', 'topic', 'number', 'action']
  },
  {
    id: 'radio_ja_1',
    type: 'radio',
    language: 'ja',
    template: 'ラジオ{番組名}へようこそ！今日は{トピック}についてお話しします。まずは{興味深い事実}を紹介します。',
    variables: ['番組名', 'トピック', '興味深い事実']
  },
  {
    id: 'radio_ja_2',
    type: 'radio',
    language: 'ja',
    template: '{時間帯}の皆さん、こんにちは！今日のゲストは{ゲスト名}です。{トピック}についてお話しします。',
    variables: ['時間帯', 'ゲスト名', 'トピック']
  },
  {
    id: 'radio_ko_1',
    type: 'radio',
    language: 'ko',
    template: '라디오 {프로그램명}에 오신 것을 환영합니다! 오늘은 {주제}에 대해 이야기하겠습니다. 먼저 {흥미로운 사실}을 알려드릴게요.',
    variables: ['프로그램명', '주제', '흥미로운 사실']
  },
];

export const grammarTemplates: Template[] = [
  {
    id: 'grammar_en_1',
    type: 'grammar',
    language: 'en',
    template: 'Choose the correct form: He {verb} to school every day.',
    variables: ['verb'],
    options: ['go', 'goes', 'going', 'went']
  },
  {
    id: 'grammar_en_2',
    type: 'grammar',
    language: 'en',
    template: 'Complete the sentence: I have been {verb} English for {time}.',
    variables: ['verb', 'time'],
    options: ['study', 'studying', 'studied', 'studies']
  },
  {
    id: 'grammar_en_3',
    type: 'grammar',
    language: 'en',
    template: 'Choose the correct article: She is {article} doctor.',
    variables: ['article'],
    options: ['a', 'an', 'the', '-']
  },
  {
    id: 'grammar_en_4',
    type: 'grammar',
    language: 'en',
    template: 'Rewrite the sentence in passive: They built {noun}.',
    variables: ['noun']
  },
  {
    id: 'grammar_en_5',
    type: 'grammar',
    language: 'en',
    template: 'Choose the correct preposition: He arrived {preposition} the airport.',
    variables: ['preposition'],
    options: ['at', 'in', 'on', 'to']
  },
  {
    id: 'grammar_en_6',
    type: 'grammar',
    language: 'en',
    template: 'Choose the correct pronoun: {pronoun} is my friend.',
    variables: ['pronoun'],
    options: ['He', 'Him', 'His', 'He\'s']
  },
  {
    id: 'grammar_en_7',
    type: 'grammar',
    language: 'en',
    template: 'Complete with comparative: This book is {adjective} than that one.',
    variables: ['adjective'],
    options: ['interesting', 'more interesting', 'most interesting', 'interestinger']
  },
  {
    id: 'grammar_en_8',
    type: 'grammar',
    language: 'en',
    template: 'Choose the correct conjunction: I like tea {conjunction} coffee.',
    variables: ['conjunction'],
    options: ['and', 'but', 'or', 'because']
  },
  {
    id: 'grammar_ja_1',
    type: 'grammar',
    language: 'ja',
    template: '{人物}は{場所}へ{動作}ました。（敬体/常体の使い分け）',
    variables: ['人物', '場所', '動作']
  },
  {
    id: 'grammar_ja_2',
    type: 'grammar',
    language: 'ja',
    template: '{名詞}は{形容詞}です。（否定形にすると？）',
    variables: ['名詞', '形容詞']
  },
  {
    id: 'grammar_ko_1',
    type: 'grammar',
    language: 'ko',
    template: '{명사}는 {형용사}입니다. (부정형으로 바꾸시오)',
    variables: ['명사', '형용사']
  },
  {
    id: 'grammar_ko_2',
    type: 'grammar',
    language: 'ko',
    template: '{동사}는 어떻게 해요? (해라체로 바꾸시오)',
    variables: ['동사']
  },
];

export const wordBanks: Record<string, WordBank> = {
  en: {
    language: 'en',
    people: ['teacher', 'student', 'doctor', 'firefighter', 'chef', 'pilot', 'artist', 'musician', 'engineer', 'scientist', 'police', 'nurse', 'actor', 'writer', 'athlete', 'chef', 'driver', 'photographer', 'designer', 'developer', 'manager', 'accountant', 'lawyer', 'architect', 'carpenter', 'electrician', 'plumber', 'painter', 'dancer', 'singer', 'comedian', 'magician', 'veterinarian', 'pharmacist', 'dentist', 'surgeon', 'professor', 'journalist', 'reporter', 'editor', 'publisher', 'businessman', 'businesswoman', 'entrepreneur', 'investor', 'banker', 'trader', 'farmer', 'fisherman', 'hunter', 'explorer'],
    places: ['park', 'store', 'school', 'hospital', 'restaurant', 'cafe', 'library', 'museum', 'theater', 'stadium', 'airport', 'train station', 'bus stop', 'office', 'factory', 'market', 'mall', 'beach', 'mountain', 'forest', 'river', 'lake', 'ocean', 'island', 'city', 'village', 'town', 'countryside', 'desert', 'jungle', 'cave', 'castle', 'palace', 'temple', 'church', 'mosque', 'synagogue', 'zoo', 'aquarium', 'amusement park', 'circus', 'gym', 'spa', 'hotel', 'motel', 'hostel', 'campground', 'beach house', 'cabin', 'tent'],
    actions: ['running', 'jumping', 'swimming', 'dancing', 'singing', 'laughing', 'crying', 'eating', 'drinking', 'sleeping', 'reading', 'writing', 'drawing', 'painting', 'cooking', 'cleaning', 'washing', 'ironing', 'sewing', 'knitting', 'gardening', 'fishing', 'hiking', 'camping', 'traveling', 'shopping', 'working', 'studying', 'teaching', 'learning', 'playing', 'watching', 'listening', 'talking', 'chatting', 'arguing', 'explaining', 'asking', 'answering', 'helping', 'fixing', 'building', 'breaking', 'repairing', 'creating', 'destroying', 'finding', 'losing', 'hiding', 'seeking'],
    adjectives: ['happy', 'sad', 'angry', 'excited', 'bored', 'tired', 'hungry', 'thirsty', 'sleepy', 'awake', 'beautiful', 'ugly', 'smart', 'dumb', 'funny', 'serious', 'friendly', 'mean', 'kind', 'cruel', 'brave', 'scared', 'confident', 'shy', 'loud', 'quiet', 'fast', 'slow', 'big', 'small', 'tall', 'short', 'fat', 'thin', 'old', 'young', 'new', 'old', 'hot', 'cold', 'warm', 'cool', 'wet', 'dry', 'soft', 'hard', 'smooth', 'rough', 'bright', 'dark'],
    nouns: ['cat', 'dog', 'bird', 'fish', 'rabbit', 'hamster', 'turtle', 'snake', 'frog', 'butterfly', 'bee', 'ant', 'spider', 'flower', 'tree', 'grass', 'water', 'fire', 'sun', 'moon', 'star', 'cloud', 'rain', 'snow', 'wind', 'mountain', 'river', 'ocean', 'island', 'desert', 'forest', 'jungle', 'city', 'building', 'car', 'bus', 'train', 'plane', 'boat', 'bike', 'phone', 'computer', 'book', 'pen', 'paper', 'table', 'chair', 'bed', 'lamp', 'clock', 'watch'],
    adverbs: ['quickly', 'slowly', 'happily', 'sadly', 'angrily', 'quietly', 'loudly', 'carefully', 'carelessly', 'quickly', 'slowly', 'easily', 'hardly', 'really', 'very', 'too', 'enough', 'quite', 'rather', 'fairly', 'almost', 'nearly', 'just', 'only', 'even', 'also', 'too', 'either', 'neither', 'still', 'already', 'yet', 'just', 'recently', 'lately', 'often', 'usually', 'always', 'sometimes', 'occasionally', 'rarely', 'seldom', 'never', 'daily', 'weekly', 'monthly', 'yearly']
  },
  ja: {
    language: 'ja',
    people: ['先生', '生徒', '医者', '消防士', 'シェフ', 'パイロット', 'アーティスト', 'ミュージシャン', 'エンジニア', '科学者', '警察官', '看護師', '俳優', '作家', 'アスリート', '運転手', '写真家', 'デザイナー', '開発者', 'マネージャー', '会計士', '弁護士', '建築家', '大工', '電気技師', '水道修理工', '画家', 'ダンサー', '歌手', 'コメディアン', '魔術師', '獣医', '薬剤師', '歯医者', '外科医', '教授', 'ジャーナリスト', 'レポーター', '編集者', '出版社員', 'ビジネスマン', 'ビジネスウーマン', '起業家', '投資家', '銀行員', 'トレーダー', '農家', '漁師', '猟師', '探検家'],
    places: ['公園', '店', '学校', '病院', 'レストラン', 'カフェ', '図書館', '美術館', '劇場', 'スタジアム', '空港', '駅', 'バス停', 'オフィス', '工場', '市場', 'モール', 'ビーチ', '山', '森林', '川', '湖', '海', '島', '都市', '村', '町', '田舎', '砂漠', 'ジャングル', '洞窟', '城', '宮殿', '寺院', '教会', 'モスク', 'シナゴーグ', '動物園', '水族館', '遊園地', 'サーカス', 'ジム', 'スパ', 'ホテル', 'モーテル', 'ホステル', 'キャンプ場', 'ビーチハウス', 'キャビン', 'テント'],
    actions: ['走る', '跳ぶ', '泳ぐ', '踊る', '歌う', '笑う', '泣く', '食べる', '飲む', '寝る', '読む', '書く', '描く', '絵を描く', '料理する', '掃除する', '洗濯する', 'アイロンをかける', '縫う', '編む', '庭作り', '釣り', 'ハイキング', 'キャンプ', '旅行', '買い物', '働く', '勉強する', '教える', '学ぶ', '遊ぶ', '見る', '聞く', '話す', 'チャット', '議論する', '説明する', '尋ねる', '答える', '助ける', '修理する', '建てる', '壊す', '修復する', '創造する', '破壊する', '見つける', '失う', '隠す', '探す'],
    adjectives: ['幸せ', '悲しい', '怒った', '興奮した', '退屈な', '疲れた', '空腹の', '喉の渇いた', '眠い', '目覚めた', '美しい', '醜い', '賢い', '愚かな', '面白い', '深刻な', '友好的な', '意地悪な', '親切な', '残酷な', '勇敢な', '怖がりな', '自信のある', '恥ずかしがり屋', 'うるさい', '静かな', '速い', '遅い', '大きい', '小さい', '背の高い', '背の低い', '太った', '痩せた', '年配の', '若い', '新しい', '古い', '暑い', '寒い', '暖かい', '涼しい', '濡れた', '乾いた', '柔らかい', '硬い', '滑らかな', '粗い', '明るい', '暗い'],
    nouns: ['猫', '犬', '鳥', '魚', 'ウサギ', 'ハムスター', '亀', '蛇', '蛙', '蝶', '蜂', '蟻', '蜘蛛', '花', '木', '草', '水', '火', '太陽', '月', '星', '雲', '雨', '雪', '風', '山', '川', '海', '島', '砂漠', '森林', 'ジャングル', '都市', '建物', '車', 'バス', '電車', '飛行機', '船', '自転車', '電話', 'コンピューター', '本', 'ペン', '紙', 'テーブル', '椅子', 'ベッド', 'ランプ', '時計', '腕時計'],
    adverbs: ['速く', 'ゆっくり', '幸せに', '悲しく', '怒って', '静かに', '大声で', '注意深く', '不注意に', '簡単に', 'ほとんど', '本当に', '非常に', 'とても', '十分に', 'かなり', 'かなり', 'ほとんど', 'ほぼ', 'ちょうど', 'ただ', 'さえ', 'また', 'も', 'どちらも', 'どちらもない', 'まだ', '既に', 'まだ', 'ちょうど', '最近', '最近', 'しばしば', '通常', 'いつも', '時々', '時折', 'めったに', 'めったに', '決して', '毎日', '毎週', '毎月', '毎年']
  },
  ko: {
    language: 'ko',
    people: ['교사', '학생', '의사', '소방관', '셰프', '파일럿', '아티스트', '뮤지션', '엔지니어', '과학자', '경찰관', '간호사', '배우', '작가', '운동선수', '운전사', '사진가', '디자이너', '개발자', '매니저', '회계사', '변호사', '건축가', '목수', '전기기술자', '수도공', '화가', '댄서', '가수', '코미디언', '마술사', '수의사', '약사', '치과의사', '외과의사', '교수', '저널리스트', '리포터', '편집자', '출판사원', '비즈니스맨', '비즈니스우먼', '기업가', '투자자', '은행원', '트레이더', '농부', '어부', '사냥꾼', '탐험가'],
    places: ['공원', '가게', '학교', '병원', '레스토랑', '카페', '도서관', '미술관', '극장', '스타디움', '공항', '역', '버스정류장', '오피스', '공장', '시장', '몰', '비치', '산', '숲', '강', '호수', '바다', '섬', '도시', '마을', '읍', '시골', '사막', '정글', '동굴', '성', '궁전', '사원', '교회', '모스크', '시나고그', '동물원', '수족관', '놀이공원', '서커스', '짐', '스파', '호텔', '모텔', '호스텔', '캠프장', '비치하우스', '캐빈', '텐트'],
    actions: ['달리다', '뛰다', '수영하다', '춤추다', '노래하다', '웃다', '울다', '먹다', '마시다', '잠을 자다', '읽다', '쓰다', '그리다', '그림을 그리다', '요리하다', '청소하다', '빨래하다', '다림질하다', '꿰매다', '뜨개질하다', '정원 가꾸기', '낚시', '하이킹', '캠핑', '여행', '쇼핑', '일하다', '공부하다', '가르치다', '배우다', '놀다', '보다', '듣다', '말하다', '채팅', '논쟁하다', '설명하다', '묻다', '대답하다', '도와주다', '수리하다', '짓다', '부수다', '복구하다', '창조하다', '파괴하다', '찾다', '잃다', '숨기다', '찾다'],
    adjectives: ['행복한', '슬픈', '화난', '흥분한', '지루한', '피곤한', '배고픈', '목마른', '졸린', '깨어있는', '아름다운', '못생긴', '똑똑한', '바보 같은', '재미있는', '심각한', '우호적인', '심술궂은', '친절한', '잔인한', '용감한', '겁쟁이', '자신감 있는', '수줍은', '시끄러운', '조용한', '빠른', '느린', '큰', '작은', '키가 큰', '키가 작은', '뚱뚱한', '마른', '나이 많은', '젊은', '새로운', '오래된', '뜨거운', '차가운', '따뜻한', '시원한', '젖은', '마른', '부드러운', '단단한', '매끄러운', '거친', '밝은', '어두운'],
    nouns: ['고양이', '개', '새', '물고기', '토끼', '햄스터', '거북이', '뱀', '개구리', '나비', '벌', '개미', '거미', '꽃', '나무', '풀', '물', '불', '태양', '달', '별', '구름', '비', '눈', '바람', '산', '강', '바다', '섬', '사막', '숲', '정글', '도시', '건물', '차', '버스', '기차', '비행기', '배', '자전거', '전화', '컴퓨터', '책', '펜', '종이', '테이블', '의자', '침대', '램프', '시계', '시계'],
    adverbs: ['빨리', '천천히', '행복하게', '슬프게', '화나게', '조용히', '크게', '조심스럽게', '조심하지 않게', '쉽게', '거의', '정말', '매우', '너무', '충분히', '꽤', '꽤', '거의', '거의', '막', '오직', '심지어', '또', '도', '둘 다', '둘 다 아님', '아직', '이미', '아직', '막', '최근', '최근', '자주', '보통', '항상', '때때로', '간혹', '드물게', '드물게', '절대', '매일', '매주', '매달', '매년']
  },
  fr: {
    language: 'fr',
    people: ['professeur', 'étudiant', 'médecin', 'pompier', 'chef', 'pilote', 'artiste', 'musicien', 'ingénieur', 'scientifique', 'policier', 'infirmière', 'acteur', 'écrivain', 'athlète', 'chauffeur', 'photographe', 'designer', 'développeur', 'manager', 'comptable', 'avocat', 'architecte', 'charpentier', 'électricien', 'plombier', 'peintre', 'danseur', 'chanteur', 'comédien', 'magicien', 'vétérinaire', 'pharmacien', 'dentiste', 'chirurgien', 'professeur', 'journaliste', 'reporter', 'éditeur', 'éditeur', 'homme d\'affaires', 'femme d\'affaires', 'entrepreneur', 'investisseur', 'banquier', 'trader', 'fermier', 'pêcheur', 'chasseur', 'explorateur'],
    places: ['parc', 'magasin', 'école', 'hôpital', 'restaurant', 'café', 'bibliothèque', 'musée', 'théâtre', 'stade', 'aéroport', 'gare', 'arrêt de bus', 'bureau', 'usine', 'marché', 'centre commercial', 'plage', 'montagne', 'forêt', 'rivière', 'lac', 'océan', 'île', 'ville', 'village', 'bourg', 'campagne', 'désert', 'jungle', 'grotte', 'château', 'palais', 'temple', 'église', 'mosquée', 'synagogue', 'zoo', 'aquarium', 'parc d\'attractions', 'cirque', 'gym', 'spa', 'hôtel', 'motel', 'auberge', 'camping', 'maison de plage', 'cabane', 'tente'],
    actions: ['courir', 'sauter', 'nager', 'danser', 'chanter', 'rire', 'pleurer', 'manger', 'boire', 'dormir', 'lire', 'écrire', 'dessiner', 'peindre', 'cuisiner', 'nettoyer', 'laver', 'repasser', 'coudre', 'tricoter', 'jardiner', 'pêcher', 'randonner', 'camping', 'voyager', 'faire du shopping', 'travailler', 'étudier', 'enseigner', 'apprendre', 'jouer', 'regarder', 'écouter', 'parler', 'chat', 'argumenter', 'expliquer', 'demander', 'répondre', 'aider', 'réparer', 'construire', 'casser', 'réparer', 'créer', 'détruire', 'trouver', 'perdre', 'cacher', 'chercher'],
    adjectives: ['heureux', 'triste', 'fâché', 'excité', 'ennuyé', 'fatigué', 'affamé', 'assoiffé', 'endormi', 'éveillé', 'beau', 'laid', 'intelligent', 'stupide', 'drôle', 'sérieux', 'amiable', 'méchant', 'gentil', 'cruel', 'brave', 'effrayé', 'confiant', 'timide', 'bruyant', 'calme', 'rapide', 'lent', 'grand', 'petit', 'haut', 'bas', 'gros', 'maigre', 'vieux', 'jeune', 'nouveau', 'vieux', 'chaud', 'froid', 'chaud', 'frais', 'humide', 'sec', 'doux', 'dur', 'lisse', 'rugueux', 'clair', 'sombre'],
    nouns: ['chat', 'chien', 'oiseau', 'poisson', 'lapin', 'hamster', 'tortue', 'serpent', 'grenouille', 'papillon', 'abeille', 'fourmi', 'araignée', 'fleur', 'arbre', 'herbe', 'eau', 'feu', 'soleil', 'lune', 'étoile', 'nuage', 'pluie', 'neige', 'vent', 'montagne', 'rivière', 'océan', 'île', 'désert', 'forêt', 'jungle', 'ville', 'bâtiment', 'voiture', 'bus', 'train', 'avion', 'bateau', 'vélo', 'téléphone', 'ordinateur', 'livre', 'stylo', 'papier', 'table', 'chaise', 'lit', 'lampe', 'horloge', 'montre'],
    adverbs: ['rapidement', 'lentement', 'joyeusement', 'tristement', 'fâcheusement', 'silencieusement', 'fort', 'prudemment', 'imprudemment', 'facilement', 'peu', 'vraiment', 'très', 'trop', 'assez', 'assez', 'presque', 'presque', 'juste', 'seulement', 'même', 'aussi', 'trop', 'non plus', 'ni', 'encore', 'déjà', 'pas encore', 'juste', 'récemment', 'dernièrement', 'souvent', 'généralement', 'toujours', 'parfois', 'occasionnellement', 'rarement', 'rarement', 'jamais', 'quotidiennement', 'hebdomadairement', 'mensuellement', 'annuellement']
  },
  es: {
    language: 'es',
    people: ['profesor', 'estudiante', 'médico', 'bombero', 'chef', 'piloto', 'artista', 'músico', 'ingeniero', 'científico', 'policía', 'enfermera', 'actor', 'escritor', 'atleta', 'conductor', 'fotógrafo', 'diseñador', 'desarrollador', 'gerente', 'contador', 'abogado', 'arquitecto', 'carpintero', 'electricista', 'fontanero', 'pintor', 'bailarín', 'cantante', 'comediante', 'mago', 'veterinario', 'farmacéutico', 'dentista', 'cirujano', 'profesor', 'periodista', 'reportero', 'editor', 'editor', 'hombre de negocios', 'mujer de negocios', 'empresario', 'inversor', 'banquero', 'trader', 'granjero', 'pescador', 'cazador', 'explorador'],
    places: ['parque', 'tienda', 'escuela', 'hospital', 'restaurante', 'café', 'biblioteca', 'museo', 'teatro', 'estadio', 'aeropuerto', 'estación', 'parada de autobús', 'oficina', 'fábrica', 'mercado', 'centro comercial', 'playa', 'montaña', 'bosque', 'río', 'lago', 'océano', 'isla', 'ciudad', 'pueblo', 'aldea', 'campo', 'desierto', 'selva', 'cueva', 'castillo', 'palacio', 'templo', 'iglesia', 'mezquita', 'sinagoga', 'zoo', 'acuario', 'parque de atracciones', 'circo', 'gym', 'spa', 'hotel', 'motel', 'posada', 'campamento', 'casa de playa', 'cabaña', 'tienda de campaña'],
    actions: ['correr', 'saltar', 'nadar', 'bailar', 'cantar', 'reír', 'llorar', 'comer', 'beber', 'dormir', 'leer', 'escribir', 'dibujar', 'pintar', 'cocinar', 'limpiar', 'lavar', 'planchar', 'coser', 'tejer', 'jardinería', 'pescar', 'senderismo', 'acampar', 'viajar', 'ir de compras', 'trabajar', 'estudiar', 'enseñar', 'aprender', 'jugar', 'mirar', 'escuchar', 'hablar', 'charlar', 'argumentar', 'explicar', 'preguntar', 'responder', 'ayudar', 'reparar', 'construir', 'romper', 'arreglar', 'crear', 'destruir', 'encontrar', 'perder', 'esconder', 'buscar'],
    adjectives: ['feliz', 'triste', 'enfadado', 'emocionado', 'aburrido', 'cansado', 'hambriento', 'sediento', 'dormido', 'despierto', 'hermoso', 'feo', 'inteligente', 'tonto', 'gracioso', 'serio', 'amigable', 'malo', 'amable', 'cruel', 'valiente', 'asustado', 'confiado', 'tímido', 'ruidoso', 'callado', 'rápido', 'lento', 'grande', 'pequeño', 'alto', 'bajo', 'gordo', 'delgado', 'viejo', 'joven', 'nuevo', 'viejo', 'caliente', 'frío', 'caluroso', 'fresco', 'húmedo', 'seco', 'suave', 'duro', 'liso', 'rugoso', 'claro', 'oscuro'],
    nouns: ['gato', 'perro', 'pájaro', 'pez', 'conejo', 'hámster', 'tortuga', 'serpiente', 'rana', 'mariposa', 'abeja', 'hormiga', 'araña', 'flor', 'árbol', 'hierba', 'agua', 'fuego', 'sol', 'luna', 'estrella', 'nube', 'lluvia', 'nieve', 'viento', 'montaña', 'río', 'océano', 'isla', 'desierto', 'bosque', 'selva', 'ciudad', 'edificio', 'coche', 'autobús', 'tren', 'avión', 'barco', 'bicicleta', 'teléfono', 'ordenador', 'libro', 'bolígrafo', 'papel', 'mesa', 'silla', 'cama', 'lámpara', 'reloj', 'reloj de pulsera'],
    adverbs: ['rápidamente', 'lentamente', 'felizmente', 'tristemente', 'enfadadamente', 'silenciosamente', 'fuertemente', 'cuidadosamente', 'descuidadamente', 'fácilmente', 'casi', 'realmente', 'muy', 'demasiado', 'suficientemente', 'bastante', 'casi', 'casi', 'justo', 'solo', 'incluso', 'también', 'también', 'tampoco', 'ni', 'todavía', 'ya', 'todavía no', 'justo', 'recientemente', 'últimamente', 'a menudo', 'normalmente', 'siempre', 'a veces', 'ocasionalmente', 'raramente', 'raramente', 'nunca', 'diariamente', 'semanalmente', 'mensualmente', 'anualmente']
  },
  de: {
    language: 'de',
    people: ['Lehrer', 'Student', 'Arzt', 'Feuerwehrmann', 'Koch', 'Pilot', 'Künstler', 'Musiker', 'Ingenieur', 'Wissenschaftler', 'Polizist', 'Krankenschwester', 'Schauspieler', 'Autor', 'Athlet', 'Fahrer', 'Fotograf', 'Designer', 'Entwickler', 'Manager', 'Buchhalter', 'Anwalt', 'Architekt', 'Schreiner', 'Elektriker', 'Klempner', 'Maler', 'Tänzer', 'Sänger', 'Komiker', 'Zauberer', 'Tierarzt', 'Apotheker', 'Zahnarzt', 'Chirurg', 'Professor', 'Journalist', 'Reporter', 'Redakteur', 'Verleger', 'Geschäftsmann', 'Geschäftsfrau', 'Unternehmer', 'Investor', 'Banker', 'Händler', 'Bauer', 'Fischer', 'Jäger', 'Explorer'],
    places: ['Park', 'Laden', 'Schule', 'Krankenhaus', 'Restaurant', 'Café', 'Bibliothek', 'Museum', 'Theater', 'Stadion', 'Flughafen', 'Bahnhof', 'Haltestelle', 'Büro', 'Fabrik', 'Markt', 'Einkaufszentrum', 'Strand', 'Berg', 'Wald', 'Fluss', 'See', 'Ozean', 'Insel', 'Stadt', 'Dorf', 'Ort', 'Landschaft', 'Wüste', 'Dschungel', 'Höhle', 'Schloss', 'Palast', 'Tempel', 'Kirche', 'Moschee', 'Synagoge', 'Zoo', 'Aquarium', 'Freizeitpark', 'Zirkus', 'Fitnessstudio', 'Spa', 'Hotel', 'Motel', 'Herberge', 'Campingplatz', 'Strandhaus', 'Hütte', 'Zelt'],
    actions: ['laufen', 'springen', 'schwimmen', 'tanzen', 'singen', 'lachen', 'weinen', 'essen', 'trinken', 'schlafen', 'lesen', 'schreiben', 'zeichnen', 'malen', 'kochen', 'sauber machen', 'waschen', 'bügeln', 'nähen', 'stricken', 'gärtnern', 'angeln', 'wandern', 'camping', 'reisen', 'einkaufen', 'arbeiten', 'lernen', 'lehren', 'lernen', 'spielen', 'schauen', 'hören', 'sprechen', 'chatten', 'streiten', 'erklären', 'fragen', 'antworten', 'helfen', 'reparieren', 'bauen', 'zerbrechen', 'reparieren', 'schaffen', 'zerstören', 'finden', 'verlieren', 'verstecken', 'suchen'],
    adjectives: ['glücklich', 'traurig', 'wütend', 'aufgeregt', 'langweilig', 'müde', 'hungrig', 'durstig', 'schläfrig', 'wach', 'schön', 'hässlich', 'klug', 'dumm', 'lustig', 'ernst', 'freundlich', 'böse', 'nett', 'grausam', 'tapfer', 'ängstlich', 'selbstsicher', 'schüchtern', 'laut', 'leise', 'schnell', 'langsam', 'groß', 'klein', 'hoch', 'niedrig', 'fett', 'dünn', 'alt', 'jung', 'neu', 'alt', 'heiß', 'kalt', 'warm', 'kühl', 'nass', 'trocken', 'weich', 'hart', 'glatt', 'rau', 'hell', 'dunkel'],
    nouns: ['Katze', 'Hund', 'Vogel', 'Fisch', 'Kaninchen', 'Hamster', 'Schildkröte', 'Schlange', 'Frosch', 'Schmetterling', 'Biene', 'Ameise', 'Spinne', 'Blume', 'Baum', 'Gras', 'Wasser', 'Feuer', 'Sonne', 'Mond', 'Sterne', 'Wolke', 'Regen', 'Schnee', 'Wind', 'Berg', 'Fluss', 'Ozean', 'Insel', 'Wüste', 'Wald', 'Dschungel', 'Stadt', 'Gebäude', 'Auto', 'Bus', 'Zug', 'Flugzeug', 'Boot', 'Fahrrad', 'Telefon', 'Computer', 'Buch', 'Stift', 'Papier', 'Tisch', 'Stuhl', 'Bett', 'Lampe', 'Uhr', 'Armbanduhr'],
    adverbs: ['schnell', 'langsam', 'glücklicherweise', 'traurig', 'wütend', 'leise', 'laut', 'vorsichtig', 'unvorsichtig', 'einfach', 'fast', 'wirklich', 'sehr', 'zu', 'genug', 'ziemlich', 'fast', 'fast', 'gerade', 'nur', 'sogar', 'auch', 'auch', 'weder', 'noch', 'immer noch', 'schon', 'noch nicht', 'gerade', 'kürzlich', 'letztens', 'oft', 'normalerweise', 'immer', 'manchmal', 'gelegentlich', 'selten', 'selten', 'nie', 'täglich', 'wöchentlich', 'monatlich', 'jährlich']
  }
};

export const extraVariables: Record<string, Record<string, string[]>> = {
  en: {
    animal: ['cat', 'dog', 'elephant', 'giraffe', 'penguin', 'dolphin', 'monkey', 'tiger', 'lion', 'bear', 'rabbit', 'fox', 'owl', 'snake', 'frog', 'butterfly', 'bee', 'bird', 'fish', 'hamster'],
    number: ['two', 'three', 'four', 'five', 'ten', 'twenty', 'one hundred', 'a million'],
    container: ['box', 'bag', 'jar', 'bucket', 'basket', 'cup', 'glass', 'bowl'],
    collective_noun: ['herd', 'flock', 'pack', 'swarm', 'school', 'pride', 'colony', 'troop'],
    computer_response: ['Sorry, I need a break too.', 'But you just turned me on!', 'Error: Human needs coffee.', 'Processing... Please wait... forever.'],
    body_part: ['guts', 'heart', 'bones', 'muscles', 'brain'],
    tool: ['a wrench', 'a screwdriver', 'a hammer', 'a computer', 'their hands'],
    food1: ['chocolate', 'peanut butter', 'pizza', 'ice cream', 'hamburgers', 'french fries'],
    food2: ['pickles', 'bananas', 'cheese', 'ketchup', 'mustard', 'mayo'],
    funny_result: ['a chocolate-covered pickle', 'a peanut butter pizza', 'ice cream soup', 'a very confused chef'],
    problem_type: ['problems', 'equations', 'homework assignments', 'answers', 'questions'],
    bartender_line: ['We don\'t serve {animal}s here!', 'Nice {animal}!', 'You look like you need a drink.', 'Is that your {animal}?']
  },
  ja: {
    動物: ['猫', '犬', '象', 'キリン', 'ペンギン', 'イルカ', 'サル', '虎', 'ライオン', '熊', 'ウサギ', 'キツネ', 'フクロウ', 'ヘビ', 'カエル', '蝶', '蜂', '鳥', '魚', 'ハムスター'],
    理由: ['向こうに{動物}がいたから', '{理由}が見たかったから', 'お腹が空いたから', '遊びたかったから'],
    セリフ: ['これは{食べ物}です', '{職業}です', '何かお困りですか', 'ようこそ'],
    反応: ['笑った', '驚いた', '困惑した', '喜んだ'],
    食べ物: ['チョコレート', 'ピーナッツバター', 'ピザ', 'アイスクリーム', 'ハンバーガー', 'フライドポテト'],
    面白い結果: ['チョコレート漬けキュウリ', 'ピーナッツバターピザ', 'アイスクリームスープ', 'とても困惑したシェフ']
  },
  ko: {
    동물: ['고양이', '개', '코끼리', '기린', '펭귄', '돌고래', '원숭이', '호랑이', '사자', '곰', '토끼', '여우', '올빼미', '뱀', '개구리', '나비', '벌', '새', '물고기', '햄스터'],
    이유: ['저쪽에 {동물}이 있어서', '{이유}를 보고 싶어서', '배가 고파서', '놀고 싶어서'],
    대사: ['이것은 {음식}입니다', '{직업}입니다', '무엇인가 궁금하신가요', '환영합니다'],
    반응: ['웃었다', '놀랐다', '혼란스러워했다', '기뻐했다'],
    음식: ['초콜릿', '땅콩버터', '피자', '아이스크림', '햄버거', '후라이드감자'],
    재미있는_결과: ['초콜릿에 절인 오이', '땅콩버터 피자', '아이스크림 수프', '매우 혼란스러운 셰프']
  },
  fr: {
    animal: ['chat', 'chien', 'éléphant', 'girafe', 'pingouin', 'dauphin', 'singe', 'tigre', 'lion', 'ours', 'lapin', 'renard', 'hibou', 'serpent', 'grenouille', 'papillon', 'abeille', 'oiseau', 'poisson', 'hamster'],
    nombre: ['deux', 'trois', 'quatre', 'cinq', 'dix', 'vingt', 'cent', 'un million'],
    conteneur: ['boîte', 'sac', 'pot', 'seau', 'panier', 'tasse', 'verre', 'bol'],
    nom_collectif: ['troupeau', 'volée', 'meute', 'essaim', 'école', 'fierté', 'colonie', 'troupe'],
    reponse_ordinateur: ['Désolé, j\'ai aussi besoin de repos.', 'Mais vous venez de me rallumer !', 'Erreur : Humain a besoin de café.', 'Traitement... Veuillez patienter... éternellement.'],
    partie_corps: ['cœur', 'os', 'muscles', 'cerveau', 'estomac'],
    outil: ['une clé à molette', 'un tournevis', 'un marteau', 'un ordinateur', 'leurs mains'],
    resultat: ['un cornichon enrobé de chocolat', 'une pizza au beurre de cacahuète', 'une soupe à la glace', 'un chef très confus']
  },
  es: {
    animal: ['gato', 'perro', 'elefante', 'jirafa', 'pingüino', 'delfín', 'mono', 'tigre', 'león', 'oso', 'conejo', 'zorro', 'búho', 'serpiente', 'rana', 'mariposa', 'abeja', 'pájaro', 'pez', 'hámster'],
    numero: ['dos', 'tres', 'cuatro', 'cinco', 'diez', 'veinte', 'cien', 'un millón'],
    contenedor: ['caja', 'bolsa', 'tarro', 'cubo', 'cesta', 'taza', 'vaso', 'bowl'],
    sustantivo_colectivo: ['rebaño', 'bandada', 'manada', 'enjambre', 'escuela', 'orgullo', 'colonia', 'tropa'],
    respuesta_ordenador: ['Lo siento, también necesito un descanso.', '¡Pero acabas de encenderme!', 'Error: Humano necesita café.', 'Procesando... Espere por favor... para siempre.'],
    parte_cuerpo: ['corazón', 'huesos', 'músculos', 'cerebro', 'estómago'],
    herramienta: ['una llave inglesa', 'un destornillador', 'un martillo', 'un ordenador', 'sus manos'],
    resultado: ['un pepinillo cubierto de chocolate', 'una pizza con mantequilla de maní', 'una sopa de helado', 'un chef muy confundido']
  },
  de: {
    tier: ['Katze', 'Hund', 'Elefant', 'Giraffe', 'Pinguin', 'Delfin', 'Affe', 'Tiger', 'Lowe', 'Bar', 'Kaninchen', 'Fuchs', 'Eule', 'Schlange', 'Frosch', 'Schmetterling', 'Biene', 'Vogel', 'Fisch', 'Hamster'],
    zahl: ['zwei', 'drei', 'vier', 'funf', 'zehn', 'zwanzig', 'hundert', 'eine Million'],
    behalter: ['Box', 'Tasche', 'Jar', 'Eimer', 'Korb', 'Tasse', 'Glas', 'Schale'],
    gesamtname: ['Herde', 'Schwarm', 'Pack', 'Schwarm', 'Schule', 'Stolz', 'Kolonie', 'Truppe'],
    computerantwort: ['Entschuldigung, ich brauche auch eine Pause.', 'Aber Sie haben mich gerade eingeschaltet!', 'Fehler: Mensch braucht Kaffee.', 'Verarbeitung... Bitte warten... für immer.'],
    korperteil: ['Herz', 'Knochen', 'Musklen', 'Gehirn', 'Magen'],
    werkzeug: ['ein Schraubenschlüssel', 'ein Schraubenzieher', 'ein Hammer', 'ein Computer', 'ihre Hände'],
    ergebnis: ['ein schokoladenbedeckter Gurke', 'eine Erdnussbutterpizza', 'ein Eiscremesuppe', 'ein sehr verwirrter Koch']
  }
};
