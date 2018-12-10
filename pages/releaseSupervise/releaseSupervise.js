var app = getApp();
var util = require('../../utils/util.js');
var obj = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showBoat: false,
    userList: []
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     obj = this;
     var top = {
       "id":0,
       "name":"请选择"
     };
     var top2 = {
       "seq_id":0,
       "dept_name":"请选择"
     };
     var deptList = [];
     obj.setData({
       top: top,
       top2: top2,
       deptList: deptList
     });
     var contents = options.contents;
     if (contents) {
        contents = JSON.parse(contents);
        obj.setData({
          contents: contents
        });
     }
     var id = options.id;
     if (id) {
       obj.setData({
         id:id
       });
     }
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
  * 输入改变
  */
  inputChange: (e) => {
    var value = e.detail.value;
    var key = e.currentTarget.dataset.key;
    var dou = {};
    dou[key] = value;
    obj.setData(dou);
  },

  /**
   * 初始化页面
   */
  init: () => {
    var dept_id = app.user.deptId;
    var reqUrl = util.getRequestURL('getDepartmentClass.we');
    var param = {
      id: dept_id
    };
    wx.request({
      url: reqUrl,
      dataType: 'json',
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: (res) => {
        res = res.data;
        if (res.success) {
          var lt = res.department.lt;
          // 反转数组
          var douLt = JSON.stringify(lt);
          douLt = JSON.parse(douLt);
          douLt.reverse();
          obj.setData({
            lt: lt,
            count: res.department.count,
            chooseDept: douLt[0].seq_id,
          });
          obj.getData();
          obj.getUserList();
        }
      }
    })
    
  },

  getData: () => {
    var count = obj.data.lt;
    count = count.length;
    var lt = obj.data.lt;
    var arrayList = [];
    for (var c = 0; c < (3 - count); c++) {
      var a = [];
      arrayList.push(a);
    }

    obj.setData({
      arrayList: arrayList,
      showModalStatus: false, // 是否展示弹出框
    });
    var dept_id = app.user.deptId;
    obj.getNext(dept_id);
  },

 /**
  * 查询下级机构
  */
  getNext: (dept_id) => {
    var top = obj.data.top;
    var top2 = obj.data.top2;
    if (!dept_id) {
      dept_id = app.user.deptId;
    }
    var arrayList = obj.data.arrayList;
    var lt = obj.data.lt;
   
    var reqUrl = util.getRequestURL('getNextDepartment.we');
    var param = {
      id: dept_id
    };

    wx.request({
      url: reqUrl,
      dataType: 'json',
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: (res) => {
        res = res.data;
        var has = false;
        if (res.success) {
          var ind = 0;
          for (var a in arrayList) {
            for (var x in arrayList[a]) {
              if (dept_id == arrayList[a][x].seq_id) {
                ind = a;
                has = true;
              }
            }
            
          }
          if (res.department.length > 0) {
              if (has) {
                // 非第一条
                if (res.department && res.department.length > 0) {
                  ind = parseInt(ind) + 1;
                  arrayList[ind] = res.department;
                }
              } else {
                // 第一条
                arrayList[0] = res.department;
              }
          }
          
          // 船舶列表
          var boatList = res.boatList ? res.boatList : [];

          // 在数组头部添加默认项
          for (var a in arrayList) {
            if (!arrayList[a][0] || arrayList[a][0].seq_id == 0) {
                  continue;
               }
                arrayList[a].unshift(top2); 
          }
          boatList.unshift(top);
          
          obj.setData({
            arrayList: arrayList,
            boatList: boatList,
          }); 

        }

        obj.setData({
          arrayList: arrayList
        });
      }
    })
  },


  /**
   * 获取人员列表
   */
  getUserList: () => {
     var userList = [];
     obj.setData({
       userList: userList
     });
     var reqUrl = util.getRequestURL('getUserList.we');
     var param = {
       user_id: app.user.id,
       dept_id: obj.data.chooseDept
     };

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
       }

     })
  
  },


  /**
   * 选择变化
   */
  pickerChange: (e) => {
    var index = e.detail.value;
    var arrayIndex = e.currentTarget.dataset.arrayindex;
    var arrayList = obj.data.arrayList;
    var dept_id = arrayList[arrayIndex][index].seq_id; // 每次选中的值
    var indexList = obj.data.indexList;
    var deptList = obj.data.deptList; // 选中的deptList
    var boat = obj.data.boat;
    var device = obj.data.device;
    var top = obj.data.top;
    var arrayList = obj.data.arrayList;

    if (!indexList) {
      indexList = [];
    }

    indexList[arrayIndex] = index;
    var dou = {};
    dou.indexList = indexList;
    if (dept_id == 0) { // 为0的情况，不相等,向下清除
       for (var i = arrayIndex; i < deptList.length ; i++) {
           deptList[i] = 0;
           indexList[i] = 0;
           if (i < arrayList.length -1) {
             arrayList[i+1] = [];
           }
           
       }
     


       // 清空船舶，设备
       boat = top;
       device = top;
       dou.boat = boat;
       dou.device = device;

    } else { // (deptList[arrayIndex]  && dept_id != deptList[arrayIndex].dept_id)
      deptList[arrayIndex] = dept_id; // 不等于0，则赋值
    }
    
    dou.deptList = deptList;

    // 数据校验
    var douList = [];
    var lt = obj.data.lt;
    for (var i in lt) {
      douList.push(lt[i].seq_id);
    }

    // 将数据录入新的数组
    for (var x in deptList) {
      if (deptList[x] != 0) {
        douList.push(deptList[x]);
      }
    }
    douList = douList.reverse();

    // 每次选中的值
    dou.chooseDept = douList[0];
    dou.arrayList = arrayList;
    
    
    obj.setData(dou);
    // 查询下级机构
    if (dept_id != 0) {
        
        obj.getNext(dept_id);
    }

    obj.setData({
      user: {}
    });
    obj.getUserList();
    
  },


  /**
   * 选择船，查询设备信息
   */
  boatChange: (e) => {
    var index = e.detail.value; // 选择的下标
    var boat = obj.data.boatList[index];
    var device = obj.data.device;
    var chooseBoat = obj.data.boat;
    if (index == 0 || (chooseBoat && chooseBoat.id != boat)) { // 清空设备
       device = obj.data.top;
       obj.setData({
         device: device
       });

    }

    // 设置选择的船舶
    obj.setData({
      boat:boat
    });

    // 查询设备信息
    obj.getDevice(boat.number);
  },

  /**
   * 查询设备信息
   */
  getDevice: (boat_number) => {
    var reqUrl = util.getRequestURL('getDeviceByBoat.we');
    var param = {
      boat_number: boat_number
    };
    // 发起微信请求
    wx.request({
      url: reqUrl,
      dataType: 'json',
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: (res) => {
        if (res.data.success) {
           res.data.deviceList.unshift(obj.data.top);
           // 存储设备列表
           obj.setData({
             deviceList: res.data.deviceList
           });
        }
      }
    })
  },


  /**
   * 选择设备
   */
  chooseDevice: () => {
    obj.setData({
      showModalStatus: true
    });
  },

  
  /**
   * 弹出框选择值，回调函数
   */
  chooseRes: (e) => {
    var detail = e.detail;
    if (detail.type == 'success') {
        var deviceList = obj.data.deviceList;
        for (var x in deviceList) {
            if (deviceList[x].id == detail.value) {
              obj.setData({
                device: deviceList[x]
              });
            }
        }
    }

    obj.setData({
      showModalStatus: false // 关闭弹出框
    });
  },


  /**
   * 选择用户
   */
  chooseUser: (e) => {
      var detail = e.detail;
      if (detail.type == 'success') {
        var userList = obj.data.userList;
        for (var i in userList) {
          if (userList[i].id == detail.value) {
            obj.setData({
              user: userList[i]
            });
          }
        }
      }

      obj.setData({
        showModalStatus: false
      });
  },

  

  
  /**
   * 发送督导到下级
   */
  send: () => {
      // 数据校验
      var deptList = obj.data.deptList;
      var douList = [];

      // 将数据录入新的数组
      for (var x in deptList) {
        if (deptList[x] != 0) {
            douList.push(deptList[x]);
        }
      }

      var user = obj.data.user;
      if (!user || JSON.stringify(user) == '{}') {
        wx.showModal({
          title: '提示',
          content: '请选择接收人！',
        })
        return;
      }
     
      var param = {}; // 参数
      var dept_id = '';
      if (douList.length > 0) {
        douList.reverse(); // 反转数组
        param.recDept = douList[0];
      }
      // 船舶
      var boat = obj.data.boat;
      if (boat && boat.id != 0) {
        param.boat = boat.id;
        dept_id = boat.department; // 存储船的dept_id作为最小的部门单位
      }

      var id = obj.data.id;

      // 两者必填参数
      param.content = obj.data.content || "";
      param.recUser = user.id;
      if (!id) {
        // 新增督导
        param.creator = app.user.id;
      }

      if (id) {
        // 转发
        param.id = id;
        param.supervisionId = id;
        param.opeartor = app.user.id;
      }

      
      // 设备
      var device = obj.data.device;
      if (device && device.id != 0) {
        param.device = device.id;
      }


      wx.showLoading({
        title: '处理中...',
        mask: true,
      })
      var reqUrl = util.getRequestURL('saveSupervis.we');
      wx.request({
        url: reqUrl,
        dataType: 'json',
        data: {
          json: encodeURI(JSON.stringify(param))
        },
        success: (res) => {
          wx.hideLoading();
          if (res.data.success) {
            wx.navigateBack({
              delta:2
            })
          }
        },
        fail: (e) => {
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: '网络异常！',
          })
        }
      })

  }

 




})