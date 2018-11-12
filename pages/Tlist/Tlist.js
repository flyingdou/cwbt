var app = getApp();
var obj = null;
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
    // 跳转页面类型 
    var queryType = options.queryType;
    if (queryType) {
      obj.data.queryType = queryType;
     }
     
     // 部门id
     var dept_id = options.dept_id;
     if (dept_id) {
       obj.data.dept_id = dept_id;
     }

     // 船舶id
     var boat_id = options.boat_id; 
     if (boat_id) {
       obj.data.boat_id = boat_id;
     }

     // 抽查标记
     var flag = options.flag;
     if (flag) {
       obj.data.flag = flag;
     }

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
    var reqUrl = app.constant.base_req_url + 'getWorkCardList.we';
    var param = {};
    var queryType = obj.data.queryType;
    if (queryType == 1) { // 周期工作列表
      param = {
        type: '1',
        dept_id: app.user.deptId,
        status: '1,9' // 未完成、进行中
      };
    } else if (obj.data.queryType == 2) { // 临时工作列表
      param = {
        type: '2',
        dept_id: app.user.deptId,
        status: '1,9' // 未完成、进行中
      };
    } else if (obj.data.queryType == 3) { // 抽查工作列表
      param = {
        type: '1,2',
        dept_id: app.user.deptId,
        status: '2,3' // 已完成、已验收
      };
    } 
    wx.request({
      url: reqUrl,
      dataType:'json',
      data:{
        requestType:'wechat',
        json: encodeURI(JSON.stringify(param))
      },
      success: (res) => {
        res = res.data;
        if (res.success) {
          obj.setData({
            taskList: res.workCardList
          });
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
    if (workCard.status == 9) {
      wx.showModal({
        title: '提示',
        content: '该工作已在进行中，请选择其他工作！',
        showCancel: false
      })
      return;
    }
    wx.redirectTo({
      url: '../../pages/workCardDetail/workCardDetail?workCardId=' + workCard.id,
    })
  }




})