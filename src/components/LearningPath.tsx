import React, { useState, useEffect, useCallback } from 'react';
import { FloatingBack } from './FloatingBack';
import { callAI, AIMessage } from '../lib/aiClient';
import { supabase } from '../data/supabase';

/* ─── 语言学习路线数据 — 参考多邻国 + 各语言最佳教材 ─── */

interface LearningStage {
  id: string;
  title: string;
  titleZh: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  icon: string;
  topics: string[];
  duration: string; // 预计学习时长
  skills: string[];
}

/* 10种语言的学习路线，参考权威教材和大咖经验 */
const LANGUAGE_ROADMAPS: Record<string, {
  name: string;
  textbook: string;
  expertTips: string;
  stages: LearningStage[];
}> = {
  ja: {
    name: '日语',
    textbook: '《大家的日语》+ JLPT标准',
    expertTips: '吴鲁鄂教授学习法：先攻克50音→同时学语法和词汇→尽早接触真实材料。每天30min朗读+听写。JLPT N5→N4→N3→N2→N1 逐级提升，不要跳级。',
    stages: [
      { id:'ja_a1', title:'五十音 & 基础问候', titleZh:'あいうえお', level:'A1', icon:'🔰', topics:['平假名','片假名','汉字入门','自我介绍','数字与时间','简单问候语'], duration:'2-4周', skills:['假名读写','简单对话','数字表达'] },
      { id:'ja_a2', title:'日常生活基础', titleZh:'日常会話', level:'A1', icon:'🏠', topics:['购物','餐厅点餐','问路','日期天气','家庭介绍','兴趣爱好','颜色形状'], duration:'4-6周', skills:['日常对话','基本购物','方位表达'] },
      { id:'ja_a3', title:'语法基础 I', titleZh:'文法初級', level:'A2', icon:'📖', topics:['です・ます体','形容词活用','动词分类(五段/一段/不规则)','て形','た形','ない形','辞书形'], duration:'6-8周', skills:['基础动词变形','礼貌体对话','形容词比较级'] },
      { id:'ja_a4', title:'实用场景强化', titleZh:'実用会話', level:'A2', icon:'💼', topics:['医院就医','银行办事','租房签约','电话预约','快递收发','美容美发','公共交通'], duration:'4-6周', skills:['场景完整对话','敬语入门','读写短文'] },
      { id:'ja_b1', title:'语法进阶 & 敬语', titleZh:'中級文法', level:'B1', icon:'📚', topics:['可能形','被动形','使役形','使役被动','敬语体系(尊敬・謙譲・丁寧)','条件形','意志形','推量形'], duration:'8-12周', skills:['复杂语法应用','敬语正确使用','长文阅读','JLPT N3水平'] },
      { id:'ja_b2', title:'商务日语 & 新闻阅读', titleZh:'ビジネス日本語', level:'B2', icon:'🏢', topics:['商务邮件','会议发言','企划书写作','新闻速读','论文摘要','面试策略','商务礼仪'], duration:'8-12周', skills:['商务场景','新闻阅读','论文写作','JLPT N2水平'] },
      { id:'ja_c1', title:'高级表达 & 文学鉴赏', titleZh:'上級日本語', level:'C1', icon:'🎭', topics:['古典文法入门','文学作品赏析','时事评论','辩论技巧','学术发表','翻译实践'], duration:'12-16周', skills:['文学鉴赏','时事评论','学术写作','JLPT N1水平'] },
      { id:'ja_c2', title:'母语级精通', titleZh:'ネイティブ級', level:'C2', icon:'👑', topics:['文言文','方言研究','同声传译','专业领域写作','日本文化深层理解','演讲与表达'], duration:'持续学习', skills:['母语级表达','专业翻译','文化深度理解'] },
    ],
  },
  en: {
    name: '英语',
    textbook: '《新概念英语》+ 剑桥标准',
    expertTips: '赖世雄学习法：每天坚持听30分钟英语播客（BBC/VOA），影子跟读法提升口语。词汇优先高频3000词，用Anki间隔复习。语法用《English Grammar in Use》。CEFR A1-A2-B1-B2-C1-C2 逐级提升。',
    stages: [
      { id:'en_a1', title:'字母发音 & 基础问候', titleZh:'Hello World', level:'A1', icon:'🔰', topics:['字母','音标','自我介绍','数字','颜色','家庭成员','简单问候'], duration:'2-4周', skills:['基本发音','简单问候','自我表达'] },
      { id:'en_a2', title:'日常生活英语', titleZh:'Daily Life', level:'A1', icon:'🏠', topics:['购物对话','餐厅点餐','问路指路','时间日期','天气描述','爱好表达','描述人物'], duration:'4-6周', skills:['日常对话','基本语法','简单写作'] },
      { id:'en_a3', title:'时态 & 句法基础', titleZh:'Grammar Base', level:'A2', icon:'📖', topics:['一般现在时','现在进行时','一般过去时','现在完成时','将来时','情态动词','比较级最高级','被动语态入门'], duration:'6-8周', skills:['基础时态','复杂句子','短文写作'] },
      { id:'en_a4', title:'旅行 & 社交英语', titleZh:'Travel English', level:'A2', icon:'✈️', topics:['机场通关','酒店入住','紧急求助','社交派对','意见表达','建议与推荐','电话英语'], duration:'4-6周', skills:['旅行场景','社交表达','电话沟通'] },
      { id:'en_b1', title:'商务 & 工作英语', titleZh:'Business English', level:'B1', icon:'💼', topics:['商务邮件','会议发言','面试技巧','商务谈判','项目汇报','职场社交','演讲技巧'], duration:'8-12周', skills:['商务写作','演讲表达','B1/B2考试'] },
      { id:'en_b2', title:'学术英语 & 批判思维', titleZh:'Academic English', level:'B2', icon:'🎓', topics:['论文写作','文献综述','批判思维','辩论技巧','数据图表描述','学术演讲','学术词汇'], duration:'8-12周', skills:['学术写作','批判思维','托福90+/雅思6.5+'] },
      { id:'en_c1', title:'高级表达 & 文学', titleZh:'Advanced', level:'C1', icon:'📚', topics:['文学作品赏析','深度评论','创意写作','专业领域英语','同声传译基础','文化分析'], duration:'12-16周', skills:['母语流畅度','专业写作','翻译能力'] },
      { id:'en_c2', title:'精通级', titleZh:'Mastery', level:'C2', icon:'👑', topics:['高级修辞学','文体模仿','跨文化沟通','学术发表','专业翻译','英语教学法'], duration:'持续精进', skills:['母语级精通','学术发表','教学能力'] },
    ],
  },
  ko: {
    name: '韩语',
    textbook: '《延世韩国语》+ TOPIK标准',
    expertTips: '延世大学教学法：先用한글ローマ字对照表攻克发音→《延世韩国语》1-6册系统学习→韩国综艺/电视剧沉浸式输入→TOPIK初级→中级→高级。每天30分钟口语+听写，语法归纳为模板。',
    stages: [
      { id:'ko_a1', title:'韩文字母 & 发音', titleZh:'한글 입문', level:'A1', icon:'🔰', topics:['母音','子音','双韵尾','连音规则','自我介绍','数字系统','简单问候'], duration:'2-4周', skills:['韩文读写','基本发音','简单问候'] },
      { id:'ko_a2', title:'日常基础会话', titleZh:'기초 회화', level:'A1', icon:'🏠', topics:['购物','餐厅','问路','家庭成员','日期表达','兴趣爱好','韩国美食'], duration:'4-6周', skills:['基础对话','日常表达','韩文打字'] },
      { id:'ko_a3', title:'语法基础', titleZh:'기초 문법', level:'A2', icon:'📖', topics:['은/는 主题','이/가 主语','을/를 宾语','아/어/해서','지요/군요','고/지만/니까','时态体系'], duration:'6-8周', skills:['基础语法','简单写作','TOPIK初级'] },
      { id:'ko_a4', title:'生活场景会话', titleZh:'생활 한국어', level:'A2', icon:'💬', topics:['银行','医院','租房','美容院','生日聚会','约会','韩国礼节'], duration:'4-6周', skills:['场景对话','敬语使用','短篇阅读'] },
      { id:'ko_b1', title:'中级语法 & 敬语体系', titleZh:'중급 문법', level:'B1', icon:'📚', topics:['间接引用','使动被动','推测表达','敬语升级','间接语气','书面语vs口语','复杂连接词'], duration:'8-12周', skills:['中级写作','TOPIK中级','新闻阅读'] },
      { id:'ko_b2', title:'商务韩语 & 媒介阅读', titleZh:'비즈니스 한국어', level:'B2', icon:'🏢', topics:['商务邮件','面试准备','工作报告','韩国企业文化','新闻阅读','社会议题讨论'], duration:'8-12周', skills:['商务沟通','评论写作','TOPIK高级'] },
      { id:'ko_c1', title:'高级韩语 & 文化', titleZh:'고급 한국어', level:'C1', icon:'🎭', topics:['文学作品','影视剧本分析','时事评论','学术论文','翻译实践','韩国传统文化'], duration:'12-16周', skills:['高级写作','文学分析','翻译能力'] },
      { id:'ko_c2', title:'母语级精通', titleZh:'원어민 수준', level:'C2', icon:'👑', topics:['古韩文','方言','同声传译','专业领域','韩语教学法'], duration:'持续学习', skills:['母语级','专业翻译','教学能力'] },
    ],
  },
  fr: {
    name: '法语',
    textbook: '《Reflets》+ DELF/DALF标准',
    expertTips: '法语联盟教学法：先攻克音素体系（鼻化元音是难点）→ Reflets循序渐进→法语电台RFI每日新闻→DELF A1→A2→B1→B2→DALF C1→C2。每天30分钟听力+朗读，动词变位用卡片积累。',
    stages: [
      { id:'fr_a1', title:'字母音素 & 基础问候', titleZh:'Bonjour!', level:'A1', icon:'🔰', topics:['字母','音素','鼻化元音','自我介绍','数字','颜色','简单问候','国籍表达'], duration:'2-4周', skills:['发音规则','基本对话','自我介绍'] },
      { id:'fr_a2', title:'日常法语', titleZh:'Vie Quotidienne', level:'A1', icon:'🏠', topics:['购物','餐厅','交通','日期天气','家庭','爱好','描述人物'], duration:'4-6周', skills:['日常对话','基础语法','简单阅读'] },
      { id:'fr_a3', title:'语法基础', titleZh:'Grammaire', level:'A2', icon:'📖', topics:['名词阴阳性','冠词体系','形容词位置与配合','主要时态(现在/复合过去/未完成过去/简单将来)','代动词','否定表达'], duration:'6-8周', skills:['基础语法','时态运用','短文写作'] },
      { id:'fr_a4', title:'旅行 & 文化法语', titleZh:'Voyage', level:'A2', icon:'🗼', topics:['酒店','博物馆','问路','订票','紧急情况','法国文化','餐桌礼仪'], duration:'4-6周', skills:['旅行场景','文化理解','中级对话'] },
      { id:'fr_b1', title:'中级表达 & 条件式', titleZh:'Intermédiaire', level:'B1', icon:'📚', topics:['虚拟式','条件式','不定式过去时','代动词复杂用法','关系代词','辩论基础','时事讨论'], duration:'8-12周', skills:['复杂语法','辩论表达','DELF B1'] },
      { id:'fr_b2', title:'专业 & 学术法语', titleZh:'Français Pro', level:'B2', icon:'🎓', topics:['商务法语','学术写作','论文结构','法国社会','文学入门','电影分析','政治制度'], duration:'8-12周', skills:['学术写作','专业表达','DELF B2'] },
      { id:'fr_c1', title:'高级法语 & 文学', titleZh:'Avancé', level:'C1', icon:'🎭', topics:['经典文学','哲学入门','高级修辞','专业翻译','同声传译','文化评论'], duration:'12-16周', skills:['文学分析','批判思维','翻译能力'] },
      { id:'fr_c2', title:'精通级', titleZh:'Maîtrise', level:'C2', icon:'👑', topics:['古典法语','区域方言','高级翻译','学术发表','法语教学','法国文化深度'], duration:'持续精进', skills:['母语级','学术发表','教学能力'] },
    ],
  },
  es: { name: '西班牙语', textbook: '《Aula Internacional》+ DELE标准', expertTips: '塞万提斯学院教学法：先掌握发音规则(拼读一致)→Aula系统学习→西班牙语播客(RTVE)→拉美影视沉浸→DELE逐级考试。每天30分钟口语+听写，注意拉美和西班牙用词差异。',
    stages: [
      { id:'es_a1', title:'发音 & 基础问候', titleZh:'¡Hola!', level:'A1', icon:'🔰', topics:['字母发音','重音规则','自我介绍','数字','颜色','国家','简单问候','ser/estar'], duration:'2-4周', skills:['发音规则','基本对话','自我介绍'] },
      { id:'es_a2', title:'日常生活', titleZh:'Vida Diaria', level:'A1', icon:'🏠', topics:['购物','餐厅','交通','家庭','天气','爱好','描述外貌性格'], duration:'4-6周', skills:['日常对话','基础表达','简单阅读'] },
      { id:'es_a3', title:'动词变位基础', titleZh:'Verbos', level:'A2', icon:'📖', topics:['现在时规则/不规则','简单过去时','未完成过去时','将来时','命令式','代词','gustar类动词'], duration:'6-8周', skills:['动词变位','时态区分','短文写作'] },
      { id:'es_a4', title:'旅行 & 文化', titleZh:'Viajes', level:'A2', icon:'🌎', topics:['机场','酒店','问路','紧急','西班牙文化','拉美文化','节日','tapas/食物'], duration:'4-6周', skills:['旅行场景','文化理解','拉美差异'] },
      { id:'es_b1', title:'虚拟式 & 复杂句', titleZh:'Subjuntivo', level:'B1', icon:'📚', topics:['现在虚拟式','过去虚拟式','条件式','复合句','间接引语','辩论基础','时事'], duration:'8-12周', skills:['虚拟式掌握','复杂表达','DELE B1'] },
      { id:'es_b2', title:'商务 & 学术', titleZh:'Negocios', level:'B2', icon:'💼', topics:['商务西语','邮件写作','项目汇报','西班牙历史','拉美文学','社会议题','学术基础'], duration:'8-12周', skills:['商务沟通','学术写作','DELE B2'] },
      { id:'es_c1', title:'高级西语', titleZh:'Avanzado', level:'C1', icon:'🎭', topics:['经典文学','电影分析','高级修辞','专业翻译','文化评论','方言差异'], duration:'12-16周', skills:['文学分析','翻译能力','批判思维'] },
      { id:'es_c2', title:'精通级', titleZh:'Maestría', level:'C2', icon:'👑', topics:['古典文学','方言','同声传译','学术发表','西语教学'], duration:'持续', skills:['母语级','学术发表'] },
    ],
  },
  de: { name: '德语', textbook: '《Menschen》+ 歌德学院标准', expertTips: '歌德学院教学法：先攻克发音(特别ö/ü/r)→名词三性四格是核心→《Menschen》系统学习→DW德国之声慢速新闻→每天30分钟语法总结+口语。动词位置(框形结构)是最大难点。',
    stages: [
      { id:'de_a1', title:'发音 & 基础', titleZh:'Hallo!', level:'A1', icon:'🔰', topics:['字母','öüäß','自我介绍','数字','颜色','名词gender','基础动词','简单问候'], duration:'2-4周', skills:['发音规则','der/die/das','简单对话'] },
      { id:'de_a2', title:'日常德语', titleZh:'Alltag', level:'A1', icon:'🏠', topics:['购物','餐厅','交通','家庭','天气','爱好','日期时间','描述人物'], duration:'4-6周', skills:['日常对话','基础语法'] },
      { id:'de_a3', title:'四格 & 动词位置', titleZh:'Fälle', level:'A2', icon:'📖', topics:['Nominativ','Akkusativ','Dativ','Genitiv','框形结构','可分动词','情态动词','现在时/现在完成时/过去时'], duration:'6-8周', skills:['四格掌握','动词位置','简单写作'] },
      { id:'de_a4', title:'旅行 & 文化', titleZh:'Reisen', level:'A2', icon:'🏰', topics:['酒店','博物馆','交通系统','城堡文化','啤酒节','紧急求助','德国礼仪'], duration:'4-6周', skills:['旅行场景','文化知识','中级表达'] },
      { id:'de_b1', title:'中级语法', titleZh:'Mittelstufe', level:'B1', icon:'📚', topics:['虚拟式(Konjunktiv II)','被动态','关系从句','不定式结构','形容词变格','介词搭配','连词体系'], duration:'8-12周', skills:['中级语法','复杂表达','Goethe B1'] },
      { id:'de_b2', title:'商务 & 学术', titleZh:'Beruf', level:'B2', icon:'💼', topics:['商务德语','邮件写作','学术德语','论文结构','德国政治','社会制度','职业培训体系'], duration:'8-12周', skills:['商务沟通','学术写作','Goethe B2'] },
      { id:'de_c1', title:'高级德语', titleZh:'Fortgeschritten', level:'C1', icon:'🎭', topics:['经典文学','哲学入门','高级修辞','专业翻译','文化分析','时事评论'], duration:'12-16周', skills:['文学分析','翻译能力','批判思维'] },
      { id:'de_c2', title:'精通级', titleZh:'Meisterschaft', level:'C2', icon:'👑', topics:['古典文学','方言研究','同声传译','学术发表','德语教学'], duration:'持续', skills:['母语级','学术发表'] },
    ],
  },
  it: { name: '意大利语', textbook: '《Nuovo Espresso》+ CILS/CELI标准', expertTips: '但丁学院教学法：发音规则简单→名词阴阳性+冠词先行→《Nuovo Espresso》系统学习→RAI意大利广播沉浸→每天30分钟口语+语法。注意近过去时vs未完成过去时区分。',
    stages: [
      { id:'it_a1', title:'发音 & 基础', titleZh:'Ciao!', level:'A1', icon:'🔰', topics:['字母','重音','自我介绍','数字','颜色','基本名词词性','简单动词','问候'], duration:'2-3周', skills:['发音规则','基本对话'] },
      { id:'it_a2', title:'日常意大利语', titleZh:'Vita', level:'A1', icon:'🏠', topics:['购物','餐厅(点菜)','交通','家庭','天气','爱好','咖啡文化'], duration:'4-6周', skills:['日常对话','基础表达'] },
      { id:'it_a3', title:'时态 & 语法', titleZh:'Grammatica', level:'A2', icon:'📖', topics:['直陈式现在时','近过去时','未完成过去时','将来时','条件式','命令式','代词','比较级'], duration:'6-8周', skills:['动词时态','简单写作','中级阅读'] },
      { id:'it_a4', title:'旅行 & 文化', titleZh:'Viaggio', level:'A2', icon:'🍝', topics:['酒店','景点','交通','意大利分区文化','美食菜系','艺术','歌剧'], duration:'4-6周', skills:['旅行场景','文化理解'] },
      { id:'it_b1', title:'虚拟式 & 进阶', titleZh:'Congiuntivo', level:'B1', icon:'📚', topics:['虚拟式现在/过去','条件句','间接引语','不定式结构','复杂代词','历史入门','文学入门'], duration:'8-12周', skills:['虚拟式','复杂表达','B1考试'] },
      { id:'it_b2', title:'商务 & 学术', titleZh:'Affari', level:'B2', icon:'💼', topics:['商务意语','邮件写作','意大利经济','设计时尚','艺术史','文学','学术基础'], duration:'8-12周', skills:['商务沟通','学术写作','B2考试'] },
      { id:'it_c1', title:'高级 & 文学', titleZh:'Avanzato', level:'C1', icon:'🎭', topics:['经典文学','但丁研究','高级修辞','艺术评论','翻译实践','方言入门'], duration:'12-16周', skills:['文学分析','翻译'] },
      { id:'it_c2', title:'精通级', titleZh:'Maestria', level:'C2', icon:'👑', topics:['古意大利语','方言','同声传译','学术发表','意语教学'], duration:'持续', skills:['母语级'] },
    ],
  },
  pt: { name: '葡萄牙语', textbook: '《Novo Avenida Brasil》+ Celpe-Bras标准', expertTips: '巴西葡萄牙语 vs 欧洲葡萄牙语差异大。先学标准发音(鼻元音特别)→《Novo Avenida》系统学习→巴西电视台Globo沉浸。每天30分钟口语+听力。注意人称不定式是特色语法。',
    stages: [
      { id:'pt_a1', title:'发音 & 基础', titleZh:'Olá!', level:'A1', icon:'🔰', topics:['字母','鼻元音','自我介绍','数字','颜色','ser/estar','简单问候'], duration:'2-4周', skills:['发音规则','基本对话'] },
      { id:'pt_a2', title:'日常葡语', titleZh:'Dia a Dia', level:'A1', icon:'🏠', topics:['购物','餐厅','交通','家庭','天气','爱好','海滩文化'], duration:'4-6周', skills:['日常对话','基础表达'] },
      { id:'pt_a3', title:'动词 & 语法', titleZh:'Verbos', level:'A2', icon:'📖', topics:['现在时','过去完成时','未完成过去时','将来时','条件式','人称不定式','代词位置','虚拟式入门'], duration:'6-8周', skills:['动词变位','人称不定式','简单写作'] },
      { id:'pt_a4', title:'巴西文化 & 旅行', titleZh:'Brasil', level:'A2', icon:'🌴', topics:['里约/圣保罗','嘉年华','samba/bossa nova','巴西美食','亚马逊','足球文化'], duration:'4-6周', skills:['文化理解','旅行对话'] },
      { id:'pt_b1', title:'虚拟式进阶', titleZh:'Subjuntivo', level:'B1', icon:'📚', topics:['虚拟式全面','间接引语','条件复合句','被动语态','巴西文学','影视分析'], duration:'8-12周', skills:['虚拟式','中级表达','B1考试'] },
      { id:'pt_b2', title:'商务 & 学术', titleZh:'Negócios', level:'B2', icon:'💼', topics:['商务葡语','邮件写作','巴西经济','金砖国家','学术葡语','社会议题'], duration:'8-12周', skills:['商务沟通','学术写作'] },
      { id:'pt_c1', title:'高级 & 文学', titleZh:'Avançado', level:'C1', icon:'🎭', topics:['Machado de Assis','Clarice Lispector','高级修辞','翻译实践','方言差异','文化深度'], duration:'12-16周', skills:['文学分析','翻译'] },
      { id:'pt_c2', title:'精通级', titleZh:'Maestria', level:'C2', icon:'👑', topics:['古典葡语','方言','同声传译','学术发表'], duration:'持续', skills:['母语级'] },
    ],
  },
  ar: { name: '阿拉伯语', textbook: '《Al-Kitaab》+ 标准阿拉伯语', expertTips: '先学字母表和发音(喉音/咽音是难点)→《Al-Kitaab》系统学习标准阿拉伯语→Al Jazeera新闻沉浸。注意方言差异巨大(埃及/沙姆/海湾)。每天30分钟书写+朗读，字母连写从右到左。',
    stages: [
      { id:'ar_a1', title:'字母 & 发音', titleZh:'أبجدية', level:'A1', icon:'🔰', topics:['28字母','短元音','长元音','sun/moon字母','数字','自我介绍','简单问候'], duration:'4-6周', skills:['字母读写','发音','右向左书写'] },
      { id:'ar_a2', title:'日常阿语', titleZh:'الحياة', level:'A1', icon:'🏠', topics:['家庭','购物','餐厅','天气','颜色','日期','方位'], duration:'4-6周', skills:['日常对话','基础阅读'] },
      { id:'ar_a3', title:'语法基础', titleZh:'قواعد', level:'A2', icon:'📖', topics:['名词性数格','形容词搭配','动词过去/现在时','命令式','主语-动词倒装','Idafa结构','介词'], duration:'6-8周', skills:['基础语法','简单写作'] },
      { id:'ar_a4', title:'文化 & 媒体', titleZh:'ثقافة', level:'A2', icon:'🕌', topics:['伊斯兰文化','阿拉伯美食','传统节日','音乐','基础新闻阅读','简单方言理解'], duration:'4-6周', skills:['文化理解','媒体入门'] },
      { id:'ar_b1', title:'中级语法 & 方言', titleZh:'متوسط', level:'B1', icon:'📚', topics:['动词形态系统(10种)','被动式','关系从句','条件句','埃及方言基础','阿拉伯文学入门'], duration:'8-12周', skills:['中级语法','方言基础','B1水平'] },
      { id:'ar_b2', title:'媒体 & 学术', titleZh:'إعلام', level:'B2', icon:'📰', topics:['新闻分析','政经阿语','阿拉伯世界政治','学术写作','宗教文本','演讲技巧'], duration:'8-12周', skills:['媒体阅读','学术写作'] },
      { id:'ar_c1', title:'高级 & 古典', titleZh:'متقدم', level:'C1', icon:'🎭', topics:['古兰经阿拉伯语','古典文学','现代文学','诗歌','高级翻译','方言深入'], duration:'12-16周', skills:['古典理解','翻译','文学分析'] },
      { id:'ar_c2', title:'精通级', titleZh:'إتقان', level:'C2', icon:'👑', topics:['古典语法','各地方言','同声传译','学术发表','阿语教学'], duration:'持续', skills:['母语级'] },
    ],
  },
  zh: { name: '中文', textbook: '《HSK标准教程》+ 孔子学院标准', expertTips: '先学拼音→汉字基础笔画部首→《HSK标准教程》1-6级→中文影视沉浸。每天30分钟写字+朗读。汉字学习用部首+联想记忆法。注意四声发音是最大难点。',
    stages: [
      { id:'zh_a1', title:'拼音 & 基础汉字', titleZh:'入门', level:'A1', icon:'🔰', topics:['拼音','四声','数字','问候','自我介绍','家庭','颜色','简单动词'], duration:'4-6周', skills:['拼音','150基础汉字','自我介绍'] },
      { id:'zh_a2', title:'日常中文', titleZh:'日常', level:'A1', icon:'🏠', topics:['购物','餐厅','问路','日期时间','天气','身体部位','学校'], duration:'4-6周', skills:['日常对话','300汉字'] },
      { id:'zh_a3', title:'语法基础', titleZh:'语法', level:'A2', icon:'📖', topics:['"了"的用法','"过"/"着"','量词系统','比较句','把字句','被字句','补语','连动句'], duration:'6-8周', skills:['基础语法','600汉字','HSK3级'] },
      { id:'zh_a4', title:'文化 & 旅行', titleZh:'文化', level:'A2', icon:'🏯', topics:['中国节庆','美食','京剧','功夫','书法','旅游','中文歌曲'], duration:'4-6周', skills:['文化知识','旅行中文','1000汉字'] },
      { id:'zh_b1', title:'进阶表达', titleZh:'进阶', level:'B1', icon:'📚', topics:['成语故事','新闻阅读','演讲技巧','比较文化','社会话题','历史入门'], duration:'8-12周', skills:['成语运用','中级写作','HSK4级'] },
      { id:'zh_b2', title:'商务 & 学术', titleZh:'商务', level:'B2', icon:'💼', topics:['商务中文','邮件写作','中国商业文化','学术论文','文学入门','中国当代社会'], duration:'8-12周', skills:['商务沟通','学术写作','HSK5级'] },
      { id:'zh_c1', title:'高级中文', titleZh:'高级', level:'C1', icon:'🎭', topics:['古典文学','文言文','高级成语','诗词','翻译实践','哲学'], duration:'12-16周', skills:['文言文','翻译','HSK6级'] },
      { id:'zh_c2', title:'精通级', titleZh:'精通', level:'C2', icon:'👑', topics:['古典文献','方言','同声传译','学术发表','中文教学'], duration:'持续', skills:['母语级'] },
    ],
  },
};

