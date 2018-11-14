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
     var contents = options.contents;
     if (contents) {
        contents = JSON.parse(contents);
        obj.setData({
          contents: contents
        });
     }
     var id = options.id;
     if (id) {
       obj.setData({
         id:id
       });
     }
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
  * 输入改变
  */
  inputChange: (e) => {
    var value = e.detail.value;
    var key = e.currentTarget.dataset.key;
    var dou = {};
    dou[key] = value;
    obj.setData(dou);
  },

  /**
   * 初始化页面
   */
  init: () => {
    var dept_id = app.user.dept_id;
    if (!dept_id) {
      dept_id = 2;
    }
    var reqUrl = app.constant.base_req_url + 'getDepartmentClass.we';
    var param = {
      id: dept_id
    };
    wx.request({
      url: reqUrl,
      dataType: 'json',
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: (res) => {
        res = res.data;
        if (res.success) {
          obj.setData({
            lt:res.department.lt,
            count: res.department.count
          });
          obj.getData();
        }
      }
    })
    
  },

  getData: () => {
    var count = obj.data.lt;
    count = count.length;
    var lt = obj.data.lt;
    var arrayList = [];
    for (var c = 0; c < (3 - count); c++) {
      var a = { 'seq_id': 0, 'name': '请选择' };
      arrayList.push(a);
    }

    obj.setData({
      arrayList: arrayList
    });

    obj.getNext();
  },

 /**
  * 查询下级机构
  */
  getNext: () => {
    var dept_id = obj.data.dept_id;
    if (!dept_id) {
      dept_id = app.user.dept_id;
    }
    var arrayList = obj.data.arrayList;
    var lt = obj.data.lt;
    if (!dept_id) {
      dept_id = 2;
    }
    var reqUrl = app.constant.base_req_url + 'getNextDepartment.we';
    var param = {
      id: dept_id
    };
    wx.request({
      url: reqUrl,
      dataType: 'json',
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: (res) => {
        res = res.data;
        var has = false;
        if (res.success) {
          var ind = 0;
          for (var a in arrayList) {
            for (var x in arrayList[a]) {
              if (dept_id == arrayList[a][x].seq_id) {
                ind = a;
                has = true;
              }
            }
            
          }
          if (has) {
            // 非第一条
            if (res.department && res.department.length > 0) {
              ind = parseInt(ind) + 1;
              arrayList[ind] = res.department;
            }
          } else {
            // 第一条
            arrayList[0] = res.department;
          }
          obj.setData({
            arrayList: arrayList
          }); 

        }

        obj.setData({
          arrayList: arrayList
        });
      }
    })
  },

  /**
   * 选择变化
   */
  pickerChange: (e) => {
    var index = e.detail.value;
    var arrayIndex = e.currentTarget.dataset.arrayindex;
    var arrayList = obj.data.arrayList;
    var dept_id = arrayList[arrayIndex][index].seq_id;
    var indexList = obj.data.indexList;
    if (!indexList) {
      indexList = [];
    }

    indexList[arrayIndex] = index;

    obj.setData({
      dept_id: dept_id,
      indexList: indexList
    });
    // 查询下级机构
    obj.getNext();
  },

  
  /**
   * 发送督导到下级
   */
  send: () => {
      var dept_id = obj.data.dept_id;
      if (!dept_id) {
          wx.showModal({
            title: '提示',
            content: '请选择下发机构！',
            showCancel: false
          })
          return;
      }

      var id = obj.data.id;
      var param = {};
      if (!id) {
        // 新增督导
        param.content = obj.data.content || "";
        param.recDept = dept_id;
        param.creator = app.user.id;
      }

      if (id) {
        // 转发
        param.id = id;
        param.content = obj.data.content || "";
        param.supervisionId = id;
        param.opeartor = app.user.id;
      }

    var reqUrl = app.constant.base_req_url + 'saveSupervis.we';
      wx.request({
        url: reqUrl,
        dataType: 'json',
        data: {
          json: encodeURI(JSON.stringify(param))
        },
        success: (res) => {
          if (res.data.success) {
            wx.navigateBack({
              delta:2
            })
          }
        }
      })

  }

 




})