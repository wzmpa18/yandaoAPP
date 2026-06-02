import requests
import json
import random
import uuid
import os

SUPABASE_URL = 'https://mfwvwohgpxgeihmqludt.supabase.co'
SUPABASE_KEY = os.environ.get('SUPABASE_SERVICE_KEY', 'your_supabase_service_key_here')

LANGUAGES = ['ja', 'en', 'ko', 'fr', 'es', 'de', 'it', 'pt', 'ar', 'zh']

JOKE_TEMPLATES = {
    'en': [
        'Why did the {animal} cross the {place}? To get to the {adjective} side!',
        'What do you call a {adjective} {animal}? A {noun}!',
        'How does a {animal} {verb}? Very {adverb}!',
        'Why don\'t {animal}s like {food}? Because it\'s too {adjective}!',
        'What do you get when you cross a {animal} and a {animal2}? A {noun}!',
    ],
    'ja': [
        '{animal}が{place}を渡った理由は？{adjective}側に行くためです！',
        '{adjective}{animal}を何と呼びますか？{noun}です！',
        '{animal}はどのように{verb}しますか？とても{adverb}です！',
        '{animal}が{food}が嫌いなのはなぜですか？{adjective}すぎるからです！',
        '{animal}と{animal2}を掛け合わせると何になりますか？{noun}です！',
    ],
    'ko': [
        '{animal}이 {place}를 건넌 이유는? {adjective} 쪽에 가기 위해서입니다!',
        '{adjective} {animal}을 뭐라고 합니까? {noun}입니다!',
        '{animal}은 어떻게 {verb}합니까? 아주 {adverb}합니다!',
        '{animal}이 {food}를 싫어하는 이유는? 너무 {adjective}하기 때문입니다!',
        '{animal}과 {animal2}을 교차하면 무엇이 됩니까? {noun}입니다!',
    ],
    'fr': [
        'Pourquoi le {animal} a-t-il traversé la {place} ? Pour aller du côté {adjective} !',
        'Comment appelle-t-on un {animal} {adjective} ? Un {noun} !',
        'Comment {verb} un {animal} ? Très {adverb} !',
        'Pourquoi les {animal}s n\'aiment pas {food} ? Parce que c\'est trop {adjective} !',
        'Qu\'obtient-on en croisant un {animal} et un {animal2} ? Un {noun} !',
    ],
    'es': [
        '¿Por qué cruzó el {animal} la {place}? ¡Para llegar al lado {adjective}!',
        '¿Cómo se llama un {animal} {adjective}? ¡Un {noun}!',
        '¿Cómo {verb} un {animal}? ¡Muy {adverb}!',
        '¿Por qué no les gusta {food} a los {animal}es? ¡Porque es demasiado {adjective}!',
        '¿Qué se obtiene al cruzar un {animal} y un {animal2}? ¡Un {noun}!',
    ],
    'de': [
        'Warum kreuzte das {animal} die {place}? Um zur {adjective}en Seite zu gelangen!',
        'Wie nennt man ein {adjective}s {animal}? Ein {noun}!',
        'Wie {verb}t ein {animal}? Sehr {adverb}!',
        'Warum mögen {animal}s {food} nicht? Weil es zu {adjective} ist!',
        'Was bekommt man, wenn man ein {animal} und ein {animal2} kreuzt? Ein {noun}!',
    ],
    'it': [
        'Perché l\'{animal} ha attraversato la {place}? Per arrivare sul lato {adjective}!',
        'Come si chiama un {animal} {adjective}? Un {noun}!',
        'Come {verb} un {animal}? Molto {adverb}!',
        'Perché gli {animal}i non amano {food}? Perché è troppo {adjective}!',
        'Cosa si ottiene incrociando un {animal} e un {animal2}? Un {noun}!',
    ],
    'pt': [
        'Por que o {animal} cruzou a {place}? Para chegar ao lado {adjective}!',
        'Como se chama um {animal} {adjective}? Um {noun}!',
        'Como {verb} um {animal}? Muito {adverb}!',
        'Por que os {animal}es não gostam de {food}? Porque é muito {adjective}!',
        'O que se obtém ao cruzar um {animal} e um {animal2}? Um {noun}!',
    ],
    'ar': [
        'لماذا عبّر {animal} {place}؟ لكي يصل إلى الجانب {adjective}!',
        'ماذا يُسمى {animal} {adjective}؟ {noun}!',
        'كيف {verb} {animal}؟ ب way {adverb}!',
        'لماذا لا يحب {animal} {food}؟ لأنه {adjective} جدًا!',
        'ماذا تحصل عند عبور {animal} و{animal2}؟ {noun}!',
    ],
    'zh': [
        '为什么{animal}要穿过{place}？为了到达{adjective}的那边！',
        '一只{adjective}的{animal}叫什么？叫{noun}！',
        '{animal}是怎么{verb}的？非常{adverb}！',
        '为什么{animal}不喜欢{food}？因为太{adjective}了！',
        '把{animal}和{animal2}杂交会得到什么？{noun}！',
    ],
}

