var app = getApp();
var util = require('../../utils/util.js');
var obj = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showMark: false
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
    var { deptObjList, startDate, endDate, material } = obj.data;
    if (deptObjList && startDate && endDate && material) {
      
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
  goto: function (e) {
    var { link } = e.currentTarget.dataset;
    if (link) {
      wx.navigateTo({
        url: link
      });
    }
  },

  /**
   * 弹起日历
   */
  showMark: function (e) {
    obj.setData({
      showMark: true
    });
  },

  /**
   * 时间选择器改变
   */
  dateChange: function (e) {
    if (e.detail.values) {
      var [ startDate, endDate ] = e.detail.values;
      obj.setData({
        startDate,
        endDate,
        showMark: false
      });
    }
  }
})