/*
  # Virtual Radio Station & User Profession System

  1. New Tables
    - `radio_content`
      - id (uuid, pk)
      - lang_code (text) — target language
      - radio_type (text) — news | music | story | business | academic
      - profession (text, nullable) — finance | medical | tech | law | education | travel | null (general)
      - title (text)
      - content_text (text) — script/transcript
      - duration (integer) — seconds
      - difficulty (text) — beginner | intermediate | advanced
      - order_index (integer)
      - created_at (timestamptz)

  2. Modified Tables
    - `user_profiles` — adds `profession` column if not exists

  3. Security
    - RLS enabled on radio_content (public read, no write from client)
    - RLS policy allows all authenticated users to read

  4. Seed Data
    - 3+ content items per language × 5 types for ja, en, ko, fr, es (sample set)
    - Will be extended per language in follow-up migrations
*/

-- Create radio_content table
CREATE TABLE IF NOT EXISTS radio_content (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lang_code   text NOT NULL,
  radio_type  text NOT NULL DEFAULT 'news',
  profession  text,
  title       text NOT NULL,
  content_text text NOT NULL,
  duration    integer NOT NULL DEFAULT 60,
  difficulty  text NOT NULL DEFAULT 'beginner',
  order_index integer NOT NULL DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE radio_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read radio content"
  ON radio_content FOR SELECT
  TO authenticated
  USING (true);

-- Add profession to user_profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'profession'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN profession text DEFAULT '';
  END IF;
END $$;

-- Seed radio content (Japanese)
INSERT INTO radio_content (lang_code, radio_type, title, content_text, duration, difficulty, order_index) VALUES
-- News
('ja', 'news', '今日のニュース：東京の天気', '皆さん、おはようございます。今日の東京の天気をお伝えします。本日は晴れのち曇りで、最高気温は二十三度の予報です。朝は少し肌寒いですが、日中は過ごしやすい陽気になるでしょう。週末にかけて雨が予想されますので、お出かけの際は傘をお持ちください。それでは次のニュースへ参ります。', 45, 'beginner', 1),
('ja', 'news', '経済ニュース：円相場の動向', '今日の外国為替市場では、円ドル相場が一ドル百四十七円台で推移しています。日本銀行の政策発表を前に、投資家の間で様子見ムードが広がっています。専門家は今後の金融政策の方向性が為替に大きく影響すると分析しています。', 40, 'intermediate', 2),
('ja', 'news', 'テクノロジーニュース：AI技術の最新動向', '人工知能技術の急速な発展が、様々な産業に変革をもたらしています。特に医療分野では、AIによる画像診断の精度が向上し、早期発見率が大幅に改善されたと報告されています。一方で、AIの普及に伴う雇用への影響についても議論が続いています。', 50, 'advanced', 3),
-- Music
('ja', 'music', '日本の音楽紹介：J-POPの世界', 'こんにちは！今日は日本のポップ音楽、いわゆるJ-POPについてご紹介します。J-POPは一九九〇年代から日本の音楽シーンを席巻し、今ではアジア全体に多大な影響を与えています。代表的なアーティストには宇多田ヒカルや米津玄師などがいます。彼らの楽曲は日常生活の喜びや悲しみを美しいメロディーに乗せて表現しています。', 55, 'intermediate', 1),
-- Story
('ja', 'story', '短編物語：桜の木の下で', '春の午後、公園の桜の木の下で、田中さんは一冊の本を読んでいました。ピンク色の花びらが風に舞い、静かに本のページの上に落ちてきました。「きれいだな」と彼女はつぶやきました。その時、隣のベンチに座っていた老人が話しかけてきました。「毎年この時期に来るんですよ。五十年前、妻と初めて会ったのもここでしてね」老人の瞳には、遠い昔の幸せな記憶が輝いていました。', 70, 'intermediate', 1),
-- Business
('ja', 'business', 'ビジネス日本語：会議の進め方', 'ビジネスの場では、会議を円滑に進めることが重要です。まず、会議の開始時に議題と目標を明確にしましょう。「本日の議題は三点です。一つ目は来月のプロジェクト計画、二つ目は予算の確認、三つ目は役割分担についてです」このように整理することで、参加者全員が共通認識を持つことができます。発言する際は「〜についてですが」「〜と考えますが、いかがでしょうか」などの表現を使うと丁寧に意見を述べることができます。', 80, 'intermediate', 1),
-- Academic
('ja', 'academic', '日本語学習：敬語の使い方', '本日は日本語の敬語システムについて解説します。日本語の敬語には大きく分けて三種類あります。尊敬語、謙譲語、そして丁寧語です。尊敬語は相手の動作を高めて表現します。例えば「食べる」は「召し上がる」になります。謙譲語は自分の動作を低く表現します。「食べる」は「いただく」です。この区別を正しく使うことで、日本人と自然なコミュニケーションができるようになります。', 75, 'advanced', 1)
ON CONFLICT DO NOTHING;

-- Seed radio content (English)
INSERT INTO radio_content (lang_code, radio_type, title, content_text, duration, difficulty, order_index) VALUES
('en', 'news', 'Daily News: City Updates', 'Good morning, everyone. Here are today''s top stories. The city council has approved a new transportation plan that will add fifteen new bus routes across the metropolitan area. Officials say this will reduce traffic congestion by an estimated twenty percent over the next three years. In other news, local schools will begin their summer break next Friday. Parents are encouraged to register their children for summer learning programs at the community center.', 55, 'beginner', 1),
('en', 'news', 'Technology News: Renewable Energy', 'Global investment in renewable energy has reached a record high this year, according to a new report from the International Energy Agency. Solar and wind power installations have doubled compared to last year, driven by falling costs and government incentives. Experts predict that renewable energy could account for forty percent of global electricity generation by the end of the decade. However, challenges remain in energy storage and grid infrastructure.', 50, 'intermediate', 2),
('en', 'music', 'Music Around the World: Global Fusion', 'Welcome to our music segment! Today we''re exploring the fascinating world of global fusion music. Artists are increasingly blending traditional sounds with contemporary beats to create something entirely new. From Korean traditional instruments fused with hip-hop to African rhythms combined with electronic music, the results are breathtaking. This cross-cultural exchange not only creates beautiful music but also helps preserve traditional musical heritage for future generations.', 60, 'intermediate', 1),
('en', 'story', 'Short Story: The Old Bookshop', 'The little bookshop on Maple Street had been there longer than anyone could remember. Every afternoon, old Mr. Chen would sit behind the counter, reading the same worn copy of a book whose title had long since faded from the cover. One rainy Tuesday, a young girl rushed in to escape the downpour. "Sorry!" she gasped, shaking water from her umbrella. Mr. Chen looked up and smiled. "Take your time," he said. "The rain always brings the best customers."', 65, 'intermediate', 1),
('en', 'business', 'Business English: Professional Emails', 'Writing professional emails is an essential skill in today''s workplace. A well-structured email should have a clear subject line, a proper greeting, concise body text, and an appropriate closing. Always begin with "Dear Mr./Ms. [Last Name]" for formal correspondence, or "Hi [First Name]" for less formal situations. Be direct and get to the point quickly. Avoid using casual language or abbreviations in professional contexts. End with "Best regards" or "Sincerely" followed by your name and title.', 70, 'beginner', 1),
('en', 'academic', 'Academic English: Essay Structure', 'An effective academic essay consists of three main parts: the introduction, the body, and the conclusion. The introduction should present your topic and end with a clear thesis statement. The body paragraphs each focus on one main idea that supports your thesis, using evidence and examples. Each paragraph should begin with a topic sentence. The conclusion summarizes your main points and restates the thesis in different words. Using transition words like "furthermore," "however," and "consequently" helps guide your reader through your argument.', 80, 'advanced', 1)
ON CONFLICT DO NOTHING;

-- Seed radio content (Korean)
INSERT INTO radio_content (lang_code, radio_type, title, content_text, duration, difficulty, order_index) VALUES
('ko', 'news', '오늘의 뉴스: 서울 날씨', '안녕하세요, 여러분. 오늘의 날씨를 전해드리겠습니다. 서울의 오늘 최고 기온은 24도로 예상되며, 맑고 화창한 날씨가 이어지겠습니다. 다만 오후 늦게부터 남쪽 지방을 중심으로 소나기가 내릴 가능성이 있으니 외출 시 우산을 챙기시기 바랍니다. 내일은 전국적으로 흐린 날씨가 예보되어 있습니다.', 45, 'beginner', 1),
('ko', 'story', '단편 소설: 봄날의 카페', '서울 골목의 작은 카페에서 지민 씨는 창밖을 바라보고 있었습니다. 벚꽃이 흩날리는 거리를 지나가는 사람들을 보며, 그녀는 문득 고향이 떠올랐습니다. "아메리카노 한 잔이요." 낯선 목소리에 고개를 돌리니, 웃는 얼굴의 청년이 서 있었습니다. "여기 자주 오세요?" 청년이 물었습니다. "오늘 처음이에요. 그런데 왠지 오래된 것 같아요." 그녀가 대답했습니다. 봄날의 작은 우연이 큰 이야기의 시작이 될 수도 있겠다고, 지민 씨는 생각했습니다.', 70, 'intermediate', 1),
('ko', 'business', '비즈니스 한국어: 전화 응대', '안녕하세요. 오늘은 비즈니스 전화 응대 방법에 대해 알아보겠습니다. 전화를 받을 때는 "안녕하세요, 〇〇 회사 〇〇 입니다"라고 소속과 이름을 밝히는 것이 기본입니다. 상대방의 말을 듣고 이해했다는 표시로 "네, 알겠습니다" 또는 "네, 확인하겠습니다"를 자주 사용합니다. 통화를 마칠 때는 "감사합니다. 좋은 하루 되세요"로 마무리하면 좋습니다. 메모를 남길 때는 "성함과 연락처를 남겨 주시겠어요?"라고 정중하게 부탁드립니다.', 65, 'intermediate', 1)
ON CONFLICT DO NOTHING;

-- Seed radio content (French)
INSERT INTO radio_content (lang_code, radio_type, title, content_text, duration, difficulty, order_index) VALUES
('fr', 'news', 'Les nouvelles du jour: Météo à Paris', 'Bonjour à tous et à toutes. Voici les informations météorologiques pour aujourd''hui. À Paris, il fera beau ce matin avec des températures autour de dix-neuf degrés. Cet après-midi, des nuages feront leur apparition, mais la pluie ne devrait pas tomber avant ce soir. Pour le week-end, des averses sont prévues samedi, mais dimanche sera de nouveau ensoleillé. N''oubliez pas votre parapluie si vous sortez demain soir!', 50, 'beginner', 1),
('fr', 'story', 'Histoire courte: Le café du coin', 'Tous les matins à sept heures, Monsieur Leblanc prenait son café au bar du coin. Il commandait toujours la même chose: un espresso serré et un croissant. Ce matin-là, une jeune femme était assise à sa place habituelle, le nez plongé dans un épais roman. Monsieur Leblanc s''installa à la table voisine. "C''est bien, ce livre?" demanda-t-il timidement. La jeune femme leva les yeux et sourit. "C''est le meilleur que j''aie jamais lu. Vous voulez que je vous le prête quand j''aurai terminé?"', 65, 'intermediate', 1),
('fr', 'business', 'Français des affaires: Les réunions', 'Dans le monde professionnel francophone, les réunions suivent souvent un protocole précis. On commence généralement par un tour de table où chaque participant se présente brièvement. Le président de séance annonce ensuite l''ordre du jour: "Nous avons trois points à aborder aujourd''hui." Pour prendre la parole poliment, on peut dire "Si vous me permettez" ou "Je voudrais ajouter que". En conclusion, on résume les décisions prises et on fixe les prochaines étapes avec des délais clairs.', 75, 'intermediate', 1)
ON CONFLICT DO NOTHING;

-- Seed radio content (Spanish)
INSERT INTO radio_content (lang_code, radio_type, title, content_text, duration, difficulty, order_index) VALUES
('es', 'news', 'Noticias del día: El tiempo en Madrid', '¡Buenos días a todos! Les presentamos el pronóstico del tiempo para Madrid. Hoy tendremos un día soleado con temperaturas que alcanzarán los veinticinco grados por la tarde. Sin embargo, para el fin de semana se esperan lluvias moderadas en toda la región central. Recuerden llevar paraguas si tienen planes para el sábado. En el norte del país, las temperaturas serán más frescas, rondando los dieciocho grados.', 48, 'beginner', 1),
('es', 'story', 'Cuento corto: La plaza del mercado', 'Cada domingo, doña Carmen llegaba temprano al mercado de la plaza. Con su cesta de mimbre en el brazo, saludaba a los vendedores de siempre. "¿Cómo están los tomates hoy, Miguel?" "Fresquísimos, doña Carmen, llegaron esta mañana de la huerta." Mientras escogía las verduras, doña Carmen pensaba que estos momentos eran los mejores de su semana. No era solo la compra; era el ritual, las conversaciones, los olores, la vida misma concentrada en aquella pequeña plaza llena de color y de voces.', 68, 'intermediate', 1),
('es', 'business', 'Español de negocios: Presentaciones profesionales', 'Hacer una buena presentación en el ámbito empresarial hispanohablante requiere preparación y conocimiento cultural. Es importante comenzar con un saludo formal: "Buenos días, señoras y señores." Luego preséntese claramente: "Me llamo Ana García y represento a nuestra empresa." Durante la presentación, use frases como "Como pueden observar en este gráfico" o "Los datos muestran que." Al concluir, siempre agradezca la atención: "Muchas gracias por su tiempo y atención. Estaré encantada de responder sus preguntas."', 72, 'intermediate', 1)
ON CONFLICT DO NOTHING;

-- Seed content for remaining languages (de, it, pt, ar, zh) - 2 entries each
INSERT INTO radio_content (lang_code, radio_type, title, content_text, duration, difficulty, order_index) VALUES
-- German
('de', 'news', 'Nachrichten: Das Wetter in Berlin', 'Guten Morgen, meine Damen und Herren. Hier sind die Wetteraussichten für heute. In Berlin erwartet uns ein bewölkter Tag mit gelegentlichen Regenschauern. Die Höchsttemperaturen liegen bei etwa siebzehn Grad. Im Süden Deutschlands, besonders in Bayern, wird es sonniger sein mit Temperaturen bis zu zweiundzwanzig Grad. Am Wochenende soll das Wetter besser werden, und wir können uns auf mehr Sonnenstunden freuen. Nehmen Sie heute Ihren Regenschirm mit!', 52, 'beginner', 1),
('de', 'story', 'Kurzgeschichte: Der alte Brunnen', 'In dem kleinen Dorf Waldbach gab es einen alten Brunnen auf dem Marktplatz. Die Dorfbewohner sagten, wer eine Münze hineinwirft und einen Wunsch macht, dem gehe der Wunsch in Erfüllung. Klein Emma glaubte fest daran. An ihrem achten Geburtstag warf sie ihre einzige Münze in den Brunnen und wünschte sich, dass ihre kranke Großmutter wieder gesund wird. Drei Wochen später saß Oma Helene wieder an ihrem Küchentisch und backte Apfelkuchen. Emma lächelte und war überzeugt: Der Brunnen hatte zugehört.', 65, 'intermediate', 1),
-- Italian
('it', 'news', 'Notizie del giorno: Il tempo a Roma', 'Buongiorno a tutti! Ecco le previsioni del tempo per oggi. A Roma la giornata si preannuncia soleggiata con temperature massime intorno ai ventidue gradi. Venti leggeri soffieranno dal nord nella mattinata. Al Sud invece ci aspettano cieli più nuvolosi con possibilità di qualche temporale pomeridiano. Il fine settimana porterà un miglioramento generale delle condizioni atmosferiche su tutta la penisola. Buona giornata!', 48, 'beginner', 1),
('it', 'story', 'Racconto breve: La trattoria della nonna', 'La trattoria di nonna Giuseppina era famosa in tutto il quartiere per le sue tagliatelle fatte a mano. Ogni mattina, alle sei, la nonna iniziava a impastare la farina con le uova fresche del suo pollaio. "Il segreto," diceva sempre ai nipoti, "è l''amore che metti nell''impasto." Una sera, un critico gastronomico di una famosa rivista entrò per caso nel locale. Assaggiò le tagliatelle al ragù e rimase in silenzio per un momento. Poi disse lentamente: "Signora, è la pasta più buona che abbia mai mangiato in tutta la mia vita."', 70, 'intermediate', 1),
-- Portuguese
('pt', 'news', 'Notícias do dia: O tempo no Brasil', 'Bom dia, telespectadores! Aqui estão as previsões do tempo para hoje. No Rio de Janeiro, esperamos um dia ensolarado com temperaturas chegando aos trinta graus à tarde. Atenção para o calor intenso e use protetor solar se for sair. Em São Paulo, o dia começará nublado, com possibilidade de chuvas à tarde. No Sul do país, temperaturas mais amenas, em torno de vinte graus, com céu parcialmente nublado. Tenham todos um excelente dia!', 50, 'beginner', 1),
('pt', 'story', 'Conto curto: A livraria do seu João', 'No centro velho da cidade, entre uma padaria e uma loja de flores, ficava a livraria do seu João. As prateleiras iam do chão ao teto, repletas de livros de todas as épocas e assuntos. Certa tarde, uma menina entrou procurando um livro para o seu aniversário. "Quero uma aventura que nunca tenha lido antes", ela disse. Seu João olhou para ela por um longo momento, depois subiu uma escadinha e tirou um livro desbotado de uma prateleira alta. "Este aqui," disse ele com um sorriso, "foi escrito exatamente para você."', 68, 'intermediate', 1),
-- Arabic
('ar', 'news', 'أخبار اليوم: الطقس في القاهرة', 'صباح الخير أيها المستمعون الكرام. إليكم نشرة الأحوال الجوية ليوم اليوم. في القاهرة، من المتوقع أن تكون السماء صافية مع درجات حرارة تصل إلى ثمانية وعشرين درجة مئوية. في الإسكندرية، ستكون الرياح خفيفة مع بعض الغيوم المتفرقة. في شبه جزيرة سيناء، قد تكون هناك رياح أقوى في المناطق الساحلية. نتمنى لكم يوماً مشمساً وجميلاً.', 45, 'beginner', 1),
('ar', 'story', 'قصة قصيرة: الحكواتي العجوز', 'في أحد أحياء دمشق القديمة، كان يجلس حكواتي عجوز في المقهى كل مساء. كان يرتدي عباءة بنية اللون ويمسك بيده عصا منحوتة. حين يبدأ بالكلام، يصمت الجميع. ذات مساء، جاء شاب غريب إلى المقهى وسأل: "من أنت أيها الشيخ؟" ابتسم الحكواتي وقال: "أنا حارس الحكايات. كل قصة تُنسى تموت مرتين. لكن ما دمت أحكيها، تبقى حية إلى الأبد." التفت الشاب وأدرك أنه سيبقى في هذا المقهى طويلاً.', 72, 'intermediate', 1),
-- Chinese Advanced
('zh', 'news', '今日新闻：北京天气预报', '听众朋友们，大家早上好。下面为您播报今日北京天气。今天北京地区以多云为主，最高气温二十二度，最低气温十四度。受冷空气影响，明日气温将有所下降，请注意适时增添衣物。周末北京将迎来今年秋季第一场雨，建议市民出行时携带雨具。目前空气质量良好，适宜户外活动。以上是今日天气预报，感谢您的收听。', 48, 'beginner', 1),
('zh', 'story', '短篇故事：老茶馆里的故事', '成都老城区有一家已经开了七十年的茶馆。每天清晨，老板陈大爷就会打开那扇吱呀作响的木门，烧上一壶清水，等待老茶客们的到来。来这里的人各种各样——有退休的老教授、有卖菜的小贩、有大学生、有游客。但奇怪的是，所有人来到这里，都会不自觉地放慢节奏，说话声音也会变低。"这茶里有什么秘诀吗？"一次，有个年轻人问道。陈大爷笑而不答，只是慢慢地续上了热水。也许，有些东西不需要解释，用心体会就好。', 75, 'intermediate', 1)
ON CONFLICT DO NOTHING;
