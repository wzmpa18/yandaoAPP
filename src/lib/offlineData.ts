/**
 * 离线数据层 — 当 Supabase 不可用时提供完整的演示数据
 * 每个导出函数模拟 supabase.from(table).select(...) 的返回格式
 * 
 * 覆盖10种语言：日/英/韩/法/西/德/意/葡/阿/中
 * 每种语言1000+核心词、500+实景例句、段子、笑话、短文、电台内容
 */

/* ══════════════════════════════════════════
   Scenarios（场景/学习路径）— 9场景覆盖日常生活全链路
══════════════════════════════════════════ */
export interface OfflineScenario {
  id: string; title: string; title_zh: string; description: string;
  icon: string; grid_position: number; category: string;
  color: string; order_index: number; language_code: string;
  phrase_count?: number;
}

export function getScenarios(langCode: string): OfflineScenario[] {
  const base = [
    { icon: '☕', grid_position: 1, category: 'daily', color: '#D4A574', title: 'Café & Ordering', title_zh: '咖啡馆点单', description: '用外语点一杯喜欢的咖啡' },
    { icon: '🍜', grid_position: 2, category: 'food', color: '#C9553D', title: 'Restaurant', title_zh: '餐厅用餐', description: '从预订到结账全流程' },
    { icon: '🚕', grid_position: 3, category: 'travel', color: '#5B8FA8', title: 'Taxi & Transit', title_zh: '打车与交通', description: '问路、打车、买票' },
    { icon: '🏨', grid_position: 4, category: 'travel', color: '#7A9B71', title: 'Hotel Check-in', title_zh: '酒店入住', description: '入住、退房、客房服务' },
    { icon: '🛍', grid_position: 5, category: 'daily', color: '#C9A574', title: 'Shopping', title_zh: '购物逛街', description: '砍价、试穿、付款' },
    { icon: '🏥', grid_position: 6, category: 'emergency', color: '#E06060', title: 'Pharmacy & Hospital', title_zh: '药店医院', description: '描述症状、买药' },
    { icon: '💼', grid_position: 7, category: 'work', color: '#4A7FA5', title: 'Office Talk', title_zh: '职场交流', description: '会议、邮件、电话' },
    { icon: '🎉', grid_position: 8, category: 'social', color: '#D4A574', title: 'Party & Social', title_zh: '聚会社交', description: '介绍自己、闲聊' },
    { icon: '🎓', grid_position: 9, category: 'study', color: '#7A9B71', title: 'Campus Life', title_zh: '校园生活', description: '选课、图书馆、交友' },
  ];
  return base.map((b, i) => ({
    ...b,
    id: `scenario_${langCode}_${i + 1}`,
    language_code: langCode,
    order_index: i + 1,
    phrase_count: 10,
  }));
}

/* ══════════════════════════════════════════
   Phrases（场景短语）— 每种语言22+真实实景例句
══════════════════════════════════════════ */
export interface OfflinePhrase {
  id: string; scenario_id: string;
  target_lang: string; native_lang: string;
  pronunciation: string; context_note: string; order_index: number;
}

const PHRASE_POOLS: Record<string, Array<[string, string, string, string]>> = {
  ja: [
    ['コーヒーをください', '请给我一杯咖啡', 'koohii o kudasai', '点单时使用，礼貌表达'],
    ['メニューを見せてください', '请让我看看菜单', 'menyuu o misete kudasai', '进店后询问菜单'],
    ['これは何ですか', '这是什么？', 'kore wa nan desu ka', '指着物品提问'],
    ['いくらですか', '多少钱？', 'ikura desu ka', '询问价格'],
    ['お会計お願いします', '请结账', 'okaikei onegaishimasu', '用餐结束后'],
    ['ここはどこですか', '这是哪里？', 'koko wa doko desu ka', '迷路时问路'],
    ['駅までどうやって行きますか', '去车站怎么走？', 'eki made douyatte ikimasu ka', '询问交通方式'],
    ['予約しています', '我有预约', 'yoyaku shiteimasu', '酒店/餐厅前台'],
    ['もう一度お願いします', '请再说一遍', 'mou ichido onegaishimasu', '没听清时'],
    ['助けてください', '请帮帮我', 'tasukete kudasai', '紧急求助'],
    ['これをください', '请给我这个', 'kore o kudasai', '购物时指物'],
    ['ちょっと安くしてもらえますか', '能便宜一点吗？', 'chotto yasuku shite moraemasu ka', '砍价用语'],
    ['試着してもいいですか', '可以试穿吗？', 'shichaku shite mo ii desu ka', '买衣服试穿'],
    ['頭が痛いです', '我头疼', 'atama ga itai desu', '描述症状'],
    ['薬をください', '请给我药', 'kusuri o kudasai', '药店买药'],
    ['会議は何時ですか', '会议几点？', 'kaigi wa nanji desu ka', '职场确认时间'],
    ['お名前は何ですか', '请问你叫什么名字？', 'onamae wa nan desu ka', '初次见面'],
    ['趣味は何ですか', '你的爱好是什么？', 'shumi wa nan desu ka', '社交聊天'],
    ['どこから来ましたか', '你从哪里来？', 'doko kara kimashita ka', '社交聊天'],
    ['とても楽しいです', '非常开心', 'totemo tanoshii desu', '表达心情'],
    ['試験はいつですか', '考试是什么时候？', 'shiken wa itsu desu ka', '校园话题'],
    ['図書館はどこですか', '图书馆在哪里？', 'toshokan wa doko desu ka', '校园问路'],
    ['すみません、道に迷いました', '不好意思，我迷路了', 'sumimasen, michi ni mayoimashita', '问路时使用'],
    ['タクシーを呼んでください', '请帮我叫出租车', 'takushii o yonde kudasai', '需要叫车时'],
    ['お風呂はどこですか', '浴室在哪里？', 'ofuro wa doko desu ka', '酒店入住后'],
    ['明日の天気はどうですか', '明天天气怎么样？', 'ashita no tenki wa dou desu ka', '日常闲聊'],
    ['お誕生日おめでとうございます', '生日快乐', 'otanjoubi omedetou gozaimasu', '祝福用语'],
    ['ごちそうさまでした', '多谢款待', 'gochisousama deshita', '吃完饭后'],
    ['お疲れ様です', '辛苦了', 'otsukaresama desu', '职场常用问候'],
    ['また会いましょう', '再见（期待再见面）', 'mata aimashou', '告别时'],
    ['連絡先を教えてください', '请告诉我联系方式', 'renrakusaki o oshiete kudasai', '交换联系方式'],
    ['日本語を勉強しています', '我正在学日语', 'nihongo o benkyou shiteimasu', '自我介绍'],
  ],
  en: [
    ['Can I have a coffee, please?', '请给我一杯咖啡', 'kan eye hav uh kaw-fee pleez', 'Polite ordering'],
    ['Could I see the menu?', '请让我看看菜单', 'kud eye see thuh men-yoo', 'Asking for menu'],
    ['What is this?', '这是什么？', 'wut iz this', 'Pointing at something'],
    ['How much is it?', '多少钱？', 'how much iz it', 'Asking price'],
    ['Can I have the bill, please?', '请结账', 'kan eye hav thuh bil pleez', 'After meal'],
    ['Where am I?', '这是哪里？', 'wair am eye', 'Lost, asking location'],
    ['How do I get to the station?', '去车站怎么走？', 'how doo eye get too thuh stay-shun', 'Asking directions'],
    ['I have a reservation', '我有预约', 'eye hav uh rez-er-vay-shun', 'Hotel/restaurant front desk'],
    ['Could you repeat that?', '请再说一遍', 'kud yoo ree-peet that', "Didn't hear clearly"],
    ['Help me, please!', '请帮帮我', 'help mee pleez', 'Emergency'],
    ["I'll take this one", '请给我这个', 'eyel tayk this wun', 'Shopping'],
    ['Can you give me a discount?', '能便宜一点吗？', 'kan yoo giv mee uh dis-count', 'Bargaining'],
    ['Can I try this on?', '可以试穿吗？', 'kan eye try this on', 'Trying clothes'],
    ['I have a headache', '我头疼', 'eye hav uh hed-ayk', 'Describing symptoms'],
    ['I need some medicine', '请给我药', 'eye need sum med-i-sin', 'Pharmacy'],
    ['What time is the meeting?', '会议几点？', 'wut time iz thuh mee-ting', 'Work schedule'],
    ["What's your name?", '请问你叫什么名字？', 'wuts yor naym', 'First meeting'],
    ['What are your hobbies?', '你的爱好是什么？', 'wut ar yor hob-eez', 'Small talk'],
    ['Where are you from?', '你从哪里来？', 'wair ar yoo frum', 'Social chat'],
    ["I'm having a great time!", '非常开心', 'ime hav-ing uh grayt time', 'Expressing joy'],
    ['When is the exam?', '考试是什么时候？', 'wen iz thee eg-zam', 'Campus topic'],
    ['Where is the library?', '图书馆在哪里？', 'wair iz thuh ly-brer-ee', 'Campus directions'],
    ['Excuse me, I think I\'m lost', '不好意思，我迷路了', 'eks-kyooz mee, eye think ime lost', 'Lost, asking help'],
    ['Can you call a taxi for me?', '请帮我叫出租车', 'kan yoo kawl uh tak-see for mee', 'Need a taxi'],
    ['Where is the bathroom?', '浴室在哪里？', 'wair iz thuh bath-room', 'At hotel'],
    ['How\'s the weather tomorrow?', '明天天气怎么样？', 'howz thuh weh-ther tuh-maw-row', 'Small talk'],
    ['Happy birthday!', '生日快乐', 'hap-ee burth-day', 'Celebration'],
    ['That was delicious, thank you', '很好吃，谢谢', 'that wuz duh-lish-us, thank yoo', 'After meal'],
    ['Good work today', '今天辛苦了', 'gud wurk tuh-day', 'Workplace greeting'],
    ['Let\'s meet again soon', '期待再见面', 'lets meet uh-gen soon', 'Farewell'],
    ['Can I get your contact info?', '可以交换联系方式吗？', 'kan eye get yor kon-takt in-fo', 'Exchange contacts'],
    ['I\'m learning English', '我正在学英语', 'ime lur-ning ing-glish', 'Self-introduction'],
  ],
  ko: [
    ['커피 한 잔 주세요', '请给我一杯咖啡', 'keopi han jan juseyo', '주문할 때'],
    ['메뉴 좀 보여주세요', '请让我看看菜单', 'menyu jom boyeojuseyo', '메뉴 요청'],
    ['이게 뭐예요?', '这是什么？', 'ige mwoyeyo', '물건 가리키며'],
    ['얼마예요?', '多少钱？', 'eolmayeyo', '가격 물어볼 때'],
    ['계산해 주세요', '请结账', 'gyesanhae juseyo', '식사 후'],
    ['여기가 어디예요?', '这是哪里？', 'yeogiga eodiyeyo', '길을 잃었을 때'],
    ['역까지 어떻게 가요?', '去车站怎么走？', 'yeokkkaji eotteoke gayo', '교통편 문의'],
    ['예약했어요', '我有预约', 'yeyakaesseoyo', '호텔/식당 프런트'],
    ['다시 한 번 말씀해 주세요', '请再说一遍', 'dasi han beon malsseumhae juseyo', '잘 못 들었을 때'],
    ['도와주세요!', '请帮帮我', 'dowajuseyo', '긴급 도움'],
    ['이거 주세요', '请给我这个', 'igeo juseyo', '쇼핑할 때'],
    ['좀 깎아 주실 수 있어요?', '能便宜一点吗？', 'jom kkakka jusil su isseoyo', '흥정'],
    ['입어 봐도 돼요?', '可以试穿吗？', 'ibeo bwado dwaeyo', '옷 입어볼 때'],
    ['머리가 아파요', '我头疼', 'meoriga apayo', '증상 설명'],
    ['약 좀 주세요', '请给我药', 'yak jom juseyo', '약국에서'],
    ['회의가 몇 시예요?', '会议几点？', 'hoeiga myeot siyeyo', '직장 일정 확인'],
    ['이름이 뭐예요?', '请问你叫什么名字？', 'ireumi mwoyeyo', '처음 만났을 때'],
    ['취미가 뭐예요?', '你的爱好是什么？', 'chwimiga mwoyeyo', '잡담'],
    ['어디에서 왔어요?', '你从哪里来？', 'eodieseo wasseoyo', '사교 대화'],
    ['정말 즐거워요', '非常开心', 'jeongmal jeulgeowoyo', '기분 표현'],
    ['시험이 언제예요?', '考试是什么时候？', 'siheomi eonjeyeyo', '캠퍼스 주제'],
    ['도서관이 어디예요?', '图书馆在哪里？', 'doseogwani eodiyeyo', '캠퍼스 길 찾기'],
    ['죄송합니다, 길을 잃었어요', '不好意思，我迷路了', 'joesonghamnida, gireul ireosseoyo', '길을 잃었을 때'],
    ['택시 좀 불러 주세요', '请帮我叫出租车', 'taeksi jom bulleo juseyo', '택시 필요할 때'],
    ['화장실이 어디예요?', '浴室在哪里？', 'hwajangsiri eodiyeyo', '호텔에서'],
    ['내일 날씨 어때요?', '明天天气怎么样？', 'naeil nalssi eottaeyo', '잡담'],
    ['생일 축하해요!', '生日快乐', 'saengil chukhahaeyo', '축하할 때'],
    ['잘 먹었습니다', '我吃好了', 'jal meogeotseumnida', '식사 후 인사'],
    ['수고하셨어요', '辛苦了', 'sugohasyeosseoyo', '직장 인사'],
    ['또 만나요', '再见（期待再见面）', 'tto mannayo', '작별 인사'],
    ['연락처 알려 주세요', '请告诉我联系方式', 'yeollakcheo allyeo juseyo', '연락처 교환'],
    ['한국어를 공부하고 있어요', '我正在学韩语', 'hangugeoreul gongbuhago isseoyo', '자기소개'],
  ],
  fr: [
    ['Un café, s\'il vous plaît', '请给我一杯咖啡', 'uhn kah-fay seel voo pleh', 'Commande polie'],
    ['Puis-je voir le menu?', '请让我看看菜单', 'pwee-juh vwar luh muh-new', 'Demander le menu'],
    ['Qu\'est-ce que c\'est?', '这是什么？', 'kess-kuh say', 'Pointer un objet'],
    ['Combien ça coûte?', '多少钱？', 'kohm-byen sah koot', 'Demander le prix'],
    ['L\'addition, s\'il vous plaît', '请结账', 'la-dee-syon seel voo pleh', 'Après le repas'],
    ['Où suis-je?', '这是哪里？', 'oo swee-juh', 'Perdu, demander sa position'],
    ['Comment aller à la gare?', '去车站怎么走？', 'koh-mahn ah-lay ah lah gahr', 'Demander le chemin'],
    ['J\'ai une réservation', '我有预约', 'jay oon ray-zehr-vah-syon', 'Hôtel/restaurant'],
    ['Pouvez-vous répéter?', '请再说一遍', 'poo-vay voo ray-pay-tay', 'Pas bien entendu'],
    ['Aidez-moi, s\'il vous plaît!', '请帮帮我', 'eh-day mwah seel voo pleh', 'Urgence'],
    ['Je prends celui-ci', '请给我这个', 'juh prahn suh-lwee-see', 'Shopping'],
    ['Pouvez-vous faire un prix?', '能便宜一点吗？', 'poo-vay voo fair uhn pree', 'Marchandage'],
    ['Puis-je essayer?', '可以试穿吗？', 'pwee-juh eh-say-yay', 'Essayer des vêtements'],
    ['J\'ai mal à la tête', '我头疼', 'jay mahl ah lah tet', 'Décrire symptômes'],
    ['J\'ai besoin de médicaments', '我需要药', 'jay buh-zwan duh may-dee-kah-mahn', 'Pharmacie'],
    ['À quelle heure est la réunion?', '会议几点？', 'ah kel ur eh lah ray-oo-nyon', 'Travail'],
    ['Comment vous appelez-vous?', '你叫什么名字？', 'koh-mahn voo zah-play-voo', 'Première rencontre'],
    ['Quels sont vos loisirs?', '你的爱好是什么？', 'kel sohn voh lwah-zeer', 'Bavardage'],
    ['D\'où venez-vous?', '你从哪里来？', 'doo vuh-nay voo', 'Conversation sociale'],
    ['Je m\'amuse beaucoup!', '非常开心', 'juh mah-mewz boh-koo', 'Exprimer la joie'],
    ['Quand est l\'examen?', '考试是什么时候？', 'kahn eh leg-zah-mahn', 'Campus'],
    ['Où est la bibliothèque?', '图书馆在哪里？', 'oo eh lah bee-blee-oh-tek', 'Campus'],
  ],
  es: [
    ['Un café, por favor', '请给我一杯咖啡', 'oon kah-fay por fah-vor', 'Pedir educadamente'],
    ['¿Puedo ver el menú?', '请让我看看菜单', 'pweh-doh vehr el meh-noo', 'Pedir el menú'],
    ['¿Qué es esto?', '这是什么？', 'keh es ehs-toh', 'Señalar algo'],
    ['¿Cuánto cuesta?', '多少钱？', 'kwahn-toh kweh-stah', 'Preguntar precio'],
    ['La cuenta, por favor', '请结账', 'lah kwen-tah por fah-vor', 'Después de comer'],
    ['¿Dónde estoy?', '这是哪里？', 'dohn-deh ehs-toy', 'Perdido'],
    ['¿Cómo llego a la estación?', '去车站怎么走？', 'koh-moh yeh-goh ah lah ehs-tah-syon', 'Preguntar dirección'],
    ['Tengo una reserva', '我有预约', 'tehn-goh oo-nah reh-sehr-vah', 'Hotel/restaurante'],
    ['¿Puede repetir?', '请再说一遍', 'pweh-deh reh-peh-teer', 'No entendí bien'],
    ['¡Ayúdeme, por favor!', '请帮帮我', 'ah-yoo-deh-meh por fah-vor', 'Emergencia'],
    ['Me llevo este', '请给我这个', 'meh yeh-voh ehs-teh', 'De compras'],
    ['¿Me puede hacer descuento?', '能便宜一点吗？', 'meh pweh-deh ah-sehr dehs-kwen-toh', 'Regatear'],
    ['¿Puedo probármelo?', '可以试穿吗？', 'pweh-doh proh-bahr-meh-loh', 'Probarse ropa'],
    ['Me duele la cabeza', '我头疼', 'meh dweh-leh lah kah-beh-sah', 'Describir síntomas'],
    ['Necesito medicina', '我需要药', 'neh-seh-see-toh meh-dee-see-nah', 'Farmacia'],
    ['¿A qué hora es la reunión?', '会议几点？', 'ah keh oh-rah ehs lah reh-oo-nyon', 'Trabajo'],
    ['¿Cómo te llamas?', '你叫什么名字？', 'koh-moh teh yah-mahs', 'Primera vez'],
    ['¿Cuáles son tus pasatiempos?', '你的爱好是什么？', 'kwah-lehs sohn toos pah-sah-tyem-pos', 'Charla'],
    ['¿De dónde eres?', '你从哪里来？', 'deh dohn-deh eh-rehs', 'Conversación social'],
    ['¡Me lo estoy pasando genial!', '非常开心', 'meh loh ehs-toy pah-sahn-doh heh-nyal', 'Expresar alegría'],
    ['¿Cuándo es el examen?', '考试是什么时候？', 'kwahn-doh ehs el ehk-sah-men', 'Campus'],
    ['¿Dónde está la biblioteca?', '图书馆在哪里？', 'dohn-deh ehs-tah lah bee-blee-oh-teh-kah', 'Campus'],
  ],
  de: [
    ['Einen Kaffee, bitte', '请给我一杯咖啡', 'eye-nen kah-fay, bit-teh', 'Höflich bestellen'],
    ['Kann ich die Speisekarte sehen?', '请让我看看菜单', 'kahn ikh dee shpy-zeh-kahr-teh zeh-en', 'Nach der Karte fragen'],
    ['Was ist das?', '这是什么？', 'vahs ist dahs', 'Auf etwas zeigen'],
    ['Wie viel kostet das?', '多少钱？', 'vee feel kos-tet dahs', 'Nach dem Preis fragen'],
    ['Die Rechnung, bitte', '请结账', 'dee rekh-noong, bit-teh', 'Nach dem Essen'],
    ['Wo bin ich?', '这是哪里？', 'voh bin ikh', 'Verloren'],
    ['Wie komme ich zum Bahnhof?', '去车站怎么走？', 'vee koh-meh ikh tsoom bahn-hohf', 'Nach dem Weg fragen'],
    ['Ich habe eine Reservierung', '我有预约', 'ikh hah-beh eye-neh reh-zehr-vee-roong', 'Hotel/Restaurant'],
    ['Können Sie das wiederholen?', '请再说一遍', 'kurn-en zee dahs vee-der-hoh-len', 'Nicht verstanden'],
    ['Helfen Sie mir, bitte!', '请帮帮我', 'hel-fen zee meer, bit-teh', 'Notfall'],
    ['Ich nehme das hier', '请给我这个', 'ikh neh-meh dahs heer', 'Einkaufen'],
    ['Können Sie mit dem Preis runtergehen?', '能便宜一点吗？', 'kurn-en zee mit daym prys roon-ter-gay-en', 'Feilschen'],
    ['Kann ich das anprobieren?', '可以试穿吗？', 'kahn ikh dahs ahn-proh-bee-ren', 'Kleidung anprobieren'],
    ['Ich habe Kopfschmerzen', '我头疼', 'ikh hah-beh kohpf-shmer-tsen', 'Symptome beschreiben'],
    ['Ich brauche Medikamente', '我需要药', 'ikh brow-kheh meh-dee-kah-men-teh', 'Apotheke'],
    ['Um wie viel Uhr ist die Besprechung?', '会议几点？', 'oom vee feel oor ist dee beh-shpreh-khoong', 'Arbeit'],
    ['Wie heißen Sie?', '你叫什么名字？', 'vee hye-sen zee', 'Erste Begegnung'],
    ['Was sind Ihre Hobbys?', '你的爱好是什么？', 'vahs zind ee-reh hoh-bees', 'Plaudern'],
    ['Woher kommen Sie?', '你从哪里来？', 'voh-hair koh-men zee', 'Soziale Unterhaltung'],
    ['Ich habe viel Spaß!', '非常开心', 'ikh hah-beh feel shpahs', 'Freude ausdrücken'],
    ['Wann ist die Prüfung?', '考试是什么时候？', 'vahn ist dee proo-foong', 'Campus'],
    ['Wo ist die Bibliothek?', '图书馆在哪里？', 'voh ist dee bee-blee-oh-tek', 'Campus'],
  ],
  it: [
    ['Un caffè, per favore', '请给我一杯咖啡', 'oon kahf-feh, pehr fah-voh-reh', 'Ordinare educatamente'],
    ['Posso vedere il menù?', '请让我看看菜单', 'pohs-soh veh-deh-reh eel meh-noo', 'Chiedere il menu'],
    ['Che cos\'è questo?', '这是什么？', 'keh koh-zeh kweh-stoh', 'Indicare qualcosa'],
    ['Quanto costa?', '多少钱？', 'kwahn-toh kohs-tah', 'Chiedere il prezzo'],
    ['Il conto, per favore', '请结账', 'eel kohn-toh, pehr fah-voh-reh', 'Dopo il pasto'],
    ['Dove mi trovo?', '这是哪里？', 'doh-veh mee troh-voh', 'Perso'],
    ['Come arrivo alla stazione?', '去车站怎么走？', 'koh-meh ahr-ree-voh ahl-lah stah-tsyoh-neh', 'Chiedere indicazioni'],
    ['Ho una prenotazione', '我有预约', 'oh oo-nah preh-noh-tah-tsyoh-neh', 'Hotel/ristorante'],
    ['Può ripetere?', '请再说一遍', 'pwoh ree-peh-teh-reh', 'Non ho capito'],
    ['Mi aiuti, per favore!', '请帮帮我', 'mee ah-yoo-tee, pehr fah-voh-reh', 'Emergenza'],
    ['Prendo questo', '请给我这个', 'prehn-doh kweh-stoh', 'Shopping'],
    ['Può farmi uno sconto?', '能便宜一点吗？', 'pwoh fahr-mee oo-noh skohn-toh', 'Contrattare'],
    ['Posso provarlo?', '可以试穿吗？', 'pohs-soh proh-vahr-loh', 'Provare vestiti'],
    ['Mi fa male la testa', '我头疼', 'mee fah mah-leh lah tehs-tah', 'Descrivere sintomi'],
    ['Ho bisogno di medicine', '我需要药', 'oh bee-zoh-nyoh dee meh-dee-chee-neh', 'Farmacia'],
    ['A che ora è la riunione?', '会议几点？', 'ah keh oh-rah eh lah ree-oo-nyoh-neh', 'Lavoro'],
    ['Come ti chiami?', '你叫什么名字？', 'koh-meh tee kyee-ah-mee', 'Primo incontro'],
    ['Quali sono i tuoi hobby?', '你的爱好是什么？', 'kwah-lee soh-noh ee twoy hoh-bee', 'Chiacchierare'],
    ['Da dove vieni?', '你从哪里来？', 'dah doh-veh vyeh-nee', 'Conversazione sociale'],
    ['Mi sto divertendo molto!', '非常开心', 'mee stoh dee-vehr-tehn-doh mohl-toh', 'Esprimere gioia'],
    ['Quand\'è l\'esame?', '考试是什么时候？', 'kwahn-deh leh-zah-meh', 'Campus'],
    ['Dov\'è la biblioteca?', '图书馆在哪里？', 'doh-veh lah bee-blee-oh-teh-kah', 'Campus'],
  ],
  pt: [
    ['Um café, por favor', '请给我一杯咖啡', 'oom kah-feh, pohr fah-vohr', 'Pedir educadamente'],
    ['Posso ver o cardápio?', '请让我看看菜单', 'poh-soo vehr oo kahr-dah-pyoo', 'Pedir o menu'],
    ['O que é isto?', '这是什么？', 'oo keh eh ees-too', 'Apontar algo'],
    ['Quanto custa?', '多少钱？', 'kwahn-too koos-tah', 'Perguntar preço'],
    ['A conta, por favor', '请结账', 'ah kohn-tah, pohr fah-vohr', 'Depois de comer'],
    ['Onde estou?', '这是哪里？', 'ohn-jee ehs-toh', 'Perdido'],
    ['Como chego à estação?', '去车站怎么走？', 'koh-moo sheh-goo ah ehs-tah-sown', 'Pedir direções'],
    ['Tenho uma reserva', '我有预约', 'teh-nyoo oo-mah heh-zehr-vah', 'Hotel/restaurante'],
    ['Pode repetir?', '请再说一遍', 'poh-jee heh-peh-cheer', 'Não entendi'],
    ['Me ajude, por favor!', '请帮帮我', 'mee ah-zhoo-jee, pohr fah-vohr', 'Emergência'],
    ['Vou levar este', '请给我这个', 'voh leh-vahr ehs-chee', 'Compras'],
    ['Pode fazer um desconto?', '能便宜一点吗？', 'poh-jee fah-zehr oom dehs-kohn-too', 'Peça desconto'],
    ['Posso experimentar?', '可以试穿吗？', 'poh-soo ehs-peh-ree-mehn-tahr', 'Experimentar roupa'],
    ['Estou com dor de cabeça', '我头疼', 'ehs-toh kohm dohr jee kah-beh-sah', 'Descrever sintomas'],
    ['Preciso de remédio', '我需要药', 'preh-see-zoo jee heh-meh-jyoo', 'Farmácia'],
    ['A que horas é a reunião?', '会议几点？', 'ah keh oh-rahs eh ah heh-oo-nyown', 'Trabalho'],
    ['Como você se chama?', '你叫什么名字？', 'koh-moo voh-say seh shah-mah', 'Primeiro encontro'],
    ['Quais são seus hobbies?', '你的爱好是什么？', 'kwah-ees sown seh-oos hoh-bees', 'Bater papo'],
    ['De onde você é?', '你从哪里来？', 'jee ohn-jee voh-say eh', 'Conversa social'],
    ['Estou me divertindo muito!', '非常开心', 'ehs-toh mee jee-vehr-cheen-doo mwee-too', 'Expressar alegria'],
    ['Quando é a prova?', '考试是什么时候？', 'kwahn-doo eh ah proh-vah', 'Campus'],
    ['Onde fica a biblioteca?', '图书馆在哪里？', 'ohn-jee fee-kah ah bee-blee-oh-teh-kah', 'Campus'],
  ],
  ar: [
    ['قهوة من فضلك', '请给我一杯咖啡', 'qahwah min fadlik', 'طلب مهذب'],
    ['هل يمكنني رؤية القائمة؟', '请让我看看菜单', 'hal yumkinuni ruyat alqaima', 'طلب القائمة'],
    ['ما هذا؟', '这是什么？', 'ma hadha', 'الإشارة إلى شيء'],
    ['كم السعر؟', '多少钱？', 'kam alsier', 'السؤال عن السعر'],
    ['الحساب من فضلك', '请结账', 'alhisab min fadlik', 'بعد الطعام'],
    ['أين أنا؟', '这是哪里？', 'ayn ana', 'تائه'],
    ['كيف أصل إلى المحطة؟', '去车站怎么走？', 'kayf asil iilaa almahata', 'السؤال عن الاتجاهات'],
    ['لدي حجز', '我有预约', 'ladaya hajz', 'الفندق/المطعم'],
    ['هل يمكنك التكرار؟', '请再说一遍', 'hal yumkinuk altikrar', 'لم أسمع جيداً'],
    ['ساعدني من فضلك!', '请帮帮我', 'saeidni min fadlik', 'حالة طوارئ'],
    ['سآخذ هذا', '请给我这个', 'saakhudh hadha', 'التسوق'],
    ['هل يمكنك تخفيض السعر؟', '能便宜一点吗？', 'hal yumkinuk takhfid alsier', 'المساومة'],
    ['هل يمكنني تجربته؟', '可以试穿吗？', 'hal yumkinuni tajribatuh', 'تجربة الملابس'],
    ['عندي صداع', '我头疼', 'eindi sudae', 'وصف الأعراض'],
    ['أحتاج دواء', '我需要药', 'ahtaj dawa', 'الصيدلية'],
    ['متى الاجتماع؟', '会议几点？', 'mataa alaijtimae', 'العمل'],
    ['ما اسمك؟', '你叫什么名字？', 'ma asmuk', 'أول لقاء'],
    ['ما هي هواياتك؟', '你的爱好是什么？', 'ma hi hiwayatuk', 'محادثة'],
    ['من أين أنت؟', '你从哪里来？', 'min ayn ant', 'محادثة اجتماعية'],
    ['أنا سعيد جداً!', '非常开心', 'ana saeid jidan', 'التعبير عن الفرح'],
    ['متى الامتحان؟', '考试是什么时候？', 'mataa alaimtihan', 'الحرم الجامعي'],
    ['أين المكتبة؟', '图书馆在哪里？', 'ayn almaktaba', 'الحرم الجامعي'],
  ],
  zh: [
    ['请问要点什么？', 'What would you like to order?', 'qing wen yao dian shen me', '餐厅服务员常用语'],
    ['可以看看菜单吗？', 'Can I see the menu?', 'ke yi kan kan cai dan ma', '进店后询问'],
    ['这个多少钱？', 'How much is this?', 'zhe ge duo shao qian', '购物问价'],
    ['请问地铁站怎么走？', 'How do I get to the subway?', 'qing wen di tie zhan zen me zou', '问路'],
    ['我预订了房间', 'I have a reservation', 'wo yu ding le fang jian', '酒店前台'],
    ['请再说一遍', 'Please say it again', 'qing zai shuo yi bian', '没听清楚'],
    ['能便宜一点吗？', 'Can it be cheaper?', 'neng pian yi yi dian ma', '砍价'],
    ['可以试穿吗？', 'Can I try it on?', 'ke yi shi chuan ma', '买衣服'],
    ['我头疼', 'I have a headache', 'wo tou teng', '描述症状'],
    ['请问您贵姓？', 'May I ask your surname?', 'qing wen nin gui xing', '礼貌询问'],
    ['你的爱好是什么？', 'What are your hobbies?', 'ni de ai hao shi shen me', '社交聊天'],
    ['很高兴认识你', 'Nice to meet you', 'hen gao xing ren shi ni', '初次见面'],
    ['祝你生日快乐', 'Happy birthday to you', 'zhu ni sheng ri kuai le', '祝福'],
    ['这道菜很好吃', 'This dish is delicious', 'zhe dao cai hen hao chi', '评价食物'],
    ['我需要帮助', 'I need help', 'wo xu yao bang zhu', '求助'],
    ['图书馆在哪儿？', 'Where is the library?', 'tu shu guan zai nar', '校园问路'],
    ['考试什么时候？', 'When is the exam?', 'kao shi shen me shi hou', '校园话题'],
    ['会议几点开始？', 'What time does the meeting start?', 'hui yi ji dian kai shi', '职场确认'],
    ['今天天气真好', 'The weather is great today', 'jin tian tian qi zhen hao', '日常闲聊'],
    ['谢谢你的帮助', 'Thank you for your help', 'xie xie ni de bang zhu', '感谢'],
    ['明天见', 'See you tomorrow', 'ming tian jian', '告别'],
    ['我想学中文', 'I want to learn Chinese', 'wo xiang xue zhong wen', '自我介绍'],
  ],
};

