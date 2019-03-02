var app = getApp();
var util = require('../../utils/util.js');
var obj = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titles: [
      { title: '周期工作' },
      { title: '自行维修' },
      { title: '委外维修' }
    ],
    tabIndex: 0,
    currentPage: app.pageInfo.currentPage,
    pageSize: app.pageInfo.pageSize
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     obj = this;

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
    // 设置默认分页参数
    // obj.data.currentPage = app.pageInfo.currentPage;
    // obj.data.validList = [];
    obj.init();
    obj.getTempList(0);
    obj.getTempList(1);
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
    //  obj.data.currentPage++;
    //  obj.init();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 多选框
   */
  checkboxChange: (e) => {
    var tabIndex = obj.data.tabIndex;
    var chooseList = e.detail.value;
    var titles = obj.data.titles;
    var validList = titles[tabIndex].list;

    // 清除选中
    for (var x in validList) {
        validList[x].checked = false;
    }

    // 选中被选中的项
    for (var cIndex in chooseList) {
      for (var vIndex in validList) {
          if (chooseList[cIndex] == validList[vIndex].id) {
             validList[vIndex].checked = true;
          }
        }
    }
    
    // 全选状态判断
    var isAll = obj.data.isAll;
    if (chooseList.length == validList.length) {
      isAll.checked = true;
    } else {
      isAll.checked = false;
    }
    obj.setData({
      isAll: isAll,
      validList: validList,
      chooseList: chooseList
    });
  },
  
  /**
   * 选择
   */
  chooseAll: (e) => {
    var tabIndex = e.currentTarget.dataset.tabindex;
    var index = e.currentTarget.dataset.index;
    var titles = obj.data.titles;
    var validList = titles[tabIndex].list;
    var id = e.detail.value;
    var isAll = obj.data.isAll;
    var chooseList = obj.data.chooseList;
    if (!chooseList) {
      chooseList = [];
    }
    if (id && id.length > 0) {
      // 全选
       for (var v in validList) {
        validList[v].checked = true;
        chooseList[v] = validList[v].id;
      }
      isAll.checked = true;
    } else {
      // 取消全选
      for (var v in validList) {
          validList[v].checked = false;
      }
      isAll.checked = false;
    }

    obj.setData({
      titles: titles,
      chooseList: chooseList,
      isAll: isAll
    });

  },

  /**
   * 初始化页面数据
   */
  init: () => {
    wx.showLoading({
      title: '数据加载中',
      mask: true
    });
    var titles = obj.data.titles;
    var validList = obj.data.validList || [];
    // 发起请求
    var reqUrl = util.getRequestURL('getWorkfeedbackList.we');
    var param = {
      dept_id: app.user.deptId,
      userId: app.user.id
    };
    wx.request({
      url: reqUrl,
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      dataType: 'json',
      success: (res) => {
        res = res.data;
        if (res.success) {
            // 两个数组结果拼接
            // validList = validList.concat(res.workfeedbackList);
            titles[0].list = res.workfeedbackList;
            var isAll = {
              id: "0",
              checked: false
            };
            obj.setData({
              titles: titles,
              isAll: isAll
            }, wx.hideLoading());
        }
      },

      fail(e) {
        wx.hideLoading();
        util.tipsMessage("网络异常");
        console.log(e);
      }
    })
    
    
  },

  /**
    * 验收
    */
  valid: (e) => {
    var chooseList = obj.data.chooseList;
    var status = e.currentTarget.dataset.status;
    status = parseInt(status);
    // 校验数据
    if (!chooseList || chooseList.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请选择工作！',
        showCancel: false
      })
      return;
    }
    var content = '';
    if (status == 2) {
      content = '确定要验收这些工作吗？';
    }

    if (status == 3) {
      content = '确定要驳回这些工作吗？';
    }
    // 提示
    wx.showModal({
      title: '提示',
      content: content,
      success: (rx) => {
        if (rx.confirm) {
           obj.updateStatus(status);
        }
      }
    })
    

  },

  /**
   * 修改状态
   */
  updateStatus: (status) => {
    var chooseList = obj.data.chooseList;
    var reqUrl = util.getRequestURL('updateWorkFeedBackStatus.we');
    chooseList = chooseList.join(",");
    var param = {
      id: chooseList,
      confirm_id: app.user.id,
      status: status
    };
    
    wx.showLoading({
      title: '处理中...',
      mask: true
    })
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
            success: (rex) => {
              if (rex.confirm) {
                wx.navigateBack({
                  delta: 1 // 返回层级
                })
              }
            }

          })
        }
      },
      complete: (rr) => {
        wx.hideLoading();
      }
    })
  },

  /**
   * 跳转详情页面
   */
  goto: (e) => {
    var id = e.currentTarget.dataset.id;
    var url = '../../pages/valid/valid?id=' + id;
    if (obj.data.tabIndex == 1) {
      url = '../../pages/tempValid/tempValid?id=' + id + '&overhaul=0';
    } else if (obj.data.tabIndex == 2) {
      url = '../../pages/tempValid/tempValid?id=' + id + '&overhaul=1';
    }
    wx.navigateTo({
      url: url
    })
  },

  /**
  * 查询临时工作卡
  */
  getTempList: function (overhaul) {
    var url = util.getRequestURL("getTemporaryWorkCardList.we");
    var param = {
      overhaul_function: overhaul,
      deptId: app.user.deptId,
      userPriv: app.user.userPriv,
      isdel: 0,
      status: 2,
      boatId: obj.data.boatId,
      boatdepartment: obj.data.boatdepartment,
      audit_status: 1,
      valid_status: 1
    };
    wx.request({
      url: url,
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success(res) {
        var titles = obj.data.titles;
        var index = overhaul + 1;
        titles[index].list = res.data;
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
   * 获取选中标签的索引
   */
  getTabIndex: function (e) {
    var index = e.detail.index;
    obj.setData({
      tabIndex: index
    });
  }

})