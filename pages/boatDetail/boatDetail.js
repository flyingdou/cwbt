var app = getApp();
var util = require('../../utils/util.js');
var obj = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    base_domain: app.constant.base_domain
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     obj = this;

     // 存储上一页面传递过来的参数
     var dou = {};
     var id = options.id;
     if (id) {
        dou.id = id;
     }
     var number = options.number;
     if (number) {
        dou.number = number;
     }
     obj.setData(dou);

     obj.init();
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
   * 图片预览
   */
  preview (e) {
    util.preview(e);
  },

  /**
   * 初始化页面数据
   */
  init () {
    var id = obj.data.id || 23;
    var param =  {
      id: id
    };
    var reqUrl = util.getRequestURL('getBoatDetail.we');

    // loading
    wx.showLoading({
      title: '加载中',
      mask: true
    })

    // request
    wx.request({
      url: reqUrl,
      dataType: 'json',
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success (res) {
        res = res.data;
        if (res.success) {
          obj.setData({
            boat: res.boatDetail
          });
        } else {
          console.log(res.message);
        }
      },
      complete (com) {
        wx.hideLoading();
      }
    })
  },


})