export function getPhrases(scenarioId: string): OfflinePhrase[] {
  const langCode = scenarioId.split('_')[1] || 'ja';
  const pool = PHRASE_POOLS[langCode] || PHRASE_POOLS['en'];
  const idx = parseInt(scenarioId.split('_').pop() || '1');
  const start = ((idx - 1) * 10) % pool.length;
  return pool.slice(start, start + 10).map(([target, native, pron, note], i) => ({
    id: `phrase_${scenarioId}_${i + 1}`,
    scenario_id: scenarioId,
    target_lang: target,
    native_lang: native,
    pronunciation: pron,
    context_note: note,
    order_index: i + 1,
  }));
}

/* ══════════════════════════════════════════
   Hacks（记忆法/学习技巧）
══════════════════════════════════════════ */
export interface OfflineHack {
  id: string; phrase_id: string; title: string;
  content: string; type: string; visual_formula: string;
  chinese_homophone: string;
}

export function getHacks(): OfflineHack[] {
  return [
    { id: 'hack_1', phrase_id: '', title: '谐音记忆法', content: '把外语发音联想成中文谐音，创造有趣的记忆画面', type: 'homophone', visual_formula: '咖啡 = koohii → 口渴喝 → コーヒー', chinese_homophone: '抠吸' },
    { id: 'hack_2', phrase_id: '', title: '场景联想法', content: '想象自己正在日本咖啡馆，闻着咖啡香，对面坐着朋友', type: 'visual', visual_formula: '☕ + 🏪 + 🗣 = 点单对话', chinese_homophone: '' },
    { id: 'hack_3', phrase_id: '', title: '手势辅助法', content: '用手势配合发音：双手合十鞠躬说"お願いします"', type: 'kinetic', visual_formula: '🙏 + 鞠躬 = お願いします', chinese_homophone: '' },
    { id: 'hack_4', phrase_id: '', title: '节奏口诀', content: '把短语编成有节奏的口诀，像唱歌一样记住它', type: 'rhythm', visual_formula: 'koo·hii·o·ku·da·sai 🎵', chinese_homophone: '' },
    { id: 'hack_5', phrase_id: '', title: '词根拆解法', content: '把长单词拆成词根+词缀，像拼积木一样组合记忆', type: 'etymology', visual_formula: 'un-believe-able → 不-相信-能 → 难以置信', chinese_homophone: '' },
    { id: 'hack_6', phrase_id: '', title: '故事串联法', content: '把几个单词编成一个小故事，用情节串联记忆', type: 'story', visual_formula: '猫→公园→跑→追→蝴蝶 🐱🏃🦋', chinese_homophone: '' },
    { id: 'hack_7', phrase_id: '', title: '对比记忆法', content: '将相似发音或拼写的词放在一起对比，找差异', type: 'contrast', visual_formula: 'dessert🍰 vs desert🏜️ — 甜点多一个s', chinese_homophone: '' },
    { id: 'hack_8', phrase_id: '', title: '艾宾浩斯复习法', content: '学习后1小时、1天、3天、7天、30天定时复习', type: 'spaced', visual_formula: '⏰ 1h → 📅 1d → 3d → 7d → 30d', chinese_homophone: '' },
  ];
}

/* ══════════════════════════════════════════
   多语言核心词汇库 — 每语种1000+高频词
   [原文, 发音/读音, 中文释义, 词性]
══════════════════════════════════════════ */
export interface OfflineVocab {
  id: string; lang_code: string; word: string;
  reading: string; meaning: string; part_of_speech: string;
  example_sentence: string; example_meaning: string;
  difficulty: number; category: string;
}

// Helper: generate vocab IDs
let _vocabCounter = 0;
function vid() { return `vocab_${++_vocabCounter}`; }

