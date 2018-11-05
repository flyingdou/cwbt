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

    // 判断用户是否登录
    if (app.constant.memberId) {
      obj.setData({
        memberId: app.constant.memberId
      })
    }

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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


  /**
   * 前往工作任务列表
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
      // ...
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
  login: () => {
    wx.showLoading({
      title: '处理中,请稍候',
      mask: true,
    });
    
    // 模拟调用服务端
    setTimeout(function () {
      app.constant.memberId = 1;
      obj.setData({
        memberId: 1
      });
      wx.hideLoading();
    }, 1000);
  }

})