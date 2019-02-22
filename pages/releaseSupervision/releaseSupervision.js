var app = getApp();
var util = require('../../utils/util.js');
var obj = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    obj = this;
		var dou = {};

    // 已有的督导内容
		var contents = options.contents || '';
		if (contents) {
				contents = JSON.parse(contents);
				dou.contents = contents;
		}
		
		// 已有的督导id
    var id = options.id;
		if (id) {
			dou.id = id;
		}

    // 已有code
    var code = options.code;
    if (code) {
      dou.code = code;
    }
		
		obj.setData(dou);

    // 清除缓存数据
    obj.clear();
		
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
    obj.init();
    // 获取附件数据
    obj.getAttachment();

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
   * inputChange
   */
  inputChange: (e) => {
     var key = e.currentTarget.dataset.key;
     wx.setStorageSync(key, e.detail.value);
  },

  /**
   * 初始化页面数据
   */
  init: () => {
    var dou = {};
    dou.content = wx.getStorageSync('content') || '';
    obj.setData(dou);
  },

  /**
   * 获取附件数据
   */
  getAttachment(){
     var attachments = obj.data.attachments || [];
     var filexs = wx.getStorageSync('filexs') || '';
     if (filexs) {
        filexs = JSON.parse(filexs);
        filexs.forEach((file,index) => {
          attachments.push(file);
        });

        // 清除本次存储的sessionStorage
        wx.removeStorageSync('filexs');
     }

     // 将值存储起来
     obj.setData({
       attachments: attachments
     });

     
  },


  /**
   * choose
   */
  choose: (e) => {
    var key = e.currentTarget.dataset.key;
    var douKey = key + 'Dou';
    var douValue = obj.data[douKey] || '';

    var jumpUrl = '../../pages/chooseUser/chooseUser?' + key + '=' + JSON.stringify(douValue) + '&key=' + key;
    if (obj.data.recUsersDou) {
      var chooseDeptList = obj.data.recUsersDou.chooseDeptList || [];
      var chooseUsers = obj.data.recUsersDou.chooseUsers || [];
      var checkCount = chooseUsers.length;
      jumpUrl += '&chooseDeptList=' + JSON.stringify(chooseDeptList) + '&checkCount=' + checkCount;
    }
    var contents = obj.data.contents || [];
    var upUsers = [];
    if (contents.length > 0) {
       for(var c in contents) {
         // 发起人
         upUsers.push(contents[c].opeartor);
         // 接收人
         var ru = contents[c].recUsers;
         for (var r in ru) {
           upUsers.push(ru[r].id);
         }

         // 抄送人
         var fu = contents[c].fwdUsers;
         for (var f in fu) {
           upUsers.push(fu[f].id);
         }

       }
       
    }
    wx.setStorageSync('upUsers', upUsers);
    wx.removeStorageSync("isToSupervision");

    wx.navigateTo({
      url: jumpUrl,
    })
  },

  /**
   * 移除人员
   */
  removeUser(e) {
    var key = e.currentTarget.dataset.key;
    var index = e.currentTarget.dataset.index;
    var data = obj.data;
    var users = data[key].chooseUsers;
    users.splice(index, 1);
    data[key].chooseUsers = users;
    obj.setData(data);
  },

  /**
   * send、发起督导
   */
  send: () => {
		 // 校验参数
     if (!obj.checkParam()) {
			 return;
		 }
		 
		 // 数据校验通过，调用发起、转发督导接口
		 var param = obj.data.param;
		 
		 wx.showLoading({
		 	title: '处理中...',
		 	mask: true,
		 })
		 
		 var reqUrl = util.getRequestURL('saveSupervis.we');
		 wx.request({
		 	url: reqUrl,
		 	dataType: 'json',
		 	data: {
		 		json: encodeURI(JSON.stringify(param))
		 	},
		 	success: (res) => {
		 		if (res.data.success) {
          // 移除页面缓存数据
          obj.clear();
          wx.showModal({
            title: '提示',
            content: '发送成功！',
            showCancel: false,
            success: (rex) => {
              if (rex.confirm) {
                // 返回上一级
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
          
		 		}
		 	},
		 	fail: (e) => {
		 		wx.showModal({
		 			title: '提示',
		 			content: '网络异常！',
           showCancel: false
		 		})
		 	},
       complete: (rx) => {
         wx.hideLoading();
       }
		 })
  },

  /**
   * 校验参数
   */
  checkParam: () => {
    var recUsers = [];
    if (obj.data.recUsersDou) {
       recUsers = obj.data.recUsersDou.chooseUsers;
    }
    
    var copyUsers = [];
    if (obj.data.copyUsersDou) {
      copyUsers = obj.data.copyUsersDou.chooseUsers;
    }
    var content = wx.getStorageSync('content') || null;
		var id = obj.data.id || null;
    if (recUsers.length < 1) {
      wx.showModal({
        title: '提示',
        content: '请选择接收人！',
        showCancel: false,
      })
      return false;
    }

    if (!content) {
      wx.showModal({
        title: '提示',
        content: '请输入督导内容！',
        showCancel: false,
      })
      return false;
    }

    var param = {};
		var recUser = [];
		for (var r in recUsers) {
			  recUser.push(recUsers[r].user_id);
		}
    // 接收者
		param.recUser = recUser.join(',');
		
		var coypUser = [];
		for (var c in copyUsers) {
				coypUser.push(copyUsers[c].user_id);
		}
    // 抄送者
		param.fwdUser = coypUser.join(',');
	  
    // 督导类容
		param.content = content;

    // 附件
    var attachments = obj.data.attachments;
    if (attachments && attachments.length > 0) {
       param.attachment = attachments;
    }

    // 发起督导
    if (!id) {
      param.creator = app.user.id;
    }
    // 转发
		if (id) {
      param.id = id;
      param.supervisionId = id;
      param.opeartor = app.user.id;
      // 转发时必有code
      param.code = obj.data.code;
		}
		
		obj.data.param = param;
    return true;

  },

  /**
   * 移除缓存数据
   */
  clear: () => {
    wx.removeStorageSync('recUsers');
    wx.removeStorageSync('copyUsers');
    wx.removeStorageSync('content');
    wx.removeStorageSync('upUsers');
    wx.removeStorageSync('filexs');
  },

  /**
   * 添加附件
   */
  goto(e) {
     var link = e.currentTarget.dataset.link;
     wx.navigateTo({
       url: link,
     })
  },

  

  

})