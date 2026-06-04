import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../data/supabase';

interface ExamTargetTabProps {
  sessionKey: string;
  languageCode: string;
  languageName: string;
}

interface ExamTarget {
  id: string;
  system_name: string;
  level_code: string;
  level_label: string;
  description: string;
}

interface UserGoal {
  id: string;
  exam_target_id: string;
  target_date: string | null;
  daily_goal_min: number;
}

// Hardcoded exam-frequency vocab samples per language+level (offline-first)
const EXAM_VOCAB: Record<string, Array<{ word: string; reading?: string; meaning: string; freq: number; examTag: string }>> = {
  // Japanese
  ja_N5: [
    { word: '食べる', reading: 'たべる', meaning: '吃', freq: 98, examTag: 'N5必考' },
    { word: '水', reading: 'みず', meaning: '水', freq: 95, examTag: 'N5必考' },
    { word: '学校', reading: 'がっこう', meaning: '学校', freq: 94, examTag: 'N5必考' },
    { word: '電車', reading: 'でんしゃ', meaning: '电车', freq: 90, examTag: 'N5常考' },
    { word: '映画', reading: 'えいが', meaning: '电影', freq: 88, examTag: 'N5常考' },
  ],
  ja_N4: [
    { word: '説明する', reading: 'せつめいする', meaning: '说明', freq: 92, examTag: 'N4必考' },
    { word: '普通', reading: 'ふつう', meaning: '普通', freq: 89, examTag: 'N4必考' },
    { word: '場合', reading: 'ばあい', meaning: '情况', freq: 87, examTag: 'N4必考' },
    { word: '文化', reading: 'ぶんか', meaning: '文化', freq: 85, examTag: 'N4常考' },
    { word: '運動', reading: 'うんどう', meaning: '运动', freq: 82, examTag: 'N4常考' },
  ],
  ja_N3: [
    { word: '影響', reading: 'えいきょう', meaning: '影响', freq: 93, examTag: 'N3必考' },
    { word: '判断', reading: 'はんだん', meaning: '判断', freq: 90, examTag: 'N3必考' },
    { word: '環境', reading: 'かんきょう', meaning: '环境', freq: 88, examTag: 'N3必考' },
    { word: '経験', reading: 'けいけん', meaning: '经验', freq: 86, examTag: 'N3常考' },
    { word: '原因', reading: 'げんいん', meaning: '原因', freq: 84, examTag: 'N3常考' },
  ],
  ja_N2: [
    { word: '促進', reading: 'そくしん', meaning: '促进', freq: 91, examTag: 'N2必考' },
    { word: '抑制', reading: 'よくせい', meaning: '抑制', freq: 88, examTag: 'N2必考' },
    { word: '把握', reading: 'はあく', meaning: '掌握', freq: 85, examTag: 'N2必考' },
    { word: '概念', reading: 'がいねん', meaning: '概念', freq: 83, examTag: 'N2常考' },
    { word: '一方', reading: 'いっぽう', meaning: '另一方面', freq: 80, examTag: 'N2常考' },
  ],
  ja_N1: [
    { word: '懸念', reading: 'けねん', meaning: '担忧', freq: 89, examTag: 'N1必考' },
    { word: '是非', reading: 'ぜひ', meaning: '无论如何', freq: 86, examTag: 'N1必考' },
    { word: '皮肉', reading: 'ひにく', meaning: '讽刺', freq: 83, examTag: 'N1必考' },
    { word: '顕著', reading: 'けんちょ', meaning: '显著', freq: 80, examTag: 'N1常考' },
    { word: '妥当', reading: 'だとう', meaning: '妥当', freq: 77, examTag: 'N1常考' },
  ],
  // English
  en_A1: [
    { word: 'hello', meaning: '你好', freq: 99, examTag: 'A1必考' },
    { word: 'goodbye', meaning: '再见', freq: 97, examTag: 'A1必考' },
    { word: 'thank you', meaning: '谢谢', freq: 96, examTag: 'A1必考' },
    { word: 'please', meaning: '请', freq: 94, examTag: 'A1必考' },
    { word: 'sorry', meaning: '对不起', freq: 93, examTag: 'A1必考' },
  ],
  en_A2: [
    { word: 'comfortable', meaning: '舒适的', freq: 88, examTag: 'A2必考' },
    { word: 'experience', meaning: '经验', freq: 86, examTag: 'A2必考' },
    { word: 'important', meaning: '重要的', freq: 85, examTag: 'A2必考' },
    { word: 'different', meaning: '不同的', freq: 83, examTag: 'A2必考' },
    { word: 'possible', meaning: '可能的', freq: 81, examTag: 'A2必考' },
  ],
  en_B1: [
    { word: 'opportunity', meaning: '机会', freq: 90, examTag: 'B1必考' },
    { word: 'environment', meaning: '环境', freq: 87, examTag: 'B1必考' },
    { word: 'development', meaning: '发展', freq: 85, examTag: 'B1必考' },
    { word: 'government', meaning: '政府', freq: 83, examTag: 'B1必考' },
    { word: 'education', meaning: '教育', freq: 81, examTag: 'B1必考' },
  ],
  en_B2: [
    { word: 'consequently', meaning: '因此', freq: 88, examTag: 'B2必考' },
    { word: 'nevertheless', meaning: '然而', freq: 86, examTag: 'B2必考' },
    { word: 'substantial', meaning: '实质的', freq: 83, examTag: 'B2必考' },
    { word: 'perspective', meaning: '视角', freq: 80, examTag: 'B2必考' },
    { word: 'comprehensive', meaning: '全面的', freq: 78, examTag: 'B2必考' },
  ],
  en_C1: [
    { word: 'ubiquitous', meaning: '无处不在的', freq: 85, examTag: 'C1必考' },
    { word: 'paradigm', meaning: '范式', freq: 82, examTag: 'C1必考' },
    { word: 'juxtaposition', meaning: '并列', freq: 79, examTag: 'C1必考' },
    { word: 'ephemeral', meaning: '短暂的', freq: 76, examTag: 'C1必考' },
    { word: 'quintessential', meaning: '典型的', freq: 73, examTag: 'C1必考' },
  ],
  // Korean
  ko_TOPIK1: [
    { word: '사람', meaning: '人', freq: 98, examTag: 'TOPIK1必考' },
    { word: '학교', meaning: '学校', freq: 96, examTag: 'TOPIK1必考' },
    { word: '공부', meaning: '学习', freq: 94, examTag: 'TOPIK1必考' },
    { word: '친구', meaning: '朋友', freq: 92, examTag: 'TOPIK1必考' },
    { word: '음식', meaning: '食物', freq: 90, examTag: 'TOPIK1必考' },
  ],
  ko_TOPIK2: [
    { word: '경험', meaning: '经验', freq: 88, examTag: 'TOPIK2必考' },
    { word: '문화', meaning: '文化', freq: 86, examTag: 'TOPIK2必考' },
    { word: '발전', meaning: '发展', freq: 84, examTag: 'TOPIK2必考' },
    { word: '환경', meaning: '环境', freq: 82, examTag: 'TOPIK2必考' },
    { word: '경제', meaning: '经济', freq: 80, examTag: 'TOPIK2必考' },
  ],
  ko_TOPIK3: [
    { word: '영향', meaning: '影响', freq: 87, examTag: 'TOPIK3必考' },
    { word: '판단', meaning: '判断', freq: 84, examTag: 'TOPIK3必考' },
    { word: '원인', meaning: '原因', freq: 81, examTag: 'TOPIK3必考' },
    { word: '과정', meaning: '过程', freq: 78, examTag: 'TOPIK3必考' },
    { word: '의미', meaning: '意义', freq: 75, examTag: 'TOPIK3必考' },
  ],
  ko_TOPIK4: [
    { word: '촉진', meaning: '促进', freq: 83, examTag: 'TOPIK4必考' },
    { word: '억제', meaning: '抑制', freq: 80, examTag: 'TOPIK4必考' },
    { word: '파악', meaning: '掌握', freq: 77, examTag: 'TOPIK4必考' },
    { word: '개념', meaning: '概念', freq: 74, examTag: 'TOPIK4必考' },
    { word: '현저', meaning: '显著', freq: 71, examTag: 'TOPIK4必考' },
  ],
  // French
  fr_DELF_A1: [
    { word: 'bonjour', meaning: '你好', freq: 99, examTag: 'DELF A1' },
    { word: 'merci', meaning: '谢谢', freq: 97, examTag: 'DELF A1' },
    { word: 'manger', meaning: '吃', freq: 95, examTag: 'DELF A1' },
    { word: 'famille', meaning: '家庭', freq: 93, examTag: 'DELF A1' },
    { word: 'travail', meaning: '工作', freq: 91, examTag: 'DELF A1' },
  ],
  fr_DELF_A2: [
    { word: 'expérience', meaning: '经验', freq: 87, examTag: 'DELF A2' },
    { word: 'important', meaning: '重要的', freq: 85, examTag: 'DELF A2' },
    { word: 'différent', meaning: '不同的', freq: 83, examTag: 'DELF A2' },
    { word: 'environnement', meaning: '环境', freq: 80, examTag: 'DELF A2' },
    { word: 'développement', meaning: '发展', freq: 78, examTag: 'DELF A2' },
  ],
  fr_DELF_B1: [
    { word: 'opportunité', meaning: '机会', freq: 86, examTag: 'DELF B1' },
    { word: 'gouvernement', meaning: '政府', freq: 83, examTag: 'DELF B1' },
    { word: 'éducation', meaning: '教育', freq: 80, examTag: 'DELF B1' },
    { word: 'conséquence', meaning: '后果', freq: 77, examTag: 'DELF B1' },
    { word: 'société', meaning: '社会', freq: 74, examTag: 'DELF B1' },
  ],
  fr_DELF_B2: [
    { word: 'néanmoins', meaning: '然而', freq: 82, examTag: 'DELF B2' },
    { word: 'substantiel', meaning: '实质的', freq: 79, examTag: 'DELF B2' },
    { word: 'perspective', meaning: '视角', freq: 76, examTag: 'DELF B2' },
    { word: 'paradigme', meaning: '范式', freq: 73, examTag: 'DELF B2' },
    { word: 'éphémère', meaning: '短暂的', freq: 70, examTag: 'DELF B2' },
  ],
  // Spanish
  es_DELE_A1: [
    { word: 'hola', meaning: '你好', freq: 99, examTag: 'DELE A1' },
    { word: 'gracias', meaning: '谢谢', freq: 97, examTag: 'DELE A1' },
    { word: 'comer', meaning: '吃', freq: 95, examTag: 'DELE A1' },
    { word: 'familia', meaning: '家庭', freq: 93, examTag: 'DELE A1' },
    { word: 'trabajo', meaning: '工作', freq: 91, examTag: 'DELE A1' },
  ],
  es_DELE_A2: [
    { word: 'experiencia', meaning: '经验', freq: 87, examTag: 'DELE A2' },
    { word: 'importante', meaning: '重要的', freq: 85, examTag: 'DELE A2' },
    { word: 'diferente', meaning: '不同的', freq: 83, examTag: 'DELE A2' },
    { word: 'desarrollo', meaning: '发展', freq: 80, examTag: 'DELE A2' },
    { word: 'posible', meaning: '可能的', freq: 78, examTag: 'DELE A2' },
  ],
  es_DELE_B1: [
    { word: 'oportunidad', meaning: '机会', freq: 86, examTag: 'DELE B1' },
    { word: 'gobierno', meaning: '政府', freq: 83, examTag: 'DELE B1' },
    { word: 'educación', meaning: '教育', freq: 80, examTag: 'DELE B1' },
    { word: 'sociedad', meaning: '社会', freq: 77, examTag: 'DELE B1' },
    { word: 'consecuencia', meaning: '后果', freq: 74, examTag: 'DELE B1' },
  ],
  es_DELE_B2: [
    { word: 'no obstante', meaning: '然而', freq: 82, examTag: 'DELE B2' },
    { word: 'sustancial', meaning: '实质的', freq: 79, examTag: 'DELE B2' },
    { word: 'perspectiva', meaning: '视角', freq: 76, examTag: 'DELE B2' },
    { word: 'paradigma', meaning: '范式', freq: 73, examTag: 'DELE B2' },
    { word: 'efímero', meaning: '短暂的', freq: 70, examTag: 'DELE B2' },
  ],
  // German
  de_Goethe_A1: [
    { word: 'hallo', meaning: '你好', freq: 99, examTag: 'A1必考' },
    { word: 'danke', meaning: '谢谢', freq: 97, examTag: 'A1必考' },
    { word: 'essen', meaning: '吃', freq: 95, examTag: 'A1必考' },
    { word: 'Familie', meaning: '家庭', freq: 93, examTag: 'A1必考' },
    { word: 'Arbeit', meaning: '工作', freq: 91, examTag: 'A1必考' },
  ],
  de_Goethe_A2: [
    { word: 'Erfahrung', meaning: '经验', freq: 87, examTag: 'A2必考' },
    { word: 'wichtig', meaning: '重要的', freq: 85, examTag: 'A2必考' },
    { word: 'unterschiedlich', meaning: '不同的', freq: 83, examTag: 'A2必考' },
    { word: 'Entwicklung', meaning: '发展', freq: 80, examTag: 'A2必考' },
    { word: 'möglich', meaning: '可能的', freq: 78, examTag: 'A2必考' },
  ],
  de_Goethe_B1: [
    { word: 'Gelegenheit', meaning: '机会', freq: 86, examTag: 'B1必考' },
    { word: 'Regierung', meaning: '政府', freq: 83, examTag: 'B1必考' },
    { word: 'Bildung', meaning: '教育', freq: 80, examTag: 'B1必考' },
    { word: 'Gesellschaft', meaning: '社会', freq: 77, examTag: 'B1必考' },
    { word: 'Umgebung', meaning: '环境', freq: 74, examTag: 'B1必考' },
  ],
  de_Goethe_B2: [
    { word: 'dennoch', meaning: '然而', freq: 82, examTag: 'B2必考' },
    { word: 'wesentlich', meaning: '实质的', freq: 79, examTag: 'B2必考' },
    { word: 'Perspektive', meaning: '视角', freq: 76, examTag: 'B2必考' },
    { word: 'Paradigma', meaning: '范式', freq: 73, examTag: 'B2必考' },
    { word: 'vergänglich', meaning: '短暂的', freq: 70, examTag: 'B2必考' },
  ],
  // Italian
  it_CILS_A1: [
    { word: 'ciao', meaning: '你好', freq: 99, examTag: 'A1必考' },
    { word: 'grazie', meaning: '谢谢', freq: 97, examTag: 'A1必考' },
    { word: 'mangiare', meaning: '吃', freq: 95, examTag: 'A1必考' },
    { word: 'famiglia', meaning: '家庭', freq: 93, examTag: 'A1必考' },
    { word: 'lavoro', meaning: '工作', freq: 91, examTag: 'A1必考' },
  ],
  it_CILS_A2: [
    { word: 'esperienza', meaning: '经验', freq: 87, examTag: 'A2必考' },
    { word: 'importante', meaning: '重要的', freq: 85, examTag: 'A2必考' },
    { word: 'diverso', meaning: '不同的', freq: 83, examTag: 'A2必考' },
    { word: 'sviluppo', meaning: '发展', freq: 80, examTag: 'A2必考' },
    { word: 'possibile', meaning: '可能的', freq: 78, examTag: 'A2必考' },
  ],
  it_CILS_B1: [
    { word: 'opportunità', meaning: '机会', freq: 86, examTag: 'B1必考' },
    { word: 'governo', meaning: '政府', freq: 83, examTag: 'B1必考' },
    { word: 'istruzione', meaning: '教育', freq: 80, examTag: 'B1必考' },
    { word: 'società', meaning: '社会', freq: 77, examTag: 'B1必考' },
    { word: 'conseguenza', meaning: '后果', freq: 74, examTag: 'B1必考' },
  ],
  it_CILS_B2: [
    { word: 'tuttavia', meaning: '然而', freq: 82, examTag: 'B2必考' },
    { word: 'sostanziale', meaning: '实质的', freq: 79, examTag: 'B2必考' },
    { word: 'prospettiva', meaning: '视角', freq: 76, examTag: 'B2必考' },
    { word: 'paradigma', meaning: '范式', freq: 73, examTag: 'B2必考' },
    { word: 'effimero', meaning: '短暂的', freq: 70, examTag: 'B2必考' },
  ],
  // Portuguese
  pt_CELPE_A1: [
    { word: 'olá', meaning: '你好', freq: 99, examTag: 'A1必考' },
    { word: 'obrigado', meaning: '谢谢', freq: 97, examTag: 'A1必考' },
    { word: 'comer', meaning: '吃', freq: 95, examTag: 'A1必考' },
    { word: 'família', meaning: '家庭', freq: 93, examTag: 'A1必考' },
    { word: 'trabalho', meaning: '工作', freq: 91, examTag: 'A1必考' },
  ],
  pt_CELPE_A2: [
    { word: 'experiência', meaning: '经验', freq: 87, examTag: 'A2必考' },
    { word: 'importante', meaning: '重要的', freq: 85, examTag: 'A2必考' },
    { word: 'diferente', meaning: '不同的', freq: 83, examTag: 'A2必考' },
    { word: 'desenvolvimento', meaning: '发展', freq: 80, examTag: 'A2必考' },
    { word: 'possível', meaning: '可能的', freq: 78, examTag: 'A2必考' },
  ],
  pt_CELPE_B1: [
    { word: 'oportunidade', meaning: '机会', freq: 86, examTag: 'B1必考' },
    { word: 'governo', meaning: '政府', freq: 83, examTag: 'B1必考' },
    { word: 'educação', meaning: '教育', freq: 80, examTag: 'B1必考' },
    { word: 'sociedade', meaning: '社会', freq: 77, examTag: 'B1必考' },
    { word: 'consequência', meaning: '后果', freq: 74, examTag: 'B1必考' },
  ],
  pt_CELPE_B2: [
    { word: 'entretanto', meaning: '然而', freq: 82, examTag: 'B2必考' },
    { word: 'substancial', meaning: '实质的', freq: 79, examTag: 'B2必考' },
    { word: 'perspectiva', meaning: '视角', freq: 76, examTag: 'B2必考' },
    { word: 'paradigma', meaning: '范式', freq: 73, examTag: 'B2必考' },
    { word: 'efêmero', meaning: '短暂的', freq: 70, examTag: 'B2必考' },
  ],
  // Arabic
  ar_ALPT_1: [
    { word: 'مرحباً', meaning: '你好', freq: 99, examTag: 'ALPT 1' },
    { word: 'شكراً', meaning: '谢谢', freq: 97, examTag: 'ALPT 1' },
    { word: 'ماء', meaning: '水', freq: 95, examTag: 'ALPT 1' },
    { word: 'مدرسة', meaning: '学校', freq: 93, examTag: 'ALPT 1' },
    { word: 'بيت', meaning: '家', freq: 91, examTag: 'ALPT 1' },
  ],
  ar_ALPT_2: [
    { word: 'تجربة', meaning: '经验', freq: 87, examTag: 'ALPT 2' },
    { word: 'مهم', meaning: '重要的', freq: 85, examTag: 'ALPT 2' },
    { word: 'مختلف', meaning: '不同的', freq: 83, examTag: 'ALPT 2' },
    { word: 'تطوير', meaning: '发展', freq: 80, examTag: 'ALPT 2' },
    { word: 'ممكن', meaning: '可能的', freq: 78, examTag: 'ALPT 2' },
  ],
  ar_ALPT_3: [
    { word: 'فرصة', meaning: '机会', freq: 86, examTag: 'ALPT 3' },
    { word: 'حكومة', meaning: '政府', freq: 83, examTag: 'ALPT 3' },
    { word: 'تعليم', meaning: '教育', freq: 80, examTag: 'ALPT 3' },
    { word: 'مجتمع', meaning: '社会', freq: 77, examTag: 'ALPT 3' },
    { word: 'نتيجة', meaning: '后果', freq: 74, examTag: 'ALPT 3' },
  ],
  ar_ALPT_4: [
    { word: 'مع ذلك', meaning: '然而', freq: 82, examTag: 'ALPT 4' },
    { word: 'جوهري', meaning: '实质的', freq: 79, examTag: 'ALPT 4' },
    { word: 'منظور', meaning: '视角', freq: 76, examTag: 'ALPT 4' },
    { word: 'نموذج', meaning: '范式', freq: 73, examTag: 'ALPT 4' },
    { word: 'زائل', meaning: '短暂的', freq: 70, examTag: 'ALPT 4' },
  ],
  // Chinese
  zh_HSK1: [
    { word: '你好', meaning: 'Hello', freq: 99, examTag: 'HSK1必考' },
    { word: '谢谢', meaning: 'Thanks', freq: 97, examTag: 'HSK1必考' },
    { word: '学校', meaning: 'School', freq: 95, examTag: 'HSK1必考' },
    { word: '朋友', meaning: 'Friend', freq: 93, examTag: 'HSK1必考' },
    { word: '学习', meaning: 'Study', freq: 91, examTag: 'HSK1必考' },
  ],
  zh_HSK2: [
    { word: '帮助', meaning: 'Help', freq: 88, examTag: 'HSK2必考' },
    { word: '开始', meaning: 'Start', freq: 86, examTag: 'HSK2必考' },
    { word: '重要', meaning: 'Important', freq: 84, examTag: 'HSK2必考' },
    { word: '可能', meaning: 'Possible', freq: 82, examTag: 'HSK2必考' },
    { word: '运动', meaning: 'Exercise', freq: 80, examTag: 'HSK2必考' },
  ],
  zh_HSK3: [
    { word: '经验', meaning: 'Experience', freq: 87, examTag: 'HSK3必考' },
    { word: '环境', meaning: 'Environment', freq: 84, examTag: 'HSK3必考' },
    { word: '发展', meaning: 'Development', freq: 81, examTag: 'HSK3必考' },
    { word: '机会', meaning: 'Opportunity', freq: 78, examTag: 'HSK3必考' },
    { word: '教育', meaning: 'Education', freq: 75, examTag: 'HSK3必考' },
  ],
  zh_HSK4: [
    { word: '政府', meaning: 'Government', freq: 83, examTag: 'HSK4必考' },
    { word: '社会', meaning: 'Society', freq: 80, examTag: 'HSK4必考' },
    { word: '经济', meaning: 'Economy', freq: 77, examTag: 'HSK4必考' },
    { word: '文化', meaning: 'Culture', freq: 74, examTag: 'HSK4必考' },
    { word: '影响', meaning: 'Influence', freq: 71, examTag: 'HSK4必考' },
  ],
  zh_HSK5: [
    { word: '促进', meaning: 'Promote', freq: 85, examTag: 'HSK5必考' },
    { word: '概念', meaning: 'Concept', freq: 82, examTag: 'HSK5必考' },
    { word: '显著', meaning: 'Notable', freq: 79, examTag: 'HSK5必考' },
    { word: '把握', meaning: 'Grasp', freq: 76, examTag: 'HSK5必考' },
    { word: '然而', meaning: 'However', freq: 73, examTag: 'HSK5必考' },
  ],
  zh_HSK6: [
    { word: '范畴', meaning: 'Category', freq: 82, examTag: 'HSK6必考' },
    { word: '制约', meaning: 'Restrict', freq: 79, examTag: 'HSK6必考' },
    { word: '荒谬', meaning: 'Absurd', freq: 76, examTag: 'HSK6必考' },
    { word: '诠释', meaning: 'Interpret', freq: 73, examTag: 'HSK6必考' },
    { word: '渊源', meaning: 'Origin', freq: 70, examTag: 'HSK6必考' },
  ],
};

