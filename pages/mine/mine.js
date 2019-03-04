var app = getApp();
var util = require('../../utils/util.js');
var obj = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDev: app.constant.isDev,
    // 隐藏弹出框
    hidden: true,
    phoneNumber: '15527930302'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    obj = this;
   

    // 设置导航栏颜色
    wx.setNavigationBarColor({
      backgroundColor: '#348BFF',
      frontColor: '#ffffff',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    });

    // 查询版本信息
    obj.getEdition();
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
    // 如果用户未登录则返回登录页面
    if (!app.user.id) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        showCancel: false,
        complete: () => {
          wx.switchTab({
            url: '../index/index'
          });
        }
      });
    } else {
      obj.setData({
        name: app.user.name
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
    var link = e.currentTarget.dataset.link;
    var message = e.currentTarget.dataset.message;
    var key = e.currentTarget.dataset.key;
    var value = e.currentTarget.dataset.value;
    var priv = e.currentTarget.dataset.priv;
    if (key && value) {
      wx.setStorageSync(key, obj.data[value]);
    }


    // 链接判断
    if (!link && link == '') {
      wx.showModal({
        title: '提示',
        content: message,
        showCancel: false
      });
      return;
    } 
    
    // 数据校验通过
    wx.navigateTo({
      url: link
    });
  },

  /**
   * 联系我们
   */
  contact: () => {
    wx.makePhoneCall({
      phoneNumber: obj.data.phoneNumber
    });
  },


  /**
   * 注销
   */
  cancellation: () => {
    wx.showModal({
      title: '提示',
      content: '是否确定注销？',
      success: (res) => {
        if (res.confirm) {
          // 清除用户记录
          app.user = {};
          wx.removeStorageSync('user');
          // 返回登录页面
          wx.switchTab({
            url: '../index/index'
          });
        }
      }
    });
  },

  /**
   * 修改密码
   */
  updatePassword:() => {
     var url = '../../pages/updatePWD/updatePWD';
     wx.navigateTo({
       url: url,
     })
  },

  /**
  * 触发弹出层
  */
  showModal() {
    obj.setData({
      hidden: false
    });
  },

  /**
   * 点击确定按钮
   */
  confirm() {
    obj.setData({
      hidden: true
    });
  },

  /**
   * 点击取消按钮
   */
  cancel() {
    obj.setData({
      hidden: true
    });
  },

  /**
   * 查询最新的版本信息
   */
  getEdition () {
    var reqUrl = util.getRequestURL('getEdition.we');
    // request
    wx.request({
      url: reqUrl,
      dataType: 'json',
      success (res) {
        res = res.data;
        if (res.success) {
          obj.setData({
            update: res.update
          });
        }
      },
    })
   },

  

})