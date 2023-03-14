const path = require('path');

module.exports = {
  mode: 'development',
  entry: './webpack-lodash/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve('dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              // 使用自己手写的 import 插件
              [
                path.resolve(__dirname, 'plugins/babel-plugin-import.js'),
                {
                  libraryName: 'lodash',
                }
              ]
            ]
          }
        }
      }
    ]
  }
}

// --- 初始 ---
// import { flatten, concat } from 'lodash'
// asset bundle.js 555 KiB [emitted] (name: main)

// ----- 修改后 ---
// import flatten from 'lodash/flatten'
// import concat from 'lodash/concat'
// asset bundle.js 26.9 KiB [emitted] (name: main)

// --- 增加 babel-plugin-import 后 ---
// asset bundle.js 26.8 KiB [emitted] (name: main)
