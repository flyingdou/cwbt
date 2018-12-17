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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },



  /**
   * 初始化页面数据
   */
  init: () => {
    var navList = [
      {
        "name":"荆州航道处",
        "deptid":21
      },
      {
        "name": "荆州测绘中心",
        "deptid": 216
      }
    ];
    obj.setData({
      navList: navList
    });

    var reqUrl = util.getRequestURL('getDepartmentUser.we');
    var param = {};
    param.dept_id = app.user.deptId;
    param.type = 'nextDept';
    
    // 请求中
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: reqUrl,
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      dataType: 'json',
      success:(res) => {
        res = res.data;
        if (res.success) {
          obj.setData({
            deptList: res.deptList,
            userList: res.userList
          });
        }
      },
      complete: (rx) => {
        wx.hideLoading();
      }
    })

  },

})