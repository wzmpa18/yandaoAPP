#!/usr/bin/env python3
"""
AI智能内容生成器 - 为多语言学习App生成教学和娱乐内容

支持的语言 (lang): ja, en, ko, fr, es, de, it, pt, ar, zh
支持的年龄段 (age): kids, teenagers, adults
支持的内容类型 (type): nursery_rhyme, short_story, joke, radio

使用方式:
    python generate_content.py --lang ja --age kids --type nursery_rhyme --count 500
    python generate_content.py --lang en --age adults --type joke --count 200
    python generate_content.py --lang ko --age teenagers --type short_story --count 100

环境变量:
    SUPABASE_URL - Supabase项目URL
    SUPABASE_KEY - Supabase服务角色密钥
"""

import argparse
import json
import os
import random
import sys
import uuid
from typing import List, Dict

try:
    from supabase import create_client
except ImportError:
    print("ERROR: supabase package not installed.\nRun: pip install supabase", file=sys.stderr)
    sys.exit(1)

# 语言配置
LANGUAGES = {
    'ja': {'name': '日语', 'name_en': 'Japanese', 'prefix': 'JP'},
    'en': {'name': '英语', 'name_en': 'English', 'prefix': 'EN'},
    'ko': {'name': '韩语', 'name_en': 'Korean', 'prefix': 'KO'},
    'fr': {'name': '法语', 'name_en': 'French', 'prefix': 'FR'},
    'es': {'name': '西班牙语', 'name_en': 'Spanish', 'prefix': 'ES'},
    'de': {'name': '德语', 'name_en': 'German', 'prefix': 'DE'},
    'it': {'name': '意大利语', 'name_en': 'Italian', 'prefix': 'IT'},
    'pt': {'name': '葡萄牙语', 'name_en': 'Portuguese', 'prefix': 'PT'},
    'ar': {'name': '阿拉伯语', 'name_en': 'Arabic', 'prefix': 'AR'},
    'zh': {'name': '中文', 'name_en': 'Chinese', 'prefix': 'ZH'},
}

# 年龄段配置
AGE_GROUPS = {
    'kids': {'name': '儿童', 'max_length': 200, 'difficulty': 'beginner'},
    'teenagers': {'name': '青少年', 'max_length': 400, 'difficulty': 'intermediate'},
    'adults': {'name': '成人', 'max_length': 600, 'difficulty': 'advanced'},
}

# 内容类型配置
CONTENT_TYPES = {
    'nursery_rhyme': {'name': '童谣', 'table': 'nursery_rhymes'},
    'short_story': {'name': '故事', 'table': 'short_stories'},
    'joke': {'name': '笑话', 'table': 'jokes'},
    'radio': {'name': '电台稿', 'table': 'radio_content'},
}