/* 各语言默认8阶段的简化版本（用于未专门设计的语言） */
const DEFAULT_STAGES: LearningStage[] = [
  { id:'_a1', title:'字母发音 & 基础', titleZh:'入门', level:'A1', icon:'🔰', topics:['字母发音','自我介绍','数字','基本问候'], duration:'2-4周', skills:['发音','基本对话'] },
  { id:'_a2', title:'日常生活基础', titleZh:'日常', level:'A1', icon:'🏠', topics:['购物','餐厅','问路','家庭','天气'], duration:'4-6周', skills:['日常对话','基础语法'] },
  { id:'_a3', title:'语法基础', titleZh:'语法', level:'A2', icon:'📖', topics:['动词时态','名词变化','基本句型','形容词'], duration:'6-8周', skills:['基础语法','简单写作'] },
  { id:'_a4', title:'场景对话', titleZh:'场景', level:'A2', icon:'💬', topics:['旅行','社交','文化','媒体'], duration:'4-6周', skills:['中级对话','文化理解'] },
  { id:'_b1', title:'中级表达', titleZh:'中级', level:'B1', icon:'📚', topics:['复杂语法','读写练习','辩论','新闻'], duration:'8-12周', skills:['中级水平','阅读能力'] },
  { id:'_b2', title:'商务 & 学术', titleZh:'商务', level:'B2', icon:'💼', topics:['商务沟通','学术写作','专业词汇'], duration:'8-12周', skills:['商务','学术'] },
  { id:'_c1', title:'高级 & 文化', titleZh:'高级', level:'C1', icon:'🎭', topics:['文学','时事','高级修辞','翻译'], duration:'12-16周', skills:['高级水平'] },
  { id:'_c2', title:'精通级', titleZh:'精通', level:'C2', icon:'👑', topics:['母语级表达','专业翻译','教学'], duration:'持续', skills:['母语级'] },
];

