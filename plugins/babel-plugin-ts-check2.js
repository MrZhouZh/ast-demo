const core = require('@babel/core');

const sourceCode = `
  var age: number;
  age = "12";
`
function transformType(type) {
  switch(type) {
    case 'TSNumberKeyword':
    case 'NumberTypeAnnotation':
      return 'number'
    case 'TSStringKeyword':
    case 'StringTypeAnnotation':
      return 'string';
  }
}

const tsCheckPlugin = {
  // 遍历前钩子
  pre(file) {
    file.set('errors', [])
  },
  visitor: {
    AssignmentExpression(path, state) {
      const errors = state.file.get('errors')
      // 先获取左侧变量的定义
      const variable = path.scope.getBinding(path.get('left'))
      // 获取左侧变量定义的类型
      const variableAnnotation = variable.path.get('id').getTypeAnnotation()
      const variableType = transformType(variableAnnotation.type)
      // 获取右侧的值类型
      const valueType = transformType(
        path.get('right').getTypeAnnotation().type
      )
      // 判断变量的类型和值的类型是否一致
      if(variableType !== valueType) {
        Error.stackTraceLimit = 0
        errors.push(
          path
            .get('init')
            .buildCodeFrameError(
              `无法把${valueType}赋值给${variableType}`,
              Error
            )
        )
      }
    },
  },
  // 遍历后钩子
  post(file) {
    console.log(...file.get('errors'))
  },
}

const { code } = core.transform(sourceCode, {
  parserOpts: {
    plugins: [
      'typescript',
    ]
  },
  plugins: [
    tsCheckPlugin
  ],
})

console.log(code)
// output:
// [Error: 无法把string赋值给number]
// var age: number;
// age = "12";
