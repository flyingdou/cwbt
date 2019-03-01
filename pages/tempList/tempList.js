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
    hidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    obj = this;
    var overhaul = options.overhaul;
    if (!overhaul) {
        overhaul = 0; // 默认自行维修
    }

    obj.setData({
      userPriv: app.user.userPriv,
      overhaul: overhaul,
      user_id: app.user.id,
      windowHeightRpx: util.getSystemInfo().windowHeightRpx
    });

    
    var title = '';
    if (overhaul == 0) {
       title = '缺陷报审记录表(自行)';
    } else {
       title = '缺陷报审记录表(委外)';
    }

    wx.setNavigationBarTitle({
      title: title,
    })
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
    obj.data.currentPage = app.pageInfo.currentPage;
    obj.setData({
      titles: {
        0: [
          { title: '待审批'},
          { title: '审批拒绝' }
        ],
        1: [
          { title: '待审批' },
          { title: '审批拒绝' }
        ]
      }
    });
    
      this.getWorkCardList(0, 0, 1);
      this.getWorkCardList(2, 1, 1);
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
   * 跳转页面
   */
  goto: function (e) {
    var link = e.currentTarget.dataset.link;
    wx.navigateTo({
      url: link
    });
  },

  /**
   * 查询临时工作卡列表数据
   */
  getWorkCardList: function (audit_status, index, isdel) {
    var overhaul = obj.data.overhaul;
    var titles = obj.data.titles;
    var workCardList = titles[overhaul][index].workCardList || [];
    var url = util.getRequestURL('getTemporaryWorkCardList.we');
    var param = { 
      userPriv: app.user.userPriv, 
      deptId: app.user.deptId, 
      audit_status: audit_status,
      overhaul_function: obj.data.overhaul,
      isdel: isdel
    };

    // loading
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: url,
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: function (res) {
        workCardList = workCardList.concat(res.data);

        titles[overhaul][index].workCardList = workCardList;
        obj.setData({
          titles: titles
        });
        wx.hideLoading();
      },
      fail: function (e) {
        util.tipsMessage('网络异常！');
        console.log(e);
      }
    });
  },

  /**
   * releaseWorkcard
   */
  releaseWorkcard: () => {
    var code = '';
    // obj.gotoWork();
    // 扫码识别设备编号
    wx.scanCode({
      onlyFromCamera: true, // 仅能通过相机扫码
      success: (res) => {
        code = res.result;
        obj.data.code = code;
        obj.gotoWork();
      },
      fail: (e) => { // 扫码失败
        wx.showModal({
          title: '提示',
          content: '扫码失败，请重新扫码！',
          showCancel: false,
        })
        return;
      }
    })

  },

  /**
   * goto
   */
  gotoWork: () => {
     var code = obj.data.code;
     // 测试数据
    //  code = '121600110200400';
     if (!code || code == '') {
        wx.showModal({
          title: '提示',
          content: '扫码不正确！',
          showCancel: false,
        })
        return;
     }

    // 跳转
    var overhaul = obj.data.overhaul;
    var url = '../../pages/releaseTempWork/releaseTempWork?code=' + code + '&overhaul=' + overhaul;
     wx.navigateTo({
       url: url,
     })
  },



/**
 * 确定是否需要填写执行情况
 */
  sure() {
    obj.setData({
      hidden: false
    });
  },

  /**
   * 点击确定按钮
   */
  confirm() {
    obj.releaseWorkcard();
    obj.setData({
      hidden: true
    });
  },

  /**
   * 点击取消按钮
   */
  cancelx() {
    obj.setData({
      hidden: true
    });
  },
  

})