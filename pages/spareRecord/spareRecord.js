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

    if (options.spareId) {
      obj.setData({
        spareId: options.spareId
      });
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
    obj.data.currentPage = app.pageInfo.currentPage;
    obj.data.list = [];
    obj.queryData();
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
    obj.queryData();
  },

  /**
   * 数据
   */
  queryData: function (reset) {
    var url = util.getRequestURL('getSpareRecordBySpare.we');
    var param = { spareId: obj.data.spareId, currentPage: obj.data.currentPage, pageSize: obj.data.pageSize };
    wx.request({
      url: url,
      dataType:'json',
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: function (res) {
        var list = obj.data.list || [];
        list = list.concat(res.data);
        obj.setData({
          list: list
        });
      },
      fail: function (e) {
        util.tipsMessage('网络异常！');
        console.log(e);
      },
      complete: (xe) =>{
        
      }
    });
  }
})