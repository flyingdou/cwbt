var app = getApp();
var util = require('../../utils/util.js');
var obj = this;
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

    if (options.id) {
      obj.setData({
        id: options.id
      });
    }
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
    this.getContentList();
    this.getSupervisFeedBack();
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
   * 查询内容列表
   */
  getContentList: function () {
    var url = util.getRequestURL('getSupervisionContentList.we');
    var param = { supervisionId: obj.data.id };
    wx.request({
      url: url,
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: function (res) {
        var contents = res.data.contents;
        if (obj.data.feedback) {
          contents.push(obj.data.feedback);
        }
        contents.forEach(function (item, i) {
          // 处理签到日期
          var date = item.auto_date.split("-");
          var year = date[0];
          var month = date[1];
          var date = date[2].split(" ")[0];
          var monthTextList = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
          item.year = year;
          item.month = month;
          item.monthText = monthTextList[parseInt(month) - 1];
          item.date = date;
        });
        obj.setData({
          supervise: res.data
        });
      },
      fail: function (e) {
        util.tipsMessage('网络异常！');
        console.log(e);
      }
    });
  },

  /**
   * 查询督导反馈
   */
  getSupervisFeedBack: function () {
    var url = util.getRequestURL('getSupervisFeedBack.we');
    wx.request({
      url: url,
      data: {
        supervisionId: obj.data.id
      },
      success: function (res) {
        if (res.data) {
          res.data.type = 'feedback';
          var supervise = obj.data.supervise;
          obj.data.feedback = res.data;
        }
      },
      fail: function (e) {
        util.tipsMessage('网络异常！');
        console.log(e);
      }
    });
  },

  /**
   * 跳转页面
   */
  goto: function (e) {
    var index = e.currentTarget.dataset.index;
    var link = e.currentTarget.dataset.link;

    // 校验进入权限
    if (!obj.checkJurisdiction(index)) {
        wx.showModal({
          title: '提示',
          content: '抱歉，您暂无权限查看！',
          showCancel: false,
        })
      return;
    }

    wx.navigateTo({
      url: link
    });
  },

  // 校验进入权限
  checkJurisdiction: function (index) {
    // 判断进入权限
    var supervise = obj.data.supervise;
    if (app.user.id == supervise.creatorId) {
      return true;
    } else if (app.user.deptId == supervise.rec_dept) {
      return true;
    } else if (app.user.id == supervise.contents[index].opeartor) {
      return true;
    }   else if (app.user.deptId == supervise.contents[index].rec_dept) {
      return true;
    }
    return false;
  }
})