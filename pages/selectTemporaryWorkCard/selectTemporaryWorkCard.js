var app = getApp();
var obj = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModalStatus:false, // 默认禁用
    multiIndex: [0, 0, 0]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     obj = this;
     // 初始化多列选择器
     // this.multiSelectorInit();
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
   * 多列选择器数据初始化
   */
  multiSelectorInit: () => {
    wx.showLoading({
      title: '数据加载中',
      mask: true
    });
    wx.request({
      url: app.constant.base_req_url + 'getDepartmentListByParent.we',
      data: {
        json: JSON.stringify({ parentId: 2 })
      },
      success: function (res) {
        var data = res.data;
        var objectMultiArray = [data, data[0].nodes, data[0].nodes[0].nodes];
        obj.setData({ objectMultiArray: objectMultiArray });
        obj.data.multiSelectorData = res.data;
        wx.hideLoading();
      }
    });
  },

  /**
   * 展示弹出框
   */
  choose: (e) => {
    // 滑动选择器动态变动值  
    if (e.type == 'columnchange') {
      var objectMultiArray = obj.data.objectMultiArray;
      var data = obj.data.multiSelectorData;
      var detail = e.detail;
      var multiIndex = obj.data.multiIndex;
      switch (e.detail.column) {
        case 0:
          // 记录Index
          multiIndex[0] = detail.value;
          multiIndex[1] = 0;
          multiIndex[2] = 0;
          //此处是拖动第一栏的时候处理
          objectMultiArray[1] = data[detail.value].nodes;
          objectMultiArray[2] = data[detail.value].nodes[0].nodes;
          break;
        case 1:
          multiIndex[1] = detail.value;
          multiIndex[2] = 0;
          //此处是拖动第二栏的时候处理
          objectMultiArray[2] = data[multiIndex[0]].nodes[detail.value].nodes;
          break;
      }
      obj.setData({ objectMultiArray : objectMultiArray });
    }

    // 点击确定获取最终值
    if (e.type == 'change') {
      var objectMultiArray = obj.data.objectMultiArray;
      var detail = e.detail;
      var lastIndex = objectMultiArray.length - 1;
      if (objectMultiArray[lastIndex][detail.value[lastIndex]]) {
        var dept_id = objectMultiArray[lastIndex - 1][detail.value[lastIndex - 1]].id;
        var boat_id = objectMultiArray[lastIndex][detail.value[lastIndex]].id;
        var boat_name = objectMultiArray[lastIndex][detail.value[lastIndex]].name;
        obj.setData({
          dept_id: dept_id,
          boat_id: boat_id,
          boat_name: boat_name
        });
      } else {
        obj.setData({
          dept_id: null,
          boat_id: null,
          boat_name: ''
        });
      }
    }
  },
  
  // 跳转页面
  goto: (e) => {
    var link = e.currentTarget.dataset.link;
    wx.navigateTo({
      url: link
    });
    return;

    // var dept_id = obj.data.dept_id;
    // var boat_id = obj.data.boat_id;
    // if (!boat_id) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '请选择需要抽查的船！',
    //     showCancel: false
    //   })
    //   return;
    // }

    // // 类型
    // var queryType = e.currentTarget.dataset.querytype;

    // // 跳转页面
    // wx.redirectTo({
    //   url: '../../pages/Tlist/Tlist?boat_id=' + boat_id + '&dept_id=' + dept_id + '&queryType=' + queryType + '&flag=spotCheck',
    // })
    
  }

  
})