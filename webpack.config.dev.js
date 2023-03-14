const path = require('path');

module.exports = {
  mode: 'development',
  entry: './webpack-lodash/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve('dist'),
  },
  module: {
    // rules: [
    //   {
    //     test: /\.js$/,
    //     use: {
    //       loader: 'babel-loader',
    //       options: {
    //         plugins: [
    //           // 使用自己手写的 import 插件
    //           [
    //             path.resolve(__dirname, 'babel-plugin-import.js'),
    //             {
    //               libraryName: 'lodash',
    //             }
    //           ]
    //         ]
    //       }
    //     }
    //   }
    // ]
  }
}

// asset bundle.js 555 KiB [emitted] (name: main)
