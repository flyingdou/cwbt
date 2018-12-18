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
   * inputChange
   */
  inputChange: (e) => {
     var key = e.currentTarget.dataset.key;
     wx.setStorageSync(key, e.detail.value);
  },

  /**
   * 初始化页面数据
   */
  init: () => {
    var dou = {};
    dou.recUsers = wx.getStorageSync('recUsers') || [];
    dou.copyUsers = wx.getStorageSync('copyUsers') || [];
    dou.content = wx.getStorageSync('content') || '';
    obj.setData(dou);

  },


  /**
   * choose
   */
  choose: (e) => {
    var type = e.currentTarget.dataset.type;
    var jumpUrl = '../../pages/chooseUser/chooseUser?type=' + type;
    wx.navigateTo({
      url: jumpUrl,
    })
  },

  

})