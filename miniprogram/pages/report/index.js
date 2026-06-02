Page({
  data: {
    reportTypes: [
      { label: '侮辱/辱骂', value: 'abuse' },
      { label: '骚扰/广告', value: 'spam' },
      { label: '色情内容', value: 'porn' },
      { label: '虚假信息', value: 'fake' },
      { label: '其他', value: 'other' }
    ],
    selectedType: '',
    target: '',
    content: ''
  },

  selectType: function (e) {
    this.setData({ selectedType: e.currentTarget.dataset.type })
  },

  onTargetInput: function (e) {
    this.setData({ target: e.detail.value })
  },

  onContentInput: function (e) {
    this.setData({ content: e.detail.value })
  },

  submitReport: function () {
    if (!this.data.selectedType) {
      wx.showToast({ title: '请选择举报类型', icon: 'none' })
      return
    }
    if (!this.data.content.trim()) {
      wx.showToast({ title: '请填写详细描述', icon: 'none' })
      return
    }
    wx.showToast({ title: '举报已提交', icon: 'success' })
    setTimeout(() => {
      wx.navigateBack()
    }, 1500)
  }
})
