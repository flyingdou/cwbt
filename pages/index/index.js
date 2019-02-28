var app = getApp();
var util = require('../../utils/util.js');
var obj = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    base_img_url: app.constant.base_img_url,
    logo: app.constant.logo,
    passworkInputType: 'password',
    workCount: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    obj = this;
    if (app.user.id) {
       obj.init();
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
    // 判断用户是否登录
    if (app.user.id) {
      wx.setNavigationBarColor({ 
        backgroundColor: '#000000',
        frontColor: '#ffffff',
        animation: {
          duration: 400,
          timingFunc: 'easeIn'
        }
      });
      obj.setData({
        isLogin: false,
        userPriv: app.user.userPriv
      });
      wx.showTabBar();
    } else {
      wx.setNavigationBarColor({ 
        backgroundColor: '#348BFF',
        frontColor: '#ffffff',
        animation: {
          duration: 400,
          timingFunc: 'easeIn'
        }
      });
      obj.setData({
        isLogin: true,
        password: ''
      });
      wx.hideTabBar();
    }

    // 用户账号保留
    if (wx.getStorageSync('account')) {
      obj.setData({
        account: wx.getStorageSync('account')
      });
    }

    // 根据用户部门ID查询任务数量
    if (app.user.deptId) {
      var url = util.getRequestURL('getWorksCount.we');
      var param = { deptId: app.user.deptId, userId: app.user.id, userPriv: app.user.userPriv };
      wx.request({
        url: url,
        data: {
          json: encodeURI(JSON.stringify(param))
        },
        success: (res) => {
          var workCount = res.data;
          obj.setData({
            workCount: workCount
          });
        }
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
  goto: (e) => {
    var link = e.currentTarget.dataset.link;
    var key = e.currentTarget.dataset.key;
    var value = e.currentTarget.dataset.value;
    var userpriv = e.currentTarget.dataset.userpriv;
    app.user.userPriv = userpriv;
    if (key && value) {
      wx.setStorageSync(key, obj.data[value]);
    }
    var message = e.currentTarget.dataset.message;
    if (link && link != '') {
      wx.navigateTo({
        url: link
      });
    } else {
      wx.showModal({
        title: '提示',
        content: message,
        showCancel: false
      });
    }
  },

  /**
   * 保存用户输入的账号并检查该账号有没有微信小程序标识
   */
  checkAccountWechatId: (e) => {
    // 保存账号
    obj.setData({ account: e.detail.value });
    // 根据账号查询微信标识(达到手机号码11位)
    if (obj.data.account.length == 11) {
      var url = util.getRequestURL('checkWechatMPIdByUser.we');
      wx.request({
        url: url,
        data: {
          account: obj.data.account
        },
        success: (res) => {
          if (res.data.code <= 0) {
            obj.setData({
              isGetUserInfo: true
            });
            wx.login({
              success: (res) => {
                obj.data.code = res.code;
              }
            });
          }
        },
        fail: (e) => {
          console.log(e);
        }
      });
    }
  },

  /**
   * 保存表单参数
   */
  saveFormParam: (e) => {
    var key = e.currentTarget.dataset.key;
    var value = e.detail.value;
    var data = {};
    data[key] = value;
    obj.setData(data);
  },

  /**
   * 登录
   */
  login: (e) => {
    // 校验账号，密码是否填写
    if (!obj.data.account || !obj.data.password) {
      util.tipsMessage('请输入账号密码！');
      return;
    }
    // 获取参数，校验参数，生成json
    var param = {}, encryptedData = null;
    if (e.type == 'getuserinfo') {
      param = e.detail;
    }
    if (obj.data.code) {
      param.code = obj.data.code;
    }
    if (param.encryptedData) {
      encryptedData = param.encryptedData;
      param.encryptedData = null;  
    }
    // 弹出加载框
    wx.showLoading({
      title: '登录中',
      mask: true,
    });
    // 调用服务端登录接口
    var url = util.getRequestURL('login.we');

    wx.request({
      url: url,
      data: {
        userName: obj.data.account,
        pwd: obj.data.password,
        json: encodeURI(JSON.stringify(param)),
        encryptedData: encryptedData
      },
      success: (res) => {
        console.log(res);
        wx.hideLoading();

        if (res.data.success) {
          wx.setNavigationBarColor({ 
            backgroundColor: '#000000',
            frontColor: '#ffffff',
            animation: {
              duration: 400,
              timingFunc: 'easeIn'
            }
          });

          // 登录成功后直接进入页面不需要提示
          // util.tipsMessage('登录成功！');

          app.user = res.data.user;
          wx.setStorageSync('user', res.data.user);
          wx.setStorageSync('account', obj.data.account);
          var workCount = res.data.workCount;
          obj.setData({
            isLogin: false,
            userPriv: app.user.userPriv,
            workCount: workCount
          });
          wx.showTabBar();
          // 初始化页面数据
          obj.init();
        } else {
          util.tipsMessage('账号或密码错误！');
        }
      },
      fail: (e) => {
        wx.hideLoading();
        console.log(e);
        util.tipsMessage('网络异常，请稍后再试');
      }
    });
  },

  /**
   * 发布临时工作卡
   */
  relapseWorkCard: (e) => {
    var link = e.currentTarget.dataset.link;

    // 正式环境执行代码
    if (!app.constant.isDev) {
      wx.scanCode({
        scanType: ['barCode', 'qrCode'],
        success: (res) => {
          wx.navigateTo({
            url: link + '?code=' + res.result
          });
        }
      });
    } 
    
    // 开发环境执行代码
    if (app.constant.isDev) {
      wx.navigateTo({
        url: link + '?code=0000123' 
      });
    }
  },

  /**
   * 清除账号
   */
  clearAccount: function () {
    obj.setData({
      account: ''
    });
  },

  /**
   * 查看密码
   */
  lookPassword: function (e) {
    obj.setData({
      lookPassword: !obj.data.lookPassword
    });
  },

  /**
   * init
   */
  init: () => {
    // 维修类型 
    var tempList = [
      { "name": "自行维修", "link":"../faultList/faultList?overhaul=0"},
      { "name": "委外维修", "link": "../faultList/faultList?overhaul=1" },
    ];
    var chooseTemp = {
      name:'维修类别',
      chooseList: tempList
    };

     // 统计数据类型
     var statisticsList = [
      { "name": "执行进度", "link": "../statistics/statistics?type=handle" },
      { "name": "验收进度", "link": "../statistics/statistics?type=valid" },
    ];
    var chooseStatistics = {
      name: '进度类别',
      chooseList: statisticsList
    };

    // 维修类型2
    var tempList2 = [
      { "name": "自行维修", "link": "../mtwcList/mtwcList?type=0" },
      { "name": "委外维修", "link": "../mtwcList/mtwcList?type=1" },
    ];
    var chooseTemp2 = {
      name: '维修类别',
      chooseList: tempList2
    };

    var reqUrl = util.getRequestURL('getFuncs.we');
    var param = {};
    param.userId = app.user.id;
    param.deptId = app.user.deptId;

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
        if (res.success) {
           obj.resizeList(res.funcList);
        }
      },
      complete: (rx) => {
        wx.hideLoading();
      }
    })

    obj.setData({
      chooseTemp: chooseTemp,
      chooseStatistics: chooseStatistics,
      chooseTemp2: chooseTemp2
    });
    
  },

  
  /**
   * 数组大小调整为3个
   */
  resizeList: (funList) => {
    var blocksDiv1 = [], blockDiv1 = [], blocksDiv2 = [], blockDiv2 = [];
    for (var i = 0; i < funList.length; i++) {
      if (funList[i].type == 1) {
        blockDiv1.push(funList[i]);
      } else {
        blockDiv2.push(funList[i]);
      }
      if (blockDiv1.length == 4) {
        blocksDiv1.push(blockDiv1); 
        blockDiv1 = []; 
      }
      if (blockDiv2.length == 4) {
        blocksDiv2.push(blockDiv2); 
        blockDiv2 = []; 
      }
      if (i == (funList.length - 1)) {
        if (blockDiv1.length > 0) {
          blocksDiv1.push(blockDiv1); 
        }
        if (blockDiv2.length > 0) {
          blocksDiv2.push(blockDiv2); 
        }
      }
    }
    obj.setData({
      blocksDiv1: blocksDiv1,
      blocksDiv2: blocksDiv2
    });
  },

  

  /**
   * 查询设备信息
   */
  getEquipmentInfo: (e) => {
    var link = e.currentTarget.dataset.link;
    // 正式环境执行代码
    if (!app.constant.isDev) {
      wx.scanCode({
        scanType: ['barCode', 'qrCode'],
        success: (res) => {
          wx.navigateTo({
            url: link + '?code=' + res.result
          });
        }
      });
    }

    // 开发环境执行代码
    if (app.constant.isDev) {
      wx.navigateTo({
        url: link + '?code=121600110200400'
      });
    }
  },

  
})