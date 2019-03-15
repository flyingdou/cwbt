var app = getApp();
var util = require('../../utils/util.js');
import wxCharts from '../../utils/wxcharts-min.js';
var obj = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showMark: false
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
    // 查询统计数据
    var { deptObjList, startDate, endDate, material } = obj.data;
    if (deptObjList && startDate && endDate && material) {
      obj.queryData();
    }
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
   * 跳转页面
   */
  goto: function (e) {
    var { link } = e.currentTarget.dataset;
    if (link) {
      wx.navigateTo({
        url: link
      });
    }
  },

  /**
   * 弹起日历
   */
  showMark: function (e) {
    obj.setData({
      showMark: true
    });
  },

  /**
   * 时间选择器改变
   */
  dateChange: function (e) {
    if (e.detail.values) {
      var [ startDate, endDate ] = e.detail.values;
      obj.setData({ startDate, endDate});
    }
    obj.setData({ showMark: false });
  },

  /**
   * 查询数据
   */
  queryData: function () {
    var { deptObjList, startDate, endDate, material } = obj.data;
    var url = app.constant.server_url + "/WcMaterialout/selecttoeacharts3";
    var param = { materialid: material.id, time: `${startDate}~${endDate}`, list: '' }
    deptObjList.forEach((item, index) => (param.list += item.seq_id + ( index == deptObjList.length - 1 ? '' : ',')));
    wx.showLoading({
      title: "数据加载中",
      mask: true
    });
    wx.request({
      url: url,
      data: param,
      success(res) {
        var { data } = res.data;
        obj.setData({ data }, wx.hideLoading());

        // 调用统计图绘制
        obj.renderCharts(data);
      },
      fail(e) {
        wx.hideLoading();
        util.tipsMessage("网络异常");
        console.log(e);
      }
    });
  },

  /**
   * 绘制统计图
   */
  renderCharts: function (data) {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    // 设置统计图数据
    var chartData = { title: '物资消耗量', data: [], categories: [], unitname: "" }
    data.forEach((item, index) => {
      chartData.data = [...chartData.data, parseFloat(item.sumnumber)];
      chartData.categories = [...chartData.categories, item.departmentname];
      chartData.unitname = item.unitname;
    });
    obj.setData({ chartData });
    obj.columnChart = new wxCharts({
      canvasId: 'columnCanvas',
      type: 'column',
      animation: true,
      categories: chartData.categories,
      series: [{
        name: '消耗量',
        data: chartData.data,
        format: function (val, name) {
          return val.toFixed(2) + chartData.unitname;
        }
      }],
      yAxis: {
        format: function (val) {
          return val + chartData.unitname;
        },
        title: '',
        min: 0
      },
      xAxis: {
        disableGrid: false,
        type: 'calibration'
      },
      extra: {
        column: {
          width: 15
        }
      },
      width: windowWidth,
      height: 200,
    });
  }
})