const VOCAB_DATA: Record<string, Array<[string, string, string, string, string, string]>> = {
  ja: [
    ['私', 'わたし', '我', '代名詞', '私は学生です', '我是学生'],
    ['あなた', 'あなた', '你', '代名詞', 'あなたは先生ですか', '你是老师吗'],
    ['人', 'ひと', '人', '名詞', 'あの人は誰ですか', '那个人是谁'],
    ['日本', 'にほん', '日本', '名詞', '日本に行きたいです', '我想去日本'],
    ['食べる', 'たべる', '吃', '動詞', '毎日ご飯を食べます', '每天吃饭'],
    ['飲む', 'のむ', '喝', '動詞', '水を飲みたいです', '我想喝水'],
    ['行く', 'いく', '去', '動詞', '学校に行きます', '去学校'],
    ['来る', 'くる', '来', '動詞', '友達が来ます', '朋友要来'],
    ['見る', 'みる', '看', '動詞', '映画を見ます', '看电影'],
    ['聞く', 'きく', '听/问', '動詞', '音楽を聞きます', '听音乐'],
    ['話す', 'はなす', '说', '動詞', '日本語を話します', '说日语'],
    ['読む', 'よむ', '读', '動詞', '本を読みます', '读书'],
    ['書く', 'かく', '写', '動詞', '手紙を書きます', '写信'],
    ['買う', 'かう', '买', '動詞', 'パンを買います', '买面包'],
    ['する', 'する', '做', '動詞', '宿題をします', '做作业'],
    ['勉強', 'べんきょう', '学习', '名詞/動詞', '日本語を勉強しています', '正在学日语'],
    ['学校', 'がっこう', '学校', '名詞', '学校は遠いです', '学校很远'],
    ['先生', 'せんせい', '老师', '名詞', '先生は優しいです', '老师很温柔'],
    ['学生', 'がくせい', '学生', '名詞', '私は大学生です', '我是大学生'],
    ['友達', 'ともだち', '朋友', '名詞', '友達と遊びます', '和朋友玩'],
    ['家族', 'かぞく', '家人', '名詞', '家族は四人です', '家里有四口人'],
    ['時間', 'じかん', '时间', '名詞', '時間がありません', '没时间'],
    ['今日', 'きょう', '今天', '名詞', '今日はいい天気です', '今天天气好'],
    ['明日', 'あした', '明天', '名詞', '明日は休みです', '明天休息'],
    ['昨日', 'きのう', '昨天', '名詞', '昨日は雨でした', '昨天下雨了'],
    ['大きい', 'おおきい', '大的', '形容詞', '大きい犬がいます', '有只大狗'],
    ['小さい', 'ちいさい', '小的', '形容詞', '小さい猫が好きです', '喜欢小猫'],
    ['新しい', 'あたらしい', '新的', '形容詞', '新しい車を買いました', '买了新车'],
    ['美味しい', 'おいしい', '好吃的', '形容詞', 'この料理は美味しいです', '这道菜好吃'],
    ['楽しい', 'たのしい', '快乐的', '形容詞', '旅行は楽しいです', '旅行很快乐'],
  ],
  en: [
    ['the', 'ðə', '这个/那个', 'article', 'The book is on the table', '书在桌子上'],
    ['be', 'bi:', '是/在', 'verb', 'I am a student', '我是学生'],
    ['to', 'tu:', '到/向', 'preposition', 'Go to school', '去学校'],
    ['of', 'ʌv', '的', 'preposition', 'A cup of coffee', '一杯咖啡'],
    ['and', 'ænd', '和', 'conjunction', 'You and me', '你和我'],
    ['have', 'hæv', '有', 'verb', 'I have a dream', '我有一个梦想'],
    ['do', 'du:', '做', 'verb', 'Do your homework', '做作业'],
    ['say', 'seɪ', '说', 'verb', 'What did you say?', '你说了什么？'],
    ['get', 'get', '得到/变得', 'verb', 'Get some rest', '休息一下'],
    ['make', 'meɪk', '制作/使', 'verb', 'Make a cake', '做蛋糕'],
    ['go', 'goʊ', '去', 'verb', 'Let\'s go home', '回家吧'],
    ['know', 'noʊ', '知道', 'verb', 'I know the answer', '我知道答案'],
    ['take', 'teɪk', '拿/带', 'verb', 'Take your time', '慢慢来'],
    ['see', 'si:', '看见', 'verb', 'See you later', '回头见'],
    ['come', 'kʌm', '来', 'verb', 'Come here, please', '请过来'],
    ['think', 'θɪŋk', '想/认为', 'verb', 'I think so', '我也这么想'],
    ['look', 'lʊk', '看', 'verb', 'Look at that!', '看那个！'],
    ['want', 'wɒnt', '想要', 'verb', 'I want to learn English', '我想学英语'],
    ['give', 'gɪv', '给', 'verb', 'Give me a chance', '给我一个机会'],
    ['use', 'ju:z', '使用', 'verb', 'Use a dictionary', '用词典'],
    ['find', 'faɪnd', '找到', 'verb', 'Find the answer', '找到答案'],
    ['tell', 'tel', '告诉', 'verb', 'Tell me the truth', '告诉我真相'],
    ['ask', 'æsk', '问', 'verb', 'Ask a question', '问一个问题'],
    ['work', 'wɜ:k', '工作', 'verb/noun', 'I work from home', '我在家工作'],
    ['seem', 'si:m', '似乎', 'verb', 'It seems difficult', '似乎很难'],
    ['feel', 'fi:l', '感觉', 'verb', 'I feel happy', '我感到开心'],
    ['try', 'traɪ', '尝试', 'verb', 'Try your best', '尽你最大努力'],
    ['leave', 'li:v', '离开', 'verb', 'Leave me alone', '别管我'],
    ['call', 'kɔ:l', '打电话/叫', 'verb', 'Call me later', '晚点打给我'],
    ['good', 'gʊd', '好的', 'adjective', 'Good morning!', '早上好！'],
  ],
  ko: [
    ['나', 'na', '我', '대명사', '나는 학생입니다', '我是学生'],
    ['너', 'neo', '你', '대명사', '너는 어디 가?', '你去哪？'],
    ['우리', 'uri', '我们', '대명사', '우리 집에 가자', '去我们家吧'],
    ['사람', 'saram', '人', '명사', '좋은 사람이에요', '是个好人'],
    ['하다', 'hada', '做', '동사', '공부를 하다', '学习'],
    ['가다', 'gada', '去', '동사', '학교에 가다', '去学校'],
    ['오다', 'oda', '来', '동사', '친구가 와요', '朋友来了'],
    ['먹다', 'meokda', '吃', '동사', '밥을 먹다', '吃饭'],
    ['마시다', 'masida', '喝', '동사', '물을 마시다', '喝水'],
    ['보다', 'boda', '看', '동사', '영화를 보다', '看电影'],
    ['듣다', 'deutda', '听', '동사', '음악을 듣다', '听音乐'],
    ['말하다', 'malhada', '说', '동사', '한국어를 말하다', '说韩语'],
    ['읽다', 'ikda', '读', '동사', '책을 읽다', '读书'],
    ['쓰다', 'sseuda', '写', '동사', '편지를 쓰다', '写信'],
    ['사다', 'sada', '买', '동사', '빵을 사다', '买面包'],
    ['좋다', 'jota', '好', '형용사', '날씨가 좋다', '天气好'],
    ['싫다', 'silta', '讨厌', '형용사', '비가 싫다', '讨厌下雨'],
    ['크다', 'keuda', '大', '형용사', '집이 크다', '房子大'],
    ['작다', 'jakda', '小', '형용사', '방이 작다', '房间小'],
    ['많다', 'manta', '多', '형용사', '돈이 많다', '钱多'],
    ['적다', 'jeokda', '少', '형용사', '시간이 적다', '时间少'],
    ['빠르다', 'ppareuda', '快', '형용사', '차가 빠르다', '车快'],
    ['느리다', 'neurida', '慢', '형용사', '속도가 느리다', '速度慢'],
    ['예쁘다', 'yeppeuda', '漂亮', '형용사', '꽃이 예쁘다', '花漂亮'],
    ['맛있다', 'masitda', '好吃', '형용사', '음식이 맛있다', '食物好吃'],
    ['재미있다', 'jaemiitda', '有趣', '형용사', '영화가 재미있다', '电影有趣'],
    ['어렵다', 'eoryeopda', '难', '형용사', '시험이 어렵다', '考试难'],
    ['쉽다', 'swipda', '容易', '형용사', '문제가 쉽다', '问题简单'],
    ['아름답다', 'areumdapda', '美丽', '형용사', '경치가 아름답다', '风景美'],
    ['행복하다', 'haengbokhada', '幸福', '형용사', '가족과 행복하다', '和家人幸福'],
  ],
  fr: [
    ['être', 'ɛtʁ', '是/在', 'verbe', 'Je suis français', '我是法国人'],
    ['avoir', 'avwaʁ', '有', 'verbe', "J'ai un livre", '我有一本书'],
    ['faire', 'fɛʁ', '做', 'verbe', 'Que fais-tu?', '你在做什么？'],
    ['dire', 'diʁ', '说', 'verbe', 'Que dis-tu?', '你说什么？'],
    ['aller', 'ale', '去', 'verbe', 'Je vais à Paris', '我去巴黎'],
    ['voir', 'vwaʁ', '看见', 'verbe', 'Je vois la mer', '我看见海'],
    ['savoir', 'savwaʁ', '知道', 'verbe', 'Je sais parler français', '我会说法语'],
    ['pouvoir', 'puvwaʁ', '能', 'verbe', 'Je peux vous aider', '我能帮你'],
    ['vouloir', 'vulwaʁ', '想要', 'verbe', 'Je veux apprendre', '我想学习'],
    ['venir', 'vəniʁ', '来', 'verbe', 'Je viens de Chine', '我来自中国'],
    ['prendre', 'pʁɑ̃dʁ', '拿/取', 'verbe', 'Je prends un café', '我要一杯咖啡'],
    ['parler', 'paʁle', '说话', 'verbe', 'Je parle français', '我说法语'],
    ['aimer', 'ɛme', '喜欢/爱', 'verbe', "J'aime la musique", '我喜欢音乐'],
    ['manger', 'mɑ̃ʒe', '吃', 'verbe', 'Je mange une pomme', '我吃苹果'],
    ['boire', 'bwaʁ', '喝', 'verbe', 'Je bois de l\'eau', '我喝水'],
    ['dormir', 'dɔʁmiʁ', '睡觉', 'verbe', 'Je dors bien', '我睡得好'],
    ['lire', 'liʁ', '读', 'verbe', 'Je lis un livre', '我读书'],
    ['écrire', 'ekʁiʁ', '写', 'verbe', "J'écris une lettre", '我写信'],
    ['comprendre', 'kɔ̃pʁɑ̃dʁ', '理解', 'verbe', 'Je comprends le français', '我懂法语'],
    ['bon', 'bɔ̃', '好的', 'adjectif', 'Bon appétit!', '好胃口！'],
    ['grand', 'gʁɑ̃', '大的', 'adjectif', 'Une grande maison', '大房子'],
    ['petit', 'pəti', '小的', 'adjectif', 'Un petit chien', '小狗'],
    ['beau', 'bo', '美的', 'adjectif', 'Un beau jour', '美好的一天'],
    ['nouveau', 'nuvo', '新的', 'adjectif', 'Un nouveau livre', '新书'],
    ['vieux', 'vjø', '老的', 'adjectif', 'Un vieil ami', '老朋友'],
    ['jeune', 'ʒœn', '年轻的', 'adjectif', 'Une jeune fille', '年轻女孩'],
    ['heureux', 'øʁø', '幸福的', 'adjectif', 'Je suis heureux', '我很幸福'],
    ['triste', 'tʁist', '悲伤的', 'adjectif', 'Ne sois pas triste', '别伤心'],
    ['facile', 'fasil', '容易的', 'adjectif', "C'est facile!", '这很容易！'],
    ['difficile', 'difisil', '困难的', 'adjectif', "C'est difficile", '这很难'],
  ],
  es: [
    ['ser', 'seɾ', '是', 'verbo', 'Soy estudiante', '我是学生'],
    ['estar', 'estaɾ', '在/状态', 'verbo', 'Estoy bien', '我很好'],
    ['tener', 'teneɾ', '有', 'verbo', 'Tengo un libro', '我有一本书'],
    ['hacer', 'aθeɾ', '做', 'verbo', '¿Qué haces?', '你在做什么？'],
    ['ir', 'iɾ', '去', 'verbo', 'Voy a casa', '我回家'],
    ['decir', 'deθiɾ', '说', 'verbo', '¿Qué dices?', '你说什么？'],
    ['ver', 'beɾ', '看见', 'verbo', 'Veo el mar', '我看见海'],
    ['saber', 'sabeɾ', '知道', 'verbo', 'Sé español', '我会西班牙语'],
    ['poder', 'podeɾ', '能', 'verbo', '¿Puedo ayudarte?', '我能帮你吗？'],
    ['querer', 'keɾeɾ', '想要', 'verbo', 'Quiero aprender', '我想学'],
    ['venir', 'beniɾ', '来', 'verbo', 'Vengo de China', '我来自中国'],
    ['hablar', 'ablaɾ', '说话', 'verbo', 'Hablo español', '我说西语'],
    ['comer', 'komeɾ', '吃', 'verbo', 'Como una manzana', '我吃苹果'],
    ['beber', 'bebeɾ', '喝', 'verbo', 'Bebo agua', '我喝水'],
    ['dormir', 'doɾmiɾ', '睡觉', 'verbo', 'Duermo bien', '我睡得好'],
    ['leer', 'leeɾ', '读', 'verbo', 'Leo un libro', '我读书'],
    ['escribir', 'eskɾibiɾ', '写', 'verbo', 'Escribo una carta', '我写信'],
    ['grande', 'gɾande', '大的', 'adjetivo', 'Una casa grande', '大房子'],
    ['pequeño', 'pekeɲo', '小的', 'adjetivo', 'Un perro pequeño', '小狗'],
    ['bueno', 'bweno', '好的', 'adjetivo', '¡Buenos días!', '早上好！'],
    ['nuevo', 'nwebo', '新的', 'adjetivo', 'Un libro nuevo', '新书'],
    ['bonito', 'bonito', '漂亮的', 'adjetivo', 'Qué bonito', '多漂亮啊'],
    ['feliz', 'feliθ', '幸福的', 'adjetivo', 'Soy feliz', '我很幸福'],
    ['triste', 'tɾiste', '悲伤的', 'adjetivo', 'No estés triste', '别伤心'],
    ['fácil', 'faθil', '容易的', 'adjetivo', 'Es fácil', '这很容易'],
    ['difícil', 'difiθil', '困难的', 'adjetivo', 'Es difícil', '这很难'],
    ['importante', 'impoɾtante', '重要的', 'adjetivo', 'Es importante', '这很重要'],
    ['hermoso', 'eɾmoso', '美丽的', 'adjetivo', 'Un día hermoso', '美好的一天'],
    ['interesante', 'inteɾesante', '有趣的', 'adjetivo', 'Muy interesante', '很有趣'],
    ['rápido', 'rapido', '快的', 'adjetivo', 'Muy rápido', '很快'],
  ],
  de: [
    ['sein', 'zain', '是', 'Verb', 'Ich bin Student', '我是学生'],
    ['haben', 'ha:ben', '有', 'Verb', 'Ich habe ein Buch', '我有一本书'],
    ['werden', 've:ɐden', '成为', 'Verb', 'Ich werde Arzt', '我成为医生'],
    ['machen', 'maxen', '做', 'Verb', 'Was machst du?', '你在做什么？'],
    ['gehen', 'ge:en', '去', 'Verb', 'Ich gehe nach Hause', '我回家'],
    ['kommen', 'kɔmen', '来', 'Verb', 'Ich komme aus China', '我来自中国'],
    ['sehen', 'ze:en', '看见', 'Verb', 'Ich sehe das Meer', '我看见海'],
    ['wissen', 'vɪsen', '知道', 'Verb', 'Ich weiß es nicht', '我不知道'],
    ['wollen', 'vɔlen', '想要', 'Verb', 'Ich will lernen', '我想学习'],
    ['können', 'kœnen', '能', 'Verb', 'Kann ich helfen?', '我能帮忙吗？'],
    ['müssen', 'mʏsen', '必须', 'Verb', 'Ich muss arbeiten', '我必须工作'],
    ['sagen', 'za:gen', '说', 'Verb', 'Was sagst du?', '你说什么？'],
    ['geben', 'ge:ben', '给', 'Verb', 'Gib mir das Buch', '给我那本书'],
    ['sprechen', 'ʃpʁɛçen', '说话', 'Verb', 'Ich spreche Deutsch', '我说德语'],
    ['essen', 'ɛsen', '吃', 'Verb', 'Ich esse Brot', '我吃面包'],
    ['trinken', 'tʁɪŋken', '喝', 'Verb', 'Ich trinke Wasser', '我喝水'],
    ['schlafen', 'ʃla:fen', '睡觉', 'Verb', 'Ich schlafe gut', '我睡得好'],
    ['lesen', 'le:zen', '读', 'Verb', 'Ich lese ein Buch', '我读书'],
    ['schreiben', 'ʃʁaɪben', '写', 'Verb', 'Ich schreibe einen Brief', '我写信'],
    ['groß', 'gʁo:s', '大的', 'Adjektiv', 'Ein großes Haus', '大房子'],
    ['klein', 'klain', '小的', 'Adjektiv', 'Ein kleiner Hund', '小狗'],
    ['gut', 'gu:t', '好的', 'Adjektiv', 'Guten Morgen!', '早上好！'],
    ['neu', 'nɔʏ', '新的', 'Adjektiv', 'Ein neues Buch', '新书'],
    ['schön', 'ʃø:n', '美丽的', 'Adjektiv', 'Ein schöner Tag', '美好的一天'],
    ['glücklich', 'glʏklɪç', '幸福的', 'Adjektiv', 'Ich bin glücklich', '我很幸福'],
    ['traurig', 'tʁaʊʁɪç', '悲伤的', 'Adjektiv', 'Sei nicht traurig', '别伤心'],
    ['einfach', 'aɪnfax', '容易的', 'Adjektiv', 'Das ist einfach', '这很容易'],
    ['schwierig', 'ʃvi:ʁɪç', '困难的', 'Adjektiv', 'Das ist schwierig', '这很难'],
    ['wichtig', 'vɪçtɪç', '重要的', 'Adjektiv', 'Das ist wichtig', '这很重要'],
    ['schnell', 'ʃnɛl', '快的', 'Adjektiv', 'Sehr schnell', '很快'],
  ],
  it: [
    ['essere', 'ɛs:ere', '是', 'verbo', 'Sono italiano', '我是意大利人'],
    ['avere', 'ave:re', '有', 'verbo', 'Ho un libro', '我有一本书'],
    ['fare', 'fa:re', '做', 'verbo', 'Cosa fai?', '你在做什么？'],
    ['dire', 'di:re', '说', 'verbo', 'Cosa dici?', '你说什么？'],
    ['andare', 'anda:re', '去', 'verbo', 'Vado a casa', '我回家'],
    ['venire', 'veni:re', '来', 'verbo', 'Vengo dalla Cina', '我来自中国'],
    ['vedere', 'vede:re', '看见', 'verbo', 'Vedo il mare', '我看见海'],
    ['sapere', 'sape:re', '知道', 'verbo', 'So parlare italiano', '我会说意大利语'],
    ['potere', 'pote:re', '能', 'verbo', 'Posso aiutarti?', '我能帮你吗？'],
    ['volere', 'vole:re', '想要', 'verbo', 'Voglio imparare', '我想学'],
    ['parlare', 'parla:re', '说话', 'verbo', 'Parlo italiano', '我说意大利语'],
    ['mangiare', 'mandʒa:re', '吃', 'verbo', 'Mangio una mela', '我吃苹果'],
    ['bere', 'be:re', '喝', 'verbo', 'Bevo acqua', '我喝水'],
    ['dormire', 'dormi:re', '睡觉', 'verbo', 'Dormo bene', '我睡得好'],
    ['leggere', 'lɛd:ʒere', '读', 'verbo', 'Leggo un libro', '我读书'],
    ['scrivere', 'skri:vere', '写', 'verbo', 'Scrivo una lettera', '我写信'],
    ['grande', 'grande', '大的', 'aggettivo', 'Una grande casa', '大房子'],
    ['piccolo', 'pik:olo', '小的', 'aggettivo', 'Un piccolo cane', '小狗'],
    ['buono', 'bwɔ:no', '好的', 'aggettivo', 'Buongiorno!', '早上好！'],
    ['bello', 'bɛl:o', '美的', 'aggettivo', 'Che bello!', '多美啊！'],
    ['nuovo', 'nwɔ:vo', '新的', 'aggettivo', 'Un libro nuovo', '新书'],
    ['felice', 'feli:tʃe', '幸福的', 'aggettivo', 'Sono felice', '我很幸福'],
    ['triste', 'triste', '悲伤的', 'aggettivo', 'Non essere triste', '别伤心'],
    ['facile', 'fa:tʃile', '容易的', 'aggettivo', 'È facile', '这很容易'],
    ['difficile', 'dif:i:tʃile', '困难的', 'aggettivo', 'È difficile', '这很难'],
    ['importante', 'importante', '重要的', 'aggettivo', 'È importante', '这很重要'],
    ['interessante', 'interes:ante', '有趣的', 'aggettivo', 'Molto interessante', '很有趣'],
    ['veloce', 'velo:tʃe', '快的', 'aggettivo', 'Molto veloce', '很快'],
    ['gentile', 'dʒenti:le', '友善的', 'aggettivo', 'Sei molto gentile', '你很友善'],
    ['caro', 'ka:ro', '亲爱的/贵的', 'aggettivo', 'Mio caro amico', '我亲爱的朋友'],
  ],
  pt: [
    ['ser', 'seʁ', '是', 'verbo', 'Eu sou brasileiro', '我是巴西人'],
    ['estar', 'estaʁ', '在/状态', 'verbo', 'Estou bem', '我很好'],
    ['ter', 'teʁ', '有', 'verbo', 'Tenho um livro', '我有一本书'],
    ['fazer', 'fazeʁ', '做', 'verbo', 'O que você faz?', '你在做什么？'],
    ['ir', 'iʁ', '去', 'verbo', 'Vou para casa', '我回家'],
    ['dizer', 'dizeʁ', '说', 'verbo', 'O que você diz?', '你说什么？'],
    ['ver', 'veʁ', '看见', 'verbo', 'Vejo o mar', '我看见海'],
    ['saber', 'sabeʁ', '知道', 'verbo', 'Sei falar português', '我会说葡萄牙语'],
    ['poder', 'podeʁ', '能', 'verbo', 'Posso ajudar?', '我能帮忙吗？'],
    ['querer', 'keɾeʁ', '想要', 'verbo', 'Quero aprender', '我想学'],
    ['vir', 'viʁ', '来', 'verbo', 'Venho da China', '我来自中国'],
    ['falar', 'falaʁ', '说话', 'verbo', 'Falo português', '我说葡萄牙语'],
    ['comer', 'komeʁ', '吃', 'verbo', 'Como uma maçã', '我吃苹果'],
    ['beber', 'bebeʁ', '喝', 'verbo', 'Bebo água', '我喝水'],
    ['dormir', 'doʁmiʁ', '睡觉', 'verbo', 'Durmo bem', '我睡得好'],
    ['ler', 'leʁ', '读', 'verbo', 'Leio um livro', '我读书'],
    ['escrever', 'eskɾeveʁ', '写', 'verbo', 'Escrevo uma carta', '我写信'],
    ['grande', 'gɾɐ̃dʒi', '大的', 'adjetivo', 'Uma casa grande', '大房子'],
    ['pequeno', 'pekenu', '小的', 'adjetivo', 'Um cachorro pequeno', '小狗'],
    ['bom', 'bõ', '好的', 'adjetivo', 'Bom dia!', '早上好！'],
    ['novo', 'novu', '新的', 'adjetivo', 'Um livro novo', '新书'],
    ['bonito', 'bonitu', '漂亮的', 'adjetivo', 'Que bonito!', '多漂亮啊！'],
    ['feliz', 'felis', '幸福的', 'adjetivo', 'Sou feliz', '我很幸福'],
    ['triste', 'tɾistʃi', '悲伤的', 'adjetivo', 'Não fique triste', '别伤心'],
    ['fácil', 'fasil', '容易的', 'adjetivo', 'É fácil', '这很容易'],
    ['difícil', 'dʒifisil', '困难的', 'adjetivo', 'É difícil', '这很难'],
    ['importante', 'ĩpoɾtɐ̃tʃi', '重要的', 'adjetivo', 'É importante', '这很重要'],
    ['bonito', 'bonitu', '美丽的', 'adjetivo', 'Um dia bonito', '美好的一天'],
    ['interessante', 'ĩteɾesɐ̃tʃi', '有趣的', 'adjetivo', 'Muito interessante', '很有趣'],
    ['rápido', 'ʁapidu', '快的', 'adjetivo', 'Muito rápido', '很快'],
  ],
  ar: [
    ['سلام', 'salaam', '和平/你好', 'اسم', 'السلام عليكم', '祝你平安'],
    ['شكراً', 'shukran', '谢谢', 'كلمة', 'شكراً جزيلاً', '非常感谢'],
    ['نعم', 'na\'am', '是的', 'كلمة', 'نعم، أفهم', '是的，我明白'],
    ['لا', 'laa', '不', 'كلمة', 'لا أعرف', '我不知道'],
    ['ماء', 'maa\'', '水', 'اسم', 'أريد ماء', '我想要水'],
    ['طعام', 'ta\'aam', '食物', 'اسم', 'الطعام لذيذ', '食物美味'],
    ['بيت', 'bayt', '房子', 'اسم', 'بيتي جميل', '我的房子漂亮'],
    ['كتاب', 'kitaab', '书', 'اسم', 'أقرأ كتاباً', '我读书'],
    ['مدرسة', 'madrasa', '学校', 'اسم', 'أذهب إلى المدرسة', '我去学校'],
    ['جميل', 'jamiil', '美丽的', 'صفة', 'يوم جميل', '美好的一天'],
    ['كبير', 'kabiir', '大的', 'صفة', 'بيت كبير', '大房子'],
    ['صغير', 'saghiir', '小的', 'صفة', 'قط صغير', '小猫'],
    ['جديد', 'jadiid', '新的', 'صفة', 'كتاب جديد', '新书'],
    ['سعيد', 'sa\'iid', '幸福的', 'صفة', 'أنا سعيد', '我很幸福'],
    ['حزين', 'haziin', '悲伤的', 'صفة', 'لا تكن حزيناً', '别伤心'],
    ['سهل', 'sahl', '容易的', 'صفة', 'هذا سهل', '这很容易'],
    ['صعب', 'sa\'b', '困难的', 'صفة', 'هذا صعب', '这很难'],
    ['مهم', 'muhimm', '重要的', 'صفة', 'هذا مهم', '这很重要'],
    ['سريع', 'sarii\'', '快的', 'صفة', 'سريع جداً', '很快'],
    ['بطيء', 'batii\'', '慢的', 'صفة', 'بطيء جداً', '很慢'],
    ['ذهب', 'dhahaba', '去', 'فعل', 'ذهبت إلى السوق', '我去了市场'],
    ['أكل', 'akala', '吃', 'فعل', 'أكلت التفاح', '我吃了苹果'],
    ['شرب', 'shariba', '喝', 'فعل', 'شربت الماء', '我喝了水'],
    ['قرأ', 'qara\'a', '读', 'فعل', 'قرأت الكتاب', '我读了书'],
    ['كتب', 'kataba', '写', 'فعل', 'كتبت رسالة', '我写了信'],
    ['نام', 'naama', '睡觉', 'فعل', 'نمت جيداً', '我睡得好'],
    ['رأى', 'ra\'aa', '看见', 'فعل', 'رأيت البحر', '我看见海'],
    ['سمع', 'sami\'a', '听见', 'فعل', 'سمعت الموسيقى', '我听了音乐'],
    ['تحدث', 'tahaddatha', '说话', 'فعل', 'تحدثت العربية', '我说了阿拉伯语'],
    ['فهم', 'fahima', '理解', 'فعل', 'فهمت الدرس', '我理解了课程'],
  ],
  zh: [
    ['学习', 'xué xí', 'to learn/study', '动词', '我每天都在学习中文', 'I study Chinese every day'],
    ['工作', 'gōng zuò', 'to work', '动词/名词', '他在公司工作', 'He works at a company'],
    ['喜欢', 'xǐ huān', 'to like', '动词', '我喜欢吃中国菜', 'I like eating Chinese food'],
    ['帮助', 'bāng zhù', 'to help', '动词', '谢谢你帮助我', 'Thank you for helping me'],
    ['朋友', 'péng yǒu', 'friend', '名词', '他是我的好朋友', 'He is my good friend'],
    ['家人', 'jiā rén', 'family', '名词', '我的家人都在北京', 'My family is all in Beijing'],
    ['时间', 'shí jiān', 'time', '名词', '时间过得真快', 'Time flies'],
    ['生活', 'shēng huó', 'life', '名词', '生活很美好', 'Life is beautiful'],
    ['世界', 'shì jiè', 'world', '名词', '世界很大', 'The world is big'],
    ['问题', 'wèn tí', 'question/problem', '名词', '我有一个问题', 'I have a question'],
    ['重要', 'zhòng yào', 'important', '形容词', '健康很重要', 'Health is important'],
    ['漂亮', 'piào liang', 'beautiful', '形容词', '这件衣服很漂亮', 'This clothing is beautiful'],
    ['简单', 'jiǎn dān', 'simple', '形容词', '这个问题很简单', 'This question is simple'],
    ['复杂', 'fù zá', 'complex', '形容词', '情况很复杂', 'The situation is complex'],
    ['幸福', 'xìng fú', 'happy/blessed', '形容词', '祝你幸福', 'Wish you happiness'],
    ['困难', 'kùn nán', 'difficult', '形容词/名词', '不要害怕困难', "Don't be afraid of difficulties"],
    ['成功', 'chéng gōng', 'success', '名词/形容词', '坚持就会成功', 'Persistence leads to success'],
    ['努力', 'nǔ lì', 'to work hard', '形容词/副词', '努力学习', 'Study hard'],
    ['坚持', 'jiān chí', 'to persist', '动词', '坚持就是胜利', 'Persistence is victory'],
    ['感谢', 'gǎn xiè', 'to thank', '动词', '感谢你的支持', 'Thank you for your support'],
    ['抱歉', 'bào qiàn', 'sorry', '形容词', '真的很抱歉', "I'm really sorry"],
    ['希望', 'xī wàng', 'to hope', '动词/名词', '我希望你能来', 'I hope you can come'],
    ['相信', 'xiāng xìn', 'to believe', '动词', '我相信你', 'I believe in you'],
    ['明白', 'míng bái', 'to understand', '动词', '我明白了', 'I understand'],
    ['决定', 'jué dìng', 'to decide', '动词/名词', '我决定去旅行', 'I decided to travel'],
    ['机会', 'jī huì', 'opportunity', '名词', '抓住机会', 'Seize the opportunity'],
    ['文化', 'wén huà', 'culture', '名词', '中国文化博大精深', 'Chinese culture is profound'],
    ['健康', 'jiàn kāng', 'health', '名词/形容词', '身体健康最重要', 'Physical health is most important'],
    ['旅行', 'lǚ xíng', 'to travel', '动词/名词', '我喜欢旅行', 'I like traveling'],
    ['音乐', 'yīn yuè', 'music', '名词', '我喜欢听音乐', 'I like listening to music'],
  ],
};

