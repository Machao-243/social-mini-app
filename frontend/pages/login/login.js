// pages/login/login.js
const request = require('../../utils/request.js');
const storage = require('../../utils/storage.js');

Page({
  data: {
    username: '',
    password: '',
    loading: false,
    rememberMe: false
  },

  onLoad: function () {
    // 检查是否已登录
    const token = storage.get('token');
    if (token) {
      wx.redirectTo({
        url: '/pages/index/index'
      });
    }
  },

  onUsernameInput: function (e) {
    this.setData({ username: e.detail.value });
  },

  onPasswordInput: function (e) {
    this.setData({ password: e.detail.value });
  },

  onRememberMeChange: function (e) {
    this.setData({ rememberMe: e.detail.value });
  },

  login: function () {
    if (!this.data.username.trim()) {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none'
      });
      return;
    }

    if (!this.data.password.trim()) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      });
      return;
    }

    this.setData({ loading: true });

    request.post('/auth/login', {
      username: this.data.username,
      password: this.data.password
    }).then(data => {
      // 保存token和用户信息
      storage.set('token', data.token);
      storage.set('userId', data.userId);
      storage.set('userInfo', {
        userId: data.userId,
        username: data.username,
        nickname: data.nickname,
        avatar: data.avatar
      });

      wx.showToast({
        title: '登录成功',
        icon: 'success'
      });

      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/index/index'
        });
      }, 1500);
    }).finally(() => {
      this.setData({ loading: false });
    });
  },

  toRegister: function () {
    wx.navigateTo({
      url: '/pages/register/register'
    });
  }
});
