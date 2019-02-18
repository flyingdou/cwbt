var app = getApp();
var util = require('../../utils/util.js');
var obj = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingStatus: true,
    pickerData: [{ code: -1, name: '请选择' }, { code: 0, name: '自行维修' }, { code: 1, name: '委外维修' } ],
    index: 0,
    base_img_url: app.constant.base_img_url,
    photos: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    obj = this;
    var code = options.code; // 扫码识别的code
    var overhaul = options.overhaul; // 维修方式
    if (code) {
      obj.setData({
        code: code,
        overhaul: overhaul
      });
    }

    var title = '';
    if (overhaul == 0) {
        title = '自行维修缺陷单';
    } else {
        title = '委外维修申请单';
    }

    wx.setNavigationBarTitle({
      title: title,
    })
    
    

    // 页面初始化
    this.init();
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
   * 页面初始化
   */
  init: () => {
    wx.showLoading({
      title: '数据加载中',
      mask: true
    });
    var url = util.getRequestURL('getWcEquipmentcardByNumber.we');
    wx.request({
      url: url,
      data: {
        number: obj.data.code
      },
      success: function (res) {
        if (res.data) { // 数据请求成功
          obj.setData({
            loadingStatus: false,
            equipment: res.data
          });
          wx.hideLoading();
        } else { // 数据请求失败
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: '该条形码没有对应设备信息！',
            showCancel: false,
            complete: () => {
              wx.navigateBack({
                delta: 1
              });
            }
          });
        }
      },
      fail: (e) => {
        wx.hideLoading();
        console.log(e);
        util.showTipsMessage('数据加载失败');
      }
    });
  },

  /**
   * 保存表单数据
   */
  saveFormData: (e) => {
    var key = e.currentTarget.dataset.key;
    var value = e.detail.value;
    var data = {};
    data[key] = value;
    obj.setData(data);
  },

  /**
   * 检查表单数据
   */
  checkFormData: function () {
    var data = obj.data;
    var remark = data.remark;
    var overhaulFunction = obj.data.overhaul == undefined ? data.pickerData[data.index].code : obj.data.overhaul;
    var photos = obj.data.photos;
    if (!remark) {
      wx.showModal({
        title: '提示',
        content: '请输入异常描述！',
        showCancel: false
      });
      return false;
    }
    if (overhaulFunction < 0) {
      wx.showModal({
        title: '提示',
        content: '请选择维修方式！',
        showCancel: false
      });
      return false;
    }
    if (photos.length < 1) {
      wx.showModal({
        title: '提示',
        content: '请上传异常图片！',
        showCancel: false,
      })
      return false;
    }

    return true;
  },


  /**
   * 保存临时工作卡数据
   */
  finish: function () {
    if (!obj.checkFormData()) {
      return;
    }
    var data = obj.data;
    var photos = obj.data.photos;
    for(var x in photos) {
      delete photos[x]['tempFilePath']; // 删除tempFilePath
    }
    var overhaulFunction = obj.data.overhaul == undefined ? data.pickerData[data.index].code : obj.data.overhaul;
    var name = data.equipment.name + '-' + util.getOverhaul(overhaulFunction);
    var param = {
      equipmentId: data.equipment.id,
      name: name,
      exceptionalDescribe: data.remark,
      overhaulFunction: overhaulFunction,
      image: JSON.stringify(photos),
      creator: app.user.id
    }

    // 测试数据
    // console.log(param);
    // return;

    wx.showLoading({
      title: '正在保存中',
      mask: true
    });
    var url = util.getRequestURL('addTemporaryWorkCard.we');
    wx.request({
      url: url,
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.success) {
          wx.showModal({
            title: '提示',
            content: '保存成功',
            showCancel: false,
            complete: function () {
              wx.navigateBack({
                delta: 4
              });
            }
          });
        } else {
          util.tipsMessage('保存失败！');
        }
      },
      fail: function (e) {
        wx.hideLoading();
        console.log(e);
        util.tipsMessage('网络异常！');
      }
    });
  },

  /**
  * 拍照
  */
  photo: () => {
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
   * 删除图片
   */
  deletePic: (e) => {
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


})