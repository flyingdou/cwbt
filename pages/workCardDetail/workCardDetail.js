var app = getApp();
var obj = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusList:[],
    handleList: [],
    status:0,
    handle:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    obj = this;
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
    var statusList = [
      {id:0,name:"正常"},
      {id: 1,name: "异常"}
    ];
    var handleList = [
      {id: 0, name: "自维修"},
      {id: 1, name: "委外维修"}
    ];
    obj.setData({
      statusList: statusList,
      handleList: handleList
    });
  },

  /**
   * picker、输入框取值
   */
  pickerChange: (e) => {
    var key = e.currentTarget.dataset.key;
    var dou = {};
    dou[key] = e.detail.value;
    obj.setData(dou);
  }


})