/* ─── Props ─── */
interface LearningPathProps {
  languageCode: string;
  languageName: string;
  userLevel: string;   // 'beginner' | 'intermediate' | 'advanced'
  onBack: () => void;
  onNavigateToScenario?: (scenarioId: string) => void;
}

/* ─── 把用户水平映射到CEFR ─── */
function mapLevelToCEFR(userLevel: string): 'A1' | 'A2' | 'B1' {
  if (userLevel === 'beginner') return 'A1';
  if (userLevel === 'intermediate') return 'A2';
  return 'B1';
}

/* ─── 组件 ─── */
export const LearningPath: React.FC<LearningPathProps> = ({
  languageCode, languageName, userLevel, onBack, onNavigateToScenario,
}) => {
  const roadmap = LANGUAGE_ROADMAPS[languageCode];
  const langName = roadmap?.name ?? languageName;
  const textbook = roadmap?.textbook ?? '权威教材体系';
  const expertTips = roadmap?.expertTips ?? '系统学习，循序渐进，每天坚持30分钟';
  const stages = roadmap?.stages ?? DEFAULT_STAGES;

  const startLevel = mapLevelToCEFR(userLevel);
  
  // AI 个性化建议
  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [stageDetail, setStageDetail] = useState<string>('');

  // 找到用户应该开始的阶段
  const startStageIndex = stages.findIndex(s => s.level === startLevel);
  const highlightIdx = startStageIndex >= 0 ? startStageIndex : 0;

  /* ─── AI 生成个性化学习建议 ─── */
  const loadAIAdvice = useCallback(async () => {
    setAiLoading(true);
    try {
      const response = await callAI([
        { role: 'system', content: `你是一个专业的${langName}学习顾问。你了解${textbook}等权威教材和学习方法。请用中文回复。` },
        { role: 'user', content: `我的${langName}水平是${userLevel === 'beginner' ? '零基础/初级' : userLevel === 'intermediate' ? '中级(A2-B1)' : '高级(B2+)'}。

请帮我做以下分析：
1. 根据我的水平，建议从哪个阶段开始系统学习${langName}
2. 推荐每天的学习计划（时间分配、学习方法）
3. 根据"${expertTips}"这条学习经验，给我具体的执行建议
4. 推荐2-3个最适合我目前水平的免费学习资源或方法
5. 指出${langName}学习中最容易犯的3个错误以及如何避免

请用简洁、鼓励的语气回复。用markdown格式，每个部分用###标题。总字数控制在300字以内。` }
      ]);
      if (response) setAiAdvice(response);
    } catch (e) {
      console.warn('LearningPath AI advice failed, using fallback', e);
      setAiAdvice(`### 🎯 ${langName}学习建议（离线模式）\n\n根据你的水平（${userLevel === 'beginner' ? '初级' : userLevel === 'intermediate' ? '中级' : '高级'}），建议：\n\n1. **参考教材**：${textbook}\n2. **每日计划**：30分钟口语 + 20分钟语法 + 20分钟听力\n3. **专家建议**：${expertTips}\n4. **关键提醒**：坚持每天学习比突击更有效！`);
    }
    setAiLoading(false);
  }, [langName, textbook, expertTips, userLevel]);

  useEffect(() => { loadAIAdvice(); }, [loadAIAdvice]);

  /* ─── AI 加载阶段详情 ─── */
  const loadStageDetail = async (stage: LearningStage) => {
    setSelectedStage(stage.id);
    setStageDetail('');
    try {
      const response = await callAI([
        { role: 'system', content: `你是${langName}学习专家，熟悉${textbook}。请用中文回复，简洁有条理。` },
        { role: 'user', content: `请详细展开${langName}的"${stage.title}（${stage.titleZh}）"学习阶段（${stage.level}水平）：

1. 这个阶段需要掌握的核心知识点列表（每个知识点一句话说明）
2. 推荐的具体学习方法（针对这些知识点）
3. 常见误区和注意事项
4. 学完这个阶段后应该达到什么水平（具体描述）

请用简洁的markdown格式，每个部分用###标题。` }
      ]);
      if (response) setStageDetail(response);
    } catch (e) {
      setStageDetail(`### ${stage.title}\n\n**核心知识点**：${stage.topics.join('、')}\n\n**预计时长**：${stage.duration}\n\n**技能目标**：${stage.skills.join('、')}\n\n（AI 暂时无法生成详细建议，请参考教材：${textbook}）`);
    }
  };

  /* ─── 渲染 ─── */
  return (
    <div className="learning-path-wrap">
      <FloatingBack onClick={onBack} />

      {/* Header */}
      <div className="lp-header">
        <h1 className="lp-title">🗺️ {langName} 学习路线</h1>
        <p className="lp-subtitle">参考教材：{textbook}</p>
        <div className="lp-level-badge" style={{
          background: userLevel === 'beginner' ? '#e8f5e9' : userLevel === 'intermediate' ? '#fff3e0' : '#fce4ec',
          color: userLevel === 'beginner' ? '#2e7d32' : userLevel === 'intermediate' ? '#e65100' : '#c62828',
        }}>
          {userLevel === 'beginner' ? '🌱 初级起步' : userLevel === 'intermediate' ? '🌿 中级进阶' : '🎋 高级突破'}
        </div>
      </div>

      {/* AI 个性化建议 */}
      <div className="lp-ai-card">
        <div className="lp-ai-card-header">
          <span className="lp-ai-icon">🤖</span>
          <h3>AI 个性化学习建议</h3>
          <span className="lp-ai-badge">DeepSeek AI</span>
        </div>
        {aiLoading ? (
          <div className="lp-ai-loading">
            <span className="lp-ai-dot-pulse">● ● ●</span>
            <span>AI 正在分析你的学习路径...</span>
          </div>
        ) : (
          <div className="lp-ai-content" dangerouslySetInnerHTML={{ __html: aiAdvice.replace(/\n/g, '<br/>').replace(/###/g, '<strong>').replace(/\*\*/g, '') }} />
        )}
        <button className="lp-ai-refresh" onClick={loadAIAdvice}>
          🔄 重新生成建议
        </button>
      </div>

      {/* 学习路线图 */}
      <div className="lp-roadmap">
        <h2 className="lp-roadmap-title">📚 完整学习路线（{stages.length}个阶段）</h2>
        <p className="lp-roadmap-desc">参考 {textbook} + {langName}学习大咖经验 · 循序渐进</p>

        <div className="lp-stages">
          {stages.map((stage, idx) => {
            const isCurrent = idx === highlightIdx;
            const isPast = idx < highlightIdx;
            const isFuture = idx > highlightIdx;
            const isExpanded = selectedStage === stage.id;

            return (
              <div key={stage.id} className={`lp-stage ${isCurrent ? 'current' : ''} ${isPast ? 'past' : ''} ${isFuture ? 'future' : ''}`}>
                {/* 连接线 */}
                {idx > 0 && <div className={`lp-stage-line ${isPast ? 'done' : ''}`} />}

                {/* 阶段节点 */}
                <div className="lp-stage-node-wrap">
                  <div className={`lp-stage-node ${isCurrent ? 'active' : isPast ? 'done' : 'locked'}`}>
                    {isPast ? '✅' : isCurrent ? stage.icon : '🔒'}
                  </div>
                  <div className="lp-stage-info">
                    <div className="lp-stage-header" onClick={() => isPast || isCurrent ? loadStageDetail(stage) : null}>
                      <span className={`lp-stage-level ${stage.level}`}>{stage.level}</span>
                      <h4>{stage.title}</h4>
                      <span className="lp-stage-zh">{stage.titleZh}</span>
                    </div>
                    <div className="lp-stage-meta">
                      <span>⏱ {stage.duration}</span>
                      <span>📋 {stage.topics.length}个主题</span>
                    </div>
                    <div className="lp-stage-topics">
                      {stage.topics.slice(0, 5).map(t => (
                        <span key={t} className="lp-topic-tag">{t}</span>
                      ))}
                      {stage.topics.length > 5 && <span className="lp-topic-more">+{stage.topics.length - 5}</span>}
                    </div>
                  </div>
                </div>

                {/* 展开的AI详情 */}
                {isExpanded && (
                  <div className="lp-stage-detail">
                    {stageDetail ? (
                      <div className="lp-stage-detail-content" dangerouslySetInnerHTML={{
                        __html: stageDetail.replace(/\n/g, '<br/>').replace(/###\s(.*?)(<br\/>|$)/g, '<h5>$1</h5>').replace(/\*\*/g, '')
                      }} />
                    ) : (
                      <div className="lp-stage-detail-loading">🤖 AI 正在生成详细建议...</div>
                    )}
                    <button className="lp-stage-close" onClick={() => setSelectedStage(null)}>收起</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 专家学习经验 */}
      <div className="lp-expert-card">
        <h3>🌟 大咖学习经验</h3>
        <div className="lp-expert-content">{expertTips}</div>
      </div>

      {/* 底部 */}
      <div className="lp-footer">
        <button className="lp-back-btn" onClick={onBack}>返回学习主页</button>
      </div>

      {/* 样式 */}
      <style>{`
        .learning-path-wrap {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
          color: #e2e8f0;
          padding: 48px 16px 24px;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .lp-header {
          text-align: center;
          margin-bottom: 20px;
        }
        .lp-title { font-size: 1.5rem; font-weight: 700; margin: 0; color: #f1f5f9; }
        .lp-subtitle { font-size: 0.85rem; color: #94a3b8; margin: 4px 0 8px; }
        .lp-level-badge {
          display: inline-block;
          padding: 4px 14px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        /* AI Card */
        .lp-ai-card {
          background: linear-gradient(135deg, #1e293b, #1a2332);
          border: 1px solid #334155;
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 20px;
        }
        .lp-ai-card-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }
        .lp-ai-icon { font-size: 1.4rem; }
        .lp-ai-card-header h3 { font-size: 1rem; margin: 0; flex: 1; }
        .lp-ai-badge {
          font-size: 0.65rem;
          background: #7c3aed;
          color: #fff;
          padding: 2px 8px;
          border-radius: 10px;
        }
        .lp-ai-loading {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: #94a3b8;
          padding: 12px 0;
        }
        .lp-ai-dot-pulse {
          animation: lpPulse 1.5s infinite;
          color: #7c3aed;
          letter-spacing: 4px;
        }
        @keyframes lpPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .lp-ai-content {
          font-size: 0.85rem;
          line-height: 1.6;
          color: #cbd5e1;
        }
        .lp-ai-refresh {
          margin-top: 10px;
          background: none;
          border: 1px solid #334155;
          color: #94a3b8;
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 0.8rem;
          cursor: pointer;
        }
        .lp-ai-refresh:hover { background: #1e3a5f; color: #e2e8f0; }

        /* Roadmap */
        .lp-roadmap { margin-bottom: 20px; }
        .lp-roadmap-title { font-size: 1.15rem; color: #f1f5f9; margin: 0 0 4px; }
        .lp-roadmap-desc { font-size: 0.8rem; color: #64748b; margin: 0 0 16px; }

        .lp-stages { position: relative; padding-left: 36px; }
        .lp-stage {
          position: relative;
          margin-bottom: 16px;
          transition: opacity 0.3s;
        }
        .lp-stage.future { opacity: 0.45; }
        .lp-stage-line {
          position: absolute;
          left: -22px;
          top: 0;
          bottom: -16px;
          width: 2px;
          background: #334155;
          z-index: 0;
        }
        .lp-stage-line.done { background: linear-gradient(to bottom, #22c55e, #334155); }

        .lp-stage-node-wrap {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          position: relative;
          z-index: 1;
        }
        .lp-stage-node {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          flex-shrink: 0;
          margin-left: -52px;
          margin-top: 2px;
        }
        .lp-stage-node.active {
          background: #7c3aed;
          box-shadow: 0 0 12px rgba(124, 58, 237, 0.5);
          animation: nodeGlow 2s infinite;
        }
        @keyframes nodeGlow {
          0%, 100% { box-shadow: 0 0 8px rgba(124,58,237,0.3); }
          50% { box-shadow: 0 0 20px rgba(124,58,237,0.6); }
        }
        .lp-stage-node.done { background: #166534; }
        .lp-stage-node.locked { background: #1e293b; border: 2px solid #334155; }
        .lp-stage-info {
          background: #1e293b;
          border-radius: 12px;
          padding: 12px 14px;
          flex: 1;
          border: 1px solid #334155;
        }
        .lp-stage.current .lp-stage-info {
          border-color: #7c3aed;
          background: linear-gradient(135deg, #1e1b4b, #1e293b);
        }
        .lp-stage-header {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          flex-wrap: wrap;
        }
        .lp-stage-level {
          font-size: 0.65rem;
          font-weight: 700;
          padding: 1px 6px;
          border-radius: 4px;
          color: #fff;
        }
        .lp-stage-level.A1 { background: #22c55e; }
        .lp-stage-level.A2 { background: #84cc16; }
        .lp-stage-level.B1 { background: #eab308; }
        .lp-stage-level.B2 { background: #f97316; }
        .lp-stage-level.C1 { background: #ef4444; }
        .lp-stage-level.C2 { background: #8b5cf6; }
        .lp-stage-header h4 { font-size: 0.9rem; margin: 0; color: #f1f5f9; }
        .lp-stage-zh { font-size: 0.75rem; color: #64748b; }
        .lp-stage-meta {
          font-size: 0.72rem;
          color: #64748b;
          display: flex;
          gap: 12px;
          margin-top: 4px;
        }
        .lp-stage-topics {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-top: 6px;
        }
        .lp-topic-tag {
          font-size: 0.68rem;
          background: #0f172a;
          color: #94a3b8;
          padding: 2px 8px;
          border-radius: 6px;
          border: 1px solid #1e293b;
        }
        .lp-topic-more {
          font-size: 0.68rem;
          color: #7c3aed;
          align-self: center;
        }

        .lp-stage-detail {
          margin-left: -24px;
          margin-top: 8px;
          background: #0f172a;
          border-radius: 12px;
          padding: 14px;
          border: 1px solid #334155;
          position: relative;
          z-index: 1;
        }
        .lp-stage-detail-content {
          font-size: 0.82rem;
          line-height: 1.7;
          color: #cbd5e1;
        }
        .lp-stage-detail-content h5 {
          font-size: 0.9rem;
          color: #a78bfa;
          margin: 8px 0 4px;
        }
        .lp-stage-detail-loading {
          color: #94a3b8;
          font-size: 0.82rem;
          padding: 8px 0;
        }
        .lp-stage-close {
          margin-top: 10px;
          background: none;
          border: 1px solid #334155;
          color: #94a3b8;
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 0.75rem;
          cursor: pointer;
        }

        /* Expert card */
        .lp-expert-card {
          background: #1e293b;
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 20px;
          border: 1px solid #334155;
        }
        .lp-expert-card h3 { font-size: 1rem; color: #fbbf24; margin: 0 0 8px; display: flex; align-items: center; gap: 6px; }
        .lp-expert-content {
          font-size: 0.82rem;
          line-height: 1.7;
          color: #cbd5e1;
        }

        .lp-footer { text-align: center; }
        .lp-back-btn {
          background: #1e3a5f;
          color: #e2e8f0;
          border: 1px solid #334155;
          padding: 10px 28px;
          border-radius: 12px;
          font-size: 0.9rem;
          cursor: pointer;
        }
        .lp-back-btn:hover { background: #2563eb; }
      `}</style>
    </div>
  );
};
