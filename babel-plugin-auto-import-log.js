const core = require('@babel/core');
const types = require('@babel/types');
const template = require('@babel/template')

const sourceCode = `
  // 四种声明函数的方式
  function sum(a, b) {
    return a + b;
  }
  const multiply = function(a, b) {
    return a * b;
  }
  const minus = (a, b) => a - b;
  class Calculator {
    divide(a, b) {
      return a / b;
    }
  }
`

const autoImportLogPlugin = {
  visitor: {
    Program(path, state) {
      let loggerId;
      // 遍历子节点
      path.traverse({
        ImportDeclaration(path) {
          const { node } = path
          // 判断是否已导入
          if (node.source.value === 'logger') {
            const specifiers = node.specifiers[0]
            // 导入变量名赋值 loggerId
            loggerId = specifiers.local.name
            // 找到后跳出循环
            path.stop()
          }
        }
      })

      // 说明未导入该模块
      if (!loggerId) {
        // 手动插入 import
        loggerId = path.scope.generateUid('loggerLib')  // 防止命名冲突
        path.node.body.unshift(
          template.statement(`import ${loggerId} from 'logger'`)()
          // types.importDeclaration(
          //   [types.importDefaultSpecifier(types.identifier(loggerId))],
          //   types.stringLiteral('logger')
          // )
        )
      }

      // 在 state 上挂载节点 => loggerLib()
      state.loggerNode = template.statement(`${loggerId}`)()
      // types.expressionStatement(
      //   types.callExpression(types.identifier(loggerId), [])
      // )
    },
    // 四种函数方式
    'FunctionDeclaration|FunctionExpression|ArrowFunctionExpression|ClassMethod'(path, state) {
      const { node } = path
      // 如果是个 block 语句
      if (types.isBlockStatement(node.body)) {
        // 在语句的头部添加 logger 函数节点
        node.body.body.unshift(state.loggerNode)
      } else {
        // 处理箭头函数, 生成 block 语句, 在第一行中插入 loggerNode, 然后 return 之前的内容
        const newBody = types.blockStatement([
          state.loggerNode,
          types.returnStatement(node.body)
        ])

        // 替换老节点
        node.body = newBody
      }
    }
  }
}

const { code } = core.transform(sourceCode, {
  plugins: [
    autoImportLogPlugin,
  ],
})

console.log(code);
// output:
// import _loggerLib from "logger";
// // 四种声明函数的方式
// function sum(a, b) {
//   _loggerLib();
//   return a + b;
// }
// const multiply = function (a, b) {
//   _loggerLib();
//   return a * b;
// };
// const minus = (a, b) => {
//   _loggerLib();
//   return a - b;
// };
// class Calculator {
//   divide(a, b) {
//     _loggerLib();
//     return a / b;
//   }
// }
