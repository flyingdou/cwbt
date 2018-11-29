var app = getApp();
var util = require('../../utils/util.js');
var obj = {};

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
    // 如果用户未登录则返回登录页面
    if (!app.user.id) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        showCancel: false,
        complete: () => {
          wx.switchTab({
            url: '../index/index'
          });
        }
      });
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
  goto: (e) => {
    var link = e.currentTarget.dataset.link;
    var message = e.currentTarget.dataset.message;
    var key = e.currentTarget.dataset.key;
    var value = e.currentTarget.dataset.value;
    if (key && value) {
      wx.setStorageSync(key, obj.data[value]);
    }
    if (link && link != '') {
      wx.navigateTo({
        url: link
      });
    } else {
      wx.showModal({
        title: '提示',
        content: message,
        showCancel: false
      });
    }
  },

  /**
   * 查询设备信息
   */
  getEquipmentInfo: (e) => {
    var link = e.currentTarget.dataset.link;

    // 正式环境执行代码
    if (!app.constant.isDev) {
      wx.scanCode({
        scanType: ['barCode', 'qrCode'],
        success: (res) => {
          wx.navigateTo({
            url: link + '?code=' + res.result
          });
        }
      });
    }

    // 开发环境执行代码
    if (app.constant.isDev) {
      wx.navigateTo({
        url: link + '?code=0000123'
      });
    }
  },

  /**
   * 注销
   */
  cancellation: () => {
    wx.showModal({
      title: '提示',
      content: '是否确定注销？',
      success: (res) => {
        if (res.confirm) {
          // 清除用户记录
          app.user = {};
          wx.removeStorageSync('user');
          // 返回登录页面
          wx.switchTab({
            url: '../index/index'
          });
        }
      }
    });
  },

  /**
   * 修改密码
   */
  updatePassword:() => {
     var url = '../../pages/updatePWD/updatePWD';
     wx.navigateTo({
       url: url,
     })
  },

  /**
   * init
   */
  init: () => {
    var chooseList = [
      { "name": "执行统计", "link": "../statistics/statistics?type=handle" },
      { "name": "验收统计", "link": "../statistics/statistics?type=valid" },
    ];
    var chooseStatistics = {
      name: '数据类型',
      chooseList: chooseList
    };
    obj.setData({
      chooseStatistics: chooseStatistics
    });
  },

})