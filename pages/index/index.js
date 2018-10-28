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
   * 前往工作任务列表
   */
  goto: (e) => {
     var type = e.currentTarget.dataset.type;
     var url = '';
     if (type == 'meetting') {
       wx.showModal({
         title: '提示',
         content: '暂无会议通知！',
         showCancel: false
       })
       return;
     }
      if (type == 'random') {
        wx.showModal({
          title: '提示',
          content: '暂无临时任务！',
          showCancel: false
        })
        return;
      }
      if (type == 'task') {
          url = '../../pages/taskList/taskList';
      }
      wx.navigateTo({
        url: url,
      })
  }

})