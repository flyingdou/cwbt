var app = getApp();
var util = require('../../utils/util.js');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    multiple: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    year: 0,
    month: 0,
    dateArr: [],
    isToday: 0,
    isTodayWeek: false,
    todayIndex: -1,
    currentItem: 'currentMonth',
    duration: 500
  },

  /**
   * 组件的初始化节点树
   */
  attached: function () {
    // 初始化日历
    this.dateInit();
  },

  pageLifetimes: {
    show() {
      if (this.data.multiple) {
        this.dateInit();
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    dateInit: function (setYear, setMonth) {
      if (!setYear && !setMonth) {
       let now = new Date();
       let year = now.getFullYear();
       let month = now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth();
       let date = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
       
       this.setData({
         year: year,
         month: month,
         nowDay: `${year}-${month}-${date}`,
         activeDay: `${year}-${month}`
       })
      }

     //全部时间的月份都是按0~11基准，显示月份才+1
     let dateArr = [];                        //需要遍历的日历数组数据
     let arrLen = 0;                            //dateArr的数组长度
     let now = setYear ? new Date(setYear, setMonth) : new Date();
     let year = setYear || now.getFullYear();
     let nextYear = 0;
     let month = setMonth || now.getMonth();                    //没有+1方便后面计算当月总天数
     let nextMonth = (month + 1) > 11 ? 1 : (month + 1);
     let startWeek = new Date(year + ',' + (month + 1) + ',' + 1).getDay();                            //目标月1号对应的星期
     let dayNums = new Date(year, nextMonth, 0).getDate();                //获取目标月有多少天
     let obj = {};
     let num = 0;
 
     if (month + 1 > 11) {
       nextYear = year + 1;
       dayNums = new Date(nextYear, nextMonth, 0).getDate();
     }
     arrLen = startWeek + dayNums;
     var mstr = 0;
     for (let i = 1; i < 13; i++) {
        if (i + 1 <= 10) {
          mstr = '0' + i;
        } else {
          mstr = i;
        }
        obj = {
          isToday: `${year}-${mstr}`,
          dateNum: `${mstr}` + '月',
          weight: 5
          }
       dateArr[i] = obj;
     }
     this.setData({
       dateArr: dateArr
     })
 
     let nowDate = new Date();
     let nowYear = nowDate.getFullYear();
     let nowMonth = nowDate.getMonth() + 1;
     let nowWeek = nowDate.getDay();
     let getYear = setYear || nowYear;
     let getMonth = setMonth >= 0 ? (setMonth + 1) : nowMonth;
 
     if (nowYear == getYear && nowMonth == getMonth) {
       this.setData({
         isTodayWeek: true
       })
     } else {
       this.setData({
         isTodayWeek: false
       })
     }
   },
   preYear: function () {
    this.setData({
      year: (this.data.year-1)
    });
    this.dateInit(this.data.year, this.data.month-1);
   },
   nextYear: function () {
     this.setData({
      year: (this.data.year+1)
    });
    this.dateInit(this.data.year, this.data.month-1);
   },
   preMonth: function () {
     //全部时间的月份都是按0~11基准，显示月份才+1
     let year = this.data.month - 2 < 0 ? this.data.year - 1 : this.data.year;
     let month = this.data.month - 2 < 0 ? 11 : this.data.month - 2;
     this.setData({
       year: year,
       month: (month + 1)
     })
     this.dateInit(year, month);
   },
   nextMonth: function () {
     //全部时间的月份都是按0~11基准，显示月份才+1
     let year = this.data.month > 11 ? this.data.year + 1 : this.data.year;
    let month = this.data.month > 11 ? 0 : this.data.month;
     this.setData({
       year: year,
       month: (month + 1)
     })
     this.dateInit(year, month);
   },
   changeMonth: function (e) {
    if (e.detail.source == 'touch') {
      if (e.detail.currentItemId != 'currentMonth') {
        this[e.detail.currentItemId]();
      }
    }
   },
   changeMonthCallback: function (e) {
    this.setData({
      duration: 0
    });
    this.setData({
      currentItem: 'currentMonth',
      duration: 500
    });
   },
   changeDate: function (e) {
     // 选择单日期
    if (!this.data.multiple) {
     var today = e.currentTarget.dataset.date;
     if (today) {
      today = util.formatDate(new Date(today));
      this.setData({
        activeDay: today
      });
      var myEventDetail = { value: today } // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('Calendar', myEventDetail, myEventOption);
     }
    } else {
      var activeDays = this.data.activeDays || [];
      var today = e.currentTarget.dataset.date;
      if (!today) {
        return;
      }
      if (activeDays.length == 1) {
        activeDays.push(today);

        // 传递数据到父组件
        var values = activeDays.sort();
        var _values = [];
        values.forEach(item => { _values.push(util.formatDate(new Date(item))); });
        var myEventDetail = { values: _values } // detail对象，提供给事件监听函数
        var myEventOption = {} // 触发事件的选项
        this.triggerEvent('Calendar', myEventDetail, myEventOption);
      } else {
        if (!activeDays[0]) {
          activeDays.push(today);
        }
        this.setData({
          activeDay: today,
          activeDays: activeDays
        });
      }
    }
   },

   /**
    * 选择月份
    */
   changeMonthDou (e) {
     var month = e.currentTarget.dataset.month;
     var dateArr = this.data.dateArr;
     var activeDays = this.data.activeDays || [];
     
     if (!month) {
       return;
     }
     if (activeDays.length == 1) {
       activeDays.push(month);

       // 传递数据到父组件
       var values = activeDays.sort();
      //  var _values = [];
      //  values.forEach(item => { _values.push(util.formatDate(new Date(item))); });
      // console.log(values);
       var myEventDetail = { values: values } // detail对象，提供给事件监听函数
       var myEventOption = {} // 触发事件的选项
       this.triggerEvent('Calendar', myEventDetail, myEventOption);
     } else {
       if (!activeDays[0]) {
         activeDays.push(month);
       }
       this.setData({
         activeDay: month,
         activeDays: activeDays
       });
     }
   }


  }
})
