var app = getApp();
var util = require('../../utils/util.js ');
var obj = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photos:[],
    status:0, // 默认拍照
    statusList: [
      { id: 0, name: "正常" },
      { id: 1, name: "异常" }
    ],
    deviceStatus: 0,
    isScan: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     obj = this;
     var contents = options.contents;
     if (contents) {
        contents = JSON.parse(contents);
        obj.setData({
          contents: contents
        });
     }

     var creator = options.creator;
     if (creator) {
       obj.setData({
         creator: creator
       });
     }

     if (options.boat) {
       obj.setData({
         boat: options.boat
       });
     }  

     if (options.device) {
       obj.setData({
         device: options.device
       });
     }

    if (options.deviceNumber) {
      obj.setData({
        deviceNumber: options.deviceNumber
      });
    }

     var id = options.id;
     if (id) {
       obj.setData({
         id:id
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
   * 输入框改变
   */
  inputChange: (e) => {
     var key = e.currentTarget.dataset.key;
     var value = e.detail.value;
     var dou = {};
     dou[key] = value;
     obj.setData(dou);
  },

  /**
   * 下拉框选中
   */
  pickerChange: (e) => {
     var key = e.currentTarget.dataset.key;
     var index = e.detail.value;
     var statusList = obj.data.statusList;
     obj.setData({
       deviceStatus: statusList[index].id
     });
  },

  /**
   * 扫码
   */
  scan: function () {
    wx.scanCode({
      scanType: ['barCode', 'qrCode'],
      success: (res) => {
        if (res.result == obj.data.deviceNumber) {
          obj.setData({
            isScan: false
          });
        } else {
          wx.showModal({
            title: '提示',
            content: '扫码的条码不正确',
            showCancel: false
          })
        }
      }
    });
  },


  /**
  * 拍照
  */
  photo: () => {
    var status = obj.data.status;
    var photo = {};
    var photos = obj.data.photos;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['camera'],
      success: (res) => {
        status = 1;
        var timex = util.formatTime(new Date());
        photo.pic_time = timex;
        photo.tempFilePath = res.tempFilePaths[0];
        console.log(res);

        photos.push(photo);
        obj.setData({
          status: status,
          photos: photos
        });
      },
    })

    obj.setData({
      status: status
    });
  },


  /**
   * 图片预览
   */
  preview: (e) => {
    var imgs = [];
    var photos = obj.data.photos;
    for (var i = 0; i < photos.length; i++) {
      imgs.push(photos[i].tempFilePath);
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
    var index = e.currentTarget.dataset.index;
    var photos = obj.data.photos;
    photos.splice(index, 1);
    var status = obj.data.status;
    if (photos.length == 0) {
      status = 0;
    }
    obj.setData({
      photos: photos,
      status: status
    });

  },

  /**
   * 上传图片
   */
  uploadPics: (i) => {
    var status = obj.data.status;
    var photos = obj.data.photos;
    var count = photos.length;
    var reqUrl = app.constant.upload_url;
    if (!i) {
      i = 0;
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
          status = 2;
          obj.setData({
            status: status
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
   * 完成督导任务，生成督导反馈
   */
  finishSupervise: () => {
    // 判断是否需要扫码
    if (obj.data.deviceNumber && obj.data.isScan) {
      wx.showModal({
        title: '提示',
        content: '请先扫码',
        showCancel: false
      })
      return;
    }

    var photos = obj.data.photos;
    for (var x = 0; x < photos.length; x++) {
      delete photos[x]['tempFilePath'];
    }
    var param = {};
    param.remark = obj.data.remark;
    param.image = photos;
    param.opeartor = app.user.id;
    param.supervisionId = obj.data.id;

    wx.showLoading({
      title: '处理中',
      mask: true,
    })
    var reqUrl = util.getRequestURL('saveSupervisFeedBack.we');
    wx.request({
      url: reqUrl,
      dataType: 'json',
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: (res) => {
         wx.hideLoading();
         res = res.data;
         if (res.success) {
           // 数据执行成功
           var deviceStatus = obj.data.deviceStatus;
           if (deviceStatus == 1) {
             // 设备异常，跳转到生成临时工作卡页面
             obj.releaseWorkCard();
           } 
           if (deviceStatus == 0) {
             // 设备正常，回列表
             wx.navigateBack({
               delta:2
             })
             
           }
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

    /**
    * 发布临时工作卡
    */
    releaseWorkCard: (e) => {
        var link = '../releaseWorkCard/releaseWorkCard';
        wx.navigateTo({
          url: link + '?code=' + obj.data.deviceNumber, // 跳转到发布临时工作卡页面
        });
    }



})