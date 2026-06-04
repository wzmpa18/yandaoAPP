const app = getApp()

Page({
  data: {
    books: [
      {
        id: 1, title: 'The Little Prince', titleZh: '小王子',
        author: 'Antoine de Saint-Exupéry', level: 'A1', cover: '📚',
        wordCount: 2300, estimatedTime: '20分钟',
        description: '一个来自小行星的小王子的故事，充满童真与哲理',
        progress: 0, category: '文学经典',
        chapters: [
          { title: '第1章 - 遇见小王子', content: `Once when I was six years old I saw a magnificent picture in a book, called True Stories from Nature, about the primeval forest. It was a picture of a boa constrictor in the act of swallowing an animal. Here is a copy of the drawing.\n\nIn the book it said: "Boa constrictors swallow their prey whole, without chewing it. After that they are not able to move, and they sleep through the six months that they need for digestion."\n\nI pondered deeply, then, over the adventures of the jungle. And after some work with a colored pencil I succeeded in making my first drawing. My Drawing Number One. It looked something like this:` },
          { title: '第2章 - 沙漠相遇', content: `So I lived my life alone, without anyone that I could really talk to, until I had an accident with my plane in the Desert of Sahara, six years ago. Something was broken in my engine. And since I had neither a mechanic nor any passengers with me, I set myself to attempt the difficult repairs all alone.\n\nIt was a question of life or death for me: I had scarcely enough drinking water to last a week. The first night, then, I went to sleep on the sand, a thousand miles from any human habitation. I was more isolated than a shipwrecked sailor on a raft in the middle of the ocean.` },
          { title: '第3章 - 小王子的星球', content: `Thus you can imagine my amazement, at sunrise, when I was awakened by an odd little voice. It said:\n\n"If you please... draw me a sheep!"\n\n"What!"\n\n"Draw me a sheep!"\n\nI jumped to my feet, completely thunderstruck. I blinked my eyes hard. I looked carefully all around me. And I saw a most extraordinary small person, who stood there examining me with great seriousness.` }
        ],
        vocabulary: [
          { word: 'magnificent', meaning: '壮丽的，宏伟的', level: 'A2' },
          { word: 'primeval', meaning: '原始的，远古的', level: 'B1' },
          { word: 'constrictor', meaning: '蟒蛇', level: 'B1' },
          { word: 'pondered', meaning: '沉思，思考', level: 'B1' },
          { word: 'scarcely', meaning: '几乎不，勉强', level: 'B1' },
          { word: 'habitation', meaning: '居住地', level: 'B2' },
          { word: 'isolated', meaning: '孤立的，隔绝的', level: 'B1' },
          { word: 'amazement', meaning: '惊异，惊奇', level: 'B1' },
          { word: 'extraordinary', meaning: '非凡的，特别的', level: 'B1' },
          { word: 'thunderstruck', meaning: '惊愕的', level: 'B2' }
        ],
        grammarPoints: ['一般过去时', '时间状语从句', '直接引语', '过去完成时']
      },
      {
        id: 2, title: 'Animal Farm', titleZh: '动物农场',
        author: 'George Orwell', level: 'A2', cover: '🐑',
        wordCount: 3500, estimatedTime: '30分钟',
        description: '动物们推翻农场主的故事，讽刺政治寓言',
        progress: 0, category: '政治寓言',
        chapters: [
          { title: '第1章 - 老上校的演讲', content: `Mr. Jones, of the Manor Farm, had locked the hen-houses for the night, but was too drunk to remember to shut the pop-holes. With the ring of light from his lantern dancing from side to side, he lurched across the yard, kicked off his boots at the back door, drew himself a last glass of beer from the barrel in the scullery, and made his way up to bed, where Mrs. Jones was already snoring.\n\nAs soon as the light in the bedroom went out there was a stirring and a fluttering all through the farm buildings. Word had gone round during the day that old Major, the prize Middle White boar, had had a strange dream on the previous night and wished to communicate it to the other animals.` },
          { title: '第2章 - 动物起义', content: `They had all agreed that it was an interesting dream. They were waiting for old Major to wake up. He usually slept in a special place in the barn, under a pile of hay. It was a quiet, comfortable spot. The animals gathered there after Mr. Jones went to bed.\n\nOld Major was so highly regarded on the farm that everyone was quite ready to lose an hour's sleep in order to hear what he had to say. At one end of the big barn, on a sort of raised platform, Major was already settled on his bed of straw, under a lantern which hung from a beam.` }
        ],
        vocabulary: [
          { word: 'lantern', meaning: '灯笼，提灯', level: 'A2' },
          { word: 'lurched', meaning: '蹒跚，摇晃', level: 'B1' },
          { word: 'scullery', meaning: '洗碗间', level: 'B2' },
          { word: 'snoring', meaning: '打鼾', level: 'A2' },
          { word: 'stirring', meaning: '骚动，动静', level: 'B1' },
          { word: 'fluttering', meaning: '扑动，振翅', level: 'B1' },
          { word: 'barn', meaning: '谷仓', level: 'A2' },
          { word: 'regarded', meaning: '被认为，被看作', level: 'B1' }
        ],
        grammarPoints: ['过去完成时', 'too...to... 结构', '被动语态', '定语从句']
      },
      {
        id: 3, title: 'The Hobbit', titleZh: '霍比特人',
        author: 'J.R.R. Tolkien', level: 'B1', cover: '🧙',
        wordCount: 9500, estimatedTime: '60分钟',
        description: '比尔博·巴金斯的意外冒险之旅',
        progress: 0, category: '奇幻冒险',
        chapters: [
          { title: '第1章 - 不速之客', content: `In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to eat: it was a hobbit-hole, and that means comfort.\n\nIt had a perfectly round door like a porthole, painted green, with a shiny yellow brass knob in the exact middle. The door opened on to a tube-shaped hall like a tunnel: a very comfortable tunnel without smoke, with panelled walls, and floors tiled and carpeted, provided with polished chairs, and lots and lots of pegs for hats and coats.` },
          { title: '第2章 - 矮人的聚会', content: `The Bagginses had lived in the neighbourhood of The Hill for time out of mind, and people considered them very respectable, not only because most of them were rich, but also because they never had any adventures or did anything unexpected. You could tell what a Baggins would say on any question without the bother of asking him.\n\nThis is a story of how a Baggins had an adventure, and found himself doing and saying things altogether unexpected. He may have lost the neighbours' respect, but he gained something far more valuable.` }
        ],
        vocabulary: [
          { word: 'oozy', meaning: '渗水的，泥泞的', level: 'B2' },
          { word: 'porthole', meaning: '舷窗', level: 'B1' },
          { word: 'panelled', meaning: '镶板的', level: 'B2' },
          { word: 'tiled', meaning: '铺瓷砖的', level: 'A2' },
          { word: 'pegs', meaning: '挂钩，衣钩', level: 'B1' },
          { word: 'respectable', meaning: '受人尊敬的', level: 'B1' },
          { word: 'neighbourhood', meaning: '邻近地区', level: 'B1' },
          { word: 'altogether', meaning: '完全地，总共', level: 'B1' }
        ],
        grammarPoints: ['分号连接并列句', '倒装句', '定语从句', '过去分词作定语']
      },
      {
        id: 4, title: 'Pride and Prejudice', titleZh: '傲慢与偏见',
        author: 'Jane Austen', level: 'B2', cover: '🏰',
        wordCount: 12000, estimatedTime: '90分钟',
        description: '伊丽莎白与达西先生的爱情故事',
        progress: 0, category: '经典文学',
        chapters: [
          { title: '第1章 - 富有的邻居', content: `It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.\n\nHowever little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.\n\n"My dear Mr. Bennet," said his lady to him one day, "have you heard that Netherfield Park is let at last?" Mr. Bennet replied that he had not.` },
          { title: '第2章 - 舞会相遇', content: `Mr. Bennet was so odd a mixture of quick parts, sarcastic humour, reserve, and caprice, that the experience of three-and-twenty years had been insufficient to make his wife understand his character. Her mind was less difficult to develop. She was a woman of mean understanding, little information, and uncertain temper.\n\nWhen she was discontented, she fancied herself nervous. The business of her life was to get her daughters married; its solace was visiting and news.` }
        ],
        vocabulary: [
          { word: 'universally', meaning: '普遍地', level: 'B2' },
          { word: 'acknowledged', meaning: '公认的', level: 'B2' },
          { word: 'possession', meaning: '拥有，财产', level: 'B1' },
          { word: 'rightful', meaning: '合法的，正当的', level: 'B2' },
          { word: 'sarcastic', meaning: '讽刺的', level: 'B1' },
          { word: 'caprice', meaning: '反复无常', level: 'C1' },
          { word: 'insufficient', meaning: '不足的', level: 'B2' },
          { word: 'solace', meaning: '安慰，慰藉', level: 'C1' }
        ],
        grammarPoints: ['虚拟语气', '强调句', '复杂定语从句', '省略句']
      },
      {
        id: 5, title: 'Climate Change Report', titleZh: '气候变化报告',
        author: 'IPCC Scientific Panel', level: 'C1', cover: '🌍',
        wordCount: 8000, estimatedTime: '50分钟',
        description: '关于全球气候变化的最新科学研究报告',
        progress: 0, category: '科学报告',
        chapters: [
          { title: '第1章 - 气候变化概述', content: `Climate change poses one of the most significant challenges of our time. Rising global temperatures, melting polar ice caps, and increasingly frequent extreme weather events are just some of the consequences of greenhouse gas emissions. The scientific consensus is unequivocal: human activity, particularly the burning of fossil fuels, is the primary driver of this phenomenon.\n\nSince the pre-industrial era, the Earth's average surface temperature has risen by approximately 1.1°C. This warming has triggered a cascade of environmental changes, from shifting precipitation patterns to rising sea levels that threaten coastal communities worldwide.` },
          { title: '第2章 - 影响与应对', content: `The impacts of climate change are not distributed equally. Developing nations, which have contributed least to the problem, often bear the brunt of its consequences. Small island states face existential threats from sea-level rise, while sub-Saharan Africa grapples with intensifying droughts and food insecurity.\n\nAddressing climate change requires unprecedented international cooperation. The Paris Agreement, signed by 196 parties in 2015, represents a landmark commitment to limiting global temperature rise to well below 2°C above pre-industrial levels. However, current national pledges fall short of this target.` }
        ],
        vocabulary: [
          { word: 'unequivocal', meaning: '明确的，不含糊的', level: 'C1' },
          { word: 'cascade', meaning: '级联，一连串', level: 'C1' },
          { word: 'precipitation', meaning: '降水', level: 'C1' },
          { word: 'existential', meaning: '关乎存亡的', level: 'C2' },
          { word: 'unprecedented', meaning: '史无前例的', level: 'C1' },
          { word: 'landmark', meaning: '里程碑式的', level: 'C1' },
          { word: 'grapples', meaning: '努力应对', level: 'C2' },
          { word: 'intensifying', meaning: '加剧的', level: 'C1' }
        ],
        grammarPoints: ['非谓语动词作状语', '同位语从句', '分词独立结构', '倒装强调']
      }
    ],
    selectedLevel: 'all',
    levels: ['all', 'A1', 'A2', 'B1', 'B2', 'C1'],
    currentBook: null,
    currentChapter: null,
    showBookDetail: false,
    showReading: false,
    readingProgress: 0,
    bookmarkedWords: [],
    showWordMeaning: null,
    readHistory: []
  },

  onLoad: function () {
    // 恢复阅读历史
    const history = wx.getStorageSync('readingHistory') || []
    const bookmarks = wx.getStorageSync('readingBookmarks') || []
    this.setData({ readHistory: history, bookmarkedWords: bookmarks })

    // 恢复阅读进度
    const books = this.data.books.map(b => {
      const saved = history.find(h => h.bookId === b.id)
      if (saved) b.progress = saved.progress || 0
      return b
    })
    this.setData({ books })
  },

  selectLevel(e) {
    this.setData({ selectedLevel: e.currentTarget.dataset.level })
  },

  openBook(e) {
    const book = this.data.books.find(b => b.id === parseInt(e.currentTarget.dataset.id))
    this.setData({ currentBook: book, showBookDetail: true })
  },

  closeDetail() {
    this.setData({ showBookDetail: false, currentBook: null })
  },

  startReading: function (e) {
    const chapterIdx = e?.currentTarget?.dataset?.chapter || 0
    const chapter = this.data.currentBook.chapters[chapterIdx]
    this.setData({
      showBookDetail: false,
      showReading: true,
      currentChapter: chapter,
      readingProgress: 0
    })
    // 完成任务
    app.completeTask(5)
    app.addStudyGold(25)
  },

  // 点击单词查看释义
  onWordTap: function (e) {
    const word = e.currentTarget.dataset.word
    const current = this.data.showWordMeaning
    this.setData({ showWordMeaning: current === word ? null : word })
  },

  // 收藏单词
  toggleBookmark: function (e) {
    const word = e.currentTarget.dataset.word
    let bookmarks = [...this.data.bookmarkedWords]
    const idx = bookmarks.indexOf(word)
    if (idx > -1) {
      bookmarks.splice(idx, 1)
    } else {
      bookmarks.push(word)
    }
    this.setData({ bookmarkedWords: bookmarks })
    wx.setStorageSync('readingBookmarks', bookmarks)
    wx.showToast({ title: idx > -1 ? '已取消收藏' : '已收藏', icon: 'success' })
  },

  // 滚动阅读更新进度
  onReadingScroll: function (e) {
    const { scrollTop, scrollHeight } = e.detail
    const progress = Math.min(100, Math.round((scrollTop / (scrollHeight - 300)) * 100))
    this.setData({ readingProgress: progress })
  },

  // 完成当前章节
  completeChapter: function () {
    const book = this.data.currentBook
    const history = this.data.readHistory
    const existing = history.findIndex(h => h.bookId === book.id)
    if (existing > -1) {
      history[existing].progress = 100
      history[existing].completedAt = new Date().toISOString()
    } else {
      history.push({ bookId: book.id, title: book.title, progress: 100, completedAt: new Date().toISOString() })
    }
    wx.setStorageSync('readingHistory', history)

    // 更新书籍进度
    const books = this.data.books.map(b => {
      if (b.id === book.id) b.progress = 100
      return b
    })

    this.setData({
      readHistory: history,
      books: books,
      showReading: false,
      currentChapter: null
    })

    app.addExp(50)
    app.addStudyMinutes(book.estimatedTime === '20分钟' ? 20 : (book.estimatedTime === '30分钟' ? 30 : 15))
    wx.showToast({ title: '🎉 阅读完成！+50经验', icon: 'success' })
  },

  closeReading: function () {
    // 保存当前进度
    const book = this.data.currentBook
    if (book && this.data.readingProgress > 0) {
      const history = this.data.readHistory
      const existing = history.findIndex(h => h.bookId === book.id)
      if (existing > -1) {
        history[existing].progress = Math.max(history[existing].progress, this.data.readingProgress)
      } else {
        history.push({ bookId: book.id, title: book.title, progress: this.data.readingProgress })
      }
      wx.setStorageSync('readingHistory', history)
    }

    this.setData({
      showReading: false,
      currentChapter: null,
      readingProgress: 0,
      showWordMeaning: null
    })
  },

  goBack() {
    wx.navigateBack()
  },

  getFilteredBooks() {
    if (this.data.selectedLevel === 'all') {
      return this.data.books
    }
    return this.data.books.filter(b => b.level === this.data.selectedLevel)
  },

  // 渲染章节内容 - 高亮词汇
  renderContent: function (content, vocabulary) {
    let html = content
    vocabulary.forEach(v => {
      const regex = new RegExp(`\\b${v.word}\\b`, 'gi')
      html = html.replace(regex, `<span class="vocab-highlight" data-word="${v.word}">${v.word}</span>`)
    })
    return html
  }
})
