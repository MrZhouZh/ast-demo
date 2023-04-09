/**
 * tree-shaking 测试分析
 */
const path = require('path');

module.exports = {
  // mode: 'development',
  mode: process.env.NODE_ENV,
  // entry: './tree-shaking/index.js',
  entry: './tree-shaking/unnecessary.js',
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
    // path: path.join(__dirname, './tree-shaking/dist'),
    // unnecessary assign value
    path: path.join(__dirname, './tree-shaking/unnecessary-dist'),
  },
  optimization: {
    // 启动标记功能
    usedExports: true,
    // 启用 TerserPlugin, 或者命令接口使用 --optimize-minimize 标记
    minimize: true,
  }
}