const GRAMMAR_POINTS: Record<string, Array<{ pattern: string; meaning: string; example: string; freq: number }>> = {
  ja_N5: [
    { pattern: '〜は〜です', meaning: '…是…', example: 'これは本です', freq: 99 },
    { pattern: '〜を〜ます', meaning: '做…（礼貌体）', example: '水を飲みます', freq: 97 },
  ],
  ja_N4: [
    { pattern: '〜ようになる', meaning: '变得…', example: '日本語が話せるようになった', freq: 91 },
    { pattern: '〜ために', meaning: '为了…', example: '試験のために勉強する', freq: 89 },
  ],
  ja_N3: [
    { pattern: '〜に対して', meaning: '针对/对于…', example: '先生に対して敬意を示す', freq: 90 },
    { pattern: '〜にとって', meaning: '对…来说', example: '私にとって大切な人', freq: 87 },
  ],
  ja_N2: [
    { pattern: '〜に伴って', meaning: '伴随…', example: '経済成長に伴って物価が上がる', freq: 88 },
    { pattern: '〜をはじめ', meaning: '以…为首', example: '東京をはじめ多くの都市', freq: 85 },
  ],
  ja_N1: [
    { pattern: '〜いかんによらず', meaning: '不管…如何', example: '結果いかんによらず全力を尽くす', freq: 82 },
    { pattern: '〜ならではの', meaning: '只有…才有的', example: '日本ならではの文化', freq: 80 },
  ],
  en_A1: [
    { pattern: 'be + noun/adjective', meaning: '描述事物', example: 'She is a teacher', freq: 99 },
    { pattern: 'do/does questions', meaning: '一般疑问', example: 'Do you like coffee?', freq: 97 },
  ],
  en_A2: [
    { pattern: 'present perfect', meaning: '现在完成时', example: 'I have been to Paris', freq: 91 },
    { pattern: 'comparative forms', meaning: '比较级', example: 'This is better than that', freq: 89 },
  ],
  en_B1: [
    { pattern: 'conditionals (if/would)', meaning: '条件句', example: 'If I had money, I would travel', freq: 90 },
    { pattern: 'passive voice', meaning: '被动语态', example: 'The book was written in 1990', freq: 87 },
  ],
  en_B2: [
    { pattern: 'inversion', meaning: '倒装', example: 'Not only did he win, but he also broke the record', freq: 88 },
    { pattern: 'subjunctive mood', meaning: '虚拟语气', example: 'I suggest that he study more', freq: 85 },
  ],
  en_C1: [
    { pattern: 'cleft sentences', meaning: '分裂句', example: 'It was the teacher who inspired me', freq: 82 },
    { pattern: 'fronting for emphasis', meaning: '前置强调', example: 'Never have I seen such beauty', freq: 80 },
  ],
  ko_TOPIK1: [
    { pattern: '은/는 (topic)', meaning: '主题标记', example: '저는 학생입니다', freq: 99 },
    { pattern: '을/를 (object)', meaning: '宾语标记', example: '책을 읽어요', freq: 97 },
  ],
  ko_TOPIK2: [
    { pattern: '아/어서 (reason)', meaning: '原因', example: '바빠서 못 갔어요', freq: 91 },
    { pattern: '으면 (if/when)', meaning: '条件', example: '비가 오면 안 가요', freq: 89 },
  ],
  ko_TOPIK3: [
    { pattern: '는데 (background)', meaning: '背景说明', example: '갔는데 문이 닫혔어요', freq: 90 },
    { pattern: '기 때문에 (because)', meaning: '因为', example: '늦었기 때문에 택시를 탔어요', freq: 87 },
  ],
  ko_TOPIK4: [
    { pattern: '더라도 (even if)', meaning: '即使', example: '힘들더라도 포기하지 마세요', freq: 88 },
    { pattern: '는 법이다 (tendency)', meaning: '规律', example: '열심히 하면 되는 법이다', freq: 85 },
  ],
  fr_DELF_A1: [
    { pattern: 'être + adjectif', meaning: '描述', example: 'Elle est gentille', freq: 99 },
    { pattern: 'ne...pas (negation)', meaning: '否定', example: 'Je ne comprends pas', freq: 97 },
  ],
  fr_DELF_A2: [
    { pattern: 'passé composé', meaning: '复合过去时', example: 'J\'ai mangé une pomme', freq: 91 },
    { pattern: 'futur proche', meaning: '最近将来时', example: 'Je vais partir', freq: 89 },
  ],
  fr_DELF_B1: [
    { pattern: 'conditionnel présent', meaning: '条件式现在时', example: 'Je voudrais un café', freq: 90 },
    { pattern: 'subjonctif présent', meaning: '虚拟式现在时', example: 'Il faut que tu viennes', freq: 87 },
  ],
  fr_DELF_B2: [
    { pattern: 'plus-que-parfait', meaning: '愈过去时', example: 'Il était déjà parti', freq: 88 },
    { pattern: 'discours indirect', meaning: '间接引语', example: 'Il a dit qu\'il viendrait', freq: 85 },
  ],
  es_DELE_A1: [
    { pattern: 'ser/estar', meaning: '是/在', example: 'Ella es alta / Está feliz', freq: 99 },
    { pattern: 'gustar (to like)', meaning: '喜欢', example: 'Me gusta el café', freq: 97 },
  ],
  es_DELE_A2: [
    { pattern: 'pretérito indefinido', meaning: '简单过去时', example: 'Ayer fui al cine', freq: 91 },
    { pattern: 'imperfecto vs indefinido', meaning: '过去时对比', example: 'Estudiaba cuando llamaste', freq: 89 },
  ],
  es_DELE_B1: [
    { pattern: 'subjuntivo presente', meaning: '虚拟式现在时', example: 'Quiero que vengas', freq: 90 },
    { pattern: 'condicional simple', meaning: '条件式', example: 'Me gustaría viajar', freq: 87 },
  ],
  es_DELE_B2: [
    { pattern: 'subjuntivo imperfecto', meaning: '虚拟式过去未完成', example: 'Si tuviera dinero, viajaría', freq: 88 },
    { pattern: 'pluscuamperfecto subj.', meaning: '虚拟式过去完成', example: 'Ojalá hubiera sabido', freq: 85 },
  ],
  de_Goethe_A1: [
    { pattern: 'sein + Adjektiv', meaning: '描述', example: 'Das Haus ist groß', freq: 99 },
    { pattern: 'nicht (negation)', meaning: '否定', example: 'Ich verstehe nicht', freq: 97 },
  ],
  de_Goethe_A2: [
    { pattern: 'Perfekt mit haben/sein', meaning: '完成时', example: 'Ich habe gegessen', freq: 91 },
    { pattern: 'Modalverben', meaning: '情态动词', example: 'Ich muss lernen', freq: 89 },
  ],
  de_Goethe_B1: [
    { pattern: 'Konjunktiv II', meaning: '第二虚拟式', example: 'Ich würde gern reisen', freq: 90 },
    { pattern: 'Relativsätze', meaning: '关系从句', example: 'Der Mann, der dort steht', freq: 87 },
  ],
  de_Goethe_B2: [
    { pattern: 'Passiv mit Modalverb', meaning: '情态被动', example: 'Das muss gemacht werden', freq: 88 },
    { pattern: 'Nominalisierung', meaning: '名词化', example: 'das Verstehen der Grammatik', freq: 85 },
  ],
  it_CILS_A1: [
    { pattern: 'essere/avere', meaning: '是/有', example: 'Io sono italiano / Ho fame', freq: 99 },
    { pattern: 'non (negation)', meaning: '否定', example: 'Non capisco', freq: 97 },
  ],
  it_CILS_A2: [
    { pattern: 'passato prossimo', meaning: '近过去时', example: 'Ho mangiato la pizza', freq: 91 },
    { pattern: 'futuro semplice', meaning: '将来时', example: 'Domani andrò a Roma', freq: 89 },
  ],
  it_CILS_B1: [
    { pattern: 'condizionale presente', meaning: '条件式', example: 'Vorrei un caffè', freq: 90 },
    { pattern: 'congiuntivo presente', meaning: '虚拟式', example: 'Penso che sia vero', freq: 87 },
  ],
  it_CILS_B2: [
    { pattern: 'congiuntivo imperfetto', meaning: '虚拟式未完成', example: 'Se fossi ricco, viaggerei', freq: 88 },
    { pattern: 'periodo ipotetico', meaning: '假设句', example: 'Se avessi saputo, sarei venuto', freq: 85 },
  ],
  pt_CELPE_A1: [
    { pattern: 'ser/estar', meaning: '是/在', example: 'Eu sou brasileiro / Estou feliz', freq: 99 },
    { pattern: 'não (negation)', meaning: '否定', example: 'Não entendo', freq: 97 },
  ],
  pt_CELPE_A2: [
    { pattern: 'pretérito perfeito', meaning: '过去完成时', example: 'Ontem eu fui ao cinema', freq: 91 },
    { pattern: 'futuro com ir', meaning: '将来时', example: 'Vou viajar amanhã', freq: 89 },
  ],
  pt_CELPE_B1: [
    { pattern: 'subjuntivo presente', meaning: '虚拟式现在时', example: 'Espero que você venha', freq: 90 },
    { pattern: 'condicional', meaning: '条件式', example: 'Gostaria de viajar', freq: 87 },
  ],
  pt_CELPE_B2: [
    { pattern: 'subjuntivo imperfeito', meaning: '虚拟式未完成', example: 'Se eu tivesse dinheiro', freq: 88 },
    { pattern: 'discurso indireto', meaning: '间接引语', example: 'Ele disse que viria', freq: 85 },
  ],
  ar_ALPT_1: [
    { pattern: 'الجملة الاسمية', meaning: '名词句', example: 'البيت كبير', freq: 99 },
    { pattern: 'النفي بـ لا', meaning: '否定', example: 'لا أفهم', freq: 97 },
  ],
  ar_ALPT_2: [
    { pattern: 'الماضي البسيط', meaning: '过去时', example: 'ذهبت إلى المدرسة', freq: 91 },
    { pattern: 'المضارع', meaning: '现在时', example: 'أدرس كل يوم', freq: 89 },
  ],
  ar_ALPT_3: [
    { pattern: 'المستقبل بـ سـ', meaning: '将来时', example: 'سأسافر غداً', freq: 90 },
    { pattern: 'الجملة الشرطية', meaning: '条件句', example: 'إن تدرس تنجح', freq: 87 },
  ],
  ar_ALPT_4: [
    { pattern: 'المصدر المؤول', meaning: '名词化', example: 'أن تدرس خير لك', freq: 88 },
    { pattern: 'أسلوب الاستثناء', meaning: '排除式', example: 'جاء الطلاب إلا واحداً', freq: 85 },
  ],
  zh_HSK1: [
    { pattern: '是…的 (emphasis)', meaning: '强调结构', example: '我是昨天来的', freq: 99 },
    { pattern: '了 (completion)', meaning: '完成体', example: '我吃了饭', freq: 97 },
  ],
  zh_HSK2: [
    { pattern: '比 (comparison)', meaning: '比较', example: '他比我高', freq: 91 },
    { pattern: '着 (continuous)', meaning: '持续体', example: '门开着', freq: 89 },
  ],
  zh_HSK3: [
    { pattern: '把字句', meaning: '处置式', example: '我把书放在桌子上了', freq: 90 },
    { pattern: '被字句', meaning: '被动句', example: '杯子被他打破了', freq: 87 },
  ],
  zh_HSK4: [
    { pattern: '只要…就', meaning: '只要…就', example: '只要努力，就能成功', freq: 88 },
    { pattern: '不仅…而且', meaning: '不仅…而且', example: '他不仅聪明而且勤奋', freq: 85 },
  ],
  zh_HSK5: [
    { pattern: '与其…不如', meaning: '与其…不如', example: '与其等待，不如行动', freq: 82 },
    { pattern: '之所以…是因为', meaning: '之所以…是因为', example: '之所以成功，是因为坚持', freq: 80 },
  ],
  zh_HSK6: [
    { pattern: '尚且…何况', meaning: '尚且…何况', example: '大人尚且不懂，何况小孩', freq: 82 },
    { pattern: '与其说…不如说', meaning: '与其说…不如说', example: '与其说是聪明，不如说是勤奋', freq: 79 },
  ],
};

