const core = require('@babel/core');
const pathLib = require('path');

const sourceCode = `
var a = 1;
console.log(a);
var b = 2;
`

// no-console 禁用 console, fix=true: 自动修复
const eslintPlugin = ({ fix }) => {
  return {
    // 遍历前钩子
    pre(file) {
      file.set('errors', [])
    },
    visitor: {
      CallExpression(path, state) {
        const errors = state.file.get('errors')
        const { node } = path
        if (node.callee.object && node.callee.object.name === 'console') {
          errors.push(
            // 抛出错误
            path.buildCodeFrameError('代码中不能出现 console 语句', Error)
          )
          if(fix) {
            // 删除 console 节点
            path.parentPath.remove()
          }
        }
      }
    },
    // 遍历后钩子
    post(file) {
      console.log(...file.get('errors'))
    }
  }
}

const { code } = core.transform(sourceCode, {
  plugins: [
    eslintPlugin({ fix: true }),
  ]
})

console.log(code);
