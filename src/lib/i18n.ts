// UI language translations
// Keys are semantic identifiers; values are display strings per UI language.
// Learning *content* (vocab cards, sentences, game questions) is NOT translated here —
// it always comes from the database in the target language.

export type UILang = 'zh' | 'en' | 'ja' | 'ko' | 'fr' | 'es' | 'de';

export const UI_LANG_OPTIONS: { code: UILang; label: string; native: string }[] = [
  { code: 'zh', label: '中文',       native: '中文（简体）' },
  { code: 'en', label: 'English',    native: 'English' },
  { code: 'ja', label: '日本語',     native: '日本語' },
  { code: 'ko', label: '한국어',     native: '한국어' },
  { code: 'fr', label: 'Français',   native: 'Français' },
  { code: 'es', label: 'Español',    native: 'Español' },
  { code: 'de', label: 'Deutsch',    native: 'Deutsch' },
];

export interface Strings {
  // ── Bottom navigation ──
  nav_path:    string;
  nav_game:    string;
  nav_ai:      string;
  nav_radio:   string;
  nav_circle:  string;
  nav_profile: string;

  // ── Top bar ──
  checkin_today:   string;
  streak_days:     string;
  lang_selector:   string;
  select_lang:     string;

  // ── Feature strip ──
  feature_game:    string;
  feature_game_sub: string;
  feature_grammar:  string;
  feature_grammar_sub: string;
  feature_radio:    string;
  feature_radio_sub: string;
  feature_partner:  string;
  feature_partner_sub: string;
  feature_member:   string;
  feature_member_sub: string;

  // ── Game Arena ──
  game_arena_title:  string;
  game_start:        string;
  game_next:         string;
  game_result:       string;
  game_play_again:   string;
  game_back:         string;
  game_score:        string;
  game_time:         string;
  game_correct:      string;
  game_wrong:        string;

  // Game names
  game_word_match:   string;
  game_sentence:     string;
  game_word_hunter:  string;
  game_grammar_cube: string;
  game_escape:       string;
  game_grammar_planet: string;
  game_buddy_chat:   string;

  // ── AI Assistant tabs ──
  ai_camera:   string;
  ai_voice:    string;
  ai_text:     string;
  ai_chat:     string;
  ai_title:    string;

  // ── Profile / Personal Center ──
  profile_title:       string;
  profile_invite_code: string;
  profile_earnings:    string;
  profile_withdraw:    string;
  profile_settings:    string;
  profile_privacy:     string;
  profile_theme:       string;
  profile_ui_lang:     string;
  profile_reset:       string;
  profile_level:       string;
  profile_goal:        string;

  // ── Privacy Settings ──
  privacy_title:         string;
  privacy_discover:      string;
  privacy_merchant_push: string;
  privacy_group_invite:  string;
  privacy_notifications: string;
  privacy_pause_all:     string;

  // ── Member Center ──
  member_title:       string;
  member_subscribe:   string;
  member_upgrade:     string;

  // ── Daily Checkin ──
  checkin_title:   string;
  checkin_done:    string;
  checkin_streak:  string;
  checkin_reward:  string;

  // ── Common buttons ──
  btn_confirm:  string;
  btn_cancel:   string;
  btn_start:    string;
  btn_skip:     string;
  btn_save:     string;
  btn_back:     string;
  btn_close:    string;
  btn_continue: string;
  btn_submit:   string;
  btn_retry:    string;
  btn_done:     string;
  btn_next:     string;

  // ── Study Circle ──
  circle_title:   string;
  circle_join:    string;
  circle_create:  string;
  circle_members: string;

  // ── Partner Hub ──
  partner_title:  string;
  partner_match:  string;
  partner_online: string;

  // ── Onboarding ──
  ob_welcome:       string;
  ob_native_label:  string;
  ob_target_label:  string;
  ob_ui_lang_label: string;
  ob_continue:      string;
  ob_back:          string;
  ob_goal_title:    string;
  ob_age_title:     string;
  ob_interest_title: string;
  ob_basis_title:   string;
  ob_zero_basis:    string;
  ob_test_basis:    string;

