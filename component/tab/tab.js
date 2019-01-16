  
Component({

  /**
   * 组件选项
   */
  options: {
    multipleSlots: true
  },

  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * 标题数组
     */
    titles: {
      type: Array,
      value: [
        { title: '页签1' },
        { title: '页签2' }
      ]
    },

    /**
     * 定制组件高度
     */
    height: {
      type: Number,
      value: 360
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    tabIndex: 0
  },

  /**
   * 组件生命周期函数,初始化完成调用
   */
  attached: function () {
    var titleBlockWidth = 100 / this.properties.titles.length;
    var swiperItemHeight = this.properties.height - 60;
    this.setData({
      titleBlockWidth: titleBlockWidth,
      swiperItemHeight: swiperItemHeight
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 改变tab页签当前索引
     */
  changeTabIndex: function (e) {
    // 用户滑动触发
    if (e.detail.source === "touch") {
      var index = e.detail.current;
      this.setData({
        tabIndex: index
      })
    }

    // 用户点击tab页标题触发
    if (e.currentTarget.dataset.index || e.currentTarget.dataset.index === 0) {
      var index = e.currentTarget.dataset.index;
      this.setData({
        tabIndex: index
      })

      // 注册一个标题点击事件
      var myEventDetail = {
        index: index
      }
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('TitleTap', myEventDetail, myEventOption)
    }
  }
  // methods end
  }
})
