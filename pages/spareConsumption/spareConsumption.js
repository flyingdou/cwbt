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
    // 接收选择设备页面的设备信息
    if (wx.getStorageSync("equipment")) {
      var equipment = wx.getStorageSync("equipment");
      wx.removeStorageSync("equipment");
      obj.setData({
        equipment: equipment
      });
    }
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
    if (link) {
      wx.navigateTo({
        url: link
      });
    }
  },

  /**
   * 添加备件
   */
  addSpare: function () {
    wx.showModal({
      title: '提示',
      content: '将要扫描设备条码，用以验证设备，确定吗？',
      success(tip) {
        if (tip.confirm) {
          // 扫码
          wx.scanCode({
            onlyFromCamera: true,
            scanType: ['barCode'],
            success(res) {
              // 查询备件数据
              obj.queryData(res.result);
            } 
          });
        }
      }
    });
  },

  /**
   * 移除备件
   */
  removeSpare: function (e) {
    wx.showModal({
      title: '提示',
      content: '是否确认删除?',
      success(tip) {
        if (tip.confirm) {
          var index = e.currentTarget.dataset.index;
          var spareList = obj.data.spareList;
          spareList.splice(index, 1);
          obj.setData({
            spareList: spareList
          });
        }
      }
    });
  },

  /**
   * 查询数据
   */
  queryData: function (code) {
    wx.showLoading({
      title: '数据加载中',
      mask: true
    });
    var url = util.getRequestURL("getSpareByCode.we");
    var param = { code: code, dept_id: app.user.deptId };
    wx.request({
      url: url,
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success(res) {
        // 把查询出来的备件添加到页面备件列表中
        var spareList = obj.data.spareList || [];
        var data = res.data.spareList;
        if (data && data.length > 0) {
          var count = 0;
          spareList.forEach(function (item, i) {
            if (item.id == data[0].id) {
              count++;
            }
          });
          if (count == 0) {
            spareList.push(data[0]);
          } else {
            util.tipsMessage("该备件已经添加过，无法重复添加");
          }
          obj.setData({
            spareList: spareList
          }, wx.hideLoading());
        } else {
          // 没有查询出结果，提示用户
          wx.hideLoading();
          util.tipsMessage("该条形码没有对应的备件");
        }
      },
      fail(e) {
        wx.hideLoading();
        util.tipsMessage("网络异常");
        console.log(e);
      }
    });
  },

  /**
   * 保存输入框的值
   */
  inputChange: function (e) {
    var index = e.currentTarget.dataset.index;
    var key = e.currentTarget.dataset.key;
    var value = parseFloat(e.detail.value);
    var spareList = obj.data.spareList;
    if (spareList[index].number >= value) {
      spareList[index][key] = value;
    } else {
      util.tipsMessage("输入的数量超过当前备件的剩余数量");
      spareList[index][key] = "";
    }
    obj.setData({
      spareList: spareList
    });
  },

  /**
   * 校验表单
   */
  checkForm: function () {
    var checkCount = 0;
    var spareList = obj.data.spareList || [];

    // 校验是否选择了设备
    if (!obj.data.equipment) {
      util.tipsMessage("请先选择设备");
      return false;
    }

    // 校验是否选择了备件
    if (spareList.length <= 0) {
      util.tipsMessage("请先添加备件");
      return false;
    }

    // 校验是否填写了备件消耗数量
    for (var i = 0; i < spareList.length; i++) {
      if (!spareList[i].costCount) {
        checkCount++;
      }
    }
    if (checkCount > 0) {
      util.tipsMessage("请填写完所有备件消耗数量");
      return false;
    }

    // 校验通过
    return true;
  },

  /**
   * 提交数据
   */
  submit: function () {
    // 校验表单数据
    if (!obj.checkForm()) {
      return;
    }
    // 请求服务端接口，提交数据表单
    wx.showLoading({
      title: '处理中',
      mask: true
    });
    var url = util.getRequestURL("addSpareoutRecord.we");
    var param = { equipmentId: obj.data.equipment.id, spareList: obj.data.spareList, userId: app.user.id };
    wx.request({
      url: url,
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success(res) {
        wx.hideLoading();
        if (res.data.success) {
          util.tipsMessage("操作成功", wx.navigateBack({
            delt: 1
          }));
        } else {
          util.tipsMessage("程序异常，请联系开发人员");
        }
      },
      fail(e) {
        wx.hideLoading();
        util.tipsMessage("网络异常");
        console.log(e);
      }
    });
  }
})