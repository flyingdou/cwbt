var app = getApp();
var util = require('../../utils/util.js');
var obj = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    base_img_url: app.constant.base_img_url,
    statusList:[],
    handleList: [],
    photos:[],
    status:0,
    handle:0,
    isHidden: true,
    showMark: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    obj = this;
    var isRollback = options.isRollback; // 是否撤回 
    if (isRollback) { 
       obj.setData({ 
         isRollback: isRollback 
       });
    }

    var workCardId = options.id; // 工作卡id
    if (!workCardId) {
      workCardId = 48;
    }
    obj.setData({
      workCardId: workCardId
    })
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


  /**
   * 初始化页面数据
   */
  init: () => {
    var statusList = [
      {id: 0,name:"正常"},
      {id: 1,name: "异常"}
    ];
    var handleList = [
      { id: 0, name: "请选择" },  
      { id: 1, name: "自行维修" },
      { id: 2, name: "委外维修" }
    ];
    var today = new Date();
    var startDate = util.formatDate(today);
    var endDate = util.formatDate(today,'0');

    obj.setData({
      statusList: statusList,
      handleList: handleList,
      startDate: startDate,
      endDate: endDate,
    });
    obj.getWorkDetail();
  },

 /**
  * 查询数据
  */
  getWorkDetail: (e) => {
    var param = {
      id: obj.data.workCardId
    };
    var reqUrl = util.getRequestURL('getTempWork.we');
    
    // 请求数据
    wx.request({
      url: reqUrl,
      dataType: 'json',
      data:{
        json: encodeURI(JSON.stringify(param))
      },
      success: (res) => {
        res = res.data;
        if (res.success) {
          res.workDetail.image = JSON.parse(res.workDetail.image);
          if (res.workFeedback) {
            var workFeedback = res.workFeedback;
            workFeedback.image = JSON.parse(workFeedback.image);
            obj.setData({
              photos: workFeedback.image,
              workFeedback: workFeedback
            });
          }
          var hasGot = false; // 已领取, 隐藏领取button
          if (res.workDetail.status == 9) {
             hasGot = true; // 未领取，展示领取button
          }
          // 领导领取委外维修的临时工作卡
          var user_priv = app.user.userPriv; // 用户权限
          obj.setData({
            workDetail: res.workDetail,
            hasGot: hasGot,
            user_priv: user_priv
          });
        } 
        if (!res.success) {
          console.log('程序异常！');
        }
      },
      fail: (e) => {
        console.log('网络异常！');
      }
    })
  },

  /**
   * picker、输入框取值
   */
  pickerChange: (e) => {
    
    // 未领取时禁用
    var hasGot = obj.data.hasGot;
    var key = e.currentTarget.dataset.key;
    var timestamp = obj.data.timestamp ? obj.data.timestamp : undefined;
    if (!hasGot) {
      if (timestamp && ((e.timeStamp - timestamp) < 1000)) { // 1一秒以内禁止再次弹窗
        return;
      }
      wx.showModal({
        title: '提示',
        content: '请先领取工作！',
        showCancel: false
      })
      obj.setData({
        timestamp: e.timeStamp
      });
      return;
    }
    var dou = {};
    dou[key] = e.detail.value;
    obj.setData(dou);
   
  },

  /**
 * 弹起日历
 */
  showMark: function (e) {
    var key = e.currentTarget.dataset.key;
    obj.setData({
      dateKey: key,
      showMark: true,
      isHidden: true
    });
  },

  /**
   * 时间选择器改变
   */
  dateChange: (e) => {
    var key = obj.data.dateKey;
    var dou = {
      showMark: false,
      isHidden: false
    };
    if (e.detail.value) {
      dou[key] = e.detail.value;
    }
    obj.setData(dou);
  },


  /**
   * 输入框的值
   */
  inputChange: (e) => {
    var key = e.currentTarget.dataset.key;
    var dou = {};
    dou[key] = e.detail.value;
    obj.setData(dou);

  },


  


  /**
   * 阻止点击穿透
   */
  myTouchMove: () => {
    var isHidden = obj.data.isHidden;
    if (!isHidden) {
        return;  // 弹出时阻止页面滑动
    }
  },


