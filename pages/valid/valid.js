var app = getApp();
var util = require('../../utils/util.js');
var obj = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    base_img_url: app.constant.base_img_url,
    isHidden: true

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    obj = this;
    var id = options.id;
    if (!id) {
      id = 7
    }
    obj.data.id = id;
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
    var id = obj.data.id;
    // 发起请求
    var reqUrl = util.getRequestURL('getWorkfeedbackDetail.we');
    var valid = {};
    wx.request({
      url: reqUrl,
      dataType: 'json',
      data: {
        id: id
      },
      success: (res) => {
        res = res.data;
        if (res.image) {
           res.image = JSON.parse(res.image);
        }
        if (res.eimage) {
           res.eimage = JSON.parse(res.eimage);
        }
        valid = res;
        obj.setData({
          valid: valid
        });
      }
    })
  },

 /**
  * 弹出验收框
  */
 valid: (e) => {
   var status = e.currentTarget.dataset.status;
   obj.setData({
     status: status,
     isHidden: false,
   });
 },


  /**
   * 弹出框取消
   */
  cancel: () => {
    obj.setData({
      isHidden: true,
      validRemark: ''
    });
  },

  /**
   * 弹出框确定
   */
  confirm: () => {
    // 数据校验
    var validRemark = obj.data.validRemark;
    var status = obj.data.status;
    if (status == '3' && (!validRemark || validRemark == '')) {
      wx.showModal({
        title: '提示',
        content: '请填写驳回意见！',
        showCancel: false,
      })
      return;
    }

    obj.setData({
      isHidden: true,
    });

    // 验收、驳回
    obj.updateStatus();

  },

  /**
   * inputChange
   */
  inputChange: (e) => {
    var key = e.currentTarget.dataset.key;
    var dou = {};
    dou[key] = e.detail.value;
    obj.setData(dou);
  },


  /**
  * 验收
  */
  updateStatus: () => {
    var reqUrl = util.getRequestURL('updateWorkFeedBackStatus.we');
    var param = {
      id: obj.data.id,
      confirm_id: app.user.id,
      status: obj.data.status,
      valid_remark: obj.data.validRemark,
    };

    // 驳回的情况
    if (param.status == 3) {
      var valid = obj.data.valid;
      var subParam = {
        creator: app.user.id,
        content: param.valid_remark,
        recUser: valid.operator_id,
        sourceWork: valid.workcardid
      };
      param.supervision = subParam;
    }

    // 测试数据
    // console.log(param);
    // return;


    wx.showLoading({
      title: '处理中',
      mask: true
    })
    wx.request({
      url: reqUrl,
      dataType: 'json',
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: (res) => {
        res = res.data;
        if (res.success) {
          wx.showModal({
            title: '提示',
            content: '操作成功！',
            showCancel: false,
            success: (rex) => {
              if (rex.confirm) {
                wx.navigateBack({
                  delta: 1
                })
              }
            }

          })
        }
      },
      complete: (rd) => {
        wx.hideLoading();
      }
    })
  },

  /**
   * 图片预览
   */
  preview: (e) => {
    var imgs = [];
    var photos = obj.data.valid.image;
    for (var i = 0; i < photos.length; i++) {
      imgs.push(app.constant.base_img_url + '/' + photos[i].name);
    }
    // console.log(imgs);
    var index = e.currentTarget.dataset.index;
    // 预览开始
    wx.previewImage({
      current: imgs[index],
      urls: imgs
    })
  },


})