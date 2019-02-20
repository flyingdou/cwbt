var app = getApp();
var util = require('../../utils/util.js');
var obj = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    base_img_url: app.constant.base_img_url,
    titles: [
      { title: '督办过程' },
      { title: '督办结果' }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    obj = this;

    if (options.id && options.code) {
      obj.data.id = options.id;
      obj.data.code = options.code;
    }

    obj.setData({
      userId: app.user.id,
      userPriv: app.user.userPriv
    });

    obj.setData({
      windowHeightRpx: util.getSystemInfo().windowHeightRpx
    });
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
    obj.getSupervisionContentList();
    obj.getSuperviseFeedback();
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
   * 查询督导内容列表
   */
  getSupervisionContentList: function () {
    wx.showLoading({
      title: '数据加载中',
      mask: true
    });
    var url = util.getRequestURL('getSupervisionContentList.we');
    var param = { code: obj.data.code, userId: app.user.id };
    wx.request({
      url: url,
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: function (res) {
        res.data.contents.forEach(function (item) {
          item.recUsers.forEach(function (recUser) {
            if (item.attachment) {
              item.attachmentJson = JSON.parse(item.attachment);
            }
            if (app.user.id == recUser.id) {
              obj.setData({
                isRecUser: true
              });
            }
          });
        });
        obj.setData({
          supervise: res.data
        });

        // 查询当前用户是否执行过督导
        obj.getSuperviseFeedbackCount();

        wx.hideLoading();
      },
      fail: function (e) {
        wx.hideLoading();
        util.tipsMessage('网络异常！');
        console.log(e);
      }
    });
  },

  /**
   * 查询督导反馈
   */
  getSuperviseFeedback: function () {
    var url = util.getRequestURL('getSupervisFeedBack.we');
    var param = { code: obj.data.code, userId: app.user.id };
    wx.request({
      url: url,
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: function (res) {
        res.data.forEach(function (item) {
          if (item.image) {
            item.image = JSON.parse(item.image);
          }
        }); 
        obj.setData({
          superviseFeedback: res.data
        });
      },
      fail: function (e) {
        util.tipsMessage('网络异常！');
        console.log(e);
      }
    });
  },

  /**
   * 查询当前用户是否执行过督导
   */
  getSuperviseFeedbackCount: function () {
    var url = util.getRequestURL('getSupervisFeedBackCount.we');
    var param = { code: obj.data.code, userId: app.user.id };
    wx.request({
      url: url,
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: function (res) {
        obj.setData({
          superviseFeedbackCount: res.data
        });
      },
      fail: function (e) {
        util.tipsMessage('网络异常！');
        console.log(e);
      }
    });
  },

  /**
   * 图片预览
   */
  preview: (e) => {
    var feedindex = e.currentTarget.dataset.feedindex;
    var index = e.currentTarget.dataset.index;
    var imgs = [];
    var photos = obj.data.superviseFeedback[feedindex].image;
    for (var i = 0; i < photos.length; i++) {
      imgs.push(app.constant.base_img_url + '/' + photos[i].name);
    }
    // 预览开始
    wx.previewImage({
      current: imgs[index],
      urls: imgs
    })
  },

  /**
   * 跳转页面
   */
  goto: (e) => {
    var link = e.currentTarget.dataset.link;
    wx.navigateTo({
      url: link
    });
  },

  /**
   * 修改督导状态
   */
  updateSuperviseStatus(e) {
    wx.showLoading({
      title: '程序处理中',
      mask: true
    });
    var status = e.currentTarget.dataset.status;
    var url = util.getRequestURL('updateSuperviseStatus.we');
    var param = { code: obj.data.code, status: status };
    wx.request({
      url: url,
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success(res) {
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '操作成功',
          showCancel: false,
          complete() {
            wx.navigateBack({
              delt: 1
            });
          }
        });
      },
      fail(e) {
        wx.hideLoading();
        util.tipsMessage('网络异常！');
      }
    });
  },

  /**
   * 转发
   */
  reSend: function (e) {
    wx.navigateTo({
      url: `../releaseSupervision/releaseSupervision?id=${obj.data.id}&code=${obj.data.code}&contents=${JSON.stringify(obj.data.supervise.contents)}`
    });
  },

  /**
   * 执行
   */
  implement: function (e) {
    var boat = obj.data.supervise.boat ? `&boat=${obj.data.supervise.boat}` : "";
    var device = obj.data.supervise.device ? `&device=${obj.data.supervise.device}` : "";
    var deviceNumber = obj.data.supervise.deviceNumber ? `&deviceNumber=${obj.data.supervise.deviceNumber}` : "";
    var contents = obj.data.supervise.contents;
    var type = contents[contents.length -1].type;
    wx.navigateTo({
      url: `../supervise/supervise?id=${obj.data.id}&code=${obj.data.code}&type=${type}&creator=${obj.data.supervise.contents[0].userName}${boat}${device}${deviceNumber}&contents=${JSON.stringify(obj.data.supervise.contents)}`
    });
  },

  /**
   * 打开文件
   */
  openFile(e) {
    var prohibit = e.currentTarget.dataset.prohibit;
    if (prohibit) {
      return;
    }

    wx.showLoading({
      title: '文件加载中',
      mask: true
    });

    // 取页面索引参数
    var parentindex = e.currentTarget.dataset.parentindex;
    var subindex = e.currentTarget.dataset.subindex;
    // 有文件缓存, 直接读取文件
    var file = obj.data.supervise.contents[parentindex].attachmentJson[subindex];
    var file_cache = wx.getStorageSync("file_cache") || {};
    if (file_cache[file.filename]) {
      file = file_cache[file.filename];
      // 打开文档(预览图片)
      obj.openDocument(file);
      return;
    }

    // 没有文件缓存, 重新下载文件
    var url = app.constant.download_url + file.filename;
    wx.downloadFile({
      url: encodeURI(url),
      success(download_res) {
        if (download_res.statusCode === 200) {
          file.filePath = download_res.tempFilePath;
          obj.saveFile(file, file_cache);
        } else {
          wx.hideLoading();
          util.tipsMessage('网络异常！');
          console.log(download_res);
        }
      }
    });
  },

  /**
   * 保存文件
   */
  saveFile(file, file_cache) {
    var FileSystemManager = wx.getFileSystemManager();
    FileSystemManager.saveFile({
      tempFilePath: file.filePath,
      filePath: wx.env.USER_DATA_PATH + '/' + file.filename,
      success(saveFile_res) {
        // 文件属性存入缓存
        file.filePath = saveFile_res.savedFilePath;
        file_cache[file.filename] = file;
        wx.setStorageSync('file_cache', file_cache);
        // 打开文档(预览图片)
        obj.openDocument(file);
      }
    });
  },

  /**
   * 调用微信打开文档api(或预览图片)
   */
  openDocument(file) {
    // 预览图片
    if (file.filetype === 'pic') {
      wx.previewImage({
        current: file.filePath,
        urls: [ file.filePath ],
        success() {
          wx.hideLoading();
        },
        fail() {
          wx.hideLoading();
          util.tipsMessage('图片格式错误！');
        }
      });
      return;
    }
    // 新开页面打开文档
    wx.openDocument({
      filePath: file.filePath,
      fileType: file.filetype,
      success() {
        wx.hideLoading();
      },
      fail(e) {
        wx.hideLoading();
        util.tipsMessage('微信小程序暂不支持打开该格式文件！');
        console.log(e);
      }
    });
  }
})