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
    var chooseList = options.chooseList;
    if (chooseList) {
       obj.data.chooseList = JSON.parse(chooseList);
    }

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
   * 初始化页面数据
   */
  init () {
    var reqUrl = util.getRequestURL('getMaterialList.we');
    var param = {};

    // loading
    wx.showLoading({
      title: '加载中',
    })

    // wx.request
    wx.request({
      url: reqUrl,
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success (res) {
        var chooseList = obj.data.chooseList || [];
        var materialList = res.data.data;
        // 双重for循环，标识已选中的物资
        chooseList.forEach((choose) => {
          materialList.forEach((material) => {
            if (choose.id == material.id) {
              material.choose = true;
            } 
          });
        });
        obj.setData({
          materialList: materialList
        });
        // hideload
        wx.hideLoading();
      },
      fail (e) {
        wx.hideLoading();
      }
    })
    
  },

  /**
   * 选择物资
   */
  choose (e) {
   var index = e.currentTarget.dataset.index;
   var materialList = obj.data.materialList;
   materialList[index].choose = !materialList[index].choose;
   obj.setData({
     materialList: materialList
   });
  }, 

 /**
  * 点击确定，返回上一页
  */
 sure () {
   var chooseList = [];
   var materialList = obj.data.materialList || [];
   materialList.forEach((material) => {
     if (material.choose) {
        chooseList.push(material);
     }
   });
   
   // 未选择物资
   if (chooseList.length < 1) {
      wx.showModal({
        title: '提示',
        content: '请选择物资！',
        showCancel: false
      })
      return;
   }

  
   // 将值存储到来时的页面上
   var pages = getCurrentPages();
   // 获取上一页面对象
   var prePage = pages[pages.length - 1 -1];
   prePage.setData({
     materialList: chooseList
   });

   wx.navigateBack({
     delta: 1
   })
 }

  
})