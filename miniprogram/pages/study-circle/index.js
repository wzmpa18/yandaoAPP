Page({
  data: {
    languages: [
      { code: 'all', name: '全部' },
      { code: 'ja', name: '🇯🇵 日语' },
      { code: 'en', name: '🇺🇸 英语' },
      { code: 'ko', name: '🇰🇷 韩语' },
      { code: 'fr', name: '🇫🇷 法语' },
      { code: 'es', name: '🇪🇸 西语' },
      { code: 'de', name: '🇩🇪 德语' }
    ],
    posts: [
      {
        id: 1,
        author: '日语达人',
        time: '2小时前',
        content: '今天学习了10个新单词，分享一下学习心得。日语单词记忆真的需要多复习，每天花10分钟复习效果很好！',
        images: [],
        likes: 23,
        comments: 5,
        liked: false
      },
      {
        id: 2,
        author: '英语爱好者',
        time: '5小时前',
        content: '推荐一个很好的英语学习网站，里面有很多免费资源，适合初学者！',
        images: [],
        likes: 45,
        comments: 12,
        liked: true
      },
      {
        id: 3,
        author: '韩语学习者',
        time: '昨天',
        content: '终于背完了TOPIK初级词汇！🎉 准备开始练习听力了。有没有一起的小伙伴？',
        images: [],
        likes: 67,
        comments: 8,
        liked: false
      }
    ]
  },

  likePost: function () {
    wx.showToast({ title: '点赞成功', icon: 'success' })
  },

  commentPost: function () {
    wx.showToast({ title: '评论', icon: 'none' })
  },

  sharePost: function () {
    wx.showToast({ title: '分享', icon: 'none' })
  },

  goToPost: function () {
    wx.navigateTo({ url: '/pages/study-circle/post' })
  }
})
