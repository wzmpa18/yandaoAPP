const app = getApp()

Page({
  data: {
    userInfo: {},
    studyGold: 0,
    todayProgress: 0,
    studyMinutes: 0,
    totalWords: 0,
    todayRecommend: [],
    tasks: [
      { id: 1, icon: '📚', name: '学习10个单词', reward: '+20学习金', target: 'word-hunter', completed: false },
      { id: 2, icon: '🎮', name: '完成1局游戏', reward: '+30学习金', target: 'grammar-planet', completed: false },
      { id: 3, icon: '🤖', name: 'AI对话练习', reward: '+50学习金', target: 'ai-coach', completed: false },
      { id: 4, icon: '✍️', name: 'AI写作批改', reward: '+40学习金', target: 'ai-writing', completed: false },
      { id: 5, icon: '📖', name: '阅读一篇文章', reward: '+25学习金', target: 'ai-reading', completed: false }
    ],
    recentAchievements: [
      { id: 1, icon: '🎯', name: '学习启程', desc: '完成首次学习', unlocked: false },
      { id: 2, icon: '🔥', name: '百题达人', desc: '累计完成100题', unlocked: false },
      { id: 3, icon: '💪', name: '一周坚持', desc: '连续学习7天', unlocked: false },
      { id: 4, icon: '🌟', name: '游戏高手', desc: '游戏得分超1000', unlocked: false },
      { id: 5, icon: '🤖', name: 'AI伙伴', desc: '完成10次AI对话', unlocked: false },
      { id: 6, icon: '✍️', name: '写作新星', desc: '批改5篇文章', unlocked: false }
    ]
  },

  onLoad: function () {
    this.refreshData()
  },

  onShow: function () {
    this.refreshData()
  },

  refreshData: function () {
    const userInfo = app.globalData.userInfo
    const todayCompleted = wx.getStorageSync('todayTasksCompleted') || []
    const todayProgress = wx.getStorageSync('todayProgress') || app.globalData.todayProgress || 0
    const studyMinutes = wx.getStorageSync('studyMinutes') || app.globalData.studyMinutes || 0

    // 更新任务完成状态
    const tasks = this.data.tasks.map(t => ({
      ...t,
      completed: todayCompleted.includes(t.id)
    }))

    // 更新成就解锁状态
    const achievements = this.data.recentAchievements.map(a => {
      let unlocked = false
      if (a.id === 1) unlocked = (userInfo.studyDays || 0) >= 1
      if (a.id === 2) unlocked = (app.globalData.totalTasksCompleted || 0) >= 10
      if (a.id === 3) unlocked = (userInfo.studyDays || 0) >= 7
      if (a.id === 4) {
        const scores = app.globalData.gameScores || {}
        unlocked = Object.values(scores).some(s => (s.score || 0) >= 1000)
      }
      return { ...a, unlocked }
    })

    this.setData({
      userInfo: userInfo,
      studyGold: app.globalData.studyGold || 0,
      todayProgress: todayProgress,
      studyMinutes: studyMinutes,
      totalWords: userInfo.totalWords || 0,
      todayRecommend: this.generateRecommend(),
      tasks: tasks,
      recentAchievements: achievements
    })
  },

  generateRecommend: function () {
    const userLang = app.globalData.userInfo.targetLang || 'ja'
    const langNames = { ja: '日语', en: '英语', ko: '韩语', fr: '法语', es: '西班牙语', de: '德语', it: '意大利语', pt: '葡萄牙语', ar: '阿拉伯语', zh: '中文' }
    const sameLangLearners = [
      { userId: 'rec_1', nickname: '语言达人', targetLang: langNames[userLang] || '日语', avatar: '', level: 5 },
      { userId: 'rec_2', nickname: '学习狂人', targetLang: langNames[userLang] || '日语', avatar: '', level: 3 },
      { userId: 'rec_3', nickname: '进步之星', targetLang: langNames[userLang] || '日语', avatar: '', level: 2 },
      { userId: 'rec_4', nickname: '词汇大师', targetLang: langNames[userLang] || '日语', avatar: '', level: 4 },
      { userId: 'rec_5', nickname: '口语达人', targetLang: langNames[userLang] || '日语', avatar: '', level: 3 }
    ]
    return sameLangLearners
  },

  completeTask: function (e) {
    const taskId = e.currentTarget.dataset.taskId
    const task = this.data.tasks.find(t => t.id === taskId)
    if (!task || task.completed) return

    // 标记完成
    app.completeTask(taskId)

    // 奖励学习金
    const goldMatch = task.reward.match(/\d+/)
    const gold = goldMatch ? parseInt(goldMatch[0]) : 0
    app.addStudyGold(gold)
    app.addExp(gold * 2)

    wx.showToast({ title: `+${gold}学习金`, icon: 'success' })
    this.refreshData()
  },

  goToTask: function (e) {
    const target = e.currentTarget.dataset.target
    const pageMap = {
      'word-hunter': '/pages/games/word-hunter',
      'grammar-planet': '/pages/games/grammar-planet',
      'ai-coach': '/pages/ai-coach/index',
      'ai-writing': '/pages/ai-writing/index',
      'ai-reading': '/pages/ai-reading/index'
    }
    const url = pageMap[target]
    if (url) {
      wx.navigateTo({ url })
    }
  },

  goToAI: function () {
    wx.navigateTo({ url: '/pages/ai-coach/index' })
  },

  goToWriting: function () {
    wx.navigateTo({ url: '/pages/ai-writing/index' })
  },

  goToReading: function () {
    wx.navigateTo({ url: '/pages/ai-reading/index' })
  },

  goToGames: function () {
    wx.switchTab({ url: '/pages/games/index' })
  },

  goToFriends: function () {
    wx.switchTab({ url: '/pages/friends/index' })
  },

  goToCircle: function () {
    wx.navigateTo({ url: '/pages/study-circle/index' })
  },

  goToNewFeatures: function () {
    wx.navigateTo({ url: '/pages/new-features/index' })
  },

  goToChat: function (e) {
    const user = e.currentTarget.dataset.user
    if (user) {
      wx.setStorageSync('chatTarget', user)
    }
    wx.navigateTo({ url: '/pages/friends/chat' })
  },

  goToAchievements: function () {
    wx.navigateTo({ url: '/pages/achievements/index' })
  },

  goToDashboard: function () {
    wx.navigateTo({ url: '/pages/learning-dashboard/index' })
  }
})