/**
 * 扫码
 */
  scanCode: () => {
    var isScan = false;
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['barCode'],
      success: (res) => {
        isScan = true;
        if (res.result == obj.data.workDetail.number) {
          var scanTime = util.formatTime(new Date());
          obj.setData({
            isScan: isScan,
            scanTime: scanTime
          });
          // 修改为进行中
          obj.ongoing();
        } else {
          wx.showModal({
            title: '提示',
            content: '您当前所扫条码，不属于当前任务中的设备！',
            showCancel: false
          })
          return;
        }
        console.log(res);
      }
    })

  },

  /**
   * 拍照
   */
  photo: () => {
    // 未领取时禁用
    var hasGot = obj.data.hasGot;
    if (!hasGot) {
       wx.showModal({
         title: '提示',
         content: '请先领取工作！',
         showCancel: false
       })
       return;
    }
    var isPhoto = false;
    var photo = {};
    var photos = obj.data.photos;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['camera'],
      success: (res) => {
        isPhoto = true;
        var timex = util.formatTime(new Date());
        photo.pic_time = timex;
        photo.tempFilePath = res.tempFilePaths[0];
        console.log(res);

        photos.push(photo);
        obj.setData({
          isPhoto: isPhoto,
          photos: photos
        });
      },
    })

    obj.setData({
      isPhoto: isPhoto
    });
  },


  /**
   * 图片预览
   */
  preview: (e) => {
    var imgs = [];
    var photos = obj.data.photos;
    for (var i = 0; i < photos.length; i++) {
      var url = '';
      if (photos[i].name) {
        url = app.constant.base_img_url + '/' + photos[i].name;
      }
      if (photos[i].tempFilePath) {
        url = photos[i].tempFilePath;
      }
      imgs.push(url);
    }
    var index = e.currentTarget.dataset.index;
    // 预览开始
    wx.previewImage({
      current: imgs[index],
      urls: imgs
    })
  },

  /**
 * 图片预览
 */
  previewShot: (e) => {
    var imgs = [];
    var photos = obj.data.workDetail.image;
    for (var i = 0; i < photos.length; i++) {
      var url = '';
      if (photos[i].name) {
        url = app.constant.base_img_url + '/' + photos[i].name;
      }
      if (photos[i].tempFilePath) {
        url = photos[i].tempFilePath;
      }
      imgs.push(url);
    }
    var index = e.currentTarget.dataset.index;
    // 预览开始
    wx.previewImage({
      current: imgs[index],
      urls: imgs
    })
  },

  
  /**
   * 删除图片
   */
  deletePic: (e) => {
    var isRollback = obj.data.isRollback;
    var alreadyRoll = obj.data.alreadyRoll;
    if (isRollback && !alreadyRoll) {
      return;
    }
    var index = e.currentTarget.dataset.index;
    var photos = obj.data.photos;
    photos.splice(index, 1);
    var isPhoto = true;
    if (photos.length == 0) {
      isPhoto = false;
    }
    obj.setData({
      photos: photos,
      isPhoto: isPhoto
    });

  },

  /**
   * 上传图片
   */
  uploadPics: (i) => {
    var photos = obj.data.photos;
    var count = photos.length;
    var reqUrl = app.constant.upload_url;
    if (!i) {
      i = 0;
    }
    // 已有照片，不上传
    if (!photos[i].tempFilePath) {
      i++;
      obj.uploadPics(i);
      return;
    }
    // 开始上传图片
    wx.uploadFile({
      url: reqUrl,
      filePath: photos[i].tempFilePath,
      name: 'myfile',
      success: (res) => {
        var res = res.data;
        if (res) {
          res = JSON.parse(res);
        }
        if (res.success) {
          photos[i].name = res.picture;
        } else {
          var x = i + 1;
          console.log('第' + x + '张图片上传失败！');
        }
      },
      fail: (e) => {
        var y = i + 1;
        console.log('第' + y + '张图片上传失败！可能是网络异常导致');
      },
      complete: () => {
        console.log(i);
        i++;
        if (i >= count) {
          var isUpload = true;
          obj.setData({
            isUpload: isUpload
          });
          console.log('图片上传完成！');
          return;
        } else {
          // 图片还未传完，需要继续上传
          obj.uploadPics(i);
        }
      }

    })
  },

  /**
   * 调用上传方法
   */
  uploadPictures: () => {
    obj.uploadPics();
  },

  /**
   * finish 保存数据
   */
  finish: () => {
    // 校验数据
    var status = obj.data.status;
    var handle = obj.data.handle;
    var workcardName = undefined;
    if (status == 1) {
      // if (handle == 0) {
      //   wx.showModal({
      //     title: '提示',
      //     content: '请选择维修方式！',
      //     showCancel: false
      //   })
      //   return;
      // }
      var handleName = undefined;
      if (handle == 1) {
        handle = 0; // 自行维修
        handleName = '自行维修';
      }

      if (handle == 2) {
          handle = 1; // 委外维修
          handleName = '委外维修';
      }
      workcardName = obj.data.workDetail.ename + '-' + handleName;
    }

    var photos = obj.data.photos;
    for (var x = 0; x < photos.length; x++) {
      delete photos[x]['tempFilePath'];
    }

    
    var userId = app.user.id;
    if (!userId) {
      userId = 1316;
    }
    var isError = status;
    var workCard = obj.data.workDetail;

    // 必填数据
    var param = {
      id: workCard.id,
      executorId: userId, // 执行者id
      image: photos, // 照片信息
      isError: isError, // 设备状态，是否异常
      scanTime: obj.data.scanTime,
      equipmentId: workCard.eid,
      type: workCard.type, // 工作卡类型
      overhaulFunction: workCard.overhaul_function,// 0自行维修，1委外维修
    };

    // 可选数据
    // 备注信息
    var remark = obj.data.remark;
    if (remark) {
      param.remark = remark;
    }
    
    // 异常描述
    var exceptionalDescribe = obj.data.exceptionalDescribe;
    if (exceptionalDescribe) {
      param.exceptionalDescribe = exceptionalDescribe;
    }

    // 工作卡名称
    if (workcardName) {
      param.workcardName = workcardName;
    }

    // 测试功能
    // console.log(param);
    // return;
    wx.showLoading({
      title: '处理中',
      mask:true
    })
    var reqUrl = util.getRequestURL('finish.we');
    // 发起微信请求
    wx.request({
      url: reqUrl,
      dataType: 'json',
      data: {
        requestType: 'wechat',
        json: encodeURI(JSON.stringify(param))
      },
      success: (res) => {
        wx.hideLoading();
        res = res.data;
        if (res.success) {
          wx.showModal({
            title: '提示',
            content: '工作完成，有待上级人员确认！',
            showCancel: false,
            success: (resx) => {
              if (resx.confirm) {
                wx.reLaunch({
                  url: '../../pages/index/index',
                })
              }
            }

          })
          wx.reLaunch({
            url: '../../pages/index/index',
          })
        } else {
          console.log('程序异常！');
        }
      },
      fail: (e) => {
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '网络异常！',
        })
      }

    })

  },
  
  // 进行中
  ongoing: () => {
    var id = obj.data.workDetail.id;
    var status = obj.data.workDetail.status;
    if (status == 1) {
      status = 9;
    } else if (status == 9) {
      status = 1;
    }
    
    // 参数
    var param = {
      id: id,
      status: status
    };

    wx.request({
      url: util.getRequestURL('updateWorkCard.we'),
      dataType: 'json',
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: (res) => {
        res = res.data;
        if (res.success) {
          obj.data.workDetail.status = param.status;
        }
      }
    })


  },


  /**
   * 撤回数据
   */
  rollback: () => {
    var param = {
      workcardId: obj.data.workCardId
    };

    var reqUrl = util.getRequestURL('rollback.we');
    wx.request({
      url: reqUrl,
      dataType:'json',
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: (res) => {
        res = res.data;
        if (res.success) {
          // 撤回成功
          obj.setData({
            alreadyRoll:true
          });
        }
      }
    })
  },


  /**
   * 修改数据
   */
  update: () => {
    var reqUrl = util.getRequestURL('updateWorkfeedback.we');
    var workDetail = obj.data.workDetail;
    var workFeedback = obj.data.workFeedback;
    var photos = obj.data.photos;
    for (var x = 0; x < photos.length; x++) {
      if (photos[x].tempFilePath) {
           delete photos[x]['tempFilePath'];
      }
    }
    var param = {};
    param.id = workFeedback.id; // 反馈id
    param.image =JSON.stringify(photos); // 反馈图片
    param.mark = obj.data.remark; // 反馈数据
    param.workcardId = workDetail.id; // 工作卡id

    console.log(param);

    // 发起微信请求
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
            content: '修改成功！',
            showCancel: false,
            success: (rex) => {
              if (rex.confirm) {
                wx.navigateBack({
                  delta: 2,
                })
              }
            }
          })
        }
      }
    })

  },
  
  /**
   * 弹出领取框
   */
  Got: () => {
     obj.setData({
       isHidden: false
     });
  },

  //取消按钮  
  cancel: function () {
    // 清除领取数据
    this.setData({
      isHidden: true
    });
  },
  //确认  
  confirm: function () {
    obj.getTemp();
    this.setData({
      isHidden: true
    })
  },

  /**
   * 领取任务
   */
  getTemp: () => {
    // 校验数据
    var expectedtime = obj.data.expectedtime;
    if (!expectedtime || expectedtime == '') {
      wx.showModal({
        title: '提示',
        content: '请选择预计完成时间！',
        showCancel: false
      })
      return;
    }
    var collectNote = obj.data.collectNote;
    // 发送领取请求
    var reqUrl = util.getRequestURL('updateWorkCard.we');
    var param = {
      id: obj.data.workDetail.id,
      collectorpersonid: app.user.id,
      expectedtime: expectedtime,
      collectNote: collectNote,
      status: 9
    };

    wx.request({
      url: reqUrl,
      dataType: 'json',
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: (res) => {
        res = res.data;
        if (res.success) {
           var workDetail = obj.data.workDetail;
           workDetail.status = param.status;
           obj.setData({
             hasGot: true, // 隐藏领取按钮
             workDetail: workDetail // 修改工作卡数据
           });
        }
      }
    })
  }







})