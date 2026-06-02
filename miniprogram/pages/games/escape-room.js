Page({
  data: {
    currentRoom: 0,
    score: 0,
    time: 0,
    isPlaying: false,
    gameOver: false,
    rooms: [],
    collectedItems: [],
    collectedItemsJoin: '',
    currentPuzzle: null,
    showPuzzle: false,
    showHint: false,
    hintText: '',
    currentRoomName: '',
    currentQuestion: '',
    puzzleOptions: [],
    optionLetters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  },

  onLoad: function () {
    this.initGame()
    this.startTimer()
  },

  initGame: function () {
    const rooms = [
      {
        id: 1,
        name: '词汇密室',
        icon: '📚',
        background: '#667eea',
        puzzle: {
          type: 'word',
          question: '找出隐藏的单词：_ A T',
          options: ['C', 'B', 'H', 'R'],
          answer: 0,
          answerText: 'CAT',
          hint: '这是一种常见的宠物'
        },
        unlocked: false
      },
      {
        id: 2,
        name: '语法迷宫',
        icon: '🧩',
        background: '#f093fb',
        puzzle: {
          type: 'grammar',
          question: '选择正确的动词形式：He ___ to school.',
          options: ['go', 'goes', 'going', 'went'],
          answer: 1,
          answerText: 'goes',
          hint: '第三人称单数'
        },
        unlocked: false
      },
      {
        id: 3,
        name: '翻译走廊',
        icon: '🌍',
        background: '#4ade80',
        puzzle: {
          type: 'translate',
          question: '"Hello" 的日语翻译是？',
          options: ['こんにちは', 'ありがとう', 'さようなら', 'はい'],
          answer: 0,
          answerText: 'こんにちは',
          hint: '最常用的问候语'
        },
        unlocked: false
      },
      {
        id: 4,
        name: '听力暗室',
        icon: '🎧',
        background: '#fbbf24',
        puzzle: {
          type: 'listening',
          question: '选择听到的单词：[发音] Apple',
          options: ['Apple', 'Banana', 'Orange', 'Grape'],
          answer: 0,
          answerText: 'Apple',
          hint: '苹果的英文'
        },
        unlocked: false
      },
      {
        id: 5,
        name: '写作密室',
        icon: '✍️',
        background: '#f87171',
        puzzle: {
          type: 'writing',
          question: '填入正确的介词：I am good ___ math.',
          options: ['at', 'in', 'on', 'with'],
          answer: 0,
          answerText: 'at',
          hint: '擅长做某事'
        },
        unlocked: false
      },
      {
        id: 6,
        name: '终极Boss',
        icon: '👑',
        background: '#a855f7',
        puzzle: {
          type: 'final',
          question: '综合题：选出正确的句子',
          options: [
            'She don\'t like coffee.',
            'She doesn\'t like coffee.',
            'She not like coffee.',
            'She no like coffee.'
          ],
          answer: 1,
          answerText: 'She doesn\'t like coffee.',
          hint: '第三人称单数否定形式'
        },
        unlocked: false
      }
    ]

    this.setData({
      rooms,
      currentRoom: 0,
      score: 0,
      time: 0,
      isPlaying: true,
      gameOver: false,
      collectedItems: [],
      collectedItemsJoin: '',
      currentPuzzle: null,
      showPuzzle: false,
      showHint: false,
      hintText: '',
      currentRoomName: '',
      currentQuestion: '',
      puzzleOptions: []
    })
  },

  startTimer: function () {
    this.timer = setInterval(() => {
      this.setData({ time: this.data.time + 1 })
    }, 1000)
  },

  enterRoom: function (e) {
    const index = e.currentTarget.dataset.index
    const room = this.data.rooms[index]
    
    if (index > 0 && !this.data.rooms[index - 1].unlocked) {
      wx.showToast({ title: '先解锁前一个房间', icon: 'none' })
      return
    }

    this.setData({
      currentRoom: index,
      currentPuzzle: room.puzzle,
      showPuzzle: true,
      currentRoomName: room.name,
      currentQuestion: room.puzzle.question,
      puzzleOptions: room.puzzle.options,
      showHint: false,
      hintText: ''
    })
  },

  selectAnswer: function (e) {
    const index = e.currentTarget.dataset.index
    const puzzle = this.data.currentPuzzle
    
    if (index === puzzle.answer) {
      const rooms = this.data.rooms
      rooms[this.data.currentRoom].unlocked = true
      const newCollectedItems = [...this.data.collectedItems, rooms[this.data.currentRoom].icon]
      
      this.setData({
        rooms,
        score: this.data.score + 100,
        showPuzzle: false,
        showHint: false,
        collectedItems: newCollectedItems,
        collectedItemsJoin: newCollectedItems.join(' ')
      })

      if (this.data.currentRoom >= this.data.rooms.length - 1) {
        this.endGame(true)
      } else {
        wx.showToast({ title: '🎉 解锁成功!', icon: 'none' })
      }
    } else {
      wx.showToast({ title: '❌ 答案错误', icon: 'none' })
    }
  },

  showHint: function () {
    this.setData({
      showHint: true,
      hintText: this.data.currentPuzzle.hint
    })
  },

  closePuzzle: function () {
    this.setData({
      showPuzzle: false,
      showHint: false
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