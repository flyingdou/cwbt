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
    obj = this;

    obj.setData({
      userPriv: app.user.userPriv
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
    this.getSupervisionList();
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

  goto: function (e) {
    var link = e.currentTarget.dataset.link;
    wx.navigateTo({
      url: link
    });
  },

  /**
   * 查询督导列表数据
   */
  getSupervisionList: function () {
    var url = util.getRequestURL('getSupervisionList.we');
    var param = { userId: app.user.id, deptId: app.user.deptId, userPriv: app.user.userPriv };
    wx.request({
      url: url,
      data: {
        json: JSON.stringify(param)
      },
      success: function (res) {
        obj.setData({
          supervisionList: res.data
        });
      },
      fail: function (e) {
        util.tipsMessage('网络异常！');
        console.log(e);
      }
    });
  }
})