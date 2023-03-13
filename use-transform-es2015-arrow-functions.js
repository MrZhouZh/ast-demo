const core = require('@babel/core')
const arrowFunctionPlugin = require('babel-plugin-transform-es2015-arrow-functions');

const sourceCode = `
const sum = (a, b) => {
  console.log(this)
  return a + b;
}`

const { code } = core.transform(sourceCode, {
  plugins: [arrowFunctionPlugin],
})

console.log(code);
