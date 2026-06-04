const app = getApp()

Page({
  data: {
    selectedLang: 'all',
    languages: [
      { code: 'all', name: '全部' },
      { code: 'ja', name: '🇯🇵 日语' },
      { code: 'en', name: '🇺🇸 英语' },
      { code: 'ko', name: '🇰🇷 韩语' },
      { code: 'fr', name: '🇫🇷 法语' },
      { code: 'es', name: '🇪🇸 西语' },
      { code: 'de', name: '🇩🇪 德语' },
      { code: 'zh', name: '🇨🇳 中文' }
    ],
    posts: [],
    myPosts: []
  },

  onLoad: function () {
    this.loadPosts()
  },

  onShow: function () {
    this.loadPosts()
  },

  loadPosts: function () {
    // 从本地存储加载帖子
    const storedPosts = wx.getStorageSync('circlePosts') || []
    const myPosts = wx.getStorageSync('myCirclePosts') || []
    
    // 默认帖子（如果没有存储的帖子）
    const defaultPosts = [
      {
        id: 1, author: '日语达人', lang: 'ja', time: '2小时前',
        content: '今天学习了10个新单词，分享一下学习心得。日语单词记忆真的需要多复习，每天花10分钟复习效果很好！',
        likes: 23, comments: 5, liked: false, isMine: false
      },
      {
        id: 2, author: '英语爱好者', lang: 'en', time: '5小时前',
        content: '推荐一个很好的英语学习方法：每天听15分钟播客，然后尝试用英语总结内容。坚持了一个月，听力明显提升！',
        likes: 45, comments: 12, liked: false, isMine: false
      },
      {
        id: 3, author: '韩语学习者', lang: 'ko', time: '昨天',
        content: '终于背完了TOPIK初级词汇！🎉 准备开始练习听力了。有没有一起的小伙伴？',
        likes: 67, comments: 8, liked: false, isMine: false
      },
      {
        id: 4, author: '法语爱好者', lang: 'fr', time: '3小时前',
        content: '法语发音真的好难啊！特别是那个"r"音，练了一周才有点感觉。大家有什么好方法吗？',
        likes: 31, comments: 15, liked: false, isMine: false
      },
      {
        id: 5, author: '德语学习者', lang: 'de', time: '1天前',
        content: '德语的名词性别真的让人头疼！der/die/das...有没有好的记忆方法？',
        likes: 56, comments: 20, liked: false, isMine: false
      }
    ]

    const allPosts = storedPosts.length > 0 ? storedPosts : defaultPosts
    
    // 恢复点赞状态
    const likedPosts = wx.getStorageSync('likedPosts') || []
    const posts = allPosts.map(p => ({
      ...p,
      liked: likedPosts.includes(p.id)
    }))

    this.setData({ posts, myPosts })
  },

  selectLang: function (e) {
    this.setData({ selectedLang: e.currentTarget.dataset.lang })
  },

  getFilteredPosts: function () {
    if (this.data.selectedLang === 'all') return this.data.posts
    return this.data.posts.filter(p => p.lang === this.data.selectedLang)
  },

  likePost: function (e) {
    const postId = e.currentTarget.dataset.postId
    const posts = this.data.posts.map(p => {
      if (p.id === postId) {
        const liked = !p.liked
        return { ...p, liked, likes: liked ? p.likes + 1 : p.likes - 1 }
      }
      return p
    })

    // 保存点赞状态
    const likedPosts = posts.filter(p => p.liked).map(p => p.id)
    wx.setStorageSync('likedPosts', likedPosts)
    wx.setStorageSync('circlePosts', posts)

    this.setData({ posts })
    wx.showToast({ title: posts.find(p => p.id === postId)?.liked ? '已点赞' : '已取消', icon: 'success' })
  },

  commentPost: function (e) {
    const postId = e.currentTarget.dataset.postId
    wx.showModal({
      title: '发表评论',
      editable: true,
      placeholderText: '写下你的评论...',
      success: (res) => {
        if (res.confirm && res.content) {
          const posts = this.data.posts.map(p => {
            if (p.id === postId) {
              return { ...p, comments: (p.comments || 0) + 1 }
            }
            return p
          })
          wx.setStorageSync('circlePosts', posts)
          this.setData({ posts })
          wx.showToast({ title: '评论成功', icon: 'success' })
          app.addStudyGold(5)
        }
      }
    })
  },

  sharePost: function () {
    wx.showToast({ title: '已复制分享链接', icon: 'success' })
  },

  goToPost: function () {
    wx.navigateTo({ url: '/pages/study-circle/post' })
  },

  deletePost: function (e) {
    const postId = e.currentTarget.dataset.postId
    wx.showModal({
      title: '删除动态',
      content: '确定要删除这条动态吗？',
      success: (res) => {
        if (res.confirm) {
          const posts = this.data.posts.filter(p => p.id !== postId)
          wx.setStorageSync('circlePosts', posts)
          this.setData({ posts })
          wx.showToast({ title: '已删除', icon: 'success' })
        }
      }
    })
  }
})
