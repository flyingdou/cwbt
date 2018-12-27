var app = getApp();
var util = require('../../utils/util.js');
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
    navList.push(nav);
    obj.setData({
      navList: navList
    });

    // 清空设已有设备列表
    // obj.clearEquipment();

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


    // 清空设已有设备列表
    // obj.clearEquipment();

    obj.getData(null, null);
  },


  /**
   * 查询数据
   */
  getData: (dept_id, status) => {
    var reqUrl = util.getRequestURL('getDepartmentBoat.we');
    var param = {};

    var navList = obj.data.navList || [];
    dept_id = dept_id || navList[navList.length - 1].seq_id;
    param.dept_id = dept_id;
    param.boatType = "趸船";

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
   * 选择船舶
   */
  boatChange: (e) => {
    var index = e.currentTarget.dataset.index;
    var link = e.currentTarget.dataset.link;
    var boatList = obj.data.boatList;
    // 清空所有选中
    boatList.forEach((item,i) => {
      item.checked = false;
    });
    boatList[index].checked = true;

    obj.setData({
      boatList: boatList,
      boat: boatList[index]
    });

    wx.navigateTo({
      url: link
    });

    // 清空设已有设备列表
    // obj.clearEquipment();

    // 查询设备
    // obj.getEquipmentList();
  }
})