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
    var navList = [];
    var reqUrl = util.getRequestURL('getDepartmentUser.we');
    var param = {};
    param.dept_id = app.user.deptId;
    param.type = 'nextDept';
    
    // 请求中
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: reqUrl,
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      dataType: 'json',
      success:(res) => {
        res = res.data;
        if (res.success) {
          navList.push(res.dept);
          obj.setData({
            deptList: res.deptList,
            userList: res.userList,
            navList: navList
          });
        }
      },
      complete: (rx) => {
        wx.hideLoading();
      }
    })

  },



  /**
   * next,查询下级部门中的人员
   */
  next: (e) => {
    // 清空storage中的值
    wx.removeStorageSync('chooseUsers');
     var navList = obj.data.navList;
     var nav = e.currentTarget.dataset.dept;
     navList.push(nav);
     obj.setData({
       navList: navList
     });
     obj.getNext();
  },

  /**
   * 向上选择部门
   */
  up: (e) => {
    // 清空storage中的值
    wx.removeStorageSync('chooseUsers');
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
    
    obj.getNext();
  },


  /**
   * 查询下级数据
   */
  getNext: () => {
    var navList = obj.data.navList;
    var reqUrl = util.getRequestURL('getDepartmentUser.we');
    var param = {};
    param.dept_id = navList[navList.length-1].seq_id;
    param.type = 'nextDept';
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: reqUrl,
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      dataType: 'json',
      success: (res) => {
        res = res.data;
        if (res.success) {
           obj.setData({
             deptList: res.deptList,
             userList: res.userList
           });
        }
      },
      complete: (rx) => {
        wx.hideLoading();
      }
    })
  },

  /**
   * checkboxChange
   */
  checkboxChange: (e) => {
    // 选中的下标数组
     var index = e.currentTarget.dataset.index;
     var indexs = obj.data.indexs || [];
     var userList = obj.data.userList;
     
      if (userList[index].checked) {
        userList[index].checked = false;
        for (var i in indexs) {
          if (indexs[i] == index) {
            indexs.splice(i, 1);
          }
        }
      } else {
        userList[index].checked = true;
        indexs.push(index);
      }
      
      // 存储数据
      obj.setData({
        indexs: indexs,
        userList: userList
      });

  },


  /**
   * chooseAll
   */
  chooseAll: () => {
    var chooseAll = obj.data.chooseAll || false;
    var indexs = obj.data.indexs || [];
    var userList = obj.data.userList || [];
    if (chooseAll) {
      chooseAll = false;
      for (var u in userList) {
        userList[u].checked = false;
      }
      indexs = [];
    } else {
      chooseAll = true;
      for (var u in userList) {
        userList[u].checked = true;
        indexs.push(u);
      }
    }

    obj.setData({
      chooseAll: chooseAll,
      indexs: indexs,
      userList: userList
    });


  },


  choose: () => {
    var userList = obj.data.userList || [];
    var chooseUsers = [];
    for (var u in userList) {
      if (userList[u].checked) {
        chooseUsers.push(userList[u]);
      }
    }
    
    if (chooseUsers.length < 1) {
      wx.showModal({
        title: '提示',
        content: '请选择人员',
        showCancel: false,
      })
      return;
    }

    // 将值存储起来
    wx.setStorageSync('chooseUsers', chooseUsers);

    wx.navigateBack({
      delta: 1,
    })


  }

  

})