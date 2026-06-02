Page({
  data: {
    content: '',
    selectedTags: [],
    tags: [
      { code: 'ja', name: '🇯🇵 日语' },
      { code: 'en', name: '🇺🇸 英语' },
      { code: 'ko', name: '🇰🇷 韩语' },
      { code: 'fr', name: '🇫🇷 法语' },
      { code: 'es', name: '🇪🇸 西语' },
      { code: 'de', name: '🇩🇪 德语' },
      { code: 'it', name: '🇮🇹 意语' },
      { code: 'pt', name: '🇵🇹 葡语' }
    ]
  },

  onContentInput: function (e) {
    this.setData({ content: e.detail.value })
  },

  toggleTag: function (e) {
    const tag = e.currentTarget.dataset.tag
    const selectedTags = this.data.selectedTags
    if (selectedTags.includes(tag)) {
      this.setData({ selectedTags: selectedTags.filter(t => t !== tag) })
    } else {
      this.setData({ selectedTags: [...selectedTags, tag] })
    }
  },

  submitPost: function () {
    if (!this.data.content.trim()) {
      wx.showToast({ title: '请输入内容', icon: 'none' })
      return
    }
    wx.showToast({ title: '发布成功', icon: 'success' })
    setTimeout(() => {
      wx.navigateBack()
    }, 1500)
  }
})
