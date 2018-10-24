var app = getApp();
var obj = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photos:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    obj = this;
    var id = options.id;
    obj.setData({
      id:id
    });
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

  init: () => {
   var  partProperties = [
      { "name": "请选择", "id": 0 },
      { "name": "电气", "id": 1 },
      { "name": "机械", "id": 2 },
      { "name": "液压", "id": 3 },
      { "name": "润滑", "id": 4 },
      { "name": "消防", "id": 5 },
      { "name": "通风", "id": 6 },
      { "name": "其他", "id": 7 }
    ];

    var partList = [
      { "id": 0, "name": "请选择"},
      { "id": 1, "name": "正常" },
      { "id": 2, "name": "异常" }
    ];

    var errorPartStatus = [
      { "id": 0, "name": "请选择" },
      { "id": 1, "name": "温度" },
      { "id": 2, "name": "振动" },
      { "id": 3, "name": "磨损" },
      { "id": 4, "name": "损坏" },
      { "id": 5, "name": "跑、冒、滴、漏" },
      { "id": 6, "name": "绝缘" },
      { "id": 7, "name": "控制" },
      { "id": 8, "name": "显示" },
      { "id": 9, "name": "其他" },
    ];

    var errorHandleList = [
      { "id": 0, "name": "请选择" },
      { "id": 1, "name": "自处理" },
      { "id": 2, "name": "维修" },
      { "id": 3, "name": "检修" },
    ];

    // 设置初始数据
    obj.setData({
      partProperties: partProperties,
      partPropertiesIndex: 0,
      partList: partList,
      partListIndex: 0,
      errorPartStatus: errorPartStatus,
      errorPartStatusIndex: 0,
      errorHandleList: errorHandleList,
      errorHandleListIndex: 0,
      isException: true
    });

    // 加载页面初始数据
    var reqUrl = app.constant.base_req_url + 'deviceCheck/getCheckById.we'
    var id = 1;
    var param = {
        id:id
    };
    wx.request({
      url: reqUrl,
      dataType: 'json',
      data: {
        requestType: 'wechat',
        json: encodeURI(JSON.stringify(param))
      },
      success: (res) => {
        res = res.data;
        if (res.success) {
           obj.setData({
             check: res.check
           });
        } else {
          console.log('程序异常！');
        }
      },
      fail: (e) => {
        console.log('网络异常！');
      }
    })
  },

  /**
   * 获取值
   */
  pickChange: (e) => {
     var index = e.detail.value;
     var key = e.currentTarget.dataset.flag;
    if (key == 'partListIndex') {
      var isException = true;
      if (index == 1) {
          isException = false;
      }
      obj.setData({
        isException: isException
      });
    }
     var dou = {};
     dou[key] = index;
     obj.setData(dou);
     
  },

  /**
   * 输入框取值
   */
  bindInput: (e) => {
    var key = e.currentTarget.dataset.flag;
    var dou = {};
    dou[key] = e.detail.value;
    obj.setData(dou);
  },

  /**
   * 通过no查询用户数据
   */
  search: (e) => {
    var key = e.currentTarget.dataset.flag;
    var no = obj.data[key];
    if (!no || parseInt(no) == 0) {
      wx.showModal({
        title: '提示',
        content: '请输入人员编号！',
        showCancel: false
      })
      return;
    }
    var reqUrl = app.constant.base_req_url + 'deviceUser/getUserByNo.we';
    var param = { 'no': no };
    wx.request({
      url: reqUrl,
      dataType: 'json',
      data: {
        json: encodeURI(JSON.stringify(param)),
        requestType: 'wechat'
      },
      success: (res) => {
        res = res.data;
        if (res.success) {
          var key2 = key + 'no';
          var dou2 = {};

          // 查询到了数据
          if (res.person) {
            dou2[key2] = res.person;
            obj.setData(dou2);
          }

          // 未查询的数据
          if (!res.person) {
            dou2[key2] = '';
            obj.setData(dou2);
            wx.showModal({
              title: '提示',
              content: '请输入正确的编号！',
              showCancel: false
            })
            return;
          }
        } else {
          console.log('请求数据失败！');
        }

      }
    })
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
        if (res.result == obj.data.check.code) {
          var scanTime = obj.getNowFormatDate();
          obj.setData({
            isScan: isScan,
            scanTime: scanTime
          });
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
    var isPhoto = false;
    var photo = {};
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['camera'],
      success: (res) => {
        isPhoto = true;
        var timex = obj.getNowFormatDate();
        photo.pic_time = timex;
        photo.tempFilePath = res.tempFilePaths[0];
        console.log(res);
        var photos = obj.data.photos;
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
   * 获取yyyy-MM-dd HH:mm:ss
   */
  getNowFormatDate: () => {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var hh = date.getHours();
    var mm = date.getMinutes();
    var ss = date.getSeconds();
    if (hh < 10) {
      hh = '0' + hh;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    if (ss < 10) {
      ss = '0' + ss;
    }
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
      + " " + hh + seperator2 + mm + seperator2 + ss;
    return currentdate;
  },

  /**
   * 调用上传方法
   */
  uploadPictures: () => {
    obj.uploadPics();
  },

  /**
   * 保存数据
   */
  finsh: () => {
    var param = {};
    // 校验数据
    var partPropertiesIndex = obj.data.partPropertiesIndex;
    if (partPropertiesIndex == 0) {
      wx.showModal({
        title: '提示',
        content: '请选择点检部位专业属性',
        showCancel: false
      })
      return;
    }
    param.checkPartAttribute = partPropertiesIndex;

    var partListIndex = obj.data.partListIndex;
    if (partListIndex == 0) {
      wx.showModal({
        title: '提示',
        content: '请判断点检部位',
        showCancel: false
      })
      return;
    } else {
      param.checkPartStatus = partListIndex;
          if (partListIndex == 2) {
            var errorPartStatusIndex = obj.data.errorPartStatusIndex;
            if (errorPartStatusIndex == 0) {
              wx.showModal({
                title: '提示',
                content: '请选择异常部位选项',
                showCancel: false
              })
              return;
            }
            
            var errorHandleListIndex = obj.data.errorHandleListIndex;
            if (errorHandleListIndex == 0) {
              wx.showModal({
                title: '提示',
                content: '请选择异常部位处理意见',
                showCancel: false
              })
              return;
            }

            param.errorPartStatus = errorPartStatusIndex;
            param.errorPartHandle = errorHandleListIndex;

          }

      
    }

    var checkPerson = obj.data.checkPersonno;
    if (!checkPerson) {
       wx.showModal({
         title: '提示',
         content: '请指定点检人员',
         showCancel: false
       })
       return;
    }
    
    // 点检人员
    param.checkPerson = checkPerson.no;

    // 备注
    var remark = obj.data.remark;
    if (remark) {
       param.remark = obj.data.remark;
    }

    // 扫码时间
    param.scanTime = obj.data.scanTime;

    var photos = obj.data.photos;
    for (var x = 0; x < photos.length; x++) {
      delete photos[x]['tempFilePath'];
    }
    // 拍照信息
    param.devicePhotos = photos;
    
    // id
    param.id = obj.data.check.id;

    // 发起请求
    var reqUrl = app.constant.base_req_url + 'deviceCheck/finsh.we';
    wx.request({
      url: reqUrl,
      dataType: 'json',
      data: {
        requestType: 'wechat',
        json: encodeURI(JSON.stringify(param))
      },
      success: (res) => {
        res = res.data;
        if (res.success) {
          wx.showModal({
            title: '提示',
            content: '成功提交点检反馈！',
            showCancel: false,
            success: (resx) => {
              if (resx.confirm) {
                wx.reLaunch({
                  url: '../../pages/index/index',
                })
              }
            },
            
          })
        } else {
          console.log('程序异常');
        }
      },
      fail: (e) => {
        console.log('网络异常');
      }



    })






    
  }


  
})