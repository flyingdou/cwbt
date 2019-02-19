import * as echarts from '../../ec-canvas/echarts';
var app = getApp();
var util = require('../../utils/util.js');
var obj = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {}
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
        data.push({value: Math.round((notComplete/sum) * 100), name: "未完成"});
        data.push({value: Math.round((complete/sum) * 100), name: "正常完成"});
        data.push({value: Math.round((advance/sum) * 100), name: "提前完成"});
        data.push({value: Math.round((overdue/sum) * 100), name: "逾期完成"});
        obj.data.optionData = data;
        obj.echartInit(e);
        wx.hideLoading();
      },
      fail(e) {
        wx.hideLoading();
        util.tipsMessage("网络异常");
        console.log(e);
      }
    });
  },

  /**
   * echart初始化
   */
  echartInit (e) {
    obj.initChart(e.detail.canvas, e.detail.width, e.detail.height);
  },

  /**
   * 饼图初始化
   */
  initChart(canvas, width, height) {
    const chart = echarts.init(canvas, null, {
      width: width,
      height: height
    });
    canvas.setChart(chart);
    chart.setOption(obj.getOption());
    return chart;
  },

  /**
   * 获取饼图数据
   */
  getOption () {
    var option = {
      backgroundColor: "#ffffff",
      color: ["#37A2DA", "#32C5E9", "#67E0E3", "#91F2DE", "#FFDB5C", "#FF9F7F"],
      animation: true,
      series: [{
        label: {
          normal: {
            fontSize: 14
          }
        },
        type: 'pie',
        center: ['50%', '50%'],
        radius: [0, '60%'],
        data: obj.data.optionData,
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 2, 2, 0.3)'
          }
        }
      }]
    };
    return option;
  }
})