  // ── Misc ──
  hearts_empty:  string;
  loading:       string;
  error_generic: string;
}

const ZH: Strings = {
  nav_path: '路线', nav_game: '游戏', nav_ai: 'AI助手', nav_radio: '电台',
  nav_circle: '学习圈', nav_profile: '我的',
  checkin_today: '今日打卡', streak_days: '连续天数', lang_selector: '选择语言',
  select_lang: '选择学习语言',
  feature_game: 'Game Arena', feature_game_sub: '游戏学习场',
  feature_grammar: 'Grammar', feature_grammar_sub: '语法词汇',
  feature_radio: '虚拟电台', feature_radio_sub: '听力训练',
  feature_partner: '语伴匹配', feature_partner_sub: '双向互教',
  feature_member: '会员中心', feature_member_sub: '订阅管理',
  game_arena_title: '游戏场', game_start: '开始游戏', game_next: '下一题',
  game_result: '结果', game_play_again: '再来一次', game_back: '返回',
  game_score: '得分', game_time: '用时', game_correct: '正确', game_wrong: '错误',
  game_word_match: '连线消消乐', game_sentence: '拼图连词成句',
  game_word_hunter: '单词猎人', game_grammar_cube: '语法魔方',
  game_escape: '密室逃脱', game_grammar_planet: '语法星球',
  game_buddy_chat: '语伴对话',
  ai_camera: '拍照解题', ai_voice: '语音问答', ai_text: '文字问答',
  ai_chat: '陪伴聊天', ai_title: 'AI 助手',
  profile_title: '个人中心', profile_invite_code: '我的邀请码',
  profile_earnings: '收益看板', profile_withdraw: '提现',
  profile_settings: '设置', profile_privacy: '隐私设置',
  profile_theme: '主题切换', profile_ui_lang: '界面语言',
  profile_reset: '重置问卷', profile_level: '我的等级', profile_goal: '学习目标',
  privacy_title: '隐私设置', privacy_discover: '允许被陌生用户发现',
  privacy_merchant_push: '允许商家向我推送', privacy_group_invite: '允许被拉入非好友群',
  privacy_notifications: '学习圈消息提醒', privacy_pause_all: '一键暂停所有陌生互动',
  member_title: '会员中心', member_subscribe: '订阅', member_upgrade: '升级会员',
  checkin_title: '每日打卡', checkin_done: '今日已打卡', checkin_streak: '连续',
  checkin_reward: '获得奖励',
  btn_confirm: '确认', btn_cancel: '取消', btn_start: '开始', btn_skip: '跳过',
  btn_save: '保存', btn_back: '返回', btn_close: '关闭', btn_continue: '继续',
  btn_submit: '提交', btn_retry: '重试', btn_done: '完成', btn_next: '下一步',
  circle_title: '学习圈', circle_join: '加入圈子', circle_create: '创建圈子',
  circle_members: '成员',
  partner_title: '语伴匹配', partner_match: '开始匹配', partner_online: '在线',
  ob_welcome: '欢迎来到言道', ob_native_label: '我的母语是',
  ob_target_label: '我想学习的语言', ob_ui_lang_label: '界面显示语言',
  ob_continue: '继续 →', ob_back: '← 返回', ob_goal_title: '您的学习最终目标是什么？',
  ob_age_title: '你属于哪个年龄段？', ob_interest_title: '你的兴趣爱好？',
  ob_basis_title: '您当前的学习基础是？',
  ob_zero_basis: '我是零基础小白', ob_test_basis: '我懂一些，想测一下水平',
  hearts_empty: '生命值耗尽 · 等待恢复或邀请好友获得钻石补血',
  loading: '加载中…', error_generic: '出错了，请稍后重试',
};

