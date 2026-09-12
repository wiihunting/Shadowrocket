/*
 * 一号社区 APP 首页车场广告位拦截脚本（Shadowrocket http-response）
 *
 * 原理：接口 /yihao01-app-api/app/advert/listBySizeNew 的响应返回后，
 *      递归清空 data 中所有数组（广告列表），其余字段（code/msg 等）
 *      保持服务器原样 —— APP 解析正常、不报错，但广告位无内容可渲染。
 *
 * 之所以不用 REJECT-200：空 body 会被 APP 判定为异常，弹"网络异常，请重试"。
 */

var body = $response.body;

try {
  var obj = JSON.parse(body);

  if (obj && 'data' in obj) {
    clearArrays(obj.data);
  }

  body = JSON.stringify(obj);
} catch (e) {
  // JSON 解析失败 → 原样返回，不做任何改动
}

// 递归清空对象内所有数组（广告接口的 data 就是广告数据，全清安全）
function clearArrays(node) {
  if (Array.isArray(node)) {
    node.length = 0;          // 数组 → 清空
    return;
  }
  if (node && typeof node === 'object') {
    for (var k in node) {
      clearArrays(node[k]);   // 对象 → 逐层深入
    }
  }
}

$done({ body: body });
