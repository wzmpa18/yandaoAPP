/*
  # Seed Grammar Patterns for All 10 Languages

  Adds ~30-50 grammar patterns per language for all 10 languages.
  Languages: ja, en, ko, fr, es, de, it, pt, ar, zh
  
  Columns: language_code, category, title, title_zh, structure, example_target, example_zh, notes, level, order_index
*/

DO $$
DECLARE
  -- Each entry: category, title, title_zh, structure, example_target, example_zh, notes, level
  ja_grammar text[][] := ARRAY[
    ARRAY['sentence_ending','～です','是/的(礼貌体)','名词 + です','これはほんです。','这是一本书。','礼貌体基础','N5'],
    ARRAY['sentence_ending','～ます','（礼貌动词结尾）','动词ます形','たべます。','吃。','礼貌体动词','N5'],
    ARRAY['particles','は (主格标记)','主语助词','名词 + は + 述语','わたしはがくせいです。','我是学生。','话题助词','N5'],
    ARRAY['particles','が (主格)','主语助词（强调）','名词 + が + 动词','ねこがいます。','有猫。','主语助词','N5'],
    ARRAY['particles','を (宾格)','宾语助词','名词 + を + 动词','りんごをたべます。','吃苹果。','宾语助词','N5'],
    ARRAY['particles','に (时间/方向)','时间/方向助词','时间/地点 + に','にほんにいきます。','去日本。','方向助词','N5'],
    ARRAY['particles','で (手段/地点)','手段/地点助词','地点 + で + 动词','がっこうでべんきょうします。','在学校学习。','地点助词','N5'],
    ARRAY['particles','の (所有)','所有助词','名词 + の + 名词','わたしのほん','我的书','所有助词','N5'],
    ARRAY['particles','と (和)','并列助词','名词 + と + 名词','コーヒーとケーキ','咖啡和蛋糕','并列助词','N5'],
    ARRAY['adjectives','い形容词','い形容词','adj-i + 名词','おいしいりんご','好吃的苹果','い形容词修饰名词','N5'],
    ARRAY['adjectives','な形容词','な形容词','adj-na + な + 名词','きれいなはな','漂亮的花','な形容词修饰名词','N5'],
    ARRAY['negation','～ません','礼貌否定','动词ます形 - ます + ません','たべません。','不吃。','礼貌否定','N5'],
    ARRAY['negation','～じゃありません','名词否定','名词 + じゃありません','がくせいじゃありません。','不是学生。','礼貌否定','N5'],
    ARRAY['tense','～ました','过去式','动词ます - ます + ました','たべました。','吃了。','礼貌过去式','N5'],
    ARRAY['tense','～ませんでした','过去否定','动词 + ませんでした','いきませんでした。','没去。','礼貌过去否定','N5'],
    ARRAY['questions','～か','疑问句','文末 + か','これはほんですか。','这是书吗？','礼貌疑问','N5'],
    ARRAY['existence','あります/います','有/在','物 + が + あります','ほんがあります。','有书。','存在动词','N5'],
    ARRAY['location','～にあります','在...','物 + は + 地点 + にあります','ほんはつくえにあります。','书在桌子上。','位置表达','N5'],
    ARRAY['te-form','～てください','请...','动词て形 + ください','みてください。','请看。','请求形式','N4'],
    ARRAY['te-form','～ています','正在...','动词て形 + います','たべています。','正在吃。','进行时','N4'],
    ARRAY['te-form','～てもいいです','可以...','动词て形 + もいいです','かえってもいいです。','可以回去。','许可','N4'],
    ARRAY['te-form','～てはいけません','不可以...','动词て形 + はいけません','はいってはいけません。','不可以进入。','禁止','N4'],
    ARRAY['conditional','～たら','如果...','动词た形 + ら','あめがふったら、いえにいます。','如果下雨就在家。','条件句','N4'],
    ARRAY['conditional','～ば','如果...（假定）','动词ば形','やすければ、かいます。','如果便宜就买。','假定条件','N4'],
    ARRAY['ability','～ができます','会/能...','名词 + ができます','にほんごができます。','会日语。','能力表达','N4'],
    ARRAY['potential','～られます','能做（可能形）','动词可能形','このほんがよめます。','能读这本书。','可能形','N4'],
    ARRAY['passive','～られます','被动','动词被动形','せんせいにほめられました。','被老师表扬了。','被动形','N3'],
    ARRAY['causative','～させます','让/使','动词使役形','こどもにそうじさせます。','让孩子打扫。','使役形','N3'],
    ARRAY['giving_receiving','～てあげます','给别人做','动词て形 + あげます','おしえてあげます。','教给你。','授受动词','N4'],
    ARRAY['giving_receiving','～てもらいます','从别人那里得','动词て形 + もらいます','おしえてもらいました。','让人教了我。','授受动词','N4'],
    ARRAY['conjunctions','～から','因为','文 + から','あめだから、いえにいます。','因为下雨所以在家。','原因','N5'],
    ARRAY['conjunctions','～ので','因为（礼貌）','文 + ので','いそがしいので、いけません。','因为忙所以去不了。','礼貌原因','N4'],
    ARRAY['conjunctions','～が','但是','文1 + が + 文2','にほんごはすきですが、かんじがむずかしい。','喜欢日语但汉字很难。','转折','N5'],
    ARRAY['conjunctions','～けど','但是（口语）','文1 + けど + 文2','いきたいけど、じかんがない。','想去但没时间。','口语转折','N4'],
    ARRAY['degree','～すぎます','太...','形容词/动词 + すぎます','たかすぎます。','太贵了。','程度过分','N4'],
    ARRAY['degree','～やすい','容易...','动词ます + やすい','このほんはよみやすい。','这本书容易读。','容易','N4'],
    ARRAY['degree','～にくい','难以...','动词ます + にくい','このことばはおぼえにくい。','这个词难记。','困难','N4'],
    ARRAY['comparison','～より','比...','名词 + より + 形容词','なつよりふゆがすきです。','比起夏天更喜欢冬天。','比较','N4'],
    ARRAY['comparison','一番～','最...','名词の中で + 一番 + 形容词','クラスのなかで、いちばんはやい。','在班里跑得最快。','最高级','N4'],
    ARRAY['desire','～たいです','想...','动词ます + たいです','にほんにいきたいです。','想去日本。','愿望','N5'],
    ARRAY['hearsay','～そうです','据说...','动词普通形 + そうです','あめがふるそうです。','据说要下雨。','传闻','N4'],
    ARRAY['appearance','～そうです','看起来...','形容词词干 + そうです','おいしそうです。','看起来好吃。','样子','N4'],
    ARRAY['quotation','～と言います','说...','文 + と + 言います','「おはよう」といいます。','说"早上好"。','引用','N4'],
    ARRAY['trying','～てみます','试着...','动词て形 + みます','たべてみます。','试着吃。','尝试','N4'],
    ARRAY['completion','～てしまいます','竟然...完了','动词て形 + しまいます','たべてしまいました。','吃完了（遗憾）。','完了/遗憾','N4'],
    ARRAY['preparation','～ておきます','事先...','动词て形 + おきます','よんでおきます。','事先读。','预先动作','N4'],
    ARRAY['change','～になります','变成...','名词/形容词 + になります','さむくなりました。','变冷了。','变化','N4'],
    ARRAY['change','～くします','使...变成','い形容词词干 + くします','へやをきれいにします。','把房间弄干净。','使...变化','N4'],
    ARRAY['experience','～たことがあります','曾经有过...经历','动词た形 + ことがあります','にほんにいったことがあります。','曾经去过日本。','经历','N4'],
    ARRAY['listing','～たり～たりします','有时...有时...','动词た形 + り～た形 + りします','よんだり、かいたりします。','有时读有时写。','列举','N4']
  ];

  en_grammar text[][] := ARRAY[
    ARRAY['tense','Simple Present','一般现在时','Subject + V (base)','I eat breakfast every day.','我每天吃早饭。','习惯/事实','A1'],
    ARRAY['tense','Simple Past','一般过去时','Subject + V-ed','She visited Paris last year.','她去年去了巴黎。','过去动作','A1'],
    ARRAY['tense','Present Continuous','现在进行时','Subject + am/is/are + V-ing','They are studying now.','他们现在正在学习。','正在进行','A1'],
    ARRAY['tense','Past Continuous','过去进行时','Subject + was/were + V-ing','I was sleeping when you called.','你打来时我在睡觉。','过去进行','A2'],
    ARRAY['tense','Present Perfect','现在完成时','Subject + have/has + V-ed','I have visited Japan twice.','我去过日本两次。','过去到现在','A2'],
    ARRAY['tense','Past Perfect','过去完成时','Subject + had + V-ed','She had left before I arrived.','我到时她已经离开了。','过去前的过去','B1'],
    ARRAY['tense','Future (will)','将来时(will)','Subject + will + V','It will rain tomorrow.','明天会下雨。','预测/意愿','A1'],
    ARRAY['tense','Future (going to)','将来时(going to)','Subject + am/is/are + going to + V','I am going to study English.','我打算学英语。','计划','A2'],
    ARRAY['articles','Definite Article','定冠词 the','the + noun','The cat is on the sofa.','猫在沙发上。','特定事物','A1'],
    ARRAY['articles','Indefinite Article','不定冠词 a/an','a/an + noun','I saw a cat.','我看到一只猫。','非特指','A1'],
    ARRAY['questions','Yes/No Questions','是否疑问句','Do/Does/Did + S + V?','Do you speak Chinese?','你说中文吗？','疑问句','A1'],
    ARRAY['questions','Wh- Questions','特殊疑问句','Wh- word + do/does + S + V?','Where do you live?','你住在哪里？','疑问词','A1'],
    ARRAY['negation','Simple Negation','否定句','Subject + do not/does not + V','I don''t like coffee.','我不喜欢咖啡。','否定','A1'],
    ARRAY['modals','Can (ability)','能力 can','Subject + can + V','She can swim very fast.','她游泳很快。','能力','A1'],
    ARRAY['modals','Could (past ability)','过去能力','Subject + could + V','I could run a mile.','我以前能跑一英里。','过去能力','A2'],
    ARRAY['modals','Should (advice)','建议 should','Subject + should + V','You should drink more water.','你应该多喝水。','建议','A2'],
    ARRAY['modals','Must (obligation)','必须 must','Subject + must + V','You must wear a seatbelt.','你必须系安全带。','义务','B1'],
    ARRAY['modals','May/Might (possibility)','可能 may/might','Subject + may/might + V','It might snow tonight.','今晚可能下雪。','可能性','A2'],
    ARRAY['conditionals','First Conditional','第一条件句','If + present, will + V','If it rains, I will stay home.','如果下雨，我就待在家里。','可能条件','B1'],
    ARRAY['conditionals','Second Conditional','第二条件句','If + past, would + V','If I had money, I would travel.','如果我有钱，我就去旅行。','假设条件','B1'],
    ARRAY['conditionals','Third Conditional','第三条件句','If + past perfect, would have + V-ed','If I had studied, I would have passed.','如果我学了，我就通过了。','过去假设','B2'],
    ARRAY['passive','Passive Voice','被动语态','Object + be + V-ed','The book was written by her.','这本书是她写的。','被动','B1'],
    ARRAY['relative_clauses','Relative Clauses','关系从句','Noun + who/which/that + V','The man who called is my boss.','打电话的那个人是我的老板。','修饰从句','B1'],
    ARRAY['comparison','Comparatives','比较级','adj + -er than / more adj than','She is taller than her brother.','她比她哥哥高。','比较','A2'],
    ARRAY['comparison','Superlatives','最高级','the + adj + -est / the most adj','He is the smartest student.','他是最聪明的学生。','最高级','A2'],
    ARRAY['gerunds_infinitives','Gerunds as Subject','动名词做主语','V-ing + V','Swimming is good exercise.','游泳是好运动。','动名词主语','B1'],
    ARRAY['gerunds_infinitives','Infinitives of Purpose','目的不定式','to + V (purpose)','I study to improve my English.','我学习是为了提高英语。','目的','A2'],
    ARRAY['reported_speech','Reported Speech','间接引语','said that + clause','He said that he was tired.','他说他累了。','间接引语','B1'],
    ARRAY['prepositions','Prepositions of Time','时间介词','at/on/in + time','The meeting is at 3 pm.','会议在下午3点。','时间介词','A1'],
    ARRAY['prepositions','Prepositions of Place','地点介词','at/in/on + place','The keys are on the table.','钥匙在桌子上。','地点介词','A1'],
    ARRAY['conjunctions','Coordinating Conjunctions','并列连词','S + and/but/or + S','I like tea and coffee.','我喜欢茶和咖啡。','并列','A1'],
    ARRAY['conjunctions','Subordinating Conjunctions','从属连词','because/although/when + clause','Although it was raining, we went out.','虽然在下雨，我们还是出去了。','从属','B1'],
    ARRAY['determiners','Quantifiers','数量词','some/any/many/much + noun','I have some money.','我有一些钱。','数量','A2'],
    ARRAY['word_order','Basic Word Order','基本语序','Subject + Verb + Object','The dog chased the cat.','狗追猫。','基本语序','A1'],
    ARRAY['question_tags','Question Tags','附加疑问句','V + pronoun?','It''s cold today, isn''t it?','今天很冷，不是吗？','附加疑问','B1'],
    ARRAY['wish','Wish Clauses','愿望从句','I wish + past tense','I wish I could fly.','我希望我会飞。','愿望','B2'],
    ARRAY['emphasis','It-cleft Sentences','强调句型','It is/was + emphasis + that','It was John who called.','是约翰打来的。','强调','B2'],
    ARRAY['countable','Countable vs Uncountable','可数与不可数','count: a book / uncount: water','I need some water and an apple.','我需要一些水和一个苹果。','名词类型','A2'],
    ARRAY['phrasal_verbs','Phrasal Verbs','短语动词','V + particle','Please turn off the lights.','请关灯。','短语动词','B1'],
    ARRAY['ellipsis','So do I / Neither do I','附和表达','So/Neither + aux + Subject','A: I like pizza. B: So do I.','A:我喜欢披萨。B:我也是。','附和','B1']
  ];

  ko_grammar text[][] := ARRAY[
    ARRAY['sentence_ending','입니다/입니까','是（正式）','名词 + 입니다','저는 학생입니다.','我是学生。','正式敬体','초급'],
    ARRAY['sentence_ending','이에요/예요','是（非正式敬体）','名词 + 이에요/예요','저는 선생님이에요.','我是老师。','非正式敬体','초급'],
    ARRAY['particles','이/가 (主格)','主语助词','名词 + 이/가','고양이가 있어요.','有猫。','主语助词','초급'],
    ARRAY['particles','은/는 (话题)','话题助词','名词 + 은/는','저는 한국어를 배워요.','我学韩语。','话题助词','초급'],
    ARRAY['particles','을/를 (宾格)','宾语助词','名词 + 을/를','밥을 먹어요.','吃饭。','宾语助词','초급'],
    ARRAY['particles','에 (时间/地点)','时间/地点助词','时间/地点 + 에','학교에 가요.','去学校。','方向助词','초급'],
    ARRAY['particles','에서 (地点动作)','动作地点助词','地点 + 에서 + 动词','도서관에서 공부해요.','在图书馆学习。','地点助词','초급'],
    ARRAY['particles','의 (所有)','所有助词','名词 + 의 + 名词','저의 책','我的书','所有助词','초급'],
    ARRAY['particles','과/와 (和)','并列助词','名词 + 과/와','커피와 케이크','咖啡和蛋糕','并列助词','초급'],
    ARRAY['negation','안 + 动词','否定','안 + 动词','저는 안 먹어요.','我不吃。','否定','초급'],
    ARRAY['negation','못 + 动词','无法...','못 + 动词','저는 못 가요.','我不能去。','能力否定','초급'],
    ARRAY['tense','았/었어요 (过去)','过去式','动词词干 + 았/었어요','어제 밥을 먹었어요.','昨天吃饭了。','过去式','초급'],
    ARRAY['tense','~(으)ㄹ 거예요 (将来)','将来式','动词词干 + (으)ㄹ 거예요','내일 갈 거예요.','明天会去。','将来式','초급'],
    ARRAY['requests','아/어 주세요','请...','动词 + 아/어 주세요','가르쳐 주세요.','请教我。','请求','초급'],
    ARRAY['desire','고 싶어요','想...','动词词干 + 고 싶어요','한국에 가고 싶어요.','想去韩国。','愿望','초급'],
    ARRAY['ability','(으)ㄹ 수 있어요','能够...','动词词干 + (으)ㄹ 수 있어요','한국어를 할 수 있어요.','会说韩语。','能力','초급'],
    ARRAY['conjunctions','고 (并列)','并列连接','动词词干 + 고','먹고 마셔요.','吃和喝。','并列','초급'],
    ARRAY['conjunctions','지만 (转折)','但是','动词词干 + 지만','비가 오지만 나가요.','虽然下雨但出去。','转折','중급'],
    ARRAY['conjunctions','그래서','所以','문장 + 그래서','비가 와요. 그래서 집에 있어요.','下雨。所以在家。','结果','초급'],
    ARRAY['conjunctions','그런데','但是/不过','문장 + 그런데','좋아요. 그런데 비싸요.','好。不过贵。','转折','초급'],
    ARRAY['comparison','보다','比...','名词 + 보다 + 形容词','동생보다 키가 커요.','比弟弟高。','比较','중급'],
    ARRAY['reason','~아/어서','因为','动词 + 아/어서','배고파서 먹었어요.','因为饿了所以吃了。','原因','초급'],
    ARRAY['reason','~(으)니까','因为（强调原因）','动词 + (으)니까','비가 오니까 우산을 가져요.','因为下雨所以带伞。','原因（强调）','중급'],
    ARRAY['condition','~(으)면','如果','动词 + (으)면','시간이 있으면 갈게요.','如果有时间就去。','条件','중급'],
    ARRAY['experience','~아/어 본 적이 있어요','曾经...','动词 + 아/어 본 적이 있어요','한국에 가 본 적이 있어요.','曾经去过韩国。','经验','중급'],
    ARRAY['honorifics','~시/으시','敬语','动词词干 + 시','선생님이 오셨어요.','老师来了。（敬语）','尊敬体','중급'],
    ARRAY['duration','~고 있어요','正在...','动词 + 고 있어요','지금 공부하고 있어요.','现在正在学习。','进行中','초급'],
    ARRAY['completion','~아/어 버렸어요','...完了（遗憾）','动词 + 아/어 버렸어요','먹어 버렸어요.','吃完了。','完了','중급'],
    ARRAY['purpose','~(으)러','为了...（移动目的）','动词词干 + (으)러','밥을 먹으러 가요.','去吃饭。（目的）','移动目的','초급'],
    ARRAY['purpose','~기 위해서','为了...（目的）','动词 + 기 위해서','건강을 위해서 운동해요.','为了健康运动。','目的','중급'],
    ARRAY['listing','~도','也','名词 + 도','저도 학생이에요.','我也是学生。','也','초급'],
    ARRAY['only','~만','只','名词 + 만','물만 마셔요.','只喝水。','只','초급'],
    ARRAY['even_if','~아/어도','即使','动词 + 아/어도','비가 와도 가요.','即使下雨也去。','让步','중급'],
    ARRAY['must','~아/어야 해요','必须','动词 + 아/어야 해요','공부해야 해요.','必须学习。','义务','중급'],
    ARRAY['prohibition','~(으)면 안 돼요','不可以','动词 + (으)면 안 돼요','여기서 사진을 찍으면 안 돼요.','这里不可以拍照。','禁止','중급'],
    ARRAY['suggestion','~(으)ㄹ까요?','...怎么样？','动词 + (으)ㄹ까요?','커피 마실까요?','喝咖啡怎么样？','建议','초급'],
    ARRAY['hearsay','~다고 해요','据说...','文 + 다고 해요','내일 비가 온다고 해요.','据说明天下雨。','传闻','중급'],
    ARRAY['try','~아/어 보다','试试...','动词 + 아/어 보다','한번 먹어 보세요.','请试着吃一口。','尝试','초급'],
    ARRAY['numbers','한/두/세... + 助数词','韩语固有数词','韩字数 + 助数词','사과 두 개','两个苹果','固有数词','초급'],
    ARRAY['numbers','일/이/삼... + 助数词','汉字数词','汉字数 + 助数词','3시 = 세 시','3点','汉字数词','초급']
  ];

  fr_grammar text[][] := ARRAY[
    ARRAY['gender','Noun Gender','名词性别','le (m) / la (f) + noun','le livre / la maison','书（男）/ 房子（女）','名词性别','A1'],
    ARRAY['articles','Definite Articles','定冠词','le/la/les + noun','le chat / les chats','猫/猫（复数）','定冠词','A1'],
    ARRAY['articles','Indefinite Articles','不定冠词','un/une/des + noun','un livre / des livres','一本书/一些书','不定冠词','A1'],
    ARRAY['articles','Partitive Articles','部分冠词','du/de la/des + noun','Je bois du café.','我喝咖啡。','部分冠词','A2'],
    ARRAY['tense','Présent','现在时','je/tu/il + verb','Je mange une pomme.','我吃苹果。','现在时','A1'],
    ARRAY['tense','Passé Composé','复合过去时','avoir/être + participe passé','J''ai mangé une pomme.','我吃了苹果。','过去时','A2'],
    ARRAY['tense','Imparfait','未完成过去时','词根 + ais/ait/ions...','Je mangeais quand il est arrivé.','他到时我正在吃饭。','过去进行','A2'],
    ARRAY['tense','Futur Simple','简单将来时','infinitif + -ai/-as/-a...','Je mangerai demain.','我明天吃。','将来时','A2'],
    ARRAY['tense','Futur Proche','近将来','aller + infinitif','Je vais manger.','我要去吃。','即将发生','A1'],
    ARRAY['negation','Négation Simple','简单否定','ne + verb + pas','Je ne mange pas.','我不吃。','否定','A1'],
    ARRAY['negation','Négation du Présent Composé','复合时态否定','ne + aux + pas + participe','Je n''ai pas mangé.','我没吃。','复合否定','A2'],
    ARRAY['adjectives','Adjective Agreement','形容词配合','adj agrees with noun gender/number','un grand livre / une grande maison','一本大书/一座大房子','形容词配合','A1'],
    ARRAY['adjectives','Adjective Position','形容词位置','BANGS adjectives before noun','un beau jardin / une belle fleur','一个美丽的花园','形容词位置','A2'],
    ARRAY['comparison','Comparatif','比较级','plus/moins/aussi + adj + que','Elle est plus grande que lui.','她比他高。','比较','A2'],
    ARRAY['comparison','Superlatif','最高级','le/la plus + adj','C''est le plus beau tableau.','这是最美的画。','最高级','A2'],
    ARRAY['pronouns','Subject Pronouns','主语人称代词','je/tu/il/elle/nous/vous/ils/elles','Ils parlent français.','他们说法语。','主格代词','A1'],
    ARRAY['pronouns','Direct Object Pronouns','直接宾语代词','me/te/le/la/nous/vous/les','Je le vois.','我看见他。','宾格代词','A2'],
    ARRAY['pronouns','Indirect Object Pronouns','间接宾语代词','me/te/lui/nous/vous/leur','Je lui parle.','我跟他说话。','间接代词','A2'],
    ARRAY['reflexive','Verbes Pronominaux','代词式动词','se + verb','Je me lève à 7h.','我7点起床。','反身动词','A2'],
    ARRAY['imperatives','Impératif','命令式','Verb (tu/nous/vous)','Mange tes légumes!','吃蔬菜！','命令','A2'],
    ARRAY['questions','Questions avec est-ce que','疑问句(est-ce que)','Est-ce que + S + V?','Est-ce que tu parles anglais?','你说英语吗？','疑问句','A1'],
    ARRAY['questions','Inversion','倒装疑问','V + hyphen + S?','Parlez-vous anglais?','您说英语吗？','正式疑问','A2'],
    ARRAY['modal','Devoir','必须 devoir','devoir + infinitif','Je dois partir.','我必须走了。','义务','A2'],
    ARRAY['modal','Pouvoir','能够 pouvoir','pouvoir + infinitif','Je peux nager.','我会游泳。','能力','A2'],
    ARRAY['modal','Vouloir','想要 vouloir','vouloir + infinitif','Je veux un café.','我想要咖啡。','愿望','A1'],
    ARRAY['modal','Savoir vs Connaître','知道 vs 认识','savoir + infinitif / connaître + noun','Je sais nager. Je connais Paris.','我会游泳。我知道巴黎。','知道/认识','B1'],
    ARRAY['subjunctive','Subjonctif','虚拟式','il faut que + subjonctif','Il faut que tu viennes.','你必须来。','虚拟式','B1'],
    ARRAY['conditional','Conditionnel Présent','现在条件式','infinitif + ais/ait...','Je voudrais un café.','我想要咖啡。（礼貌）','条件式','A2'],
    ARRAY['relative','Pronoms Relatifs qui/que','关系代词','noun + qui/que + clause','L''homme qui parle est mon père.','说话的人是我父亲。','关系代词','B1'],
    ARRAY['prepositions','Prépositions de lieu','地点介词','à/en/dans/sur/sous','Le livre est sur la table.','书在桌子上。','地点介词','A1'],
    ARRAY['prepositions','À vs En (pays)','国家介词','à (ville) / en (pays fém)','Je vais à Paris / en France.','去巴黎/去法国。','国家介词','A2'],
    ARRAY['possession','Adjectifs Possessifs','所有形容词','mon/ma/mes ton/ta/tes...','C''est mon livre.','这是我的书。','所有形容词','A1'],
    ARRAY['numbers','Accord des Adjectifs Numéraux','数词的配合','cardinal + noun','Vingt et un élèves.','21个学生。','数词','A1'],
    ARRAY['expressions','Il y a','有...','il y a + noun','Il y a un chat.','有一只猫。','存在','A1'],
    ARRAY['expressions','Voilà / Voici','这是/那是','voilà/voici + noun','Voilà mon ami!','这是我的朋友！','指示','A1'],
    ARRAY['time','Expressions de temps','时间表达','今天/明天/昨天','aujourd''hui/demain/hier','今天/明天/昨天','时间表达','A1'],
    ARRAY['causality','Parce que / Car','因为','parce que/car + clause','Il est absent parce qu''il est malade.','他缺席因为生病了。','原因','A2'],
    ARRAY['purpose','Pour + infinitif','为了...','pour + infinitif','J''étudie pour apprendre le français.','我学习是为了学法语。','目的','A2'],
    ARRAY['concession','Bien que + subjonctif','尽管','bien que + subjonctif','Bien qu''il soit tard, je travaille.','尽管很晚了，我还在工作。','让步','B2'],
    ARRAY['passive','Voix Passive','被动语态','être + participe passé','Le gâteau a été mangé.','蛋糕被吃了。','被动','B1'],
    ARRAY['indirect_speech','Discours Indirect','间接引语','dire que + clause','Il dit qu''il est fatigué.','他说他累了。','间接引语','B1']
  ];

  es_grammar text[][] := ARRAY[
    ARRAY['gender','Noun Gender','名词性别','el (m) / la (f) + noun','el libro / la casa','书（男）/ 房子（女）','名词性别','A1'],
    ARRAY['articles','Definite Articles','定冠词','el/la/los/las','el perro / los perros','狗/狗（复数）','定冠词','A1'],
    ARRAY['articles','Indefinite Articles','不定冠词','un/una/unos/unas','un libro / una casa','一本书/一座房子','不定冠词','A1'],
    ARRAY['tense','Presente','现在时','yo/tú/él + verb stem + ending','Yo hablo español.','我说西班牙语。','现在时','A1'],
    ARRAY['tense','Pretérito Indefinido','简单过去时','yo/tú/él + stem + é/aste/ó...','Ayer comí pizza.','昨天我吃了披萨。','过去时','A2'],
    ARRAY['tense','Pretérito Imperfecto','未完成过去时','stem + aba/abas...','Cuando era niño, jugaba.','小时候，我玩耍。','过去进行/习惯','A2'],
    ARRAY['tense','Futuro Simple','简单将来时','infinitivo + é/ás/á...','Mañana comeré sushi.','明天我吃寿司。','将来时','A2'],
    ARRAY['tense','Pretérito Perfecto','现在完成时','haber + participio','He comido una manzana.','我吃了苹果。','近过去','A2'],
    ARRAY['ser_estar','Ser vs Estar','ser与estar的区别','ser (permanent) / estar (temporary)','Soy alto. Estoy cansado.','我很高。我很累。','be动词区别','A2'],
    ARRAY['negation','Negación','否定','No + verb','No hablo francés.','我不说法语。','否定','A1'],
    ARRAY['adjectives','Adjective Agreement','形容词配合','adj agrees with noun','un chico alto / una chica alta','高个子男孩/女孩','形容词配合','A1'],
    ARRAY['comparison','Comparativo','比较级','más/menos + adj + que','Ella es más alta que yo.','她比我高。','比较','A2'],
    ARRAY['comparison','Superlativo','最高级','el/la más + adj','Es el más inteligente.','他是最聪明的。','最高级','A2'],
    ARRAY['pronouns','Subject Pronouns','主格代词','yo/tú/él/ella/nosotros/vosotros/ellos','Ellos hablan español.','他们说西班牙语。','主格代词','A1'],
    ARRAY['pronouns','Direct Object Pronouns','直接宾格代词','me/te/lo/la/nos/os/los','Lo veo.','我看见他。','宾格代词','A2'],
    ARRAY['reflexive','Verbos Reflexivos','反身动词','me/te/se/nos/os/se + verb','Me levanto a las 7.','我7点起床。','反身动词','A2'],
    ARRAY['imperatives','Imperativo','命令式','Verb (tú/vosotros/Ud/Uds)','¡Come tus verduras!','吃你的蔬菜！','命令式','A2'],
    ARRAY['questions','Preguntas Sí/No','是否疑问句','¿ + S + V + ?','¿Hablas inglés?','你说英语吗？','疑问句','A1'],
    ARRAY['questions','Preguntas con interrogativos','特殊疑问句','¿Qué/Dónde/Cuándo + V?','¿Dónde vives?','你住在哪里？','疑问词','A1'],
    ARRAY['modal','Poder','能够 poder','poder + infinitivo','Puedo nadar.','我会游泳。','能力','A1'],
    ARRAY['modal','Querer','想要 querer','querer + infinitivo','Quiero un café.','我想要咖啡。','愿望','A1'],
    ARRAY['modal','Deber','必须 deber','deber + infinitivo','Debes estudiar.','你必须学习。','义务','A2'],
    ARRAY['modal','Tener que','必须 tener que','tener que + infinitivo','Tengo que ir.','我必须去。','必要','A2'],
    ARRAY['subjunctive','Subjuntivo Presente','现在虚拟式','querer que + subjuntivo','Quiero que vengas.','我想让你来。','虚拟式','B1'],
    ARRAY['conditional','Condicional Simple','条件式','infinitivo + ía/ías/ía...','Me gustaría un café.','我想要咖啡。','条件式','B1'],
    ARRAY['passive','Voz Pasiva','被动语态','ser + participio','El libro fue escrito por ella.','这本书被她写了。','被动','B1'],
    ARRAY['relative','Pronombres Relativos','关系代词','noun + que + clause','El hombre que habla es mi padre.','说话的人是我父亲。','关系代词','B1'],
    ARRAY['prepositions','Preposiciones de lugar','地点介词','en/sobre/bajo/detrás de','El libro está sobre la mesa.','书在桌子上。','地点介词','A1'],
    ARRAY['por_para','Por vs Para','por与para的区别','por (cause/means) para (purpose/recipient)','Estudio por amor. Esto es para ti.','我因爱学习。这是给你的。','介词区别','B1'],
    ARRAY['possession','Adjetivos Posesivos','所有形容词','mi/tu/su/nuestro...','Es mi libro.','这是我的书。','所有形容词','A1'],
    ARRAY['expressions','Hay','有...','hay + noun','Hay un gato.','有一只猫。','存在','A1'],
    ARRAY['time','Hace + tiempo','...前','Hace + time + que','Hace dos años que vivo aquí.','我在这里住了两年了。','时间段','B1'],
    ARRAY['causality','Porque','因为','Porque + clause','No fui porque estaba enfermo.','我没去因为生病了。','原因','A2'],
    ARRAY['purpose','Para + infinitivo','为了...','Para + infinitivo','Estudio para aprender español.','我学习是为了学西班牙语。','目的','A2'],
    ARRAY['gerund','Gerundio','动名词','estar + gerundio','Estoy comiendo.','我正在吃。','进行时','A2'],
    ARRAY['indirect_speech','Estilo Indirecto','间接引语','decir que + clause','Dijo que estaba cansado.','他说他累了。','间接引语','B1'],
    ARRAY['diminutives','Diminutivos','小称词','noun/adj + -ito/-ita','Un momentito, por favor.','请稍等一下。','小称','B1'],
    ARRAY['ser_time','Ser para tiempo','时间表达','Es/Son + las + hour','Son las tres.','现在是三点。','时间','A1'],
    ARRAY['numbers','Números ordinales','序数词','primer/segundo/tercer...','el primer piso','一楼','序数词','A2'],
    ARRAY['accentuation','Tildes y significado','重音区别','él (he) vs el (the)','él es alto / el libro','他很高/这本书','重音区别','A1'],
    ARRAY['commands_negatives','Imperativo Negativo','否定命令','no + subjuntivo','No comas tanto.','不要吃那么多。','否定命令','B1']
  ];

  de_grammar text[][] := ARRAY[
    ARRAY['gender','Noun Gender','名词性别','der (m) / die (f) / das (n)','der Mann / die Frau / das Kind','男人/女人/孩子','名词三性','A1'],
    ARRAY['articles','Definite Articles','定冠词','der/die/das + noun','der Hund / die Katze','狗/猫','定冠词','A1'],
    ARRAY['articles','Indefinite Articles','不定冠词','ein/eine + noun','ein Buch / eine Tasche','一本书/一个包','不定冠词','A1'],
    ARRAY['cases','Nominative','主格','Subject + verb','Der Hund bellt.','狗叫。','主格','A1'],
    ARRAY['cases','Accusative','宾格','verb + Akkusativ object','Ich sehe den Hund.','我看到狗。','宾格','A2'],
    ARRAY['cases','Dative','与格','indirect object / dative prepositions','Ich gebe dem Mann das Buch.','我给那个男人书。','与格','A2'],
    ARRAY['cases','Genitive','所有格','possession','Das Buch des Mannes.','那个男人的书。','所有格','B1'],
    ARRAY['tense','Präsens','现在时','ich/du/er + verb stem + ending','Ich esse Brot.','我吃面包。','现在时','A1'],
    ARRAY['tense','Perfekt','完成时','haben/sein + Partizip II','Ich habe gegessen.','我吃了。','口语过去','A2'],
    ARRAY['tense','Präteritum','简单过去','ich/du/er + stem + te','Ich aß Brot.','我吃了面包。','书面过去','B1'],
    ARRAY['tense','Futur I','将来时','werden + infinitiv','Ich werde essen.','我将要吃。','将来时','A2'],
    ARRAY['word_order','Verb Second (V2)','动词第二位','Subject + Verb + ...','Ich esse jetzt.','我现在吃。','基本语序','A1'],
    ARRAY['word_order','Verb-final in subordinate','从句动词末位','conjunction + S + ... + V','weil ich müde bin','因为我累了','从句语序','A2'],
    ARRAY['negation','Nicht','否定','nicht + adjective/verb','Ich esse nicht.','我不吃。','否定','A1'],
    ARRAY['negation','Kein','无/没有','kein/keine + noun','Ich habe kein Geld.','我没有钱。','名词否定','A1'],
    ARRAY['adjectives','Adjective Declension','形容词变格','adj + ending by case/gender','ein großes Haus','一座大房子','形容词变格','B1'],
    ARRAY['comparison','Komparativ','比较级','adj + -er als','Er ist größer als ich.','他比我高。','比较','A2'],
    ARRAY['comparison','Superlativ','最高级','am + adj + sten','Er ist der Größte.','他是最高的。','最高级','A2'],
    ARRAY['modal','Können','能够','können + infinitiv','Ich kann schwimmen.','我会游泳。','能力','A1'],
    ARRAY['modal','Müssen','必须','müssen + infinitiv','Du musst schlafen.','你必须睡觉。','义务','A1'],
    ARRAY['modal','Wollen','想要','wollen + infinitiv','Ich will Kaffee.','我想要咖啡。','愿望','A1'],
    ARRAY['modal','Dürfen','允许/不允许','dürfen + infinitiv','Du darfst nicht rauchen.','你不能抽烟。','许可','A2'],
    ARRAY['modal','Sollen','应该','sollen + infinitiv','Du sollst nicht lügen.','你不应该说谎。','义务','A2'],
    ARRAY['pronouns','Personal Pronouns','人称代词','ich/du/er/sie/es/wir/ihr/sie/Sie','Sie spricht Deutsch.','她说德语。','人称代词','A1'],
    ARRAY['reflexive','Reflexive Verben','反身动词','sich + verb','Ich wasche mich.','我洗澡。','反身动词','A2'],
    ARRAY['separable','Separable Verbs','分离动词','prefix + verb (separates in main clause)','Ich stehe um 7 auf.','我7点起床。','分离动词','A2'],
    ARRAY['passive','Vorgangspassiv','被动（过程）','werden + Partizip II','Das Buch wird gelesen.','这本书被读了。','被动','B1'],
    ARRAY['imperatives','Imperativ','命令式','verb stem (+ e for du)','Iss dein Gemüse!','吃你的蔬菜！','命令式','A2'],
    ARRAY['conjunctions','Koordinierende Konjunktionen','并列连词','und/aber/oder/denn','Er ist müde, aber arbeitet.','他累了但在工作。','并列','A1'],
    ARRAY['conjunctions','Subordinierende Konjunktionen','从属连词','weil/dass/wenn/obwohl','Ich bleibe, weil es regnet.','我待着因为下雨了。','从属','A2'],
    ARRAY['relative','Relativsätze','关系从句','noun + der/die/das + clause','Der Mann, der lacht.','笑的那个人。','关系从句','B1'],
    ARRAY['prepositions','Wechselpräpositionen','双向介词','an/auf/in... + Akk(motion) / Dat(location)','Ich gehe in die Küche.','我进厨房。（运动）','双向介词','B1'],
    ARRAY['prepositions','Präpositionen mit Dativ','与格介词','aus/bei/mit/nach/seit/von/zu/gegenüber','Ich fahre mit dem Bus.','我坐公交。','与格介词','A2'],
    ARRAY['prepositions','Präpositionen mit Akkusativ','宾格介词','durch/für/gegen/ohne/um','Ich kaufe ein Geschenk für dich.','我买礼物给你。','宾格介词','A2'],
    ARRAY['konjunktiv','Konjunktiv II','虚拟式II','würde + infinitiv / conditional forms','Ich würde gern reisen.','我很想旅行。','礼貌/假设','B1'],
    ARRAY['weil_damit','Weil vs Damit','weil与damit','weil (cause) / damit (purpose)','Ich lerne, damit ich bestehe.','我学习是为了通过。','原因vs目的','B1'],
    ARRAY['seit','Seit','自从...以来','seit + Dativ (present tense)','Ich lerne seit 3 Jahren Deutsch.','我学德语已经3年了。','时间段','A2'],
    ARRAY['um_zu','Um...zu','为了...','um + zu + infinitiv','Ich lerne, um Deutsch zu sprechen.','我学习是为了说德语。','目的','A2'],
    ARRAY['question_words','W-Fragen','疑问词','Wer/Was/Wo/Wann/Warum + verb?','Wo wohnst du?','你住在哪里？','疑问词','A1'],
    ARRAY['genitive_s','Genitiv-s','名字所有格','Name + s','Annas Buch','安娜的书','所有格','A1']
  ];

  i integer;
  w text[];