const EN: Strings = {
  nav_path: 'Path', nav_game: 'Games', nav_ai: 'AI', nav_radio: 'Radio',
  nav_circle: 'Circle', nav_profile: 'Me',
  checkin_today: 'Check In', streak_days: 'Streak', lang_selector: 'Language',
  select_lang: 'Select language',
  feature_game: 'Game Arena', feature_game_sub: 'Play & Learn',
  feature_grammar: 'Grammar', feature_grammar_sub: 'Vocab & Grammar',
  feature_radio: 'Radio', feature_radio_sub: 'Listening Training',
  feature_partner: 'Partner', feature_partner_sub: 'Find a Study Buddy',
  feature_member: 'Membership', feature_member_sub: 'Subscription',
  game_arena_title: 'Game Arena', game_start: 'Start', game_next: 'Next',
  game_result: 'Result', game_play_again: 'Play Again', game_back: 'Back',
  game_score: 'Score', game_time: 'Time', game_correct: 'Correct', game_wrong: 'Wrong',
  game_word_match: 'Word Match', game_sentence: 'Sentence Builder',
  game_word_hunter: 'Word Hunter', game_grammar_cube: 'Grammar Cube',
  game_escape: 'Escape Room', game_grammar_planet: 'Grammar Planet',
  game_buddy_chat: 'Buddy Chat',
  ai_camera: 'Photo Solve', ai_voice: 'Voice Q&A', ai_text: 'Text Q&A',
  ai_chat: 'Chat', ai_title: 'AI Assistant',
  profile_title: 'Profile', profile_invite_code: 'My Invite Code',
  profile_earnings: 'Earnings', profile_withdraw: 'Withdraw',
  profile_settings: 'Settings', profile_privacy: 'Privacy',
  profile_theme: 'Theme', profile_ui_lang: 'Interface Language',
  profile_reset: 'Reset Survey', profile_level: 'My Level', profile_goal: 'Goal',
  privacy_title: 'Privacy Settings', privacy_discover: 'Allow strangers to find me',
  privacy_merchant_push: 'Allow merchant promotions',
  privacy_group_invite: 'Allow group invites from non-friends',
  privacy_notifications: 'Study circle notifications',
  privacy_pause_all: 'Pause all stranger interactions',
  member_title: 'Membership', member_subscribe: 'Subscribe', member_upgrade: 'Upgrade',
  checkin_title: 'Daily Check-in', checkin_done: 'Checked in today',
  checkin_streak: 'Streak', checkin_reward: 'Reward',
  btn_confirm: 'Confirm', btn_cancel: 'Cancel', btn_start: 'Start', btn_skip: 'Skip',
  btn_save: 'Save', btn_back: 'Back', btn_close: 'Close', btn_continue: 'Continue',
  btn_submit: 'Submit', btn_retry: 'Retry', btn_done: 'Done', btn_next: 'Next',
  circle_title: 'Study Circle', circle_join: 'Join', circle_create: 'Create',
  circle_members: 'Members',
  partner_title: 'Language Partner', partner_match: 'Find Match', partner_online: 'Online',
  ob_welcome: 'Welcome to Gendou', ob_native_label: 'My native language is',
  ob_target_label: 'I want to learn', ob_ui_lang_label: 'Interface language',
  ob_continue: 'Continue →', ob_back: '← Back', ob_goal_title: 'What is your learning goal?',
  ob_age_title: 'Which age group are you in?', ob_interest_title: 'Your interests?',
  ob_basis_title: 'What is your current level?',
  ob_zero_basis: 'Complete beginner', ob_test_basis: 'I know some — take a placement test',
  hearts_empty: 'No hearts left · Wait or invite friends to refill',
  loading: 'Loading…', error_generic: 'Something went wrong, please try again',
};

