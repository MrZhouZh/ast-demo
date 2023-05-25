const { MyRequire } = require('../../myModule.js');

MyRequire('./a.js');

// output:
// running b.js
// a val undefined
// setA to aa
// /ast-demo/commonjs-requirejs/examples/02/b.js:9
// setA('aa');
// ^

// TypeError: setA is not a function
//   at Object.<anonymous>(/ast-demo/commonjs-requirejs/examples/02/b.js:9:1)
//   at xxx
