Page({
  data: {
    gameStats: {
      wordHunter: { best: '5分钟', score: 1280 },
      grammarPlanet: { best: '3星', score: 2560 },
      escapeRoom: { best: '2分30秒', score: 890 },
      sentenceBuild: { best: '45词', score: 1680 }
    },
    ranking: [
      { userId: 1, nickname: '学霸小明', score: 12580, level: '钻石', rank: 1 },
      { userId: 2, nickname: '语言达人', score: 11230, level: '铂金', rank: 2 },
      { userId: 3, nickname: '学习狂人', score: 9870, level: '黄金', rank: 3 },
      { userId: 4, nickname: '努力的小红', score: 8560, level: '白银', rank: 4 },
      { userId: 5, nickname: '日语爱好者', score: 7230, level: '青铜', rank: 5 }
    ]
  },

  goToGame: function (e) {
    const game = e.currentTarget.dataset.game
    wx.navigateTo({ url: `/pages/games/${game}` })
  }
})
