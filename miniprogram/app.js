App({
  onLaunch: function () {
    this.initUserInfo()
    this.initLocation()
  },

  initUserInfo: function () {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.globalData.userInfo = userInfo
    } else {
      this.globalData.userInfo = {
        userId: 'user_' + Date.now(),
        nickname: '学习者',
        avatar: '',
        level: 1,
        exp: 0,
        targetLang: 'ja',
        studyDays: 0,
        totalWords: 0,
        isMinor: false,
        chatEnabled: false,
        city: ''
      }
      wx.setStorageSync('userInfo', this.globalData.userInfo)
    }
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
      },
      complete: () => {
        console.log('获取城市名称请求完成')
      }
    })
  },

  globalData: {
    userInfo: null,
    location: null,
    studyGold: 0,
    referralCount: 0,
    referralLevel: '基础',
    achievements: [],
    todayRecommend: []
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
