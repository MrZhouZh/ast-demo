const core = require('@babel/core');
const types = require('@babel/types');

const visitor = {
  ImportDeclaration(path, state) {
    // 获取配置选项中的库的名称
    const { libraryName, libraryDirectory = 'lib' } = state.opts
  }
}

module.exports = function() {
  return {
    visitor,
  }
}
