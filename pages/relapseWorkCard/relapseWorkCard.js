var app = getApp();
var util = require('../../utils/util.js');
var obj = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingStatus: true,
    pickerData: [{ code: -1, name: '请选择' }, { code: 0, name: '自行维修' }, { code: 1, name: '委外维修' } ],
    index: 0,
    contents: ['']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    obj = this;

    if (options.code) {
      obj.data.code = options.code;
    }

    // 页面初始化
    this.init();
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
   * 页面初始化
   */
  init: () => {
    wx.showLoading({
      title: '数据加载中',
      mask: true
    });
    var url = util.getRequestURL('getWcEquipmentcardByNumber.we');
    wx.request({
      url: url,
      data: {
        number: obj.data.code
      },
      success: function (res) {
        if (res.data) {
          obj.setData({
            loadingStatus: false,
            equipment: res.data
          });
          wx.hideLoading();
        } else {
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: '该条形码没有对应设备信息！',
            showCancel: false,
            complete: () => {
              wx.navigateBack({
                delta: 1
              });
            }
          });
        }
      },
      fail: (e) => {
        wx.hideLoading();
        console.log(e);
        util.showTipsMessage('数据加载失败');
      }
    });
  },

  /**
   * 保存表单数据
   */
  saveFormData: (e) => {
    var key = e.currentTarget.dataset.key;
    var value = e.detail.value;
    var data = {};
    data[key] = value;
    obj.setData(data);
  },

  /**
   * 添加内容
   */
  addContent: (e) => {
    var contents = obj.data.contents;
    contents.push('');
    obj.setData({ contents: contents });
  },

  /**
   * 删除内容
   */
  delContent: (e) => {
    wx.showModal({
      title: '提示',
      content: '确定删除？',
      success: (res) => {
        if (res.confirm) {
          var index = e.currentTarget.dataset.index;
          var contents = obj.data.contents;
          contents.splice(index, 1);
          obj.setData({ contents: contents });
        } 
      }
    })
  },

  /**
   * 保存内容数据
   */
  saveContentData: function (e) {
    var index = e.currentTarget.dataset.index;
    var value = e.detail.value;
    obj.data.contents[index] = value;
  },

  /**
   * 检查表单数据
   */
  checkFormData: function () {
    var data = obj.data;
    var name = data.name;
    var overhaulFunction = data.pickerData[data.index].code;
    if (!name) {
      wx.showModal({
        title: '提示',
        content: '请输入工作卡名称',
        showCancel: false
      });
      return false;
    }
    if (overhaulFunction < 0) {
      wx.showModal({
        title: '提示',
        content: '请选择维修方式',
        showCancel: false
      });
      return false;
    }
    return true;
  },

  /**
   * 保存临时工作卡数据
   */
  finsh: function () {
    if (!obj.checkFormData()) {
      return;
    }
    var data = obj.data;
    var param = {
      equipmentId: data.equipment.id,
      name: data.name,
      overhaulFunction: data.pickerData[data.index].code,
      content: data.contents.join(',')
    }
    wx.showLoading({
      title: '正在保存中',
      mask: true
    });
    var url = util.getRequestURL('addTemporaryWorkCard.we');
    wx.request({
      url: url,
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.success) {
          wx.showModal({
            title: '提示',
            content: '保存成功',
            showCancel: false,
            complete: function () {
              wx.navigateBack({
                delta: 1
              });
            }
          });
        } else {
          util.tipsMessage('保存失败！');
        }
      },
      fail: function (e) {
        wx.hideLoading();
        console.log(e);
        util.tipsMessage('网络异常！');
      }
    });
  }
})