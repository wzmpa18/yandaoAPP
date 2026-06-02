Page({
  data: {
    messages: [
      { id: 1, content: '你好！我正在学习日语，想找个语伴一起练习', isMe: false },
      { id: 2, content: '你好！我也在学日语，目前在准备N2考试', isMe: true },
      { id: 3, content: '太好了！那我们可以一起练习口语', isMe: false },
      { id: 4, content: '好的，什么时候方便呢？', isMe: true },
      { id: 5, content: '周末都可以，平时晚上也有时间', isMe: false }
    ],
    inputText: '',
    scrollTop: 0
  },

  goBack: function () {
    wx.navigateBack()
  },

  onInput: function (e) {
    this.setData({ inputText: e.detail.value })
  },

  sendMessage: function () {
    if (!this.data.inputText.trim()) return

    const newMessages = [...this.data.messages, {
      id: Date.now(),
      content: this.data.inputText,
      isMe: true
    }]

    this.setData({
      messages: newMessages,
      inputText: '',
      scrollTop: 10000
    })
  }
})
