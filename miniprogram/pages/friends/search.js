Page({
  data: {
    keyword: '',
    results: [
      { userId: 1, nickname: '日语达人', targetLang: '日语', description: 'N2备考中，寻找语伴练习口语' },
      { userId: 2, nickname: '日语学习中', targetLang: '日语', description: '初学者，希望有人带带' },
      { userId: 3, nickname: '日本留学生', targetLang: '日语', description: '东京留学中，可视频练习' }
    ]
  },

  onSearchInput: function (e) {
    this.setData({ keyword: e.detail.value })
  },

  clearSearch: function () {
    this.setData({ keyword: '' })
  },

  toggleFilter: function (e) {
    const filter = e.currentTarget.dataset.filter
    wx.showToast({ title: filter === 'lang' ? '选择语言' : '选择城市', icon: 'none' })
  },

  goToChat: function () {
    wx.navigateTo({ url: '/pages/friends/chat' })
  }
})
