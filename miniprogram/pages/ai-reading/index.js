Page({
  data: {
    books: [
      {
        id: 1,
        title: 'The Little Prince',
        author: 'Antoine de Saint-Exupéry',
        level: 'A1',
        cover: '📚',
        wordCount: 2300,
        estimatedTime: '20分钟',
        description: '一个来自小行星的小王子的故事',
        progress: 65,
      },
      {
        id: 2,
        title: 'Animal Farm',
        author: 'George Orwell',
        level: 'A2',
        cover: '🐑',
        wordCount: 3500,
        estimatedTime: '30分钟',
        description: '动物们推翻农场主的故事',
        progress: 20,
      },
      {
        id: 3,
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        level: 'B1',
        cover: '🧙',
        wordCount: 9500,
        estimatedTime: '60分钟',
        description: '比尔博的冒险之旅',
        progress: 0,
      },
      {
        id: 4,
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        level: 'B2',
        cover: '🏰',
        wordCount: 12000,
        estimatedTime: '90分钟',
        description: '伊丽莎白与达西的爱情故事',
        progress: 10,
      },
    ],
    selectedLevel: 'all',
    levels: ['all', 'A1', 'A2', 'B1', 'B2'],
    currentBook: null,
    showBookDetail: false,
  },

  selectLevel(e) {
    this.setData({ selectedLevel: e.currentTarget.dataset.level });
  },

  openBook(e) {
    const book = this.data.books.find(b => b.id === parseInt(e.currentTarget.dataset.id));
    this.setData({ currentBook: book, showBookDetail: true });
  },

  closeDetail() {
    this.setData({ showBookDetail: false, currentBook: null });
  },

  goBack() {
    wx.navigateBack();
  },

  getFilteredBooks() {
    if (this.data.selectedLevel === 'all') {
      return this.data.books;
    }
    return this.data.books.filter(b => b.level === this.data.selectedLevel);
  },
});