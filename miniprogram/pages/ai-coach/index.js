Page({
  data: {
    characters: [
      {
        id: 1,
        name: '熊猫老师',
        avatar: '🐼',
        description: '温柔耐心的老师，擅长用简单易懂的方式讲解知识点',
        tags: ['耐心', '专业', '温柔']
      },
      {
        id: 2,
        name: '毒舌傲娇',
        avatar: '😈',
        description: '表面毒舌内心善良，用激将法让你进步更快',
        tags: ['严格', '高效', '傲娇']
      },
      {
        id: 3,
        name: '搞笑朋友',
        avatar: '🤪',
        description: '幽默风趣的朋友，让学习变得轻松有趣',
        tags: ['幽默', '轻松', '活泼']
      },
      {
        id: 4,
        name: '甜蜜恋人',
        avatar: '💕',
        description: '温柔浪漫的恋人，用爱的鼓励陪伴你学习',
        tags: ['温柔', '鼓励', '浪漫']
      }
    ],
    selectedCharacter: null,
    messages: [],
    inputText: '',
    scrollTop: 0
  },

  selectCharacter: function (e) {
    const character = e.currentTarget.dataset.character
    this.setData({
      selectedCharacter: character,
      messages: [{
        id: 1,
        content: `你好！我是${character.name}，很高兴成为你的学习伙伴！今天想学点什么呢？`,
        isAI: true
      }],
      scrollTop: 10000
    })
  },

  onInput: function (e) {
    this.setData({ inputText: e.detail.value })
  },

  sendMessage: function () {
    if (!this.data.inputText.trim()) return

    const newMessages = [...this.data.messages, {
      id: Date.now(),
      content: this.data.inputText,
      isAI: false
    }]

    this.setData({
      messages: newMessages,
      inputText: '',
      scrollTop: 10000
    })

    setTimeout(() => {
      const replies = [
        '这个问题问得很好！让我来详细解释一下...',
        '你说得对！不过还有一个更地道的说法是...',
        '太棒了！你的进步很大！继续加油！',
        '让我用更简单的方式解释一下...',
        '很好的想法！我们一起来练习一下吧！',
        '这个知识点很重要，我来帮你巩固一下！',
        '你已经掌握得很好了！我们来做个小练习吧！',
        '非常棒！你理解得很透彻！'
      ]

      const aiReply = {
        id: Date.now() + 1,
        content: replies[Math.floor(Math.random() * replies.length)],
        isAI: true
      }

      this.setData({
        messages: [...this.data.messages, aiReply],
        scrollTop: 10000
      })
    }, 1000)
  }
})
