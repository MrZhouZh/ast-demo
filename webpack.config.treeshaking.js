/**
 * tree-shaking 测试分析
 * refs: https://juejin.cn/post/7002410645316436004
 * 启动 tree shaking 必须满足三个条件
 * - 使用 ESM 规范
 * - optimization.usedExports 为 true, 启动标记功能
 * - 启动代码优化功能
 *  - 配置 mode = production
 *  - 配置 optimization.minimize = true
 *  - 提供 optimization.minimizer 数组
 */
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './tree-shaking/index.js',
  devtool: false,
  module: {
    rules: [
      {
        test: /\.js$/,
      }
    ]
  },
  output: {
    // optimization.usedExports: false
    // filename: '[name].unmarked.js',

    // optimization.usedExports: true
    filename: '[name].js',
    path: path.join(__dirname, './tree-shaking/dist')
  },
  optimization: {
    // 启动标记功能
    usedExports: true,
  }
}
