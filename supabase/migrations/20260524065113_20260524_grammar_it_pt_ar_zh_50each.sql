/*
  # Seed Grammar Patterns for Italian, Portuguese, Arabic, Chinese

  Adds ~40 grammar patterns per language for it, pt, ar, zh.
  Completes the full 10-language grammar dataset.
*/

DO $$
DECLARE
  it_grammar text[][] := ARRAY[
    ARRAY['gender','Genere dei Nomi','名词性别','il (m) / la (f) + noun','il libro / la casa','书（男）/ 房子（女）','名词性别','A1'],
    ARRAY['articles','Articoli Determinativi','定冠词','il/lo/la/i/gli/le + noun','il gatto / i gatti','猫/猫（复数）','定冠词','A1'],
    ARRAY['articles','Articoli Indeterminativi','不定冠词','un/uno/una + noun','un libro / una casa','一本书/一座房子','不定冠词','A1'],
    ARRAY['tense','Presente Indicativo','现在时','io/tu/lui + verb ending','Io mangio la pizza.','我吃披萨。','现在时','A1'],
    ARRAY['tense','Passato Prossimo','近过去时','avere/essere + participio passato','Ho mangiato la pizza.','我吃了披萨。','近过去','A2'],
    ARRAY['tense','Imperfetto','未完成过去时','stem + avo/avi/ava...','Quando ero bambino, giocavo.','小时候我玩耍。','过去进行/习惯','A2'],
    ARRAY['tense','Futuro Semplice','简单将来时','infinito + ò/ai/à...','Domani mangerò sushi.','明天我吃寿司。','将来时','A2'],
    ARRAY['tense','Condizionale Presente','条件式','infinito + ei/esti/ebbe...','Vorrei un caffè.','我想要咖啡。','条件式/礼貌','A2'],
    ARRAY['negation','Negazione','否定','non + verb','Non mangio la carne.','我不吃肉。','否定','A1'],
    ARRAY['adjectives','Accordo Aggettivi','形容词配合','adj agrees with noun','un libro bello / una casa bella','一本好书/一座美丽的房子','形容词配合','A1'],
    ARRAY['comparison','Comparativo','比较级','più/meno + adj + di','Lei è più alta di me.','她比我高。','比较','A2'],
    ARRAY['comparison','Superlativo Relativo','最高级','il/la più + adj','È il film più bello.','这是最好的电影。','最高级','A2'],
    ARRAY['pronouns','Pronomi Soggetto','主格代词','io/tu/lui/lei/noi/voi/loro','Loro parlano italiano.','他们说意大利语。','主格代词','A1'],
    ARRAY['pronouns','Pronomi Diretti','直接宾格代词','mi/ti/lo/la/ci/vi/li/le','Lo vedo.','我看见他。','宾格代词','A2'],
    ARRAY['pronouns','Pronomi Indiretti','间接宾格代词','mi/ti/gli/le/ci/vi/loro','Gli parlo.','我跟他说话。','间接代词','A2'],
    ARRAY['reflexive','Verbi Riflessivi','反身动词','mi/ti/si/ci/vi/si + verb','Mi alzo alle 7.','我7点起床。','反身动词','A2'],
    ARRAY['imperatives','Imperativo','命令式','tu/noi/voi forms','Mangia le verdure!','吃蔬菜！','命令式','A2'],
    ARRAY['questions','Domande Sì/No','是否疑问句','Verb + S? or rising intonation','Parli inglese?','你说英语吗？','疑问句','A1'],
    ARRAY['modal','Potere','能够','potere + infinito','Posso nuotare.','我会游泳。','能力','A1'],
    ARRAY['modal','Volere','想要','volere + infinito','Voglio un caffè.','我想要咖啡。','愿望','A1'],
    ARRAY['modal','Dovere','必须','dovere + infinito','Devo studiare.','我必须学习。','义务','A2'],
    ARRAY['modal','Sapere vs Conoscere','知道 vs 认识','sapere + inf / conoscere + noun','So nuotare. Conosco Roma.','我会游泳。我认识罗马。','知道/认识','B1'],
    ARRAY['subjunctive','Congiuntivo Presente','现在虚拟式','voglio che + congiuntivo','Voglio che tu venga.','我想让你来。','虚拟式','B1'],
    ARRAY['passive','Forma Passiva','被动语态','essere + participio passato','Il libro è stato scritto da lei.','这本书被她写了。','被动','B1'],
    ARRAY['relative','Pronomi Relativi','关系代词','noun + che + clause','L''uomo che parla è mio padre.','说话的人是我父亲。','关系代词','B1'],
    ARRAY['prepositions','Preposizioni di luogo','地点介词','in/su/sotto/dietro/davanti a','Il libro è sul tavolo.','书在桌子上。','地点介词','A1'],
    ARRAY['prepositions','Preposizioni articolate','冠词介词合并','di+il=del, a+il=al...','Vado al mercato.','我去市场。','介词合并','A2'],
    ARRAY['possession','Aggettivi Possessivi','所有形容词','mio/tuo/suo/nostro/vostro/loro','È il mio libro.','这是我的书。','所有形容词','A1'],
    ARRAY['expressions','C''è / Ci sono','有...','c''è + singular / ci sono + plural','C''è un gatto.','有一只猫。','存在','A1'],
    ARRAY['time','Fa (time ago)','...前','time + fa','Due anni fa','两年前','时间段','A2'],
    ARRAY['causality','Perché','因为','perché + clause','Non sono andato perché ero malato.','我没去因为我生病了。','原因','A2'],
    ARRAY['purpose','Per + infinito','为了...','per + infinito','Studio per imparare l''italiano.','我学习是为了学意大利语。','目的','A2'],
    ARRAY['gerund','Gerundio','进行时/动名词','stare + gerundio','Sto mangiando.','我正在吃。','进行时','A2'],
    ARRAY['indirect_speech','Discorso Indiretto','间接引语','dire che + clause','Ha detto che era stanco.','他说他累了。','间接引语','B1'],
    ARRAY['conjunctions','Congiunzioni coordinanti','并列连词','e/ma/o/però','Sono stanco, ma lavoro.','我累了但在工作。','并列','A1'],
    ARRAY['conjunctions','Congiunzioni subordinanti','从属连词','perché/sebbene/se','Rimango perché piove.','我待着因为下雨。','从属','A2'],
    ARRAY['si_impersonale','Si impersonale','非人称 si','Si + verb (3rd sing)','Si mangia bene qui.','这里吃得好。','非人称','B1'],
    ARRAY['double_negation','Doppia Negazione','双重否定','non + verb + mai/niente','Non mangio mai la carne.','我从不吃肉。','双重否定','A2'],
    ARRAY['ordinals','Numeri Ordinali','序数词','primo/secondo/terzo...','il primo piano','一楼','序数词','A2'],
    ARRAY['indirect_object','Ci e Ne','ci与ne','ci (place) / ne (partitive)','Ne voglio due.','我要两个。','代词ci/ne','B1']
  ];

  pt_grammar text[][] := ARRAY[
    ARRAY['gender','Gênero dos Substantivos','名词性别','o (m) / a (f) + noun','o livro / a casa','书（男）/ 房子（女）','名词性别','A1'],
    ARRAY['articles','Artigos Definidos','定冠词','o/a/os/as + noun','o cão / os cães','狗/狗（复数）','定冠词','A1'],
    ARRAY['articles','Artigos Indefinidos','不定冠词','um/uma + noun','um livro / uma casa','一本书/一座房子','不定冠词','A1'],
    ARRAY['tense','Presente do Indicativo','现在时','eu/tu/ele + verb ending','Eu falo português.','我说葡萄牙语。','现在时','A1'],
    ARRAY['tense','Pretérito Perfeito','简单过去时','eu/tu/ele + stem + ei/aste/ou...','Ontem eu comi pizza.','昨天我吃了披萨。','过去时','A2'],
    ARRAY['tense','Pretérito Imperfeito','未完成过去时','stem + ava/avas/ava...','Quando era criança, brincava.','小时候我玩耍。','过去进行/习惯','A2'],
    ARRAY['tense','Futuro do Presente','将来时','infinitivo + ei/ás/á...','Amanhã comerei sushi.','明天我吃寿司。','将来时','A2'],
    ARRAY['tense','Pretérito Perfeito Composto','现在完成时','ter + particípio','Tenho comido bem.','我一直吃得很好。','持续完成','B1'],
    ARRAY['ser_estar','Ser vs Estar','ser与estar的区别','ser (permanent) / estar (temporary)','Sou brasileiro. Estou cansado.','我是巴西人。我累了。','be动词区别','A2'],
    ARRAY['negation','Negação','否定','não + verb','Não falo inglês.','我不说英语。','否定','A1'],
    ARRAY['adjectives','Concordância dos Adjetivos','形容词配合','adj agrees with noun','um menino alto / uma menina alta','高个子男孩/女孩','形容词配合','A1'],
    ARRAY['comparison','Comparativo','比较级','mais/menos + adj + do que','Ela é mais alta do que eu.','她比我高。','比较','A2'],
    ARRAY['comparison','Superlativo','最高级','o/a mais + adj','Ele é o mais inteligente.','他是最聪明的。','最高级','A2'],
    ARRAY['pronouns','Pronomes Pessoais','主格代词','eu/tu/ele/ela/nós/vocês/eles','Eles falam português.','他们说葡萄牙语。','主格代词','A1'],
    ARRAY['pronouns','Pronomes de Objeto Direto','直接宾格代词','me/te/o/a/nos/vos/os/as','Eu o vejo.','我看见他。','宾格代词','A2'],
    ARRAY['reflexive','Verbos Reflexivos','反身动词','me/te/se/nos/vos + verb','Eu me levanto às 7.','我7点起床。','反身动词','A2'],
    ARRAY['imperatives','Imperativo','命令式','tu/você/nós forms','Come os legumes!','吃蔬菜！','命令式','A2'],
    ARRAY['questions','Perguntas Sim/Não','是否疑问句','V + S? or rising intonation','Você fala inglês?','你说英语吗？','疑问句','A1'],
    ARRAY['modal','Poder','能够','poder + infinitivo','Eu posso nadar.','我会游泳。','能力','A1'],
    ARRAY['modal','Querer','想要','querer + infinitivo','Eu quero um café.','我想要咖啡。','愿望','A1'],
    ARRAY['modal','Dever','必须','dever + infinitivo','Você deve estudar.','你必须学习。','义务','A2'],
    ARRAY['modal','Ter que','必须 (have to)','ter que + infinitivo','Tenho que ir.','我必须去。','必要','A2'],
    ARRAY['subjunctive','Subjuntivo Presente','现在虚拟式','querer que + subjuntivo','Quero que você venha.','我想让你来。','虚拟式','B1'],
    ARRAY['conditional','Condicional Simples','条件式','infinitivo + ia/ias/ia...','Eu gostaria de um café.','我想要咖啡。','条件式/礼貌','B1'],
    ARRAY['passive','Voz Passiva','被动语态','ser + particípio','O livro foi escrito por ela.','这本书被她写了。','被动','B1'],
    ARRAY['relative','Pronomes Relativos','关系代词','noun + que + clause','O homem que fala é meu pai.','说话的人是我父亲。','关系代词','B1'],
    ARRAY['prepositions','Preposições de lugar','地点介词','em/sobre/sob/atrás de','O livro está sobre a mesa.','书在桌子上。','地点介词','A1'],
    ARRAY['contractions','Contrações','介词+冠词合并','de+o=do, de+a=da, em+o=no','Vou ao mercado.','我去市场。','介词合并','A2'],
    ARRAY['possession','Adjetivos Possessivos','所有形容词','meu/minha/seu/sua/nosso...','É o meu livro.','这是我的书。','所有形容词','A1'],
    ARRAY['expressions','Há / Tem','有...','há/tem + noun','Há um gato.','有一只猫。','存在','A1'],
    ARRAY['time','Há (time ago)','...前','há + time','Há dois anos','两年前','时间段','A2'],
    ARRAY['causality','Porque','因为','porque + clause','Não fui porque estava doente.','我没去因为我生病了。','原因','A2'],
    ARRAY['purpose','Para + infinitivo','为了...','para + infinitivo','Estudo para aprender português.','我学习是为了学葡萄牙语。','目的','A2'],
    ARRAY['gerund','Gerúndio','进行时','estar + gerúndio','Estou comendo.','我正在吃。','进行时','A2'],
    ARRAY['indirect_speech','Discurso Indireto','间接引语','dizer que + clause','Ele disse que estava cansado.','他说他累了。','间接引语','B1'],
    ARRAY['conjunctions','Conjunções Coordenativas','并列连词','e/mas/ou/porém','Estou cansado, mas trabalho.','我累了但在工作。','并列','A1'],
    ARRAY['conjunctions','Conjunções Subordinativas','从属连词','porque/embora/se','Fico porque está chovendo.','我待着因为下雨。','从属','A2'],
    ARRAY['diminutives','Diminutivos','小称','noun/adj + -inho/-inha','Um momentinho, por favor.','请稍等一下。','小称','B1'],
    ARRAY['future_subjunctive','Futuro do Subjuntivo','将来虚拟式','se + futuro do subjuntivo','Se você vier, avise.','如果你来，请告诉我。','条件将来','B2'],
    ARRAY['ordinals','Numerais Ordinais','序数词','primeiro/segundo/terceiro...','o primeiro andar','一楼','序数词','A2']
  ];

  ar_grammar text[][] := ARRAY[
    ARRAY['definite_article','أداة التعريف ال','定冠词','ال + noun','الكتاب','这本书','定冠词','مبتدئ'],
    ARRAY['gender','الجنس (مذكر/مؤنث)','名词性别','m / f (often ة for f)','كتاب (m) / مدرسة (f)','书（男）/ 学校（女）','名词性别','مبتدئ'],
    ARRAY['number','المثنى','双数','noun + ان/ين','كتابان / كتابين','两本书','双数','مبتدئ'],
    ARRAY['number','الجمع','复数','broken plural / sound plural','كتب (pl of كتاب)','书（复数）','复数形式','مبتدئ'],
    ARRAY['sentence_types','الجملة الاسمية','名词句','Subject (nom) + Predicate','البيت كبير.','房子很大。','名词句','مبتدئ'],
    ARRAY['sentence_types','الجملة الفعلية','动词句','Verb + Subject + Object','ذهب الولد إلى المدرسة.','男孩去了学校。','动词句','مبتدئ'],
    ARRAY['tense','المضارع','现在/将来时','prefix + stem + suffix','يذهب / تذهب','他去/她去','现在时','مبتدئ'],
    ARRAY['tense','الماضي','过去时','stem + suffix','ذهب / ذهبت','他去了/她去了','过去时','مبتدئ'],
    ARRAY['tense','المستقبل','将来时','سـ / سوف + مضارع','سيذهب غداً.','明天他将去。','将来时','مبتدئ'],
    ARRAY['negation','نفي المضارع','现在时否定','لا + مضارع','لا أتكلم عربياً.','我不说阿拉伯语。','现在否定','مبتدئ'],
    ARRAY['negation','نفي الماضي','过去时否定','لم + مضارع مجزوم','لم أذهب.','我没去。','过去否定','مبتدئ'],
    ARRAY['negation','نفي الاسمية','名词句否定','ليس + اسم + خبر','ليس الكتاب جديداً.','这本书不是新的。','名词句否定','مبتدئ'],
    ARRAY['adjectives','النعت','形容词修饰','adj agrees in gender/number/definiteness','الكتاب الكبير','大书','形容词配合','مبتدئ'],
    ARRAY['comparison','أفعل التفضيل','比较级','أفعل + من','هو أطول منها.','他比她高。','比较','متوسط'],
    ARRAY['pronouns','الضمائر المنفصلة','分离人称代词','أنا/أنت/هو/هي/نحن/أنتم/هم','هم يتكلمون عربياً.','他们说阿拉伯语。','主格代词','مبتدئ'],
    ARRAY['pronouns','الضمائر المتصلة','连接人称代词','verb/noun + ي/ك/ه/ها...','كتابي / كتابك','我的书/你的书','连接代词','مبتدئ'],
    ARRAY['possession','الإضافة','所有结构','possessed + possessor (no al)','كتاب الطالب','学生的书','所有结构','مبتدئ'],
    ARRAY['questions','أدوات الاستفهام','疑问词','من/ما/أين/متى/كيف/لماذا/كم','أين تسكن?','你住哪里？','疑问词','مبتدئ'],
    ARRAY['modal','يستطيع / يمكن','能够','يستطيع + أن + مضارع','يستطيع أن يسبح.','他会游泳。','能力','مبتدئ'],
    ARRAY['modal','يريد','想要','يريد + أن + مضارع','أريد أن أشرب قهوة.','我想喝咖啡。','愿望','مبتدئ'],
    ARRAY['modal','يجب','必须','يجب + أن + مضارع','يجب أن تدرس.','你必须学习。','义务','متوسط'],
    ARRAY['prepositions','حروف الجر','介词','في/على/تحت/فوق/بين/مع','الكتاب على الطاولة.','书在桌子上。','地点介词','مبتدئ'],
    ARRAY['conjunctions','حروف العطف','并列连词','و/أو/لكن/ثم','أنا أحب الشاي والقهوة.','我喜欢茶和咖啡。','并列','مبتدئ'],
    ARRAY['conjunctions','أدوات الربط','从属连词','لأن/عندما/إذا/حتى','بقيت في البيت لأن الجو بارد.','我待在家里因为天气冷。','从属','متوسط'],
    ARRAY['conditional','أسلوب الشرط','条件句','إذا/لو + ماض + جواب الشرط','إذا درست، نجحت.','如果你学习，你会成功。','条件句','متوسط'],
    ARRAY['passive','المبني للمجهول','被动语态','verb passive form','كُتب الكتاب.','书被写了。','被动','متوسط'],
    ARRAY['dual_verb','مطابقة الفعل للفاعل','动词与主语一致','verb agrees in gender/number','ذهبت البنت.','女孩去了。','动词主语一致','مبتدئ'],
    ARRAY['roots','الجذر الثلاثي','三字母词根','k-t-b: كتب/كتاب/مكتبة','كتب (wrote) / كتاب (book)','写/书','词根系统','متوسط'],
    ARRAY['verb_forms','الأوزان الصرفية','动词形式','Form I to Form X patterns','كتب (I) / كاتب (III) / اكتتب (VIII)','写/通信/订阅','动词形式','متوسط'],
    ARRAY['relative','أسماء الموصول','关系代词','الذي (m) / التي (f) + verb','الرجل الذي يتكلم هو أبي.','说话的男人是我父亲。','关系代词','متوسط'],
    ARRAY['exclamation','ما + أفعل','感叹句','ما أجمل + noun','ما أجمل هذه المدينة!','这座城市多美啊！','感叹句','متوسط'],
    ARRAY['object_pronoun','الضمير المفعول','宾格代词','verb + ه/ها/هم...','رأيته.','我看见他了。','宾格代词','متوسط'],
    ARRAY['elative','أفعل التفضيل (Superlative)','最高级','الـ + أفعل','هو الأطول.','他是最高的。','最高级','متوسط'],
    ARRAY['numbers','الأعداد والمعدود','数词与名词','agreement rules for 3-10','ثلاثة كتب (3 books)','三本书','数词规则','متوسط'],
    ARRAY['time_expressions','ظروف الزمان','时间副词','اليوم/أمس/غداً/الآن/دائماً','اليوم ذهبت إلى المدرسة.','今天我去了学校。','时间副词','مبتدئ'],
    ARRAY['place_expressions','ظروف المكان','地点副词','هنا/هناك/أمام/خلف/بجانب','الكتاب هنا.','书在这里。','地点副词','مبتدئ'],
    ARRAY['vocative','حرف النداء','呼格','يا + noun','يا محمد!','穆罕默德！','呼格','مبتدئ'],
    ARRAY['imperative','فعل الأمر','命令式','imperative form','اذهب إلى المدرسة!','去学校！','命令式','مبتدئ'],
    ARRAY['habitual','كان + مضارع','过去习惯','كان + يفعل','كان يدرس كل يوم.','他每天都学习。','过去习惯','متوسط'],
    ARRAY['purpose','لكي / كي','为了...','لكي + مضارع منصوب','أدرس لكي أنجح.','我学习是为了成功。','目的','متوسط']
  ];

  zh_grammar text[][] := ARRAY[
    ARRAY['word_order','基本语序 SVO','基本句型','主语 + 谓语 + 宾语','我吃苹果。','我吃苹果。','基本语序','初级'],
    ARRAY['negation','否定词 不','否定（一般）','不 + 动词/形容词','我不吃肉。','我不吃肉。','动词/形容词否定','初级'],
    ARRAY['negation','否定词 没','否定（有/过去）','没 + 有/动词','我没有钱。','我没有钱。','过去否定','初级'],
    ARRAY['questions','疑问句 吗','一般疑问句','陈述句 + 吗？','你是学生吗？','你是学生吗？','是否疑问','初级'],
    ARRAY['questions','正反疑问句','正反疑问句','V + 不 + V?','你去不去？','你去不去？','正反疑问','初级'],
    ARRAY['questions','疑问代词','特殊疑问词','谁/什么/哪里/什么时候/为什么/怎么','你在哪里？','你在哪里？','疑问词','初级'],
    ARRAY['aspect','了 (动作完成)','完成态','动词 + 了','我吃了饭。','我吃了饭。','完成态','初级'],
    ARRAY['aspect','过 (经历)','经历态','动词 + 过','我去过日本。','我去过日本。','经历态','初级'],
    ARRAY['aspect','着 (持续状态)','持续态','动词 + 着','门开着。','门是开着的。','持续态','中级'],
    ARRAY['aspect','在/正在 (进行)','进行态','在/正在 + 动词','我在吃饭。','我在吃饭。','进行态','初级'],
    ARRAY['measure_words','量词','量词','数词 + 量词 + 名词','三本书','三本书','量词','初级'],
    ARRAY['measure_words','常用量词','常见量词表','个/本/张/条/只/杯...','一个苹果/一本书','一个苹果/一本书','常见量词','初级'],
    ARRAY['adjectives','形容词谓语','形容词做谓语','主语 + (很) + 形容词','她很漂亮。','她很漂亮。','形容词谓语','初级'],
    ARRAY['adjectives','形容词修饰','形容词修饰名词','形容词 + 的 + 名词','漂亮的花','漂亮的花','形容词修饰','初级'],
    ARRAY['de_particle','的 (修饰)','修饰助词 的','修饰语 + 的 + 名词','我的书','我的书','修饰助词','初级'],
    ARRAY['de_particle','地 (状语)','状语助词 地','状语 + 地 + 动词','他高兴地笑了。','他高兴地笑了。','状语助词','中级'],
    ARRAY['de_particle','得 (程度)','程度补语 得','动词 + 得 + 程度','他跑得很快。','他跑得很快。','程度补语','中级'],
    ARRAY['ba_structure','把字句','把字句','把 + 宾语 + 动词（+了）','我把作业做完了。','我把作业做完了。','把字句','中级'],
    ARRAY['bei_structure','被字句','被动句','被 + 施事 + 动词','书被他拿走了。','书被他拿走了。','被动句','中级'],
    ARRAY['shi_shi','是...的','强调句','是 + 强调成分 + 的','他是昨天来的。','他是昨天来的。','强调句','中级'],
    ARRAY['comparison','比字句','比较句','A + 比 + B + 形容词','他比我高。','他比我高。','比较句','初级'],
    ARRAY['comparison','没有比较','没有比较','A + 没有 + B + 形容词','我没有他高。','我没有他高矮。','否定比较','中级'],
    ARRAY['existence','存现句','存在句','地点 + 有/是 + 名词','桌子上有一本书。','桌子上有一本书。','存在句','初级'],
    ARRAY['location','在','在...','在 + 地点 + 动词','我在家学习。','我在家学习。','位置介词','初级'],
    ARRAY['direction','方向补语','方向补语','动词 + 上/下/进/出/回/过/起','他走进了教室。','他走进了教室。','方向补语','中级'],
    ARRAY['result','结果补语','结果补语','动词 + 完/好/到/见/懂/会...','我听懂了。','我听懂了。','结果补语','中级'],
    ARRAY['potential','可能补语','可能补语','V + 得/不 + 结果','我听得懂。/我听不懂。','我听得懂/听不懂。','可能补语','中级'],
    ARRAY['serial_verb','连动句','连动句','V1 + V2（共享主语）','我去图书馆借书。','我去图书馆借书。','连动句','初级'],
    ARRAY['pivot','兼语句','兼语句','V1 + 兼语 + V2','老师叫我回答问题。','老师叫我回答问题。','兼语句','中级'],
    ARRAY['conjunctions','因为...所以...','原因结果','因为 + 原因，所以 + 结果','因为下雨，所以没去。','因为下雨，所以没去。','因果','初级'],
    ARRAY['conjunctions','虽然...但是...','转折','虽然 + P1，但是 + P2','虽然很累，但是继续工作。','虽然很累，但是继续工作。','转折','初级'],
    ARRAY['conjunctions','如果...就...','条件','如果 + 条件，就 + 结果','如果有时间，就来。','如果有时间，就来。','条件','初级'],
    ARRAY['conjunctions','只有...才...','必要条件','只有 + 条件，才 + 结果','只有努力，才能成功。','只有努力，才能成功。','必要条件','中级'],
    ARRAY['conjunctions','不但...而且...','递进','不但 + P1，而且 + P2','他不但聪明，而且勤奋。','他不但聪明，而且勤奋。','递进','中级'],
    ARRAY['modal','会（能力/推测）','会','会 + 动词','我会说中文。','我会说中文。','能力/推测','初级'],
    ARRAY['modal','能（能力/可能）','能','能 + 动词','我能来。','我能来。','能力/可能','初级'],
    ARRAY['modal','可以（许可）','可以','可以 + 动词','你可以进来。','你可以进来。','许可','初级'],
    ARRAY['modal','要（意愿/将要）','要','要 + 动词','我要去中国。','我要去中国。','意愿/将要','初级'],
    ARRAY['modal','应该（应当）','应该','应该 + 动词','你应该多休息。','你应该多休息。','应当','初级'],
    ARRAY['time_adverbs','时间副词','时间副词','已经/刚/还/就/才/再/又','我已经吃了。','我已经吃了。','时间副词','初级'],
    ARRAY['topic_comment','话题-评论','话题-评论结构','话题 + 评论','那本书，我看过了。','那本书，我看过了。','话题评论','中级']
  ];

  i integer;
  w text[];