const JA: Strings = {
  nav_path: 'ルート', nav_game: 'ゲーム', nav_ai: 'AI', nav_radio: 'ラジオ',
  nav_circle: 'サークル', nav_profile: 'プロフィール',
  checkin_today: 'チェックイン', streak_days: '連続日数', lang_selector: '言語',
  select_lang: '学習言語を選択',
  feature_game: 'ゲームアリーナ', feature_game_sub: '楽しく学ぶ',
  feature_grammar: '文法', feature_grammar_sub: '語彙・文法',
  feature_radio: 'ラジオ', feature_radio_sub: 'リスニング練習',
  feature_partner: 'パートナー', feature_partner_sub: '学習相手を探す',
  feature_member: '会員', feature_member_sub: 'サブスク管理',
  game_arena_title: 'ゲームアリーナ', game_start: 'スタート', game_next: '次へ',
  game_result: '結果', game_play_again: 'もう一度', game_back: '戻る',
  game_score: 'スコア', game_time: '時間', game_correct: '正解', game_wrong: '不正解',
  game_word_match: '単語マッチ', game_sentence: '文章組立',
  game_word_hunter: 'ワードハンター', game_grammar_cube: '文法キューブ',
  game_escape: '脱出ゲーム', game_grammar_planet: '文法惑星',
  game_buddy_chat: 'バディチャット',
  ai_camera: '写真解析', ai_voice: '音声Q&A', ai_text: 'テキストQ&A',
  ai_chat: 'チャット', ai_title: 'AIアシスタント',
  profile_title: 'プロフィール', profile_invite_code: '招待コード',
  profile_earnings: '収益', profile_withdraw: '出金',
  profile_settings: '設定', profile_privacy: 'プライバシー',
  profile_theme: 'テーマ', profile_ui_lang: '表示言語',
  profile_reset: 'アンケートをリセット', profile_level: 'レベル', profile_goal: '目標',
  privacy_title: 'プライバシー設定', privacy_discover: '他のユーザーに見つけられる',
  privacy_merchant_push: '商業プッシュ通知を許可',
  privacy_group_invite: '非友達からのグループ招待を許可',
  privacy_notifications: 'サークル通知', privacy_pause_all: '全ての見知らぬ人との交流を一時停止',
  member_title: '会員センター', member_subscribe: '購読', member_upgrade: 'アップグレード',
  checkin_title: '毎日チェックイン', checkin_done: '今日はチェック済み',
  checkin_streak: '連続', checkin_reward: '報酬',
  btn_confirm: '確認', btn_cancel: 'キャンセル', btn_start: 'スタート', btn_skip: 'スキップ',
  btn_save: '保存', btn_back: '戻る', btn_close: '閉じる', btn_continue: '続ける',
  btn_submit: '送信', btn_retry: 'リトライ', btn_done: '完了', btn_next: '次へ',
  circle_title: '学習サークル', circle_join: '参加', circle_create: '作成',
  circle_members: 'メンバー',
  partner_title: '学習パートナー', partner_match: 'マッチング', partner_online: 'オンライン',
  ob_welcome: '言道へようこそ', ob_native_label: '母国語は',
  ob_target_label: '学習したい言語', ob_ui_lang_label: '表示言語',
  ob_continue: '続ける →', ob_back: '← 戻る', ob_goal_title: '学習の目的は何ですか？',
  ob_age_title: '年齢層を選択してください', ob_interest_title: '興味・趣味は？',
  ob_basis_title: '現在のレベルは？',
  ob_zero_basis: '完全な初心者', ob_test_basis: '少し知っている・レベルチェック',
  hearts_empty: 'ハートがなくなりました · 回復を待つか友達を招待してください',
  loading: '読み込み中…', error_generic: 'エラーが発生しました。もう一度お試しください',
};

