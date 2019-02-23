var app = getApp();
var util = require('../../utils/util.js');
var obj = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    base_img_url: app.constant.base_img_url + "/",
    statusList: [],
    handleList: [],
    photos: [],
    status: 0,
    handle: 0
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
      workCardId: workCardId,
      workCardStatus: workCardStatus
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
      { id: 0, name: "正常" },
      { id: 1, name: "异常" }
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
    var dou = {};
    var param = {
      id: obj.data.workCardId
    };

    // loading
    wx.showLoading({
      title: '加载中',
    })
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
            if (workFeedback.image) {
                workFeedback.image = JSON.parse(workFeedback.image);
                dou.photos = workFeedback.image;
            }
            dou.workFeedback = workFeedback;
          }

          var level = res.workDetail.level;

          if (level == 'A' || level == 'B') {
             dou.isPhoto = true;
             dou.isUpload = true;
          } else {
            // 必须拍照的
            dou.needPhoto = true;
          }
          dou.showPhoto = true;
          dou.workDetail = res.workDetail;
          obj.setData(dou);

          wx.hideLoading();
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
    var key = e.currentTarget.dataset.key;
    var dou = {};
    dou[key] = e.detail.value;
    obj.setData(dou);
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
        console.log(res);

        photos.push(photo);
        obj.setData({
          photos: photos
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
      var url = '';
      if (photos[i].name) {
        url = app.constant.base_img_url + "/" + photos[i].name;
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
    console.log('photos: ' + JSON.stringify(photos) + '& i: ' + i);
    if (photos[i]) {
        if (!photos[i].tempFilePath) {
          i++;
          obj.uploadPics(i);
          return;
        }
    } else {
      // 没有照片对象，则不传照片
      obj.update();
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
          obj.update();
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
    var photos = obj.data.photos;
    if (photos.length > 0) {
        obj.uploadPics();
    } else {
        obj.update();
    }
    
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

    // console.log(param);

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

})