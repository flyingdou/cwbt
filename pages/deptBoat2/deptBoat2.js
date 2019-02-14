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

    var dou = {};
    // 传入数据
    var navList = options.navList;
    var nav = options.nav;
    if (navList) {
        navList = JSON.parse(navList);
        nav = JSON.parse(nav);
        navList.push(nav);
        dou.navList = navList;
     }
     dou.isLoad = true;
     obj.setData(dou);
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
    var isLoad = obj.data.isLoad;
    if (isLoad) {
       obj.data.isLoad = false;
    } else {
       var navList = obj.data.navList;
       // 删掉navList的末级
       navList.splice(navList.length-1,1);
      //  console.log(navList);
       obj.setData({
         navList: navList
       });
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
    var navList = obj.data.navList;
    var dept_id = null;
    var status = null;
    if (!navList) {
        dept_id = app.user.deptId;
        status = 0;
    }
    
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

    // 重载当前页面
    var link = '../../pages/deptBoat2/deptBoat2?navList=' + JSON.stringify(navList) + '&nav=' + JSON.stringify(nav);
    wx.navigateTo({
      url: link,
      success (res) {
        //  console.log('跳转成功');
      }
    })
    

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
    var backLevel = navList.length -1 - index;
    wx.navigateBack({
      delta: backLevel
    })

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
       mask: true
     });

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