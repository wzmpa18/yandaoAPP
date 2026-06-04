App({
  onLaunch: function () {
    this.initUserInfo()
    this.initLocation()
    this.initGameScores()
  },

  initUserInfo: function () {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.globalData.userInfo = userInfo
      // 计算今日进度
      this.calcTodayProgress()
    } else {
      this.globalData.userInfo = {
        userId: 'user_' + Date.now(),
        nickname: '学习者',
        avatar: '',
        level: 1,
        exp: 0,
        targetLang: 'ja',
        studyDays: 1,
        totalWords: 0,
        isMinor: false,
        chatEnabled: false,
        city: ''
      }
      wx.setStorageSync('userInfo', this.globalData.userInfo)
    }
    // 恢复全局数据
    this.globalData.studyGold = wx.getStorageSync('studyGold') || 0
    this.globalData.referralCount = wx.getStorageSync('referralCount') || 0
    this.globalData.achievements = wx.getStorageSync('achievements') || []
    this.globalData.studyMinutes = wx.getStorageSync('studyMinutes') || 0
    this.globalData.totalTasksCompleted = wx.getStorageSync('totalTasksCompleted') || 0
  },

  calcTodayProgress: function () {
    // 基于完成任务计算今日进度
    const completed = wx.getStorageSync('todayTasksCompleted') || []
    const total = 5
    const pct = Math.min(100, Math.round((completed.length / total) * 100))
    this.globalData.todayProgress = pct
    wx.setStorageSync('todayProgress', pct)
  },

  initLocation: function () {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation']) {
          this.getLocation()
        }
      }
    })
  },

  getLocation: function () {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.globalData.location = {
          latitude: res.latitude,
          longitude: res.longitude
        }
        this.getCityName(res.latitude, res.longitude)
      },
      fail: (err) => {
        console.log('获取位置失败:', err)
      }
    })
  },

  getCityName: function (lat, lng) {
    wx.request({
      // 使用安全的腾讯地图 key
      url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${lat},${lng}&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77`,
      timeout: 5000,
      success: (res) => {
        if (res.data && res.data.result) {
          const city = res.data.result.address_component.city
          if (city) {
            this.globalData.userInfo.city = city.replace('市', '')
            wx.setStorageSync('userInfo', this.globalData.userInfo)
          }
        }
      },
      fail: (err) => {
        console.log('获取城市名称失败:', err)
      }
    })
  },

  initGameScores: function () {
    this.globalData.gameScores = wx.getStorageSync('gameScores') || {
      wordHunter: { best: '--', score: 0 },
      grammarPlanet: { best: '--', score: 0 },
      escapeRoom: { best: '--', score: 0 },
      sentenceBuild: { best: '--', score: 0 }
    }
  },

  addStudyGold: function (amount) {
    this.globalData.studyGold = (this.globalData.studyGold || 0) + amount
    wx.setStorageSync('studyGold', this.globalData.studyGold)
  },

  addExp: function (amount) {
    const userInfo = this.globalData.userInfo
    userInfo.exp = (userInfo.exp || 0) + amount
    // 升级判断：每1000经验升1级
    const newLevel = Math.floor(userInfo.exp / 1000) + 1
    if (newLevel > userInfo.level) {
      userInfo.level = newLevel
      wx.showToast({ title: `升级了！Lv.${newLevel}`, icon: 'success' })
    }
    wx.setStorageSync('userInfo', userInfo)
  },

  completeTask: function (taskId) {
    const completed = wx.getStorageSync('todayTasksCompleted') || []
    if (!completed.includes(taskId)) {
      completed.push(taskId)
      wx.setStorageSync('todayTasksCompleted', completed)
      this.globalData.totalTasksCompleted = (this.globalData.totalTasksCompleted || 0) + 1
      wx.setStorageSync('totalTasksCompleted', this.globalData.totalTasksCompleted)
      this.calcTodayProgress()
    }
  },

  saveGameScore: function (game, score, best) {
    const scores = this.globalData.gameScores
    if (score > scores[game].score) {
      scores[game].score = score
    }
    scores[game].best = best
    this.globalData.gameScores = scores
    wx.setStorageSync('gameScores', scores)
  },

  addStudyMinutes: function (minutes) {
    this.globalData.studyMinutes = (this.globalData.studyMinutes || 0) + minutes
    wx.setStorageSync('studyMinutes', this.globalData.studyMinutes)
    // 每天连续学习
    const userInfo = this.globalData.userInfo
    const today = new Date().toDateString()
    const lastStudy = wx.getStorageSync('lastStudyDate')
    if (lastStudy !== today) {
      userInfo.studyDays = (userInfo.studyDays || 0) + 1
      wx.setStorageSync('lastStudyDate', today)
      wx.setStorageSync('userInfo', userInfo)
    }
  },

  globalData: {
    userInfo: null,
    location: null,
    studyGold: 0,
    referralCount: 0,
    referralLevel: '基础',
    achievements: [],
    todayRecommend: [],
    gameScores: {},
    studyMinutes: 0,
    totalTasksCompleted: 0,
    todayProgress: 0
  },

  getReferralLevel: function (count) {
    const levels = [
      { name: '基础', min: 0, rate: 10 },
      { name: '青铜', min: 10, rate: 12 },
      { name: '白银', min: 50, rate: 15 },
      { name: '黄金', min: 100, rate: 18 },
      { name: '铂金', min: 300, rate: 22 },
      { name: '钻石', min: 500, rate: 30 },
      { name: '王者', min: 1000, rate: 50 }
    ]
    for (let i = levels.length - 1; i >= 0; i--) {
      if (count >= levels[i].min) {
        return levels[i]
      }
    }
    return levels[0]
  }
})
