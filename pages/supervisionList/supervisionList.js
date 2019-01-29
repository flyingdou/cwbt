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

    if (options.queryType) {
      obj.data.queryType = options.queryType;
    }

    if (options.queryType == 1) {
      wx.setNavigationBarTitle({title: '我发起的督导'});
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
    obj.data.supervisionList = [];
    this.getSupervisionList();
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
    obj.getSupervisionList();
  },

  goto: function (e) {
    var link = e.currentTarget.dataset.link;
    wx.navigateTo({
      url: link
    });
  },

  /**
   * 查询督导列表数据
   */
  getSupervisionList: function () {
    wx.showLoading({
      title: '数据加载中',
      mask: true
    });
    var url = util.getRequestURL('getSupervisionList.we');
    var param = { deptId: app.user.deptId, userId: app.user.id, userPriv: app.user.userPriv, queryType: obj.data.queryType, currentPage: obj.data.currentPage, pageSize: obj.data.pageSize };
    wx.request({
      url: url,
      dataType:'json',
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: function (res) {
        wx.hideLoading();
        var supervisionList = obj.data.supervisionList || [];
        supervisionList = supervisionList.concat(res.data);
        obj.setData({
          supervisionList: supervisionList
        });
      },
      fail: function (e) {
        wx.hideLoading();
        util.tipsMessage('网络异常！');
        console.log(e);
      }
    });
  }
})