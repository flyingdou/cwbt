var app = getApp();
var obj = null;
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showMark: false,
    startDate: '请选择',
    endDate: '请选择'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    obj = this;
    var type = options.type;
    var top = {
      "id": 0,
      "name": "请选择"
    };
    var top2 = {
      "seq_id": 0,
      "dept_name": "请选择"
    };
    var deptList = [];
    obj.setData({
      top: top,
      top2: top2,
      deptList: deptList,
      type: type
    });
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
    if (wx.getStorageSync("deptObj")) {
      obj.setData({
        deptObj: wx.getStorageSync("deptObj")
      });
      wx.removeStorageSync("deptObj")
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
 * 初始化页面
 */
  init: () => {
    var dept_id = app.user.deptId;
    if (!dept_id) {
      dept_id = 2;
    }
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
          obj.setData({
            lt: res.department.lt,
            count: res.department.count
          });
          obj.getData();
        }
      }
    })

  },

  getData: () => {
    var count = obj.data.lt;
    count = count.length;
    var lt = obj.data.lt;
    var arrayList = [];
    for (count; count < 3; count++) {
      var a = [];
      arrayList.push(a);
    }

    obj.setData({
      arrayList: arrayList,
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
    if (!indexList) {
      indexList = [];
    }

    indexList[arrayIndex] = index;
    var dou = {};
    dou.indexList = indexList;
    // 为0的情况，不相等,向下清除
    if (dept_id == 0 || (deptList[arrayIndex] && dept_id != deptList[arrayIndex])) {
      deptList[arrayIndex] = dept_id;
      for (var i = arrayIndex + 1; i < deptList.length; i++) {
        deptList[i] = 0;
        indexList[i] = 0;
      }

      // 清空船舶，设备
      boat = top;
      device = top;
      dou.boat = boat;
      dou.device = device;

    } else {
      deptList[arrayIndex] = dept_id; // 不等于0，则赋值
    }

    dou.deptList = deptList;

    obj.setData(dou);
    // 查询下级机构
    if (dept_id != 0) {
      obj.getNext(dept_id);
    }
  },

/**
 * 去选择部门页面
 */
  toSelectDeptPage: function () {
    wx.navigateTo({
      url: '../chooseDept/chooseDept'
    });
  },

/**
 * 弹起日历
 */
  showMark: function (e) {
    var key = e.currentTarget.dataset.key;
    obj.setData({
      dateKey: key,
      showMark: true
    });
  },

/**
 * 时间选择器改变
 */
  dateChange: (e) => {
    var key = obj.data.dateKey;
    var dou = {
      showMark: false
    };
    if (e.detail.value) {
      dou[key] = e.detail.value;
    }
    if (e.detail.values) {
      dou.startDate = e.detail.values[0];
      dou.endDate = e.detail.values[1]; 
    }
    obj.setData(dou);
  },

  
  /**
   * 获取船舶列表
   */
  getBoatList: () => {
    // 数据校验不通过
    if (!obj.checkData()) {
      return;
    }

    // 数据校验通过
    var type = obj.data.type;
    var reqUrl = '';
    var key = '';
    var dou = {};
    if (type == 'handle') {
       reqUrl = util.getRequestURL('statisticsWcWorkcard.we');
       key = 'statisticsList';
    }

    if (type == 'valid') {
       reqUrl = util.getRequestURL('statisticscheck.we');
       key = 'validList';
    }
    var param  = obj.data.param;
    
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
          dou[key] = res.list;
        }
      },
      complete: (rex) => {
        wx.hideLoading();
        obj.setData(dou);
        
      }
    })
    
    
  },

  /**
   * 校验数据
   */
  checkData: () => {
    // // 数据校验
    // var deptList = obj.data.deptList;
    // var douList = [];

    // // 将数据录入新的数组
    // for (var x in deptList) {
    //   if (deptList[x] != 0) {
    //     douList.push(deptList[x]);
    //   }
    // }

    // // 获取lt的长度
    // var lt = obj.data.lt;
    // if ((lt.length + douList.length) < 3) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '请选择统计部门！',
    //     showCancel: false,
    //   })
    //   return false;
    // }
    
    // // 反转数组
    // douList.reverse();

    var param = {};
    // param.departmentid = douList.length == 0 ? lt[lt.length - 1].seq_id : douList[0];

    // 部门
    var deptObj = obj.data.deptObj;
    if (!deptObj) {
      wx.showModal({
        title: '提示',
        content: '请选择统计部门！',
        showCancel: false,
      })
      return false;
    }
    param.departmentid = deptObj.seq_id;

    // 开始时间
    var startDate = obj.data.startDate;
    if (startDate) {
      param.begintime = startDate;
    }

    // 结束时间
    var endDate = obj.data.endDate;
    if (endDate) {
      param.endtime = endDate;
    }
    obj.data.param = param;
    return true;

  },

  
  /**
   * 选择船
   */
  radioChange:(e) => {
    var index = e.detail.value;
    if (!index) {
      index = e.currentTarget.dataset.index;
    }
    var type = obj.data.type;
    var key = '';
    var dou = {};
    if (type == 'handle') {
      key = 'statisticsList';
    }
    if (type == 'valid') {
      key = 'validList';
    }
    var valueList = obj.data[key];
    for (var x in valueList) {
      valueList[x].checked = false;
    }
    valueList[index].checked = true;
    dou[key] = valueList;
    obj.setData(dou);
    obj.goto(valueList[index].boatid);
  },

  /**
   * 跳转到下一页面
   */
  goto: (boatId) => {
   
    var link = '../../pages/statisticDetail/statisticDetail?boatId=' + boatId + '&type=' + obj.data.type;
    var startDate = obj.data.startDate;
    if (startDate) {
      link = link + '&startDate=' + startDate;
    }
    var endDate = obj.data.endDate;
    if (endDate) {
      link = link + '&endDate=' + endDate;
    }
    wx.navigateTo({
      url: link,
    })
  }




})