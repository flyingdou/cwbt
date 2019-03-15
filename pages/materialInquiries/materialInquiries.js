var app = getApp();
var util = require('../../utils/util.js');
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
    // 获取选择部门页面的数据
    if (wx.getStorageSync("deptObj")) {
      var deptObj = wx.getStorageSync("deptObj");
      obj.setData({
        deptObj: wx.getStorageSync("deptObj")
      });
      wx.removeStorageSync("deptObj");

      // 根据部门查询物资列表
      wx.showLoading({
        title: '数据加载中',
        mask: true
      });

      // 查询物资列表
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
   * 页面初始化
   */
  init: function () {
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

            // 查询物资列表
            obj.queryData();
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
   * 查询数据
   */
  queryData: function () {
    var url = util.getRequestURL('getMaterialList.we');
    var param = { page: 1, limit: 10 };

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
        var list = res.data.data;
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
  },

  /**
   * 跳转页面
   */
  goto: function (e) {
    var link = e.currentTarget.dataset.link;
    wx.navigateTo({
      url: link
    });
  }
})