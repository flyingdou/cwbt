var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    base_img_url: app.constant.base_img_url,
    base_domain: app.constant.base_domain,
    pageSize: app.pageInfo.pageSize
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var obj = this;
    var dou = {};
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
    var obj = this;
    var dou = {};
    var isLoad = obj.data.isLoad;
    if (isLoad) {
       obj.data.isLoad = false;
    } else {
       if (obj.data.isOut) {
         obj.data.isOut = false;
       } else {
         var navList = obj.data.navList;
         navList.splice(navList.length - 1, 1);
         dou.navList = navList;
       }
    }
    // 分页参数
    dou.currentPage=app.pageInfo.currentPage;
    dou.isEquipment = false;
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
    var obj = this;
    if (obj.data.isEquipment) {
      obj.data.currentPage++;
      obj.getEquipmentList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },



  /**
   * 初始化页面数据
   */
  init: function () {
    var obj = this;
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
  next(e) {
    var obj = this;
    var navList = obj.data.navList;
    var nav = e.currentTarget.dataset.dept;
    var deptindex = e.currentTarget.dataset.deptindex;
    // navList.push(nav);

    // 清空机构选中状态
    // var deptList = obj.data.deptList;
    // deptList.forEach((dept, index) => {
    //   dept.checked = false;
    // });
    // deptList[deptindex].checked = true;
    // obj.setData({
    //   deptList: deptList
    // });

    // 清空设已有设备列表
    // obj.clearEquipment();

    // obj.getData(null, null);


    // 重载当前页面
    var link = '../../pages/chooseEquipment2/chooseEquipment2?navList=' + JSON.stringify(navList) + '&nav=' + JSON.stringify(nav);
    wx.navigateTo({
      url: link,
      success(res) {
        //  console.log('跳转成功');
      }
    })

  },

  /**
   * 向上选择部门
   */
  up(e) {
    var obj = this;
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


    // // 清空设已有设备列表
    // obj.clearEquipment();

    // obj.getData(null, null);

    // 非当前部门，截取选中处之前的
    var backLevel = navList.length - 1 - index;
    wx.navigateBack({
      delta: backLevel
    })

  },


  /**
   * 查询数据
   */
  getData: function (dept_id, status) {
    var obj = this;
    var reqUrl = util.getRequestURL('getDepartmentBoat.we');
    var param = {};

    var navList = obj.data.navList || [];
    dept_id = dept_id || navList[navList.length - 1].seq_id;
    param.dept_id = dept_id;

    // loading
    wx.showLoading({
      title: '加载中...',
      mask: true
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
   * 查询部门下属船舶(递归查询)
   */
  getDeptBoatList(e) {
     var obj = this;
     // 清空现有设备列表
     obj.clearEquipment();

     var dept = e.currentTarget.dataset.dept;
     var deptindex = e.currentTarget.dataset.deptindex;
     // 设置值的对象
     var dou = {};
     dou.chooseDept = dept;

     // 更改选中状态
      var deptList = e.currentTarget.dataset.deptlist;
      if (deptList && deptList.length > 0) {
        deptList.forEach((dept, index) => {
          dept.checked = false;
        });

        deptList[deptindex].checked = true;
        dou.deptList = deptList;
      }
     

     // 请求数据
     var reqUrl = util.getRequestURL('getBoatRecursionByDept.we');
     var param = {
       id: dept.seq_id
     };

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
         json: JSON.stringify(param)
       },
       success (res) {
         res = res.data;
         if (res.success) {
            dou.boatList = res.boatList;
            console.log(dou);
            obj.setData(dou);
         }
       },
       complete (com) {
         wx.hideLoading();
       }
     })
  },


  /**
   * 选择船舶
   */
  boatChange: function (e) {
    var obj = this;
    var index = e.currentTarget.dataset.index;
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

    // 清空设已有设备列表
    obj.clearEquipment();

    // 查询设备
    obj.getEquipmentList();
  },




  /**
   * 查询船舶的设备列表
   */
  getEquipmentList: function () {
    var obj = this;
    var boat = obj.data.boat;
    if (!boat || boat == '') {
       return;
    }
    obj.data.isEquipment = true;
    var equipmentList = obj.data.equipmentList || [];
    var reqUrl = util.getRequestURL('getEquipmentList.we');
    var param = {
      boat_number: boat.number,
      currentPage: obj.data.currentPage,
      pageSize: obj.data.pageSize
    };

    // loading
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    wx.request({
      url: reqUrl,
      dataType: 'json',
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: (res) => {
        res = res.data;
        if (res.success) {
          equipmentList = equipmentList.concat(res.equipmentList);
          obj.setData({
            equipmentList: equipmentList
          });
        } else {
          console.log('程序异常！');
        }

      },
      complete: (com) => {
        wx.hideLoading();
      }
    })
  },



  /**
   * 设备改变
   */
  equipmentChange: function (e) {
    var obj = this;
     var index = e.currentTarget.dataset.index;
     var equipmentList = obj.data.equipmentList;
     // 清空设备的选中状态
     equipmentList.forEach((equipment,i) => {
        equipment.checked = false;
        if (i == index) {
          equipment.checked = true;
        }
     });

     obj.setData({
       equipmentList: equipmentList
     });

     // 跳转到设备详情页面
     obj.goto(equipmentList[index].number);
  },




  /**
   * 跳转到设备详情页面
   */
  goto: function (equipment_number) {
    var obj = this;
    var url = '../../pages/equipmentInfo/equipmentInfo?code=' + equipment_number;
    obj.setData({
      isOut: true
    });
    wx.navigateTo({
      url: url,
    })
    
  },

 
 /**
  * 清空设备列表
  */
 clearEquipment: function () {
   var obj = this;
   obj.setData({
     equipmentList: []
   });
 },


 /**
  * 扫码查询
  */
 scan: function ()  {
   var obj = this;
   wx.scanCode({
     onlyFromCamera: true,
     success:(res) => {
       obj.goto(res.result);
     }
   })
 },

 /**
  * 图片预览
  */
 preview (e) {
   util.preview(e);
 },





})