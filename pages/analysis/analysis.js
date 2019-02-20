var app = getApp();
var util = require('../../utils/util.js');
var wxcharts = require('../../utils/wxcharts-min.js');
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

    // 页面初始化
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
   * 页面初始化
   */
  init (e) {
    wx.showLoading({
      title: "数据加载中",
      mask: true
    });
    var url = util.getRequestURL('statisticsWcWorkcard.we');
    var param = {departmentid: 216};
    wx.request({
      url: url,
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      dataType: 'json',
      success(res) {
        var complete = 0, notComplete = 0, advance = 0, overdue = 0, sum = 0;
        res.data.list.forEach(function (item, i) {
          notComplete += item.number1;
          complete += item.number2;
          overdue += item.number3;
          advance += item.number4;
          sum += item.number5;
        });
        var data = [];
        data.push({data: ((notComplete/sum) * 100), name: "未完成"});
        data.push({data: ((complete/sum) * 100), name: "正常完成"});
        data.push({data: ((advance/sum) * 100), name: "提前完成"});
        data.push({data: ((overdue/sum) * 100), name: "逾期完成"});
        obj.wxcharts = new wxcharts({
          canvasId: "pieCanvas",
          width: 300,
          height: 300,
          type: "pie",
          animation: true,
          series: data,
          dataLabel: true
        });
        wx.hideLoading();
      },
      fail(e) {
        wx.hideLoading();
        util.tipsMessage("网络异常");
        console.log(e);
      }
    });
  }
})