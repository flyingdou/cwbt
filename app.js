App({
  /**
   * 小程序初始化
   */
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

    // 查看缓存中是否有用户信息
    // 用户初始化, 测试模式和产品模式用户已经登录过直接进入首页
    if (wx.getStorageSync('user')) {
      this.user = wx.getStorageSync('user');
    } else {
      this.user = {};
    }

    // 添加默认用户(开发模式免登陆)
    if (this.constant.mode == this.constant.dev) {
       this.user = { id: 1316, deptId: 216, userPriv: 4, name: 'hua', account: 13657277062 };
      //  this.user = { id: 1317, deptId: 216, userPriv: 3, name: 'dou', account: 15527930302 };
      //  this.user = { id: 1318, deptId: 21, userPriv: 2, name: 'zuo', account: 15201870052 };
      //  this.user = { id: 1324, deptId: 2, userPriv: 2, name: 'tang', account: 13517115190 };
      //  this.user = {};
    }
  },

  /**
   * 获取服务端小程序配置参数
   */
  getWechatConfig: function (callback) {
    const _this = this;
    const { isUpdated, mode, product, test, wechat_config_url } = this.constant;

    // 如果常量配置已经更新过就无需再次请求
    if (isUpdated) {
      // 执行回调
      callback && callback();
      return;
    }

    // 获取服务端小程序配置参数(产品模式和测试模式需要从服务端获取配置)
    if (mode === product || mode === test) {
      wx.request({
        url: wechat_config_url,
        data: {
          json: encodeURI(JSON.stringify({ mode: mode }))
        },
        success(res) {
          if (res.data && res.data.success) {
            const { config } = res.data;
            // 解构服务端数据
            const newConstant = {
              isUpdated: true,
              base_domain: config.baseDomain,
              base_forward_url: config.baseForwardUrl,
              base_req_url: config.baseReqUrl,
              base_img_url: config.baseImgUrl,
              download_url: config.downloadUrl,
              server_url: config.serverUrl,
              upload_url: config.uploadUrl
            };
            // 更新常量对象(原常量对象与新常量对象合并)
            _this.constant = Object.assign(_this.constant, newConstant);
            // 执行回调
            callback && callback();
          }
        }
      })
    }
  },

  /**
   * 常量对象
   */
  constant: (() => {

    // 初始常量
    const _constant = {

      /**
       * 常量配置是否更新过
       */
      isUpdated: false,

      // 产品模式(小程序正式版)
      product: 'product',

      // 测试模式(小程序体验版)
      test: 'test',

      // 开发模式(小程序开发版)
      dev: 'dev',

      // 微信小程序配置接口url
      wechat_config_url: 'http://localhost:8080/wechatConfig/getConfig',

      // 小程序开发模式基础服务端接口url
      base_img_url: 'https://cwbt.castlc.cn/picture',
      base_domain: 'https://cwbt.castlc.cn/',
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
    }

    // 新增常量
    const mode = {
      // 小程序运行模式
      mode: _constant.test
    }

    // 返回合并新对象
    return Object.assign(_constant, mode);
  })(),

  /**
   * 分页对象
   */
  pageInfo: {
    currentPage: 1,
    pageSize: 20
  }
})