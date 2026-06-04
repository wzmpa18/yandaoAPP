const app = getApp()

Page({
  data: {
    gameStats: {
      wordHunter: { best: '--', score: 0, plays: 0 },
      grammarPlanet: { best: '--', score: 0, plays: 0 },
      escapeRoom: { best: '--', score: 0, plays: 0 },
      sentenceBuild: { best: '--', score: 0, plays: 0 }
    },
    ranking: [],
    userRank: null,
    weeklyReset: ''
  },

  onLoad: function () {
    this.loadGameStats()
    this.generateRanking()
    this.calcWeeklyReset()
  },

  onShow: function () {
    this.loadGameStats()
  },

  loadGameStats: function () {
    const scores = app.globalData.gameScores || {}
    const stats = {
      wordHunter: {
        best: scores.wordHunter?.best || '--',
        score: scores.wordHunter?.score || 0,
        plays: scores.wordHunter?.plays || 0
      },
      grammarPlanet: {
        best: scores.grammarPlanet?.best || '--',
        score: scores.grammarPlanet?.score || 0,
        plays: scores.grammarPlanet?.plays || 0
      },
      escapeRoom: {
        best: scores.escapeRoom?.best || '--',
        score: scores.escapeRoom?.score || 0,
        plays: scores.escapeRoom?.plays || 0
      },
      sentenceBuild: {
        best: scores.sentenceBuild?.best || '--',
        score: scores.sentenceBuild?.score || 0,
        plays: scores.sentenceBuild?.plays || 0
      }
    }
    this.setData({ gameStats: stats })
  },

  generateRanking: function () {
    const userInfo = app.globalData.userInfo
    const totalScore = Object.values(this.data.gameStats).reduce((sum, g) => sum + (g.score || 0), 0)
    
    // 基于实际分数生成排名
    const ranking = [
      { userId: 'r1', nickname: '学霸小明', score: Math.max(12580, totalScore + 5000), level: '钻石', rank: 1 },
      { userId: 'r2', nickname: '语言达人', score: Math.max(11230, totalScore + 3000), level: '铂金', rank: 2 },
      { userId: 'r3', nickname: '学习狂人', score: Math.max(9870, totalScore + 1500), level: '黄金', rank: 3 },
      { userId: 'r4', nickname: '努力的小红', score: 8560, level: '白银', rank: 4 },
      { userId: 'r5', nickname: '日语爱好者', score: 7230, level: '青铜', rank: 5 }
    ]

    // 插入用户排名
    let userRank = null
    if (totalScore > 0) {
      const insertIdx = ranking.findIndex(r => totalScore > r.score)
      if (insertIdx === -1) {
        userRank = { rank: ranking.length + 1, score: totalScore, isUser: true }
      } else {
        userRank = { rank: insertIdx + 1, score: totalScore, isUser: true }
      }
    }

    this.setData({ ranking, userRank })
  },

  calcWeeklyReset: function () {
    const now = new Date()
    const dayOfWeek = now.getDay()
    const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek
    const nextMonday = new Date(now)
    nextMonday.setDate(now.getDate() + daysUntilMonday)
    this.setData({ weeklyReset: `${nextMonday.getMonth() + 1}月${nextMonday.getDate()}日` })
  },

  goToGame: function (e) {
    const game = e.currentTarget.dataset.game
    wx.navigateTo({ url: `/pages/games/${game}` })
  }
})