# 笑话模板 (多语言)
JOKE_TEMPLATES = {
    'ja': [
        {'content': 'なぜ数学の先生は庭に行きたがらないのか？答え：「芝生があまりにも平方だから！」', 'content_zh': '为什么数学老师不愿意去花园？答案：因为草坪太平方了！'},
        {'content': 'コンピューターが冷たいのはなぜか？答え：「ファンが常に回っているから！」', 'content_zh': '为什么电脑总是冷冰冰的？答案：因为风扇一直在转！'},
        {'content': 'なぜ魚は学校に行かないのか？答え：「すでに泳ぎを知っているから！」', 'content_zh': '为什么鱼不上学？答案：因为它们已经会游泳了！'},
        {'content': '時計が一番嫌いな食べ物は何？答え：「ベル！」', 'content_zh': '时钟最讨厌的食物是什么？答案：铃铛！'},
        {'content': 'パンが一番得意なスポーツは何？答え：「ランニング！」', 'content_zh': '面包最擅长的运动是什么？答案：跑步！'},
        {'content': 'なぜ傘は元気がないのか？答え：「いつも雨に降られているから！」', 'content_zh': '为什么伞总是无精打采？答案：因为总是被雨淋！'},
        {'content': '机が一番好きな音楽は何？答え：「ロック！」', 'content_zh': '桌子最喜欢的音乐是什么？答案：摇滚乐！'},
        {'content': 'なぜ電話は悪いことをするのか？答え：「いつも噂をするから！」', 'content_zh': '为什么电话总是做坏事？答案：因为总是传播谣言！'},
        {'content': 'サンドイッチが一番嫌いな場所はどこ？答え：「パン屋！」', 'content_zh': '三明治最讨厌的地方是哪里？答案：面包店！'},
        {'content': 'なぜ靴は学校に行きたがらないのか？答え：「すでにたくさん歩いたから！」', 'content_zh': '为什么鞋子不想上学？答案：因为已经走了很多路！'},
    ],
    'en': [
        {'content': 'Why don\'t skeletons fight each other? They don\'t have the guts!', 'content_zh': '为什么骷髅不打架？因为他们没有勇气！'},
        {'content': 'What do you call fake spaghetti? An impasta!', 'content_zh': '假意大利面叫什么？冒充者！'},
        {'content': 'Why did the scarecrow win an award? Because he was outstanding in his field!', 'content_zh': '为什么稻草人获奖了？因为他在自己的领域很出色！'},
        {'content': 'What do you call a bear with no teeth? A gummy bear!', 'content_zh': '没有牙齿的熊叫什么？软糖熊！'},
        {'content': 'Why don\'t scientists trust atoms? Because they make up everything!', 'content_zh': '为什么科学家不信任原子？因为它们组成了一切！'},
        {'content': 'What do you call a fish wearing a bowtie? Sofishticated!', 'content_zh': '戴领结的鱼叫什么？优雅的鱼！'},
        {'content': 'Why did the math book look sad? Because it had too many problems!', 'content_zh': '为什么数学书看起来很伤心？因为它有太多问题！'},
        {'content': 'What do you get when you cross a snowman and a vampire? Frostbite!', 'content_zh': '雪人加吸血鬼是什么？冻伤！'},
        {'content': 'Why did the bicycle fall over? Because it was two-tired!', 'content_zh': '为什么自行车摔倒了？因为它太累了！'},
        {'content': 'What do you call a sleeping bull? A bulldozer!', 'content_zh': '睡觉的公牛叫什么？推土机！'},
    ],
    'ko': [
        {'content': '왜 컴퓨터가 춥니까? 팬이 계속 돌아가기 때문이에요!', 'content_zh': '为什么电脑很冷？因为风扇一直在转！'},
        {'content': '물고기가 학교에 가지 않는 이유는? 이미 수영을 할 줄 알기 때문이에요!', 'content_zh': '鱼不上学的原因是？因为已经会游泳了！'},
        {'content': '시계가 가장 싫어하는 음식은 무엇인가요? 벨!', 'content_zh': '时钟最讨厌的食物是什么？铃铛！'},
        {'content': '빵이 가장 잘하는 운동은 무엇인가요? 러닝!', 'content_zh': '面包最擅长的运动是什么？跑步！'},
        {'content': '우산이 왜 기운이 없나요? 항상 비에 맞기 때문이에요!', 'content_zh': '雨伞为什么没精神？因为总是被雨淋！'},
        {'content': '책상이 가장 좋아하는 음악은 무엇인가요? 록!', 'content_zh': '桌子最喜欢的音乐是什么？摇滚乐！'},
        {'content': '전화기가 왜 나쁜 짓을 하나요? 항상 소문을 퍼뜨리기 때문이에요!', 'content_zh': '电话为什么做坏事？因为总是传播谣言！'},
        {'content': '샌드위치가 가장 싫어하는 장소는 어디인가요? 빵집!', 'content_zh': '三明治最讨厌的地方是哪里？面包店！'},
        {'content': '신발이 왜 학교에 가지 않나요? 이미 많이 걸었기 때문이에요!', 'content_zh': '鞋子为什么不上学？因为已经走了很多路！'},
        {'content': '곰이 가장 좋아하는 과일은 무엇인가요? 허리!', 'content_zh': '熊最喜欢的水果是什么？腰！'},
    ],
    'fr': [
        {'content': 'Pourquoi les squelettes ne se battent-ils pas? Parce qu\'ils n\'ont pas les côtes!', 'content_zh': '为什么骷髅不打架？因为他们没有肋骨！'},
        {'content': 'Qu\'est-ce qu\'on appelle une fausse spaghetti? Un impasta!', 'content_zh': '假意大利面叫什么？冒充者！'},
        {'content': 'Pourquoi l\'épouvantail a-t-il gagné un prix? Parce qu\'il était excellent dans son domaine!', 'content_zh': '为什么稻草人获奖了？因为他在自己的领域很出色！'},
        {'content': 'Qu\'est-ce qu\'on appelle un ours sans dents? Un ours en gomme!', 'content_zh': '没有牙齿的熊叫什么？软糖熊！'},
        {'content': 'Pourquoi les scientifiques ne font pas confiance aux atomes? Parce qu\'ils composent tout!', 'content_zh': '为什么科学家不信任原子？因为它们组成了一切！'},
        {'content': 'Qu\'est-ce qu\'on appelle un poisson avec un nœud papillon? Un poisson sophistiqué!', 'content_zh': '戴领结的鱼叫什么？优雅的鱼！'},
        {'content': 'Pourquoi le livre de maths était-il triste? Parce qu\'il avait trop de problèmes!', 'content_zh': '为什么数学书看起来很伤心？因为它有太多问题！'},
        {'content': 'Qu\'est-ce qu\'on obtient en croisant un bonhomme de neige et un vampire? Un engelure!', 'content_zh': '雪人加吸血鬼是什么？冻伤！'},
        {'content': 'Pourquoi la bicyclette est-elle tombée? Parce qu\'elle était trop fatiguée!', 'content_zh': '为什么自行车摔倒了？因为它太累了！'},
        {'content': 'Qu\'est-ce qu\'on appelle un taureau endormi? Un bulldozer!', 'content_zh': '睡觉的公牛叫什么？推土机！'},
    ],
    'es': [
        {'content': '¿Por qué los esqueletos no se pelean? ¡Porque no tienen agallas!', 'content_zh': '为什么骷髅不打架？因为他们没有勇气！'},
        {'content': '¿Cómo se llama un espagueti falso? ¡Un impasta!', 'content_zh': '假意大利面叫什么？冒充者！'},
        {'content': '¿Por qué el espantapájaros ganó un premio? ¡Porque era sobresaliente en su campo!', 'content_zh': '为什么稻草人获奖了？因为他在自己的领域很出色！'},
        {'content': '¿Cómo se llama un oso sin dientes? ¡Un oso de goma!', 'content_zh': '没有牙齿的熊叫什么？软糖熊！'},
        {'content': '¿Por qué los científicos no confían en los átomos? ¡Porque componen todo!', 'content_zh': '为什么科学家不信任原子？因为它们组成了一切！'},
        {'content': '¿Cómo se llama un pez con corbata? ¡Un pez sofisticado!', 'content_zh': '戴领结的鱼叫什么？优雅的鱼！'},
        {'content': '¿Por qué el libro de matemáticas estaba triste? ¡Porque tenía demasiados problemas!', 'content_zh': '为什么数学书看起来很伤心？因为它有太多问题！'},
        {'content': '¿Qué se obtiene al cruzar un muñeco de nieve y un vampiro? ¡Una congelación!', 'content_zh': '雪人加吸血鬼是什么？冻伤！'},
        {'content': '¿Por qué se cayó la bicicleta? ¡Porque estaba cansada!', 'content_zh': '为什么自行车摔倒了？因为它太累了！'},
        {'content': '¿Cómo se llama un toro dormido? ¡Un bulldozer!', 'content_zh': '睡觉的公牛叫什么？推土机！'},
    ],
    'de': [
        {'content': 'Warum kämpfen Skelette nicht miteinander? Sie haben keinen Mut!', 'content_zh': '为什么骷髅不打架？因为他们没有勇气！'},
        {'content': 'Was heißt falsche Spaghetti? Ein Impasta!', 'content_zh': '假意大利面叫什么？冒充者！'},
        {'content': 'Warum gewann der Vogelscheuche einen Preis? Weil er in seinem Bereich hervorragend war!', 'content_zh': '为什么稻草人获奖了？因为他在自己的领域很出色！'},
        {'content': 'Was heißt ein Bär ohne Zähne? Ein Gummibär!', 'content_zh': '没有牙齿的熊叫什么？软糖熊！'},
        {'content': 'Warum vertrauen Wissenschaftler Atomen nicht? Weil sie alles ausmachen!', 'content_zh': '为什么科学家不信任原子？因为它们组成了一切！'},
        {'content': 'Was heißt ein Fisch mit Fliege? Ein sofistikierter Fisch!', 'content_zh': '戴领结的鱼叫什么？优雅的鱼！'},
        {'content': 'Warum saß das Mathebuch traurig da? Weil es zu viele Probleme hatte!', 'content_zh': '为什么数学书看起来很伤心？因为它有太多问题！'},
        {'content': 'Was bekommt man, wenn man einen Schneemann und einen Vampir kreuzt? Frostbeulen!', 'content_zh': '雪人加吸血鬼是什么？冻伤！'},
        {'content': 'Warum fiel das Fahrrad um? Weil es zu müde war!', 'content_zh': '为什么自行车摔倒了？因为它太累了！'},
        {'content': 'Was heißt ein schlafender Stier? Ein Bulldozer!', 'content_zh': '睡觉的公牛叫什么？推土机！'},
    ],
    'it': [
        {'content': 'Perché gli scheletri non si combattono? Non hanno il coraggio!', 'content_zh': '为什么骷髅不打架？因为他们没有勇气！'},
        {'content': 'Come si chiama una spaghetti falsa? Un impasta!', 'content_zh': '假意大利面叫什么？冒充者！'},
        {'content': 'Perché lo spaventapasseri ha vinto un premio? Perché era eccezionale nel suo campo!', 'content_zh': '为什么稻草人获奖了？因为他在自己的领域很出色！'},
        {'content': 'Come si chiama un orso senza denti? Un orso gommoso!', 'content_zh': '没有牙齿的熊叫什么？软糖熊！'},
        {'content': 'Perché gli scienziati non si fidiscono degli atomi? Perché compongono tutto!', 'content_zh': '为什么科学家不信任原子？因为它们组成了一切！'},
        {'content': 'Come si chiama un pesce con cravatta? Un pesce sofisticato!', 'content_zh': '戴领结的鱼叫什么？优雅的鱼！'},
        {'content': 'Perché il libro di matematica era triste? Perché aveva troppi problemi!', 'content_zh': '为什么数学书看起来很伤心？因为它有太多问题！'},
        {'content': 'Cosa si ottiene incrociando un pupazzo di neve e un vampiro? Congelamento!', 'content_zh': '雪人加吸血鬼是什么？冻伤！'},
        {'content': 'Perché la bicicletta è caduta? Perché era troppo stanca!', 'content_zh': '为什么自行车摔倒了？因为它太累了！'},
        {'content': 'Come si chiama un toro addormentato? Un bulldozer!', 'content_zh': '睡觉的公牛叫什么？推土机！'},
    ],
    'pt': [
        {'content': 'Por que os esqueletos não brigam? Eles não têm coragem!', 'content_zh': '为什么骷髅不打架？因为他们没有勇气！'},
        {'content': 'Como se chama uma espaguete falsa? Um impasta!', 'content_zh': '假意大利面叫什么？冒充者！'},
        {'content': 'Por que o espantalho ganhou um prêmio? Porque ele era excepcional em seu campo!', 'content_zh': '为什么稻草人获奖了？因为他在自己的领域很出色！'},
        {'content': 'Como se chama um urso sem dentes? Um urso de goma!', 'content_zh': '没有牙齿的熊叫什么？软糖熊！'},
        {'content': 'Por que os cientistas não confiam nos átomos? Porque eles compõem tudo!', 'content_zh': '为什么科学家不信任原子？因为它们组成了一切！'},
        {'content': 'Como se chama um peixe com gravata? Um peixe sofisticado!', 'content_zh': '戴领结的鱼叫什么？优雅的鱼！'},
        {'content': 'Por que o livro de matemática estava triste? Porque tinha muitos problemas!', 'content_zh': '为什么数学书看起来很伤心？因为它有太多问题！'},
        {'content': 'O que se obtém ao cruzar um boneco de neve e um vampiro? Congelamento!', 'content_zh': '雪人加吸血鬼是什么？冻伤！'},
        {'content': 'Por que a bicicleta caiu? Porque estava muito cansada!', 'content_zh': '为什么自行车摔倒了？因为它太累了！'},
        {'content': 'Como se chama um touro dormindo? Um bulldozer!', 'content_zh': '睡觉的公牛叫什么？推土机！'},
    ],
    'ar': [
        {'content': 'لماذا لا يقاتل الهيكلان؟ لأنهما ليسا لديهما الشجاعة!', 'content_zh': '为什么骷髅不打架？因为他们没有勇气！'},
        {'content': 'ما اسم السباغيتي المزيف؟ إيمباستا!', 'content_zh': '假意大利面叫什么？冒充者！'},
        {'content': 'لماذا فاز رجل الهواء بجائزة؟ لأنه كان ممتازاً في مجاله!', 'content_zh': '为什么稻草人获奖了？因为他在自己的领域很出色！'},
        {'content': 'ما اسم الدب بدون أسنان؟ دب علكة!', 'content_zh': '没有牙齿的熊叫什么？软糖熊！'},
        {'content': 'لماذا لا يثق العلماء بالذرات؟ لأنها تشكل كل شيء!', 'content_zh': '为什么科学家不信任原子？因为它们组成了一切！'},
        {'content': 'ما اسم السمك الذي يرتدي ربطة عنق؟ سمك راقٍ!', 'content_zh': '戴领结的鱼叫什么？优雅的鱼！'},
        {'content': 'لماذا كان كتاب الرياضيات حزيناً؟ لأنه كان لديه مشكلات كثيرة!', 'content_zh': '为什么数学书看起来很伤心？因为它有太多问题！'},
        {'content': 'ماذا تحصل عندما تkreuz ورق الثلج والفامبير؟ الصقيع!', 'content_zh': '雪人加吸血鬼是什么？冻伤！'},
        {'content': 'لماذا سقطت الدراجة الهوائية؟ لأنه كانت متعثرة جداً!', 'content_zh': '为什么自行车摔倒了？因为它太累了！'},
        {'content': 'ما اسم الثور النائم؟ بولدوزر!', 'content_zh': '睡觉的公牛叫什么？推土机！'},
    ],
    'zh': [
        {'content': '为什么骷髅不打架？因为他们没有勇气！', 'content_zh': '为什么骷髅不打架？因为他们没有勇气！'},
        {'content': '假意大利面叫什么？冒充者！', 'content_zh': '假意大利面叫什么？冒充者！'},
        {'content': '为什么稻草人获奖了？因为他在自己的领域很出色！', 'content_zh': '为什么稻草人获奖了？因为他在自己的领域很出色！'},
        {'content': '没有牙齿的熊叫什么？软糖熊！', 'content_zh': '没有牙齿的熊叫什么？软糖熊！'},
        {'content': '为什么科学家不信任原子？因为它们组成了一切！', 'content_zh': '为什么科学家不信任原子？因为它们组成了一切！'},
        {'content': '戴领结的鱼叫什么？优雅的鱼！', 'content_zh': '戴领结的鱼叫什么？优雅的鱼！'},
        {'content': '为什么数学书看起来很伤心？因为它有太多问题！', 'content_zh': '为什么数学书看起来很伤心？因为它有太多问题！'},
        {'content': '雪人加吸血鬼是什么？冻伤！', 'content_zh': '雪人加吸血鬼是什么？冻伤！'},
        {'content': '为什么自行车摔倒了？因为它太累了！', 'content_zh': '为什么自行车摔倒了？因为它太累了！'},
        {'content': '睡觉的公牛叫什么？推土机！', 'content_zh': '睡觉的公牛叫什么？推土机！'},
    ],
}

