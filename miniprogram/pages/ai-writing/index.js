const app = getApp()

// AI API 配置
const AI_CONFIG = {
  apiKey: 'ark-d751d0e3-08af-4d58-80b9-1e51b6830dd7-0fd5d',
  endpoint: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
  model: 'ep-20250529145638-8v7r6'
}

// 多语言本地规则检查
const LOCAL_RULES = {
  en: function (text) {
    const errors = []
    // 主谓一致
    if (/\bI\s+is\b/i.test(text)) errors.push({ text: 'I is', message: '主谓不一致', suggestion: '应改为 "I am"', rule: '主谓一致' })
    if (/\b(he|she|it)\s+are\b/i.test(text)) errors.push({ text: text.match(/\b(he|she|it)\s+are\b/i)[0], message: '主谓不一致', suggestion: '应使用 "is"', rule: '主谓一致' })
    if (/\b(they|we|you)\s+is\b/i.test(text)) errors.push({ text: text.match(/\b(they|we|you)\s+is\b/i)[0], message: '主谓不一致', suggestion: '应使用 "are"', rule: '主谓一致' })
    // 冠词
    if (/\ba\s+[aeiou]/i.test(text)) errors.push({ text: text.match(/\ba\s+[aeiou]\w*/i)[0], message: '冠词错误', suggestion: '元音前应用 "an"', rule: '冠词' })
    // 双否定
    if (/\bdon't\s+no\b/i.test(text)) errors.push({ text: "don't no", message: '双否定', suggestion: '应为 "don\'t know"', rule: '词汇' })
    // 常见拼写
    if (/\bteh\b/i.test(text)) errors.push({ text: 'teh', message: '拼写错误', suggestion: '应为 "the"', rule: '拼写' })
    if (/\brecieve\b/i.test(text)) errors.push({ text: 'recieve', message: '拼写错误', suggestion: '应为 "receive" (i before e except after c)', rule: '拼写' })
    if (/\baccomodate\b/i.test(text)) errors.push({ text: 'accomodate', message: '拼写错误', suggestion: '应为 "accommodate"', rule: '拼写' })
    if (/\bseperate\b/i.test(text)) errors.push({ text: 'seperate', message: '拼写错误', suggestion: '应为 "separate"', rule: '拼写' })
    // 标点
    if (/[.!?]\s*[a-z]/.test(text) && text.length > 2) errors.push({ text: '', message: '标点符号', suggestion: '句首字母应大写', rule: '标点' })
    return errors
  },
  ja: function (text) {
    const errors = []
    if (text.includes('ですです')) errors.push({ text: 'ですです', message: '重复敬语', suggestion: '去掉重复的「です」', rule: '敬语' })
    if (text.includes('ますます')) errors.push({ text: 'ますます', message: '重复敬语', suggestion: '去掉重复的「ます」', rule: '敬语' })
    if (/[ぁ-ん]/.test(text) && !/[あ-ん]/.test(text) && text.length > 3) errors.push({ text: '', message: '全假名', suggestion: '适当使用汉字可提高可读性', rule: '表达' })
    return errors
  },
  fr: function (text) {
    const errors = []
    if (/\bje\s+suis\b/i.test(text) && text.includes('est')) errors.push({ text: '', message: '动词变位', suggestion: '检查动词人称变位一致性', rule: '动词变位' })
    if (/\ble\s+.*\b(es|ons|ez)\b/i.test(text)) errors.push({ text: '', message: '动词变位', suggestion: '主语和动词变位不匹配', rule: '动词变位' })
    return errors
  },
  es: function (text) {
    const errors = []
    if (/\byo\s+.*\b(amos|áis|an)\b/i.test(text)) errors.push({ text: '', message: '动词变位', suggestion: '主语"yo"与动词变位不匹配', rule: '动词变位' })
    return errors
  },
  de: function (text) {
    const errors = []
    if (/\bich\s+.*\b(st|t|en)\b/i.test(text)) errors.push({ text: '', message: '动词变位', suggestion: '主语"ich"与动词变位不匹配', rule: '动词变位' })
    return errors
  },
  ko: function (text) {
    const errors = []
    if (text.includes('습니다습니다')) errors.push({ text: '습니다습니다', message: '重复敬语结尾', suggestion: '去掉重复的「습니다」', rule: '敬语' })
    if (text.includes('입니다입니다')) errors.push({ text: '입니다입니다', message: '重复结尾', suggestion: '去掉重复的「입니다」', rule: '语法' })
    return errors
  },
  zh: function (text) {
    const errors = []
    if (text.includes('的地得')) errors.push({ text: '', message: '"的地得"用法', suggestion: '请确认"的/地/得"使用是否正确', rule: '语法' })
    if (/[，。！？]\s*[，。！？]/.test(text)) errors.push({ text: '', message: '重复标点', suggestion: '去掉重复的标点符号', rule: '标点' })
    return errors
  }
}

