var app = getApp();
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

    if (options.id) {
      obj.data.id = options.id;
    }

    if (options.creator) {
      obj.setData({
        creator: options.creator
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
    this.getSupervisionContentList();
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
    var param = { userId: app.user.id, deptId: app.user.deptId };
    wx.request({
      url: app.constant.base_req_url + 'getSupervisionContentList.we',
      data: {
        supervisionId: obj.data.id
      },
      success: function (res) {
        obj.setData({
          contents: res.data
        });
      },
      fail: function (e) {
        util.tipsMessage('网络异常！');
        console.log(e);
      }
    });
  },

  /**
   * 转发
   */
  reSend: function (e) {
    wx.navigateTo({
      url: `../releaseSupervision/releaseSupervision?id=${obj.data.id}&contents=${JSON.stringify(obj.data.contents)}`
    });
  },

  /**
   * 执行
   */
  implement: function (e) {

  }
})