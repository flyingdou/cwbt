var app = getApp();

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

 function formatDate (date, type) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var  day = date.getDate();
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
function tipsMessage (message) {
  wx.showModal({
    title: '提示',
    content: message,
    showCancel: false
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






module.exports = {
  formatTime: formatTime,
  getSystemInfo: getSystemInfo,
  tipsMessage: tipsMessage,
  getRequestURL: getRequestURL,
  formatDate: formatDate,
  getOverhaul: getOverhaul,
}