// 句式优化建议
function getImprovements(text, lang) {
  const suggestions = []
  const langRules = {
    en: [
      { pattern: /\bvery\s+(\w+)\b/gi, replacement: '建议使用更精确的形容词替代 "very + $1"' },
      { pattern: /\bI think\b/gi, replacement: '可替换为 "In my opinion" 或 "I believe"，更正式' },
      { pattern: /\ba lot of\b/gi, replacement: '可替换为 "many"、"much"、"numerous" 等更精确的词' },
      { pattern: /\bgood\b/gi, replacement: '可替换为 "excellent"、"outstanding"、"remarkable" 等' },
      { pattern: /\bbad\b/gi, replacement: '可替换为 "terrible"、"awful"、"dreadful" 等' },
      { pattern: /\bbig\b/gi, replacement: '可替换为 "large"、"huge"、"enormous" 等' },
      { pattern: /\bsmall\b/gi, replacement: '可替换为 "tiny"、"compact"、"miniature" 等' }
    ],
    zh: [
      { pattern: /非常/g, replacement: '可替换为"极其""十分""格外"等更丰富的副词' },
      { pattern: /我觉得/g, replacement: '可替换为"我认为""依我之见""个人认为"等' },
      { pattern: /很多/g, replacement: '可替换为"诸多""大量""众多"等更正式的词汇' }
    ]
  }

  const rules = langRules[lang] || langRules['en']
  rules.forEach(rule => {
    if (rule.pattern.test(text)) {
      suggestions.push({ original: text.match(rule.pattern)?.[0] || '', improved: rule.replacement, reason: '词汇丰富度提升' })
    }
  })

  // 通用建议
  if (text.length < 20 && text.length > 0) {
    suggestions.push({ original: text, improved: '可以尝试扩展句子，增加更多细节', reason: '句子较短，建议丰富内容' })
  }

  return suggestions.slice(0, 3)
}

Page({
  data: {
    input: '',
    lang: 'en',
    errors: [],
    improvements: [],
    aiSummary: '',
    loading: false,
    analyzedText: '',
    languages: [
      { code: 'en', name: '🇺🇸 英语' },
      { code: 'ja', name: '🇯🇵 日语' },
      { code: 'ko', name: '🇰🇷 韩语' },
      { code: 'fr', name: '🇫🇷 法语' },
      { code: 'es', name: '🇪🇸 西语' },
      { code: 'de', name: '🇩🇪 德语' },
      { code: 'zh', name: '🇨🇳 中文' }
    ],
    showLangPicker: false
  },

  onInput(e) {
    this.setData({ input: e.detail.value })
  },

  selectLang: function (e) {
    this.setData({ lang: e.currentTarget.dataset.lang, showLangPicker: false })
  },

  toggleLangPicker: function () {
    this.setData({ showLangPicker: !this.data.showLangPicker })
  },

  analyzeText: async function () {
    const text = this.data.input.trim()
    if (!text) return

    this.setData({ loading: true, errors: [], improvements: [], aiSummary: '' })

    // 先做本地检查
    const langChecker = LOCAL_RULES[this.data.lang]
    let localErrors = []
    if (langChecker) {
      localErrors = langChecker(text)
    }

    // 本地优化建议
    const localImprovements = getImprovements(text, this.data.lang)

    this.setData({
      errors: localErrors,
      improvements: localImprovements,
      analyzedText: text,
      loading: true
    })

    // 尝试调用AI进行深度分析
    try {
      const aiResult = await this.callAIForWriting(text, this.data.lang)
      if (aiResult) {
        // AI结果优先
        this.setData({
          errors: aiResult.errors && aiResult.errors.length > 0 ? aiResult.errors : localErrors,
          improvements: aiResult.improvements && aiResult.improvements.length > 0 ? aiResult.improvements : localImprovements,
          aiSummary: aiResult.summary || ''
        })
      }
    } catch (err) {
      console.warn('AI writing analysis failed, using local rules:', err)
    }

    this.setData({ loading: false })

    // 完成任务
    app.completeTask(4)
    app.addStudyGold(40)
    app.addExp(80)
  },

  callAIForWriting: function (text, lang) {
    const langNames = { en: '英语', ja: '日语', ko: '韩语', fr: '法语', es: '西班牙语', de: '德语', zh: '中文' }
    const langName = langNames[lang] || '英语'

    const systemPrompt = `你是一个专业的${langName}写作教练。请分析用户提交的${langName}文本，找出语法错误、拼写错误和表达不当之处。请以JSON格式返回结果，格式如下：
{
  "errors": [{"text": "错误文本", "message": "错误类型", "suggestion": "修改建议"}],
  "improvements": [{"original": "原文", "improved": "优化后", "reason": "优化原因"}],
  "summary": "总体评价（50字以内）"
}
如果没有错误，errors数组为空。只返回JSON，不要其他内容。`

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
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: text }
          ],
          max_tokens: 500,
          temperature: 0.5
        },
        timeout: 15000,
        success: (res) => {
          if (res.statusCode === 200 && res.data?.choices?.[0]?.message?.content) {
            try {
              const content = res.data.choices[0].message.content
              // 尝试提取JSON
              const jsonMatch = content.match(/\{[\s\S]*\}/)
              if (jsonMatch) {
                resolve(JSON.parse(jsonMatch[0]))
              } else {
                resolve(null)
              }
            } catch (e) {
              resolve(null)
            }
          } else {
            reject(new Error(`API error: ${res.statusCode}`))
          }
        },
        fail: (err) => reject(err)
      })
    })
  },

  goBack() {
    wx.navigateBack()
  }
})
