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
    // 判断用户是否登录
    if (app.user.id) {
      obj.setData({
        isLogin: false,
        userPriv: app.user.userPriv
      });
      wx.showTabBar();
    } else {
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
    // 获取参数，校验参数，生成json
    var param = {};
    if (e.type == 'getuserinfo') {
      param = e.detail;
    }
    if (obj.data.code) {
      param.code = obj.data.code;
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
        json: encodeURI(JSON.stringify(param))
      },
      success: (res) => {
        wx.hideLoading();
        if (res.data.success) {
          util.tipsMessage('登录成功！');
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
      { "name": "自行维修", "link":"../tempList/tempList?overhaul=0"},
      { "name": "委外维修", "link": "../tempList/tempList?overhaul=1" },
    ];
    var chooseTemp = {
      name:'维修方式',
      chooseList: tempList
    };

     // 统计数据类型
     var statisticsList = [
      { "name": "执行统计", "link": "../statistics/statistics?type=handle" },
      { "name": "验收统计", "link": "../statistics/statistics?type=valid" },
    ];
    var chooseStatistics = {
      name: '数据类型',
      chooseList: statisticsList
    };

    // 维修类型2
    var tempList2 = [
      { "name": "自行维修", "link": "../mtwcList/mtwcList?type=0" },
      { "name": "委外维修", "link": "../mtwcList/mtwcList?type=1" },
    ];
    var chooseTemp2 = {
      name: '维修方式',
      chooseList: tempList2
    };

    // 首页功能模块列表
    var funList = [
      {
        "name": "工作任务",
        "iconPath": "../../icon/2930@2x.png",
        "count": "cycleWorkCount",
        "link": "../shipList/shipList",
        "key": "",
        "value": "",
        "fun": "goto"
      },

      {
        "name": "临时任务",
        "iconPath": "../../icon/2917@2x.png",
        "count": "temporaryWorkCount",
        "link": "../switch/switch",
        "key": "choose",
        "value": "chooseTemp",
        "fun": "goto"
      },

      {
        "name": "督导通知",
        "iconPath": "../../icon/supervision.png",
        "count": "supervisionCount",
        "link": "../supervisionList/supervisionList",
        "key": "",
        "value": "",
        "fun": "goto"
      },

      {
        "name": "工作验收",
        "iconPath": "../../icon/valid.png",
        "count": "checkAcceptanceCount",
        "link": "../validList/validList",
        "key": "",
        "value": "",
        "fun": "goto"
      },

      {
        "name": "临时工作",
        "iconPath": "../../icon/tempWork.png",
        "count": "mtwcCount",
        "link": "../switch/switch",
        "key": "choose",
        "value": "chooseTemp2",
        "fun": "goto"
      },

      {
        "name": "督导",
        "iconPath": "../../icon/supervise.png",
        "count": "supervisionCount",
        "link": "../supervisionList/supervisionList",
        "key": "",
        "value": "",
        "fun":"goto"
      },

      {
        "name": "未验收工作",
        "iconPath": "../../icon/2918@2x.png",
        "count": "",
        "link": "../Tlist/Tlist?isUpdate=true",
        "key": "",
        "value": "",
        "fun":"goto"
      },

      {
        "name": "查看设备信息",
        "iconPath": "../../icon/deviceDetail.png",
        "count": "",
        "link": "../equipmentInfo/equipmentInfo",
        "key": "",
        "value": "",
        "fun": "getEquipmentInfo"
      },

      {
        "name": "统计",
        "iconPath": "../../icon/statistics.png",
        "count": "",
        "link": "../switch/switch",
        "key": "choose",
        "value": "chooseStatistics",
        "fun": "goto"
      }

    ];

    var blocksDiv = [];
    var blockDiv = [];
    for (var i = 0; i < funList.length; i++) {
      blockDiv.push(funList[i]);
      if ( blockDiv.length == 3 || i == (funList.length -1)) {
        blocksDiv.push(blockDiv); // 将blockDiv放入blocksDiv中
        blockDiv = []; // 清空blockDiv
      }
    }


    obj.setData({
      chooseTemp: chooseTemp,
      chooseStatistics: chooseStatistics,
      chooseTemp2: chooseTemp2,
      funList: funList,
      blocksDiv: blocksDiv
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
        url: link + '?code=0000123'
      });
    }
  },

  
})