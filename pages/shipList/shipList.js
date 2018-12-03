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
    var boatList = [
      {"id":716,"name":"航讯716","deptName":"荆州测绘处"},
      {"id":718,"name":"汉道趸48","deptName":"荆州测绘处"}
    ];

    var reqUrl = util.getRequestURL('getBoatByDept.we');
    var param = {
      dept_id:app.user.deptId
    };
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: reqUrl,
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: (res) => {
        if (res.data.success) {
          boatList = res.data.boatList;
          for (var i in boatList) {
            boatList[i].checked = false;
          }
          obj.setData({
            boatList: boatList
          });
        } else {
          console.log('后台异常');
        }
      },
      fail:(e) => {
        console.log(e);
      },
      complete: () => {
        wx.hideLoading();
      }
      
      
      
    　
    })

   
  },


  /**
   * 选择船舶
   */
  choose: (e) => {
     var index = e.detail.value;
     if (!index) {
       index = e.currentTarget.dataset.index;
     }
     
     var boatList = obj.data.boatList;
     for (var i in boatList) {
       boatList[i].checked = false;
     }
     boatList[index].checked = true;
     obj.setData({
       boatList: boatList,
       chooseBoat: boatList[index]
     });

     // 跳转到船舶部门列表
     obj.goto(boatList[index].id);

  },

  /**
   * goto
   */
  goto: (boatId) => {
    // 船舶部门
    var boatDeptList = [
      { "name": "驾驶部", "link": "../Tlist/Tlist?queryType=1&boatdepartment=1&boatId=" + boatId },
      { "name": "轮机部", "link": "../Tlist/Tlist?queryType=1&boatdepartment=2&boatId=" + boatId },
    ];
    var chooseBoatDept = {
      name: '船舶部门',
      chooseList: boatDeptList
    };
    wx.setStorageSync('choose', chooseBoatDept);


    var url = '../../pages/switch/switch';
    wx.navigateTo({
      url: url,
    })
  }

})