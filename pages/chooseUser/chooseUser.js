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
    var type = options.type;
    obj.data.type = type;

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
    var navList = [];
    var types = obj.data.type;
    var choosedUser = [];
    var key = '';
    if (types == 'rec') {
       key = 'copyUsers';
    }
    if (types == 'copy') {
      key = 'recUsers';
    }
    choosedUser = wx.getStorageSync(key) || [];
    obj.data.choosedUser = choosedUser;
    var dept_id = app.user.deptId;
    var status = 0;
    obj.getNext(dept_id, status);
    
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
     obj.getNext(null,null);
  },
	
	/**
	 * 选择整个部门下的人员
	 */
	chooseDept: (e) => {
		var deptList = obj.data.deptList;
		var deptindex = e.currentTarget.dataset.deptindex;
		 // 清空机构选中状态
		deptList.forEach((dept,index) => {
     if (index == deptindex) {
          if (dept.checked) {
            dept.checked = false;
            wx.removeStorageSync('choosedeptindex');
            obj.setData({
              deptUser: []
            });
          } else {
            dept.checked = true;
            wx.setStorageSync('choosedeptindex', deptindex);
            // 选择部门下的用户
            obj.getDeptUsers(deptList[deptindex].seq_id);
          }
      } else {
        dept.checked = false;
      }

		});
   
		
		obj.setData({
			deptList: deptList
		});
		

	},
	
	
	/**
	 * 选择部门下的用户
	 */
	getDeptUsers: (dept_id) => {
		var reqUrl = util.getRequestURL('getDeptUser.we');
		var param = {
			dept_id: dept_id,
			user_id: app.user.id
		};

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
		
		// loading
		wx.showLoading({
			title: '处理中'
		});
	  
		// 发起requset请求
		wx.request({
      url: reqUrl,
			dataType: 'json',
			data: {
				json: encodeURI(JSON.stringify(param))
			},
			success: (res) => {
				res = res.data;
				if (res.success) {
          var deptList = obj.data.deptList;
          if (res.userList.length <= 0) {
             var choosedeptindex = wx.getStorageSync('choosedeptindex');
             deptList[choosedeptindex].checked = false;

          }
					 obj.setData({
						 deptUser: res.userList,
             deptList: deptList
					 });
				}
			},
			complete: (com) => {
				wx.hideLoading();
			}
		});
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
    
    obj.getNext(null, null);
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


    // 取出当前模式下被选中的部门
    var choosedeptindex = wx.getStorageSync('choosedeptindex');

    wx.showLoading({
      title: '加载中',
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
           
           var deptUser = [];
           // 标记当前已被选中的用户
           for (var c in chooseList) {
             for (var u in res.userList) {
               if (chooseList[c].user_id == res.userList[u].user_id) {
                 res.userList[u].checked = true;
                 deptUser.push(res.userList[u]);
               }
             }
           }

           // 标记当前已被选中的部门
          if (choosedeptindex || parseInt(choosedeptindex) >= 0) {
              res.deptList[choosedeptindex].checked = true;
              // 查询当前部门用户
              obj.getDeptUsers(res.deptList[choosedeptindex].seq_id);
           }
           dou.deptList = res.deptList;
           dou.userList = res.userList;
           dou.deptUser = deptUser;
           if (status == 0) {
             navList.push(res.dept);
             dou.navList = navList;
           }
           obj.setData(dou);
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


  /**
   * 点击确定时
   */
  choose: () => {
    var userList = obj.data.userList || [];
    var chooseUsers = [];

    // 勾选的用户
    for (var u in userList) {
      if (userList[u].checked) {
        chooseUsers.push(userList[u]);
      }
    }

    // 勾选的部门中的用户
    var deptUser = obj.data.deptUser || [];
    deptUser.forEach((user,index) => {
      chooseUsers.push(user);
    });
    
    if (chooseUsers.length < 1) {
      wx.showModal({
        title: '提示',
        content: '请选择人员',
        showCancel: false,
      })
      return;
    }

    // 将值存储起来
    var key = obj.data.type;
    key = key + 'Users';
    wx.setStorageSync(key, chooseUsers);

    wx.navigateBack({
      delta: 1,
    })


  },

  /**
   * inputChange
   */

  inputChange: (e) => {
    var key = e.currentTarget.dataset.key;
    var dou = {};
    dou[key] = e.detail.value;
    obj.setData(dou);

    // 如果值为空，则重新加载页面数据
    if (!e.detail.value) {
      var dept_id = app.user.deptId;
      var status = 0;
      obj.setData({
         navList: []
      });
      obj.getNext(dept_id, status);
    }

  },

  /**
   * 模糊查询用户
   */
  search: () => {
    // 校验数据
    var searchName = obj.data.searchName || '';
    if (!searchName) {
      wx.showModal({
        title: '提示',
        content: '请输入搜索人员名称！',
        showCancel: false
      })
      return;
    }

    var reqUrl = util.getRequestURL('searchUser.we');
    var param = {};
    

    // 排除已被选中的用户
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
    param.user_id = app.user.id;
    param.searchName = searchName;

    // loading
    wx.showLoading({
      title: '加载中',
    })

    // request
    wx.request({
      url: reqUrl,
      dataType: 'json',
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: (res) => {
        res = res.data;
        if (res.success) {
           obj.setData({
             userList: res.userList
           });
        }
      },
      complete: (com) => {
        wx.hideLoading();
      }
    })

  },
  

})