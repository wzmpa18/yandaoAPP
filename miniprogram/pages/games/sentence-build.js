Page({
  data: {
    currentLevel: 0,
    score: 0,
    time: 0,
    isPlaying: false,
    gameOver: false,
    levels: [],
    shuffledWords: [],
    selectedWords: [],
    showResult: false,
    isCorrect: false,
    currentHint: '',
    correctAnswer: ''
  },

  onLoad: function () {
    this.initGame()
    this.startTimer()
  },

  initGame: function () {
    const levels = [
      {
        id: 1,
        words: ['I', 'love', 'cats'],
        answer: ['I', 'love', 'cats'],
        hint: '我爱猫'
      },
      {
        id: 2,
        words: ['She', 'eats', 'apple', 'an'],
        answer: ['She', 'eats', 'an', 'apple'],
        hint: '她吃一个苹果'
      },
      {
        id: 3,
        words: ['We', 'go', 'to', 'school', 'every', 'day'],
        answer: ['We', 'go', 'to', 'school', 'every', 'day'],
        hint: '我们每天去上学'
      },
      {
        id: 4,
        words: ['He', 'is', 'reading', 'book', 'a'],
        answer: ['He', 'is', 'reading', 'a', 'book'],
        hint: '他正在读书'
      },
      {
        id: 5,
        words: ['They', 'are', 'playing', 'football', 'in', 'park', 'the'],
        answer: ['They', 'are', 'playing', 'football', 'in', 'the', 'park'],
        hint: '他们正在公园里踢足球'
      },
      {
        id: 6,
        words: ['My', 'mother', 'cooks', 'delicious', 'food', 'very'],
        answer: ['My', 'mother', 'cooks', 'very', 'delicious', 'food'],
        hint: '我妈妈做非常美味的食物'
      },
      {
        id: 7,
        words: ['The', 'sun', 'shines', 'brightly', 'in', 'sky', 'the'],
        answer: ['The', 'sun', 'shines', 'brightly', 'in', 'the', 'sky'],
        hint: '太阳在天空中明亮地照耀'
      },
      {
        id: 8,
        words: ['We', 'will', 'have', 'party', 'birthday', 'a', 'next', 'week'],
        answer: ['We', 'will', 'have', 'a', 'birthday', 'party', 'next', 'week'],
        hint: '我们下周将举办一个生日派对'
      }
    ]

    this.setData({
      levels,
      currentLevel: 0,
      score: 0,
      time: 0,
      isPlaying: true,
      gameOver: false,
      shuffledWords: this.shuffleArray([...levels[0].words]),
      selectedWords: [],
      showResult: false,
      isCorrect: false,
      currentHint: levels[0].hint,
      correctAnswer: ''
    })
  },

  startTimer: function () {
    this.timer = setInterval(() => {
      this.setData({ time: this.data.time + 1 })
    }, 1000)
  },

  shuffleArray: function (array) {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  },

  selectWord: function (e) {
    const word = e.currentTarget.dataset.word
    
    const shuffledIndex = this.data.shuffledWords.indexOf(word)
    if (shuffledIndex !== -1) {
      const newShuffled = this.data.shuffledWords.filter((_, idx) => idx !== shuffledIndex)
      this.setData({
        shuffledWords: newShuffled,
        selectedWords: [...this.data.selectedWords, word]
      })
    }
  },

  removeWord: function (e) {
    const index = e.currentTarget.dataset.index
    const word = this.data.selectedWords[index]
    
    this.setData({
      selectedWords: this.data.selectedWords.filter((_, idx) => idx !== index),
      shuffledWords: [...this.data.shuffledWords, word]
    })
  },

  submitAnswer: function () {
    const currentLevel = this.data.levels[this.data.currentLevel]
    const isCorrect = JSON.stringify(this.data.selectedWords) === JSON.stringify(currentLevel.answer)
    
    this.setData({
      showResult: true,
      isCorrect,
      correctAnswer: currentLevel.answer.join(' ')
    })

    if (isCorrect) {
      const newScore = this.data.score + 50 + (Math.max(0, 30 - this.data.time))
      this.setData({ score: newScore })
    }
  },

  nextLevel: function () {
    if (this.data.currentLevel >= this.data.levels.length - 1) {
      this.endGame(true)
      return
    }

    const nextLevel = this.data.levels[this.data.currentLevel + 1]
    this.setData({
      currentLevel: this.data.currentLevel + 1,
      shuffledWords: this.shuffleArray([...nextLevel.words]),
      selectedWords: [],
      showResult: false,
      time: 0,
      currentHint: nextLevel.hint,
      correctAnswer: ''
    })
  },

  endGame: function (win) {
    clearInterval(this.timer)
    this.setData({
      isPlaying: false,
      gameOver: true,
      win
    })
  },

  restart: function () {
    clearInterval(this.timer)
    this.initGame()
    this.startTimer()
  },

  goBack: function () {
    wx.navigateBack()
  },

  formatTime: function (seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
})