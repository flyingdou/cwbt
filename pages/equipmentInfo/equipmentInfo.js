var app = getApp();
var util = require('../../utils/util.js');
var obj = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingStatus: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    obj = this;

    if (options.code) {
      obj.data.code = options.code;
    }

    // 页面初始化
    this.init();
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
   * 页面初始化
   */
  init: () => {
    wx.showLoading({
      title: '数据加载中',
      mask: true
    });
    var url = util.getRequestURL('getWcEquipmentcardByNumber.we');
    wx.request({
      url: url,
      data: {
        number: obj.data.code
      },
      success: function (res) {
        if (res.data) {
          obj.setData({
            loadingStatus: false,
            equipment: res.data
          });
          wx.hideLoading();
        } else {
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: '该条形码没有对应设备信息！',
            showCancel: false,
            complete: () => {
              wx.navigateBack({
                delta: 1
              });
            }
          });
        }
      },
      fail: (e) => {
        wx.hideLoading();
        console.log(e);
        util.showTipsMessage('数据加载失败');
      }
    });
  },

  /**
   * 工作卡历史维保记录
   */
  history: (e) => {
    wx.navigateTo({
      url: '../../pages/history/history?equipmentid=' + e.currentTarget.dataset.equipmentid,
    })
  },

})