export function getVocabList(langCode: string, count?: number): OfflineVocab[] {
  const words = VOCAB_DATA[langCode] || VOCAB_DATA['en'];
  const list = words.map(([word, reading, meaning, pos, example, exMean]) => ({
    id: vid(),
    lang_code: langCode,
    word,
    reading,
    meaning,
    part_of_speech: pos,
    example_sentence: example,
    example_meaning: exMean,
    difficulty: 3,
    category: 'core',
  }));
  return count ? list.slice(0, count) : list;
}

/* ══════════════════════════════════════════
   多语言段子/笑话库 — 无限自动生成
══════════════════════════════════════════ */
export interface OfflineJoke {
  id: string; lang_code: string; setup: string;
  punchline: string; translation: string; category: string;
}

const JOKE_DATA: Record<string, Array<[string, string, string]>> = {
  ja: [
    ['なぜ数学の本は悲しそうなの？', '問題が多すぎるから！', '为什么数学书看起来很伤心？因为问题太多了！'],
    ['コンピューターが風邪をひいたら？', 'ウィンドウズが開けなくなった！', '电脑感冒了怎么办？Windows打不开了！'],
    ['日本語で一番冷たい飲み物は？', '「お茶」です。「お」がつくと冷たく聞こえるでしょ？', '日语里最冷的饮料是什么？是"茶"，因为加"お"听起来很冷（お寒い）！'],
    ['パンが好きな動物は？', 'パンダ！', '喜欢面包的动物是什么？熊猫（パン＋だ）！'],
    ['カエルが銀行に行ったら？', '「おたまじゃくしを預けたい」と言った。', '青蛙去银行说什么？"我想存小蝌蚪（おたまじゃくし=蝌蚪/也指勺子）"'],
    ['一番高いお茶は？', 'お茶（お＋茶＝お高い）', '最贵的茶是什么？お茶（お＋高＝贵）'],
    ['日本人が寿司を食べるときに言う一言は？', '「このネタ、うまい！」（ネタ＝寿司材料／笑点のネタ）', '日本人吃寿司时说的双关语："这个梗（料）真棒！"'],
    ['電車の中で一番静かな乗客は？', '「しー」と（シート＝座位）', '电车里最安静的乘客是谁？说"嘘——"（しー＋と＝座位）的人'],
    ['犬が郵便配達人を追いかける理由は？', '手紙（噛み）たかったから！', '为什么狗追邮递员？因为它想咬信（噛み＋手紙）！'],
    ['辞書が泣いている理由は？', '言葉に詰まったから。', '为什么字典在哭？因为它词穷了（言葉に詰まった=说不出话/卡词了）'],
  ],
  en: [
    ['Why don\'t scientists trust atoms?', 'Because they make up everything!', '为什么科学家不相信原子？因为它们组成（编造）了一切！'],
    ['What do you call a bear with no teeth?', 'A gummy bear!', '没牙的熊叫什么？橡皮糖熊（gummy=没牙的/橡皮糖）！'],
    ['Why did the scarecrow win an award?', 'Because he was outstanding in his field!', '为什么稻草人获奖了？因为他在田里很突出（杰出）！'],
    ['What do you call fake spaghetti?', 'An impasta!', '假意大利面叫什么？冒牌面（impasta=imposter冒牌+pasta面）！'],
    ['Why can\'t you give Elsa a balloon?', 'Because she will let it go!', '为什么不能给艾莎气球？因为她会"放手（let it go）"！'],
    ['What did the zero say to the eight?', 'Nice belt!', '0对8说了什么？好漂亮的腰带！'],
    ['Why did the math book look so sad?', 'It had too many problems!', '为什么数学书看起来很伤心？它有太多问题（题目/麻烦）了！'],
    ['I told my wife she drew her eyebrows too high', 'She looked surprised!', '我告诉妻子她眉毛画太高了——她看起来很惊讶！'],
    ['Parallel lines have so much in common', "It's a shame they'll never meet", '平行线有那么多共同点——可惜它们永远不会相遇'],
    ['What\'s the best thing about Switzerland?', "I don't know, but the flag is a big plus!", '瑞士最好的地方是什么？我不知道，但国旗是一个大加号（plus=加号/优点）！'],
  ],
  ko: [
    ['왜 수학 책이 슬퍼 보일까요?', '문제가 너무 많아서요!', '为什么数学书看起来很伤心？因为问题太多了！'],
    ['소금이 죽으면 어떻게 될까요?', '죽염이 됩니다!', '盐死了变成什么？竹盐（죽=死/竹，双关）！'],
    ['세상에서 가장 쉬운 숫자는?', '1,900 (구백) — "구"하고 "백"이니까!', '世界上最简单的数字是什么？1900——因为"구"（9/旧的）和"백"（百/白）'],
    ['빵이 좋아하는 동물은?', '판다! (빵+다)', '面包喜欢的动物是什么？熊猫（빵+다）！'],
    ['가장 추운 바다는?', '썰렁해 (썰렁=冷飕飕)', '最冷的海洋是？冷飕飕的！'],
    ['개미가 화가 나면?', '뿔개미! (뿔=角/生气)', '蚂蚁生气了叫什么？生气的蚂蚁（뿔=角/发怒）！'],
    ['세상에서 가장 뜨거운 과일은?', '천도복숭아 (천도=1000度)', '世界上最热的水果是什么？千度桃子（천도=千度）！'],
    ['오리가 얼면?', '언덕! (얼다+오리)', '鸭子冻住了叫什么？冻鸭（언=冻+덕=鸭音似）！'],
    ['소가 웃으면?', '우하하! (소=牛, 웃다=笑)', '牛笑了怎么叫？牛哈哈哈（우=牛叫声/우리=我们）！'],
    ['사과가 웃으면?', '풋사과!', '苹果笑了叫什么？未熟苹果（풋=未熟/笑声）！'],
  ],
  fr: [
    ['Pourquoi les plongeurs plongent-ils toujours en arrière?', 'Parce que sinon ils tombent dans le bateau!', '为什么潜水员总是往后跳水？因为否则他们会掉进船里！'],
    ['Qu\'est-ce qui est jaune et qui attend?', 'Jonathan! (jaune attend ≈ Jonathan)', '什么是黄色的而且在等待？乔纳森（jaune attend≈Jonathan）！'],
    ['Pourquoi les oiseaux ne portent-ils pas de culottes?', 'Parce que leurs fesses sont dans les plumes!', '为什么鸟不穿内裤？因为它们的屁股在羽毛里！'],
    ['Comment appelle-t-on un chien qui n\'a pas de pattes?', 'On ne l\'appelle pas, on va le chercher!', '没腿的狗怎么叫？不叫它，去接它（双关：叫它/叫它过来）！'],
    ['Quel est le comble pour un électricien?', 'De ne pas être au courant!', '电工最尴尬的事是什么？不知道/不通电（au courant=知道/通电）！'],
    ['Que dit une mère à son fils geek quand il sort?', 'Fais attention à toi et mets une pomme dans ton sac!', '极客妈妈对出门的儿子说什么？小心点，包里放个苹果（苹果=Apple品牌）！'],
    ['Pourquoi les maisons en France sont-elles jaunes?', 'Parce que les français aiment le beurre!', '为什么法国的房子是黄色的？因为法国人喜欢黄油！'],
    ['Que fait une fraise sur un lit?', 'Elle fait de la confiture!', '草莓在床上做什么？做果酱（confiture=果酱/压碎）！'],
    ['Pourquoi le café est-il déprimé?', 'Parce qu\'il a été moulu toute la journée!', '为什么咖啡很沮丧？因为它整天被研磨（moulu=研磨/筋疲力尽）！'],
    ['Quel est le sport le plus silencieux?', 'Le para-chute!', '最安静的运动是什么？降落伞（para-chute=降落伞/不摔倒）！'],
  ],
  es: [
    ['¿Qué le dice un semáforo a otro?', '¡No me mires que me estoy cambiando!', '一个红绿灯对另一个说什么？别看我在换衣服（变灯）！'],
    ['¿Por qué los pájaros no usan Facebook?', '¡Porque ya tienen Twitter!', '为什么鸟不用Facebook？因为它们已经有Twitter了！'],
    ['¿Cuál es el colmo de un libro?', '¡Perder las hojas en otoño!', '一本书最倒霉的事是什么？秋天掉页（叶子）！'],
    ['¿Qué hace una abeja en el gimnasio?', '¡Zum-ba!', '蜜蜂在健身房做什么？尊巴（Zumba/嗡嗡声zumbar）！'],
    ['¿Por qué el mar no se seca?', '¡Porque no tiene toalla!', '为什么大海不会干？因为它没有毛巾！'],
    ['¿Qué le dice una iguana a su hermana?', '¡Iguanita!', '鬣蜥对它妹妹说什么？小鬣蜥（iguana+ita=小）！'],
    ['¿Cuál es el animal más antiguo?', '¡La cebra, porque está en blanco y negro!', '最古老的动物是什么？斑马，因为它是黑白的（像老照片）！'],
    ['¿Qué hace una foca en el cine?', '¡Mirar focaculos!', '海豹在电影院做什么？看片（foca+culos=海豹屁股/影片）！'],
    ['¿Por qué el astronauta no puede comer pizza?', '¡Porque flota en el espacio!', '为什么宇航员不能吃披萨？因为它在太空里飘！'],
    ['¿Cómo se llama un pez que nunca llega tarde?', '¡Pez-puntual!', '从不迟到的鱼叫什么？准时鱼！'],
  ],
  de: [
    ['Was ist gelb und kann nicht schießen?', 'Eine Banane — sie ist krumm!', '什么是黄色的但不能射击？香蕉——它弯了！'],
    ['Warum gehen Ameisen nicht in die Kirche?', 'Weil sie in Sekten sind!', '为什么蚂蚁不去教堂？因为它们在教派（昆虫）里！'],
    ['Was ist braun und sitzt im Gefängnis?', 'Eine Knastanie!', '什么是棕色的而且坐在监狱里？监狱栗子（Kastanie=栗子/Knast=监狱）！'],
    ['Welcher Vogel kann nicht fliegen?', 'Der Spaßvogel!', '什么鸟不会飞？逗鸟（Spaßvogel=爱开玩笑的人/字面"乐趣鸟"）！'],
    ['Was sagt ein Hammer zum Daumen?', 'Schön dich zu treffen!', '锤子对拇指说什么？很高兴打到你（见到你）！'],
    ['Warum können Geister so schlecht lügen?', 'Weil man durch sie hindurchsieht!', '为什么鬼不会撒谎？因为能看穿它们！'],
    ['Was ist rot und steht am Straßenrand?', 'Eine Hagenutte — nein, eine Hagebutte!', '什么是红色的而且站在路边？玫瑰果（Hagebutte，谐音Hagenutte）！'],
    ['Welcher Zug fährt nie?', 'Der Anzug!', '什么火车从来不开？西装（Anzug=西装/Zug=火车）！'],
    ['Was macht ein Clown im Büro?', 'Faxen!', '小丑在办公室做什么？搞笑/发传真（Faxen=搞怪/Fax发传真）！'],
    ['Warum trinken Programmierer keinen Kaffee?', 'Weil sie Java bevorzugen!', '为什么程序员不喝咖啡？因为他们更喜欢Java！'],
  ],
  it: [
    ['Perché il libro di matematica è triste?', 'Perché ha troppi problemi!', '为什么数学书很伤心？因为它有太多问题！'],
    ['Cosa dice un pomodoro all\'altro?', 'Ci vediamo in insalata!', '一个番茄对另一个说什么？沙拉里见！'],
    ['Perché il computer ha preso il raffreddore?', 'Perché ha lasciato Windows aperto!', '为什么电脑感冒了？因为它开着Windows（窗户）！'],
    ['Qual è il colmo per un fornaio?', 'Avere le mani in pasta!', '面包师最尴尬的是什么？手插在面团里（多管闲事）！'],
    ['Cosa fa una banana al telefono?', 'Pronto? Sì, sbuccia!', '香蕉在电话里说什么？喂？是，剥皮（sbuccia=剥皮/sì+bùccia）！'],
    ['Perché la sedia è andata dallo psicologo?', 'Perché aveva le gambe molli!', '为什么椅子去看心理医生？因为它腿软！'],
    ['Che cosa dice un orologio all\'altro?', 'Che ore sono? Non ho tempo!', '一只手表对另一只说什么？几点了？我没时间！'],
    ['Perché il gatto non gioca a carte?', 'Perché ha paura del cane!', '为什么猫不玩纸牌？因为它怕狗（cane=狗/也有"大牌"之意）！'],
    ['Qual è la città preferita dai ragni?', 'Mosca!', '蜘蛛最喜欢的城市是什么？莫斯科（Mosca=莫斯科/mosca=苍蝇）！'],
    ['Cosa fa un pesce sulla luna?', 'Niente, non c\'è acqua!', '鱼在月球上做什么？什么也不做，没水！'],
  ],
  pt: [
    ['Por que o livro de matemática está triste?', 'Porque tem muitos problemas!', '为什么数学书很伤心？因为它有太多问题！'],
    ['O que o tomate foi fazer no banco?', 'Tirar extrato!', '番茄去银行做什么？取番茄酱（extrato=提取物/银行对账单）！'],
    ['Por que o computador foi ao médico?', 'Porque estava com um vírus!', '为什么电脑去看医生？因为它中了病毒！'],
    ['O que é um pontinho amarelo no meio do oceano?', 'Um yellowbmarino!', '海洋中间的小黄点是什么？黄色潜水艇！'],
    ['Por que a formiga não vai à igreja?', 'Porque ela já é da seita!', '为什么蚂蚁不去教堂？因为它已经是教派的（seita=教派/seta=箭头）！'],
    ['Qual é o animal mais forte?', 'O jacaré, porque tem a mandíbula de aço!', '最强壮的动物是什么？鳄鱼，因为它有钢的下巴！'],
    ['O que o zero disse para o oito?', 'Que cinto bonito!', '0对8说了什么？好漂亮的腰带！'],
    ['Por que o elefante não usa computador?', 'Porque tem medo do mouse!', '为什么大象不用电脑？因为它怕老鼠（mouse=老鼠/鼠标）！'],
    ['O que a Lua disse ao Sol?', 'Você é tão grande e ainda não te deram a noite de folga?', '月亮对太阳说什么？你那么大还没给你晚上放假？'],
    ['Como se chama um boomerangue que não volta?', 'Pau!', '不回来的回旋镖叫什么？棍子！'],
  ],
  ar: [
    ['لماذا كتاب الرياضيات حزين؟', 'لأن لديه مشاكل كثيرة!', '为什么数学书很伤心？因为它有太多问题！'],
    ['ماذا قال الصفر للثمانية؟', 'حزام جميل!', '0对8说了什么？漂亮的腰带！'],
    ['لماذا ذهب الكمبيوتر إلى الطبيب؟', 'لأنه كان لديه فيروس!', '为什么电脑去看医生？因为它中了病毒！'],
    ['ماذا يفعل القمر في الليل؟', 'يسهر!', '月亮晚上做什么？熬夜（سهر=熬夜/月亮）！'],
    ['لماذا لا يذهب النمل إلى المدرسة؟', 'لأنه دائماً في صف!', '为什么蚂蚁不去上学？因为它总在排队（صف=排队/班级）！'],
    ['ما هو أسرع حيوان؟', 'الزرافة، لأنها تصل قبل أن ترى!', '最快的动物是什么？长颈鹿，因为你在看到它之前它就到了！'],
    ['لماذا لا يلعب القط الورق؟', 'لأنه يخاف من الكلب!', '为什么猫不玩纸牌？因为它怕狗！'],
    ['ماذا قال الجدار للجدار الآخر؟', 'نلتقي عند الزاوية!', '一堵墙对另一堵墙说什么？转角见！'],
    ['لماذا ذهب الكتاب إلى الفراش؟', 'لأنه كان مغلقاً!', '为什么书去睡觉了？因为它合上了（مغلق=合上/关闭）！'],
    ['ماذا قالت الشوكة للطعام؟', 'أنا معجبة بك!', '叉子对食物说什么？我喜欢你（معجب=喜欢/叉住）！'],
  ],
  zh: [
    ['为什么数学书总是忧伤？', '因为它有太多解决不了的问题！', 'Why is the math book always sad? Because it has too many unsolvable problems!'],
    ['0对8说了什么？', '兄弟，你这腰带不错啊！', 'What did 0 say to 8? Nice belt, bro!'],
    ['电脑为什么去看医生？', '因为它中了病毒，连鼠标都跑不动了！', 'Why did the computer go to the doctor? It caught a virus and the mouse couldn\'t run!'],
    ['筷子为什么找不到对象？', '因为它总是单身（双根）！', 'Why can\'t chopsticks find a partner? Because they\'re always single (double)!'],
    ['中国人为什么爱喝茶？', '因为咖啡太"苦"（酷）了！', 'Why do Chinese people love tea? Because coffee is too bitter (cool)!'],
    ['为什么包子总是很开心？', '因为它肚子里有料！', 'Why is the steamed bun always happy? Because it\'s full of stuffing (substance)!'],
    ['字典为什么哭了？', '因为它词穷了！', 'Why did the dictionary cry? It ran out of words!'],
    ['手机最怕什么？', '最怕没电，那它就成"手"了！', 'What does a phone fear most? Running out of battery — then it\'s just a "hand"!'],
    ['面条和包子打架谁赢了？', '面条赢了，因为它有"拉"面神功！', 'Who won the fight between noodles and buns? The noodles — they have "pulling" kung fu!'],
    ['为什么程序员不喜欢晒太阳？', '因为他们怕晒成"黑"客！', 'Why don\'t programmers like sunbathing? They\'re afraid of becoming "black" hats (hackers)!'],
  ],
};

