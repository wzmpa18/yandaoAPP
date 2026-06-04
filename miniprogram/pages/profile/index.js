const app = getApp()

Page({
  data: {
    userInfo: {},
    studyGold: 0,
    referralCount: 0,
    achievementsCount: 0,
    referralLevel: { name: '基础', rate: 10 },
    referralProgress: 0,
    referralNextCount: 0,
    studyStats: {
      totalDays: 0,
      totalMinutes: 0,
      totalWords: 0,
      totalSessions: 0
    }
  },

  onLoad: function () {
    this.refreshData()
  },

  onShow: function () {
    this.refreshData()
  },

  refreshData: function () {
    const userInfo = app.globalData.userInfo
    const referralLevel = app.getReferralLevel(app.globalData.referralCount || 0)
    const achievements = app.globalData.achievements || []
    const gameScores = app.globalData.gameScores || {}

    // 统计学习数据
    const totalWords = userInfo.totalWords || 0
    const totalMinutes = wx.getStorageSync('studyMinutes') || app.globalData.studyMinutes || 0
    const totalSessions = wx.getStorageSync('aiSessionCount') || 0

    // 成就计数
    let unlockedCount = 0
    if ((userInfo.studyDays || 0) >= 1) unlockedCount++
    if ((app.globalData.totalTasksCompleted || 0) >= 10) unlockedCount++
    if ((userInfo.studyDays || 0) >= 7) unlockedCount++
    if (Object.values(gameScores).some(s => (s.score || 0) >= 1000)) unlockedCount++
    if (totalSessions >= 10) unlockedCount++

    this.setData({
      userInfo: userInfo,
      studyGold: app.globalData.studyGold || 0,
      referralCount: app.globalData.referralCount || 0,
      achievementsCount: unlockedCount,
      referralLevel: referralLevel,
      studyStats: {
        totalDays: userInfo.studyDays || 0,
        totalMinutes: totalMinutes,
        totalWords: totalWords,
        totalSessions: totalSessions
      }
    })
    this.calculateProgress()
  },

  calculateProgress: function () {
    const levels = [0, 10, 50, 100, 300, 500, 1000]
    const count = this.data.referralCount
    
    for (let i = levels.length - 1; i >= 0; i--) {
      if (count >= levels[i]) {
        if (i < levels.length - 1) {
          const current = levels[i]
          const next = levels[i + 1]
          this.setData({
            referralProgress: Math.round(((count - current) / (next - current)) * 100),
            referralNextCount: next - count
          })
        } else {
          this.setData({
            referralProgress: 100,
            referralNextCount: 0
          })
        }
        break
      }
    }
  },

  editProfile: function () {
    wx.showModal({
      title: '编辑资料',
      editable: true,
      placeholderText: '输入新的昵称',
      success: (res) => {
        if (res.confirm && res.content) {
          const userInfo = app.globalData.userInfo
          userInfo.nickname = res.content
          wx.setStorageSync('userInfo', userInfo)
          this.setData({ userInfo })
          wx.showToast({ title: '昵称已更新', icon: 'success' })
        }
      }
    })
  },

  goToReferral: function () {
    wx.navigateTo({ url: '/pages/profile/referral' })
  },

  goToAchievements: function () {
    wx.navigateTo({ url: '/pages/achievements/index' })
  },

  goToDashboard: function () {
    wx.navigateTo({ url: '/pages/learning-dashboard/index' })
  },

  goToFriends: function () {
    wx.switchTab({ url: '/pages/friends/index' })
  },

  goToChatSettings: function () {
    wx.showModal({
      title: '聊天设置',
      content: '管理聊天通知、隐私等设置',
      showCancel: true,
      confirmText: '进入设置',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({ title: '功能开发中', icon: 'none' })
        }
      }
    })
  },

  goToPrivacy: function () {
    wx.showModal({
      title: '隐私设置',
      content: '管理你的隐私偏好',
      showCancel: true,
      confirmText: '进入设置',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({ title: '功能开发中', icon: 'none' })
        }
      }
    })
  },

  goToReport: function () {
    wx.navigateTo({ url: '/pages/report/index' })
  },

  goToPrivacyPage: function () {
    wx.navigateTo({ url: '/pages/privacy/index' })
  },

  goToTerms: function () {
    wx.navigateTo({ url: '/pages/agreements/terms' })
  },

  goToHelp: function () {
    wx.showModal({
      title: '帮助中心',
      content: '常见问题：\n1. 如何切换学习语言？\n2. 如何获得更多学习金？\n3. 游戏分数怎么算？\n\n更多帮助请访问 yandao.vip',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  clearCache: function () {
    wx.showModal({
      title: '清除缓存',
      content: '将清除所有本地数据（不会影响账户数据）',
      success: (res) => {
        if (res.confirm) {
          const keepKeys = ['userInfo', 'studyGold']
          const allKeys = wx.getStorageInfoSync().keys
          allKeys.forEach(key => {
            if (!keepKeys.includes(key)) {
              wx.removeStorageSync(key)
            }
          })
          wx.showToast({ title: '缓存已清除', icon: 'success' })
          this.refreshData()
        }
      }
    })
  },

  logout: function () {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？退出后需要重新设置学习偏好。',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync()
          app.globalData.userInfo = null
          app.globalData.studyGold = 0
          app.globalData.referralCount = 0
          wx.reLaunch({ url: '/pages/index/index' })
        }
      }
    })
  }
})
