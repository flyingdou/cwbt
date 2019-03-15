var app = getApp();
var util = require('../../utils/util.js');
var wxCharts = require('../../utils/wxcharts-min.js');
var obj = null;
var columnChart = null;
var chartData = {};
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
    // 展示页面时即调用
    obj.getData();
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
      var [startDate, endDate] = e.detail.values;
      obj.setData({
        startDate,
        endDate,
        showMark: false,
        timeStr: startDate + '~' + endDate
      });

      // 日期选择成功，即调用
      obj.getData();
    } else {
      obj.setData({
        showMark: false
      });
    }
  },
  
  /**
   * 参数检查
   */
  checkParam () {
    var deptObj = obj.data.deptObj;
    var timeStr = obj.data.timeStr;
    var material = obj.data.material;
    // 三者不满其一，则数据校验失败
    if (!deptObj || !timeStr || !material) {
       return false;
    }
   
    var param = {};
    param.departmentid = deptObj.seq_id;
    param.time = timeStr;
    param.materialid = material.id;

    obj.data.param = param;
    return true;

  },

  /**
   * 查询统计数据
   */
  getData () {
    if (!obj.checkParam()) {
       return;
    }

    // 参数校验通过，请求数据
    var reqUrl = app.constant.server_url + 'WcMaterialout/selecttoeacharts1.we';
    var param = obj.data.param;
    
    // loading
    wx.showLoading({
      title: '加载中',
    })

    // request
    wx.request({
      url: reqUrl,
      data: param,
      success (res) {
        res = res.data.data;
        var categories = [];
        var datas = [];
        res.forEach((item)=> {
            categories.push(item.mon + '月');
            datas.push(parseFloat(item.sumnumber));
        });
        obj.setData({
          unit: res[0].unitname
        });
        chartData.categories = categories;
        chartData.datas = datas;
        chartData.unit = res[0].unitname;

        obj.photoGraph();
        wx.hideLoading();
      },
      fail (f) {
        wx.hideLoading();
      }
    })
  },

  /**
   * 画图
   */
  photoGraph () {
     var windowWidth = 320;
        try {
          var res = wx.getSystemInfoSync();
          windowWidth = res.windowWidth;
        } catch (e) {
          console.error('getSystemInfoSync failed!');
        }
        // console.log(obj.data);

        columnChart = new wxCharts({
            canvasId: 'columnCanvas',
            type: 'column',
            animation: true,
            categories: chartData.categories,
            series: [{
                name: '消耗量',
                data: chartData.datas,
                format: function (val, name) {
                    return val.toFixed(2) + chartData.unit;
                }
            }],
            yAxis: {
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