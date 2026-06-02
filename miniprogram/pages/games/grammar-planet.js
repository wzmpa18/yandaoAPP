Page({
  data: {
    currentQuestion: 0,
    score: 0,
    stars: 0,
    questions: [],
    selectedAnswer: null,
    showResult: false,
    isCorrect: false,
    isPlaying: false,
    gameOver: false,
    lives: 3,
    optionLetters: ['A', 'B', 'C', 'D', 'E', 'F'],
    currentQuestionText: '',
    currentOptions: [],
    currentAnswer: 0,
    currentExplanation: '',
    lifeHearts: '',
    starArray: ['☆', '☆', '☆'],
    resultStars: '',
    correctCount: 0,
    progressPercent: 0
  },

  onLoad: function () {
    this.initGame()
  },

  initGame: function () {
    const questions = [
      {
        id: 1,
        question: 'She ___ to school every day.',
        options: ['go', 'goes', 'going', 'went'],
        answer: 1,
        explanation: '主语是第三人称单数 She，动词需要加 s/es'
      },
      {
        id: 2,
        question: 'I ___ breakfast at 7 AM yesterday.',
        options: ['eat', 'ate', 'eaten', 'eating'],
        answer: 1,
        explanation: 'yesterday 表示过去时间，要用过去式 ate'
      },
      {
        id: 3,
        question: 'The book ___ on the table.',
        options: ['is', 'are', 'am', 'be'],
        answer: 0,
        explanation: 'book 是单数名词，用 is'
      },
      {
        id: 4,
        question: 'They ___ been to Paris twice.',
        options: ['has', 'have', 'had', 'having'],
        answer: 1,
        explanation: 'They 是复数主语，用 have'
      },
      {
        id: 5,
        question: 'If I ___ rich, I would travel the world.',
        options: ['am', 'was', 'were', 'be'],
        answer: 2,
        explanation: '虚拟语气中，be 动词一律用 were'
      },
      {
        id: 6,
        question: 'He ___ his homework before dinner.',
        options: ['finish', 'finishes', 'finished', 'finishing'],
        answer: 2,
        explanation: '描述过去完成的动作，用过去式'
      },
      {
        id: 7,
        question: 'My sister ___ a doctor.',
        options: ['is', 'are', 'was', 'be'],
        answer: 0,
        explanation: 'sister 是单数，用 is'
      },
      {
        id: 8,
        question: 'We ___ TV when the phone rang.',
        options: ['watch', 'watched', 'were watching', 'are watching'],
        answer: 2,
        explanation: '过去进行时，表示过去某个时刻正在做的事'
      },
      {
        id: 9,
        question: 'This is the best movie I ___ ever seen.',
        options: ['have', 'has', 'had', 'am'],
        answer: 0,
        explanation: '现在完成时，主语是 I，用 have'
      },
      {
        id: 10,
        question: 'She asked me ___ I liked coffee.',
        options: ['if', 'that', 'what', 'which'],
        answer: 0,
        explanation: '间接引语中表示疑问用 if'
      }
    ]

    const firstQuestion = questions[0]
    this.setData({
      questions,
      currentQuestion: 0,
      score: 0,
      stars: 0,
      lives: 3,
      selectedAnswer: null,
      showResult: false,
      isPlaying: true,
      gameOver: false,
      currentQuestionText: firstQuestion.question,
      currentOptions: firstQuestion.options,
      currentAnswer: firstQuestion.answer,
      currentExplanation: firstQuestion.explanation,
      lifeHearts: this.getLifeHearts(3),
      starArray: this.getStarArray(0),
      correctCount: 0,
      progressPercent: 10
    })
  },

  getLifeHearts: function (lives) {
    let hearts = ''
    for (let i = 0; i < lives; i++) {
      hearts += '❤️'
    }
    for (let i = lives; i < 3; i++) {
      hearts += '🖤'
    }
    return hearts
  },

  getStarArray: function (stars) {
    const arr = []
    for (let i = 0; i < 3; i++) {
      arr.push(i < stars ? '★' : '☆')
    }
    return arr
  },

  selectAnswer: function (e) {
    if (this.data.showResult || !this.data.isPlaying) return
    
    const index = e.currentTarget.dataset.index
    this.setData({ selectedAnswer: index })
  },

  submitAnswer: function () {
    if (this.data.selectedAnswer === null) {
      wx.showToast({ title: '请选择答案', icon: 'none' })
      return
    }

    const question = this.data.questions[this.data.currentQuestion]
    const isCorrect = this.data.selectedAnswer === question.answer

    this.setData({
      showResult: true,
      isCorrect,
      currentExplanation: question.explanation
    })

    if (isCorrect) {
      const newScore = this.data.score + 10
      const newStars = Math.floor(newScore / 30)
      const newCorrectCount = this.data.correctCount + 1
      this.setData({
        score: newScore,
        stars: Math.min(newStars, 3),
        starArray: this.getStarArray(Math.min(newStars, 3)),
        correctCount: newCorrectCount
      })
    } else {
      const newLives = this.data.lives - 1
      this.setData({ 
        lives: newLives,
        lifeHearts: this.getLifeHearts(newLives)
      })
      
      if (newLives <= 0) {
        setTimeout(() => this.endGame(), 1500)
        return
      }
    }
  },

  nextQuestion: function () {
    if (this.data.currentQuestion >= this.data.questions.length - 1) {
      this.endGame()
      return
    }

    const nextQuestion = this.data.questions[this.data.currentQuestion + 1]
    this.setData({
      currentQuestion: this.data.currentQuestion + 1,
      selectedAnswer: null,
      showResult: false,
      currentQuestionText: nextQuestion.question,
      currentOptions: nextQuestion.options,
      currentAnswer: nextQuestion.answer,
      currentExplanation: nextQuestion.explanation,
      progressPercent: ((this.data.currentQuestion + 2) / this.data.questions.length) * 100
    })
  },

  endGame: function () {
    const stars = Math.min(Math.floor(this.data.score / 30), 3)
    let resultStars = ''
    for (let i = 0; i < stars; i++) {
      resultStars += '★'
    }
    for (let i = stars; i < 3; i++) {
      resultStars += '☆'
    }
    
    this.setData({
      isPlaying: false,
      gameOver: true,
      resultStars
    })
  },

  restart: function () {
    this.initGame()
  },

  goBack: function () {
    wx.navigateBack()
  }
})