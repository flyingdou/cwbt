var app = getApp();
var util = require('../../utils/util.js');
var obj = null;
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
    obj = this;
    var key = options.key;
    var value = options[key];
    if (value) {
      value = JSON.parse(value);
    }
    var dou = {};
    dou[key] = value;
    dou.key = key;
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
  addDeptUser: (dept_id, userList) => {
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
    // var chooseList = wx.getStorageSync(obj.data.type + 'Users') || [];
    var key = obj.data.key;
    var chooseList = obj.data[key].chooseUsers;

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
  checkboxChange: (e) => {
    // 选中的下标数组
     var index = e.currentTarget.dataset.index;
     var indexs = obj.data.indexs || [];
     var userList = obj.data.userList;
		 var key = obj.data.key;
		 var hv = obj.data[key];
		 var hasUsers = hv.chooseUsers || [];
		 
		 // 已有数据的
		 hasUsers.forEach((has, h) => {
			 // 两者id相等
			 if (has.user_id == userList[index].user_id) {
				   if (userList[index].checked) {
							indexs.forEach((ind, i) => {
								if (ind == index) {
									indexs.splice(i,1);
								}
							});
							// 移除
							console.log('1');
							userList[index].checked = false;
							userList[index].remove = true;
							userList[index].add = false;
							has.checked = false;
							has.remove = true;
							has.add = false;
					 } else {
						  console.log('2');
							indexs.push(index);
							userList[index].checked = true;
							userList[index].remove = false;
							userList[index].add = true;
							has.checked = true;
							has.remove = false;
							has.add = true;
					 }
			 } else {
				  if (userList[index].checked) {
						indexs.forEach((ind, i) => {
							if (ind == index) {
								 indexs.splice(i,1);
							}
						});
						// 移除
						console.log('3');
						userList[index].checked = false;
						userList[index].remove = true;
						userList[index].add = false;
					} else {
						console.log('4');
						indexs.push(index);
						// 增加
						userList[index].checked = true;
						userList[index].remove = false;
						userList[index].add = true;
					}
			 }
		 });
		 
		 // 新增数据
		 if (hasUsers.length <= 0) {
				if (userList[index].checked) {
					indexs.forEach((ind, i) => {
						if (ind == index) {
							 indexs.splice(i,1);
						}
					});
					// 移除
					console.log('5');
					userList[index].checked = false;
					userList[index].remove = true;
					userList[index].add = false;
				} else  {
					console.log('6');
					indexs.push(index);
					// 增加
					userList[index].checked = true;
					userList[index].remove = false;
					userList[index].add = true;
				}
		 }
      
      // 存储数据
			var dou = {};
			dou.indexs = indexs;
			dou.userList = userList;
			if (hv) {
				hv.chooseUsers = hasUsers;
				dou[key] = hv;
			}
			
      obj.setData(dou);

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
    var key = obj.data.key;
    var hv = obj.data[key] || {};
    var chooseUsers = hv.chooseUsers || [];
		var chooseUserStr = JSON.stringify(chooseUsers);
    // 从上个页面传递过来的已近被选中的人
    var hasUsers = JSON.parse(chooseUserStr);
		
		console.log('userList: ' + JSON.stringify(userList));
		console.log('hasUsers: ' + JSON.stringify(hasUsers));

    
		
		// 删除
		var removeIndexs = [];
		hasUsers.forEach((has,h) => {
			if (has.remove) {
				  has.remove = false;
				  console.log('remove: ' + JSON.stringify(has) + ', h: ' + h);
				  removeIndexs.push(h);
			}
		});
		
		removeIndexs.forEach((ri,li) => {
			chooseUsers.splice(ri-li,1);
		});
		
		// 添加
		hasUsers.forEach((has,h) => {
			if (has.add) {
				 // 移除此字段
				 has.add = false;
				 console.log('add: ' + JSON.stringify(has));
				 chooseUsers.push(has);
			}
		});
		
		
		
		// 勾选的用户
		userList.forEach((user,u) => {
			if (user.add) {
				 user.add = false;
				 chooseUsers.push(user);
			}
		});
		


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
    
    // 将值存储到上个页面
    var pages = getCurrentPages();
    // 获取上一页面对象
    var prePage = pages[pages.length -2];
    prePage.setData(dou);

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