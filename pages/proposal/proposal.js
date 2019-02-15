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
   * 保存input输入的值
   */
  inputChange: function (e) {
    var data = {};
    var key = e.currentTarget.dataset.key;
    var value = e.detail.value;
    data[key] = value;
    obj.setData(data);
  },

  /**
   * 提交数据
   */
  submit: function () {
    if (!obj.data.remark) {
      return;
    }
    wx.showLoading({
      title: '处理中',
      mask: true
    });
    var url = util.getRequestURL('addProposal.we');
    var param = { remark: obj.data.remark, createperson: app.user.id, updateperson: app.user.id }
    wx.request({
      url: url,
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success(res) {
        wx.hideLoading();
        if (res.data.success) {
          util.tipsMessage('提交成功！');
          wx.switchTab({
            url: '../mine/mine'
          });
        }
      },
      fail(e) {
        wx.hideLoading();
        util.tipsMessage('网络异常！');
        console.log(e);
      }
    });
  }
})