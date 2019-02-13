var app = getApp();
var util = require('../../utils/util.js');
var obj = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
     startTime: '请选择',
     endTime: '请选择',
     showModalStatus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    obj = this;
    var equipmentid = options.equipmentid;
    obj.setData({
      equipmentid: equipmentid
    });
    obj.getData();
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
   * 初始化页面数据
   */
  getData: () => {
    var reqUrl = util.getRequestURL('getEquipmentWorkRecord.we');
    var param = {
      equipmentId: obj.data.equipmentid
    };

    // 开始时间
    var startTime = obj.data.startTime;
    if (startTime && startTime.indexOf('请') < 0) {
       param.startTime = startTime;
    }

    // 结束时间
    var endTime = obj.data.endTime;
    if (endTime && endTime.indexOf('请') < 0) {
      param.endTime = endTime + " 23:59:59";
    }

    // loading
    wx.showLoading({
      title: '加载中',
      mask: true
    })

    // 发起微信请求
    wx.request({
      url: reqUrl,
      dataType: 'json',
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: (res) => {
        obj.setData({
          list: res.data
        });
      },
      complete: (com) => {
        wx.hideLoading();
      }
    })
  },

  /**
   * 选择时间
   */
  chooseDate(e) {
    var key = e.currentTarget.dataset.key;
    obj.setData({
      showModalStatus: true,
      dateKey: key
    });
  },

  /**
   * 日历组件返回日期
   */
  saveSelectValue(res) {
     var key = obj.data.dateKey;
     var dou = {};
     if (res.detail.values) {
       dou.startTime = res.detail.values[0];
       dou.endTime = res.detail.values[1];
       dou.showModalStatus = false;
       obj.setData(dou);
       obj.getData();
     } else {
      dou.showModalStatus = false;
      obj.setData(dou);
     }
  }

})