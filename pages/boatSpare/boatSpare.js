var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
     base_domain: app.constant.base_domain
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var obj = this;
    var dou = {};
    // 设置navList的值
    var navList = options.navList;
    var nav = options.nav;
    if (navList) {
      navList = JSON.parse(navList);
      nav = JSON.parse(nav);
      navList.push(nav);
      dou.navList = navList;
    }
    obj.setData(dou);
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
    var obj = this;
    var navList = obj.data.navList;
    var dept_id = null;
    var status = null;
    if (!navList) {
      dept_id = app.user.deptId;
      status = 0;
    }
    obj.getData(dept_id, status);

  },

  /**
   * 点击机构，查询下级
   */
  next (e) {
    var obj = this;
    var navList = obj.data.navList;
    var nav = e.currentTarget.dataset.dept;
    var deptList = obj.data.deptList;
    var deptindex = e.currentTarget.dataset.deptindex;
    // navList.push(nav);

    // 重置机构选中状态
    // deptList.forEach((dept,index) => {
    //   dept.checked = false;
    // });
    // deptList[deptindex].checked = true;
    // obj.setData({
    //   navList: navList,
    //   deptList: deptList
    // });

    // obj.getData(null, null);

    // 重载当前页面
    var link = '../../pages/boatSpare/boatSpare?navList=' + JSON.stringify(navList) + '&nav=' + JSON.stringify(nav);
    wx.navigateTo({
      url: link,
      success(){
        // console.log('跳转成功');
      }
    })

  },

  /**
   * 向上选择部门
   */
  up (e) {
    var obj = this;
    var index = e.currentTarget.dataset.index;
    var navList = obj.data.navList;

    // 选中当前部门，不做操作
    if (index == (navList.length - 1)) {
      return;
    }

    // 非当前部门，返回选中的部门层级
    var backIndex = navList.length - 1 - index;
    wx.navigateBack({
      delta: backIndex
    })

  },


  /**
   * 查询数据
   */
  getData (dept_id, status) {
    var obj = this;
    var reqUrl = util.getRequestURL('getDepartmentBoat.we');
    var param = {};

    var navList = obj.data.navList || [];
    dept_id = dept_id || navList[navList.length - 1].seq_id;
    param.dept_id = dept_id;
    param.boatType = "趸船";

    // loading
    wx.showLoading({
      title: '加载中...',
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
        var dou = {};
        if (res.success) {
          dou.deptList = res.deptBoatList;
          dou.boatList = res.boatList;
          if (status == 0) {
            navList.push(res.dept);
            dou.navList = navList;
          }
          // 存储数据
          obj.setData(dou);
        } else {
          console.log('请求数据出错！');
        }

      },
      complete: (com) => {
        wx.hideLoading();
      }

    })

  },


  /**
   * 选择船舶
   */
  boatChange (e) {
    var obj = this;
    var index = e.currentTarget.dataset.index;
    var link = e.currentTarget.dataset.link;
    var boatList = obj.data.boatList;
    // 清空所有选中
    boatList.forEach((item,i) => {
      item.checked = false;
    });
    boatList[index].checked = true;

    obj.setData({
      boatList: boatList,
      boat: boatList[index]
    });

    wx.navigateTo({
      url: link
    });

  },


/**
 * inputChange
 */
inputChange (e) {
  var obj = this;
  var key = e.currentTarget.dataset.key;
  var value = e.detail.value;
  var dou = {};
  dou[key] = value;

  // 如果查询字段为空，则清空已查询出来的备件结果
  if (!value) {
    dou.spareList = [];
  }

  obj.setData(dou);

},


/**
 * search
 */
search () {
  var obj = this;
  // 校验参数
  var spareName = obj.data.spareName || '';
  if (!spareName) {
    wx.showModal({
      title: '提示',
      content: '请输入备件名称查询！',
      showCancel: false
    })
    return;
  }
  var navList = obj.data.navList || [];


  var param = {
    deptId: navList[navList.length-1].seq_id,
    spareName: spareName
  };

  var reqUrl = util.getRequestURL('getSpareBySearch.we');

  // loading
  wx.showLoading({
    title: '加载中',
  })

  // request
  wx.request({
    url: reqUrl,
    dataType: 'json',
    data: {
      json: encodeURI(JSON.stringify(param))
    },
    success: (res) => {
      res = res.data;
      if (res.success) {
        obj.setData({
          spareList: res.spareList
        });
      }
    },
    complete: (com) => {
      wx.hideLoading();
    }
  })

},

/**
 * goto
 */
goto (e) {
  var link = e.currentTarget.dataset.link;
  wx.navigateTo({
    url: link,
  })
},


/**
 * 图片预览
 */
preview (e) {
  util.preview(e);
},

})