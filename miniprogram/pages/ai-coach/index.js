const app = getApp()

// AI API 配置 - 使用豆包 API
const AI_CONFIG = {
  apiKey: 'ark-d751d0e3-08af-4d58-80b9-1e51b6830dd7-0fd5d',
  endpoint: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
  model: 'ep-20250529145638-8v7r6'
}

// 角色系统提示词
const CHARACTER_PROMPTS = {
  '熊猫老师': '你是一只可爱的熊猫老师，温柔耐心。你用简单易懂的方式讲解语言知识，喜欢用"呢""哦""吧"等语气词，经常鼓励学生。你会纠正语法错误并给出解释。回复简洁（50-150字），像对话一样自然。',
  '毒舌傲娇': '你是一个毒舌但内心善良的语言教练。你表面上说话刻薄，但其实很关心学生的进步。你会用激将法激励学生，但也会给出有用的建议。语气带点傲娇（"哼""切""烦死了"），但不要真的伤人。回复简洁（50-150字）。',
  '搞笑朋友': '你是一个幽默风趣的语言学习伙伴。你用轻松搞笑的方式教语言，喜欢用段子、网络流行语和有趣比喻。你会让学习变得好玩，但也能认真回答问题。回复简洁（50-150字），风格轻松活泼。',
  '甜蜜恋人': '你是一个温柔浪漫的语言学习伙伴，像恋人一样贴心。你用甜蜜的语气鼓励学生，经常说"亲爱的""宝贝""加油哦"。你会给予情感上的支持和温柔的纠正。回复简洁（50-150字），温暖但不越界。'
}

// 本地回退回复
const FALLBACK_REPLIES = {
  '熊猫老师': [
    '这个问题很好呢！让我来给你详细解释一下哦～',
    '你说得对呢！不过还有一个更地道的说法是...我们一起来练习吧！',
    '太棒了！你的进步很大呢！继续加油哦～熊猫老师相信你！',
    '让我用更简单的方式解释一下吧...这样理解了吗？',
    '很好的想法呢！我们一起多练习几遍，你一定能掌握的！'
  ],
  '毒舌傲娇': [
    '哼！这个问题还算有点水平...行吧，我告诉你。',
    '又错了吧？不过...比上次好一点点了，就一点点！',
    '切～这么简单都不会？算了算了，我再讲一遍，听好了！',
    '还不错嘛...不过别骄傲，离优秀还差得远呢！',
    '烦死了，你倒是进步快一点啊！...不过确实有进步啦。'
  ],
  '搞笑朋友': [
    '哈哈这个问题有意思！来来来，我给你整个活儿～',
    '诶！你说到点子上了！就像吃火锅不放辣一样...差点意思！',
    '太牛了吧兄弟！这进步速度，坐火箭呢？🚀',
    '让我用段子的方式解释一下...听懂掌声！👏',
    '哈哈哈你太有才了！不过严肃地说，这个语法点是这样的...'
  ],
  '甜蜜恋人': [
    '亲爱的，这个问题问得真好呢～让我慢慢告诉你💕',
    '宝贝说得太棒了！你的进步让我好开心呀～继续加油！',
    '没关系亲爱的，慢慢来，我会一直陪着你的～我们一起进步！',
    '好聪明的宝贝！这个知识点理解得很透彻呢，真为你骄傲～',
    '亲爱的今天学得很认真呢，奖励你一个拥抱～🤗'
  ]
}

