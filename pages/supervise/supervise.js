var app = getApp();
var util = require('../../utils/util.js');
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
    isScan: true,
    // 展示完成按钮
    showFinish: true,
    // 展示拍照按钮
    showCamera: true,
    // 展示上传照片按钮
    showUpload: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     obj = this;
     var dou = {};
     var contents = options.contents;
     if (contents) {
        dou.contents = JSON.parse(contents);
     }

     var creator = options.creator;
     if (creator) {
         dou.creator = creator;
     }

     if (options.boat) {
         dou.boat = boat;
     }  

     if (options.device) {
        dou.device = device;
     }

    if (options.deviceNumber) {
        dou.deviceNumber = deviceNumber;
    }

     var id = options.id;
     if (id) {
        dou.id = id;
     }

     var code = options.code;
     if (code) {
         dou.code = code;
     }

     var type = options.type;
     if (type) {
        dou.type = type;
     }

     obj.setData(dou);

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
  * 拍照
  */
  photo: () => {
    var photo = {};
    var photos = obj.data.photos;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['camera'],
      success: (res) => {
        var timex = util.formatTime(new Date());
        photo.pic_time = timex;
        photo.tempFilePath = res.tempFilePaths[0];

        photos.push(photo);
        obj.setData({
          photos: photos,
          // 拍照以后，展示上传按钮，拍照按钮可以隐藏
          showUpload: true,
          showCamera: false
        });
      },
    })
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
    var showCamera = false;
    if (photos.length == 0) {
       showCamera = true;
    }
    obj.setData({
      photos: photos,
      showCamera: showCamera
    });

  },

  /**
   * 上传图片
   */
  uploadPics: (i) => {
    var showCamera = false;
    var showUpload = true;
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
          obj.setData({
              showCamera: false,
              showUpload: false
          });
          console.log('图片上传完成！');
          obj.finishSupervise();
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
    var photos = obj.data.photos || [];
    if (photos.length > 0) {
       obj.uploadPics(0);
    } else {
       obj.finishSupervise();
    }
  },

  /**
   * 完成督导任务，生成督导反馈
   */
  finishSupervise: () => {
    var photos = obj.data.photos;
    for (var x = 0; x < photos.length; x++) {
      delete photos[x]['tempFilePath'];
    }
    var param = {};
    param.remark = obj.data.remark;
    param.image = photos;
    param.opeartor = app.user.id;

    var supervisionId = obj.data.id;
    var contents = obj.data.contents;
    
    var supervisionId = obj.data.id;
    contents.forEach ((item, index) => {
        item.recUsers.forEach((sub, subIndex) => {
            if (sub.id == app.user.id) {
               supervisionId = item.id;
            }
        });
    });
    
    param.supervisionId = supervisionId;
    param.type = obj.data.type;
    // 编码
    param.code = obj.data.code;

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
        wx.showModal({
          title: '提示',
          content: '网络异常！',
        })
      },
      complete: (com) => {
        wx.hideLoading();
      }
    })
  },

    /**
    * 发布临时工作卡
    */
    releaseWorkCard: (e) => {
      var link = '../releaseTempWork/releaseTempWork';
        wx.navigateTo({
          url: link + '?code=' + obj.data.deviceNumber, // 跳转到发布临时工作卡页面
        });
    }



})