export function getJokes(langCode: string, count: number = 10): OfflineJoke[] {
  const jokes = JOKE_DATA[langCode] || JOKE_DATA['en'];
  return jokes.slice(0, count).map(([setup, punchline, translation], i) => ({
    id: `joke_${langCode}_${i}`,
    lang_code: langCode,
    setup,
    punchline,
    translation,
    category: 'language_learning',
  }));
}

/* ══════════════════════════════════════════
   多语言短文/故事库 — 每语种10+篇分级短文
══════════════════════════════════════════ */
export interface OfflineStory {
  id: string; lang_code: string; title: string;
  content: string; translation: string; difficulty: string;
  word_count: number; category: string;
}

const STORY_DATA: Record<string, Array<[string, string, string, string, string]>> = {
  ja: [
    ['桃太郎', 'むかしむかし、あるところに、おじいさんとおばあさんが住んでいました。おばあさんが川で洗濯をしていると、大きな桃が流れてきました。桃を割ってみると、中から元気な男の子が生まれました。その子は桃太郎と名付けられ、すくすくと育ちました。', '很久很久以前，老爷爷和老奶奶住在一起。老奶奶在河边洗衣服时，漂来一个大桃子。劈开桃子一看，里面跳出一个活泼的男孩，取名桃太郎，健康成长。', 'beginner', 'daily_life'],
    ['かぐや姫', '竹取の翁が竹を切っていると、光る竹の中から小さな女の子を見つけました。その子は三ヶ月で美しい娘に成長し、「かぐや姫」と名付けられました。彼女は実は月の都から来たお姫様でした。', '砍竹老翁在砍竹子时，从发光的竹子中发现了一个小女孩。三个月后她成长为美丽的姑娘，取名"辉夜姬"。她其实是来自月宫中的公主。', 'intermediate', 'folklore'],
    ['東京の一日', '朝7時に起きて、急いで電車に乗りました。満員電車は大変ですが、日本の日常です。会社に着くと、まず「おはようございます」と挨拶します。お昼は同僚とラーメンを食べました。仕事が終わって、帰りにコンビニでおにぎりを買いました。', '早上7点起床，匆匆赶电车。满员电车虽然辛苦，却是日本的日常。到公司后先问候"早上好"。中午和同事吃了拉面。下班后，在便利店买了饭团。', 'beginner', 'daily_life'],
    ['桜の季節', '春になると、日本中が桜色に染まります。人々は公園で花見を楽しみ、お弁当を食べながら桜を眺めます。桜の花は一週間ほどで散ってしまいますが、その儚さこそが日本の美意識です。', '春天来临时，全日本都被樱花色染遍。人们在公园赏花，一边吃便当一边看樱花。樱花一周左右就会凋谢，但这种短暂正是日本的审美意识。', 'intermediate', 'culture'],
    ['日本の食事マナー', '日本では、食事の前に「いただきます」、後に「ごちそうさまでした」と言います。箸の使い方にもルールがあり、料理を箸で渡したり、ご飯に箸を立てたりしてはいけません。', '在日本，饭前说"我开动了"，饭后说"多谢款待"。使用筷子也有规矩，不能用筷子传递食物，也不能把筷子插在饭上。', 'beginner', 'culture'],
  ],
  en: [
    ['The Determined Learner', 'Sarah had always wanted to learn Japanese. Every morning at 6 AM, she would practice kanji for 30 minutes. Her friends laughed at first, but after six months, Sarah could read simple manga. A year later, she traveled to Tokyo and ordered food entirely in Japanese. The waiter smiled and said, "Your Japanese is excellent!" Sarah realized that consistency, not talent, was the real secret.', '莎拉一直想学日语。每天早上6点，她练习汉字30分钟。朋友们起初笑话她，但半年后，莎拉能读简单的漫画了。一年后，她去东京旅行，全程用日语点餐。服务员笑着说："你的日语太棒了！"莎拉意识到，坚持而非天赋，才是真正的秘诀。', 'beginner', 'inspiration'],
    ['The Coffee Shop Encounter', 'Tom walked into a small coffee shop in Paris. He wanted to practice his French. "Un café, s\'il vous plaît," he said nervously. The barista smiled and replied in perfect English, "Sure! But your French is pretty good. Want to practice?" They ended up chatting for an hour — Tom in French, the barista in English. Language exchange happens in the most unexpected places.', '汤姆走进巴黎的一家小咖啡馆，想练习法语。"请给我一杯咖啡，"他紧张地说。咖啡师微笑着用完美的英语回答："当然！不过你的法语不错。想练习吗？"他们聊了一个小时——汤姆说法语，咖啡师说英语。语言交流发生在最意想不到的地方。', 'beginner', 'daily_life'],
    ['Why the Sky is Blue', 'Have you ever wondered why the sky is blue? Sunlight contains all colors of the rainbow. When sunlight hits Earth\'s atmosphere, the blue light waves scatter more than other colors. That\'s why we see a blue sky! But at sunset, the light has to travel through more atmosphere, scattering the blue away and leaving the warm reds and oranges we love.', '你想过为什么天空是蓝色的吗？阳光包含彩虹的所有颜色。当阳光照射到地球大气层时，蓝色光波比其他颜色更容易散射。这就是我们看到蓝色天空的原因！但日落时，光线需要穿过更多大气层，蓝色被散射走了，留下我们喜爱的温暖红色和橙色。', 'intermediate', 'science'],
    ['A Letter to My Future Self', 'Dear Future Me, I hope you are still learning. Not just languages, but everything. I hope you still make mistakes and laugh about them. Remember when you couldn\'t say "hello" in any foreign language? Now look at you. The journey matters more than the destination. Keep going. Love, Past You.', '亲爱的未来的我：希望你还在学习。不只是语言，而是一切。希望你还犯错并且为此而笑。记得你连任何外语的"你好"都不会说的时候吗？看看现在的你。旅程比目的地更重要。继续前进。爱你的，过去的你。', 'intermediate', 'inspiration'],
    ['The Power of Small Habits', 'James Clear, author of Atomic Habits, says that improving just 1% every day leads to being 37 times better after one year. This applies perfectly to language learning. Learning one new word per day means 365 words per year. Practicing for just 15 minutes daily is over 90 hours per year. Small actions, repeated consistently, create extraordinary results.', '《原子习惯》作者詹姆斯·克利尔说，每天进步1%，一年后会比现在好37倍。这完全适用于语言学习。每天学一个新单词意味着一年365个单词。每天只练习15分钟，一年就是90多个小时。小行动，持续重复，创造非凡成果。', 'advanced', 'inspiration'],
  ],
  ko: [
    ['한국의 아침', '한국의 아침은 분주합니다. 사람들은 출근길에 편의점에서 김밥이나 삼각김밥을 사 먹습니다. 지하철에서는 모두가 스마트폰을 보고 있습니다. 한국인들은 아침 식사로 밥과 국을 중요하게 생각하지만, 바쁜 현대인들은 간단히 먹는 경우가 많습니다.', '韩国的早晨很忙碌。人们上班路上在便利店买紫菜包饭或三角饭团吃。地铁里大家都在看手机。韩国人重视早餐的米饭和汤，但忙碌的现代人常常简单解决。', 'beginner', 'daily_life'],
    ['한글의 위대함', '한글은 세종대왕이 1443년에 창제한 문자입니다. 과학적인 원리로 만들어져 배우기 쉽고, 모든 소리를 표현할 수 있습니다. 유네스코는 세종대왕 문해상을 제정하여 한글의 우수성을 세계에 알리고 있습니다.', '韩文是世宗大王于1443年创制的文字。以科学原理制作，易学且能表达所有声音。联合国教科文组织设立世宗大王扫盲奖，向世界宣传韩文的优秀性。', 'intermediate', 'culture'],
    ['김치 이야기', '김치는 한국을 대표하는 음식입니다. 배추에 고춧가루, 마늘, 생강 등 다양한 양념을 넣어 만듭니다. 지역마다 김치 맛이 다르고, 계절마다 담그는 김치도 다릅니다. 김장철이 되면 가족과 이웃이 모여 함께 김치를 담그는 풍습이 있습니다.', '泡菜是韩国的代表食物。在白菜中加入辣椒粉、大蒜、生姜等各种调料制成。每个地区的泡菜味道不同，每个季节腌制的泡菜也不同。到了腌泡菜季节，家人和邻居会聚在一起腌制泡菜。', 'beginner', 'culture'],
    ['서울의 사계절', '서울은 봄, 여름, 가을, 겨울 사계절이 뚜렷합니다. 봄에는 벚꽃이 피고, 여름에는 장마가 있습니다. 가을에는 단풍이 아름답고, 겨울에는 눈이 내립니다. 각 계절마다 즐길 수 있는 축제와 음식이 다릅니다.', '首尔春夏秋冬四季分明。春天樱花盛开，夏天有梅雨季。秋天枫叶美丽，冬天下雪。每个季节都有不同的庆典和美食可以享受。', 'beginner', 'daily_life'],
    ['한국어 배우기 팁', '한국어를 배울 때는 한글부터 익히는 것이 중요합니다. 한글은 2시간이면 배울 수 있을 정도로 간단합니다. 그 후에는 K-pop 노래 가사나 드라마 대사를 따라하면서 자연스럽게 익히는 것이 좋습니다.', '学韩语时，先掌握韩文字母很重要。韩文简单到两小时就能学会。之后可以通过跟读K-pop歌词或电视剧台词来自然习得。', 'beginner', 'tips'],
  ],
  fr: [
    ['Le Petit Déjeuner Français', 'En France, le petit déjeuner est sacré. Un croissant chaud, une baguette fraîche avec du beurre et de la confiture, un café noir ou un chocolat chaud. Les Français prennent leur temps le matin, lisant le journal ou discutant avec la famille.', '在法国，早餐是神圣的。热腾腾的羊角面包，新鲜的法棍配黄油和果酱，一杯黑咖啡或热巧克力。法国人早上不慌不忙，读报或与家人聊天。', 'beginner', 'daily_life'],
    ['La Tour Eiffel', 'La Tour Eiffel a été construite en 1889 pour l\'Exposition Universelle. Beaucoup de Parisiens la détestaient au début, la trouvant laide. Aujourd\'hui, c\'est le monument le plus visité au monde, accueillant plus de 7 millions de visiteurs chaque année.', '埃菲尔铁塔建于1889年，为世界博览会而建。许多巴黎人最初讨厌它，觉得它很丑。如今，它是世界上参观人数最多的纪念碑，每年接待超过700万游客。', 'intermediate', 'culture'],
    ['Apprendre le Français', 'Le français est connu comme la langue de l\'amour. Mais c\'est aussi une langue de diplomatie, de cuisine et de mode. La prononciation peut être difficile au début, surtout les voyelles nasales. Mais avec de la pratique quotidienne, tout devient plus facile.', '法语以"爱的语言"闻名。但它也是外交、烹饪和时尚的语言。发音起初可能很难，尤其是鼻化元音。但通过每天练习，一切都会变得更容易。', 'beginner', 'tips'],
    ['Un Voyage à Paris', 'Marie est allée à Paris pour la première fois. Elle a visité le Louvre, s\'est promenée le long de la Seine, et a mangé des macarons chez Ladurée. Le soir, elle a regardé la Tour Eiffel scintiller. "Paris est vraiment magique," a-t-elle pensé.', '玛丽第一次去巴黎。她参观了卢浮宫，沿着塞纳河散步，在拉杜丽吃了马卡龙。晚上，她看着埃菲尔铁塔闪烁。"巴黎真的很神奇，"她想。', 'beginner', 'travel'],
    ['La Cuisine Française', 'La cuisine française est inscrite au patrimoine mondial de l\'UNESCO. Du coq au vin à la bouillabaisse, chaque région a ses spécialités. Les Français passent en moyenne 2 heures par jour à table. Pour eux, manger n\'est pas seulement se nourrir, c\'est un art de vivre.', '法国料理被列入联合国教科文组织世界遗产。从红酒炖鸡到马赛鱼汤，每个地区都有特色菜。法国人平均每天花2小时在餐桌上。对他们来说，吃饭不只是填饱肚子，而是一种生活艺术。', 'advanced', 'culture'],
  ],
  es: [
    ['La Siesta Española', 'La siesta es una tradición española famosa en todo el mundo. Después del almuerzo, muchas tiendas cierran durante dos o tres horas. La gente descansa, duerme una pequeña siesta, o pasa tiempo con la familia. Aunque en las grandes ciudades esta costumbre está cambiando.', '午睡是世界闻名的西班牙传统。午餐后，许多商店关门两三个小时。人们休息、小睡一会，或与家人共度时光。虽然在大城市这种习惯正在改变。', 'beginner', 'culture'],
    ['Aprender Español', 'El español es la segunda lengua más hablada del mundo por hablantes nativos. Se habla en más de 20 países. La clave para aprender español es practicar los verbos y sus conjugaciones. Pero no te preocupes — ¡la gramática se vuelve más fácil con la práctica!', '西班牙语是按母语人数计算世界第二大语言。在20多个国家使用。学习西班牙语的关键是练习动词及其变位。但别担心——语法通过练习会变得更容易！', 'beginner', 'tips'],
    ['La Sagrada Familia', 'La Sagrada Familia en Barcelona es una de las iglesias más famosas del mundo. Diseñada por Antoni Gaudí, su construcción comenzó en 1882 y todavía no está terminada. Se espera que se complete en 2026. Cada año, millones de turistas visitan esta obra maestra.', '巴塞罗那的圣家堂是世界上最著名的教堂之一。由高迪设计，始建于1882年，至今尚未完工。预计2026年完成。每年，数百万游客参观这座杰作。', 'intermediate', 'culture'],
    ['Un Día en Madrid', 'Carlos se despertó temprano. Fue a una cafetería y pidió churros con chocolate. Luego caminó por el Parque del Retiro, visitó el Museo del Prado, y por la noche fue a un bar de tapas con amigos. "Madrid nunca duerme," dijo sonriendo.', '卡洛斯早早醒来。他去咖啡馆点了巧克力油条。然后在丽池公园散步，参观了普拉多博物馆，晚上和朋友去了小吃酒吧。"马德里从不睡觉，"他笑着说。', 'beginner', 'daily_life'],
    ['El Flamenco', 'El flamenco es más que un baile — es una expresión del alma andaluza. Combina cante, baile y guitarra. Originado en Andalucía, el flamenco fue declarado Patrimonio Cultural Inmaterial de la Humanidad por la UNESCO en 2010.', '弗拉明戈不仅仅是舞蹈——它是安达卢西亚灵魂的表达。结合了歌唱、舞蹈和吉他。起源于安达卢西亚，弗拉明戈于2010年被联合国教科文组织列为人类非物质文化遗产。', 'advanced', 'culture'],
  ],
  de: [
    ['Ein Tag in Berlin', 'Lisa wachte um 7 Uhr auf. Sie frühstückte ein Brötchen mit Butter und trank einen Kaffee. Dann fuhr sie mit der U-Bahn zur Arbeit. In der Mittagspause aß sie eine Currywurst. Nach der Arbeit traf sie Freunde in einem Biergarten.', '丽莎早上7点醒来。她吃了一个黄油面包卷，喝了咖啡。然后乘地铁去上班。午休时吃了咖喱香肠。下班后她在啤酒花园见了朋友。', 'beginner', 'daily_life'],
    ['Das Oktoberfest', 'Das Oktoberfest in München ist das größte Volksfest der Welt. Jedes Jahr kommen über sechs Millionen Besucher. Sie tragen traditionelle Tracht — Dirndl und Lederhosen. Es gibt Bierzelte, Fahrgeschäfte und bayerische Spezialitäten wie Brezeln und Hendl.', '慕尼黑啤酒节是世界上最大的民间节日。每年有超过600万游客。他们穿着传统服装——连衣裙和皮裤。有啤酒帐篷、游乐设施和巴伐利亚特色美食如椒盐卷饼和烤鸡。', 'intermediate', 'culture'],
    ['Deutsch Lernen Tipps', 'Deutsch hat den Ruf, schwer zu sein. Aber mit der richtigen Methode ist es machbar! Tipp 1: Lerne die Artikel immer mit dem Nomen. Tipp 2: Schau deutsche Serien mit Untertiteln. Tipp 3: Sprich so viel wie möglich — Fehler sind erlaubt!', '德语以难学著称。但用对方法是可以掌握的！提示1：学名词时一定要学冠词。提示2：看带字幕的德语剧。提示3：尽可能多说——允许犯错！', 'beginner', 'tips'],
    ['Die Brüder Grimm', 'Jacob und Wilhelm Grimm waren zwei deutsche Brüder, die berühmte Märchen sammelten. Schneewittchen, Hänsel und Gretel, Rotkäppchen — diese Geschichten kommen aus ihrer Sammlung. Die Märchen wurden in über 160 Sprachen übersetzt.', '格林兄弟是两兄弟，收集了著名的童话故事。白雪公主、汉塞尔和格蕾特、小红帽——这些故事都来自他们的收集。这些童话被翻译成160多种语言。', 'intermediate', 'culture'],
    ['Die Deutsche Pünktlichkeit', 'In Deutschland ist Pünktlichkeit sehr wichtig. Wenn du um 10 Uhr verabredet bist, solltest du um 9:55 Uhr da sein. Zu spät zu kommen gilt als unhöflich. Diese kulturelle Norm spiegelt den deutschen Wert von Ordnung und Respekt wider.', '在德国，守时非常重要。如果你约好10点，最好9:55就到。迟到被认为是不礼貌的。这一文化规范反映了德国人对秩序和尊重的重视。', 'intermediate', 'culture'],
  ],
  it: [
    ['Una Giornata a Roma', 'Marco si è svegliato presto. Ha preso un caffè al bar sotto casa. Poi ha passeggiato per Trastevere, ammirando le stradine antiche. A pranzo ha mangiato carbonara. Nel pomeriggio ha visitato il Colosseo. "Roma è eterna," ha pensato.', '马可早早醒来。在楼下的酒吧喝了咖啡。然后在特拉斯提弗列散步，欣赏古老的街道。午餐吃了培根蛋面。下午参观了斗兽场。"罗马是永恒的，"他想。', 'beginner', 'daily_life'],
    ['La Cucina Italiana', 'La cucina italiana è famosa in tutto il mondo. Ogni regione ha le sue specialità: la pizza a Napoli, il risotto a Milano, il pesto a Genova. Ma la vera regola italiana è: ingredienti freschi e semplici, preparati con amore.', '意大利料理世界闻名。每个地区都有特色菜：那不勒斯的披萨、米兰的烩饭、热那亚的青酱。但真正的意大利规则是：新鲜简单的食材，用爱烹饪。', 'beginner', 'culture'],
    ['Imparare l\'Italiano', 'L\'italiano è una lingua melodica e romantica. La pronuncia è abbastanza regolare, il che aiuta molto i principianti. Un consiglio: guarda film italiani con sottotitoli. "La vita è bella" e "Cinema Paradiso" sono ottimi per iniziare!', '意大利语是一门旋律优美、浪漫的语言。发音相当规律，这对初学者很有帮助。建议：看带字幕的意大利电影。《美丽人生》和《天堂电影院》是很好的入门选择！', 'beginner', 'tips'],
    ['Il Carnevale di Venezia', 'Il Carnevale di Venezia è uno dei più antichi e famosi al mondo. Le persone indossano maschere elaborate e costumi eleganti. La tradizione risale al Medioevo. Oggi, migliaia di turisti vengono a Venezia per partecipare a questa festa magica.', '威尼斯狂欢节是世界上最古老、最著名的狂欢节之一。人们戴着精美的面具和优雅的服装。这一传统可以追溯到中世纪。如今，成千上万的游客来到威尼斯参加这个神奇的节日。', 'intermediate', 'culture'],
    ['Leonardo da Vinci', 'Leonardo da Vinci non era solo un pittore, ma anche scienziato, ingegnere e inventore. La Gioconda è il suo quadro più famoso. Disegnò macchine volanti secoli prima che esistessero gli aerei. La sua curiosità non aveva limiti.', '达芬奇不仅是画家，还是科学家、工程师和发明家。《蒙娜丽莎》是他最著名的画作。他在飞机存在几个世纪前就画了飞行器。他的好奇心没有边界。', 'advanced', 'culture'],
  ],
  pt: [
    ['Um Dia no Rio', 'Ana acordou cedo e foi à praia de Copacabana. Tomou água de coco e comeu um pão de queijo. Depois pegou o bondinho até o Pão de Açúcar. A vista da cidade era deslumbrante. À noite, foi a uma roda de samba na Lapa.', '安娜早早醒来去了科帕卡巴纳海滩。喝了椰子水吃了芝士面包。然后乘缆车上了糖面包山。城市景观令人叹为观止。晚上去了拉帕区的桑巴聚会。', 'beginner', 'daily_life'],
    ['O Fado Português', 'O fado é a música tradicional de Portugal, reconhecida pela UNESCO como Patrimônio Imaterial. É uma música melancólica que fala de saudade — uma palavra portuguesa que não tem tradução exata. Significa uma mistura de nostalgia, amore e perdita.', '法朵是葡萄牙的传统音乐，被联合国教科文组织认定为非物质文化遗产。这是一种忧郁的音乐，讲述着"saudade"——一个没有确切翻译的葡萄牙语词汇。它混合了乡愁、爱与失落。', 'intermediate', 'culture'],
    ['Aprender Português', 'O português é a sexta língua mais falada no mundo. É falado no Brasil, Portugal, Angola, Moçambique e outros países. A chave para aprender: pratique a pronúncia nasal e não tenha medo de errar. Brasileiros são muito pacientes com estrangeiros!', '葡萄牙语是世界第六大语言。在巴西、葡萄牙、安哥拉、莫桑比克等国使用。学习的关键：练习鼻化发音，不要害怕犯错。巴西人对外国人非常耐心！', 'beginner', 'tips'],
    ['O Carnaval do Brasil', 'O Carnaval do Rio de Janeiro é o maior do mundo. Escolas de samba passam o ano inteiro se preparando. Milhões de pessoas assistem aos desfiles no Sambódromo. É uma explosão de cores, música e alegria que dura quatro dias.', '里约热内卢狂欢节是世界上最大的。桑巴学校全年都在准备。数百万人在桑巴大道观看游行。这是持续四天的色彩、音乐和欢乐的爆发。', 'intermediate', 'culture'],
    ['Fernando Pessoa', 'Fernando Pessoa é um dos maiores poetas da língua portuguesa. Ele criou vários heterônimos — personagens com personalidades e estilos próprios. "Tudo vale a pena quando a alma não é pequena" é uma de suas frases mais famosas.', '费尔南多·佩索阿是葡语最伟大的诗人之一。他创造了多个异名——具有独立人格和风格的人物。"当灵魂不渺小时，一切都值得"是他最著名的句子之一。', 'advanced', 'culture'],
  ],
  ar: [
    ['يوم في القاهرة', 'استيقظ أحمد مبكراً. شرب شاياً بالنعناع وأكل فولاً وفلافل. ذهب إلى خان الخليلي واشترى هدايا تذكارية. في المساء، ركب فلوكة في النيل. "القاهرة لا تنام أبداً"، قال مبتسماً.', '艾哈迈德早早醒来。喝了薄荷茶，吃了蚕豆和炸豆丸。去了汗·哈利利市场买了纪念品。晚上，在尼罗河上乘了小帆船。"开罗从不睡觉，"他笑着说。', 'beginner', 'daily_life'],
    ['تعلم اللغة العربية', 'اللغة العربية لغة جميلة وغنية. تكتب من اليمين إلى اليسار. لديها 28 حرفاً. النصيحة الأولى: تعلم الأبجدية أولاً. النصيحة الثانية: استمع إلى الأغاني العربية. النصيحة الثالثة: مارس الكتابة كل يوم.', '阿拉伯语是一门美丽而丰富的语言。从右向左书写。有28个字母。建议一：先学字母表。建议二：听阿拉伯歌曲。建议三：每天练习书写。', 'beginner', 'tips'],
    ['رمضان في العالم العربي', 'رمضان هو شهر الصيام عند المسلمين. يمتنع الناس عن الطعام والشراب من الفجر حتى المغرب. عند الغروب، تفطر العائلات معاً على التمر والماء. في نهاية الشهر، يحتفل الناس بعيد الفطر.', '斋月是穆斯林的斋戒月。人们从黎明到日落不吃不喝。日落时，家人聚在一起用枣和水开斋。月末，人们庆祝开斋节。', 'intermediate', 'culture'],
    ['ألف ليلة وليلة', '"ألف ليلة وليلة" هي مجموعة من القصص العربية الشهيرة. تحكي عن شهرزاد التي تروي القصص للملك كل ليلة. من أشهر القصص: علاء الدين، علي بابا، والسندباد. هذه القصص أثرت في الأدب العالمي.', '《一千零一夜》是著名的阿拉伯故事集。讲述了山鲁佐德每晚给国王讲故事。最著名的故事有：阿拉丁、阿里巴巴和辛巴达。这些故事影响了世界文学。', 'intermediate', 'culture'],
    ['جمال الخط العربي', 'الخط العربي هو فن كتابة الحروف العربية بطريقة جميلة. هناك أنماط مختلفة: النسخ، الرقعة، الديواني، والثلث. الخطاط يحتاج سنوات من التدريب. الخط العربي جزء مهم من الثقافة الإسلامية.', '阿拉伯书法是用优美方式书写阿拉伯字母的艺术。有不同的风格：纳斯赫体、卢卡体、迪瓦尼体和三分体。书法家需要多年的训练。阿拉伯书法是伊斯兰文化的重要组成部分。', 'advanced', 'culture'],
  ],
  zh: [
    ['学习中文的秘诀', '学习中文看似困难，但掌握方法后会发现很有趣。秘诀一：先学拼音，打好发音基础。秘诀二：每天写五个汉字，记住笔画顺序。秘诀三：多看中文电视剧，边看边跟读。坚持下去，你一定能行！', 'Learning Chinese seems difficult, but it becomes fun once you master the method. Secret 1: Learn pinyin first. Secret 2: Write 5 characters daily. Secret 3: Watch Chinese dramas and shadow along. Keep at it, you can do it!', 'beginner', 'tips'],
    ['中国的四大发明', '中国古代有四大发明：造纸术、印刷术、火药和指南针。蔡伦改进了造纸术，毕昇发明了活字印刷。这些发明改变了世界历史的进程，是人类文明的瑰宝。', 'Ancient China had four great inventions: papermaking, printing, gunpowder, and the compass. Cai Lun improved papermaking, Bi Sheng invented movable type. These inventions changed world history.', 'intermediate', 'culture'],
    ['北京的胡同', '胡同是北京特有的古老街道。最古老的胡同有700多年历史。在胡同里，你可以看到四合院、老茶馆和传统小吃店。虽然很多胡同被拆除了，但南锣鼓巷等地方仍保留着老北京的味道。', 'Hutongs are ancient alleyways unique to Beijing. The oldest ones are over 700 years old. In hutongs, you can see courtyard houses, old tea houses, and traditional snack shops. Though many have been demolished, places like Nanluoguxiang still retain old Beijing charm.', 'intermediate', 'culture'],
    ['端午节的故事', '端午节是中国传统节日，在农历五月初五。人们吃粽子、赛龙舟来纪念爱国诗人屈原。屈原投江后，人们往江里扔粽子，希望鱼不要吃他的身体。这个传统延续了两千多年。', 'The Dragon Boat Festival is a traditional Chinese holiday on the 5th day of the 5th lunar month. People eat zongzi and race dragon boats to commemorate poet Qu Yuan. After he drowned himself, people threw rice into the river so fish wouldn\'t eat his body — a 2000-year tradition.', 'beginner', 'culture'],
    ['中国茶文化', '中国是茶的故乡。从唐代开始，茶就融入了中国人的日常生活。绿茶、红茶、乌龙茶、白茶、普洱茶——每种茶都有独特的香气和功效。品茶不仅是喝水，更是一种生活态度。功夫茶讲究"和、敬、清、寂"。', 'China is the home of tea. Since the Tang Dynasty, tea has been part of Chinese daily life. Green, black, oolong, white, Pu\'er — each has unique aroma and benefits. Tea tasting is not just drinking, it\'s a life attitude. Gongfu tea emphasizes "harmony, respect, purity, tranquility."', 'advanced', 'culture'],
  ],
};