const KO: Strings = {
  nav_path: '학습 경로', nav_game: '게임', nav_ai: 'AI', nav_radio: '라디오',
  nav_circle: '학습 서클', nav_profile: '프로필',
  checkin_today: '오늘 체크인', streak_days: '연속 일수', lang_selector: '언어',
  select_lang: '학습 언어 선택',
  feature_game: '게임 아레나', feature_game_sub: '게임으로 배우기',
  feature_grammar: '문법', feature_grammar_sub: '어휘 · 문법',
  feature_radio: '라디오', feature_radio_sub: '듣기 훈련',
  feature_partner: '파트너', feature_partner_sub: '학습 파트너 찾기',
  feature_member: '멤버십', feature_member_sub: '구독 관리',
  game_arena_title: '게임 아레나', game_start: '시작', game_next: '다음',
  game_result: '결과', game_play_again: '다시 하기', game_back: '뒤로',
  game_score: '점수', game_time: '시간', game_correct: '정답', game_wrong: '오답',
  game_word_match: '단어 매칭', game_sentence: '문장 만들기',
  game_word_hunter: '단어 사냥꾼', game_grammar_cube: '문법 큐브',
  game_escape: '탈출 게임', game_grammar_planet: '문법 행성',
  game_buddy_chat: '버디 채팅',
  ai_camera: '사진 분석', ai_voice: '음성 Q&A', ai_text: '텍스트 Q&A',
  ai_chat: '채팅', ai_title: 'AI 어시스턴트',
  profile_title: '프로필', profile_invite_code: '내 초대 코드',
  profile_earnings: '수익', profile_withdraw: '출금',
  profile_settings: '설정', profile_privacy: '개인정보',
  profile_theme: '테마', profile_ui_lang: '인터페이스 언어',
  profile_reset: '설문 초기화', profile_level: '내 레벨', profile_goal: '목표',
  privacy_title: '개인정보 설정', privacy_discover: '낯선 사람에게 발견 허용',
  privacy_merchant_push: '상업 알림 허용',
  privacy_group_invite: '비친구의 그룹 초대 허용',
  privacy_notifications: '서클 알림', privacy_pause_all: '모든 낯선 사람 상호작용 일시 중지',
  member_title: '멤버십 센터', member_subscribe: '구독', member_upgrade: '업그레이드',
  checkin_title: '매일 체크인', checkin_done: '오늘 체크인 완료',
  checkin_streak: '연속', checkin_reward: '보상',
  btn_confirm: '확인', btn_cancel: '취소', btn_start: '시작', btn_skip: '건너뛰기',
  btn_save: '저장', btn_back: '뒤로', btn_close: '닫기', btn_continue: '계속',
  btn_submit: '제출', btn_retry: '다시 시도', btn_done: '완료', btn_next: '다음',
  circle_title: '학습 서클', circle_join: '참가', circle_create: '만들기',
  circle_members: '멤버',
  partner_title: '언어 파트너', partner_match: '매칭 시작', partner_online: '온라인',
  ob_welcome: 'Gendou에 오신 것을 환영합니다', ob_native_label: '내 모국어는',
  ob_target_label: '배우고 싶은 언어', ob_ui_lang_label: '인터페이스 언어',
  ob_continue: '계속 →', ob_back: '← 뒤로', ob_goal_title: '학습 목표는 무엇인가요?',
  ob_age_title: '연령대를 선택하세요', ob_interest_title: '관심사는?',
  ob_basis_title: '현재 수준은?',
  ob_zero_basis: '완전 초보자', ob_test_basis: '조금 알고 있음 · 레벨 테스트',
  hearts_empty: '하트가 없습니다 · 회복을 기다리거나 친구를 초대하세요',
  loading: '로딩 중…', error_generic: '오류가 발생했습니다. 다시 시도해 주세요',
};

