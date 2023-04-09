export const bar = 'bar'
// export const foo = 'foo'

const foo = (args) => {
  console.log(bar + args)
}

foo('be retained')
// Webpack development 模式下添加 optimization.minimize = true, 这条将不会出现在打包产物中
/* #__PURE__ */foo('be removed')
