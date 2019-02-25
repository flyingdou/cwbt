var app = getApp();
var util = require('../../utils/util.js');
var obj = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskList: [],
    titles: {
      valid: [
        { title: '未验收', checkStatusKey: 'typeStatus', checkStatus: 1 },
        { title: '已验收', checkStatusKey: 'typeStatus', checkStatus: 2 },
        { title: '驳回', checkStatusKey: 'typeStatus', checkStatus: 3 }
      ]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     obj = this;
     obj.init();

     obj.setData({
      windowHeightRpx: util.getSystemInfo().windowHeightRpx
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
    obj.data.currentPage++;
    obj.init();
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

    // loading
    wx.showLoading({
      title: '加载中',
    })
    var reqUrl = util.getRequestURL('getFinishedWorkcardList.we');
    
    var param = {};
    param.user_id = app.user.id;
    
    
    // 分页
    // console.log(param);
    // return;
    wx.request({
      url: reqUrl,
      dataType:'json',
      data:{
        json: encodeURI(JSON.stringify(param))
      },
      success: (res) => {
        res = res.data;
        if (res.success) {
          var taskList = obj.data.taskList;
          var workcardList = util.formatPlanTime(res.workcardList);
          taskList = taskList.concat(workcardList);
          obj.setData({
            taskList: taskList
          });
          // 数据存储完再隐藏
          wx.hideLoading();
        }
      }
    })

  },

  /**
   * 跳转到任务详情页面
   */
  goto: (e) => {
    var index = e.currentTarget.dataset.index;
    var workCard = obj.data.taskList[index];
    // 跳转传参
    var redUrl = '../../pages/workCardDetail/workCardDetail?workCardId=' + workCard.id + '&workCardStatus=' + workCard.status;
    wx.navigateTo({
      url: redUrl,
    })
  },

})