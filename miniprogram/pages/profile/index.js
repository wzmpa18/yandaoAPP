const app = getApp()

Page({
  data: {
    userInfo: {},
    studyGold: 0,
    referralCount: 5,
    achievementsCount: 8,
    referralLevel: { name: '白银', rate: 15 },
    referralProgress: 60,
    referralNextCount: 45
  },

  onLoad: function () {
    this.setData({
      userInfo: app.globalData.userInfo,
      studyGold: app.globalData.studyGold,
      referralCount: app.globalData.referralCount,
      referralLevel: app.getReferralLevel(app.globalData.referralCount)
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
            referralProgress: ((count - current) / (next - current)) * 100,
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
    wx.showToast({ title: '编辑资料', icon: 'none' })
  },

  goToReferral: function () {
    wx.navigateTo({ url: '/pages/profile/referral' })
  },

  goToAchievements: function () {
    wx.navigateTo({ url: '/pages/achievements/index' })
  },

  goToFriends: function () {
    wx.switchTab({ url: '/pages/friends/index' })
  },

  goToChatSettings: function () {
    wx.showToast({ title: '聊天设置', icon: 'none' })
  },

  goToPrivacy: function () {
    wx.showToast({ title: '隐私设置', icon: 'none' })
  },

  goToReport: function () {
    wx.navigateTo({ url: '/pages/report/index' })
  },

  goToPrivacyPage: function () {
    wx.navigateTo({ url: '/pages/privacy/index' })
  },

  goToTerms: function () {
    wx.showToast({ title: '用户协议', icon: 'none' })
  },

  goToHelp: function () {
    wx.showToast({ title: '帮助中心', icon: 'none' })
  },

  logout: function () {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync()
          app.globalData.userInfo = null
          wx.showToast({ title: '已退出', icon: 'success' })
        }
      }
    })
  }
})
