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
    hidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    obj = this;
    // 工作卡id
    var workCardId = options.workCardId; 
    // 工作卡状态
    var workCardStatus = options.workCardStatus;

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
    obj.setData({
      statusList: statusList,
      handleList: handleList
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
    var reqUrl = util.getRequestURL('getWorkDetailById.we');
    
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
          if (res.workFeedback) {
            var workFeedback = res.workFeedback;
            workFeedback.image = JSON.parse(workFeedback.image);
            obj.setData({
              photos: workFeedback.image,
              workFeedback: workFeedback
            });
          }

          var level = res.workDetail.level;
          var dou = {};
          if (level == 'A' || level == 'B') {
             dou.isPhoto = true;
             dou.isUpload = true;
          }
          dou.showPhoto = true;
          dou.workDetail = res.workDetail;
          obj.setData(dou);
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
    if (!obj.checkValid()) {
       return;
    }
    var key = e.currentTarget.dataset.key;
    var dou = {};
    dou[key] = e.detail.value;
    obj.setData(dou);
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
            scanTime: scanTime,
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
    if (!obj.checkValid()) {
       return;
    }
    var isPhoto = false;
    var isUpload = obj.data.isUpload;
    var photo = {};
    var photos = obj.data.photos;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['camera'],
      success: (res) => {
        isPhoto = true;
        isUpload = false;
        var timex = util.formatTime(new Date());
        photo.pic_time = timex;
        photo.tempFilePath = res.tempFilePaths[0];
        console.log(res);

        photos.push(photo);
        obj.setData({
          isPhoto: isPhoto,
          isUpload: isUpload,
          photos: photos
        });
      },
    })

    obj.setData({
      isPhoto: isPhoto,
      isUpload: isUpload
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
    var isUpload = obj.data.isUpload;
    if (photos.length == 0) {
      isPhoto = false;
      isUpload = false;
    }
    obj.setData({
      photos: photos,
      isPhoto: isPhoto,
      isUpload: isUpload
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
            isUpload: isUpload,
            showPhoto: false
          });
          console.log('图片上传完成！');
          obj.finish();
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
    if (!obj.checkValid()) {
        return;
    }
    var photos = obj.data.photos;
    if (photos.length > 0) {
        obj.uploadPics();
    } else {
        obj.finish();
    }
    
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
      if (handle == 0) {
        wx.showModal({
          title: '提示',
          content: '请选择维修方式！',
          showCancel: false
        })
        return;
      }
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

    // 必填数据
    var param = {
      id: obj.data.workDetail.id,
      executorId: userId, // 执行者id
      image: photos, // 照片信息
      isError: isError, // 设备状态，是否异常
      scanTime: obj.data.scanTime,
      equipmentId: obj.data.workDetail.eid
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
    
    
    // 维修方式
    if (handle || handle == 0) {
      param.overhaulFunction = handle; // 1自行维修，2委外维修
    }

    // 工作卡名称
    if (workcardName) {
      param.workcardName = workcardName;
    }

    // showLoding
    wx.showLoading({
      title: '处理中',
      mask: true,
    })
    var reqUrl = util.getRequestURL('finish.we');
    // 发起微信请求
    wx.request({
      url: reqUrl,
      dataType: 'json',
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: (res) => {
        // 隐藏Loading框
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
            },
            

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
      status: status,
      collectorpersonid: app.user.id
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
   * 校验是否已经设备条码
   */
  checkValid () {
    var isScan = obj.data.isScan;
    if (!isScan) {
      wx.showModal({
        title: '提示',
        content: '请先验证设备条码',
      })
      return false;
    } else {
      return true;
    }

  },

  /**
   * 确定是否需要填写执行情况
   */
  sure() {
    obj.setData({
      hidden: false
    });
  },

  /**
   * 点击确定按钮
   */
  confirm() {
    obj.scanCode();
    obj.setData({
      hidden: true
    });
  },

  /**
   * 点击取消按钮
   */
  cancel() {
    obj.setData({
      hidden: true
    });
  },





})