var app = getApp();
var util = require('../../utils/util.js');
var obj = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isHidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    obj = this;
    var code = options.code || '20181224010101000001';
    obj.setData({
      code: code
    });

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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  
  /**
   * 初始化页面数据
   */
  init: () => {
    var spareList = [];
    var dou = {};
    var isHidden = true;
    var reqUrl = util.getRequestURL('getSpareByCode.we');
    var param = {
      code: obj.data.code,
      dept_id: app.user.deptId
    };

    // loadding
    wx.showLoading({
      title: '加载中...',
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
        res = res.data;
        if (res.success) {
          spareList = res.spareList;
          if (spareList.length > 1) {
            isHidden = false;
          }
          dou.spare = spareList[0] || {};
          dou.spareList = spareList;
          dou.isHidden = isHidden;
          // 设值
          obj.setData(dou);
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
   * 点击确定
   */
  confirm: () => {
    var spareList = obj.data.spareList;
    var chooseIndex = obj.data.chooseIndex;

    obj.setData({
      isHidden: true,
      spare: spareList[chooseIndex]
    });
  },

  /**
   * 点击取消
   */
  cancel: () => {
    obj.setData({
      isHidden: true
    });

  },

  /**
   * 展示船舶
   */
  showChoose: () => {
    obj.setData({
      isHidden: false
    });
  },


  /**
   * 选择船舶
   */
  choose: (e) => {
    var index = e.currentTarget.dataset.index;
    var spareList = obj.data.spareList || [];
    // 清空选中
    spareList.forEach((spare,i) => {
      spare.checked = false;
      if (i == index) {
        spare.checked = true;
      }
    });

    obj.setData({
      chooseIndex: index,
      spareList: spareList
    });
  },

  /**
   * 领用备件
   */
  pick: () => {
    var spare = obj.data.spare;
    var param = {
      spareout: {
        createperson: app.user.id,
        spareid: spare.id,
        status: 8, // 领取
        isdel: 1, // 是否删除
        tableid: 2 // 关联表id 
      }
    };

    var reqUrl = util.getRequestURL('saveSpareout.we');
   
    // loading
    wx.showLoading({
      title: '处理中...',
      mask: true
    })

    // 请求数据
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
            content: '领取成功！',
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
          console.log('程序异常！');
        } 
      },
      complete: (com) => {
        wx.hideLoading();
      }
    })

  },



})