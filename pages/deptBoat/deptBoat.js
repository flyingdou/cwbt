var app = getApp();
var util = require('../../utils/util.js');
var obj = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
     base_domain: app.constant.base_domain
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    obj = this;
    // 初始化页面数据
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
    var dept_id = app.user.deptId;
    var status = 0;
    obj.getData(dept_id, status);
    
  },

  /**
   * 点击机构，查询下级
   */
  next: (e) => {
    var navList = obj.data.navList;
    var nav = e.currentTarget.dataset.dept;
    var deptList = obj.data.deptList;
    var deptindex = e.currentTarget.dataset.deptindex;
    navList.push(nav);

    // 重置机构选中状态
    deptList.forEach((dept,index) => {
      dept.checked = false;
    });
    deptList[deptindex].checked = true;
    obj.setData({
       navList: navList,
       deptList: deptList
    });
    
    obj.getData(null, null);

  },

/**
 * 向上选择部门
 */
  up: (e) => {
    var index = e.currentTarget.dataset.index;
    var navList = obj.data.navList;

    // 选中当前部门，不做操作
    if (index == (navList.length - 1)) {
      return;
    }

    // 非当前部门，截取选中处之前的
    var doux = navList.slice(0, index + 1);
    obj.setData({
      navList: doux
    });

    obj.getData(null, null);
  },


  /**
   * 查询数据
   */
  getData: (dept_id, status) => {
     var reqUrl = util.getRequestURL('getDepartmentBoat.we');
     var param = {};

     var navList = obj.data.navList || [];
     if (dept_id) {
       // 初次访问该接口标识
       param.init = 1;
     }
     dept_id = dept_id || navList[navList.length -1].seq_id;
     param.dept_id = dept_id;
     
     // loading
     wx.showLoading({
       title: '加载中...',
     })

     wx.request({
       url: reqUrl,
       dataType: 'json',
       data: {
         json: encodeURI(JSON.stringify(param))
       },
       success: (res) => {
         res = res.data;
         var dou = {};
         if (res.success) {
           dou.deptList = res.deptBoatList;
           dou.boatList = res.boatList;
           if (status == 0) {
             navList.push(res.dept);
             dou.navList = navList;
           }
           // 存储数据
           obj.setData(dou);
         } else {
           console.log('请求数据出错！');
         }

       },
       complete: (com) => {
          wx.hideLoading();
       }
       
     })

  },

  /**
   * 预览图片
   */
  preview(e) {
    util.preview(e);
  },

  /**
   * 跳转到下一页面
   */
  goto (e) {
    var link = e.currentTarget.dataset.link;
    wx.navigateTo({
      url: link,
    })
  },



})