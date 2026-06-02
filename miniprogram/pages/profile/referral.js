Page({
  data: {
    referralLevel: { name: '白银', rate: 15 },
    referralCount: 5,
    totalEarnings: '¥128.00',
    teamCount: 23,
    inviteCode: 'YOUDAO2024',
    levels: [
      { name: '基础', min: 0, rate: 10 },
      { name: '青铜', min: 10, rate: 12 },
      { name: '白银', min: 50, rate: 15 },
      { name: '黄金', min: 100, rate: 18 },
      { name: '铂金', min: 300, rate: 22 },
      { name: '钻石', min: 500, rate: 30 },
      { name: '王者', min: 1000, rate: 50 }
    ]
  },

  copyCode: function () {
    wx.setClipboardData({
      data: this.data.inviteCode,
      success: () => {
        wx.showToast({ title: '已复制', icon: 'success' })
      }
    })
  },

  shareToFriend: function () {
    wx.showToast({ title: '分享给好友', icon: 'none' })
  },

  shareToGroup: function () {
    wx.showToast({ title: '分享到群聊', icon: 'none' })
  },

  shareToQr: function () {
    wx.showToast({ title: '生成海报', icon: 'none' })
  }
})
