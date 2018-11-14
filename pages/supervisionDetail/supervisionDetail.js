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

    if (options.id) {
      obj.data.id = options.id;
    }

    if (options.creator) {
      obj.setData({
        creator: options.creator
      });
    }

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
    this.getSupervisionContentList();
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
   * 查询督导内容列表
   */
  getSupervisionContentList: function () {
    var url = util.getRequestURL('getSupervisionContentList.we');
    wx.request({
      url: url,
      data: {
        supervisionId: obj.data.id
      },
      success: function (res) {
        obj.setData({
          contents: res.data
        });
      },
      fail: function (e) {
        util.tipsMessage('网络异常！');
        console.log(e);
      }
    });
  },

  /**
   * 转发
   */
  reSend: function (e) {
    wx.navigateTo({
      url: `../releaseSupervise/releaseSupervise?id=${obj.data.id}&contents=${JSON.stringify(obj.data.contents)}`
    });
  },

  /**
   * 执行
   */
  implement: function (e) {
    wx.navigateTo({
      url: `../supervise/supervise?id=${obj.data.id}&creator=${obj.data.creator}&contents=${JSON.stringify(obj.data.contents)}`
    });
  }
})