var app = getApp();
var util = require('../../utils/util.js');
var obj = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titles: [
      {title: "待审批"},
      {title: "审批通过"},
      {title: "审批拒绝"}
    ],
    currentPage: app.pageInfo.currentPage,
    pageSize: app.pageInfo.pageSize
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    obj = this;

    // 维修方式
    var type = options.type;
    var title = '';
    if (type == 0) {
       title = '自行维修报审表';
    } else {
       title = '委外维修报审表';
    }
    
    wx.setNavigationBarTitle({
      title: title,
    })


    obj.setData({
      type: type,
      userPriv: app.user.userPriv,
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
    obj.data.currentPage = app.pageInfo.currentPage;
    obj.data.workCardList = [];

    // 待审批
    this.getWorkCardList(0, 0, 1);

    // 审批通过
    this.getWorkCardList(1, 1, 0);

    // 审批拒绝
    this.getWorkCardList(2, 2, 1);
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

  goto: function (e) {
    var link = e.currentTarget.dataset.link;
    var workCard = e.currentTarget.dataset.workcard;
    var type = obj.data.type;
    wx.navigateTo({
      url: link
    });
  },

  /**
   * 查询管理端审批列表数据
   */
  getWorkCardList: function (queryType, audit_status, isdel) {
    // loading
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var workCardList = obj.data.workCardList || [];
    var url = util.getRequestURL('getTemporaryWorkCardList.we');
    var param = { 
      userPriv: app.user.userPriv,
      deptId: app.user.deptId, 
      overhaul_function: obj.data.type,
      // queryType: queryType,
      audit_status: audit_status,
      isdel: isdel
    };
    
    wx.request({
      url: url,
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: function (res) {
        if (queryType || queryType == 0) {
          var titles = obj.data.titles;
          titles[queryType].workCardList = res.data; 
          obj.setData({
            titles: titles
          }, wx.hideLoading());
        } else {
          obj.setData({
            workCardList: res.data
          }, wx.hideLoading());
        }
      },
      fail: function (e) {
        util.tipsMessage('网络异常！');
        console.log(e);
        wx.hideLoading();
      }
    });
  }
})