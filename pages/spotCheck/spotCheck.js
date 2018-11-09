var app = getApp();
var obj = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModalStatus:false, // 默认禁用
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
   * 展示弹出框
   */
  choose: () => {
    obj.setData({
      showModalStatus: true
    });
  },

  /**
   * 弹出框关闭
   */
  test: (e) => {
    obj.setData({
      showModalStatus: false
    });
    var dept_id = 211;
    if (e.detail.type == 'success') {
      dept_id = e.detail.value;
    }

    obj.setData({
      dept_id: dept_id
    });

  },
  
  // 跳转页面
  goto: (e) => {
    var dept_id = obj.data.dept_id;
    if (!dept_id) {
      wx.showModal({
        title: '提示',
        content: '请选择需要抽查的处！',
        showCancel: false
      })
      return;
    }

    // 类型
    var queryType = e.currentTarget.dataset.querytype;

    // 跳转页面
    wx.redirectTo({
      url: '../../pages/Tlist/Tlist?dept_id=' + dept_id + '&queryType=' + queryType + '&flag=spotCheck',
    })
    
  }

  
})