var app = getApp();
var util = require('../../utils/util.js');
var obj = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentPage: app.pageInfo.currentPage,
    pageSize: app.pageInfo.pageSize,
    taskList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     obj = this;
     obj.setData({
       user_id: app.user.id
     });
    // 跳转页面类型 
    var queryType = options.queryType;
    if (queryType) {
      obj.data.queryType = queryType;
     }
     
     
     // 部门id
     var dept_id = options.dept_id;
     if (dept_id) {
       obj.data.dept_id = dept_id;
     }

     // 船舶id
     var boat_id = options.boat_id; 
     if (boat_id) {
       obj.data.boat_id = boat_id;
     }

     // 抽查标记
     var flag = options.flag;
     if (flag) {
       obj.data.flag = flag;
     }

     // 船舶部门
    var boatdepartment = options.boatdepartment;
    if (boatdepartment) {
      obj.data.boatdepartment = boatdepartment;
    }
    

    // 修改的列表
    var isUpdate = options.isUpdate;
    if (isUpdate) {
        obj.setData({
          isUpdate: isUpdate
        });
    }

    // 船舶id2
    var boatId = options.boatId;
    if (boatId) {
       obj.data.boatId = boatId;
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
    obj.data.currentPage++;
    obj.init();
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
    var isUpdate = obj.data.isUpdate;
    var reqUrl = util.getRequestURL('getWorkCardList.we');
    
    var param = {};
    var queryType = obj.data.queryType;
    var boatdepartment = obj.data.boatdepartment;
    if (queryType == 1) { // 周期工作列表
      // console.log(obj.data.boatId);
      param = {
        type: '1',
        dept_id: app.user.deptId,
        status: '1,3,9', // 未完成、进行中
        boatdepartment: boatdepartment, //船舶部门
        boatId: obj.data.boatId, // 船舶Id
      };
    } else if (obj.data.queryType == 2) { // 临时工作列表
      param = {
        type: '2',
        dept_id: app.user.deptId,
        status: '1,9' // 未完成、进行中
      };
    } else if (obj.data.queryType == 3) { // 抽查工作列表
      param = {
        type: '1,2',
        dept_id: app.user.deptId,
        status: '2,3' // 已完成、已验收
      };
    }

    if (isUpdate) {
      reqUrl = util.getRequestURL('getWorkcardUpdateAbleList.we');
      param = {
        executor_id: app.user.id
      };
    } 

    // 分页
    param.currentPage = obj.data.currentPage;
    param.pageSize = obj.data.pageSize;
    
    // console.log(param);
    // return;
    // loading
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: reqUrl,
      dataType:'json',
      data:{
        requestType:'wechat',
        json: encodeURI(JSON.stringify(param))
      },
      success: (res) => {
        res = res.data;
        if (res.success) {
          var taskList = obj.data.taskList;
          var workcardList = util.formatPlanTime(res.workCardList);
          taskList = taskList.concat(workcardList);
          obj.setData({
            taskList: taskList,
            isGet: false
          });
        }
      },
      complete: (com) => {
        wx.hideLoading();
      }
    })

  },

  /**
   * 跳转到任务详情页面
   */
  goto: (e) => {
    var index = e.currentTarget.dataset.index;
    var workCard = obj.data.taskList[index];
    if (workCard.status == 9 && workCard.collectorpersonid != app.user.id) {
      wx.showModal({
        title: '提示',
        content: '该工作已在进行中，请选择其他工作！',
        showCancel: false
      })
      return;
    }

    // 跳转传参
    var redUrl = '../../pages/TlistDetail/TlistDetail?workCardId=' + workCard.id + '&workCardStatus=' + workCard.status;
    wx.navigateTo({
      url: redUrl,
    })
  },

  /**
   * 多选
   */
  chooseChange: (e) =>{
    var chooseList = e.detail.value;
    obj.setData({
      chooseList: chooseList
    });
  },

  /**
   * ni
   */
  ni: () => {

  },


  /**
   * 触发多选
   */
  chooseStart: () => {
     obj.setData({
       isGet: true
     });
  },

  /**
   * 取消多选框
   */
  undo: () => {
    obj.setData({
      isGet: false,
      chooseList:[]
    });
  },



  // 领取任务
  getTask: (e) => {
    var chooseList = obj.data.chooseList;
    if (chooseList.length == 0) {
      obj.setData({
        isGet:false
      });
       return;
    }
    chooseList.join(',');
    var status = e.currentTarget.dataset.status;
    
    // 参数
    var param = {
      id: chooseList,
      status: status,
      collectorpersonid: app.user.id
    };

    wx.request({
      url: util.getRequestURL('updateMuiltWorkCard.we'),
      dataType: 'json',
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: (res) => {
        res = res.data;
        if (res.success) {
          chooseList = obj.data.chooseList;
          var taskList = obj.data.taskList;
          for (var c in chooseList) {
            for (var t in taskList) {
              if (chooseList[c] == taskList[t].id) {
                taskList[t].status = param.status;
                taskList[t].collectorpersonid = param.collectorpersonid;
              }
            }
          }

          // 设置到页面数据中
          obj.setData({
            taskList: taskList,
            isGet: false
          });
        }
      }
    })


  },

  /**
   * 取消领取
   */
  unchoose: (e) => {
    var index = e.currentTarget.dataset.index;
    var work = e.currentTarget.dataset.item;
    var param = {
      id: work.id,
      collectorpersonid: app.user.id,
      subffix: work.subffix || work.prefix
    };

    var taskList = obj.data.taskList;

    wx.request({
      url: util.getRequestURL('unchooseWork.we'),
      dataType: 'json',
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: (res) => {
        res = res.data;
        if (res.success) {
             taskList[index].status = res.status;
             obj.setData({
               taskList: taskList
             });
        }
      }
    })
      


  }






})