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
   * 选择物资
   */
  chooseMaterial () {
    var materialList = obj.data.materialList || [];
    var link = '../../pages/chooseMaterial/chooseMaterial?chooseList=' + JSON.stringify(materialList);
    wx.navigateTo({
      url: link,
    })
  },

  /**
   * 移除备件
   */
  removeMaterial: function (e) {
    wx.showModal({
      title: '提示',
      content: '是否确认删除?',
      success(tip) {
        if (tip.confirm) {
          var index = e.currentTarget.dataset.index;
          var materialList = obj.data.materialList;
          materialList.splice(index, 1);
          obj.setData({
            materialList: materialList
          });
        }
      }
    });
  },


  /**
   * 保存输入框的值
   */
  inputChange: function (e) {
    var index = e.currentTarget.dataset.index;
    var key = e.currentTarget.dataset.key;
    var value = e.detail.value;
    var materialList = obj.data.materialList;
    materialList[index][key] = value;
    obj.setData({
      materialList: materialList
    });
  },

  /**
   * 校验表单
   */
  checkForm: function () {
    var checkCount = 0, sumCount = 0;
    var materialList = obj.data.materialList || [];

    // 校验是否选择了物资
    if (materialList.length <= 0) {
      util.tipsMessage("请先添加备件");
      return false;
    }

    // 校验是否填写了物资消耗数量
    materialList.forEach(function (item, i) {
      if (!item.costCount || isNaN(item.costCount)) {
        checkCount++;
      } else {
        if (item.number <= parseFloat(item.costCount)) {
          sumCount++;
        }
      }
    });
    if (checkCount > 0) {
      util.tipsMessage("请正确填写所有备件消耗数量");
      return false;
    }
    if (sumCount > 0) {
      util.tipsMessage("备件使用数量超过剩余数量");
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
    // console.log(JSON.stringify(obj.data.materialList));
    // return;

    // 请求服务端接口，提交数据表单
    wx.showLoading({
      title: '处理中',
      mask: true
    });
    var url = util.getRequestURL("costMaterials.we");
    var param = { materialList: obj.data.materialList, user_id: app.user.id, dept_id: app.user.deptId };
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