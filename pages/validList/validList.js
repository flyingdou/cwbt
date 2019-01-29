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
    obj.setData({
      currentPage: 1,
      pageSize: 20,
      validList: []
    });
    obj.init();
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
     obj.data.currentPage++;
     obj.init();
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
    var chooseList = e.detail.value;
    var validList = obj.data.validList;

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
    var validList = obj.data.validList;
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
      validList: validList,
      chooseList: chooseList,
      isAll: isAll
    });

  },

  /**
   * 初始化页面数据
   */
  init: () => {
    var validList = obj.data.validList || [];
    // 发起请求
    var reqUrl = util.getRequestURL('getWorkfeedbackList.we');
    var param = {
      dept_id: app.user.deptId,
      userId: app.user.id,
      currentPage: obj.data.currentPage,
      pageSize: obj.data.pageSize
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
            validList = validList.concat(res.workfeedbackList);
            var isAll = {
              id: "0",
              checked: false
            };
            obj.setData({
              validList: validList,
              isAll: isAll
            });
        }
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
    wx.navigateTo({
      url: '../../pages/valid/valid?id=' + id,
    })
    
  }


})