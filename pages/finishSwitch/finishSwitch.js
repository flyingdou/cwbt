var app = getApp();
var util = require('../../utils/util.js');
var obj = null;
Page({

  /**
   * 页面的初始数据su
   */
  data: {
    blocksDiv1: [[
      { name: '周期工作卡', count: '', fun: 'goto', iconPath: '../../icon/send.png', link: '../workCardList/workCardList?queryType=1' },
      { name: '自行维修', count: '', fun: 'goto', iconPath: '../../icon/execute.png', link: '../workCardList/workCardList?queryType=2' },
      { name: '委外维修', count: '', fun: 'goto', iconPath: '../../icon/copy.png', link: '../workCardList/workCardList?queryType=3' }
    ]]
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
    // obj.getSupervisionCategoryCount();
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
   * 查询督导类别数量
   */
  getSupervisionCategoryCount() {
    var url = util.getRequestURL('getSupervisionCategoryCount.we');
    var param = { userId: app.user.id };
    wx.request({
      url: url,
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success(res) {
        obj.setData({
          categoryCount: res.data
        });
      },
      fail(e) {
        util.tipsMessage('网络异常！');
        console.log(e);
      }
    });
  },

  /**
   * 跳转页面
   */
  goto: function (e) {
    var link = e.currentTarget.dataset.link;
    wx.navigateTo({
      url: link
    });
  }
})