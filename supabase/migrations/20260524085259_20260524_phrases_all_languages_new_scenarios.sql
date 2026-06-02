/*
  # Add phrases for all new scenarios across 9 languages

  Inserts 5 phrases per scenario for all newly added scenarios.
  Languages covered: en, de, fr, es, ko, it, pt, ar, zh
*/

-- ═══════════════════════════════════════
-- ENGLISH new scenarios
-- ═══════════════════════════════════════
-- Hotel Check-in (e3b91b54)
INSERT INTO phrases (scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES
('e3b91b54-ec32-4faa-932c-d5e1aa5c0c5b','I have a reservation under Smith.','我有一个以史密斯名义的预订。','aɪ hæv ə ˌrezərˈveɪʃən ˈʌndər smɪθ','Checking in at the front desk',1),
('e3b91b54-ec32-4faa-932c-d5e1aa5c0c5b','Could I get a room with a city view?','我可以要一间城市景观的房间吗？','kʊd aɪ ɡɛt ə ruːm wɪð ə ˈsɪti vjuː','Requesting a specific room type',2),
('e3b91b54-ec32-4faa-932c-d5e1aa5c0c5b','What time is checkout?','退房时间是几点？','wɒt taɪm ɪz ˈtʃɛkaʊt','Asking about checkout time',3),
('e3b91b54-ec32-4faa-932c-d5e1aa5c0c5b','Is breakfast included?','含早餐吗？','ɪz ˈbrekfəst ɪnˈkluːdɪd','Asking about meals',4),
('e3b91b54-ec32-4faa-932c-d5e1aa5c0c5b','The Wi-Fi password, please.','请给我Wi-Fi密码。','ðə ˈwaɪfaɪ ˈpæswɜːd pliːz','Requesting Wi-Fi access',5)
ON CONFLICT DO NOTHING;

-- Asking Directions (17a38955)
INSERT INTO phrases (scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES
('17a38955-e2cc-409c-b400-5d210da39ead','Excuse me, where is the nearest subway?','打扰一下，最近的地铁站在哪里？','ɪkˈskjuːz miː weər ɪz ðə ˈnɪərɪst ˈsʌbweɪ','Asking for directions politely',1),
('17a38955-e2cc-409c-b400-5d210da39ead','How far is it from here?','离这里有多远？','haʊ fɑːr ɪz ɪt frɒm hɪər','Asking about distance',2),
('17a38955-e2cc-409c-b400-5d210da39ead','Turn left at the traffic light.','在红绿灯处左转。','tɜːn lɛft æt ðə ˈtræfɪk laɪt','Giving or receiving directions',3),
('17a38955-e2cc-409c-b400-5d210da39ead','Can you show me on the map?','你能在地图上指给我看吗？','kæn juː ʃoʊ miː ɒn ðə mæp','Asking for visual help',4),
('17a38955-e2cc-409c-b400-5d210da39ead','Is it within walking distance?','走路能到吗？','ɪz ɪt wɪˈðɪn ˈwɔːkɪŋ ˈdɪstəns','Deciding whether to walk',5)
ON CONFLICT DO NOTHING;

-- Medical & Pharmacy (af96121e)
INSERT INTO phrases (scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES
('af96121e-3827-4241-8019-46345f825b4b','I have a headache and fever.','我头痛发烧。','aɪ hæv ə ˈhɛdeɪk ænd ˈfiːvər','Describing symptoms',1),
('af96121e-3827-4241-8019-46345f825b4b','I am allergic to penicillin.','我对青霉素过敏。','aɪ æm əˈlɜːdʒɪk tuː ˌpɛnɪˈsɪlɪn','Stating allergy',2),
('af96121e-3827-4241-8019-46345f825b4b','Can I get this without a prescription?','这个不需要处方就能买到吗？','kæn aɪ ɡɛt ðɪs wɪˈðaʊt ə prɪˈskrɪpʃən','Buying over-the-counter medicine',3),
('af96121e-3827-4241-8019-46345f825b4b','How many times a day should I take this?','这个一天服用几次？','haʊ ˈmɛni taɪmz ə deɪ ʃʊd aɪ teɪk ðɪs','Asking dosage instructions',4),
('af96121e-3827-4241-8019-46345f825b4b','I need to see a doctor urgently.','我需要紧急看医生。','aɪ niːd tuː siː ə ˈdɒktər ˈɜːdʒəntli','Requesting urgent medical help',5)
ON CONFLICT DO NOTHING;

-- Numbers & Money (39fd445c)
INSERT INTO phrases (scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES
('39fd445c-e391-4954-b496-cb3ca66aa340','How much does this cost?','这个多少钱？','haʊ mʌtʃ dʌz ðɪs kɒst','Asking price',1),
('39fd445c-e391-4954-b496-cb3ca66aa340','Could you give me a discount?','能给我打折吗？','kʊd juː ɡɪv miː ə ˈdɪskaʊnt','Negotiating price',2),
('39fd445c-e391-4954-b496-cb3ca66aa340','Do you accept credit cards?','你们接受信用卡吗？','duː juː əkˈsɛpt ˈkrɛdɪt kɑːdz','Asking payment method',3),
('39fd445c-e391-4954-b496-cb3ca66aa340','I would like to exchange currency.','我想换外币。','aɪ wʊd laɪk tuː ɪksˈtʃeɪndʒ ˈkʌrənsi','At currency exchange',4),
('39fd445c-e391-4954-b496-cb3ca66aa340','Keep the change, please.','不用找零了。','kiːp ðə tʃeɪndʒ pliːz','When tipping or being generous',5)
ON CONFLICT DO NOTHING;

-- Job Interview (7599d930)
INSERT INTO phrases (scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES
('7599d930-d02f-49ef-91b9-4ace51dd169c','Tell me about yourself.','请介绍一下自己。','tɛl miː əˈbaʊt jɔːˈsɛlf','Classic opening interview question',1),
('7599d930-d02f-49ef-91b9-4ace51dd169c','What are your greatest strengths?','你最大的优点是什么？','wɒt ɑːr jɔːr ˈɡreɪtɪst strɛŋθs','Answering about strengths',2),
('7599d930-d02f-49ef-91b9-4ace51dd169c','I am a team player who works well under pressure.','我是一个能在压力下良好合作的团队成员。','aɪ æm ə tiːm ˈpleɪər huː wɜːks wɛl ˈʌndər ˈprɛʃər','Describing work style',3),
('7599d930-d02f-49ef-91b9-4ace51dd169c','What is the salary range for this position?','这个职位的薪资范围是多少？','wɒt ɪz ðə ˈsæləri reɪndʒ fɔːr ðɪs pəˈzɪʃən','Asking about compensation',4),
('7599d930-d02f-49ef-91b9-4ace51dd169c','Thank you for the opportunity to interview.','感谢您给我面试机会。','θæŋk juː fɔːr ðə ˌɒpərˈtjuːnɪti tuː ˈɪntəvjuː','Closing the interview politely',5)
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════
-- GERMAN scenarios phrases
-- ═══════════════════════════════════════
-- Emergency Help (df7ea67b)
INSERT INTO phrases (scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES
('df7ea67b-37d5-4b10-8b9a-03874364ad1a','Hilfe! Bitte rufen Sie die Polizei!','救命！请叫警察！','ˈhɪlfə ˈbɪtə ˈruːfən ziː diː poˈliːtsaɪ','Calling for emergency help',1),
('df7ea67b-37d5-4b10-8b9a-03874364ad1a','Ich brauche einen Arzt.','我需要医生。','ɪç ˈbraʊxə ˈaɪnən aːrtst','Requesting medical help',2),
('df7ea67b-37d5-4b10-8b9a-03874364ad1a','Bitte rufen Sie den Krankenwagen.','请叫救护车。','ˈbɪtə ˈruːfən ziː deːn ˈkraŋkənvaːɡən','Calling an ambulance',3),
('df7ea67b-37d5-4b10-8b9a-03874364ad1a','Meine Tasche wurde gestohlen.','我的包被偷了。','ˈmaɪnə ˈtaʃə ˈvʊrdə ɡəˈʃtoːlən','Reporting theft',4),
('df7ea67b-37d5-4b10-8b9a-03874364ad1a','Wo ist die nächste Polizeiwache?','最近的警察局在哪里？','voː ɪst diː ˈnɛːçstə poˈliːtsaɪˌvaxə','Finding the police station',5)
ON CONFLICT DO NOTHING;

-- Convenience Store (0f1e47fa)
INSERT INTO phrases (scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES
('0f1e47fa-b5bb-49aa-ab17-75326da2b7f5','Haben Sie Wechselgeld?','您有零钱吗？','ˈhaːbən ziː ˈvɛksəlɡɛlt','Asking for change',1),
('0f1e47fa-b5bb-49aa-ab17-75326da2b7f5','Wo finde ich die Milch?','牛奶在哪里？','voː ˈfɪndə ɪç diː mɪlç','Finding products',2),
('0f1e47fa-b5bb-49aa-ab17-75326da2b7f5','Ich hätte gerne eine Tüte, bitte.','请给我一个袋子。','ɪç ˈhɛtə ˈɡɛrnə ˈaɪnə ˈtyːtə ˈbɪtə','Requesting a bag',3),
('0f1e47fa-b5bb-49aa-ab17-75326da2b7f5','Was kostet das?','这个多少钱？','vas ˈkɔstət das','Asking about price',4),
('0f1e47fa-b5bb-49aa-ab17-75326da2b7f5','Haben Sie einen Kassenbon?','您有收据吗？','ˈhaːbən ziː ˈaɪnən ˈkasnboːn','Asking for receipt',5)
ON CONFLICT DO NOTHING;

-- Airport & Transit (9e73ad72)
INSERT INTO phrases (scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES
('9e73ad72-3a06-485a-9b8b-79b78b5c87db','Wo ist der Abflug-Terminal?','出发航站楼在哪里？','voː ɪst deːr ˈapfluːk tɛrˈmiːnal','Finding departures',1),
('9e73ad72-3a06-485a-9b8b-79b78b5c87db','Mein Flug hat Verspätung.','我的航班延误了。','maɪn fluːk hat fɛrˈʃpɛːtʊŋ','Reporting a delay',2),
('9e73ad72-3a06-485a-9b8b-79b78b5c87db','Eine Fahrkarte nach Berlin, bitte.','请给我一张去柏林的票。','ˈaɪnə ˈfaːrkartə naːx bɛrˈliːn ˈbɪtə','Buying a train ticket',3),
('9e73ad72-3a06-485a-9b8b-79b78b5c87db','Wann fährt der nächste Zug ab?','下一班火车几点出发？','van fɛːrt deːr ˈnɛːçstə tsuːk ap','Asking about train times',4),
('9e73ad72-3a06-485a-9b8b-79b78b5c87db','Ich habe mein Gepäck verloren.','我的行李丢了。','ɪç ˈhaːbə maɪn ɡəˈpɛk fɛrˈloːrən','Reporting lost luggage',5)
ON CONFLICT DO NOTHING;

-- Ordering & Dining (91814f97)
INSERT INTO phrases (scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES
('91814f97-0473-4e7f-8b5f-e8ba91a7fbde','Die Speisekarte, bitte.','请给我菜单。','diː ˈʃpaɪzəkartə ˈbɪtə','Asking for the menu',1),
('91814f97-0473-4e7f-8b5f-e8ba91a7fbde','Ich bin Vegetarier.','我是素食者。','ɪç bɪn veɡeˈtaːriər','Stating dietary preference',2),
('91814f97-0473-4e7f-8b5f-e8ba91a7fbde','Das schmeckt wunderbar!','这个味道太好了！','das ʃmɛkt ˈvʊndərbaːr','Complimenting food',3),
('91814f97-0473-4e7f-8b5f-e8ba91a7fbde','Zahlen, bitte.','买单，请。','ˈtsaːlən ˈbɪtə','Asking for the bill',4),
('91814f97-0473-4e7f-8b5f-e8ba91a7fbde','Haben Sie glutenfreie Gerichte?','你们有无麸质菜肴吗？','ˈhaːbən ziː ɡluːtənˈfraɪə ɡəˈrɪçtə','Asking about gluten-free options',5)
ON CONFLICT DO NOTHING;

-- Casual Chatting (9afc5358)
INSERT INTO phrases (scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES
('9afc5358-fdc2-4b59-94c9-88c9dad0a760','Wie geht es Ihnen?','您好吗？','viː ɡeːt ɛs ˈiːnən','Standard greeting',1),
('9afc5358-fdc2-4b59-94c9-88c9dad0a760','Woher kommen Sie?','您来自哪里？','voːˈheːr ˈkɔmən ziː','Asking about origin',2),
('9afc5358-fdc2-4b59-94c9-88c9dad0a760','Das Wetter ist heute schön.','今天天气很好。','das ˈvɛtər ɪst ˈhɔɪtə ʃøːn','Small talk about weather',3),
('9afc5358-fdc2-4b59-94c9-88c9dad0a760','Ich lerne seit einem Jahr Deutsch.','我学德语已经一年了。','ɪç ˈlɛrnə zaɪt ˈaɪnəm jaːr dɔɪtʃ','Talking about language learning',4),
('9afc5358-fdc2-4b59-94c9-88c9dad0a760','Bis später!','再见！','bɪs ˈʃpɛːtər','Saying goodbye casually',5)
ON CONFLICT DO NOTHING;

-- Hotel Check-in (0682f535)
INSERT INTO phrases (scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES
('0682f535-d058-430e-af38-65276a0625a0','Ich habe eine Reservierung auf den Namen Müller.','我以穆勒的名义预订了。','ɪç ˈhaːbə ˈaɪnə rezɛrˈviːrʊŋ aʊf deːn ˈnaːmən ˈmʏlər','Checking in',1),
('0682f535-d058-430e-af38-65276a0625a0','Wann ist der Check-out?','退房时间是几点？','van ɪst deːr ˈtʃɛkaʊt','Asking checkout time',2),
('0682f535-d058-430e-af38-65276a0625a0','Ist das Frühstück inklusive?','含早餐吗？','ɪst das ˈfryːʃtʏk ɪnkluˈziːvə','Asking about breakfast',3),
('0682f535-d058-430e-af38-65276a0625a0','Gibt es WLAN im Zimmer?','房间里有Wi-Fi吗？','ɡɪpt ɛs veːˈlaːn ɪm ˈtsɪmər','Asking about internet',4),
('0682f535-d058-430e-af38-65276a0625a0','Können Sie mein Gepäck aufbewahren?','您能帮我保管行李吗？','ˈkœnən ziː maɪn ɡəˈpɛk ˈaʊfbəvaːrən','Asking to store luggage',5)
ON CONFLICT DO NOTHING;

-- Asking Directions (ea14a689)
INSERT INTO phrases (scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES
('ea14a689-49b0-434b-ab9d-0538bd552a71','Entschuldigung, wie komme ich zum Bahnhof?','打扰一下，去火车站怎么走？','ɛntˈʃʊldɪɡʊŋ viː ˈkɔmə ɪç tsʊm ˈbaːnhoːf','Asking directions to station',1),
('ea14a689-49b0-434b-ab9d-0538bd552a71','Biegen Sie links ab.','左转。','ˈbiːɡən ziː lɪŋks ap','Giving directions: turn left',2),
('ea14a689-49b0-434b-ab9d-0538bd552a71','Es ist etwa 5 Minuten zu Fuß.','步行约5分钟。','ɛs ɪst ˈɛtva ˈfʏnf mɪˈnuːtən tsuː fuːs','Indicating walking time',3),
('ea14a689-49b0-434b-ab9d-0538bd552a71','Können Sie das auf der Karte zeigen?','您能在地图上指示吗？','ˈkœnən ziː das aʊf deːr ˈkartə ˈtsaɪɡən','Asking for map help',4),
('ea14a689-49b0-434b-ab9d-0538bd552a71','Ich habe mich verirrt.','我迷路了。','ɪç ˈhaːbə mɪç fɛrˈɪrt','Saying you are lost',5)
ON CONFLICT DO NOTHING;

-- Medical (61ee3f2d)
INSERT INTO phrases (scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES
('61ee3f2d-4a89-4fba-b269-7e838ca27180','Ich habe Kopfschmerzen und Fieber.','我头痛发烧。','ɪç ˈhaːbə ˈkɔpfʃmɛrtsən ʊnt ˈfiːbər','Describing symptoms',1),
('61ee3f2d-4a89-4fba-b269-7e838ca27180','Ich bin auf Penicillin allergisch.','我对青霉素过敏。','ɪç bɪn aʊf penɪˈtsɪliːn aˈlɛrɡɪʃ','Stating allergy',2),
('61ee3f2d-4a89-4fba-b269-7e838ca27180','Brauche ich ein Rezept dafür?','我需要处方吗？','ˈbraʊxə ɪç aɪn reˈtsɛpt daˈfyːr','Asking if prescription needed',3),
('61ee3f2d-4a89-4fba-b269-7e838ca27180','Wie oft soll ich die Tabletten nehmen?','我应该多久服一次药片？','viː ɔft zɔl ɪç diː taˈblɛtən ˈneːmən','Asking about dosage',4),
('61ee3f2d-4a89-4fba-b269-7e838ca27180','Ich brauche dringend einen Arzt.','我急需看医生。','ɪç ˈbraʊxə ˈdrɪŋənt ˈaɪnən aːrtst','Urgently needing a doctor',5)
ON CONFLICT DO NOTHING;

-- Numbers & Money (78d84efb)
INSERT INTO phrases (scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES
('78d84efb-6c87-4113-8e73-bedbac6e2363','Was kostet das insgesamt?','总共多少钱？','vas ˈkɔstət das ˈɪnsɡəzamt','Asking total price',1),
('78d84efb-6c87-4113-8e73-bedbac6e2363','Akzeptieren Sie Kreditkarten?','您接受信用卡吗？','aktsɛpˈtiːrən ziː kreˈdiːtˌkartən','Asking about card payment',2),
('78d84efb-6c87-4113-8e73-bedbac6e2363','Können Sie mir Wechselgeld geben?','能找我零钱吗？','ˈkœnən ziː miːr ˈvɛksəlɡɛlt ˈɡeːbən','Asking for change',3),
('78d84efb-6c87-4113-8e73-bedbac6e2363','Ich möchte Geld wechseln.','我想换钱。','ɪç ˈmøːçtə ɡɛlt ˈvɛksəln','Currency exchange',4),
('78d84efb-6c87-4113-8e73-bedbac6e2363','Stimmt so.','不用找零了。','ʃtɪmt zoː','Telling cashier to keep change',5)
ON CONFLICT DO NOTHING;

-- Job Interview (ad175ec1)
INSERT INTO phrases (scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES
('ad175ec1-50a4-4d19-bbdd-aa89bc1d4f4d','Bitte stellen Sie sich vor.','请自我介绍一下。','ˈbɪtə ˈʃtɛlən ziː zɪç foːr','Opening interview request',1),
('ad175ec1-50a4-4d19-bbdd-aa89bc1d4f4d','Ich bin teamorientiert und belastbar.','我注重团队合作，抗压能力强。','ɪç bɪn ˈtiːmɔriˌɛntiːrt ʊnt bəˈlastbaːr','Describing work qualities',2),
('ad175ec1-50a4-4d19-bbdd-aa89bc1d4f4d','Was sind meine Aufgaben?','我的职责是什么？','vas zɪnt ˈmaɪnə ˈaʊfɡaːbən','Asking about responsibilities',3),
('ad175ec1-50a4-4d19-bbdd-aa89bc1d4f4d','Wie hoch ist das Gehalt?','薪资是多少？','viː hoːx ɪst das ɡəˈhalt','Asking about salary',4),
('ad175ec1-50a4-4d19-bbdd-aa89bc1d4f4d','Vielen Dank für das Gespräch.','非常感谢您的面谈。','ˈfiːlən daŋk fyːr das ɡəˈʃprɛːç','Closing the interview',5)
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════
-- FRENCH new scenarios phrases
-- ═══════════════════════════════════════
-- Hotel Check-in (d7bf2092)
INSERT INTO phrases (scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES
('d7bf2092-65e0-4810-a968-c2b177ceb1da','J''ai une réservation au nom de Dupont.','我以杜邦的名义预订了。','ʒe yn rezɛrvasjɔ̃ o nɔ̃ də dypɔ̃','Checking in at hotel',1),
('d7bf2092-65e0-4810-a968-c2b177ceb1da','À quelle heure est le check-out?','退房时间是几点？','a kɛl œr ɛ lə tʃɛkaʊt','Asking checkout time',2),
('d7bf2092-65e0-4810-a968-c2b177ceb1da','Est-ce que le petit-déjeuner est inclus?','含早餐吗？','ɛs kə lə pəti deʒœne ɛ ɛ̃kly','Asking about breakfast',3),
('d7bf2092-65e0-4810-a968-c2b177ceb1da','Quel est le code Wi-Fi?','Wi-Fi密码是什么？','kɛl ɛ lə kɔd wifi','Asking for Wi-Fi',4),
('d7bf2092-65e0-4810-a968-c2b177ceb1da','Pouvez-vous me réveiller à 7 heures?','您能在7点叫醒我吗？','puve vu mə reveje a sɛt œr','Requesting a wake-up call',5)
ON CONFLICT DO NOTHING;

-- Asking Directions (389dc6b0)
INSERT INTO phrases (scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES
('389dc6b0-6414-4ac0-97a6-6858224937a9','Excusez-moi, où est la station de métro?','打扰一下，地铁站在哪里？','ɛkskyze mwa u ɛ la stasjɔ̃ də metro','Asking for subway',1),
('389dc6b0-6414-4ac0-97a6-6858224937a9','Tournez à gauche au feu rouge.','在红灯处左转。','turne a ɡoʃ o fø ruʒ','Direction: turn left at light',2),
('389dc6b0-6414-4ac0-97a6-6858224937a9','C''est à combien de distance?','离这里有多远？','sɛ ta kɔ̃bjɛ̃ də distɑ̃s','Asking distance',3),
('389dc6b0-6414-4ac0-97a6-6858224937a9','Je suis perdu(e).','我迷路了。','ʒə sɥi pɛrdy','Saying you are lost',4),
('389dc6b0-6414-4ac0-97a6-6858224937a9','Pouvez-vous me montrer sur la carte?','您能在地图上指示给我吗？','puve vu mə mɔ̃tre syr la kart','Asking map help',5)
ON CONFLICT DO NOTHING;

-- Medical (d7ff3969)
INSERT INTO phrases (scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES
('d7ff3969-5b34-4f18-90c0-533df35dbd35','J''ai mal à la tête et de la fièvre.','我头痛发烧。','ʒe mal a la tɛt e də la fjɛvr','Describing symptoms',1),
('d7ff3969-5b34-4f18-90c0-533df35dbd35','Je suis allergique à la pénicilline.','我对青霉素过敏。','ʒə sɥi alɛrʒik a la penisilin','Stating allergy',2),
('d7ff3969-5b34-4f18-90c0-533df35dbd35','Avez-vous ce médicament sans ordonnance?','这药不需要处方就能购买吗？','ave vu sə medikamɑ̃ sɑ̃ ɔrdɔnɑ̃s','Asking OTC availability',3),
('d7ff3969-5b34-4f18-90c0-533df35dbd35','Combien de fois par jour dois-je le prendre?','一天要服用几次？','kɔ̃bjɛ̃ də fwa par ʒur dwa ʒə lə prɑ̃dr','Asking dosage',4),
('d7ff3969-5b34-4f18-90c0-533df35dbd35','J''ai besoin d''un médecin d''urgence.','我需要紧急医疗。','ʒe bəzwɛ̃ dœ̃ medsɛ̃ dyʒɑ̃s','Requesting urgent care',5)
ON CONFLICT DO NOTHING;

-- Numbers & Money (418064ca)
INSERT INTO phrases (scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES
('418064ca-0219-41ff-92bc-50cfa6594b80','Combien coûte ceci?','这个多少钱？','kɔ̃bjɛ̃ kut səsi','Asking price',1),
('418064ca-0219-41ff-92bc-50cfa6594b80','Acceptez-vous les cartes de crédit?','您接受信用卡吗？','aksɛpte vu le kart də kredit','Asking payment method',2),
('418064ca-0219-41ff-92bc-50cfa6594b80','Pouvez-vous me faire un rabais?','能给我打折吗？','puve vu mə fɛr œ̃ rabe','Asking for discount',3),
('418064ca-0219-41ff-92bc-50cfa6594b80','Je voudrais changer de l''argent.','我想换外币。','ʒə vudre ʃɑ̃ʒe də larʒɑ̃','Currency exchange',4),
('418064ca-0219-41ff-92bc-50cfa6594b80','Gardez la monnaie.','不用找零了。','ɡarde la mɔnɛ','Telling to keep change',5)
ON CONFLICT DO NOTHING;

-- Job Interview (89943ef9)
INSERT INTO phrases (scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES
('89943ef9-49f7-40a3-8f0a-9fff256138a0','Parlez-moi de vous.','请介绍一下您自己。','parle mwa də vu','Opening interview question',1),
('89943ef9-49f7-40a3-8f0a-9fff256138a0','Quelles sont vos principales qualités?','您的主要优点是什么？','kɛl sɔ̃ vo prɛ̃sipal kalite','Asking about strengths',2),
('89943ef9-49f7-40a3-8f0a-9fff256138a0','Je suis rigoureux et orienté résultats.','我严谨、注重结果。','ʒə sɥi riɡurø e ɔrjɑ̃te rezylta','Describing work style',3),
('89943ef9-49f7-40a3-8f0a-9fff256138a0','Quelle est la rémunération proposée?','这个职位的薪酬是多少？','kɛl ɛ la remynerasjɔ̃ prɔpoze','Asking about salary',4),
('89943ef9-49f7-40a3-8f0a-9fff256138a0','Merci beaucoup pour cet entretien.','非常感谢您的面试。','mɛrsi boku pur sɛt ɑ̃trətjɛ̃','Closing interview',5)
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════
-- SPANISH new scenarios phrases
-- ═══════════════════════════════════════
-- Hotel Check-in (cbb3bd54)
INSERT INTO phrases (scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES
('cbb3bd54-cf1d-4919-8d87-7e2fc6e62c7a','Tengo una reserva a nombre de García.','我以加西亚的名义预订了。','ˈteŋɡo ˈuna reˈserβa a ˈnombre ðe ɣarˈθia','Checking in',1),
('cbb3bd54-cf1d-4919-8d87-7e2fc6e62c7a','¿A qué hora es el check-out?','退房时间是几点？','a ke ˈora es el ˈtʃekaʊt','Asking checkout time',2),
('cbb3bd54-cf1d-4919-8d87-7e2fc6e62c7a','¿El desayuno está incluido?','含早餐吗？','el desaˈʝuno esˈta iŋˈkluiðo','Asking about breakfast',3),
('cbb3bd54-cf1d-4919-8d87-7e2fc6e62c7a','¿Cuál es la contraseña del Wi-Fi?','Wi-Fi密码是什么？','kwal es la kontraˈseɲa del ˈwifi','Asking for Wi-Fi',4),
('cbb3bd54-cf1d-4919-8d87-7e2fc6e62c7a','¿Puede guardar mi equipaje?','您能帮我保管行李吗？','ˈpweðe ɡwarˈðar mi ekiˈpaxe','Asking to store luggage',5)
ON CONFLICT DO NOTHING;

-- Asking Directions (3d384ea5)
INSERT INTO phrases (scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES
('3d384ea5-7623-46ff-ac2e-ebe8e42028e5','Perdone, ¿dónde está el metro?','打扰一下，地铁站在哪里？','perˈðone ˈðonde esˈta el ˈmetro','Asking for subway',1),
('3d384ea5-7623-46ff-ac2e-ebe8e42028e5','Gire a la izquierda en el semáforo.','在红绿灯处左转。','ˈxire a la isˈkjerða en el seˈmaforo','Direction: turn left',2),
('3d384ea5-7623-46ff-ac2e-ebe8e42028e5','¿A qué distancia está?','有多远？','a ke ðisˈtanθia esˈta','Asking about distance',3),
('3d384ea5-7623-46ff-ac2e-ebe8e42028e5','Me he perdido.','我迷路了。','me e perˈðiðo','Saying you are lost',4),
('3d384ea5-7623-46ff-ac2e-ebe8e42028e5','¿Puede señalarlo en el mapa?','您能在地图上指示给我吗？','ˈpweðe seɲaˈlarlo en el ˈmapa','Asking map help',5)
ON CONFLICT DO NOTHING;

-- Medical (d4831eb7)
INSERT INTO phrases (scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES
('d4831eb7-86a9-47d0-8832-c0d535a662d5','Tengo dolor de cabeza y fiebre.','我头痛发烧。','ˈteŋɡo doˈlor ðe kaˈβeθa i ˈfjeβre','Describing symptoms',1),
('d4831eb7-86a9-47d0-8832-c0d535a662d5','Soy alérgico a la penicilina.','我对青霉素过敏。','soi aˈlerxiko a la peniˈθilina','Stating allergy',2),
('d4831eb7-86a9-47d0-8832-c0d535a662d5','¿Necesito receta para esto?','这需要处方吗？','neθeˈsito reˈθeta ˈpara ˈesto','Asking if prescription required',3),
('d4831eb7-86a9-47d0-8832-c0d535a662d5','¿Cuántas veces al día debo tomarlo?','每天服用几次？','ˈkwantas ˈβeθes al ˈðia ˈðeβo toˈmarlo','Asking about dosage',4),
('d4831eb7-86a9-47d0-8832-c0d535a662d5','Necesito ver a un médico urgentemente.','我急需看医生。','neθeˈsito βer a un ˈmeðiko urxenteˈmente','Requesting urgent care',5)
ON CONFLICT DO NOTHING;

-- Numbers & Money (924339d0)
INSERT INTO phrases (scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES
('924339d0-66c1-4f4c-8834-e6f6365febf9','¿Cuánto cuesta esto?','这个多少钱？','ˈkwanto ˈkwesta ˈesto','Asking price',1),
('924339d0-66c1-4f4c-8834-e6f6365febf9','¿Aceptan tarjetas de crédito?','您们接受信用卡吗？','aθepˈtan tarˈxetas ðe ˈkreðito','Asking payment method',2),
('924339d0-66c1-4f4c-8834-e6f6365febf9','¿Me puede hacer un descuento?','能给我打折吗？','me ˈpweðe aˈθer un desˈkwento','Asking for discount',3),
('924339d0-66c1-4f4c-8834-e6f6365febf9','Quisiera cambiar dinero.','我想换钱。','kiˈsjera kamˈbjar ˈðinero','Currency exchange',4),
('924339d0-66c1-4f4c-8834-e6f6365febf9','Quédese con el cambio.','不用找零了。','ˈkeðese kon el ˈkambio','Telling to keep change',5)
ON CONFLICT DO NOTHING;

-- Job Interview (c3f31338)
INSERT INTO phrases (scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES
('c3f31338-f1d5-4d94-8b9d-ef48dda1cc1b','Hábleme de usted.','请介绍一下您自己。','ˈaβleme ðe usˈteð','Opening interview',1),
('c3f31338-f1d5-4d94-8b9d-ef48dda1cc1b','¿Cuáles son sus principales fortalezas?','您的主要优点是什么？','ˈkwales son sus prinˈθipales fortaˈleθas','Asking about strengths',2),
('c3f31338-f1d5-4d94-8b9d-ef48dda1cc1b','Soy organizado y trabajo bien bajo presión.','我有组织能力，能在压力下工作。','soi orɣaniˈθaðo i traˈβaxo βjen ˈβaxo preˈsjon','Describing work style',3),
('c3f31338-f1d5-4d94-8b9d-ef48dda1cc1b','¿Cuál es el rango salarial?','薪酬范围是多少？','kwal es el ˈraŋɡo salaˈrjal','Asking about salary',4),
('c3f31338-f1d5-4d94-8b9d-ef48dda1cc1b','Muchas gracias por la oportunidad.','非常感谢您给我这个机会。','ˈmutʃas ˈɡraθjas por la oportuˈniðað','Closing interview',5)
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════
-- KOREAN new scenarios phrases
-- ═══════════════════════════════════════
-- Hotel Check-in (91584e8d)
INSERT INTO phrases (scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES
('91584e8d-885b-4775-b1fa-5734ecf467a1','김이라는 이름으로 예약했습니다.','我以金的名义预订了。','gimiraneum ireumeuro yeyakaetsseumnida','Checking in',1),
('91584e8d-885b-4775-b1fa-5734ecf467a1','체크아웃은 몇 시에요?','退房时间是几点？','chekeuaouneun myeot sieyo','Asking checkout time',2),
('91584e8d-885b-4775-b1fa-5734ecf467a1','아침식사가 포함되어 있나요?','含早餐吗？','achimsiksaga pohamdoeeo itnnayo','Asking about breakfast',3),
('91584e8d-885b-4775-b1fa-5734ecf467a1','와이파이 비밀번호가 뭐예요?','Wi-Fi密码是什么？','waipai bimibeonhoga mwoyeyo','Asking for Wi-Fi',4),
('91584e8d-885b-4775-b1fa-5734ecf467a1','짐을 맡겨도 될까요?','可以帮我保管行李吗？','jimeul matgyeodo doelkkayo','Asking to store luggage',5)
ON CONFLICT DO NOTHING;

-- Asking Directions (630b8e6c)
INSERT INTO phrases (scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES
('630b8e6c-ff33-4b48-b786-d79a5780e889','실례합니다, 지하철역이 어디예요?','打扰一下，地铁站在哪里？','sillyeehamnida, jihacheolyeogi eodiyeyo','Asking for subway',1),
('630b8e6c-ff33-4b48-b786-d79a5780e889','신호등에서 왼쪽으로 도세요.','在红绿灯处左转。','sinhodeungeseo oenjjogeuro doseyo','Direction: turn left',2),
('630b8e6c-ff33-4b48-b786-d79a5780e889','여기서 얼마나 멀어요?','离这里有多远？','yeogiseo eolmana meoreyo','Asking distance',3),
('630b8e6c-ff33-4b48-b786-d79a5780e889','길을 잃었어요.','我迷路了。','gireul ireotseoyo','Saying you are lost',4),
('630b8e6c-ff33-4b48-b786-d79a5780e889','지도에서 보여 주실 수 있어요?','您能在地图上指示给我吗？','jidoeseo boyeo jusil su isseoyo','Asking map help',5)
ON CONFLICT DO NOTHING;

-- Medical (789383a2)
INSERT INTO phrases (scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES
('789383a2-3057-4a1b-885a-245921477310','두통과 열이 있어요.','我头痛发烧。','dutongwa yeori isseoyo','Describing symptoms',1),
('789383a2-3057-4a1b-885a-245921477310','페니실린에 알레르기가 있어요.','我对青霉素过敏。','penisirine allereugi ga isseoyo','Stating allergy',2),
('789383a2-3057-4a1b-885a-245921477310','이것을 처방전 없이 살 수 있어요?','这不需要处方就能买吗？','igeos-eul cheobangjeon eobs-i sal su iss-eoyo','Asking OTC availability',3),
('789383a2-3057-4a1b-885a-245921477310','하루에 몇 번 먹어야 해요?','一天要吃几次？','harue myeot beon meogeoya haeyo','Asking dosage',4),
('789383a2-3057-4a1b-885a-245921477310','의사를 빨리 봐야 해요.','我需要尽快看医生。','uisareul ppalli bwaya haeyo','Urgently needing a doctor',5)
ON CONFLICT DO NOTHING;

-- Numbers & Money (e4bf61be)
INSERT INTO phrases (scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES
('e4bf61be-6b4a-4df0-9118-67dd5d468f4c','이거 얼마예요?','这个多少钱？','igeo eolmayeyo','Asking price',1),
('e4bf61be-6b4a-4df0-9118-67dd5d468f4c','신용카드 받으세요?','您接受信用卡吗？','sinyongkadeu badeuseyo','Asking payment method',2),
('e4bf61be-6b4a-4df0-9118-67dd5d468f4c','할인해 주실 수 있어요?','能给我打折吗？','harinhae jusil su isseoyo','Asking for discount',3),
('e4bf61be-6b4a-4df0-9118-67dd5d468f4c','환전하고 싶어요.','我想换钱。','hwanjeonhago sipeoyo','Currency exchange',4),
('e4bf61be-6b4a-4df0-9118-67dd5d468f4c','거스름돈은 괜찮아요.','不用找零了。','geoseureumdoneun gwaenchanayo','Telling to keep change',5)
ON CONFLICT DO NOTHING;

-- Job Interview (93ff0eb1)
INSERT INTO phrases (scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES
('93ff0eb1-6f16-413b-85d7-bc412423fc7d','자기소개를 해 주세요.','请自我介绍一下。','jagi sokaereul hae juseyo','Opening interview',1),
('93ff0eb1-6f16-413b-85d7-bc412423fc7d','본인의 장점이 무엇인가요?','您的优点是什么？','bonin-ui jangjeomi mueosingayo','Asking about strengths',2),
('93ff0eb1-6f16-413b-85d7-bc412423fc7d','저는 팀워크와 압박 속에서도 잘 일합니다.','我擅长团队合作，能在压力下工作。','jeoneun timwokeuwa apbak sogeseo do jal ilhamnida','Describing work style',3),
('93ff0eb1-6f16-413b-85d7-bc412423fc7d','급여 범위가 어떻게 되나요?','薪酬范围是多少？','geubyeo beomwiga eotteoke doenayo','Asking about salary',4),
('93ff0eb1-6f16-413b-85d7-bc412423fc7d','면접 기회를 주셔서 감사합니다.','感谢您给我面试机会。','myeonjeop gihoireul jusyeoseo gamsahamnida','Closing interview',5)
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════
-- ITALIAN scenarios phrases
-- ═══════════════════════════════════════
INSERT INTO phrases (scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES
-- Emergency (d9778dd3)
('d9778dd3-4d2c-40d4-ba98-c2186920013c','Aiuto! Chiamate la polizia!','救命！请叫警察！','aˈjuto ˈkjamɑːte la poˈliːtsia','Calling for emergency help',1),
('d9778dd3-4d2c-40d4-ba98-c2186920013c','Ho bisogno di un medico.','我需要医生。','ɔ biˈzɔɲɲo di un ˈmɛːdiko','Requesting medical help',2),
('d9778dd3-4d2c-40d4-ba98-c2186920013c','Chiamate un''ambulanza.','请叫救护车。','ˈkjamɑːte un ambuˈlantsa','Calling ambulance',3),
('d9778dd3-4d2c-40d4-ba98-c2186920013c','Mi hanno rubato la borsa.','我的包被偷了。','mi ˈɑːnno ruˈbɑːto la ˈbɔrsa','Reporting theft',4),
('d9778dd3-4d2c-40d4-ba98-c2186920013c','Dov''è il commissariato più vicino?','最近的警察局在哪里？','doˈvɛ il kommissaˈrjɑːto pju ˈviːtʃino','Finding police station',5)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES
-- Convenience Store (f31884c1)
('f31884c1-2b25-4982-a455-e37b7655487c','Ha del resto?','您有零钱吗？','a del ˈrɛsto','Asking for change',1),
('f31884c1-2b25-4982-a455-e37b7655487c','Dove si trova il latte?','牛奶在哪里？','ˈdove si ˈtrova il ˈlɑːtte','Finding products',2),
('f31884c1-2b25-4982-a455-e37b7655487c','Una borsa, per favore.','请给我一个袋子。','ˈuna ˈbɔrsa per faˈvore','Requesting a bag',3),
('f31884c1-2b25-4982-a455-e37b7655487c','Quanto costa questo?','这个多少钱？','ˈkwanto ˈkɔsta ˈkwesto','Asking about price',4),
('f31884c1-2b25-4982-a455-e37b7655487c','Posso avere lo scontrino?','我可以有收据吗？','ˈpɔsso aˈvere lo skonˈtriːno','Asking for receipt',5)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES
-- Dining (5a7b8086)
('5a7b8086-be7d-4a7f-88f6-4d67860383ff','Il menù, per favore.','请给我菜单。','il meˈnu per faˈvore','Asking for menu',1),
('5a7b8086-be7d-4a7f-88f6-4d67860383ff','Sono vegetariano/a.','我是素食者。','ˈsono vedʒetaˈrjɑːno/a','Stating dietary preference',2),
('5a7b8086-be7d-4a7f-88f6-4d67860383ff','È delizioso!','太好吃了！','ɛ deliˈtsjoso','Complimenting food',3),
('5a7b8086-be7d-4a7f-88f6-4d67860383ff','Il conto, per favore.','买单，请。','il ˈkonto per faˈvore','Asking for the bill',4),
('5a7b8086-be7d-4a7f-88f6-4d67860383ff','Avete piatti senza glutine?','有无麸质菜肴吗？','aˈvete ˈpjatti ˈsɛntsa ˈɡluːtine','Asking gluten-free',5)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES
-- Hotel (70c12e4b)
('70c12e4b-aafe-464c-aa27-aeb14357c1e3','Ho una prenotazione a nome Rossi.','我以罗西名义预订了。','ɔ ˈuna prenotaˈtsjone a ˈnome ˈrɔssi','Checking in',1),
('70c12e4b-aafe-464c-aa27-aeb14357c1e3','A che ora è il check-out?','退房时间是几点？','a ke ˈora ɛ il ˈtʃekaʊt','Asking checkout time',2),
('70c12e4b-aafe-464c-aa27-aeb14357c1e3','La colazione è inclusa?','含早餐吗？','la kolaˈtsjone ɛ iŋˈklusa','Asking about breakfast',3),
('70c12e4b-aafe-464c-aa27-aeb14357c1e3','Qual è la password del Wi-Fi?','Wi-Fi密码是什么？','kwal ɛ la ˈpasword del ˈwifi','Asking for Wi-Fi',4),
('70c12e4b-aafe-464c-aa27-aeb14357c1e3','Può custodire i miei bagagli?','您能帮我保管行李吗？','pwɔ kuˈstɔːdire i ˈmjɛi baˈɡaʎʎi','Asking to store luggage',5)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES
-- Job Interview IT (c556c721)
('c556c721-3e5d-4d3d-88d4-d296daa5c94b','Mi parli di lei.','请介绍一下您自己。','mi ˈpɑːrli di lɛi','Opening interview',1),
('c556c721-3e5d-4d3d-88d4-d296daa5c94b','Sono orientato al risultato e lavoro bene in team.','我注重结果，善于团队合作。','ˈsono orjenˈtɑːto al riˈzultɑːto e laˈvoro ˈbɛːne in tiːm','Describing work style',2),
('c556c721-3e5d-4d3d-88d4-d296daa5c94b','Qual è la retribuzione prevista?','薪酬是多少？','kwal ɛ la retriˈbuˈtsjone preˈvista','Asking about salary',3),
('c556c721-3e5d-4d3d-88d4-d296daa5c94b','Grazie per questa opportunità.','感谢您给我这个机会。','ˈɡrɑːttsje per ˈkwesta opportuˈnita','Closing interview',4),
('c556c721-3e5d-4d3d-88d4-d296daa5c94b','Quando posso aspettarmi una risposta?','我什么时候能收到回复？','ˈkwando ˈpɔsso aspetˈtɑːrmi ˈuna riˈsposta','Asking about follow-up',5)
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════
-- PORTUGUESE scenarios phrases
-- ═══════════════════════════════════════
INSERT INTO phrases (scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES
-- Emergency PT (a110f670)
('a110f670-9b64-4157-8c10-1c09c7e85304','Socorro! Chame a polícia!','救命！请叫警察！','soˈkoʁu ˈʃɐme a poˈlisia','Calling for emergency help',1),
('a110f670-9b64-4157-8c10-1c09c7e85304','Preciso de um médico.','我需要医生。','pɾeˈsizu dʒi ũ ˈmɛdʒiku','Requesting medical help',2),
('a110f670-9b64-4157-8c10-1c09c7e85304','Chame uma ambulância.','请叫救护车。','ˈʃɐme ˈuma ɐ̃buˈlɐ̃sjɐ','Calling ambulance',3),
('a110f670-9b64-4157-8c10-1c09c7e85304','Minha bolsa foi roubada.','我的包被偷了。','ˈmiɲɐ ˈbowsɐ foj ʁoˈbadɐ','Reporting theft',4),
('a110f670-9b64-4157-8c10-1c09c7e85304','Onde fica a delegacia mais próxima?','最近的警察局在哪里？','ˈõdʒi ˈfikɐ a delegaˈsiɐ majʃ ˈpɾɔsimɐ','Finding police station',5)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES
-- Dining PT (ed35c289)
('ed35c289-7c40-4495-9b53-ff887c5e08b6','O cardápio, por favor.','请给我菜单。','u kaʁˈdapju poʁ faˈvoʁ','Asking for menu',1),
('ed35c289-7c40-4495-9b53-ff887c5e08b6','Sou vegetariano/a.','我是素食者。','so veʒetaˈrjɐnu/a','Stating dietary preference',2),
('ed35c289-7c40-4495-9b53-ff887c5e08b6','Está delicioso!','太好吃了！','esˈta deliˈsjozu','Complimenting food',3),
('ed35c289-7c40-4495-9b53-ff887c5e08b6','A conta, por favor.','买单，请。','a ˈkõtɐ poʁ faˈvoʁ','Asking for the bill',4),
('ed35c289-7c40-4495-9b53-ff887c5e08b6','Vocês têm pratos sem glúten?','有无麸质菜肴吗？','voˈses tẽj ˈpɾatuʃ sẽj ˈɡlutẽj','Asking gluten-free',5)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES
-- Job Interview PT (ed458bfb)
('ed458bfb-d648-4e59-a3ca-dcc8ab2da7d7','Fale sobre você.','请介绍一下您自己。','ˈfali ˈsobɾi voˈse','Opening interview',1),
('ed458bfb-d648-4e59-a3ca-dcc8ab2da7d7','Sou proativo e trabalho bem sob pressão.','我积极主动，能在压力下工作。','so pɾoaˈtivu i tɾaˈbaʎu bẽj sobe pɾeˈsɐ̃w','Describing work style',2),
('ed458bfb-d648-4e59-a3ca-dcc8ab2da7d7','Qual é a faixa salarial?','薪酬范围是多少？','kwaw ɛ a ˈfajʃɐ salaˈɾjaw','Asking about salary',3),
('ed458bfb-d648-4e59-a3ca-dcc8ab2da7d7','Obrigado pela oportunidade.','感谢您给我这个机会。','obɾiˈɡadu ˈpelɐ opotuniˈdadʒi','Closing interview',4),
('ed458bfb-d648-4e59-a3ca-dcc8ab2da7d7','Quando terei uma resposta?','我什么时候能收到回复？','ˈkwɐ̃du teˈɾei ˈumɐ ʁesˈposta','Asking about follow-up',5)
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════
-- ARABIC scenarios phrases
-- ═══════════════════════════════════════
INSERT INTO phrases (scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES
-- Emergency AR (48d611a4)
('48d611a4-c599-4997-bdc3-2deee3087221','النجدة! اتصل بالشرطة!','救命！请叫警察！','an-najda! ittasal biʃʃurṭa!','Calling for emergency help',1),
('48d611a4-c599-4997-bdc3-2deee3087221','أحتاج إلى طبيب.','我需要医生。','aħtɑːdʒ ʔilɑː ṭabiːb','Requesting medical help',2),
('48d611a4-c599-4997-bdc3-2deee3087221','اتصل بسيارة الإسعاف.','请叫救护车。','ittasal bisayyɑːrat al-isʕɑːf','Calling ambulance',3),
('48d611a4-c599-4997-bdc3-2deee3087221','سُرقت حقيبتي.','我的包被偷了。','suriqa ħaˈqiːbati','Reporting theft',4),
('48d611a4-c599-4997-bdc3-2deee3087221','أين أقرب مركز للشرطة؟','最近的警察局在哪里？','ʔajna ʔaqrab markaz liʃʃurṭa','Finding police station',5)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES
-- Dining AR (bda7adbf)
('bda7adbf-7fc8-4e32-97f4-69979f2611f7','القائمة من فضلك.','请给我菜单。','alqɑːʔima min fadˈlak','Asking for menu',1),
('bda7adbf-7fc8-4e32-97f4-69979f2611f7','أنا نباتي.','我是素食者。','ʔana nabɑːti','Stating dietary preference',2),
('bda7adbf-7fc8-4e32-97f4-69979f2611f7','هذا لذيذ جداً!','太好吃了！','hɑːðɑː laðiːð dʒiddan','Complimenting food',3),
('bda7adbf-7fc8-4e32-97f4-69979f2611f7','الحساب من فضلك.','买单，请。','alħisɑːb min fadˈlak','Asking for the bill',4),
('bda7adbf-7fc8-4e32-97f4-69979f2611f7','هل لديكم أطباق خالية من الغلوتين؟','有无麸质菜肴吗？','hal ladaikum ʔaṭbɑːq xɑːlija min alɣluːtiːn','Asking gluten-free',5)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES
-- Job Interview AR (77563a70)
('77563a70-0e2c-401b-af5c-7d741101e120','حدثني عن نفسك.','请介绍一下您自己。','ħaddiθni ʕan nafsak','Opening interview',1),
('77563a70-0e2c-401b-af5c-7d741101e120','أنا شخص يعمل بروح الفريق ويتحمل الضغط.','我有团队精神，能承受压力。','ʔana ʃaxs yaʕmal biruːħ alfariːq wa yataħammal aḍḍaɣṭ','Describing work style',2),
('77563a70-0e2c-401b-af5c-7d741101e120','ما هو نطاق الراتب؟','薪酬范围是多少？','mɑː huwa niṭɑːq arrɑːtib','Asking about salary',3),
('77563a70-0e2c-401b-af5c-7d741101e120','شكراً جزيلاً على هذه الفرصة.','非常感谢您给我这个机会。','ʃukran dʒaziːlan ʕalɑː hɑːðihi alfursa','Closing interview',4),
('77563a70-0e2c-401b-af5c-7d741101e120','متى سأتلقى رداً؟','我什么时候能收到回复？','matɑː saʔatallaqa raddan','Asking about follow-up',5)
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════
-- CHINESE ADVANCED scenarios phrases
-- ═══════════════════════════════════════
INSERT INTO phrases (scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES
-- Business Meetings (1c081dda)
('1c081dda-ecff-4a64-8139-c320e75550e7','请允许我简要介绍一下本次会议的议程。','请允许我简要介绍一下本次会议的议程。','qǐng yǔnxǔ wǒ jiǎnyào jièshào yīxià běncì huìyì de yìchéng','Opening a meeting professionally',1),
('1c081dda-ecff-4a64-8139-c320e75550e7','我们的核心目标是提升市场份额。','我们的核心目标是提升市场份额。','wǒmen de héxīn mùbiāo shì tíshēng shìchǎng fèn''é','Stating business objectives',2),
('1c081dda-ecff-4a64-8139-c320e75550e7','请问您对此方案有何看法？','请问您对此方案有何看法？','qǐngwèn nín duì cǐ fāng''àn yǒu hé kànfǎ','Seeking opinions professionally',3),
('1c081dda-ecff-4a64-8139-c320e75550e7','我们需要就此达成共识。','我们需要就此达成共识。','wǒmen xūyào jiù cǐ dáchéng gòngshí','Reaching consensus',4),
('1c081dda-ecff-4a64-8139-c320e75550e7','感谢各位的积极参与，会议到此结束。','感谢各位的积极参与，会议到此结束。','gǎnxiè gèwèi de jījí cānyù, huìyì dào cǐ jiéshù','Closing a meeting',5)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES
-- Cultural Idioms (57fb4d47)
('57fb4d47-d535-4148-b0ef-5fa5dab1e084','一石二鸟——一个行动达到两个目的。','一石二鸟——一个行动达到两个目的。','yī shí èr niǎo — yīgè xíngdòng dádào liǎng gè mùdì','Idiom: kill two birds with one stone',1),
('57fb4d47-d535-4148-b0ef-5fa5dab1e084','亡羊补牢——犯错后及时补救。','亡羊补牢——犯错后及时补救。','wáng yáng bǔ láo — fàncuò hòu jíshí bǔjiù','Idiom: better late than never to fix mistakes',2),
('57fb4d47-d535-4148-b0ef-5fa5dab1e084','半途而废——做事不能半途放弃。','半途而废——做事不能半途放弃。','bàntú ér fèi — zuòshì bùnéng bàntú fàngqì','Idiom: giving up halfway',3),
('57fb4d47-d535-4148-b0ef-5fa5dab1e084','胸有成竹——做事前已有充分准备。','胸有成竹——做事前已有充分准备。','xiōng yǒu chéngzhú — zuòshì qián yǐ yǒu chōngfèn zhǔnbèi','Idiom: having a plan ready',4),
('57fb4d47-d535-4148-b0ef-5fa5dab1e084','马到成功——祝愿事情能立刻成功。','马到成功——祝愿事情能立刻成功。','mǎ dào chénggōng — zhùyuàn shìqíng néng lìkè chénggōng','Idiom: wishing immediate success',5)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES
-- Tech & Innovation (e23bf61b)
('e23bf61b-7470-49dd-aba5-e79f6333395c','人工智能正在深刻改变各行各业。','人工智能正在深刻改变各行各业。','réngōng zhìnéng zhèngzài shēnkè gǎibiàn gè háng gè yè','AI changing industries',1),
('e23bf61b-7470-49dd-aba5-e79f6333395c','云计算使企业能够弹性扩展基础设施。','云计算使企业能够弹性扩展基础设施。','yún jìsuàn shǐ qǐyè nénggòu tánxìng kuòzhǎn jīchǔ shèshī','Cloud computing',2),
('e23bf61b-7470-49dd-aba5-e79f6333395c','数据安全是数字化转型的核心挑战。','数据安全是数字化转型的核心挑战。','shùjù ānquán shì shùzìhuà zhuǎnxíng de héxīn tiǎozhàn','Data security challenges',3),
('e23bf61b-7470-49dd-aba5-e79f6333395c','区块链技术提供了去中心化的解决方案。','区块链技术提供了去中心化的解决方案。','qūkuàiliàn jìshù tígōngle qù zhōngxīnhuà de jiějué fāng''àn','Blockchain technology',4),
('e23bf61b-7470-49dd-aba5-e79f6333395c','可持续发展是科技创新的重要方向。','可持续发展是科技创新的重要方向。','kě chíxù fāzhǎn shì kējì chuàngxīn de zhòngyào fāngxiàng','Sustainable tech innovation',5)
ON CONFLICT DO NOTHING;