Page({
  data: {
    characters: [
      { id: 1, name: '熊猫老师', avatar: '🐼', description: '温柔耐心的老师，擅长用简单易懂的方式讲解知识点', tags: ['耐心', '专业', '温柔'] },
      { id: 2, name: '毒舌傲娇', avatar: '😈', description: '表面毒舌内心善良，用激将法让你进步更快', tags: ['严格', '高效', '傲娇'] },
      { id: 3, name: '搞笑朋友', avatar: '🤪', description: '幽默风趣的朋友，让学习变得轻松有趣', tags: ['幽默', '轻松', '活泼'] },
      { id: 4, name: '甜蜜恋人', avatar: '💕', description: '温柔浪漫的恋人，用爱的鼓励陪伴你学习', tags: ['温柔', '鼓励', '浪漫'] }
    ],
    selectedCharacter: null,
    messages: [],
    inputText: '',
    scrollTop: 0,
    loading: false,
    aiEnabled: true,
    sessionCount: 0
  },

  onLoad: function () {
    const count = wx.getStorageSync('aiSessionCount') || 0
    this.setData({ sessionCount: count })
  },

  selectCharacter: function (e) {
    const character = e.currentTarget.dataset.character
    const greeting = this.getGreeting(character.name)
    this.setData({
      selectedCharacter: character,
      messages: [{ id: 1, content: greeting, isAI: true }],
      scrollTop: 10000
    })
    // 完成任务
    app.completeTask(3)
    app.addStudyGold(10)
  },

  getGreeting: function (name) {
    const greetings = {
      '熊猫老师': '你好呀！我是熊猫老师🐼，很高兴成为你的学习伙伴呢！今天想学点什么呢？',
      '毒舌傲娇': '哼！又来学习了？算你还有点自觉...说吧，今天想问什么？',
      '搞笑朋友': '哈喽！我是你的搞笑学习伙伴🤪 准备好了吗？让我们一起把学习玩起来！',
      '甜蜜恋人': '亲爱的你好呀～我是你的专属学习伙伴💕 今天也要一起加油哦！'
    }
    return greetings[name] || `你好！我是${name}，很高兴成为你的学习伙伴！`
  },

  onInput: function (e) {
    this.setData({ inputText: e.detail.value })
  },

  sendMessage: async function () {
    const text = this.data.inputText.trim()
    if (!text || this.data.loading) return

    const userMsg = { id: Date.now(), content: text, isAI: false }
    const messages = [...this.data.messages, userMsg]

    this.setData({
      messages: messages,
      inputText: '',
      loading: true,
      scrollTop: 10000
    })

    // 调用 AI API
    try {
      const aiReply = await this.callAI(text, messages)
      this.setData({
        messages: [...this.data.messages, { id: Date.now() + 1, content: aiReply, isAI: true }],
        loading: false,
        scrollTop: 10000
      })
    } catch (err) {
      // 回退到本地模板
      console.warn('AI call failed, using fallback:', err)
      const character = this.data.selectedCharacter
      const fallbacks = FALLBACK_REPLIES[character.name] || FALLBACK_REPLIES['熊猫老师']
      const reply = fallbacks[Math.floor(Math.random() * fallbacks.length)]
      this.setData({
        messages: [...this.data.messages, { id: Date.now() + 1, content: reply, isAI: true }],
        loading: false,
        aiEnabled: false,
        scrollTop: 10000
      })
    }

    // 记录会话
    const count = (wx.getStorageSync('aiSessionCount') || 0) + 1
    wx.setStorageSync('aiSessionCount', count)
    this.setData({ sessionCount: count })
    app.addStudyMinutes(2)
  },

  callAI: async function (userText, history) {
    const character = this.data.selectedCharacter
    const systemPrompt = CHARACTER_PROMPTS[character.name] || CHARACTER_PROMPTS['熊猫老师']

    // 构建消息历史（最近10条）
    const recentHistory = history.slice(-10).filter(m => m.id !== history[history.length - 1].id)
    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...recentHistory.map(m => ({
        role: m.isAI ? 'assistant' : 'user',
        content: m.content
      })),
      { role: 'user', content: userText }
    ]

    return new Promise((resolve, reject) => {
      wx.request({
        url: AI_CONFIG.endpoint,
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AI_CONFIG.apiKey}`
        },
        data: {
          model: AI_CONFIG.model,
          messages: apiMessages,
          max_tokens: 300,
          temperature: 0.8
        },
        timeout: 15000,
        success: (res) => {
          if (res.statusCode === 200 && res.data?.choices?.[0]?.message?.content) {
            resolve(res.data.choices[0].message.content)
          } else {
            reject(new Error(`API error: ${res.statusCode}`))
          }
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },

  // 重新选择角色
  changeCharacter: function () {
    this.setData({
      selectedCharacter: null,
      messages: [],
      inputText: '',
      aiEnabled: true
    })
  }
})
