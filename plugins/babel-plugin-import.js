const core = require('@babel/core');
const types = require('@babel/types');

const visitor = {
  ImportDeclaration(path, state) {
    // 获取配置选项中的库的名称
    const { libraryName, libraryDirectory } = state.opts

    const { node } = path
    // 获取批量导入声明数组
    const { specifiers } = node
    // 如果当前的节点模块名称是我们需要的库名称, 并且导入不是默认导入
    if(
      node.source.value === libraryName &&
      !types.isImportDefaultSpecifier(specifiers[0])
    ) {
      // 便来批量导入声明数组
      const declarations = specifiers.map(specifier => {
        return types.importDeclaration(
          // 导入声明 importDeclaration flatten
          [types.importDefaultSpecifier(specifier.local)],
          // 导入模块 source lodash/flatten
          types.stringLiteral(
            libraryDirectory
              ? `${libraryName}/${libraryDirectory}/${specifier.imported.name}`
              : `${libraryName}/${specifier.imported.name}`
          )
        )
      })
      // 替换当前节点
      path.replaceWithMultiple(declarations)
    }
  }
}

module.exports = function() {
  return {
    visitor,
  }
}
