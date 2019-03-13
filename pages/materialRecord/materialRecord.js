var app = getApp();
var util = require('../../utils/util.js');
var obj = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusTypes: [ "无", "消耗" ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    obj = this;

    // 接收参数
    if (options.deptId) {
      obj.data.deptId = options.deptId;
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
    // 查询数据
    obj.data.currentPage = app.pageInfo.currentPage;
    obj.data.pageSize = app.pageInfo.pageSize;
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
    // 加载下一页数据
    obj.data.currentPage++;
    obj.queryData();
  },

  /**
   * 查询数据
   */
  queryData: function () {
    var url = util.getRequestURL('getMaterialRecord.we');
    var param = { deptId: obj.data.deptId, currentPage: obj.data.currentPage, pageSize: obj.data.pageSize };

    // 测试数据
    // console.log(param);

    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: url,
      dataType: 'json',
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: function (res) {
        var list = obj.data.list || [];
        list = list.concat(res.data);
        obj.setData({
          list: list
        }, wx.hideLoading());
      },
      fail: function (e) {
        wx.hideLoading();
        util.tipsMessage('网络异常！');
        console.log(e);
      }
    });
  }
})