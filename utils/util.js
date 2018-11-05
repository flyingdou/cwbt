const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
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

module.exports = {
  formatTime: formatTime,
  getSystemInfo: getSystemInfo
}
