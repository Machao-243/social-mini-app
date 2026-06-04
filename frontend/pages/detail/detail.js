// pages/detail/detail.js
const request = require('../../utils/request.js');
const { formatTime } = require('../../utils/format.js');

Page({
  data: {
    post: null,
    comments: [],
    commentInput: '',
    loading: false,
    postId: null
  },

  onLoad: function (options) {
    this.setData({ postId: parseInt(options.id) });
    this.loadPostDetail();
    this.loadComments();
  },

  loadPostDetail: function () {
    request.get(`/posts/${this.data.postId}`).then(post => {
      this.setData({ post });
    });
  },

  loadComments: function () {
    request.get(`/comments/post/${this.data.postId}`).then(comments => {
      this.setData({ comments: comments || [] });
    });
  },

  onCommentInput: function (e) {
    this.setData({ commentInput: e.detail.value });
  },

  publishComment: function () {
    if (!this.data.commentInput.trim()) {\n      wx.showToast({\n        title: '请输入评论',\n        icon: 'none'\n      });\n      return;\n    }\n\n    const comment = {\n      postId: this.data.postId,\n      content: this.data.commentInput\n    };\n\n    request.post('/comments', comment).then(() => {\n      this.setData({ commentInput: '' });\n      this.loadComments();\n      wx.showToast({\n        title: '评论成功',\n        icon: 'success'\n      });\n    });\n  },\n\n  likePost: function () {\n    request.post(`/posts/${this.data.postId}/like`).then(() => {\n      const post = this.data.post;\n      post.likeCount = (post.likeCount || 0) + 1;\n      this.setData({ post });\n    });\n  }\n});
