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
    var dou = {};
    // 设置navList的值
    var navList = options.navList;
    var nav = options.nav;
    if (navList) {
       navList = JSON.parse(navList);
       nav = JSON.parse(nav);
       navList.push(nav);
       dou.navList = navList;
    }
    // 初始化页面数据
    dou.isLoad = true;
    obj.setData(dou);
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
    var dou = {};
    
    var isLoad = obj.data.isLoad;
    var navList = obj.data.navList;
    if (isLoad) {
       dou.isLoad = false;
    } else {
      navList.splice(navList.length - 1, 1);
      dou.navList = navList;
    }
    obj.setData(dou);
    

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
    var navList = obj.data.navList;
    var dept_id = null;
    var status = null;
    if (!navList) {
       dept_id = app.user.deptId;
       status = 0;
    }

    obj.getNext(dept_id, status);
    
  },



  /**
   * next,查询下级部门中的人员
   */
  next: (e) => {

    var navList = obj.data.navList;
    var nav = e.currentTarget.dataset.dept;

    var link = '../../pages/chooseDept/chooseDept?navList=' + JSON.stringify(navList) + '&nav=' + JSON.stringify(nav);

    // 重载当前页面
    wx.navigateTo({
      url: link,
      success() {
        // console.log('跳转成功');
      },
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
    // var doux = navList.slice(0, index + 1);
    // obj.setData({
    //   navList: doux
    // });
    
    // obj.getNext(null, null);

    // 非当前部门，跳转到选中的部门层级
    var backIndex = navList.length - 1 - index;

    wx.navigateBack({
      delta: backIndex
    })

  },


  /**
   * 查询下级数据
   */
  getNext: (dept_id, status) => {
    var navList = obj.data.navList || [];
    var reqUrl = util.getRequestURL('getDepartmentUser.we');
    var param = {};
    dept_id = dept_id || navList[navList.length - 1].seq_id;
    param.dept_id = dept_id;
    param.type = 'nextDept';
    param.user_id = app.user.id;

    var choosedUser = obj.data.choosedUser || [];
    var choosedUserIds = [];
    for (var c in choosedUser) {
      choosedUserIds.push(choosedUser[c].user_id);
    }
    

    var upUsers = wx.getStorageSync('upUsers') || [];
    if (upUsers.length > 0) {
      for (var u in upUsers) {
        choosedUserIds.push(upUsers[u]);
      }
    }

    choosedUserIds = choosedUserIds.join(',');
    param.choosedUserIds = choosedUserIds;

    // 取出当前模式下，被选中的用户
    var chooseList = wx.getStorageSync(obj.data.type + 'Users') || [];

    wx.showLoading({
      title: '加载中...',
      mask: true
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
           var dou = {};
           dou.deptList = res.deptList;

           // 标记当前已被选中的用户
           for (var c in chooseList) {
             for (var u in res.userList) {
               if (chooseList[c].user_id == res.userList[u].user_id) {
                 res.userList[u].checked = true;
               }
             }
           }
           
           dou.userList = res.userList;
           if (status == 0) {
             navList.push(res.dept);
             dou.navList = navList;
           }
           obj.setData(dou);

           if (!res.deptList || res.deptList.length == 0) {
              obj.setData({
                deptObj: obj.data.navList[0]
              });
           }
        }
      },
      complete: (rx) => {
        wx.hideLoading();
      }
    })
  },

  radioChange: (e) => {
    var index = e.currentTarget.dataset.index;
    var deptObj = obj.data.deptList[index];
    obj.setData({
      deptObj: deptObj
    });
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
    if (!obj.data.deptObj) {
      wx.showModal({
        title: '提示',
        content: '请选择部门',
        showCancel: false,
      })
      return;
    }

    // 将值存储起来
    var deptObj = obj.data.deptObj;
    wx.setStorageSync('deptObj', deptObj);

    var backIndex = obj.data.navList.length;
    wx.navigateBack({
      delta: backIndex,
    })


  }
})