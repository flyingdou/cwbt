var app = getApp();
var util = require('../../utils/util.js');
var obj = {};
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

    if (options.id) {
      obj.data.id = options.id;
    }

    if (options.sort) {
      obj.data.sort = options.sort;
    }

    if (options.creator) {
      obj.setData({
        creator: options.creator
      });
    }

    obj.setData({
      userId: app.user.id,
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
    obj.getSupervisionContentList();
    obj.getSupervisFeedBack();
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
   * 查询督导内容列表
   */
  getSupervisionContentList: function () {
    var url = util.getRequestURL('getSupervisionContentList.we');
    var param = { supervisionId: obj.data.id }
    wx.request({
      url: url,
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: function (res) {
        obj.setData({
          supervise: res.data
        });
      },
      fail: function (e) {
        util.tipsMessage('网络异常！');
        console.log(e);
      }
    });
  },

  /**
   * 查询督导反馈
   */
  getSupervisFeedBack: function () {
    var url = util.getRequestURL('getSupervisFeedBack.we');
    wx.request({
      url: url,
      data: {
        supervisionId: obj.data.id
      },
      success: function (res) {
        if (res.data) {
          res.data.image = JSON.parse(res.data.image);
          obj.setData({
            superviseFeedback: res.data
          });
        }
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
  preview: (e) => {
    var imgs = [];
    var photos = obj.data.superviseFeedback.image;
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
   * 转发
   */
  reSend: function (e) {
    wx.navigateTo({
      url: `../releaseSupervise/releaseSupervise?id=${obj.data.id}&contents=${JSON.stringify(obj.data.supervise.contents)}`
    });
  },

  /**
   * 执行
   */
  implement: function (e) {
    var boat = obj.data.supervise.boat ? `&boat=${obj.data.supervise.boat}` : "";
    var device = obj.data.supervise.device ? `&device=${obj.data.supervise.device}` : "";
    var deviceNumber = obj.data.supervise.deviceNumber ? `&deviceNumber=${obj.data.supervise.deviceNumber}` : "";
    wx.navigateTo({
      url: `../supervise/supervise?id=${obj.data.id}&creator=${obj.data.supervise.creator}${boat}${device}${deviceNumber}&contents=${JSON.stringify(obj.data.supervise.contents)}`
    });
  }
})