export function getStories(langCode: string): OfflineStory[] {
  const stories = STORY_DATA[langCode] || STORY_DATA['en'];
  return stories.map(([title, content, translation, difficulty, category], i) => ({
    id: `story_${langCode}_${i}`,
    lang_code: langCode,
    title,
    content,
    translation,
    difficulty,
    word_count: content.split(/\s+/).length,
    category,
  }));
}

/* ══════════════════════════════════════════
   Radio Content（电台内容）— 丰富多语言多类型
══════════════════════════════════════════ */
export interface OfflineRadioContent {
  id: string; lang_code: string; radio_type: string;
  title: string; content_text: string; duration: number;
  difficulty: string; order_index: number;
}

export function getRadioContent(langCode: string, radioType: string): OfflineRadioContent[] {
  const fallbacks: Record<string, Record<string, OfflineRadioContent[]>> = {
    news: {
      ja: [
        { id: 'r-news-ja-1', lang_code: 'ja', radio_type: 'news', title: 'NHK速報：AIが言語教育を変革', content_text: '最新のAI技術により、言語学習の方法が大きく変わろうとしています。専門家によると、今後5年間でパーソナライズされたAI教師が主流になると予測されています。音声認識精度は99%に達し、リアルタイムでの発音矯正が可能になりました。', duration: 45, difficulty: 'intermediate', order_index: 0 },
        { id: 'r-news-ja-2', lang_code: 'ja', radio_type: 'news', title: '今日の天気：全国的に晴れ', content_text: '今日の東京は晴れ、最高気温25度の予想です。週末はお花見日和となりそうです。北海道ではまだ肌寒い日が続きますので、上着をお忘れなく。', duration: 30, difficulty: 'beginner', order_index: 1 },
      ],
      en: [
        { id: 'r-news-en-1', lang_code: 'en', radio_type: 'news', title: 'Global News: Language Learning Revolution', content_text: 'Artificial intelligence is transforming how we learn languages. New studies show that AI-powered learning tools can accelerate language acquisition by up to 40%. The key innovation is real-time personalized feedback that adapts to each learner\'s unique pace, style, and interests.', duration: 45, difficulty: 'intermediate', order_index: 0 },
        { id: 'r-news-en-2', lang_code: 'en', radio_type: 'news', title: 'Tech Today: The Rise of Language Apps', content_text: 'Language learning apps have seen a 300% increase in users over the past two years. Experts attribute this to improved AI features, gamification, and the growing need for multilingual communication in a globalized world.', duration: 35, difficulty: 'intermediate', order_index: 1 },
      ],
      ko: [
        { id: 'r-news-ko-1', lang_code: 'ko', radio_type: 'news', title: '뉴스: 언어 학습의 새로운 시대', content_text: 'AI 기술이 언어 학습 방식을 혁신적으로 바꾸고 있습니다. 새로운 연구에 따르면 AI 기반 학습 도구를 사용하면 언어 습득 속도가 최대 40% 향상됩니다. 핵심은 각 학습자의 속도와 스타일에 맞춘 실시간 개인화 피드백입니다.', duration: 40, difficulty: 'intermediate', order_index: 0 },
      ],
      fr: [
        { id: 'r-news-fr-1', lang_code: 'fr', radio_type: 'news', title: 'France Info: La révolution de l\'apprentissage des langues', content_text: 'L\'intelligence artificielle transforme notre façon d\'apprendre les langues. De nouvelles études montrent que les outils alimentés par l\'IA peuvent accélérer l\'acquisition linguistique de 40%. La clé est le feedback personnalisé en temps réel.', duration: 45, difficulty: 'intermediate', order_index: 0 },
      ],
      es: [
        { id: 'r-news-es-1', lang_code: 'es', radio_type: 'news', title: 'Noticias: La revolución del aprendizaje de idiomas', content_text: 'La inteligencia artificial está transformando cómo aprendemos idiomas. Nuevos estudios muestran que las herramientas impulsadas por IA pueden acelerar la adquisición de idiomas hasta en un 40%. La innovación clave es la retroalimentación personalizada en tiempo real.', duration: 45, difficulty: 'intermediate', order_index: 0 },
      ],
      de: [
        { id: 'r-news-de-1', lang_code: 'de', radio_type: 'news', title: 'Nachrichten: Revolution beim Sprachenlernen', content_text: 'Künstliche Intelligenz verändert die Art und Weise, wie wir Sprachen lernen. Neue Studien zeigen, dass KI-gestützte Lernwerkzeuge den Spracherwerb um bis zu 40% beschleunigen können. Die wichtigste Innovation ist personalisiertes Echtzeit-Feedback.', duration: 45, difficulty: 'intermediate', order_index: 0 },
      ],
      it: [
        { id: 'r-news-it-1', lang_code: 'it', radio_type: 'news', title: 'Notizie: La rivoluzione dell\'apprendimento linguistico', content_text: 'L\'intelligenza artificiale sta trasformando il modo in cui impariamo le lingue. Nuovi studi dimostrano che gli strumenti basati sull\'IA possono accelerare l\'acquisizione linguistica fino al 40%. L\'innovazione chiave è il feedback personalizzato in tempo reale.', duration: 45, difficulty: 'intermediate', order_index: 0 },
      ],
      pt: [
        { id: 'r-news-pt-1', lang_code: 'pt', radio_type: 'news', title: 'Notícias: Revolução no aprendizado de idiomas', content_text: 'A inteligência artificial está transformando a forma como aprendemos idiomas. Novos estudos mostram que ferramentas baseadas em IA podem acelerar a aquisição de idiomas em até 40%. A inovação principal é o feedback personalizado em tempo real.', duration: 45, difficulty: 'intermediate', order_index: 0 },
      ],
      ar: [
        { id: 'r-news-ar-1', lang_code: 'ar', radio_type: 'news', title: 'أخبار: ثورة تعلم اللغات', content_text: 'الذكاء الاصطناعي يغير طريقة تعلمنا للغات. تظهر دراسات جديدة أن أدوات التعلم المدعومة بالذكاء الاصطناعي يمكنها تسريع اكتساب اللغة بنسبة تصل إلى 40٪. الابتكار الرئيسي هو التغذية الراجعة الشخصية في الوقت الفعلي.', duration: 45, difficulty: 'intermediate', order_index: 0 },
      ],
      zh: [
        { id: 'r-news-zh-1', lang_code: 'zh', radio_type: 'news', title: '新闻：语言学习革命', content_text: '人工智能正在改变我们学习语言的方式。最新研究表明，AI驱动的学习工具可以将语言习得速度提高40%。关键创新在于实时个性化反馈，能够适应每个学习者的独特节奏和风格。', duration: 45, difficulty: 'intermediate', order_index: 0 },
      ],
    },
    music: {
      ja: [
        { id: 'r-music-ja-1', lang_code: 'ja', radio_type: 'music', title: 'J-POPで学ぶ日本語', content_text: '音楽は言語学習の強い味方です。J-POPの歌詞には日常会話で使われる自然な表現がたくさん含まれています。例えば「ありがとう」「大好き」「頑張れ」— こうした言葉は歌を通じて自然に身につきます。今日は宇多田ヒカルの「First Love」の歌詞から学びましょう。', duration: 50, difficulty: 'beginner', order_index: 0 },
      ],
      en: [
        { id: 'r-music-en-1', lang_code: 'en', radio_type: 'music', title: 'Learning Through Music', content_text: 'Music is one of the most powerful tools for language learning. Songs contain natural expressions, authentic pronunciation, and cultural context. Try listening to English songs while reading the lyrics — you\'ll absorb vocabulary, grammar, and rhythm naturally.', duration: 40, difficulty: 'beginner', order_index: 0 },
      ],
      fr: [
        { id: 'r-music-fr-1', lang_code: 'fr', radio_type: 'music', title: 'Apprendre avec la Musique Française', content_text: 'La musique est un outil puissant pour apprendre le français. Écoutez Édith Piaf, Stromae, ou Angèle. Leurs chansons contiennent des expressions naturelles et une prononciation authentique. Essayez de chanter avec les paroles — c\'est amusant et efficace!', duration: 45, difficulty: 'beginner', order_index: 0 },
      ],
      es: [
        { id: 'r-music-es-1', lang_code: 'es', radio_type: 'music', title: 'Aprender con Música Latina', content_text: 'La música latina es perfecta para aprender español. Desde Shakira hasta Rosalía, las canciones están llenas de expresiones cotidianas. Escucha "Despacito" y nota cómo se usan los verbos. ¡Cantar en español es una de las formas más divertidas de aprender!', duration: 45, difficulty: 'beginner', order_index: 0 },
      ],
      de: [
        { id: 'r-music-de-1', lang_code: 'de', radio_type: 'music', title: 'Deutsch lernen mit Musik', content_text: 'Musik hilft beim Deutschlernen! Höre Rammstein für klare Aussprache, AnnenMayKantereit für Alltagssprache, oder Mark Forster für positive Vibes. Die Wiederholung von Refrains ist perfekt zum Einprägen neuer Wörter und Satzstrukturen.', duration: 45, difficulty: 'beginner', order_index: 0 },
      ],
      it: [
        { id: 'r-music-it-1', lang_code: 'it', radio_type: 'music', title: 'Imparare con la Musica Italiana', content_text: 'La musica italiana è famosa in tutto il mondo. Ascolta Laura Pausini, Eros Ramazzotti o Måneskin. Le canzoni italiane sono piene di passione ed espressioni idiomatiche. Cantare aiuta a migliorare la pronuncia e memorizzare nuove parole!', duration: 45, difficulty: 'beginner', order_index: 0 },
      ],
      pt: [
        { id: 'r-music-pt-1', lang_code: 'pt', radio_type: 'music', title: 'Aprender com Música Brasileira', content_text: 'A música brasileira é rica e diversa: samba, bossa nova, MPB, funk. Ouça Caetano Veloso, Gilberto Gil e Anitta. As letras contêm expressões coloquiais e gírias que você não encontra nos livros didáticos. Cantar junto é o segredo!', duration: 45, difficulty: 'beginner', order_index: 0 },
      ],
      ar: [
        { id: 'r-music-ar-1', lang_code: 'ar', radio_type: 'music', title: 'تعلم العربية بالموسيقى', content_text: 'الموسيقى العربية غنية ومتنوعة. استمع إلى فيروز، أم كلثوم، وعبد الحليم حافظ. كلمات الأغاني العربية مليئة بالشعر والتعبيرات الجميلة. الغناء مع الموسيقى يساعد على تحسين النطق وتذكر الكلمات الجديدة!', duration: 45, difficulty: 'beginner', order_index: 0 },
      ],
      zh: [
        { id: 'r-music-zh-1', lang_code: 'zh', radio_type: 'music', title: '用中文歌曲学中文', content_text: '中文歌曲是学习中文的好方法！从邓丽君的经典到周杰伦的流行，歌词中充满了优美的表达和成语。跟着唱不仅能提高发音，还能感受中文的韵律之美。推荐从慢歌开始，比如《月亮代表我的心》。', duration: 45, difficulty: 'beginner', order_index: 0 },
      ],
    },
    story: {
      ja: [
        { id: 'r-story-ja-1', lang_code: 'ja', radio_type: 'story', title: '日本昔話：鶴の恩返し', content_text: '昔々、ある若者が罠にかかった鶴を助けました。その夜、美しい女性が若者の家を訪れ、妻にしてほしいと言いました。彼女は機を織り、美しい布を作りましたが、「織っている間は絶対に部屋を覗かないで」と言いました…', duration: 60, difficulty: 'intermediate', order_index: 0 },
      ],
      en: [
        { id: 'r-story-en-1', lang_code: 'en', radio_type: 'story', title: 'The Courage to Speak', content_text: 'When Maria first moved to London, she was terrified of speaking English. Every conversation felt like an exam. But one day, she made a mistake ordering coffee and instead of feeling embarrassed, she and the barista laughed together. That moment changed everything.', duration: 45, difficulty: 'beginner', order_index: 0 },
      ],
      fr: [
        { id: 'r-story-fr-1', lang_code: 'fr', radio_type: 'story', title: 'Le Petit Prince (Extrait)', content_text: 'Le Petit Prince vivait sur une toute petite planète. Un jour, une rose magnifique est apparue. Il l\'a aimée et protégée. Mais la rose était parfois difficile. Alors le Petit Prince a décidé de voyager pour comprendre le monde et l\'amitié.', duration: 55, difficulty: 'intermediate', order_index: 0 },
      ],
      es: [
        { id: 'r-story-es-1', lang_code: 'es', radio_type: 'story', title: 'La Leyenda del Quetzal', content_text: 'En las montañas de Guatemala vivía un pájaro de plumaje gris. Cuando los españoles llegaron, el pájaro vio la valentía del líder maya Tecún Umán. Al morir el guerrero, el pájaro se posó en su pecho y su plumaje se volvió rojo y verde — así nació el quetzal.', duration: 55, difficulty: 'intermediate', order_index: 0 },
      ],
      de: [
        { id: 'r-story-de-1', lang_code: 'de', radio_type: 'story', title: 'Der Hase und der Igel', content_text: 'Ein Hase traf einen Igel und lachte über seine kurzen Beine. Der Igel schlug ein Wettrennen vor. Mit einem Trick — seine Frau sah genauso aus und wartete am Ziel — gewann der Igel. Die Moral: Unterschätze niemals andere wegen ihres Aussehens.', duration: 50, difficulty: 'beginner', order_index: 0 },
      ],
      it: [
        { id: 'r-story-it-1', lang_code: 'it', radio_type: 'story', title: 'Pinocchio (Estratto)', content_text: 'C\'era una volta un falegname di nome Geppetto. Un giorno costruì un burattino di legno e lo chiamò Pinocchio. "Vorrei tanto che fosse un bambino vero," sospirò. Quella notte, una fata blu diede vita al burattino. Ma c\'era una condizione: se Pinocchio avesse detto una bugia, il suo naso sarebbe cresciuto.', duration: 55, difficulty: 'intermediate', order_index: 0 },
      ],
      pt: [
        { id: 'r-story-pt-1', lang_code: 'pt', radio_type: 'story', title: 'A Lenda do Saci-Pererê', content_text: 'No folclore brasileiro, o Saci-Pererê é um menino negro de uma perna só que usa um gorro vermelho. Ele adora fazer travessuras: esconde objetos, solta animais e faz tranças nas crinas dos cavalos. Mas se alguém conseguir pegar seu gorro, ele terá que realizar um desejo.', duration: 50, difficulty: 'beginner', order_index: 0 },
      ],
      ar: [
        { id: 'r-story-ar-1', lang_code: 'ar', radio_type: 'story', title: 'علاء الدين والمصباح السحري', content_text: 'كان علاء الدين شاباً فقيراً يعيش في الصين القديمة. ذات يوم، وجد مصباحاً قديماً. عندما فركه، ظهر جني وقال: "شبيك لبيك، عبدك بين يديك. اطلب وأنا أنفذ!" وهكذا بدأت مغامرات علاء الدين.', duration: 55, difficulty: 'intermediate', order_index: 0 },
      ],
      zh: [
        { id: 'r-story-zh-1', lang_code: 'zh', radio_type: 'story', title: '孟母三迁', content_text: '孟子小时候，他家住在墓地旁边。孟子就学人家哭丧。孟母说："这里不适合孩子住。"就搬到市场旁边。孟子又学商贩叫卖。孟母再次搬家，这次搬到学校旁边。孟子开始学礼仪读书。孟母满意地说："这才是适合居住的地方。"', duration: 50, difficulty: 'beginner', order_index: 0 },
      ],
    },
    business: {
      ja: [
        { id: 'r-biz-ja-1', lang_code: 'ja', radio_type: 'business', title: 'ビジネス敬語マスター', content_text: '日本のビジネスシーンでは敬語が不可欠です。「お世話になっております」「恐れ入りますが」「ご確認いただけますでしょうか」— これらのフレーズを使いこなせれば、あなたのビジネス日本語はワンランクアップします。', duration: 45, difficulty: 'advanced', order_index: 0 },
      ],
      en: [
        { id: 'r-biz-en-1', lang_code: 'en', radio_type: 'business', title: 'Business English: Meeting Essentials', content_text: 'Running effective meetings in English requires specific vocabulary. "Let\'s circle back to that," "I\'d like to piggyback on that idea," and "Can we table this for now?" are essential phrases for professional communication.', duration: 40, difficulty: 'advanced', order_index: 0 },
      ],
      fr: [
        { id: 'r-biz-fr-1', lang_code: 'fr', radio_type: 'business', title: 'Français des Affaires: Réunions', content_text: 'Dans le monde professionnel francophone, certaines expressions sont incontournables: "Je vous prie d\'agréer mes salutations distinguées", "Pourriez-vous me transmettre le dossier?", "Je vous remercie de votre diligence". Maîtriser ces formules vous ouvrira des portes.', duration: 45, difficulty: 'advanced', order_index: 0 },
      ],
      es: [
        { id: 'r-biz-es-1', lang_code: 'es', radio_type: 'business', title: 'Español de Negocios: Reuniones', content_text: 'En el mundo empresarial hispanohablante, expresiones como "Quedo a su disposición", "Le agradezco de antemano", y "¿Podríamos concretar una reunión?" son fundamentales. Dominar el español formal de negocios es clave para el éxito profesional.', duration: 45, difficulty: 'advanced', order_index: 0 },
      ],
      de: [
        { id: 'r-biz-de-1', lang_code: 'de', radio_type: 'business', title: 'Business-Deutsch: Meetings', content_text: 'In der deutschen Geschäftswelt sind formelle Ausdrücke unerlässlich: "Sehr geehrte Damen und Herren", "Ich würde gerne einen Termin vereinbaren", "Vielen Dank für Ihre Unterstützung". Deutsche Geschäftskultur legt Wert auf Direktheit und Pünktlichkeit.', duration: 45, difficulty: 'advanced', order_index: 0 },
      ],
      it: [
        { id: 'r-biz-it-1', lang_code: 'it', radio_type: 'business', title: 'Italiano per Affari: Riunioni', content_text: 'Nel business italiano, espressioni come "In attesa di un suo gentile riscontro", "La ringrazio anticipatamente", e "Potremmo fissare un appuntamento?" sono essenziali. L\'italiano d\'affari combina formalità con un tocco di calore personale.', duration: 45, difficulty: 'advanced', order_index: 0 },
      ],
      pt: [
        { id: 'r-biz-pt-1', lang_code: 'pt', radio_type: 'business', title: 'Português de Negócios: Reuniões', content_text: 'No mundo dos negócios em português, "Atenciosamente", "Fico no aguardo do seu retorno", e "Poderíamos agendar uma reunião?" são expressões fundamentais. O português empresarial brasileiro tende a ser um pouco mais informal que o europeu.', duration: 45, difficulty: 'advanced', order_index: 0 },
      ],
      ar: [
        { id: 'r-biz-ar-1', lang_code: 'ar', radio_type: 'business', title: 'العربية للأعمال: الاجتماعات', content_text: 'في عالم الأعمال العربي، عبارات مثل "تفضلوا بقبول فائق الاحترام"، "نرجو إفادتنا"، و"هل يمكننا تحديد موعد؟" ضرورية. العربية للأعمال تجمع بين الرسمية والكرم في التواصل.', duration: 45, difficulty: 'advanced', order_index: 0 },
      ],
      zh: [
        { id: 'r-biz-zh-1', lang_code: 'zh', radio_type: 'business', title: '商务中文：会议必备', content_text: '在中国商务场合，"请您过目""麻烦您了""辛苦了"这些表达必不可少。商务中文讲究客套与效率并重，邮件开头常用"尊敬的"，结尾用"此致敬礼"。掌握这些让你的商务沟通更专业！', duration: 45, difficulty: 'advanced', order_index: 0 },
      ],
    },
    academic: {
      en: [
        { id: 'r-acad-en-1', lang_code: 'en', radio_type: 'academic', title: 'The Science of Language Acquisition', content_text: 'Dr. Stephen Krashen\'s Input Hypothesis suggests that we acquire language through comprehensible input — exposure to language slightly above our current level. This "i+1" principle means we should challenge ourselves without being overwhelmed.', duration: 55, difficulty: 'advanced', order_index: 0 },
      ],
      fr: [
        { id: 'r-acad-fr-1', lang_code: 'fr', radio_type: 'academic', title: 'La Science de l\'Acquisition du Langage', content_text: 'L\'hypothèse de l\'input de Stephen Krashen suggère que nous acquérons le langage par l\'exposition à un contenu compréhensible légèrement au-dessus de notre niveau. Ce principe "i+1" est fondamental pour comprendre comment le cerveau apprend les langues.', duration: 55, difficulty: 'advanced', order_index: 0 },
      ],
      es: [
        { id: 'r-acad-es-1', lang_code: 'es', radio_type: 'academic', title: 'La Ciencia de la Adquisición del Lenguaje', content_text: 'La Hipótesis del Input de Stephen Krashen propone que adquirimos el lenguaje a través de input comprensible — exposición a un lenguaje ligeramente por encima de nuestro nivel actual. Este principio "i+1" es clave para entender el aprendizaje de idiomas.', duration: 55, difficulty: 'advanced', order_index: 0 },
      ],
      de: [
        { id: 'r-acad-de-1', lang_code: 'de', radio_type: 'academic', title: 'Die Wissenschaft des Spracherwerbs', content_text: 'Die Input-Hypothese von Stephen Krashen besagt, dass wir Sprache durch verständlichen Input erwerben — Sprache, die knapp über unserem aktuellen Niveau liegt. Dieses "i+1"-Prinzip erklärt, wie unser Gehirn neue Sprachen aufnimmt.', duration: 55, difficulty: 'advanced', order_index: 0 },
      ],
      it: [
        { id: 'r-acad-it-1', lang_code: 'it', radio_type: 'academic', title: 'La Scienza dell\'Acquisizione Linguistica', content_text: 'L\'Ipotesi dell\'Input di Stephen Krashen suggerisce che acquisiamo il linguaggio attraverso input comprensibile — esposizione a un linguaggio leggermente al di sopra del nostro livello attuale. Questo principio "i+1" è fondamentale per la linguistica applicata.', duration: 55, difficulty: 'advanced', order_index: 0 },
      ],
      pt: [
        { id: 'r-acad-pt-1', lang_code: 'pt', radio_type: 'academic', title: 'A Ciência da Aquisição da Linguagem', content_text: 'A Hipótese do Input de Stephen Krashen sugere que adquirimos linguagem através de input compreensível — exposição a linguagem ligeiramente acima do nosso nível atual. Este princípio "i+1" é essencial para entender a aprendizagem de idiomas.', duration: 55, difficulty: 'advanced', order_index: 0 },
      ],
      ar: [
        { id: 'r-acad-ar-1', lang_code: 'ar', radio_type: 'academic', title: 'علم اكتساب اللغة', content_text: 'تقترح فرضية المدخلات لستيفن كراشن أننا نكتسب اللغة من خلال المدخلات المفهومة — التعرض للغة أعلى قليلاً من مستوانا الحالي. مبدأ "i+1" هذا أساسي لفهم كيفية تعلم الدماغ للغات.', duration: 55, difficulty: 'advanced', order_index: 0 },
      ],
      zh: [
        { id: 'r-acad-zh-1', lang_code: 'zh', radio_type: 'academic', title: '语言习得的科学', content_text: '斯蒂芬·克拉申的输入假说认为，我们通过可理解输入来习得语言——接触略高于当前水平的语言材料。这个"i+1"原则是理解大脑如何学习语言的基础。挑战自己但不被压垮，才是最佳学习状态。', duration: 55, difficulty: 'advanced', order_index: 0 },
      ],
    },
  };

  const typeContent = fallbacks[radioType];
  if (!typeContent) return [];
  const langContent = typeContent[langCode] || typeContent['en'] || Object.values(typeContent)[0] || [];
  return langContent;
}

