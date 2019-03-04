var app = getApp();
import regeneratorRuntime from '../../utils/runtime.js';
var util = require('../../utils/util.js');
var obj = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    base_img_url: app.constant.base_img_url + "/",
    hidden: true,
    showMark: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    obj = this;
    var dou = {};
    // 工作卡id
    dou.workCardId = options.id;
    // source
    dou.source = options.source;

    // status
    if (options.audit_status) {
       dou.audit_status = options.audit_status;
    }

    obj.setData(dou);

    // title
    var title = '';
    var overhaul = options.overhaul;
    if (overhaul == 0) {
      title = '自行报审记录';
    }
    if (overhaul == 1) {
      title = '委外报审申请';
    }

    wx.setNavigationBarTitle({
      title: title,
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
    obj.getWorkDetail();
  },

 /**
  * 查询数据
  */
  getWorkDetail: (e) => {
    var param = {
      id: obj.data.workCardId,
      dept_id: app.user.deptId
    };
    var reqUrl = util.getRequestURL('getTempWork.we');
    

    var expectedtime = '';
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
          if (res.workDetail.image) {
            res.workDetail.image = JSON.parse(res.workDetail.image);
          }
          if (res.workDetail.expectedtime) {
            expectedtime = res.workDetail.expectedtime;
          }

          if (res.workDetail.feedbackimage) {
             res.workDetail.feedbackimage = JSON.parse(res.workDetail.feedbackimage);
          }
          if (res.workFeedback) {
            var workFeedback = res.workFeedback;
            if (workFeedback.image) {
              workFeedback.image = JSON.parse(workFeedback.image);
            }
            obj.setData({
              photos: workFeedback.image,
              workFeedback: workFeedback
            });
          }
          
          // 判断是否可修改
          var isUpdate = false;
          if (res.workDetail.creator == app.user.id && obj.data.audit_status == 0 && obj.data.source == 'tempList') {
              isUpdate = true;
          }

          // 判断是否审批
          var isAudit = false;
          var audit = false;
          if (res.workDetail.creator != app.user.id && obj.data.source == 'mtwcList') {
             audit = true;
             if (obj.data.audit_status == 0 && !res.workDetail.isLast) {
                isAudit = true;
             }
          }


          // 领导领取委外维修的临时工作卡
          var user_priv = app.user.userPriv; // 用户权限
            obj.setData({
              workDetail: res.workDetail,
              user_priv: user_priv,
              expectedtime: expectedtime,
              isUpdate: isUpdate,
              isAudit: isAudit,
              audit: audit
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
    
    var dou = {};
    dou[key] = e.detail.value;
    obj.setData(dou);
   
  },

  /**
 * 弹起日历
 */
  showMark: function (e) {
    if (obj.data.disablex) {
       return;
    }
    var key = e.currentTarget.dataset.key;
    obj.setData({
      dateKey: key,
      showMark: true
    });
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
  confirm2() {
    obj.scanCode();
    obj.setData({
      hidden: true
    });
  },

  /**
   * 点击取消按钮
   */
  cancel2() {
    obj.setData({
      hidden: true
    });
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
        // 添加功能，开发模式扫码模拟（扫什么码都当成正确的）
        if (app.constant.isDev) {
          res.result = obj.data.workDetail.number;
        }
        // 正常流程
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
  photo: (e) => {
    var photo = {};
    var key = e.currentTarget.dataset.key;
    var photos = obj.data[key] || [];
    var dou = {};
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
        dou[key] = photos;
        obj.setData(dou)
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
        url = app.constant.base_img_url + photos[i].name;
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
        url = app.constant.base_img_url + photos[i].name;
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
    wx.showModal({
      title: '提示',
      content: '是否确认删除图片?',
      success(result) {
        if (result.confirm) {
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
        }
      }
    });
  },


  /**
   * 上传图片（同步）
   */
    uploadPicture (tempFilePath) {
    return new Promise(function (resolve, reject) {
      // 开始上传图片
      var reqUrl = app.constant.upload_url;
      wx.uploadFile({
        url: reqUrl,
        filePath: tempFilePath,
        name: 'myfile',
        success: function (res) {
          var res = res.data;
          if (res) {
            res = JSON.parse(res);
          }
          resolve(res)
        },

      })
    })
  },

  /**
   * 批量上传照片(同步)
   */
 async uploadPics (picList) {
      for (var p = 0; p < picList.length; p++) {
        if (picList[p].tempFilePath) {
          var res = await obj.uploadPicture(picList[p].tempFilePath);
          if (res.success) {
            picList[p].name = res.picture;
            // 删除tempFilePath
            delete picList[p]['tempFilePath'];
          }
        }
         
    }
    
    return picList;
  },

  /**
   * 调用上传方法
   */
    async uploadPictures (e) {
    var key = e.currentTarget.dataset.key;
    var photos = obj.data[key] || [];
    photos = await obj.uploadPics(photos);
    obj.updateWorkCard(key);

  },

  /**
   * 删除工作卡
   */
  deleteWorkCard: function () {
    wx.showModal({
      title: '提示',
      content: '确定删除?',
      success(modal_res) {
        if (modal_res.confirm) {
          wx.showLoading({
            title: '处理中',
            mask: true
          });
          var url = util.getRequestURL('updateWorkCard.we');
          var param = {id: obj.data.workDetail.id, isdel: 1};
          wx.request({
            url: url,
            data: {
              json: encodeURI(JSON.stringify(param))
            },
            success(res) {
              wx.hideLoading();
              util.tipsMessage('删除成功');
              wx.navigateBack({
                delta: 1
              });
            },
            fail(e) {
              wx.hideLoading();
              util.tipsMessage('网络异常');
              console.log(e);
            }
          });
        }
      }
    });
  },

  /**
   * 修改工作卡
   */
  updateWorkCard: function (key) {
    wx.showLoading({
      title: '处理中',
      mask: true
    });
    var workDetail = obj.data.workDetail;
    var photos = obj.data[key] || [];
    var url = util.getRequestURL('updateExceptionalFeedBack.we');
    var param = {id: workDetail.exceptionid};
    if ((!photos || photos.length <= 0) && !obj.data.exceptional_describe && !obj.data.applyNote) {
        wx.hideLoading();
        util.tipsMessage('修改成功');
        wx.navigateBack({
          delta: 1
        });
      return;
    } else {
      param.image = workDetail.image.concat(photos);
      param.image = JSON.stringify(param.image);
      param.exceptionalDescribe = obj.data.exceptional_describe;
      param.applyNote = obj.data.applyNote;
      param.workcardId = workDetail.id;
    }
    // 测试数据
    // console.log(JSON.stringify(param));
    // return;
    wx.request({
      url: url,
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success(res) {
        wx.hideLoading();
        util.tipsMessage('修改成功');
        wx.navigateBack({
          delta: 1
        });
      },
      fail(e) {
        wx.hideLoading();
        util.tipsMessage('网络异常');
        console.log(e);
      }
    });
    
  },

  /**
   * 审批
   */
  audit (e) {
    var key = e.currentTarget.dataset.key;
    var param = {
      id: obj.data.workDetail.id,
      auditPerson: app.user.id
    };

    var expectedtime = obj.data.expectedtime;
    var auditNote = obj.data.auditNote;
    var isdel = '';

    // 校验数据
    var auditStatus = '';
    if (key == 'agree') {
        if (!expectedtime) {
          util.tipsMessage('请选择预计完成时间！');
          return;
        }
        auditStatus = 1;
        isdel = 0;
        param.eid = obj.data.workDetail.eid;
    }
    if (key == 'refuse') {
        if (!auditNote) {
          util.tipsMessage('请输入审批意见！');
          return;
        }
        auditStatus = 2;
        isdel = 1;
    }
    param.isdel = isdel;
    param.expectedtime = expectedtime;
    param.auditNote = auditNote;
    param.auditStatus = auditStatus;


    var reqUrl = util.getRequestURL('audit.we');

    // loading
    wx.showLoading({
      title: '处理中',
    })

    wx.request({
      url: reqUrl,
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success (res) {
        res = res.data;
        if (res.success) {
           wx.hideLoading();
           wx.showModal({
             title: '提示',
             content: '审批完成！',
             showCancel: false,
             success (con) {
                if (con.confirm) {
                  wx.navigateBack({
                    delta: 1
                  })
                }
             }

           })
        }
      }
    })

   
   
  },

  /**
   * 选择日历
   */
  showMark () {
    if (!obj.data.isAudit) {
       return;
    }
    obj.setData({
      showMark: true
    });
  },

  /**
   * 保存日历选出的时间
   */
  saveDate (e) {
    obj.setData({
      showMark: false,
      expectedtime: e.detail.value
    });
  }


})