WORD_BANKS = {
    'animal': ['cat', 'dog', 'bird', 'fish', 'rabbit', 'turtle', 'elephant', 'giraffe', 'monkey', 'penguin'],
    'animal2': ['lion', 'tiger', 'bear', 'fox', 'wolf', 'deer', 'cow', 'horse', 'pig', 'sheep'],
    'place': ['road', 'river', 'forest', 'mountain', 'park', 'street', 'bridge', 'field', 'lake', 'beach'],
    'adjective': ['happy', 'funny', 'silly', 'clever', 'brave', 'cute', 'fluffy', 'colorful', 'mysterious', 'magic'],
    'noun': ['superhero', 'wizard', 'pirate', 'robot', 'alien', 'dragon', 'princess', 'knight', 'detective', 'explorer'],
    'verb': ['dance', 'sing', 'jump', 'run', 'fly', 'swim', 'laugh', 'cry', 'sleep', 'eat'],
    'adverb': ['quickly', 'slowly', 'happily', 'sadly', 'loudly', 'quietly', 'carefully', 'carelessly', 'beautifully', 'gracefully'],
    'food': ['pizza', 'chocolate', 'vegetables', 'spicy food', 'ice cream', 'broccoli', 'fish', 'meat', 'fruit', 'cake'],
}

NURSERY_RHYMES = {
    'en': [
        'Twinkle, twinkle, little {noun}, How I wonder what you {verb}! Up above the {place} so high, Like a {adjective} in the {place2}.',
        'Mary had a little {animal}, Its {color} was white as {noun}. And everywhere that Mary {verb}, The {animal} was sure to go.',
        'Jack and Jill went up the {place} To fetch a pail of {noun}. Jack fell down and broke his {body_part}, And Jill came tumbling after.',
    ],
    'ja': [
        '{noun}の光、きらきら、君が何を{verb}するのか知りたい！{place}の上高く輝き、{place2}の{adjective}のように。',
        'メアリーは小さな{animal}を飼っていました、その{color}は{noun}のように白かった。メアリーがどこに{verb}くとも、{animal}は必ずついてきました。',
        'ジャックとジルは{noun}を汲みに{place}に登った。ジャックは転んで{body_part}を折った、ジルも後から転げ落ちた。',
    ],
    'ko': [
        '{noun} 반짝반짝, 너는 무엇을 {verb} 하는지 궁금해! {place} 위 높이 떠있어, {place2}의 {adjective}처럼.',
        '메리에게 작은 {animal}이 있었어, {color}는 {noun}처럼 희었다. 메리가 어디에 {verb}든 {animal}은 항상 따라갔어.',
        '잭과 질은 {noun}을 길어오기 위해 {place}에 올라갔다. 잭이 넘어져 {body_part}를 부러뜨렸고, 질도 뒤따라 넘어졌다.',
    ],
    'zh': [
        '{noun}闪烁，{noun}闪烁，我多想知道你在{verb}什么！高高挂在{place}之上，像{place2}中的{adjective}。',
        '玛丽有一只小{animal}，{color}像{noun}一样白。无论玛丽{verb}到哪里，{animal}都一定会跟着。',
        '杰克和吉尔上山去{place}，去取一桶{noun}。杰克摔下来摔断了{body_part}，吉尔也跟着滚下来。',
    ],
}

