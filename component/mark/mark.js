var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showModalStatus: Boolean, // 是否显示弹出框
    multiple: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 保存用户选择的值
     */
    saveSelectValue: function (e) {
      e.currentTarget.dataset.type = 'success';
      this.tap(e);
    },
    /**
     * 按钮点击触发
     */
    tap: function (e) {
      var btn_type = e.currentTarget.dataset.type;
      /* 动画部分 */
      // 第1步：创建动画实例 
      var animation = wx.createAnimation({
        duration: 200,  //动画时长
        timingFunction: "linear", //线性
        delay: 0  //0则不延迟
      });

      // 第2步：这个动画实例赋给当前的动画实例
      this.animation = animation;

      // 第3步：执行第一组动画
      animation.opacity(0).rotateX(-100).step();

      // 第4步：导出动画对象赋给数据对象储存
      this.setData({
        animationData: animation.export()
      });

      // 第5步：设置定时器到指定时候后，执行第二组动画
      setTimeout(function () {
        // 执行第二组动画
        animation.opacity(1).rotateX(0).step();
        // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
        this.setData({
          animationData: animation
        });

        var myEventDetail = {
          type: btn_type,
        } // detail对象，提供给事件监听函数
        if (btn_type == 'success') {
          if (e.detail.value) {
            myEventDetail.value = e.detail.value;
          }
          if (e.detail.values) {
            myEventDetail.values = e.detail.values;
          }
        }
        var myEventOption = {} // 触发事件的选项
        this.triggerEvent('Mark', myEventDetail, myEventOption);
      }.bind(this), 200);
    }
  }
})