# 童谣模板
RHYME_TEMPLATES = {
    'ja': [
        {'title': 'とんぼ', 'title_zh': '蜻蜓', 
         'content': 'とんぼが 青い空を とんでいく\n赤い羽根 まばゆいほど きれいだね\n小さい子供が 指をさして\n「見て見て！とんぼだよ！」と 叫んでいる',
         'content_zh': '蜻蜓在蓝蓝的天空中飞翔\n红色的翅膀光彩夺目真漂亮\n小孩子伸出手指\n喊着：「快看！蜻蜓！」'},
        {'title': '月のうさぎ', 'title_zh': '月亮上的兔子',
         'content': '月の上に うさぎがいる\n杵で餅を ついている\nかわいいうさぎ 耳が長い\nみんな見上げて 笑っている',
         'content_zh': '月亮上面有只兔子\n在用杵捣年糕\n可爱的兔子耳朵长长\n大家抬头看着它笑'},
        {'title': '春の歌', 'title_zh': '春天的歌',
         'content': '春が来た 春が来た\n小鳥が歌う 花が咲く\n青い草 緑の木\nみんな喜んで 遊ぼう',
         'content_zh': '春天来了春天来了\n小鸟歌唱花儿绽放\n青青的草绿绿的树\n大家开心地玩耍吧'},
    ],
    'en': [
        {'title': 'Twinkle Twinkle Little Star', 'title_zh': '小星星',
         'content': 'Twinkle, twinkle, little star,\nHow I wonder what you are!\nUp above the world so high,\nLike a diamond in the sky.',
         'content_zh': '一闪一闪亮晶晶\n我想知道你是什么！\n高高挂在天空上\n就像钻石放光芒。'},
        {'title': 'Row Row Row Your Boat', 'title_zh': '划船歌',
         'content': 'Row, row, row your boat,\nGently down the stream.\nMerrily, merrily, merrily, merrily,\nLife is but a dream.',
         'content_zh': '划呀划呀划小船\n轻轻漂下小溪流\n快乐快乐真快乐\n人生就像一场梦。'},
        {'title': 'Rain Rain Go Away', 'title_zh': '雨儿雨儿快走开',
         'content': 'Rain, rain, go away,\nCome again another day.\nLittle Johnny wants to play,\nRain, rain, go away.',
         'content_zh': '雨儿雨儿快走开\n改天再回来。\n小约翰尼想玩耍\n雨儿雨儿快走开。'},
    ],
    'ko': [
        {'title': '반달', 'title_zh': '月牙',
         'content': '반달이 뜨면\n새우깡을 먹고\n달님과 이야기\n해요 해요',
         'content_zh': '月牙升起来\n吃着虾条\n和月亮说话\n说说说'},
        {'title': '꽃송이', 'title_zh': '小花',
         'content': '꽃송이 피었어\n노랑색 꽃송이\n나비가 날아와\n꽃을 찾아요',
         'content_zh': '小花开了\n黄色的小花\n蝴蝶飞过来\n寻找花朵'},
        {'title': '산토끼', 'title_zh': '山兔子',
         'content': '산토끼 토끼야\n귀가 길다\n뛰어다니면서\n풀을 뜯어먹네',
         'content_zh': '山里的兔子呀\n耳朵长长\n蹦蹦跳跳\n啃着青草'},
    ],
    'fr': [
        {'title': 'Frère Jacques', 'title_zh': '雅克兄弟',
         'content': 'Frère Jacques, Frère Jacques,\nDormez-vous? Dormez-vous?\nSonnez les matines! Sonnez les matines!\nDing, dang, dong. Ding, dang, dong.',
         'content_zh': '雅克兄弟，雅克兄弟\n你睡了吗？你睡了吗？\n敲响晨钟！敲响晨钟！\n叮，当，咚。叮，当，咚。'},
        {'title': 'Alouette', 'title_zh': '云雀',
         'content': 'Alouette, gentille alouette,\nAlouette, je te plumerai.\nJe te plumerai la tête,\nJe te plumerai la tête.',
         'content_zh': '云雀，可爱的云雀\n云雀，我要拔你的毛。\n我要拔你的头\n我要拔你的头。'},
        {'title': 'Sur le pont d\'Avignon', 'title_zh': '在阿维尼翁桥上',
         'content': 'Sur le pont d\'Avignon,\nL\'on y danse, l\'on y danse,\nSur le pont d\'Avignon,\nL\'on y danse tous en rond.',
         'content_zh': '在阿维尼翁桥上\n大家跳舞，大家跳舞\n在阿维尼翁桥上\n大家围成圈跳舞。'},
    ],
    'es': [
        {'title': 'Cielito Lindo', 'title_zh': '美丽的天空',
         'content': 'Ay, ay, ay, ay,\nCanta y no llores,\nPorque cantando se alegran,\nLos corazones.',
         'content_zh': '哎，哎，哎，哎\n唱歌吧不要哭\n因为唱歌能让\n心儿快乐。'},
        {'title': 'La Cucaracha', 'title_zh': '蟑螂',
         'content': 'La cucaracha, la cucaracha,\nYa no puede caminar,\nPorque no tiene,\nPorque le faltan las patas.',
         'content_zh': '蟑螂，蟑螂\n不能走路了\n因为它没有\n因为它缺了腿。'},
        {'title': 'Los Pollitos', 'title_zh': '小鸡',
         'content': 'Los pollitos dicen:\n"Pío, pío, pío."\nCuando tienen hambre,\nCuando tienen frío.',
         'content_zh': '小鸡们说：\n"叽叽，叽叽，叽叽。"\n当它们饿的时候\n当它们冷的时候。'},
    ],
    'de': [
        {'title': 'Hänschen klein', 'title_zh': '小汉斯',
         'content': 'Hänschen klein,\nGeht allein\nDurch den Wald,\nUnd singt ein Lied.',
         'content_zh': '小汉斯\n独自走\n穿过森林\n唱着一首歌。'},
        {'title': 'Schlaf, Kindlein, schlaf', 'title_zh': '睡吧，宝贝，睡吧',
         'content': 'Schlaf, Kindlein, schlaf,\nDie Mutter singt dir ein Lied.\nSchlaf, Kindlein, schlaf,\nDer Vater wartet auf dich.',
         'content_zh': '睡吧，宝贝，睡吧\n妈妈为你唱一首歌。\n睡吧，宝贝，睡吧\n爸爸在等你。'},
        {'title': 'Fröhliche Weihnacht überall', 'title_zh': '欢乐圣诞处处在',
         'content': 'Fröhliche Weihnacht überall,\nLaut die Glocken schallen.\nFröhliche Weihnacht überall,\nSingen wir alle mitten drin.',
         'content_zh': '欢乐圣诞处处在\n钟声响亮回荡。\n欢乐圣诞处处在\n我们大家一起唱。'},
    ],
    'it': [
        {'title': 'Frère Jacques', 'title_zh': '雅克兄弟',
         'content': 'Frère Jacques, Frère Jacques,\nDormi tu? Dormi tu?\nSuona le campane! Suona le campane!\nDing, dang, dong. Ding, dang, dong.',
         'content_zh': '雅克兄弟，雅克兄弟\n你睡了吗？你睡了吗？\n敲响钟声！敲响钟声！\n叮，当，咚。叮，当，咚。'},
        {'title': 'Bella ciao', 'title_zh': '再见美人',
         'content': 'Bella ciao, bella ciao,\nBella ciao, ciao, ciao!\nUna mattina mi sono alzato,\nE ho trovato l\'invasor.',
         'content_zh': '再见美人，再见美人\n再见美人，再见，再见！\n一天早晨我醒来\n发现了入侵者。'},
        {'title': 'Oh Susanna', 'title_zh': '哦苏珊娜',
         'content': 'Oh Susanna, don\'t you cry for me,\nI come from Alabama with my banjo on my knee.',
         'content_zh': '哦苏珊娜，不要为我哭泣\n我从阿拉巴马来，班卓琴在膝。'},
    ],
    'pt': [
        {'title': 'Cabeça, ombros, joelhos e pés', 'title_zh': '头、肩膀、膝盖和脚',
         'content': 'Cabeça, ombros, joelhos e pés,\nJoelhos e pés.\nCabeça, ombros, joelhos e pés,\nJoelhos e pés.',
         'content_zh': '头、肩膀、膝盖和脚\n膝盖和脚。\n头、肩膀、膝盖和脚\n膝盖和脚。'},
        {'title': 'A barata', 'title_zh': '蟑螂',
         'content': 'A barata, a barata\nVai passando,\nVai passando,\nE não me vê.',
         'content_zh': '蟑螂，蟑螂\n走过去了\n走过去了\n没看见我。'},
        {'title': 'Patinho feio', 'title_zh': '丑小鸭',
         'content': 'Patinho feio, patinho feio,\nNinguém quer te ver.\nMas um dia você vai ser,\nUm belo cisne.',
         'content_zh': '丑小鸭，丑小鸭\n没人想看见你。\n但有一天你会变成\n一只美丽的天鹅。'},
    ],
    'ar': [
        {'title': 'يالا يالا', 'title_zh': '来吧来吧',
         'content': 'يالا يالا يا صغير\nاللعب في الحديقة\nالشمس تشرق في السماء\nنرحل نرحل نلعب',
         'content_zh': '来吧来吧小家伙\n去公园里玩耍\n太阳照耀天空\n我们走吧去玩耍'},
        {'title': 'قمامة', 'title_zh': '小猫咪',
         'content': 'قمامة قمامة\nتجلس على الحائط\nتقوم باللعب\nمع الصنوبر',
         'content_zh': '小猫咪小猫咪\n坐在墙上\n玩耍着\n和松果一起'},
        {'title': 'عصفور', 'title_zh': '小鸟',
         'content': 'عصفور صغير يغنّي\nفي شجرة الخوخ\nيغنّي الأغنية الجميلة\nللجميع في الحديقة',
         'content_zh': '小鸟在歌唱\n在杏树上\n唱着美丽的歌\n给公园里的每个人'},
    ],
    'zh': [
        {'title': '小星星', 'title_zh': '小星星',
         'content': '一闪一闪亮晶晶\n满天都是小星星\n挂在天空放光明\n好像许多小眼睛',
         'content_zh': '一闪一闪亮晶晶\n满天都是小星星\n挂在天空放光明\n好像许多小眼睛'},
        {'title': '两只老虎', 'title_zh': '两只老虎',
         'content': '两只老虎两只老虎\n跑得快跑得快\n一只没有眼睛\n一只没有尾巴\n真奇怪真奇怪',
         'content_zh': '两只老虎两只老虎\n跑得快跑得快\n一只没有眼睛\n一只没有尾巴\n真奇怪真奇怪'},
        {'title': '小兔子乖乖', 'title_zh': '小兔子乖乖',
         'content': '小兔子乖乖\n把门儿开开\n快点儿开开\n我要进来',
         'content_zh': '小兔子乖乖\n把门儿开开\n快点儿开开\n我要进来'},
    ],
}

