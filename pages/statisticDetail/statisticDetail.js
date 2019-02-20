var app = getApp();
var util = require('../../utils/util.js');
var obj = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
      titles: {
        handle: [
          { title: '已完成', checkStatusKey: 'workstatus', checkStatus: 2 },
          { title: '未完成', checkStatusKey: 'workstatus', checkStatus: 1 }
        ],
        valid: [
          { title: '已验收', checkStatusKey: 'typeStatus', checkStatus: 1 },
          { title: '未验收', checkStatusKey: 'typeStatus', checkStatus: 2 }
        ]
      }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    obj = this;
 

    // 船舶id
    if (options.boatId) {
      obj.data.boatId = options.boatId;
    }
    
    // 开始时间
    if (options.startDate) {
      obj.data.startDate = options.startDate;
    }

    // 结束时间
    if (options.endDate) {
      obj.data.endDate = options.endDate;
    }

    // type
    if (options.type) {
      obj.setData({
        type: options.type
      });
    }

    obj.setData({
      windowHeightRpx: util.getSystemInfo().windowHeightRpx
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
    this.queryData();
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
   * 查询数据
   */
  queryData: function () {
    wx.showLoading({
      title: '查询中',
      mask: true
    });
    var url = util.getRequestURL('statisticsdetails.we');
    var param = { boatid: obj.data.boatId };
    var style = 0;
    if (obj.data.startDate) {
      param.begintime = obj.data.startDate;
    }
    if (obj.data.endDate) {
      param.endtime = obj.data.endDate;
    }
    if (obj.data.type == 'handle') {
      style = 1;
    }
    if (obj.data.type == 'valid') {
      style = 2;
    }

    param.style = style;


    // 测试数据
    // console.log(param);
    
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: url,
      dataType:'json',
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: function (res) {
        var titles = obj.data.titles;
        var count1 = 0, count2 = 0;
        if (obj.data.type == 'valid') {
          res.data.list.forEach((item, i) => {
            if ([2, 3].includes(item.checkstatus)) {
              item.typeStatus = 1;
              count1++;
            } else if ([1, 4].includes(item.checkstatus)) {
              item.typeStatus = 2;
              count2++;
            }
            titles.valid[0].count = count1;
            titles.valid[1].count = count2;
          });
        } else {
          res.data.list.forEach((item, i) => {
            if ([2].includes(item.workstatus)) {
              count1++;
            } else if ([1].includes(item.workstatus)) {
              count2++;
            }
            titles.handle[0].count = count1;
            titles.handle[1].count = count2;
          });
        }
        obj.setData({
          titles: titles,
          list: res.data.list
        }, wx.hideLoading());
      },
      fail: function (e) {
        wx.hideLoading();
        util.tipsMessage('网络异常！');
        console.log(e);
      }
    });
  },

  goto: function (e) {
    var link = e.currentTarget.dataset.link;
    wx.navigateTo({
      url: link
    });
  }

})