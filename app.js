App({
  onLaunch: function () {
   
    // 更新代码
    const updateManager = wx.getUpdateManager();

    // 检查新版本
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      // console.log(res.hasUpdate)
    })
    
    // 新版本下载完成
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate();
          }
        }
      })
    })

    // 新版本下载失败
    updateManager.onUpdateFailed(function () {

    })



    // 初始化用户
    this.user = {};

    // 查看缓存中是否有用户信息
    if (wx.getStorageSync('user')) {
      this.user = wx.getStorageSync('user');
    }

    // 开发模式添加默认用户
    if (this.constant.isDev) {
       this.user = { id: 1316, deptId: 216, userPriv: 4, name: 'hua', account: 13657277062 };
      //  this.user = { id: 1317, deptId: 216, userPriv: 3, name: 'dou', account: 15527930302 };
      //  this.user = { id: 1318, deptId: 21, userPriv: 2, name: 'zuo', account: 15201870052 };
      //  this.user = { id: 1324, deptId: 2, userPriv: 2, name: 'tang', account: 13517115190 };
      //  this.user = {};

    }

    
    
  },

  /**
   * 常量
   */
  constant: {
    isDev: true,
    base_img_url: 'https://cwbt.castlc.cn/picture',
    base_domain:'https://cwbt.castlc.cn/',
    base_forward_url: 'https://cwbt.castlc.cn/test/login',
    base_req_url: 'http://cwbt.castlc.cn/api/cwbtMP/',
    upload_url: 'https://cwbt.castlc.cn/api/cwbtMP/uploadFile',
    download_url: 'https://cwbt.castlc.cn/file/',
    logo: 'https://cwbt.castlc.cn/picture/shipLogo123.jpg',
    base_req_url_backup_1: 'http://192.168.43.110:8080/api/cwbtMP/',
    base_req_url_backup: 'https://cwbt.castlc.cn/test/login?url=http://47.92.101.196:8080/api/cwbtMP/',
    download_url_backup: 'https://cwbt.castlc.cn/file/',
    server_url: 'https://cwbt.castlc.cn/test/login?url=http://47.92.101.196:8080/',
    server_url_1: 'http://192.168.0.107:8080/'
  },

  /**
   * 分页对象
   */
  pageInfo: {
    currentPage: 1,
    pageSize: 20
  }
})