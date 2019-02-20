var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    base_img_url: app.constant.base_img_url
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var obj = this;
    var key = options.key;
    var value = options[key];
    if (value) {
      value = JSON.parse(value);
    }
    var dou = {};
    dou[key] = value;
    dou.key = key;

    var navList = options.navList;
    var nav = options.nav;

    if (navList) {
      navList = JSON.parse(navList);
      nav = JSON.parse(nav);
      navList.push(nav);
      dou.navList = navList;
    }
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
    var obj = this;
    var dou = {};
    var isLoad = obj.data.isLoad;
    var navList = obj.data.navList;

    obj.setData(dou);
    obj.isChooseAll();

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
  init () {
    var obj = this;
    var navList = obj.data.navList;
    var key = obj.data.key;
    var deptUser = [];
    var dou = obj.data[key];
    var chooseDeptList = dou.chooseDeptList || [];
    chooseDeptList.forEach((dept,index) => {
      dept.userList.forEach((user,ui) => {
        deptUser.push(user);
      });
    });

    // 存储值
    obj.setData({
      choosedUser: dou.choosedUser  || [],
      deptUser: deptUser,
      chooseDeptList: chooseDeptList
    });
    
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
  next (e) {
    var obj = this;
    // 清空storage中的值
    wx.removeStorageSync('chooseUsers');
     var navList = obj.data.navList;
     var nav = e.currentTarget.dataset.dept;

    var key = obj.data.key;
    var value = obj.data[key] || '';
    // 重载当前页面
    var link = '../../pages/chooseUser/chooseUser?navList=' + JSON.stringify(navList) + '&nav=' + JSON.stringify(nav) + '&' + key + '=' + JSON.stringify(value) + '&key=' + key;
    wx.navigateTo({
      url: link,
    })
  },
	
	/**
	 * 选择整个部门下的人员
	 */
	chooseDept(e) {
    var obj = this;
		var deptList = obj.data.deptList;
		var deptindex = e.currentTarget.dataset.deptindex;
    var dept_id = deptList[deptindex].seq_id;

		 // 机构状态处理
		deptList.forEach((dept,index) => {
     if (index == deptindex) {
          if (dept.checked) {
            dept.checked = false;
           // 移除当前机构
            obj.removeDeptUser(dept_id);
          } else {
            dept.checked = true;
            // 选择部门下的用户
            obj.getDeptUsers(dept_id);
          }
      }

		});
   
		obj.setData({
			deptList: deptList
		});
		
	},
	
	
	/**
	 * 选择部门下的用户
	 */
	getDeptUsers (dept_id) {
    var obj = this;
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
			title: '处理中',
      mask: true
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
           // 将查询到的用户添加到deptUser
           obj.addDeptUser(dept_id, res.userList);
				}
			},
			complete: (com) => {
				wx.hideLoading();
			}
		});
	},

  /**
   * 向deptUser中添加用户
   */
  addDeptUser (dept_id, userList) {
     var obj = this;
     var chooseDeptList = obj.data.chooseDeptList || [];
     // 已有选中的部门用户
     var deptUser = obj.data.deptUser || [];
     userList.forEach((user,index) => {
       deptUser.push(user);
     });

     var douDept = {
      userList: userList,
      dept_id: dept_id
     };
     chooseDeptList.push(douDept);
     obj.setData({
       deptUser: deptUser,
       chooseDeptList: chooseDeptList
     });
  },

  /**
   * 移除某一部门下的用户
   */
  removeDeptUser: (dept_id) => {
    var chooseDeptList = obj.data.chooseDeptList || [];
    var forChooseDeptList = chooseDeptList;

    // 命中的部门
    var deptUser = obj.data.deptUser || [];
    var forDeptUser = deptUser;

    forChooseDeptList.forEach((dept,index) => {
      if (dept.dept_id == dept_id) {
          // 已选中的用户
          dept.userList.forEach((user,ui) => {
            forDeptUser.forEach((du, di) => {
              if (user.user_id == du.user_id) {
                  // 删除当前用户
                  deptUser.splice(di,1);
              }
            });
          });

          // 在chooseDeptList中移除当前大项
          chooseDeptList.splice(index,1);
      }
    });
    
    // 存储数据
    obj.setData({
      chooseDeptList: chooseDeptList,
      deptUser: deptUser
    });
  },

  /**
   * 向上选择部门
   */
  up (e) {
    var obj = this;
    // 清空storage中的值
    wx.removeStorageSync('chooseUsers');
    var index = e.currentTarget.dataset.index;
    var navList = obj.data.navList;

    // 选中当前部门，不做操作
    if (index == (navList.length - 1)) {
      return;
    }

    // 非当前部门，返回选中的部门层级
    var backIndex = navList.length - 1 - index;
    wx.navigateBack({
      delta: backIndex
    })
  },


  /**
   * 查询下级数据
   */
  getNext (dept_id, status) {
    var obj = this;
    var navList = obj.data.navList || [];
    var reqUrl = util.getRequestURL('getDepartmentUser.we');
    var param = {};
    if (dept_id) {
      // 初次请求该接口
      param.init = 1;
    }
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
    var key = obj.data.key;
    var chooseList = obj.data[key].chooseUsers;

    wx.showLoading({
      title: '加载中',
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
           
           // 当前已被选中的用户
           var indexs = obj.data.indexs || [];
           // 标记当前已被选中的用户
           for (var c in chooseList) {
             for (var u in res.userList) {
               if (chooseList[c].user_id == res.userList[u].user_id) {
                 res.userList[u].checked = true;
                 indexs.push(u);
               }
             }
           }

          // 标记当前已被选中的部门
           var chooseDeptList = obj.data.chooseDeptList || [];
           chooseDeptList.forEach((chooseDept,index) => {
              res.deptList.forEach((dept) => {
                if (chooseDept.dept_id == dept.seq_id) {
                   dept.checked = true;
                  //  obj.getDeptUsers(dept.seq_id);
                }
              });
           });
           dou.deptList = res.deptList;
           dou.userList = res.userList;
           dou.indexs = indexs;
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
  checkboxChange (e)  {
     var obj = this;
     // 选中的下标数组
     var index = e.currentTarget.dataset.index;
     var indexs = [];
     var userList = obj.data.userList;
		 var key = obj.data.key;
		 var hv = obj.data[key] || {};
		 var hasUsers = hv.chooseUsers || [];
     
		 // 在页面勾选第一个用户
     if (hasUsers.length == 0) {
        hasUsers.push(userList[index]);
     } else {
			 // 多次勾选用户
        var count = 0;
        hasUsers.forEach(function (item, i) {
          if (item.user_id == userList[index].user_id) {
            item.isDel = !item.isDel;
            count++;
          }
        });
        if (count == 0) {
          hasUsers.push(userList[index]);
        }
     }

     hasUsers.forEach(function (item, i) {
      if (!item.isDel) {
        indexs.push(item.user_id);
      }
     });

     userList[index].checked = !userList[index].checked

     var dou = { indexs: indexs, userList: userList };
     if (hv) {
       hv.chooseUsers = hasUsers;
       dou[key] = hv;
     }
      
      obj.setData(dou);
      // 判断全选状态
      obj.isChooseAll();

  },


  /**
   * chooseAll
   */
  chooseAll () {
    var obj = this;
    var chooseAll = obj.data.chooseAll || false;
    var indexs = obj.data.indexs || [];
    var userList = obj.data.userList || [];
		// 判断当前是否有数据
		var key = obj.data.key;
		var hv = obj.data[key] || {};
		var hasUsers = hv.chooseUsers || [];
		// 给重叠部分标记
    if (chooseAll) {
      chooseAll = false;
      userList.forEach((user,u) => {
				user.checked = false;
				hasUsers.forEach((has,h) => {
					if (has.user_id == user.user_id) {
						  has.isDel = true;
					}
				});
			});
        
      indexs = [];
    } else {
			var addIndexs = [];
      chooseAll = true;
			userList.forEach((user,u) => {
				user.checked = true;
				indexs.push(user);
				var count = 0;
				hasUsers.forEach((has,h) => {
					if (has.user_id == user.user_id) {
						  has.isDel = false;
							count++;
					} 
				});
				if (count == 0) {
					addIndexs.push(u);
				}
				user.isDel = false;
			});
			
			addIndexs.forEach((ai,i) => {
				hasUsers.push(userList[ai]);
			});
      
    }
		var dou = { chooseAll: chooseAll, indexs: indexs, userList: userList };
		if (hv) {
		  hv.chooseUsers = hasUsers;
		  dou[key] = hv;
		}
		 
		 obj.setData(dou);
    
  },


  /**
   * 点击确定时
   */
  choose () {
    var obj = this;
    var navList = obj.data.navList;
    var backIndex = navList ? navList.length : 0;

    var userList = obj.data.userList || [];
    var key = obj.data.key;
    var hv = obj.data[key] || {};
    var _chooseUsers = hv.chooseUsers || [];
    var chooseUsers = [];
    if (_chooseUsers.length > 0) {
      _chooseUsers.forEach(function(item, i) {
        if (!item.isDel) {
          chooseUsers.push(item);
        }
      });
    }


    // 勾选的部门中的用户
    var deptUser = obj.data.deptUser || [];
    deptUser.forEach((user,index) => {
      chooseUsers.push(user);
    });

    // 勾选中的部门
    var chooseDeptList = obj.data.chooseDeptList || [];
    var dou = {};

    if (chooseUsers.length < 1) {
      wx.showModal({
        title: '提示',
        content: '请选择人员',
        showCancel: false,
      })
      return;
    }
   
    var douValue = {};
    douValue.chooseUsers = chooseUsers;
    douValue.chooseDeptList = chooseDeptList;
    // 将值存储起来
    key = key + 'Dou';
    dou[key] = douValue;
    
    // 将值存储到来时的页面上
    var pages = getCurrentPages();
    // 获取上一页面对象
    var prePage = pages[pages.length - 1 - backIndex];
    prePage.setData(dou);

    wx.navigateBack({
      delta: backIndex,
    })


  },

  /**
   * 获取当前情况下选中的用户
   */
  getChooseUser() {
    var obj = this;
    var key = obj.data.key;
    var hv = obj.data[key] || {};

    // 勾选的用户
    var _chooseUsers = hv.chooseUsers || [];
    var chooseUsers = [];
    if (_chooseUsers.length > 0) {
      _chooseUsers.forEach(function (item, i) {
        if (!item.isDel) {
          chooseUsers.push(item);
        }
      });
    }


    // 勾选的部门中的用户
    var deptUser = obj.data.deptUser || [];
    deptUser.forEach((user, index) => {
      chooseUsers.push(user);
    });
    return chooseUsers;
  },

  /**
   * 全选状态处理
   */
  isChooseAll() {
    var obj = this;
    var userList = obj.data.userList || [];
    var hasLen = 0;
    var chooseAll = false;
    userList.forEach((user,u) => {
      if (user.checked) {
         hasLen++;
      }
    });

    if (userList.length == hasLen && hasLen > 0) {
        chooseAll = true;
    }

    obj.setData({
      chooseAll: chooseAll
    });
    
  },

  /**
   * inputChange
   */

  inputChange (e) {
    var obj = this;
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
  search () {
    var obj = this;
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
      mask: true
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