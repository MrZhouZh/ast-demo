const core = require('@babel/core');
const types = require('@babel/types');
const pathLib = require('path');

const sourceCode = `
  console.log("日志")
`

// 输出 console.log("hello world","当前文件名","具体代码位置信息")
const logPlugin = {
  visitor: {
    CallExpression(path, state) {
      const { node } = path
      if (types.isMemberExpression(node.callee)) {
        if (node.callee.object.name === 'console') {
          // [log, info, warn, error]
          if (['log', 'info', 'warn', 'error'].includes(node.callee.property.name)) {
            // 找到所处位置的行和列
            const { line, column } = node.loc.start
            // 添加行列信息
            node.arguments.push(types.stringLiteral(`${line}:${column}`));
            // 文件名
            const filename = state.file.opts.filename
            // 输出文件相对路径
            const relativePath = pathLib
              .relative(__dirname, filename)
              .replace(/\\/g, '/')  // windows 兼容

            // 添加文件相对路径信息
            node.arguments.push(types.stringLiteral(relativePath))
          }
        }
      }
    }
  }
}

const { code } = core.transform(sourceCode, {
  plugins: [
    logPlugin
  ],
  filename: 'console-hello.js'
})

console.log(code);
// output: console.log("日志", "2:2", "console-hello.js");
