const app = getApp()

Page({
  data: {
    userInfo: {},
    studyGold: 0,
    todayProgress: 35,
    studyMinutes: 23,
    todayRecommend: [],
    tasks: [
      { id: 1, icon: '📚', name: '学习10个单词', reward: '+20学习金', completed: false },
      { id: 2, icon: '🎮', name: '完成1局游戏', reward: '+30学习金', completed: true },
      { id: 3, icon: '🤖', name: 'AI对话练习', reward: '+50学习金', completed: false },
      { id: 4, icon: '👥', name: '添加1位语伴', reward: '+40学习金', completed: false },
      { id: 5, icon: '💬', name: '发布学习动态', reward: '+25学习金', completed: true }
    ],
    recentAchievements: [
      { id: 1, icon: '🎯', name: '学习启程' },
      { id: 2, icon: '🔥', name: '百题达人' },
      { id: 3, icon: '💪', name: '一周坚持' }
    ]
  },

  onLoad: function () {
    this.setData({
      userInfo: app.globalData.userInfo,
      studyGold: app.globalData.studyGold,
      todayRecommend: this.generateRecommend()
    })
  },

  generateRecommend: function () {
    const langs = ['日语学习者', '英语学习者', '韩语学习者', '法语学习者', '西班牙语学习者']
    const names = ['小明', '小红', '小李', '小张', '小王']
    return names.map((name, index) => ({
      userId: 'user_' + index,
      nickname: name,
      targetLang: langs[index],
      avatar: ''
    }))
  },

  goToAI: function () {
    wx.navigateTo({ url: '/pages/ai-coach/index' })
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
    wx.navigateTo({ url: '/pages/friends/chat' })
  },

  goToAchievements: function () {
    wx.navigateTo({ url: '/pages/achievements/index' })
  }
})
