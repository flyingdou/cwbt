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
    var spare = options.spare;
    obj.setData({
      spare: JSON.parse(decodeURI(spare))
    });

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
    var dou = {};
    dou[e.currentTarget.dataset.key] = e.detail.value;
    obj.setData(dou);
  },

  /**
   * 扫码查询设备
   */
  chooseDevice: () => {
    // var number = '121600110801100';
    // obj.getEquipment(number);
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        obj.getEquipment(res.result);
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

  getEquipment: (number) => {
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
          obj.setData({
            equipment: res
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

     var param = obj.data.param;
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
    var param = {};

    var costCount = obj.data.costCount;
    if (!costCount) {
      wx.showModal({
        title: '提示',
        content: '请输入备件使用数量！',
        showCancel: false
      })
      return false;
    }

    var spare = obj.data.spare;
    if (costCount > spare.number) {
      wx.showModal({
        title: '提示',
        content: '备件使用数量，不可大于备件总数！',
        showCancel: false
      })
      return false;
    }
    

    var equipment = obj.data.equipment;
    if (!equipment) {
      wx.showModal({
        title: '提示',
        content: '请选择消耗地点！',
        showCancel: false
      })
      return false;
    }

    param.id = spare.id;
    param.updateperson = app.user.id;
    param.number = costCount;
    param.inequipment = equipment.id;
    param.status = 7; // 消耗
    param.isdel = 0; // 是否删除
    param.spareid = spare.spareid;
    
    obj.data.param = param;
    console.log(param);

    return true;

  },

})