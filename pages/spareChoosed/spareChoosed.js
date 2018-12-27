var app = getApp();
var util = require('../../utils/util.js');
var obj = null;
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
    obj = this;

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
    // 初始化页面数据
    obj.init();
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
   * 初始化页面数据
   */
  init: () => {
    var reqUrl = util.getRequestURL('getSparePickList.we');
    var param = {
      user_id: app.user.id,
      status: 8 // 被领取
    };

    // loading
    wx.showLoading({
      title: '加载中...',
    })

    wx.request({
      url: reqUrl,
      dataType: 'json',
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: (res) => {
        res = res.data;
        var dou = {};
        var spareList = res.sparePickList || [];
        dou.spareList = spareList;
        if (res.success) {
          obj.setData(dou);
        }
      },
      complete: (com) => {
        wx.hideLoading();
      }
    })

  },


  /**
   * 扫码
   */
  scan: () => {
    obj.goto();
  },


  /**
   * 跳转到领用页面
   */
  goto: () => {
    var code = obj.data.code || '20181224010101000001';
    wx.navigateTo({
      url: '../../pages/sparePick/sparePick?code=' + code,
    })

  },



})