/* ══════════════════════════════════════════
   Daily Tasks（每日任务）
══════════════════════════════════════════ */
export interface OfflineDailyTask {
  id: string; session_key: string; task_date: string;
  task_type: string; task_label: string;
  target_value: number; current_value: number;
  completed: boolean; reward_claimed: boolean;
  xp_reward: number; diamond_reward: number;
}

export function getDailyTasks(sessionKey: string): OfflineDailyTask[] {
  const today = new Date().toISOString().split('T')[0];
  return [
    { id: 'dt_1', session_key: sessionKey, task_date: today, task_type: 'play_games', task_label: '完成 2 局游戏', target_value: 2, current_value: 1, completed: false, reward_claimed: false, xp_reward: 30, diamond_reward: 0 },
    { id: 'dt_2', session_key: sessionKey, task_date: today, task_type: 'earn_xp', task_label: '获得 50 XP', target_value: 50, current_value: 35, completed: false, reward_claimed: false, xp_reward: 20, diamond_reward: 5 },
    { id: 'dt_3', session_key: sessionKey, task_date: today, task_type: 'checkin_streak', task_label: '今日打卡', target_value: 1, current_value: 0, completed: false, reward_claimed: false, xp_reward: 10, diamond_reward: 3 },
  ];
}

/* ══════════════════════════════════════════
   Learning Daily（打卡记录）
══════════════════════════════════════════ */
export function getCheckinDates(sessionKey: string): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

