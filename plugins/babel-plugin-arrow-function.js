const core = require('@babel/core');
const types = require('@babel/types');

// ------------ name plugin ----------
const namePlugin = {
  visitor: {
    Identifier(path) {
      const { node } = path
      if (node.name === 'sum') {
        node.name = 'add'
      }
    }
  }
}

// --------- arrow function plugin ----------
function hoistFunctionEnvironment(path) {
  // 先确定当前剪头函数要使用哪个地方的 this
  const thisEnv = path.findParent(parent => {
    // 父节点是函数且不是箭头函数, 找不到就返回根节点
    return (
      (parent.isFunction() && !parent.isArrowFunctionExpression()) ||
      parent.isProgram()
    )
  })

  // 向父作用域内放入 _this 变量
  thisEnv.scope.push({
    // 标识符节点
    id: types.identifier('_this'),
    // this 节点
    init: types.thisExpression(),
  })

  // 获取当前节点 this 的路径
  let thisPaths = []
  // 遍历当前节点的子节点
  path.traverse({
    ThisExpression(thisPath) {
      thisPaths.push(thisPath)
    }
  })

  // 替换
  thisPaths.forEach(thisPath => {
    // this => _this
    thisPath.replaceWith(types.identifier('_this'))
  })
}

const arrowFunctionPlugin = {
  visitor: {
    ArrowFunctionExpression(path) {
      let { node } = path
      // 提升函数环境, 解决 this 作用域问题
      hoistFunctionEnvironment(path)

      node.type = 'FunctionExpression'

      // 判断函数体是否是块语句
      if(!types.isBlockStatement(node.body)) {
        // 生成一个块语句, 并 return 内容
        node.body = types.blockStatement([types.returnStatement(node.body)])
      }
    }
  }
}

const sourceCode = `
const sum = (a, b) => {
  console.log(this);
  return a + b;
};`

const { code } = core.transform(sourceCode, {
  plugins: [
    namePlugin,
    arrowFunctionPlugin,
  ],
})

console.log(code);
// output:
// var _this = this;
// const add = function (a, b) {
//   console.log(_this);
//   return a + b;
// };
