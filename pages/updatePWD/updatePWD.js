var app = getApp();
var obj = null;
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logo: app.constant.logo,


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    obj = this;
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
   * 取出账户
   */
  init:() => {
    var account = wx.getStorageSync('account');
    obj.setData({
      account: account
    });
  },

  /**
   * 清除账号
   */
  clearAccount: function () {
    obj.setData({
      account: ''
    });
  },

  /**
   * 查看密码
   */
  lookPassword: function (e) {
    var key = e.currentTarget.dataset.flag;
    var value = obj.data[key];
    var dou = {};
    dou[key] = !value;
    obj.setData(dou);
  },


  /**
   * 保存表单参数
   */
  saveFormParam: (e) => {
    var key = e.currentTarget.dataset.key;
    var value = e.detail.value;
    var data = {};
    data[key] = value;
    obj.setData(data);
  },



  /**
   * 修改密码
   */
  updatePwd:() => {
     // 数据校验不通过
     if (!obj.checkParam()) {
        return; 
     }

     // 数据通过校验
     var param = obj.data.param;
     console.log(param);
     var reqUrl = util.getRequestURL('updatePassword.we');
     wx.showLoading({
       title: '处理中...',
       mask: true
     })
     wx.request({
       url: reqUrl,
       data: param,
       dataType: 'json',
       success:(res) => {
         wx.hideLoading();
         res = res.data;
         console.log(res);
         wx.showModal({
           title: '提示',
           content: res.message,
           showCancel: false,
           success: (rex) => {
             if (rex.confirm) {
               if (res.success) {
                 // 密码修改成功，返回上一页
                 wx.navigateBack({
                   delta: 1,
                 })
               }

             }
           }
         })

       },
       fail:(e) => {
         wx.hideLoading();
         console.log(e);
         wx.showModal({
           title: '提示',
           content: '请求失败！',
           showCancel: false
         })
       }
     })

  },

  /**
   * 校验数据
   */
  checkParam: () => {
    var param = {};
    // 原密码
    var password = obj.data.password;
    if (!password || password.length < 1) {
       wx.showModal({
         title: '提示',
         content: '请输入原密码！',
         showCancel: false,
       })
       return false;
    }
    
    // 新密码
    var newPassword = obj.data.newPassword;
    if (!newPassword || newPassword.length < 1) {
       wx.showModal({
         title: '提示',
         content: '请输入新密码！',
         showCancel: false,
       })
       return false;
    }

    if (password == newPassword) {
      wx.showModal({
        title: '提示',
        content: '新密码不能与原密码相同！',
        showCancel: false,
      })
      return false;
    }

    // 确认新密码
    var reNewPassword = obj.data.reNewPassword;
    if (!reNewPassword || reNewPassword.length < 1) {
      wx.showModal({
        title: '提示',
        content: '请确认新密码！',
        showCancel: false,
      })
      return false;
    }

    if (newPassword != reNewPassword) {
      wx.showModal({
        title: '提示',
        content: '两次输入的新密码不一致！',
        showCancel:false,
      })
      return false;
    }

    param.userName = obj.data.account;
    param.pwd = password;
    param.newPassword = newPassword;
    obj.data.param = param;
    // 数据校验通过
    return true;
   
    

  },




})