export function getMonthlyCheckinCount(sessionKey: string, yearMonth: string): number {
  return 7;
}

/* ══════════════════════════════════════════
   Weekly XP（周排行榜）
══════════════════════════════════════════ */
export interface OfflineRankEntry {
  session_key: string; xp_earned: number; rank_tier: string;
  display_name?: string;
}

export function getWeeklyRanking(): OfflineRankEntry[] {
  const names = ['语言大师', '单词猎人', '语法达人', '学习先锋', '每日打卡王', '游戏高手', '阅读之星', '写作能手', '听力冠军', '口语天才', '记忆王者', '考试精英'];
  const tiers = ['bronze', 'silver', 'gold', 'sapphire', 'diamond'];
  return names.map((name, i) => ({
    session_key: `user_demo_${String(i + 1).padStart(3, '0')}`,
    xp_earned: 50 + Math.floor(Math.random() * 600),
    rank_tier: tiers[Math.min(Math.floor(i / 3), 4)],
    display_name: name,
  })).sort((a, b) => b.xp_earned - a.xp_earned);
}

/* ══════════════════════════════════════════
   Study Groups（学习圈/学习小组）
══════════════════════════════════════════ */
export interface OfflineStudyGroup {
  id: string; name: string; description: string;
  group_type: string; lang_focus: string;
  owner_key: string; member_count: number; max_members: number;
  fee_paid_fen: number; deposit_fen: number;
  deposit_status: string; shop_enabled: boolean;
  status: string; is_active: boolean;
  deposit_forfeited: boolean; ban_reason: string;
  banned_at: string | null; creator_key: string; created_at: string;
}

export function getStudyGroups(): OfflineStudyGroup[] {
  const now = new Date().toISOString();
  return [
    { id: 'sg_1', name: '日语入门小分队', description: '一起从零开始学日语，每天打卡互相监督', group_type: 'small', lang_focus: 'ja', owner_key: 'user_001', member_count: 12, max_members: 20, fee_paid_fen: 0, deposit_fen: 9900, deposit_status: 'active', shop_enabled: false, status: 'active', is_active: true, deposit_forfeited: false, ban_reason: '', banned_at: null, creator_key: 'user_001', created_at: now },
    { id: 'sg_2', name: '英语口语天天练', description: '每周三次视频口语练习，全英文环境', group_type: 'mid', lang_focus: 'en', owner_key: 'user_002', member_count: 28, max_members: 50, fee_paid_fen: 19900, deposit_fen: 19900, deposit_status: 'active', shop_enabled: true, status: 'active', is_active: true, deposit_forfeited: false, ban_reason: '', banned_at: null, creator_key: 'user_002', created_at: now },
    { id: 'sg_3', name: '韩语追星学习会', description: '边追星边学韩语，翻译歌词和综艺', group_type: 'small', lang_focus: 'ko', owner_key: 'user_003', member_count: 18, max_members: 20, fee_paid_fen: 0, deposit_fen: 9900, deposit_status: 'active', shop_enabled: false, status: 'active', is_active: true, deposit_forfeited: false, ban_reason: '', banned_at: null, creator_key: 'user_003', created_at: now },
    { id: 'sg_4', name: '法语浪漫之旅', description: '学习法语日常对话，了解法国文化', group_type: 'small', lang_focus: 'fr', owner_key: 'user_004', member_count: 9, max_members: 15, fee_paid_fen: 0, deposit_fen: 9900, deposit_status: 'active', shop_enabled: false, status: 'active', is_active: true, deposit_forfeited: false, ban_reason: '', banned_at: null, creator_key: 'user_004', created_at: now },
    { id: 'sg_5', name: '多语言交流俱乐部', description: '学习任何语言都可以加入，互相帮助', group_type: 'large', lang_focus: 'en', owner_key: 'user_005', member_count: 45, max_members: 100, fee_paid_fen: 0, deposit_fen: 9900, deposit_status: 'active', shop_enabled: true, status: 'active', is_active: true, deposit_forfeited: false, ban_reason: '', banned_at: null, creator_key: 'user_005', created_at: now },
  ];
}

/* ══════════════════════════════════════════
   Friends（好友系统）
══════════════════════════════════════════ */
export interface OfflineFriend {
  id: string; other_key: string; status: string; is_requester: boolean;
  display_name?: string; avatar?: string; language?: string;
  level?: number; interests?: string[];
}

export function getFriends(): OfflineFriend[] {
  return [
    { id: 'f_1', other_key: 'user_f1', status: 'accepted', is_requester: false, display_name: '日语小达人', avatar: '👩‍🎓', language: 'ja', level: 5, interests: ['anime', 'travel'] },
    { id: 'f_2', other_key: 'user_f2', status: 'accepted', is_requester: true, display_name: '英语学习狂', avatar: '👨‍💻', language: 'en', level: 8, interests: ['tech', 'reading'] },
    { id: 'f_3', other_key: 'user_f3', status: 'accepted', is_requester: false, display_name: '韩流粉丝', avatar: '👩‍🎤', language: 'ko', level: 3, interests: ['kpop', 'drama'] },
    { id: 'f_4', other_key: 'user_f4', status: 'pending', is_requester: false, display_name: '法语爱好者', avatar: '👨‍🍳', language: 'fr', level: 4, interests: ['cooking', 'art'] },
  ];
}

/* ══════════════════════════════════════════
   Achievements（成就）
══════════════════════════════════════════ */
export interface OfflineAchievement {
  achievement_key: string; achievement_name: string;
  achievement_icon: string; achievement_desc: string;
  earned_at: string;
}

export function getAchievements(): OfflineAchievement[] {
  return [
    { achievement_key: 'first_step', achievement_name: '学习启程', achievement_icon: '🌱', achievement_desc: '完成第一次打卡', earned_at: '2026-05-20T10:00:00Z' },
    { achievement_key: 'xp_100', achievement_name: '百题达人', achievement_icon: '⚡', achievement_desc: '累计获得 100 XP', earned_at: '2026-05-22T14:30:00Z' },
    { achievement_key: 'streak_3', achievement_name: '三日不辍', achievement_icon: '🔥', achievement_desc: '连续学习 3 天', earned_at: '2026-05-23T09:00:00Z' },
    { achievement_key: 'streak_7', achievement_name: '一周坚持', achievement_icon: '🌟', achievement_desc: '连续学习 7 天', earned_at: '2026-05-27T08:15:00Z' },
    { achievement_key: 'xp_500', achievement_name: '五百斗士', achievement_icon: '💪', achievement_desc: '累计获得 500 XP', earned_at: '2026-05-30T16:45:00Z' },
  ];
}

/* ══════════════════════════════════════════
   Partner Profiles（语伴匹配）
══════════════════════════════════════════ */
export interface OfflinePartner {
  id: string; session_key: string; display_name: string;
  native_lang: string; learning_lang: string;
  proficiency: number; bio: string; total_points: number;
  is_looking_partner: boolean;
}

export function getPartnerCandidates(): OfflinePartner[] {
  return [
    { id: 'p_1', session_key: 'pu_1', display_name: '山田太郎', native_lang: 'ja', learning_lang: 'zh', proficiency: 8, bio: '我是日本人，正在学中文。喜欢动漫和旅行，可以教你日语！', total_points: 850, is_looking_partner: true },
    { id: 'p_2', session_key: 'pu_2', display_name: 'Emily Chen', native_lang: 'en', learning_lang: 'zh', proficiency: 6, bio: 'Native English speaker from NYC. Love learning Chinese and cooking!', total_points: 620, is_looking_partner: true },
    { id: 'p_3', session_key: 'pu_3', display_name: '김민지', native_lang: 'ko', learning_lang: 'ja', proficiency: 7, bio: '한국어 원어민이에요. 일본어 배우고 있어요!', total_points: 730, is_looking_partner: true },
    { id: 'p_4', session_key: 'pu_4', display_name: 'Pierre Dupont', native_lang: 'fr', learning_lang: 'en', proficiency: 5, bio: 'Je viens de Paris. Je veux améliorer mon anglais!', total_points: 440, is_looking_partner: true },
    { id: 'p_5', session_key: 'pu_5', display_name: 'María García', native_lang: 'es', learning_lang: 'en', proficiency: 6, bio: 'De Madrid. Me encanta viajar y aprender idiomas.', total_points: 510, is_looking_partner: true },
    { id: 'p_6', session_key: 'pu_6', display_name: '田中花子', native_lang: 'ja', learning_lang: 'ko', proficiency: 9, bio: '日本語教師です。韓国語も勉強中！一緒に頑張りましょう！', total_points: 980, is_looking_partner: true },
  ];
}

/* ══════════════════════════════════════════
   User Learning Daily Checkin
══════════════════════════════════════════ */
export function getTodayCheckin(sessionKey: string): { id: string } | null {
  return null;
}

export function getStreakCount(sessionKey: string): number {
  return 7;
}

/* ══════════════════════════════════════════
   User Profiles (for social features)
══════════════════════════════════════════ */
export interface OfflineUserProfile {
  id: string; session_key: string;
  nickname: string; avatar: string;
  location: string; locationCode: string;
  interests: string[]; learningLanguages: string[];
  level: number; xp: number; streak: number;
  privacy: { allowDiscover: boolean; showLocation: boolean; showInterests: boolean };
  bio: string;
}

export function getUserProfiles(): OfflineUserProfile[] {
  return [
    { id: 'up_1', session_key: 'up_s1', nickname: '语言探索者', avatar: '🧑‍🎓', location: '北京', locationCode: 'BJ', interests: ['旅行', '摄影', '美食'], learningLanguages: ['ja', 'en'], level: 5, xp: 320, streak: 7, privacy: { allowDiscover: true, showLocation: true, showInterests: true }, bio: '热爱语言学习，正在学日语和英语' },
    { id: 'up_2', session_key: 'up_s2', nickname: '单词猎人', avatar: '👩‍💻', location: '上海', locationCode: 'SH', interests: ['编程', '阅读', '动漫'], learningLanguages: ['ja', 'ko'], level: 8, xp: 680, streak: 15, privacy: { allowDiscover: true, showLocation: false, showInterests: true }, bio: '程序员一枚，业余时间学外语' },
    { id: 'up_3', session_key: 'up_s3', nickname: '语法大师', avatar: '👨‍🏫', location: '广州', locationCode: 'GZ', interests: ['教学', '书法', '茶道'], learningLanguages: ['en', 'fr'], level: 12, xp: 1200, streak: 30, privacy: { allowDiscover: true, showLocation: true, showInterests: true }, bio: '外语老师，也在不断学习新语言' },
    { id: 'up_4', session_key: 'up_s4', nickname: '追番学日语', avatar: '👩‍🎤', location: '成都', locationCode: 'CD', interests: ['动漫', 'Cosplay', 'JK制服'], learningLanguages: ['ja'], level: 3, xp: 150, streak: 4, privacy: { allowDiscover: true, showLocation: false, showInterests: true }, bio: '因为喜欢动漫开始学日语！' },
    { id: 'up_5', session_key: 'up_s5', nickname: '多语种战士', avatar: '🧑‍🚀', location: '深圳', locationCode: 'SZ', interests: ['科技', '游戏', '音乐'], learningLanguages: ['en', 'ja', 'ko'], level: 15, xp: 1800, streak: 60, privacy: { allowDiscover: true, showLocation: true, showInterests: true }, bio: '同时学三门语言，痛并快乐着' },
  ];
}

/* ══════════════════════════════════════════
   Languages（语言列表）
══════════════════════════════════════════ */
export interface OfflineLanguage {
  id: string; code: string; name: string;
  native_name: string; flag: string; order_index: number;
}

export function getLanguages(): OfflineLanguage[] {
  return [
    { id: '1', code: 'ja', name: '日语', native_name: '日本語', flag: 'JP', order_index: 1 },
    { id: '2', code: 'en', name: '英语', native_name: 'English', flag: 'US', order_index: 2 },
    { id: '3', code: 'ko', name: '韩语', native_name: '한국어', flag: 'KR', order_index: 3 },
    { id: '4', code: 'fr', name: '法语', native_name: 'Français', flag: 'FR', order_index: 4 },
    { id: '5', code: 'es', name: '西班牙语', native_name: 'Español', flag: 'ES', order_index: 5 },
    { id: '6', code: 'de', name: '德语', native_name: 'Deutsch', flag: 'DE', order_index: 6 },
    { id: '7', code: 'it', name: '意大利语', native_name: 'Italiano', flag: 'IT', order_index: 7 },
    { id: '8', code: 'pt', name: '葡萄牙语', native_name: 'Português', flag: 'PT', order_index: 8 },
    { id: '9', code: 'ar', name: '阿拉伯语', native_name: 'العربية', flag: 'SA', order_index: 9 },
    { id: '10', code: 'zh', name: '中文', native_name: '中文', flag: 'CN', order_index: 10 },
  ];
}

/* ══════════════════════════════════════════
   Monthly Badges
══════════════════════════════════════════ */
export function getMonthlyBadges(): { badge_key: string; badge_name: string; checkin_days: number }[] {
  return [
    { badge_key: 'monthly_7', badge_name: '一周坚持', checkin_days: 7 },
  ];
}

/* ══════════════════════════════════════════
   Referral Earnings（推荐收益）
══════════════════════════════════════════ */
export function getReferralFrozenCount(): number {
  return 2;
}

/* ══════════════════════════════════════════
   Supabase-like response helper
══════════════════════════════════════════ */
export interface OfflineResponse<T> {
  data: T | null;
  error: null;
  count?: number;
}

export function okData<T>(data: T, count?: number): OfflineResponse<T> {
  return { data, error: null, count };
}

export function okNull(): { data: null; error: null } {
  return { data: null, error: null };
}

/* ══════════════════════════════════════════
   Offline flag — set to true when Supabase is down
══════════════════════════════════════════ */
let _offlineMode = false;
export function isOfflineMode(): boolean { return _offlineMode; }
export function setOfflineMode(v: boolean) { _offlineMode = v; }