const FR: Strings = {
  nav_path: 'Parcours', nav_game: 'Jeux', nav_ai: 'IA', nav_radio: 'Radio',
  nav_circle: 'Cercle', nav_profile: 'Moi',
  checkin_today: "Pointer aujourd'hui", streak_days: 'Série', lang_selector: 'Langue',
  select_lang: 'Choisir la langue',
  feature_game: 'Arène de jeux', feature_game_sub: 'Apprendre en jouant',
  feature_grammar: 'Grammaire', feature_grammar_sub: 'Vocabulaire · Grammaire',
  feature_radio: 'Radio', feature_radio_sub: "Entraînement à l'écoute",
  feature_partner: 'Partenaire', feature_partner_sub: 'Trouver un partenaire',
  feature_member: 'Adhésion', feature_member_sub: 'Abonnement',
  game_arena_title: 'Arène de jeux', game_start: 'Commencer', game_next: 'Suivant',
  game_result: 'Résultat', game_play_again: 'Rejouer', game_back: 'Retour',
  game_score: 'Score', game_time: 'Temps', game_correct: 'Correct', game_wrong: 'Faux',
  game_word_match: 'Association', game_sentence: 'Constructeur de phrases',
  game_word_hunter: 'Chasseur de mots', game_grammar_cube: 'Cube de grammaire',
  game_escape: "Salle d'évasion", game_grammar_planet: 'Planète grammaire',
  game_buddy_chat: 'Chat avec partenaire',
  ai_camera: 'Photo', ai_voice: 'Vocal', ai_text: 'Texte',
  ai_chat: 'Chat', ai_title: 'Assistant IA',
  profile_title: 'Profil', profile_invite_code: 'Mon code invitation',
  profile_earnings: 'Revenus', profile_withdraw: 'Retirer',
  profile_settings: 'Paramètres', profile_privacy: 'Confidentialité',
  profile_theme: 'Thème', profile_ui_lang: "Langue de l'interface",
  profile_reset: 'Réinitialiser', profile_level: 'Mon niveau', profile_goal: 'Objectif',
  privacy_title: 'Confidentialité', privacy_discover: 'Permettre aux inconnus de me trouver',
  privacy_merchant_push: 'Autoriser les promotions',
  privacy_group_invite: "Autoriser les invitations de groupe d'inconnus",
  privacy_notifications: 'Notifications du cercle',
  privacy_pause_all: 'Suspendre toutes les interactions inconnues',
  member_title: "Centre d'adhésion", member_subscribe: "S'abonner", member_upgrade: 'Améliorer',
  checkin_title: 'Pointage quotidien', checkin_done: "Pointé aujourd'hui",
  checkin_streak: 'Série', checkin_reward: 'Récompense',
  btn_confirm: 'Confirmer', btn_cancel: 'Annuler', btn_start: 'Commencer',
  btn_skip: 'Passer', btn_save: 'Enregistrer', btn_back: 'Retour',
  btn_close: 'Fermer', btn_continue: 'Continuer', btn_submit: 'Soumettre',
  btn_retry: 'Réessayer', btn_done: 'Terminé', btn_next: 'Suivant',
  circle_title: "Cercle d'étude", circle_join: 'Rejoindre', circle_create: 'Créer',
  circle_members: 'Membres',
  partner_title: 'Partenaire linguistique', partner_match: 'Chercher', partner_online: 'En ligne',
  ob_welcome: 'Bienvenue sur Gendou', ob_native_label: 'Ma langue maternelle est',
  ob_target_label: 'Je veux apprendre', ob_ui_lang_label: "Langue de l'interface",
  ob_continue: 'Continuer →', ob_back: '← Retour',
  ob_goal_title: "Quel est votre objectif d'apprentissage ?",
  ob_age_title: 'Dans quel groupe âge êtes-vous ?', ob_interest_title: 'Vos intérêts ?',
  ob_basis_title: 'Quel est votre niveau actuel ?',
  ob_zero_basis: 'Débutant complet', ob_test_basis: "Je connais un peu · Test de niveau",
  hearts_empty: "Plus de cœurs · Attendez ou invitez des amis",
  loading: 'Chargement…', error_generic: 'Une erreur est survenue, réessayez',
};

