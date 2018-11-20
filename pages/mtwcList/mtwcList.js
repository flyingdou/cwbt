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

    // 维修方式
    if (options.type) {
      obj.setData({
        type: options.type
      });
    }

    // 用户权限
    obj.setData({
      userPriv: app.user.userPriv 
    });
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
    this.getWorkCardList();
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

  goto: function (e) {
    var link = e.currentTarget.dataset.link;
    var index = e.currentTarget.dataset.index;
    var workCard = obj.data.workCardList[index];
    if (workCard.status == 9 && workCard.collectorpersonid != app.user.id) {
      wx.showModal({
        title: '提示',
        content: '该任务已被他人领取，请选择其他任务！',
        showCancel: false
      })
      return;
    }
    wx.navigateTo({
      url: link
    });
  },

  /**
   * 查询管理端临时工作卡列表数据
   */
  getWorkCardList: function () {
    var url = util.getRequestURL('getTemporaryWorkCardList.we');
    var param = { userPriv: app.user.userPriv, deptId: app.user.deptId, status: [1, 2, 4, 9, 14], overhaul_function: obj.data.type };
    wx.request({
      url: url,
      data: {
        json: JSON.stringify(param)
      },
      success: function (res) {
        obj.setData({
          workCardList: res.data
        });
      },
      fail: function (e) {
        util.tipsMessage('网络异常！');
        console.log(e);
      }
    });
  }
})