STORY_TEMPLATES = {
    'en': [
        'One day, a {adjective} {animal} decided to {verb} to the {place}. Along the way, it met a {adjective2} {animal2} who wanted to {verb2} together. They {verb3} through the {place2} and found a {noun} that changed their lives forever.',
        'In a {adjective} {place}, there lived a {animal} who dreamed of {verb}ing. One night, a {adjective2} {noun} appeared and granted the {animal} one wish. The {animal} wished for {wish}, and their life was never the same again.',
    ],
    'ja': [
        'ある日、{adjective}な{animal}が{place}に{verb}することにしました。途中、{verb2}したい{adjective2}な{animal2}に出会いました。彼らは{place2}を{verb3}し、人生を永遠に変える{noun}を見つけました。',
        '{adjective}な{place}に、{verb}することを夢見る{animal}が住んでいました。ある夜、{adjective2}な{noun}が現れ、{animal}に一つの願いを叶えてくれました。{animal}は{wish}を願い、人生は二度と同じではありませんでした。',
    ],
    'zh': [
        '有一天，一只{adjective}的{animal}决定去{place}{verb}。一路上，它遇到了一只想一起{verb2}的{adjective2}{animal2}。它们一起{verb3}穿过{place2}，发现了一个永远改变它们生活的{noun}。',
        '在一个{adjective}的{place}里，住着一只梦想着{verb}的{animal}。一天晚上，一个{adjective2}的{noun}出现了，答应满足{animal}一个愿望。{animal}许愿要{wish}，从此它的生活再也不一样了。',
    ],
}

RADIO_TYPES = ['morning', 'evening', 'music', 'story', 'comedy']
RADIO_TEMPLATES = {
    'morning': [
        'Good {time}, listeners! Welcome to our {adjective} morning show. Today we have {noun}, {noun2}, and lots of {adjective2} {plural_noun}.',
        'Rise and shine! It\'s time for {adjective} {time} radio. Join us as we {verb} through the day with {noun} and {adjective2} conversations.',
    ],
    'evening': [
        'Good {time}, everyone! Relax and unwind with our {adjective} evening program. Tonight features {noun}, {verb} music, and {adjective2} stories.',
        'Welcome to the {adjective} {time} show. Let\'s {verb} the day away with {noun} and {adjective2} vibes.',
    ],
    'music': [
        'Welcome to {adjective} music hour! Today we\'re featuring {noun}, {noun2}, and other {adjective2} {plural_noun}.',
        'Get ready to {verb} with our {adjective} music selection. We have {noun}, {noun2}, and more!',
    ],
    'story': [
        'Welcome to Storytime! Today\'s {adjective} tale is about a {animal} who {verb} to {place} and found {noun}.',
        'Settle in for our {adjective} story segment. Tonight, we bring you the tale of {noun} and the {adjective2} {animal}.',
    ],
    'comedy': [
        'Welcome to {adjective} Comedy Night! Get ready to {verb} with {noun}, {noun2}, and hilarious {plural_noun}.',
        'Laugh along with our {adjective} comedy show. Tonight features {noun}, {adjective2} jokes, and {verb} moments.',
    ],
}

EXTRA_WORDS = {
    'color': ['red', 'blue', 'yellow', 'green', 'purple', 'pink', 'orange', 'black', 'white', 'brown'],
    'body_part': ['head', 'arm', 'leg', 'hand', 'foot', 'finger', 'toe', 'nose', 'ear', 'eye'],
    'place2': ['sky', 'garden', 'house', 'school', 'market', 'forest', 'ocean', 'mountain', 'city', 'village'],
    'adjective2': ['friendly', 'wise', 'mysterious', 'magical', 'brave', 'kind', 'funny', 'clever', 'gentle', 'playful'],
    'verb2': ['travel', 'explore', 'dance', 'sing', 'adventure', 'discover', 'create', 'build', 'share', 'learn'],
    'verb3': ['walked', 'ran', 'flew', 'sailed', 'journeyed', 'explored', 'traveled', 'hiked', 'cycled', 'drove'],
    'wish': ['happiness', 'adventure', 'friendship', 'wisdom', 'courage', 'magic', 'love', 'success', 'knowledge', 'peace'],
    'time': ['morning', 'evening', 'afternoon', 'night'],
    'plural_noun': ['songs', 'stories', 'jokes', 'tips', 'ideas', 'adventures', 'memories', 'dreams', 'smiles', 'moments'],
    'noun2': ['news', 'guests', 'stories', 'music', 'fun', 'laughter', 'adventure', 'knowledge', 'inspiration', 'joy'],
}

def generate_content(template, word_banks):
    content = template
    for key, values in word_banks.items():
        if '{' + key + '}' in content:
            content = content.replace('{' + key + '}', random.choice(values))
    return content