const ES: Strings = {
  nav_path: 'Ruta', nav_game: 'Juegos', nav_ai: 'IA', nav_radio: 'Radio',
  nav_circle: 'Círculo', nav_profile: 'Yo',
  checkin_today: 'Registrarse hoy', streak_days: 'Racha', lang_selector: 'Idioma',
  select_lang: 'Seleccionar idioma',
  feature_game: 'Arena de juegos', feature_game_sub: 'Aprender jugando',
  feature_grammar: 'Gramática', feature_grammar_sub: 'Vocabulario · Gramática',
  feature_radio: 'Radio', feature_radio_sub: 'Entrenamiento auditivo',
  feature_partner: 'Compañero', feature_partner_sub: 'Buscar compañero',
  feature_member: 'Membresía', feature_member_sub: 'Suscripción',
  game_arena_title: 'Arena de juegos', game_start: 'Iniciar', game_next: 'Siguiente',
  game_result: 'Resultado', game_play_again: 'Jugar de nuevo', game_back: 'Volver',
  game_score: 'Puntuación', game_time: 'Tiempo', game_correct: 'Correcto', game_wrong: 'Incorrecto',
  game_word_match: 'Emparejar palabras', game_sentence: 'Constructor de frases',
  game_word_hunter: 'Cazador de palabras', game_grammar_cube: 'Cubo gramático',
  game_escape: 'Escape room', game_grammar_planet: 'Planeta gramático',
  game_buddy_chat: 'Chat con compañero',
  ai_camera: 'Foto', ai_voice: 'Voz', ai_text: 'Texto',
  ai_chat: 'Chat', ai_title: 'Asistente IA',
  profile_title: 'Perfil', profile_invite_code: 'Mi código de invitación',
  profile_earnings: 'Ganancias', profile_withdraw: 'Retirar',
  profile_settings: 'Configuración', profile_privacy: 'Privacidad',
  profile_theme: 'Tema', profile_ui_lang: 'Idioma de interfaz',
  profile_reset: 'Reiniciar encuesta', profile_level: 'Mi nivel', profile_goal: 'Objetivo',
  privacy_title: 'Configuración de privacidad',
  privacy_discover: 'Permitir que extraños me encuentren',
  privacy_merchant_push: 'Permitir promociones de comerciantes',
  privacy_group_invite: 'Permitir invitaciones de grupos de desconocidos',
  privacy_notifications: 'Notificaciones del círculo',
  privacy_pause_all: 'Pausar todas las interacciones con desconocidos',
  member_title: 'Centro de membresía', member_subscribe: 'Suscribirse', member_upgrade: 'Mejorar',
  checkin_title: 'Registro diario', checkin_done: 'Registrado hoy',
  checkin_streak: 'Racha', checkin_reward: 'Recompensa',
  btn_confirm: 'Confirmar', btn_cancel: 'Cancelar', btn_start: 'Iniciar', btn_skip: 'Omitir',
  btn_save: 'Guardar', btn_back: 'Volver', btn_close: 'Cerrar', btn_continue: 'Continuar',
  btn_submit: 'Enviar', btn_retry: 'Reintentar', btn_done: 'Hecho', btn_next: 'Siguiente',
  circle_title: 'Círculo de estudio', circle_join: 'Unirse', circle_create: 'Crear',
  circle_members: 'Miembros',
  partner_title: 'Compañero lingüístico', partner_match: 'Buscar', partner_online: 'En línea',
  ob_welcome: 'Bienvenido a Gendou', ob_native_label: 'Mi idioma nativo es',
  ob_target_label: 'Quiero aprender', ob_ui_lang_label: 'Idioma de interfaz',
  ob_continue: 'Continuar →', ob_back: '← Volver',
  ob_goal_title: '¿Cuál es tu objetivo de aprendizaje?',
  ob_age_title: '¿En qué grupo de edad estás?', ob_interest_title: '¿Cuáles son tus intereses?',
  ob_basis_title: '¿Cuál es tu nivel actual?',
  ob_zero_basis: 'Principiante completo', ob_test_basis: 'Sé algo · Hacer test de nivel',
  hearts_empty: 'Sin corazones · Espera o invita amigos',
  loading: 'Cargando…', error_generic: 'Algo salió mal, inténtalo de nuevo',
};

