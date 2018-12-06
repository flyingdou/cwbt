var app = getApp();
var util = require('../../utils/util.js');
var obj = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    base_img_url: app.constant.base_img_url,
    overhaul_function: ["自行维修", "委外维修"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    obj = this;

    if (options.id) {
      obj.data.id = options.id;
    }

    if (options.type) {
      obj.setData({
        type: options.type
      });
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
    this.getTempFeedback();
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
   * 查询临时工作卡反馈数据
   */
  getTempFeedback: function () {
    var url = util.getRequestURL('getTempWorkcardFeedback.we');
    wx.request({
      url: url,
      data: {
        workcardId: obj.data.id
      },
      
      success: function (res) {
        res.data.image1 = JSON.parse(res.data.image1);
        res.data.image2 = JSON.parse(res.data.image2);
        obj.setData({
          feedback: res.data
        });
      },
      fail: function (e) {
        util.tipsMessage('网络异常！');
        console.log(e);
      }
    });
  },

  /**
   * 图片预览
   */
  preview1: (e) => {
    var imgs = [];
    var photos = obj.data.feedback.image1;
    for (var i = 0; i < photos.length; i++) {
      imgs.push(app.constant.base_img_url + '/' + photos[i].name);
    }
    console.log(imgs);
    var index = e.currentTarget.dataset.index;
    // 预览开始
    wx.previewImage({
      current: imgs[index],
      urls: imgs
    })
  },

  /**
   * 图片预览
   */
  preview2: (e) => {
    var imgs = [];
    var photos = obj.data.feedback.image2;
    for (var i = 0; i < photos.length; i++) {
      imgs.push(app.constant.base_img_url + '/' + photos[i].name);
    }
    console.log(imgs);
    var index = e.currentTarget.dataset.index;
    // 预览开始
    wx.previewImage({
      current: imgs[index],
      urls: imgs
    })
  },

  /**
   * 验收
   */
  valid: function () {
    wx.showLoading({
      title: '处理中',
      mark: true
    });
    var url = util.getRequestURL('updateWorkFeedBackStatus.we');
    var param = { id: obj.data.feedback.id, confirm_id: app.user.id };
    wx.request({
      url: url,
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: function (res) {
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '操作成功！',
          showCancel: false,
          complete: function () {
            wx.navigateBack({
              delta: 1
            });
          }
        });
      },
      fail: function (e) {
        wx.hideLoading();
        util.tipsMessage('网络异常！');
        console.log(e);
      }
    });
  }
})