## webpack tree-shaking

`tree-shaking` 是一个用来描述移除 JavaScript 上下文中的未引用代码(dead-code)的术语.

在 Webpack 中, 启动 tree shaking 必须满足以下三个条件:

1. 使用 ESM 规范
2. `optimization.usedExports` 为 `true`, 启动标记功能
3. 启动代码优化功能
  - 配置 `mode = production`
  - 配置 `optimization.minimize = true`
  - 提供 `optimization.minimizer` 数组

详情点击[配置文件](../webpack.config.treeshaking.js)查看.

在使用的途中, 也需要注意以下几点:

- 不必要(无意义)的赋值操作
  
  这种情况下的 `Tree Shaking` 会失败, 浅显原因是 `Webpack` 的 `Tree Shaking` 逻辑停留在代码静态分析层面
    
    - 模块导出变量是否被其它模块引用
    - 引用模块的主体代码中有没有出现这个变量

  深层原因是 `JavaScript` 的赋值语句并不纯，视具体场景有可能产生意料之外的副作用


### 实现原理

可分为三步:

> Make -> Seal -> Assets

1. `Make`: 收集模块导出变量并记录到模块依赖关系图 `ModuleGraph` 变量中

2. `Seal`: 遍历 `ModuleGraph` 标记模块导出变量有没有被使用

3. `Assets`: 生成产物时，若变量没有被其它模块使用则删除对应的导出语句

> **注意**: 标记需要配置 `optimization.usedExports = true`. 打包后查看 [main.js 第11行至14行](./dist/main.js) 对比 [main.unmarked.js第12行至15行](./dist/main.unmarked.js)

### 参考资料

- [Webpack - tree shaking](https://webpack.js.org/guides/tree-shaking/#root)
- [Webpack 原理系列九：Tree-Shaking 实现原理](https://juejin.cn/post/7002410645316436004)
- [一文吃透Webpack核心原理](https://mp.weixin.qq.com/s/SbJNbSVzSPSKBe2YStn2Zw)
