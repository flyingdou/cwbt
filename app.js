App({
  onLaunch: function () {
    // 初始化用户
    this.user = {};

    // 查看缓存中是否有用户信息
    if (wx.getStorageSync('user')) {
      this.user = wx.getStorageSync('user');
    }

    // 开发模式添加默认用户
    if (this.constant.isDev) {
      this.user = { id: 1316, deptId: 2, userPriv: 3 };
    }
  },
  constant: {
    isDev: true,
    base_img_url: 'https://cwbt.castlc.cn/picture',
    base_forward_url: 'https://cwbt.castlc.cn/cwbt/test/login',
    base_req_url: 'http://cwbt.castlc.cn/cwbt/api/cwbtMP/',
    upload_url: 'https://cwbt.castlc.cn/cwbt/api/cwbtMP/uploadFile',
    logo: 'https://cwbt.castlc.cn/picture/shipLogo123.jpg',
    base_img_url_backup: 'https://fish.ecartoon.com.cn/picture',
    base_req_url_backup: 'http://192.168.0.106:8080/hqwl/api/cwbtMP/',
    upload_url_backup: 'https://fish.ecartoon.com.cn/uploadFile',
  }
})