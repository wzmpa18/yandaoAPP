Page({
  data: {
    currentCity: '北京',
    recommendList: [
      { userId: 1, nickname: '日语达人', targetLang: '日语', description: '正在学习日语N2，希望找语伴一起练习口语', tags: ['日语', '口语', 'N2'] },
      { userId: 2, nickname: '英语爱好者', targetLang: '英语', description: '喜欢看美剧，想提高听力和口语', tags: ['英语', '美剧', '听力'] },
      { userId: 3, nickname: '韩语学习者', targetLang: '韩语', description: 'K-pop粉丝，想学韩语追星', tags: ['韩语', 'K-pop', '入门'] },
      { userId: 4, nickname: '法语初学者', targetLang: '法语', description: '计划去法国留学，正在自学', tags: ['法语', '留学', 'A1'] },
      { userId: 5, nickname: '西语达人', targetLang: '西班牙语', description: '拉美文化爱好者，寻找语伴', tags: ['西语', '拉美', '交流'] }
    ],
    cityFriends: [
      { userId: 101, nickname: '小明同学', distance: '1.5km', description: '大学日语专业，周末可线下练习', followed: false },
      { userId: 102, nickname: '小红老师', distance: '3.2km', description: '英语教师，可免费辅导口语', followed: true },
      { userId: 103, nickname: '小李同学', distance: '5.8km', description: '韩语TOPIK备考中', followed: false },
      { userId: 104, nickname: '小张同学', distance: '7.3km', description: '法语入门，求带飞', followed: false }
    ]
  },

  changeCity: function () {
    wx.showActionSheet({
      itemList: ['北京', '上海', '广州', '深圳', '成都', '杭州'],
      success: (res) => {
        const cities = ['北京', '上海', '广州', '深圳', '成都', '杭州']
        this.setData({ currentCity: cities[res.tapIndex] })
      }
    })
  },

  goToSearch: function () {
    wx.navigateTo({ url: '/pages/friends/search' })
  },

  goToChat: function (e) {
    const user = e.currentTarget.dataset.user
    wx.navigateTo({ url: '/pages/friends/chat' })
  },

  goToCircle: function () {
    wx.navigateTo({ url: '/pages/study-circle/index' })
  }
})
