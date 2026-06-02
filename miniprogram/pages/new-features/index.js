Page({
  data: {
    features: [
      { key: 'ai-writing', icon: '✍️', title: 'AI作文教练', desc: '智能语法批改 · 句式优化建议' },
      { key: 'ai-reading', icon: '📚', title: 'AI选词阅读', desc: '智能分级读物推荐' },
      { key: 'phoneme-coach', icon: '🎯', title: '音素级纠音', desc: '精准发音分析与改进建议' },
      { key: 'learning-dashboard', icon: '📊', title: '学习数据板', desc: '可视化学习进度追踪' },
    ],
  },

  navigateToFeature(e) {
    const key = e.currentTarget.dataset.key;
    wx.navigateTo({
      url: `/pages/${key}/index`,
    });
  },

  goBack() {
    wx.navigateBack();
  },
});