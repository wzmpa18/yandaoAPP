Page({
  data: {
    input: '',
    errors: [],
    improvements: [],
    loading: false,
    analyzedText: '',
  },

  onInput(e) {
    this.setData({ input: e.detail.value });
  },

  analyzeText() {
    if (!this.data.input.trim()) return;

    this.setData({ loading: true });

    setTimeout(() => {
      const mockErrors = this.mockGrammarCheck(this.data.input);
      const mockImprovements = this.mockImproveSentences(this.data.input);
      
      this.setData({
        errors: mockErrors,
        improvements: mockImprovements,
        analyzedText: this.data.input,
        loading: false,
      });
    }, 800);
  },

  mockGrammarCheck(text) {
    if (text.includes('I is')) {
      return [
        { start: text.indexOf('I is'), end: text.indexOf('I is') + 4, message: '主谓不一致', suggestion: '应改为 "I am"' },
      ];
    }
    if (text.includes('very good')) {
      return [
        { start: text.indexOf('very good'), end: text.indexOf('very good') + 9, message: '表达不够地道', suggestion: '可改为 "excellent" 或 "outstanding"' },
      ];
    }
    if (text.length > 50) {
      return [
        { start: 0, end: text.length, message: '段落过长', suggestion: '建议分成多个段落' },
      ];
    }
    return [];
  },

  mockImproveSentences(text) {
    const suggestions = [];
    if (text.includes('very happy')) {
      suggestions.push({
        original: 'very happy',
        improved: 'extremely delighted',
        reason: '使用更丰富的词汇表达情感',
      });
    }
    if (text.includes('I think')) {
      suggestions.push({
        original: 'I think',
        improved: 'In my opinion',
        reason: '更正式的表达方式',
      });
    }
    if (text.length > 0) {
      suggestions.push({
        original: text.slice(0, Math.min(20, text.length)) + (text.length > 20 ? '...' : ''),
        improved: '句式结构清晰',
        reason: '句子结构合理，语法正确',
      });
    }
    return suggestions;
  },

  goBack() {
    wx.navigateBack();
  },
});