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
    
    // 设置title
    wx.setNavigationBarTitle({
      title: options.title,
    })

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
    // 每次页面显示检查当前页面存在部门数据就查询工作卡统计
    var { deptObj } = obj.data;
    if (deptObj) {
      // 根据部门查询统计数据
      wx.showLoading({
        title: '数据加载中',
        mask: true
      });

      // 统计部门工作卡任务完成情况
      obj.statistics(deptObj.seq_id);
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
   * 页面初始化
   */
  init (e) {
    wx.showLoading({
      title: "数据加载中",
      mask: true
    });
    // 根据当前登录用户所在部门自动展现
    var reqUrl = util.getRequestURL('getDepartmentClass.we');
    var param = { id: app.user.deptId };
    wx.request({
      url: reqUrl,
      dataType: 'json',
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: (res) => {
        res = res.data;
        if (res.success) {
          var data = {
            lt: res.department.lt,
            count: res.department.count
          };
          if (data.count == 2) {
            var deptObj = data.lt[data.count];

            data.deptObj = deptObj;

            // 统计部门工作卡任务完成情况
            obj.statistics(deptObj.seq_id);
          }
          obj.setData(data);
          wx.hideLoading();
        }
      },
      fail(e) {
        wx.hideLoading();
      }
    });
  },

  /**
   * 去选择部门页面
   */
  toSelectDeptPage: function () {
    wx.navigateTo({
      url: '../chooseDept/chooseDept'
    });
  },

  /**
   * 统计查询
   */
  statistics: function (departmentid) {
    var url = util.getRequestURL('statisticsWcWorkcard.we');
    var param = { departmentid: departmentid };
    wx.request({
      url: url,
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      dataType: 'json',
      success(res) {
        if (res.data.list && res.data.list.length > 0) {
          var complete = 0, notComplete = 0, advance = 0, overdue = 0, sum = 0;
          res.data.list.forEach(function (item, i) {
            notComplete += item.number1;
            complete += item.number2;
            overdue += item.number3;
            advance += item.number4;
            sum += item.number5;
          });
          var data = [];
          data.push({ data: ((notComplete / sum) * 100), name: "未完成", sum: notComplete });
          data.push({ data: ((complete / sum) * 100), name: "正常完成", sum: complete });
          data.push({ data: ((advance / sum) * 100), name: "提前完成", sum: advance });
          data.push({ data: ((overdue / sum) * 100), name: "逾期完成", sum: overdue });
          obj.wxcharts = new wxcharts({
            canvasId: "pieCanvas",
            width: 300,
            height: 300,
            type: "pie",
            animation: true,
            series: data,
            dataLabel: true
          });
          obj.setData({
            statistics: data.concat([{ name: "总数", sum: sum }])
          }, wx.hideLoading());
        } else {
          var deptObj = obj.data.deptObj;
          deptObj.isHide = true;
          obj.setData({
            deptObj: deptObj
          }, wx.hideLoading());
          util.tipsMessage("该部门无统计数据");
        }
      },
      fail(e) {
        wx.hideLoading();
        util.tipsMessage("网络异常");
        console.log(e);
      }
    });
  }
})