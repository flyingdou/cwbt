var app = getApp();
var util = require('../../utils/util.js');
var obj = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentPage: 1,
    pageSize: 20
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    obj = this;

    if (options.boatId) {
      obj.setData({
        boatId: options.boatId
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
    obj.data.list = [];
    obj.data.currentPage = 1;
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
   * 查询数据
   */
  queryData: function () {
    var url = util.getRequestURL('getSpareByBoat.we');
    var param = { boatId: obj.data.boatId, currentPage: obj.data.currentPage, pageSize: obj.data.pageSize };

    // 测试数据
    // console.log(param);
    
    wx.showLoading({
      title: '加载中',
    })
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
        wx.hideLoading();
      }
    });
  },

  /**
   * 跳转页面
   */
  goto: (e) => {
    var link = e.currentTarget.dataset.link;
    wx.navigateTo({
      url: link
    });
  }
})