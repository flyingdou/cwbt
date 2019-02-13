var app = getApp();
var util = require('../../utils/util.js');
var obj = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentPage: app.pageInfo.currentPage,
    pageSize: app.pageInfo.pageSize,
    titles: {
      1: [
        { title: '进行中', checkStatusKey: 'workstatus', checkStatus: 2 },
        { title: '已完结', checkStatusKey: 'workstatus', checkStatus: 1 }
      ],
      2: [
        { title: '待办事项', checkStatusKey: 'typeStatus', checkStatus: 1 },
        { title: '已办事项', checkStatusKey: 'typeStatus', checkStatus: 2 }
      ]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    obj = this;
    var dou = {};

    if (options.queryType) {
       dou.queryType = options.queryType;
    }

    if (options.queryType == 1) {
      wx.setNavigationBarTitle({title: '我发起的督导'});
    }
    if (options.queryType == 2) {
      wx.setNavigationBarTitle({ title: '督办事项' });
    }

    dou.windowHeightRpx = util.getSystemInfo().windowHeightRpx;

    obj.setData(dou);

    obj.getSupervisionList(0);
    obj.getSupervisionList(1);
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
  },

  goto: function (e) {
    var link = e.currentTarget.dataset.link;
    wx.navigateTo({
      url: link
    });
  },

  /**
   * 查询督导列表数据
   */
  getSupervisionList: function (status) {
    wx.showLoading({
      title: '数据加载中',
      mask: true
    });
    var url = util.getRequestURL('getSupervisionList.we');
    var param = { deptId: app.user.deptId, userId: app.user.id, userPriv: app.user.userPriv, queryType: obj.data.queryType, status: status };
    wx.request({
      url: url,
      dataType:'json',
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: function (res) {
        wx.hideLoading();
        
       var queryType = obj.data.queryType;
       if (queryType == 1 || queryType == 2) {
            var titles = obj.data.titles;
            titles[queryType][status].supervisionList = res.data;
            obj.setData({
              titles: titles
            });
       } else {
         obj.setData({
           supervisionList: res.data
         });
       }
      },
      fail: function (e) {
        wx.hideLoading();
        util.tipsMessage('网络异常！');
        console.log(e);
      }
    });
  }
})