# 故事模板
STORY_TEMPLATES = {
    'ja': [
        {'title': '小さな鳥の冒険', 'title_zh': '小鸟的冒险',
         'content': '森の中に小さな鳥が住んでいました。ある日、鳥は「外の世界を見てみたい」と思い、飛び立ちました。青い空を飛ぶのはとても楽しかったです。途中で美しい花畑に出会い、小さな虫と友達になりました。夕暮れ時、鳥は家に帰りました。「今日は素敵な冒険だった！」と鳥は笑顔で言いました。',
         'content_zh': '森林里住着一只小鸟。有一天，小鸟想："我想去看看外面的世界"，于是它飞了起来。在蓝天上飞翔非常快乐。途中它遇到了美丽的花园，和小虫成了朋友。傍晚时分，小鸟回到了家。"今天真是美好的冒险！"小鸟笑着说。'},
        {'title': '魔法の種', 'title_zh': '魔法种子',
         'content': '太郎はおじいさんから魔法の種をもらいました。「この種を植えると、願いが叶うよ」とおじいさんは言いました。太郎は庭に種を植え、毎日水をやりました。すると、種は大きな木に育ち、木の上には金色の実がなりました。太郎は喜んで実を食べました。その後、太郎の願いはどんどん叶うようになりました。',
         'content_zh': '太郎从爷爷那里得到了一颗魔法种子。"种下这颗种子，愿望就会实现哦"爷爷说。太郎把种子种在院子里，每天浇水。于是，种子长成了一棵大树，树上结满了金色的果实。太郎开心地吃了果实。之后，太郎的愿望一个接一个地实现了。'},
    ],
    'en': [
        {'title': 'The Little Bird\'s Adventure', 'title_zh': '小鸟的冒险',
         'content': 'A little bird lived in the forest. One day, the bird thought, "I want to see the outside world," so it flew away. Flying in the blue sky was very enjoyable. Along the way, it met a beautiful flower garden and became friends with a small bug. At sunset, the bird returned home. "Today was a wonderful adventure!" said the bird with a smile.',
         'content_zh': '森林里住着一只小鸟。有一天，小鸟想："我想去看看外面的世界"，于是它飞了起来。在蓝天上飞翔非常快乐。途中它遇到了美丽的花园，和小虫成了朋友。傍晚时分，小鸟回到了家。"今天真是美好的冒险！"小鸟笑着说。'},
        {'title': 'The Magic Seed', 'title_zh': '魔法种子',
         'content': 'Taro received a magic seed from his grandfather. "If you plant this seed, your wish will come true," said the grandfather. Taro planted the seed in the garden and watered it every day. Then, the seed grew into a big tree, and golden fruits appeared on the tree. Taro happily ate the fruit. After that, Taro\'s wishes began to come true one by one.',
         'content_zh': '太郎从爷爷那里得到了一颗魔法种子。"种下这颗种子，愿望就会实现哦"爷爷说。太郎把种子种在院子里，每天浇水。于是，种子长成了一棵大树，树上结满了金色的果实。太郎开心地吃了果实。之后，太郎的愿望一个接一个地实现了。'},
    ],
    'ko': [
        {'title': '작은 새의 모험', 'title_zh': '小鸟的冒险',
         'content': '숲 속에 작은 새가 살고 있었습니다. 어느 날 새는 "밖 세상을 보고 싶다"고 생각하고 날아갔습니다. 푸른 하늘을 나는 것은 정말 즐거웠습니다. 길에서 아름다운 꽃밭을 만나고 작은 벌레와 친구가 되었습니다. 해 질 무렵 새는 집에 돌아왔습니다. "오늘 정말 멋진 모험이었다!" 새가 웃으며 말했습니다.',
         'content_zh': '森林里住着一只小鸟。有一天，小鸟想："我想去看看外面的世界"，于是它飞了起来。在蓝天上飞翔非常快乐。途中它遇到了美丽的花园，和小虫成了朋友。傍晚时分，小鸟回到了家。"今天真是美好的冒险！"小鸟笑着说。'},
        {'title': '마법의 씨앗', 'title_zh': '魔法种子',
         'content': '타로는 할아버지에게 마법의 씨앗을 받았습니다. "이 씨앗을 심으면 소원이 이루어질 거야" 할아버지가 말했습니다. 타로는 정원에 씨앗을 심고 매일 물을 주었습니다. 그러자 씨앗은 큰 나무로 자라나 나무 위에는 금색 열매가 열렸습니다. 타로는 기뻐하며 열매를 먹었습니다. 그 후 타로의 소원이 하나 둘씩 이루어지기 시작했습니다.',
         'content_zh': '太郎从爷爷那里得到了一颗魔法种子。"种下这颗种子，愿望就会实现哦"爷爷说。太郎把种子种在院子里，每天浇水。于是，种子长成了一棵大树，树上结满了金色的果实。太郎开心地吃了果实。之后，太郎的愿望一个接一个地实现了。'},
    ],
    'fr': [
        {'title': "L'aventure de l'oiseau", 'title_zh': '小鸟的冒险',
         'content': 'Un petit oiseau vivait dans la forêt. Un jour, l\'oiseau pensa: "Je veux voir le monde extérieur", alors il s\'envola. Voler dans le ciel bleu était très agréable. Sur le chemin, il rencontra un beau jardin de fleurs et devint ami avec un petit insecte. Au coucher du soleil, l\'oiseau rentra chez lui. "Aujourd\'hui a été une merveilleuse aventure!" dit l\'oiseau en souriant.',
         'content_zh': '森林里住着一只小鸟。有一天，小鸟想："我想去看看外面的世界"，于是它飞了起来。在蓝天上飞翔非常快乐。途中它遇到了美丽的花园，和小虫成了朋友。傍晚时分，小鸟回到了家。"今天真是美好的冒险！"小鸟笑着说。'},
        {'title': 'La graine magique', 'title_zh': '魔法种子',
         'content': 'Taro reçut une graine magique de son grand-père. "Si vous plantez cette graine, votre souhait se réalisera", dit le grand-père. Taro planta la graine dans le jardin et l\'arrosa tous les jours. Puis, la graine devint un grand arbre, et des fruits dorés apparurent sur l\'arbre. Taro mangea joyeusement le fruit. Après cela, les souhaits de Taro commencèrent à se réaliser les uns après les autres.',
         'content_zh': '太郎从爷爷那里得到了一颗魔法种子。"种下这颗种子，愿望就会实现哦"爷爷说。太郎把种子种在院子里，每天浇水。于是，种子长成了一棵大树，树上结满了金色的果实。太郎开心地吃了果实。之后，太郎的愿望一个接一个地实现了。'},
    ],
    'es': [
        {'title': 'La aventura del pajarito', 'title_zh': '小鸟的冒险',
         'content': 'Un pajarito vivía en el bosque. Un día, el pajarito pensó: "Quiero ver el mundo exterior", así que voló. Volar en el cielo azul fue muy agradable. En el camino, conoció un hermoso jardín de flores y se hizo amigo de un pequeño insecto. Al atardecer, el pajarito regresó a casa. "¡Hoy fue una maravillosa aventura!" dijo el pajarito sonriendo.',
         'content_zh': '森林里住着一只小鸟。有一天，小鸟想："我想去看看外面的世界"，于是它飞了起来。在蓝天上飞翔非常快乐。途中它遇到了美丽的花园，和小虫成了朋友。傍晚时分，小鸟回到了家。"今天真是美好的冒险！"小鸟笑着说。'},
        {'title': 'La semilla mágica', 'title_zh': '魔法种子',
         'content': 'Taro recibió una semilla mágica de su abuelo. "Si plantas esta semilla, tu deseo se cumplirá", dijo el abuelo. Taro plantó la semilla en el jardín y la regó todos los días. Entonces, la semilla creció en un árbol grande, y aparecieron frutos dorados en el árbol. Taro comió felizmente el fruto. Después de eso, los deseos de Taro comenzaron a cumplirse uno por uno.',
         'content_zh': '太郎从爷爷那里得到了一颗魔法种子。"种下这颗种子，愿望就会实现哦"爷爷说。太郎把种子种在院子里，每天浇水。于是，种子长成了一棵大树，树上结满了金色的果实。太郎开心地吃了果实。之后，太郎的愿望一个接一个地实现了。'},
    ],
    'de': [
        {'title': 'Das Abenteuer des kleinen Vogels', 'title_zh': '小鸟的冒险',
         'content': 'Ein kleiner Vogel lebte im Wald. Eines Tages dachte der Vogel: "Ich möchte die Außenwelt sehen", also flog er weg. Fliegen im blauen Himmel war sehr angenehm. Unterwegs traf er einen schönen Blumengarten und freundete sich mit einem kleinen Insekt an. Bei Sonnenuntergang kehrte der Vogel nach Hause zurück. "Heute war ein wunderbares Abenteuer!" sagte der Vogel lächelnd.',
         'content_zh': '森林里住着一只小鸟。有一天，小鸟想："我想去看看外面的世界"，于是它飞了起来。在蓝天上飞翔非常快乐。途中它遇到了美丽的花园，和小虫成了朋友。傍晚时分，小鸟回到了家。"今天真是美好的冒险！"小鸟笑着说。'},
        {'title': 'Die magische Saat', 'title_zh': '魔法种子',
         'content': 'Taro erhielt eine magische Saat von seinem Großvater. "Wenn du diese Saat pflanzt, wird dein Wunsch wahr", sagte der Großvater. Taro pflanzte die Saat im Garten und goss sie jeden Tag. Dann wuchs die Saat zu einem großen Baum, und goldene Früchte erschienen auf dem Baum. Taro aß glücklich die Frucht. Danach begannen Taros Wünsche einer nach dem anderen wahr zu werden.',
         'content_zh': '太郎从爷爷那里得到了一颗魔法种子。"种下这颗种子，愿望就会实现哦"爷爷说。太郎把种子种在院子里，每天浇水。于是，种子长成了一棵大树，树上结满了金色的果实。太郎开心地吃了果实。之后，太郎的愿望一个接一个地实现了。'},
    ],
    'it': [
        {'title': 'L\'avventura del piccolo uccellino', 'title_zh': '小鸟的冒险',
         'content': 'Un piccolo uccellino viveva nel bosco. Un giorno, l\'uccellino pensò: "Voglio vedere il mondo esterno", quindi volò via. Volare nel cielo blu fu molto piacevole. Lungo il percorso, incontrò un bel giardino di fiori e divenne amico di un piccolo insetto. Al tramonto, l\'uccellino tornò a casa. "Oggi è stata un\'avventura meravigliosa!" disse l\'uccellino sorridendo.',
         'content_zh': '森林里住着一只小鸟。有一天，小鸟想："我想去看看外面的世界"，于是它飞了起来。在蓝天上飞翔非常快乐。途中它遇到了美丽的花园，和小虫成了朋友。傍晚时分，小鸟回到了家。"今天真是美好的冒险！"小鸟笑着说。'},
        {'title': 'Il seme magico', 'title_zh': '魔法种子',
         'content': 'Taro ricevette un seme magico da suo nonno. "Se pianti questo seme, il tuo desiderio si realizzerà", disse il nonno. Taro piantò il seme nel giardino e lo irrigò tutti i giorni. Poi, il seme crebbe in un grande albero, e apparvero frutti d\'oro sull\'albero. Taro mangiò felice il frutto. Dopo di che, i desideri di Taro iniziarono a realizzarsi uno dopo l\'altro.',
         'content_zh': '太郎从爷爷那里得到了一颗魔法种子。"种下这颗种子，愿望就会实现哦"爷爷说。太郎把种子种在院子里，每天浇水。于是，种子长成了一棵大树，树上结满了金色的果实。太郎开心地吃了果实。之后，太郎的愿望一个接一个地实现了。'},
    ],
    'pt': [
        {'title': 'A aventura do passarinho', 'title_zh': '小鸟的冒险',
         'content': 'Um passarinho vivia na floresta. Um dia, o passarinho pensou: "Quero ver o mundo exterior", então voou. Voar no céu azul foi muito agradável. Ao longo do caminho, conheceu um belo jardim de flores e fez amizade com um pequeno inseto. Ao entardecer, o passarinho voltou para casa. "Hoje foi uma aventura maravilhosa!" disse o passarinho sorrindo.',
         'content_zh': '森林里住着一只小鸟。有一天，小鸟想："我想去看看外面的世界"，于是它飞了起来。在蓝天上飞翔非常快乐。途中它遇到了美丽的花园，和小虫成了朋友。傍晚时分，小鸟回到了家。"今天真是美好的冒险！"小鸟笑着说。'},
        {'title': 'A semente mágica', 'title_zh': '魔法种子',
         'content': 'Taro recebeu uma semente mágica de seu avô. "Se você plantar esta semente, seu desejo se realizará", disse o avô. Taro plantou a semente no jardim e a regou todos os dias. Então, a semente cresceu em uma árvore grande, e apareceram frutos dourados na árvore. Taro comeu feliz o fruto. Depois disso, os desejos de Taro começaram a se realizar um por um.',
         'content_zh': '太郎从爷爷那里得到了一颗魔法种子。"种下这颗种子，愿望就会实现哦"爷爷说。太郎把种子种在院子里，每天浇水。于是，种子长成了一棵大树，树上结满了金色的果实。太郎开心地吃了果实。之后，太郎的愿望一个接一个地实现了。'},
    ],
    'ar': [
        {'title': 'مغامرة الطائر الصغير', 'title_zh': '小鸟的冒险',
         'content': 'كان طائر صغير يسكن في الغابة. في يوم واحد، فكر الطائر: "أريد أن أرى العالم الخارجي"، لذلك طار. كان الطيران في السماء الزرقاء ممتعاً جداً. على الطريق، التقى بحديقة زهور جميلة وأصبح صديقاً مع حشرة صغيرة. عند غروب الشمس، عاد الطائر إلى منزله. "اليوم كانت مغامرة رائعة!" قال الطائر مبتسماً.',
         'content_zh': '森林里住着一只小鸟。有一天，小鸟想："我想去看看外面的世界"，于是它飞了起来。在蓝天上飞翔非常快乐。途中它遇到了美丽的花园，和小虫成了朋友。傍晚时分，小鸟回到了家。"今天真是美好的冒险！"小鸟笑着说。'},
        {'title': 'البذرة السحرية', 'title_zh': '魔法种子',
         'content': 'تلقى تارو بذرة سحرية من جده. "إذا زرعت هذه البذرة، ستحقق أمنيتك"، قال الجد. زرع تارو البذرة في الحديقة وسقيها كل يوم. ثم، نمت البذرة لتصبح شجرة كبيرة، وظهرت فاكهة ذهبية على الشجرة. أكل تارو الفاكهة بسعادة. بعد ذلك، بدأت أمنيات تارو تتحقق واحدة تلو الأخرى.',
         'content_zh': '太郎从爷爷那里得到了一颗魔法种子。"种下这颗种子，愿望就会实现哦"爷爷说。太郎把种子种在院子里，每天浇水。于是，种子长成了一棵大树，树上结满了金色的果实。太郎开心地吃了果实。之后，太郎的愿望一个接一个地实现了。'},
    ],
    'zh': [
        {'title': '小鸟的冒险', 'title_zh': '小鸟的冒险',
         'content': '森林里住着一只小鸟。有一天，小鸟想："我想去看看外面的世界"，于是它飞了起来。在蓝天上飞翔非常快乐。途中它遇到了美丽的花园，和小虫成了朋友。傍晚时分，小鸟回到了家。"今天真是美好的冒险！"小鸟笑着说。',
         'content_zh': '森林里住着一只小鸟。有一天，小鸟想："我想去看看外面的世界"，于是它飞了起来。在蓝天上飞翔非常快乐。途中它遇到了美丽的花园，和小虫成了朋友。傍晚时分，小鸟回到了家。"今天真是美好的冒险！"小鸟笑着说。'},
        {'title': '魔法种子', 'title_zh': '魔法种子',
         'content': '太郎从爷爷那里得到了一颗魔法种子。"种下这颗种子，愿望就会实现哦"爷爷说。太郎把种子种在院子里，每天浇水。于是，种子长成了一棵大树，树上结满了金色的果实。太郎开心地吃了果实。之后，太郎的愿望一个接一个地实现了。',
         'content_zh': '太郎从爷爷那里得到了一颗魔法种子。"种下这颗种子，愿望就会实现哦"爷爷说。太郎把种子种在院子里，每天浇水。于是，种子长成了一棵大树，树上结满了金色的果实。太郎开心地吃了果实。之后，太郎的愿望一个接一个地实现了。'},
    ],
}


