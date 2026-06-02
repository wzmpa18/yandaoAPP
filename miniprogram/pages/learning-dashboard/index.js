Page({
  data: {
    stats: {
      totalXP: 12580,
      streak: 15,
      todayWords: 25,
      weekWords: 156,
      totalWords: 1280,
      studyMinutes: 45,
    },
    weeklyData: [
      { day: '周一', words: 22, minutes: 35 },
      { day: '周二', words: 18, minutes: 28 },
      { day: '周三', words: 30, minutes: 42 },
      { day: '周四', words: 25, minutes: 38 },
      { day: '周五', words: 28, minutes: 40 },
      { day: '周六', words: 22, minutes: 30 },
      { day: '周日', words: 25, minutes: 45 },
    ],
    forgetReminders: [
      { word: 'accomplish', meaning: '完成', level: 'high' },
      { word: 'phenomenon', meaning: '现象', level: 'medium' },
      { word: 'environment', meaning: '环境', level: 'low' },
    ],
    todayTasks: [
      { id: 1, title: '学习10个新单词', completed: true, xp: 20 },
      { id: 2, title: '完成1局语法游戏', completed: true, xp: 30 },
      { id: 3, title: '阅读一篇文章', completed: false, xp: 25 },
      { id: 4, title: '口语练习10分钟', completed: false, xp: 35 },
    ],
  },

  toggleTask(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    const tasks = this.data.todayTasks.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    this.setData({ todayTasks: tasks });
  },

  goBack() {
    wx.navigateBack();
  },
});