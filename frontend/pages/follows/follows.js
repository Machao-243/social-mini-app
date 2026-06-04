// pages/follows/follows.js
const request = require('../../utils/request.js');
const storage = require('../../utils/storage.js');

Page({
  data: {
    userId: null,
    followings: [],
    isLoading: false
  },

  onLoad: function (options) {
    this.setData({ userId: parseInt(options.userId) || storage.get('userId') });
    this.loadFollowings();
  },

  loadFollowings: function () {
    this.setData({ isLoading: true });
    request.get(`/users/${this.data.userId}/followings`)
      .then(data => {
        this.setData({ followings: data || [] });
      })
      .finally(() => {
        this.setData({ isLoading: false });
      });
  },

  toUserProfile: function (e) {
    const userId = e.currentTarget.dataset.userId;
    wx.navigateTo({
      url: `/pages/user-detail/user-detail?userId=${userId}`
    });
  },

  unfollowUser: function (e) {
    const userId = e.currentTarget.dataset.userId;
    wx.showModal({
      title: '确认取消关注',
      content: '确定要取消关注该用户吗？',
      success: (res) => {
        if (res.confirm) {
          request.delete(`/users/${userId}/follow`).then(() => {
            this.loadFollowings();
            wx.showToast({ title: '已取消关注', icon: 'success' });
          });
        }
      }
    });
  }
});