def generate_jokes(lang: str, age_group: str, count: int) -> List[Dict]:
    """生成笑话内容"""
    templates = JOKE_TEMPLATES.get(lang, JOKE_TEMPLATES['en'])
    results = []
    difficulty = AGE_GROUPS[age_group]['difficulty']
    
    for i in range(count):
        template = random.choice(templates)
        results.append({
            'id': str(uuid.uuid4()),
            'lang_code': lang,
            'age_group': age_group,
            'content': template['content'],
            'content_zh': template['content_zh'],
            'category': random.choice(['general', 'pun', 'story', 'one_liner']),
            'difficulty': difficulty,
            'order_index': i,
        })
    return results


def generate_nursery_rhymes(lang: str, age_group: str, count: int) -> List[Dict]:
    """生成童谣内容"""
    templates = RHYME_TEMPLATES.get(lang, RHYME_TEMPLATES['en'])
    results = []
    difficulty = AGE_GROUPS[age_group]['difficulty']
    
    for i in range(count):
        template = random.choice(templates)
        results.append({
            'id': str(uuid.uuid4()),
            'lang_code': lang,
            'age_group': age_group,
            'title': template['title'],
            'title_zh': template['title_zh'],
            'content': template['content'],
            'content_zh': template['content_zh'],
            'difficulty': difficulty,
            'order_index': i,
        })
    return results


