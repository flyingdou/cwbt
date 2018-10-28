var obj = null;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex:0,
    base_req_url:app.constant.base_req_url,
    taskList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    obj = this;
    obj.init();
    obj.getTaskList();
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
   * 用户点击、滑动切换tab
   */
  changeCurrentIndex: function (e) {
    var obj = this;
    // 滑动切换
    if (e.detail.source == 'touch') {
      obj.setData({
        currentIndex: e.detail.current
      })
    }

    // 点击切换
    if (e.currentTarget.dataset.index || e.currentTarget.dataset.index === 0) {
      obj.setData({
        currentIndex: e.currentTarget.dataset.index
      })
    }

  },

  /**
   * init
   */
  init: function () {
    var obj = this;
    var sysInfo = wx.getSystemInfoSync();
    var rate = 750 / sysInfo.windowWidth;
    var swiperHeight = (sysInfo.windowHeight - 40) * rate;
    obj.setData({
      swiperHeight: swiperHeight
    })
  },


  getTaskList:  function () {
      // 请求数据
    var reqUrl = obj.data.base_req_url + "deviceCard/getDeviceCardList.we"
      wx.request({
        url: reqUrl,
        dataType:"json",
        data:{
          requsetType:"wechat"
        },
        success: res => {
          if (res.data.success) {
            obj.setData({
              taskList: res.data.deviceCardList
            });
          } else {
            console.log("请求数据失败！");
          }
        }
      })
      
  },

  /**
   * 跳转工作票或者点检反馈
   */
  gotoTask: (e) => {
    var index = e.currentTarget.dataset.index;
    var task = obj.data.taskList[index];
    var url = '';
    if (task.job_properties == 1) {
        url = '../../pages/checkFeedback/checkFeedback';
    } else {
        url = '../../pages/workTicket/workTicket';
    }
    url = url + '?id=' + task.id;

    // 跳转页面
    wx.navigateTo({
      url: url,
    })

    

  }

})