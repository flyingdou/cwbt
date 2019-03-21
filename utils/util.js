var app = getApp();
const formatTime = (date, format) => {
  if (!date) {
      date = new Date();
  }

  if (date instanceof string) {
    date = date.substring(0, 19);
    date = date.replace(/-/g, '/');
    date = new Date(date);
  }

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  if (format === "yyyy-MM-dd HH:mm") {
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
  }

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}


 function formatDate (date, type) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  if (type) {
     var yeax = parseInt(year);
     year = yeax + 1;
  } 

  return [year, month, day].map(formatNumber).join('-');
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 获取屏幕高度(px),宽度(px),转换成px的比例
 */
function getSystemInfo() {
  var systemInfo = wx.getSystemInfoSync();
  var windowWidth = systemInfo.windowWidth;
  var windowHeight = systemInfo.windowHeight;
  var proportion = 750 / windowWidth;
  var windowWidthRpx = windowWidth * proportion;
  var windowHeightRpx = windowHeight * proportion;
  return { windowWidth, windowHeight, proportion, windowWidthRpx, windowHeightRpx }
}

/**
 * 提示
 */
function tipsMessage (message, callback) {
  wx.showModal({
    title: '提示',
    content: message,
    showCancel: false,
    success: callback
  });
}

/**
 * 获取请求地址
 */
function getRequestURL(interfaceName) {
  var url = '';
  if (!app.constant.isDev) {
    url = app.constant.base_forward_url + '?url=' + app.constant.base_req_url + interfaceName;
  } else {
    url = app.constant.base_req_url_backup + interfaceName;
  }
  return url;
}




/**
 * 获取维修方式名称
 */
function getOverhaul (overhaul) {
  var overhaulName = "";
  var overhaulList = [
    {"id":0,"name":"自行维修"},
    {"id":1,"name":"委外维修"}
  ];
  for (var x in overhaulList) {
    if (overhaulList[x].id == overhaul) {
      return overhaulList[x].name;
    }
  }
  return overhaulName;
}



/**
 * 图片预览
 */
function preview (e) {
   // 当前被点击的图片下标
   var index = e.currentTarget.dataset.index;
   // 预览的数据列表
   var itemList = e.currentTarget.dataset.itemlist;
   // 图片字段
   var key = e.currentTarget.dataset.key;
   // 图片前缀
   var prefix = e.currentTarget.dataset.prefix;


   var urls = [];
   // 预览数据类型,不传默认为多张图片预览，传参了即为单张图片预览
   var type = e.currentTarget.dataset.type;
   if (type) {
      // 单张预览
      var image = prefix + itemList[key];
      // 解决图片链接有中文字符的情况下，部分机型预览图片失败的问题
      image = encodeURI(image);
      urls.push(image);
   } else {
      // 多张预览
      itemList.forEach((item, i) => {
        // 图片URL
        var image = prefix + item[key];
        // 解决图片链接有中文字符的情况下，部分机型预览图片失败的问题
        image = encodeURI(image);
        urls.push(image);
      });
   }
  
  //  console.log(urls);
   var currentUrl = urls[index] || '';
   wx.previewImage({
     current: currentUrl,
     urls: urls,
   })
}

/**
 * 格式化计划时间
 */
function formatPlanTime (workList) {
  var around = 0;
  var expectedTime = '';
  var dou = new Date();
  var exTimeStamp = 0;
  workList.forEach((work,i) => {
    around = work.around ? parseInt(work.around) : around;
    expectedTime = new Date(work.expectedtime);
    exTimeStamp = expectedTime.getTime();
    if (around == 0) {
      dou = expectedTime;
      work.prefix = formatDate(dou);
    } else if (around > 0 ) {
      dou.setTime(exTimeStamp - 1000*60*60*24*around);
      work.prefix = formatDate(dou);
      dou.setTime(exTimeStamp + 1000*60*60*24*around);
      work.subffix = formatDate(dou);
    } else {
      dou = expectedTime;
      work.prefix = formatDate(dou);
    }
      
  });

  return workList;
  
}



module.exports = {
  formatTime: formatTime,
  getSystemInfo: getSystemInfo,
  tipsMessage: tipsMessage,
  getRequestURL: getRequestURL,
  formatDate: formatDate,
  getOverhaul: getOverhaul,
  preview: preview,
  formatPlanTime: formatPlanTime
}
