var app = getApp();
var util = require('../../utils/util.js');
var obj = null;
Page({

  /**
   * 页面的初始数据su
   */
  data: {
    blocksDiv1: [[
      { name: '我发起的', fun: 'goto', iconPath: '../../icon/send.png', link: '../supervisionList/supervisionList?queryType=1' },
      { name: '我执行的', fun: 'goto', iconPath: '../../icon/execute.png', link: '../supervisionList/supervisionList?queryType=2' },
      { name: '抄送我的', fun: 'goto', iconPath: '../../icon/copy.png', link: '../supervisionList/supervisionList?queryType=3' }
    ]],
    blocksDiv2: [[
      { name: '发起督导', fun: 'goto', iconPath: '../../icon/launch.png', link: '../releaseSupervision/releaseSupervision' }
    ]]
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
    var link = e.currentTarget.dataset.link;
    wx.navigateTo({
      url: link
    });
  },
})