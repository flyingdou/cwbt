var app = getApp();
var util = require('../../utils/util.js');
var obj = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    base_img_url: app.constant.base_img_url
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    obj = this;

    if (options.id) {
      obj.data.id = options.id;
    }
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
    this.getSuperviseFeedback();
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
   * 查询督导反馈
   */
  getSuperviseFeedback: function () {
    var url = util.getRequestURL('getSupervisFeedBack.we');
    wx.request({
      url: url,
      data: {
        supervisionId: obj.data.id
      },
      success: function (res) {
        res.data.image = JSON.parse(res.data.image);
        obj.setData({
          superviseFeedback: res.data
        });
      },
      fail: function (e) {
        util.tipsMessage('网络异常！');
        console.log(e);
      }
    });
  },

  /**
   * 图片预览
   */
  preview: (e) => {
    var imgs = [];
    var photos = obj.data.superviseFeedback.image;
    for (var i = 0; i < photos.length; i++) {
      imgs.push(app.constant.base_img_url + '/' + photos[i].name);
    }
    console.log(imgs);
    var index = e.currentTarget.dataset.index;
    // 预览开始
    wx.previewImage({
      current: imgs[index],
      urls: imgs
    })
  }
})