const DE: Strings = {
  nav_path: 'Lernpfad', nav_game: 'Spiele', nav_ai: 'KI', nav_radio: 'Radio',
  nav_circle: 'Lernkreis', nav_profile: 'Profil',
  checkin_today: 'Heute einchecken', streak_days: 'Serie', lang_selector: 'Sprache',
  select_lang: 'Lernsprache wählen',
  feature_game: 'Spielarena', feature_game_sub: 'Spielend lernen',
  feature_grammar: 'Grammatik', feature_grammar_sub: 'Wortschatz · Grammatik',
  feature_radio: 'Radio', feature_radio_sub: 'Hörtraining',
  feature_partner: 'Partner', feature_partner_sub: 'Lernpartner finden',
  feature_member: 'Mitgliedschaft', feature_member_sub: 'Abonnement',
  game_arena_title: 'Spielarena', game_start: 'Starten', game_next: 'Weiter',
  game_result: 'Ergebnis', game_play_again: 'Nochmal spielen', game_back: 'Zurück',
  game_score: 'Punkte', game_time: 'Zeit', game_correct: 'Richtig', game_wrong: 'Falsch',
  game_word_match: 'Wort-Match', game_sentence: 'Satz-Baukasten',
  game_word_hunter: 'Wortjäger', game_grammar_cube: 'Grammatik-Würfel',
  game_escape: 'Fluchtspiel', game_grammar_planet: 'Grammatik-Planet',
  game_buddy_chat: 'Buddy-Chat',
  ai_camera: 'Foto', ai_voice: 'Sprache', ai_text: 'Text',
  ai_chat: 'Chat', ai_title: 'KI-Assistent',
  profile_title: 'Profil', profile_invite_code: 'Mein Einladungscode',
  profile_earnings: 'Verdienst', profile_withdraw: 'Auszahlen',
  profile_settings: 'Einstellungen', profile_privacy: 'Datenschutz',
  profile_theme: 'Theme', profile_ui_lang: 'Oberflächensprache',
  profile_reset: 'Fragebogen zurücksetzen', profile_level: 'Mein Level', profile_goal: 'Ziel',
  privacy_title: 'Datenschutzeinstellungen',
  privacy_discover: 'Von Fremden gefunden werden',
  privacy_merchant_push: 'Händler-Benachrichtigungen erlauben',
  privacy_group_invite: 'Gruppeneinladungen von Unbekannten erlauben',
  privacy_notifications: 'Lernkreis-Benachrichtigungen',
  privacy_pause_all: 'Alle Fremde-Interaktionen pausieren',
  member_title: 'Mitgliedschaftszentrum', member_subscribe: 'Abonnieren',
  member_upgrade: 'Upgraden',
  checkin_title: 'Tägliches Einchecken', checkin_done: 'Heute eingecheckt',
  checkin_streak: 'Serie', checkin_reward: 'Belohnung',
  btn_confirm: 'Bestätigen', btn_cancel: 'Abbrechen', btn_start: 'Starten',
  btn_skip: 'Überspringen', btn_save: 'Speichern', btn_back: 'Zurück',
  btn_close: 'Schließen', btn_continue: 'Weiter', btn_submit: 'Absenden',
  btn_retry: 'Wiederholen', btn_done: 'Fertig', btn_next: 'Weiter',
  circle_title: 'Lernkreis', circle_join: 'Beitreten', circle_create: 'Erstellen',
  circle_members: 'Mitglieder',
  partner_title: 'Sprachlernpartner', partner_match: 'Suchen', partner_online: 'Online',
  ob_welcome: 'Willkommen bei Gendou', ob_native_label: 'Meine Muttersprache ist',
  ob_target_label: 'Ich möchte lernen', ob_ui_lang_label: 'Oberflächensprache',
  ob_continue: 'Weiter →', ob_back: '← Zurück',
  ob_goal_title: 'Was ist dein Lernziel?',
  ob_age_title: 'In welcher Altersgruppe bist du?', ob_interest_title: 'Deine Interessen?',
  ob_basis_title: 'Was ist dein aktuelles Niveau?',
  ob_zero_basis: 'Kompletter Anfänger', ob_test_basis: 'Ich weiß etwas · Einstufungstest',
  hearts_empty: 'Keine Herzen mehr · Warte oder lade Freunde ein',
  loading: 'Laden…', error_generic: 'Etwas ist schiefgelaufen, bitte erneut versuchen',
};

export const TRANSLATIONS: Record<UILang, Strings> = {
  zh: ZH, en: EN, ja: JA, ko: KO, fr: FR, es: ES, de: DE,
};

const UI_LANG_KEY = 'yandao_ui_lang_v1';

export function getStoredUILang(): UILang {
  try {
    const v = localStorage.getItem(UI_LANG_KEY) as UILang | null;
    if (v && TRANSLATIONS[v]) return v;
  } catch { /* */ }
  return 'zh';
}

export function setStoredUILang(lang: UILang) {
  try { localStorage.setItem(UI_LANG_KEY, lang); } catch { /* */ }
}

export function t(lang: UILang, key: keyof Strings): string {
  return TRANSLATIONS[lang][key] ?? TRANSLATIONS.zh[key] ?? key;
}