def import_to_supabase(items):
    if not items:
        return 0
    
    url = f"{SUPABASE_URL}/rest/v1/contents"
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    }
    
    try:
        response = requests.post(url, headers=headers, data=json.dumps(items))
        if response.status_code in [200, 201]:
            return len(items)
        else:
            print(f"  ❌ Error: {response.status_code} - {response.text[:200]}")
            return 0
    except Exception as e:
        print(f"  ❌ Exception: {e}")
        return 0

def main():
    print("🚀 Generating seed content...\n")
    
    all_items = []
    total_count = 0
    
    print("=== Generating Jokes ===")
    for lang in LANGUAGES:
        templates = JOKE_TEMPLATES.get(lang, JOKE_TEMPLATES['en'])
        for _ in range(50):
            template = random.choice(templates)
            content = generate_content(template, {**WORD_BANKS, **EXTRA_WORDS})
            item = {
                'id': str(uuid.uuid4()),
                'type': 'joke',
                'language': lang,
                'title': f'Joke {total_count + 1}',
                'content': content,
                'translation': '',
                'level': '1',
                'source': 'seed',
                'usage_count': 0,
            }
            all_items.append(item)
            total_count += 1
        print(f"  Generated 50 jokes for {lang}")
    
    print("\n=== Generating Nursery Rhymes ===")
    for lang in LANGUAGES[:4]:  # 部分语言支持童谣
        templates = NURSERY_RHYMES.get(lang, NURSERY_RHYMES['en'])
        for _ in range(30):
            template = random.choice(templates)
            content = generate_content(template, {**WORD_BANKS, **EXTRA_WORDS})
            item = {
                'id': str(uuid.uuid4()),
                'type': 'nursery_rhyme',
                'language': lang,
                'title': f'Nursery Rhyme {total_count + 1}',
                'content': content,
                'translation': '',
                'level': '1',
                'source': 'seed',
                'usage_count': 0,
            }
            all_items.append(item)
            total_count += 1
        print(f"  Generated 30 nursery rhymes for {lang}")
    
    print("\n=== Generating Short Stories ===")
    for lang in LANGUAGES[:4]:  # 部分语言支持短篇故事
        templates = STORY_TEMPLATES.get(lang, STORY_TEMPLATES['en'])
        for _ in range(20):
            template = random.choice(templates)
            content = generate_content(template, {**WORD_BANKS, **EXTRA_WORDS})
            item = {
                'id': str(uuid.uuid4()),
                'type': 'story',
                'language': lang,
                'title': f'Story {total_count + 1}',
                'content': content,
                'translation': '',
                'level': '2',
                'source': 'seed',
                'usage_count': 0,
            }
            all_items.append(item)
            total_count += 1
        print(f"  Generated 20 stories for {lang}")
    
    print("\n=== Generating Radio Scripts ===")
    for radio_type in RADIO_TYPES:
        templates = RADIO_TEMPLATES.get(radio_type, RADIO_TEMPLATES['morning'])
        for _ in range(20):
            template = random.choice(templates)
            content = generate_content(template, {**WORD_BANKS, **EXTRA_WORDS})
            item = {
                'id': str(uuid.uuid4()),
                'type': 'radio',
                'language': 'en',
                'title': f'{radio_type.capitalize()} Radio {total_count + 1}',
                'content': content,
                'translation': '',
                'level': '1',
                'source': 'seed',
                'usage_count': 0,
            }
            all_items.append(item)
            total_count += 1
        print(f"  Generated 20 {radio_type} radio scripts")
    
    print(f"\n📥 Importing {total_count} items to Supabase...")
    batch_size = 50
    imported = 0
    
    for i in range(0, len(all_items), batch_size):
        batch = all_items[i:i+batch_size]
        count = import_to_supabase(batch)
        imported += count
        print(f"  Batch {i//batch_size + 1}: Imported {count} items (total: {imported})")
    
    print(f"\n🎉 Generation complete! Total imported: {imported}")
    print(f"\n📊 Content Distribution:")
    print(f"  - Jokes: {len(LANGUAGES) * 50}")
    print(f"  - Nursery Rhymes: {4 * 30}")
    print(f"  - Short Stories: {4 * 20}")
    print(f"  - Radio Scripts: {5 * 20}")
    print(f"  - Total: {imported}")

if __name__ == '__main__':
    main()