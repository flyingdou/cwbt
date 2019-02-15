var util = require('../../utils/util.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    special: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    windowWidthRpx: util.getSystemInfo().windowWidthRpx,
    windowHeightRpx: util.getSystemInfo().windowHeightRpx
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
