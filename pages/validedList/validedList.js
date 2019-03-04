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

     // 
     obj.data.queryType = options.queryType;

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
    obj.init(obj.data.queryType, 0);
    obj.init(obj.data.queryType, 1);
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
    // obj.data.currentPage++;
    // obj.init();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 初始化页面数据
   */
  init: (queryType, index) => {

    // loading
    wx.showLoading({
      title: '加载中',
    })
    var reqUrl = util.getRequestURL('getFinishedWorkcardList.we');
    
    var param = {};
    param.acceptor = app.user.id;

    // 根据标签状态查询对应数据
    if (index == 0) {
      // 验收
      param.status = [2];
    } else {
      // 驳回
      param.status = [3];
    }

    // 周期工作卡
    if (queryType == 1) {
       param.type = 1;
    }

    // 临时工作卡（自行维修）
    if (queryType == 2) {
      param.type = 2;
      param.overhaul_function = 0;
    }

    // 临时工作卡（委外维修）
    if (queryType == 3) {
      param.type = 2;
      param.overhaul_function = 1;
    }
    
    
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
          var titles = obj.data.titles;
          var workcardList = util.formatPlanTime(res.workcardList);
          titles.valid[index].list = workcardList;
          obj.setData({
            titles: titles,
            queryType: queryType
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
    var workCard = e.currentTarget.dataset.workcard;
    // 跳转传参
    var redUrl = '../../pages/validedDetail/validedDetail?workCardId=' + workCard.id + '&workCardStatus=' +   workCard.status;
    wx.navigateTo({
      url: redUrl,
    })
  },

})