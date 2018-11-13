var app = getApp();
var obj = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModalStatus: false, // 默认禁用
    array0: []
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
   * 初始化页面
   */
  init: () => {
    var array0 = [
      { 'id': 9, 'name': '----' },
      {'id':10,'name':'荆州处'},
      {'id':11,'name':'武汉处'},
      {'id':12,'name':'长沙处'},
      {'id':13,'name':'岳阳处'}
    ];
    obj.setData({
      array0: array0,
      array0Value:'----'
    });
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
    console.log(e.detail);

  },
  
  /**
   * 选择变化
   */
  pickerChange: (e) => {
    var index = e.detail.value;
    var flag = e.currentTarget.dataset.flag;
    
    
  }




})