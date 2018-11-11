var app = getApp();
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
    var reqUrl = app.constant.base_req_url + 'getWorkfeedbackDetail.we';
    var valid = {};
    wx.request({
      url: reqUrl,
      dataType: 'json',
      data: {
        id: id
      },
      success: (res) => {
        res = res.data;
        res.image = JSON.parse(res.image);
        valid = res;
        obj.setData({
          valid: valid
        });
      }
    })
  },

 /**
  * 验收
  */
  valid: () => {
    var reqUrl = app.constant.base_req_url + 'updateWorkFeedBackStatus.we';
    var param = {
      id:obj.data.id,
      confirm_id: app.user.id
    };
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
            content: '验收成功！',
            showCancel:false,
            success: (rex) => {
              if (rex.confirm){
                wx.navigateBack({
                  delta: 1
                })
              }
            }
            
          })
        }
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
    console.log(imgs);
    var index = e.currentTarget.dataset.index;
    // 预览开始
    wx.previewImage({
      current: imgs[index],
      urls: imgs
    })
  },


})