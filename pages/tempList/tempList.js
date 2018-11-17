var app = getApp();
var util = require('../../utils/util.js');
var obj = {};
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
    var overhaul = options.overhaul;

    obj.setData({
      userPriv: app.user.userPriv,
      overhaul: overhaul,
      user_id: app.user.id,
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
    this.getWorkCardList();
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

  goto: function (e) {
    var index = e.currentTarget.dataset.index;
    var workCard = obj.data.workCardList[index];
    if (workCard.collectorpersonid != app.user.id) {
        wx.showModal({
          title: '提示',
          content: '该任务已被他人领取，请选择其他任务！',
          showCancel: false
        })
        return;
    }
    var link = e.currentTarget.dataset.link;
    wx.navigateTo({
      url: link
    });
  },

  /**
   * 查询督导列表数据
   */
  getWorkCardList: function () {
    var url = util.getRequestURL('getTemporaryWorkCardList.we');
    var param = { 
      userPriv: app.user.userPriv, 
      deptId: app.user.deptId, 
      status: [1,9], // 未完成、被领取的
      overhaul_function: obj.data.overhaul 
      };
    wx.request({
      url: url,
      data: {
        json: JSON.stringify(param)
      },
      success: function (res) {
        obj.setData({
          workCardList: res.data
        });
      },
      fail: function (e) {
        util.tipsMessage('网络异常！');
        console.log(e);
      }
    });
  },

  /**
   * 取消领取
   */
  cancle: (e) => {
    wx.showModal({
      title: '提示',
      content: '确定取消领该任务吗？',
      success: (rex) => {
        if (rex.cancel) {
          return;
        }
        
        // 执行释放任务操作
        if (rex.confirm) {
          obj.release(e);
        }
      }
    })
   

  },
 
  /**
   * 释放任务
   */
  release: (e) => {
    var reqUrl = app.constant.base_req_url + 'updateWorkCard.we';
    var index = e.currentTarget.dataset.index;
    var workCardList = obj.data.workCardList;
    var param = {
      id: workCardList[index].id,
      status: 1 // 未处理状态
    };

    // 发起微信请求
    wx.request({
      url: reqUrl,
      dataType: 'json',
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: (res) => {
        res = res.data;
        if (res.success) {
          workCardList[index].status = param.status;
          obj.setData({
            workCardList: workCardList
          });
        }
      }
    })
  }
})