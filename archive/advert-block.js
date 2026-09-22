/*
 * 一号社区 APP 广告响应改写脚本（Shadowrocket http-response）
 *
 * 1. /outapi/switchapi/app/advertise/status
 *    服务端 data="1" 表示允许广告。改写为 data="0"，保留 code/desc，
 *    让 APP 主动关闭开屏广告；可避免已缓存广告继续播放。
 *
 * 2. /yihao01-app-api/app/advert/listBySizeNew
 *    递归清空 data 中所有数组（首页车场广告列表），其余字段保持原样，
 *    APP 解析正常、不报网络异常。
 */

var body = $response.body;

try {
  var obj = JSON.parse(body);
  var url = (typeof $request !== 'undefined' && $request && $request.url) ? $request.url : '';

  if (url.indexOf('/outapi/switchapi/app/advertise/status') !== -1) {
    if (obj && 'data' in obj) {
      obj.data = '0';
    }
  } else if (url.indexOf('/app/advert/listBySizeNew') !== -1) {
    if (obj && 'data' in obj) {
      clearArrays(obj.data);
    }
  }

  body = JSON.stringify(obj);
} catch (e) {
  // JSON 解析失败时原样返回，不做任何改动
}

// 递归清空对象内所有数组（首页广告接口的 data 就是广告数据，全清安全）
function clearArrays(node) {
  if (Array.isArray(node)) {
    node.length = 0;
    return;
  }
  if (node && typeof node === 'object') {
    for (var k in node) {
      clearArrays(node[k]);
    }
  }
}

$done({ body: body });
