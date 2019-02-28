var app = getApp();
var util = require('../../utils/util.js');
var obj = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
     titles: [
      { 
         title: "维修记录",  
         attribute1: {
           name: "", key: "finishtime"
         },
         attribute2: {
           name: "名称", key: "name"
         },
         attribute3: {
           name: "执行人", key: "executor"
         },
         attribute4: {
           name: "状态", key: "statusName"
         }
      },
       { 
         title: "保养记录", 
         attribute1: {
           name: "", key: "finishtime"
         },
         attribute2: {
           name: "名称", key: "name"
         },
         attribute3: {
           name: "执行人", key: "executor"
         },
         attribute4: {
           name: "状态", key: "statusName"
         } 
       },
       { 
         title: "备件消耗", 
         attribute1: {
           name: "", key: "createtime"
         },
         attribute2: {
           name: "名称", key: "name"
         },
         attribute3: {
           name: "执行人", key: "updateperson"
         },
         attribute4: {
           name: "数量", key: "number"
         }
       }
     ],
     startTime: '请选择',
     endTime: '请选择',
     showModalStatus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    obj = this;
    var equipmentid = options.equipmentid;
    var windowHeightRpx = util.getSystemInfo().windowHeightRpx;
    windowHeightRpx -= 240;
    obj.setData({
      equipmentid: equipmentid,
      windowHeightRpx: windowHeightRpx
    });
    obj.getData();
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
  getData: () => {
    var reqUrl = util.getRequestURL('getEquipmentWorkRecord.we');
    var param = {
      equipmentId: obj.data.equipmentid
    };

    // 开始时间
    var startTime = obj.data.startTime;
    if (startTime && startTime.indexOf('请') < 0) {
       param.startTime = startTime;
    }

    // 结束时间
    var endTime = obj.data.endTime;
    if (endTime && endTime.indexOf('请') < 0) {
      param.endTime = endTime + " 23:59:59";
    }

    // loading
    wx.showLoading({
      title: '加载中',
      mask: true
    })

    // 发起微信请求
    wx.request({
      url: reqUrl,
      dataType: 'json',
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: (res) => {
        // list1是维修记录(临时工作卡), list2是保养记录(周期工作卡)
        var list1 = [], list2 = [];
        if (res.data && res.data instanceof Array) {
          res.data.forEach(function (item, i) {
            if (item.workcardtype == 2) {
              list1.push(item);
            } else {
              list2.push(item);
            }
          });
        }
        // 更新数据
        var titles = obj.data.titles;
        titles[0].list = list1;
        titles[1].list = list2;
        obj.setData({
          titles: titles
        }, wx.hideLoading());
      },
      fail (e) {
        wx.hideLoading();
        util.tipsMessage("网络异常");
        console.log(e);
      }
    });

    // 查询该设备的备件消耗记录
    var reqUrl = util.getRequestURL('getSpareRecordByEquipment.we');
    var param = {
      equipmentId: obj.data.equipmentid
    };
    // 发起微信请求
    wx.request({
      url: reqUrl,
      dataType: 'json',
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: (res) => {
        // 更新数据
        var titles = obj.data.titles;
        titles[2].list = res.data;
        obj.setData({
          titles: titles
        });
      },
      fail(e) {
        console.log(e);
      }
    });
  },

  /**
   * 选择时间
   */
  chooseDate(e) {
    var key = e.currentTarget.dataset.key;
    obj.setData({
      showModalStatus: true,
      dateKey: key
    });
  },

  /**
   * 日历组件返回日期
   */
  saveSelectValue(res) {
     var key = obj.data.dateKey;
     var dou = {};
     if (res.detail.values) {
       dou.startTime = res.detail.values[0];
       dou.endTime = res.detail.values[1];
       dou.showModalStatus = false;
       obj.setData(dou);
       obj.getData();
     } else {
      dou.showModalStatus = false;
      obj.setData(dou);
     }
  }

})