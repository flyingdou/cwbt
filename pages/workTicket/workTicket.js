var app = getApp();
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
     wx.scanCode({
       onlyFromCamera:true,
       scanType:['barCode'],
       success: (res) => {
         console.log(res);
       }
     })
  },

  /**
   * 拍照
   */
  photo: () => {
    wx.chooseImage({
      count:1,
      sizeType:['compressed'],
      sourceType:['camera'],
      success: (res) => {
        console.log(res);
      },
    })
  }

})