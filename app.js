App({
  onLaunch: function () {
    // 用户登录态保存
    if (wx.getStorageSync('user')) {
      this.user = wx.getStorageSync('user');
    }

    // 开发模式添加默认用户
    if (this.constant.isDev) {
      this.user = { id: 1317, deptId: 211, userPriv: 2 };
    }
  },
  constant: {
    base_img_url: "https://fish.ecartoon.com.cn/picture",
    base_req_url: "http://127.0.0.119:8080/hqwl/api/cwbtMP/",
    upload_url: 'https://fish.ecartoon.com.cn/uploadFile',
    logo: 'https://fish.ecartoon.com.cn/picture/201810274602.jpg',
    isDev: false
  },
  user: {}
})