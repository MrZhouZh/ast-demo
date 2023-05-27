const parent = window;
const frame = document.createElement('iframe');

// 限制代码 iframe 代码执行能力
frame.sandbox = 'allow-same-origin';

const data = [1, 2, 3, 4, 5, 6];
let newData = [];

// 当前页面给 iframe 发送消息
frame.onload = function (e) {
  frame.contentWindow.postMessage(data);
};

document.body.appendChild(frame);

// iframe 接收到消息后处理
const code = `
    return dataInIframe.filter((item) => item % 2 === 0)
`;
frame.contentWindow.addEventListener('message', function (e) {
  const func = new frame.contentWindow.Function('dataInIframe', code);

  // 给副页面也送消息
  parent.postMessage(func(e.data));
});

// 父页面接收 iframe 发送过来的消息
parent.addEventListener(
  'message',
  function (e) {
    console.log('parent - message from iframe:', e.data);
  },
  false,
);