def generate_short_stories(lang: str, age_group: str, count: int) -> List[Dict]:
    """生成短篇故事内容"""
    templates = STORY_TEMPLATES.get(lang, STORY_TEMPLATES['en'])
    results = []
    difficulty = AGE_GROUPS[age_group]['difficulty']
    
    for i in range(count):
        template = random.choice(templates)
        results.append({
            'id': str(uuid.uuid4()),
            'lang_code': lang,
            'age_group': age_group,
            'title': template['title'],
            'title_zh': template['title_zh'],
            'content': template['content'],
            'content_zh': template['content_zh'],
            'difficulty': difficulty,
            'story_length': 'short',
            'order_index': i,
        })
    return results


def upsert_to_supabase(client, table_name: str, records: List[Dict], dry_run: bool = False) -> int:
    """批量插入/更新数据到Supabase"""
    if not records:
        return 0
    
    if dry_run:
        for r in records[:3]:
            if 'title' in r:
                print(f"  DRY  {r['lang_code']:5s} {r['age_group']:10s} {r['title'][:30]:<30s}")
            else:
                print(f"  DRY  {r['lang_code']:5s} {r['age_group']:10s} {r['content'][:30]:<30s}")
        if len(records) > 3:
            print(f"  ... and {len(records) - 3} more")
        return len(records)
    
    try:
        batch_size = 50
        total = 0
        for i in range(0, len(records), batch_size):
            batch = records[i:i+batch_size]
            resp = client.table(table_name).upsert(batch).execute()
            if hasattr(resp, 'error') and resp.error:
                print(f"  ERROR upsert: {resp.error}", file=sys.stderr)
                return total
            total += len(batch)
            print(f"  Upserted {total}/{len(records)} rows...", end="\r", flush=True)
        print()
        return total
    except Exception as e:
        print(f"  ERROR: {e}", file=sys.stderr)
        return total


