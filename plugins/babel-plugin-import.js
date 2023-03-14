const core = require('@babel/core');
const types = require('@babel/types');

const visitor = {
  ImportDeclaration(path, state) {
    // 获取配置选项中的库的名称
    const { libraryName, libraryDirectory = 'lib' } = state.opts

    const { node } = path
    // 获取批量导入声明数组
    const { specifiers } = node
    // 如果当前的节点模块名称是我们需要的库名称, 并且导入不是默认导入
    if(
      node.source.value === libraryName &&
      !types.isImportDefaultSpecifier(specifiers[0])
    ) {
      //
    }
  }
}

module.exports = function() {
  return {
    visitor,
  }
}
