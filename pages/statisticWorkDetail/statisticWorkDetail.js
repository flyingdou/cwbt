var app = getApp();
var util = require('../../utils/util.js');
var obj = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    base_img_url: app.constant.base_img_url
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    obj = this;

    // 保存工作卡id
    if (options.workId) {
      obj.data.workId = options.workId;
    }

    this.queryData();
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
   * 查询数据
   */
  queryData: function () {
    var param = {
      id: obj.data.workId
    };
    var reqUrl = util.getRequestURL('getWorkDetailById.we');
    
    // 请求数据
    wx.request({
      url: reqUrl,
      dataType: 'json',
      data:{
        json: encodeURI(JSON.stringify(param))
      },
      success: (res) => {
        res = res.data;
        if (res.success) {
          if (res.workFeedback) {
            var workFeedback = res.workFeedback;
            if (workFeedback.image) {
              workFeedback.image = JSON.parse(workFeedback.image);
            }
            obj.setData({
              photos: workFeedback.image,
              workFeedback: workFeedback
            });
          }
          obj.setData({
            workDetail: res.workDetail
          });
        } 
        if (!res.success) {
          console.log('程序异常！');
        }
      },
      fail: (e) => {
        console.log('网络异常！');
      }
    });
  },

  /**
   * 图片预览
   */
  preview: (e) => {
    util.preview(e);
  }

})