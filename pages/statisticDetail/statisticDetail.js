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
 

    // 船舶id
    if (options.boatId) {
      obj.data.boatId = options.boatId;
    }
    
    // 开始时间
    if (options.startDate) {
      obj.data.startDate = options.startDate;
    }

    // 结束时间
    if (options.endDate) {
      obj.data.endDate = options.endDate;
    }

    // type
    if (options.type) {
      obj.data.type = options.type;
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
    this.queryData();
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
   * 查询数据
   */
  queryData: function () {
    var url = util.getRequestURL('statisticsdetails.we');
    var param = { boatid: obj.data.boatId };
    var style = 0;
    if (obj.data.startDate) {
      param.begintime = obj.data.startDate;
    }
    if (obj.data.endDate) {
      param.endtime = obj.data.endDate;
    }
    if (obj.data.type == 'handle') {
      style = 1;
    }
    if (obj.data.type == 'valid') {
      style = 2;
    }

    param.style = style;


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
        obj.setData({
          list: res.data.list
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
  }

})