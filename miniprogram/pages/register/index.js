Page({
  data: {
    phone: '',
    password: '',
    confirmPassword: '',
    inviteCode: '',
    agreePrivacy: false,
    agreeService: false,
    agreeAll: false,
  },

  onPhoneInput(e) {
    this.setData({ phone: e.detail.value });
  },

  onPasswordInput(e) {
    this.setData({ password: e.detail.value });
  },

  onConfirmPasswordInput(e) {
    this.setData({ confirmPassword: e.detail.value });
  },

  onInviteCodeInput(e) {
    this.setData({ inviteCode: e.detail.value });
  },

  toggleAgreePrivacy() {
    this.setData({ agreePrivacy: !this.data.agreePrivacy });
    this.updateAgreeAll();
  },

  toggleAgreeService() {
    this.setData({ agreeService: !this.data.agreeService });
    this.updateAgreeAll();
  },

  toggleAgreeAll() {
    const newValue = !this.data.agreeAll;
    this.setData({
      agreeAll: newValue,
      agreePrivacy: newValue,
      agreeService: newValue,
    });
  },

  updateAgreeAll() {
    this.setData({
      agreeAll: this.data.agreePrivacy && this.data.agreeService,
    });
  },

  navigateToAgreement(e) {
    const type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: `/pages/agreements/${type}`,
    });
  },

  submitRegister() {
    if (!this.data.phone) {
      wx.showToast({ title: '请输入手机号', icon: 'none' });
      return;
    }
    if (!this.data.password) {
      wx.showToast({ title: '请输入密码', icon: 'none' });
      return;
    }
    if (this.data.password !== this.data.confirmPassword) {
      wx.showToast({ title: '两次密码不一致', icon: 'none' });
      return;
    }
    if (!this.data.agreePrivacy || !this.data.agreeService) {
      wx.showToast({ title: '请同意相关协议', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '注册中...' });
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({ title: '注册成功', icon: 'success' });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }, 1000);
  },
});