BEGIN
  -- Italian grammar
  i := 1;
  FOREACH w SLICE 1 IN ARRAY it_grammar LOOP
    INSERT INTO grammar_patterns (language_code, category, title, title_zh, structure, example_target, example_zh, notes, level, order_index, created_at)
    VALUES ('it', w[1], w[2], w[3], w[4], w[5], w[6], w[7], w[8], i + 100, now())
    ON CONFLICT DO NOTHING;
    i := i + 1;
  END LOOP;

  -- Portuguese grammar
  i := 1;
  FOREACH w SLICE 1 IN ARRAY pt_grammar LOOP
    INSERT INTO grammar_patterns (language_code, category, title, title_zh, structure, example_target, example_zh, notes, level, order_index, created_at)
    VALUES ('pt', w[1], w[2], w[3], w[4], w[5], w[6], w[7], w[8], i + 100, now())
    ON CONFLICT DO NOTHING;
    i := i + 1;
  END LOOP;

  -- Arabic grammar
  i := 1;
  FOREACH w SLICE 1 IN ARRAY ar_grammar LOOP
    INSERT INTO grammar_patterns (language_code, category, title, title_zh, structure, example_target, example_zh, notes, level, order_index, created_at)
    VALUES ('ar', w[1], w[2], w[3], w[4], w[5], w[6], w[7], w[8], i + 100, now())
    ON CONFLICT DO NOTHING;
    i := i + 1;
  END LOOP;

  -- Chinese grammar
  i := 1;
  FOREACH w SLICE 1 IN ARRAY zh_grammar LOOP
    INSERT INTO grammar_patterns (language_code, category, title, title_zh, structure, example_target, example_zh, notes, level, order_index, created_at)
    VALUES ('zh', w[1], w[2], w[3], w[4], w[5], w[6], w[7], w[8], i + 100, now())
    ON CONFLICT DO NOTHING;
    i := i + 1;
  END LOOP;
END $$;