def main():
    parser = argparse.ArgumentParser(
        description="AI智能内容生成器 - 生成多语言双语对照内容"
    )
    parser.add_argument('--lang', required=True, choices=LANGUAGES.keys(),
                        help="目标语言代码: ja, en, ko, fr, es, de, it, pt, ar, zh")
    parser.add_argument('--age', required=True, choices=AGE_GROUPS.keys(),
                        help="年龄段: kids, teenagers, adults")
    parser.add_argument('--type', required=True, choices=CONTENT_TYPES.keys(),
                        help="内容类型: nursery_rhyme, short_story, joke, radio")
    parser.add_argument('--count', type=int, default=100,
                        help="生成数量 (默认: 100)")
    parser.add_argument('--dry-run', action='store_true',
                        help="仅预览，不写入数据库")
    
    args = parser.parse_args()
    
    # 获取环境变量
    supabase_url = os.environ.get('SUPABASE_URL')
    supabase_key = os.environ.get('SUPABASE_KEY')
    
    if not supabase_url or not supabase_key:
        print("ERROR: 请设置环境变量 SUPABASE_URL 和 SUPABASE_KEY", file=sys.stderr)
        sys.exit(1)
    
    # 初始化Supabase客户端
    client = create_client(supabase_url, supabase_key)
    
    # 根据类型生成内容
    print(f"正在生成 {LANGUAGES[args.lang]['name']} {AGE_GROUPS[args.age]['name']} {CONTENT_TYPES[args.type]['name']} ...")
    print(f"目标数量: {args.count}")
    
    if args.type == 'joke':
        records = generate_jokes(args.lang, args.age, args.count)
        table_name = 'jokes'
    elif args.type == 'nursery_rhyme':
        records = generate_nursery_rhymes(args.lang, args.age, args.count)
        table_name = 'nursery_rhymes'
    elif args.type == 'short_story':
        records = generate_short_stories(args.lang, args.age, args.count)
        table_name = 'short_stories'
    elif args.type == 'radio':
        print("ERROR: radio类型暂不支持自动生成", file=sys.stderr)
        sys.exit(1)
    else:
        print(f"ERROR: 未知类型 {args.type}", file=sys.stderr)
        sys.exit(1)
    
    # 插入数据库
    print(f"\n正在写入数据库表 {table_name}...")
    total = upsert_to_supabase(client, table_name, records, args.dry_run)
    
    print(f"\n{'DRY-RUN ' if args.dry_run else ''}生成完成!")
    print(f"  成功生成: {total} 条记录")
    print(f"  语言: {LANGUAGES[args.lang]['name']}")
    print(f"  年龄段: {AGE_GROUPS[args.age]['name']}")
    print(f"  内容类型: {CONTENT_TYPES[args.type]['name']}")


if __name__ == '__main__':
    main()
