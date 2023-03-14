---
title: AST(抽象语法树)
date: 2023-03-13
category: JavaScript
---

## AST(抽象语法树)

> 来源: [https://juejin.cn/post/7155151377013047304](https://juejin.cn/post/7155151377013047304)

一个完整的编译器整体流程分为以下三个步骤:

1. **Parsing(解析过程)**: 这个过程经 `词法分析`, `语法分析`, `构建AST(抽象语法树)` 一系列操作
2. **Transformation(转化过程)**: 这个过程将上一步解析结果按照编译器指定的规则进行处理, 形成一个新的表现形式
3. **Code Generation(代码生成)**: 将上一步处理好的内容按照自己的需求转化为新的代码

如下图所示:

![compiler](./public/images/compiler.jpg)

### Progressing

- [入门尝鲜](./simple.js)
- [原版使用babel-plugin-transform-es2015-arrow-functions](./use-transform-es2015-arrow-functions.js)
- [实现简易版babel-plugin-transform-es2015-arrow-functions](./babel-plugin-arrow-function.js)
- [实现自定义console.log 信息插件](./babel-plugin-console.js)
