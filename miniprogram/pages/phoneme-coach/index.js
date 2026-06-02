Page({
  data: {
    words: [
      { id: 1, word: 'apple', phonetic: '/ˈæp.əl/', meaning: '苹果' },
      { id: 2, word: 'beautiful', phonetic: '/ˈbjuː.tɪ.fəl/', meaning: '美丽的' },
      { id: 3, word: 'chocolate', phonetic: '/ˈtʃɒk.əl.ət/', meaning: '巧克力' },
      { id: 4, word: 'dictionary', phonetic: '/ˈdɪk.ʃən.er.i/', meaning: '字典' },
    ],
    currentWord: null,
    isRecording: false,
    score: 0,
    feedback: '',
    phonemeAnalysis: [],
  },

  selectWord(e) {
    const word = this.data.words.find(w => w.id === parseInt(e.currentTarget.dataset.id));
    this.setData({ currentWord: word, score: 0, feedback: '', phonemeAnalysis: [] });
  },

  startRecording() {
    if (!this.data.currentWord) {
      wx.showToast({ title: '请先选择单词', icon: 'none' });
      return;
    }

    this.setData({ isRecording: true });

    setTimeout(() => {
      this.stopRecording();
    }, 3000);
  },

  stopRecording() {
    this.setData({ isRecording: false });

    const mockScore = Math.floor(Math.random() * 30) + 70;
    const analysis = this.generatePhonemeAnalysis();

    this.setData({
      score: mockScore,
      phonemeAnalysis: analysis,
      feedback: mockScore >= 90 ? '🎊 发音非常标准！' : mockScore >= 80 ? '👍 不错，继续加油！' : '💪 需要多加练习哦',
    });
  },

  generatePhonemeAnalysis() {
    const phonemes = [
      { phoneme: 'æ', status: 'good', tip: '舌位正确' },
      { phoneme: 'p', status: 'good', tip: '爆破音清晰' },
      { phoneme: 'əl', status: 'warning', tip: '尾音稍短，可延长一点' },
    ];
    return phonemes;
  },

  goBack() {
    wx.navigateBack();
  },
});