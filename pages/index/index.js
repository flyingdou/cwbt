var app = getApp();
var util = require('../../utils/util.js');
var obj = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
     base_img_url: app.constant.base_img_url
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    obj = this;

    // 计算图标宽度
    var systemInfo = util.getSystemInfo();
    var proportion = systemInfo.proportion;
    var accountIconWidth = 18 * proportion;
    var passwordIconWidth = 15 * proportion;
    obj.setData({
      accountIconWidth: accountIconWidth,
      passwordIconWidth: passwordIconWidth
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 判断用户是否登录
    if (app.constant.userId) {
      obj.setData({
        userId: app.constant.userId
      })
    } else {
      obj.setData({
        userId: null
      });
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 跳转页面
   */
  goto: (e) => {
    var page = e.currentTarget.dataset.page;
    var message = e.currentTarget.dataset.message;
    if (page && page != '') {
      wx.navigateTo({
        url: `../${page}/${page}`,
      });
    } else {
      wx.showModal({
        title: '提示',
        content: message,
        showCancel: false
      });
    }
  },

  /**
   * 保存用户输入的账号并检查该账号有没有微信小程序标识
   */
  checkAccountWechatId: (e) => {
    // 保存账号
    obj.data.account = e.detail.value;
    // 根据账号查询微信标识(达到手机号码11位)
    if (obj.data.account.length == 11) {
      wx.request({
        url: app.constant.base_req_url + 'cwbtMP/checkWechatMPIdByUser.we',
        data: {
          account: obj.data.account
        },
        success: (res) => {
          if (res.data.code <= 0) {
            obj.setData({
              isGetUserInfo: true
            });
            wx.login({
              success: (res) => {
                obj.data.code = res.code;
              }
            });
          }
        },
        fail: (e) => {
          console.log(e);
        }
      });
    }
  },

  /**
   * 保存表单参数
   */
  saveFormParam: (e) => {
    var key = e.currentTarget.dataset.key;
    var value = e.detail.value;
    obj.data[key] = value;
  },

  /**
   * 登录
   */
  login: (e) => {
    wx.showLoading({
      title: '处理中,请稍候',
      mask: true,
    });
    // 获取参数,生成json
    var param = {};
    if (e.type == 'getuserinfo') {
      param = e.detail;
    }
    if (obj.data.code) {
      param.code = obj.data.code;
    }
    // 调用服务端登录接口
    wx.request({
      url: app.constant.base_req_url + 'cwbtMP/login.we',
      data: {
        userName: obj.data.account,
        pwd: obj.data.password,
        json: JSON.stringify(param)
      },
      success: (res) => {
        wx.hideLoading();
        if (res.data.success) {
          util.tipsMessage('登录成功！');
          app.constant.userId = res.data.userId;
          obj.setData({
            userId: res.data.userId
          });
        } else {
          util.tipsMessage('账号或密码错误！');
        }
      },
      fail: (e) => {
        wx.hideLoading();
        console.log(e);
        util.tipsMessage('网络异常，请稍后再试');
      }
    });
  }

})