const { transformSync } = require('@babel/core')

const sourceCode = `
  function getAge() {
    var age = 12;
    console.log(age);
    var name = 'zhufeng';
    console.log(name);
  }
`

// 压缩就是把变量从有意义变成无意义, 尽可能短 _, a, b
const uglifyPlugin = () => {
  return {
    visitor: {
      // 别名, 用于捕获所有作用域节点: 函数, 类的函数, 函数表达式, 语句块, if else, while, for
      Scopable(path) {
        console.log(path.scope.bindings)
        // path.scope.bindings 取出作用域内的所有变量
        Object.entries(path.scope.bindings).forEach(([key, binding]) => {
          // 在当前作用域内生成一个新的 uid, 不会产生变量命名冲突的标识符
          const newName = path.scope.generateUid()
          // 重命名
          binding.path.scope.rename(key, newName)
        })
      }
    }
  }
}

const { code } = transformSync(sourceCode, {
  plugins: [
    uglifyPlugin(),
  ]
})

console.log(code);
// output:
// function _temp() {
//   var _temp4 = 12;
//   console.log(_temp4);
//   var _temp5 = 'zhufeng';
//   console.log(_temp5);
// }
