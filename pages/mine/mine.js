var app = getApp();
var util = require('../../utils/util.js');
var obj = {};

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    if (!app.constant.userId) {
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
   * 注销
   */
  cancellation: () => {
    wx.showModal({
      title: '提示',
      content: '是否确定注销？',
      success: (res) => {
        if (res.confirm) {
          // 清除用户记录
          app.constant.userId = null;
          // 返回登录页面
          wx.switchTab({
            url: '../index/index'
          });
        }
      }
    });
  }

})