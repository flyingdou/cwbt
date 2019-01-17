var app = getApp();
var util = require('../../utils/util.js');
var obj = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    spareoutList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    obj = this;

    if (options.spare) {
      var spare = JSON.parse(decodeURI(options.spare));
      obj.setData({
        spare: spare
      });
    }
    
    obj.addSpareout();
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
   * inputChange
   */
  inputChange: (e) => {
    var spareoutList = obj.data.spareoutList;
    spareoutList[e.currentTarget.dataset.index][e.currentTarget.dataset.key] = e.detail.value;
    spareoutList[e.currentTarget.dataset.index][e.currentTarget.dataset.name] = e.detail.value;
    obj.setData({
      spareoutList: spareoutList
    });
  },

  /**
   * 添加备件消耗记录
   */
  addSpareout() {
    var spareoutList = obj.data.spareoutList;
    var spare = obj.data.spare;
    var spareout = { spareid: spare.spareid, createperson: app.user.id, updateperson: app.user.id, status: 7, isdel: 0, tableid: 2 };
    if (spareoutList.length == 0) {
      spareout.id = spare.id;
    }
    spareoutList.push(spareout);
    obj.setData({
      spareoutList: spareoutList
    });
  },

  /**
   * 扫码查询设备
   */
  chooseDevice: (e) => {
    // var number = '121600110801100';
    // obj.getEquipment(number);
    var index = e.currentTarget.dataset.index;
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        obj.getEquipment(res.result, index);
      },
      fail: (f) => {
        wx.showModal({
          title: '提示',
          content: '条形码不正确！',
          showCancel: false
        })
      }
    })
    
  },

  getEquipment: (number, index) => {
    var reqUrl = util.getRequestURL('getWcEquipmentcardByNumber.we');

    // loading
    wx.showLoading({
      title: '加载中...',
    })
    
    wx.request({
      url: reqUrl,
      dataType: 'json',
      data: {
        number: number
      },
      success: (res) => {
        res = res.data;
        if (res) {
          var spareoutList = obj.data.spareoutList;
          spareoutList[index].equipment = res;
          spareoutList[index].inequipment = res.id;
          obj.setData({
            spareoutList: spareoutList
          });
        }
      },
      complete: (com) => {
        wx.hideLoading();
      }
    })


  },

  
  /**
   * 备件消耗
   */
  cost: () => {
     // 数据校验
     if (!obj.checkParam()) {
        return;
     }

     var param = { spareoutList: obj.data.spareoutList };
     var reqUrl = util.getRequestURL('saveSpareout.we');

     // loading
     wx.showLoading({
       title: '处理中...',
     })

     // 发起请求
     wx.request({
       url: reqUrl,
       dataType: 'json',
       data: {
         json: encodeURI(JSON.stringify(param))
       },
       success: (res) => {
         res = res.data;
         if (res.success) {
           wx.showModal({
             title: '提示',
             content: '操作成功！',
             showCancel: false,
             success: (con) => {
               if (con.confirm) {
                 wx.navigateBack({
                   delta: 1
                 })
               }
             }
           })
         } else {
           console.log('消耗备件出错！');
         }
       },
       complete: (com) => {
         wx.hideLoading();
       }
     })

  },


  /**
   * 校验数据
   */
  checkParam: () => {
    var result = true, sumCount = 0;
    var spareoutList = obj.data.spareoutList;

    spareoutList.forEach(function (item, i) {
      var costCount = item.costCount;
      if (!costCount) {
        wx.showModal({
          title: '提示',
          content: '请输入备件使用数量！',
          showCancel: false
        })
        result = false;
      }

      var equipment = item.equipment;
      if (!equipment) {
        wx.showModal({
          title: '提示',
          content: '请选择消耗地点！',
          showCancel: false
        })
        result = false;
      }

      sumCount += parseInt(item.costCount);
    });

    
    var spare = obj.data.spare;
    if (sumCount > spare.number) {
      wx.showModal({
        title: '提示',
        content: '备件使用数量，不可大于备件总数！',
        showCancel: false
      })
      result = false;
    }
  

    return result;

  },

})