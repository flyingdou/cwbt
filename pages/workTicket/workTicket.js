var app = getApp();
var obj = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isScan:false,
    isPhoto:false,
    photos: []
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

  /**
   * 初始化页面数据
   */
  init: () => {
    var id = obj.data.id;
    // id = 1;
    var param = {
      id:id
    };
    var reqUrl = app.constant.base_req_url + 'workTicket/getWorkTicketById.we';
    wx.request({
      url: reqUrl,
      dataType: 'json',
      data: {
        requestUrl: 'wechat',
        json: encodeURI(JSON.stringify(param))
      },
      success: (res) => {
        res = res.data;
        if (res.success) {
          obj.setData({
            workTicket: res.workTicket
          });
        } else {
          console.log('程序报错！');
        }
      },
      fail: (e) => {
        console.log('数据请求失败！');
      }
    })
  },

   
  /**
   * 取输入框的值
   */
  bindInput: (e) => {
    var dou = {};
    var key = e.currentTarget.dataset.flag;
    dou[key] = e.detail.value;
    obj.setData(dou);
  },

  /**
   * 通过no查询用户数据
   */
  search: (e) => {
     var key = e.currentTarget.dataset.flag;
     console.log(obj.data);
     var no = obj.data[key];
     if (!no || parseInt(no) == 0) {
       wx.showModal({
         title: '提示',
         content: '请输入人员编号！',
         showCancel:false
       })
       return;
     } 
     var reqUrl = app.constant.base_req_url + 'deviceUser/getUserByNo.we';
     var param = {'no':no};
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
       onlyFromCamera:true,
       scanType:['barCode'],
       success: (res) => {
         isScan = true;
         if (res.result == obj.data.workTicket.code) {
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
    var photos = obj.data.photos;
    wx.chooseImage({
      count:1,
      sizeType:['compressed'],
      sourceType:['camera'],
      success: (res) => {
        isPhoto = true;
        var timex = obj.getNowFormatDate();
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
    photos.splice(index,1);
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
         var x = i+1;
         console.log('第' + x + '张图片上传失败！');
       }
      },
      fail: (e) => {
        var y = i+1;
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
  getNowFormatDate:  () => {
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
    if(month >= 1 && month <= 9) {
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
   * finsh 保存数据
   */
  finsh: () => {
    // 校验数据
    var operator = obj.data.operatorno;
    if (!operator) {
      wx.showModal({
        title: '提示',
        content: '请补充作业人员！',
        showCancel:false
      })
      return;
    }
    var surePerson = obj.data.surePersonno;
    if (!surePerson) {
      wx.showModal({
        title: '提示',
        content: '请补充作业完成确认人！',
        showCancel: false
      })
      return;
    }
    var photos = obj.data.photos;
    for (var x = 0; x <photos.length; x++) {
      delete photos[x]['tempFilePath'];
    }
    
    var remark = obj.data.remark;
    
    var param = {
      id: obj.data.workTicket.id,
      operator: operator.no,
      confirmPerson: surePerson.no,
      devicePhotos: photos,
      scanTime: obj.data.scanTime,
      remark: remark
    };

    console.log(param);
    var reqUrl = app.constant.base_req_url + 'workTicket/finsh.we';
    // 发起微信请求
    wx.request({
      url: reqUrl,
      dataType: 'json',
      data: {
        requestType:'wechat',
        json: encodeURI(JSON.stringify(param))
      },
      success: (res) => {
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
          wx.navigateTo({
            url: '../../pages/index/index',
          })
        } else {
          console.log('程序异常！');
        }
      },
      fail: (e) => {
        console.log('网络异常！');
      }

    })

  },

  test: () => {
    // var dou = [
    //   { "name": 'dou', "id": 1, "age": 18 }, 
    //   { "name": 'dou', "id": 2, "age": 19 },
    //   { "name": 'dou', "id": 3, "age": 19 }
    //   ];
    // for (var d = 0; d < dou.length; d++) {
    //   delete dou[d]['name'];
    // }
    // console.log(dou);
    var dou = obj.data.remark;
    var param = {
      dou:dou
    };
    console.log(JSON.stringify(param));
  }


})