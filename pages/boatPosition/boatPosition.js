var app = getApp();
var util = require('../../utils/util.js');
var obj = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultLongitude: 114.3,
    defaultLatitude: 30.6
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    obj = this;

    // 实例化地图组件
    obj.mapContext = wx.createMapContext('map', obj);

    // 地图添加标点
    obj.setData({
      markers: [
        {
          id: 1,
          latitude: 30.49984,
          longitude: 114.34253
        },
        {
          id: 2,
          latitude: 30.50427715952927,
          longitude: 114.31128762939453
        },
        {
          id: 3,
          latitude: 30.48741487650025,
          longitude: 114.31403421142578
        }
      ]
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

  }
})