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
      {title: "已审批"},
      {title: "已完成"}
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
       title = '自行工作单列表';
    } else {
       title = '委外工作单列表';
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
    // 自行维修不分tab，委外维修分三个tab
    if (obj.data.type == 0) {
      this.getWorkCardList();
    } else {
      this.getWorkCardList(0);
      this.getWorkCardList(1);
      this.getWorkCardList(2);
    }
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
     // 上拉加载，分页查询
     // obj.data.currentPage++;
     // obj.getWorkCardList();
  },

  goto: function (e) {
    var link = e.currentTarget.dataset.link;
    var workCard = e.currentTarget.dataset.workcard;
    // console.log('index: ' + index + ', workCardList: ' + JSON.stringify(obj.data.workCardList));
    var type = obj.data.type;
    if (workCard.status == 9 && workCard.collectorpersonid != app.user.id && type == 0) {
      wx.showModal({
        title: '提示',
        content: '该任务已被他人领取，请选择其他任务！',
        showCancel: false
      })
      return;
    }
    wx.navigateTo({
      url: link
    });
  },

  /**
   * 查询管理端临时工作卡列表数据
   */
  getWorkCardList: function (queryType) {
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
      status: [1, 2, 9],
      queryType: queryType
    };
    if (queryType == 0) {
      param.status = [1];
    } else if (queryType == 1) {
      param.status = [9];
    } else if (queryType == 2) {
      param.status = [2];
    }
    wx.request({
      url: url,
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: function (res) {
        // workCardList = workCardList.concat(res.data);
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