function getVocab(lang: string, level: string) {
  return EXAM_VOCAB[`${lang}_${level}`] ?? EXAM_VOCAB[`ja_N5`];
}
function getGrammar(lang: string, level: string) {
  return GRAMMAR_POINTS[`${lang}_${level}`] ?? GRAMMAR_POINTS[`ja_N5`];
}

// Fake quiz generator
function generateQuiz(vocab: typeof EXAM_VOCAB['ja_N5']) {
  const item = vocab[Math.floor(Math.random() * vocab.length)];
  const wrongs = vocab.filter((v) => v.meaning !== item.meaning).slice(0, 3).map((v) => v.meaning);
  const opts = [...wrongs, item.meaning].sort(() => Math.random() - 0.5);
  return { question: `「${item.word}」的意思是？`, answer: item.meaning, options: opts, word: item.word };
}

export const ExamTargetTab: React.FC<ExamTargetTabProps> = ({ sessionKey, languageCode, languageName }) => {
  const [targets, setTargets] = useState<ExamTarget[]>([]);
  const [userGoal, setUserGoal] = useState<UserGoal | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<ExamTarget | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const [quizItem, setQuizItem] = useState<ReturnType<typeof generateQuiz> | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);

  const loadData = useCallback(async () => {
    const [targetsRes, goalRes] = await Promise.all([
      supabase.from('exam_targets').select('*').eq('lang_code', languageCode).eq('is_active', true).order('order_index'),
      supabase.from('user_exam_goals').select('*,exam_targets(*)').eq('session_key', sessionKey).eq('is_active', true).maybeSingle(),
    ]);
    const ts = (targetsRes.data ?? []) as ExamTarget[];
    setTargets(ts);
    if (goalRes.data) {
      setUserGoal(goalRes.data as UserGoal);
      const et = (goalRes.data as { exam_targets: ExamTarget }).exam_targets;
      setSelectedTarget(et);
    }
  }, [sessionKey, languageCode]);

  useEffect(() => {
    setLoading(true);
    loadData().finally(() => setLoading(false));
  }, [loadData]);

  async function saveGoal(target: ExamTarget) {
    setSaving(true);
    if (userGoal) {
      await supabase.from('user_exam_goals').update({ exam_target_id: target.id, is_active: true }).eq('id', userGoal.id);
    } else {
      await supabase.from('user_exam_goals').insert({ session_key: sessionKey, exam_target_id: target.id });
    }
    setSelectedTarget(target);
    setSaving(false);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
    loadData();
  }

  function startQuiz() {
    const vocab = getVocab(languageCode, selectedTarget?.level_code ?? 'N5');
    setQuizItem(generateQuiz(vocab));
    setQuizAnswer(null);
  }

  function answerQuiz(ans: string) {
    setQuizAnswer(ans);
    if (quizItem && ans === quizItem.answer) setStreak((s) => s + 1);
    else setStreak(0);
    setTimeout(() => { setQuizItem(null); startQuiz(); }, 1200);
  }

  const vocab = selectedTarget ? getVocab(languageCode, selectedTarget.level_code) : [];
  const grammar = selectedTarget ? getGrammar(languageCode, selectedTarget.level_code) : [];

  if (loading) return <div className="gv-tab-loading">加载考试体系…</div>;

  return (
    <div className="et-wrap">
      {/* Goal selector */}
      <div className="et-goal-section">
        <h3 className="et-section-title">设定目标考试</h3>
        <div className="et-targets-grid">
          {targets.map((t) => (
            <button key={t.id}
              className={`et-target-btn ${selectedTarget?.id === t.id ? 'active' : ''}`}
              onClick={() => saveGoal(t)}
              disabled={saving}
            >
              {t.level_label}
            </button>
          ))}
        </div>
        {targets.length === 0 && <p className="et-no-targets">该语言暂无考试体系配置</p>}
        {savedMsg && <p className="et-saved">✓ 目标已保存！</p>}
      </div>

      {selectedTarget && (
        <>
          {/* Progress card */}
          <div className="et-progress-card">
            <div className="et-progress-top">
              <span className="et-progress-label">当前目标：{selectedTarget.level_label}</span>
              <span className="et-streak">🔥 连对 {streak} 题</span>
            </div>
            <div className="et-progress-bar-wrap">
              <div className="et-progress-fill" style={{ width: `${Math.min(streak * 10, 100)}%` }} />
            </div>
            <p className="et-progress-hint">连对10题解锁成就徽章</p>
          </div>

          {/* Quiz */}
          <div className="et-quiz-section">
            <div className="et-quiz-header">
              <h3 className="et-section-title">针对性模拟题</h3>
              <button className="et-quiz-start" onClick={startQuiz}>开始练习</button>
            </div>
            {quizItem && (
              <div className="et-quiz-card">
                <p className="et-quiz-q">{quizItem.question}</p>
                <div className="et-quiz-opts">
                  {quizItem.options.map((opt) => (
                    <button key={opt}
                      className={`et-quiz-opt ${quizAnswer === opt ? (opt === quizItem.answer ? 'correct' : 'wrong') : ''} ${quizAnswer && opt === quizItem.answer ? 'correct' : ''}`}
                      onClick={() => !quizAnswer && answerQuiz(opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* High-freq vocab */}
          <div className="et-freq-section">
            <h3 className="et-section-title">高频词汇（按考试频率排序）</h3>
            <div className="et-vocab-list">
              {vocab.map((v) => (
                <div className="et-vocab-card" key={v.word}>
                  <div className="et-vocab-left">
                    <span className="et-vocab-word">{v.word}</span>
                    {v.reading && <span className="et-vocab-reading">{v.reading}</span>}
                    <span className="et-vocab-meaning">{v.meaning}</span>
                  </div>
                  <div className="et-vocab-right">
                    <span className="et-exam-tag">{v.examTag}</span>
                    <div className="et-freq-bar-wrap">
                      <div className="et-freq-fill" style={{ width: `${v.freq}%` }} />
                    </div>
                    <span className="et-freq-num">考频 {v.freq}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grammar points */}
          <div className="et-freq-section">
            <h3 className="et-section-title">核心语法点</h3>
            {grammar.map((g) => (
              <div className="et-grammar-card" key={g.pattern}>
                <div className="et-grammar-top">
                  <span className="et-grammar-pattern">{g.pattern}</span>
                  <div className="et-freq-bar-wrap small">
                    <div className="et-freq-fill" style={{ width: `${g.freq}%` }} />
                  </div>
                </div>
                <p className="et-grammar-meaning">{g.meaning}</p>
                <p className="et-grammar-example">{g.example}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
