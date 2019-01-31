var app = getApp();
var util = require('../../utils/util.js');
var obj = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentPage: app.pageInfo.currentPage,
    pageSize: app.pageInfo.pageSize
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
    obj.data.currentPage = app.pageInfo.currentPage;
    obj.data.spareList = [];
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
    obj.data.currentPage++;
    obj.init();
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
      status: 8, // 被领取
      currentPage: obj.data.currentPage,
      pageSize: obj.data.pageSize
    };

    // loading
    wx.showLoading({
      title: '加载中...',
      mask: true
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
        var spareList = obj.data.spareList || [];
        dou.spareList = spareList.concat(res.sparePickList);
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
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        obj.setData({
          code: res.result
        })
        obj.goto();
      },
      fail: () => {
        wx.showModal({
          title: '提示',
          content: '扫码失败！',
          showCancel: false
        })
      }
    })
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

  /**
   * 备件消耗
   */
  spareCost: (e) => {
    var index = e.currentTarget.dataset.index;
    var spare = obj.data.spareList[index];
    wx.navigateTo({
      url: '../../pages/spareCost/spareCost?spare=' + encodeURI(JSON.stringify(spare)),
    })

  },



})