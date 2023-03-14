const core = require('@babel/core');

const sourceCode = `
  var age: number = "12";
`

const TypeAnnotationMap = {
  TSNumberKeyword: 'NumbericLiteral',
}

const tsCheckPlugin = {
  // 遍历前钩子
  pre(file) {
    file.set('errors', [])
  },
  visitor: {
    VariableDeclarator(path, state) {
      const errors = state.file.get('errors');
      const { node } = path;
      // 获取声明的类型
      const idType = TypeAnnotationMap[node.id.typeAnnotation.typeAnnotation.type];
      // 获取真实值的类型
      const initType = node.init.type
      // 比较声明的类型和值的类型是否一致
      if(idType !== initType) {
        errors.push(
          path
            .get('init')
            .buildCodeFrameError(`无法把${initType}类型赋值给${idType}类型`, Error)
        )
      }
    }
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