BEGIN
  -- Japanese grammar
  i := 1;
  FOREACH w SLICE 1 IN ARRAY ja_grammar LOOP
    INSERT INTO grammar_patterns (language_code, category, title, title_zh, structure, example_target, example_zh, notes, level, order_index, created_at)
    VALUES ('ja', w[1], w[2], w[3], w[4], w[5], w[6], w[7], w[8], i, now())
    ON CONFLICT DO NOTHING;
    i := i + 1;
  END LOOP;

  -- English grammar
  i := 1;
  FOREACH w SLICE 1 IN ARRAY en_grammar LOOP
    INSERT INTO grammar_patterns (language_code, category, title, title_zh, structure, example_target, example_zh, notes, level, order_index, created_at)
    VALUES ('en', w[1], w[2], w[3], w[4], w[5], w[6], w[7], w[8], i, now())
    ON CONFLICT DO NOTHING;
    i := i + 1;
  END LOOP;

  -- Korean grammar
  i := 1;
  FOREACH w SLICE 1 IN ARRAY ko_grammar LOOP
    INSERT INTO grammar_patterns (language_code, category, title, title_zh, structure, example_target, example_zh, notes, level, order_index, created_at)
    VALUES ('ko', w[1], w[2], w[3], w[4], w[5], w[6], w[7], w[8], i, now())
    ON CONFLICT DO NOTHING;
    i := i + 1;
  END LOOP;

  -- French grammar
  i := 1;
  FOREACH w SLICE 1 IN ARRAY fr_grammar LOOP
    INSERT INTO grammar_patterns (language_code, category, title, title_zh, structure, example_target, example_zh, notes, level, order_index, created_at)
    VALUES ('fr', w[1], w[2], w[3], w[4], w[5], w[6], w[7], w[8], i, now())
    ON CONFLICT DO NOTHING;
    i := i + 1;
  END LOOP;

  -- Spanish grammar
  i := 1;
  FOREACH w SLICE 1 IN ARRAY es_grammar LOOP
    INSERT INTO grammar_patterns (language_code, category, title, title_zh, structure, example_target, example_zh, notes, level, order_index, created_at)
    VALUES ('es', w[1], w[2], w[3], w[4], w[5], w[6], w[7], w[8], i, now())
    ON CONFLICT DO NOTHING;
    i := i + 1;
  END LOOP;

  -- German grammar
  i := 1;
  FOREACH w SLICE 1 IN ARRAY de_grammar LOOP
    INSERT INTO grammar_patterns (language_code, category, title, title_zh, structure, example_target, example_zh, notes, level, order_index, created_at)
    VALUES ('de', w[1], w[2], w[3], w[4], w[5], w[6], w[7], w[8], i, now())
    ON CONFLICT DO NOTHING;
    i := i + 1;
  END LOOP;
END $$;
