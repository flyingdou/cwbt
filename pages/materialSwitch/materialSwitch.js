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
    // 初始化页面数据
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
   * init
   */
  init () {
    var funList = [];
    var funs = [];
    var funDou = [
      {
        'name': '工作卡统计',
        'icon': '../../icon/workCard.png',
        'link': '../../pages/analysis/analysis'
      },
      {
        'name': '统计图1',
        'icon': '../../icon/ppm.png',
        'link': '../../pages/mppCharts/mppCharts'
      },
      {
        'name': '统计图2',
        'icon': '../../icon/mpp.png',
        'link': '../../pages/ppmCharts/ppmCharts'
      },
      {
        'name': '统计图3',
        'icon': '../../icon/pmp.png',
        'link': '../../pages/pmpCharts/pmpCharts'
      }
    ];
    

    funDou.forEach((fun,i) => {
      funs.push(fun);
      if (funs.length == 2) {
        funList.push(funs);
        funs = [];
      }
      if (i == (funDou.length - 1)) {
        if (funs.length > 0) {
          funList.push(funs);
        }
      }
    });

    obj.setData({
      funList: funList
    });



  },

  /**
   * 跳转
   */
  goto (e) {
    var link = e.currentTarget.dataset.link;
    wx.navigateTo({
      url: link,
    })
  }, 



})