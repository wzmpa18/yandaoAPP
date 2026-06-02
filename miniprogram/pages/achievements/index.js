Page({
  data: {
    achievements: [
      { id: 1, icon: '🎯', name: '学习启程', description: '完成第一次学习', unlocked: true },
      { id: 2, icon: '🔥', name: '百题达人', description: '累计答对100道题', unlocked: true },
      { id: 3, icon: '💪', name: '一周坚持', description: '连续学习7天', unlocked: true },
      { id: 4, icon: '🌟', name: '百日精进', description: '累计学习100天', unlocked: false },
      { id: 5, icon: '📚', name: '词汇大师', description: '累计学习1000个单词', unlocked: false },
      { id: 6, icon: '🎓', name: '语法高手', description: '完成所有语法课程', unlocked: false },
      { id: 7, icon: '🏆', name: '游戏王者', description: '所有游戏达到最高等级', unlocked: false },
      { id: 8, icon: '👥', name: '社交达人', description: '添加100位好友', unlocked: false },
      { id: 9, icon: '💬', name: '聊天能手', description: '发送1000条消息', unlocked: false },
      { id: 10, icon: '⭐', name: '人气之星', description: '获得1000个关注', unlocked: false },
      { id: 11, icon: '💰', name: '财富积累', description: '累计获得10000学习金', unlocked: true },
      { id: 12, icon: '📢', name: '推广能手', description: '邀请10位好友', unlocked: true },
      { id: 13, icon: '🌍', name: '环球旅行者', description: '学习10种语言', unlocked: false },
      { id: 14, icon: '🎤', name: '口语达人', description: '完成100次AI对话', unlocked: true },
      { id: 15, icon: '👑', name: '语言大师', description: '解锁所有成就', unlocked: false }
    ],
    completedCount: 6,
    totalCount: 15,
    progressPercent: 40
  },

  onLoad: function () {
    const completed = this.data.achievements.filter(a => a.unlocked).length
    this.setData({
      completedCount: completed,
      progressPercent: Math.round((completed / this.data.totalCount) * 100)
    })
  }
})
