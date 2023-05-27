const path = require('node:path')
const fs = require('node:fs')
const vm = require('node:vm')

function test(request) {
  const filename = path.resolve(request)
  const extname = path.extname(filename)
  const content = fs.readFileSync(filename, 'utf8')
  const x = 1
  const context = { x: 2 }
  vm.createContext(context)
  const code = `x += 40; var y = 17;`
  vm.runInContext(code, context)
  console.log(context.x, context.y) // 42 17
  console.log(`x: ${x}`)  // 1
  const script = new vm.Script(`
  function add(a, b) {
    return a + b;
  }

  const r = add(1, 2);
  console.log("r: " + r);
  `)
  const cacheWithoutAdd = script.createCachedData();
  console.log(cacheWithoutAdd);
  script.runInThisContext()
  const cacheWithAdd = script.createCachedData()
  console.log(cacheWithAdd);

  const context2 = {
    animal: 'cat',
    count: 2,
  };
  const script2 = new vm.Script('count += 1; name = "kitty";');
  vm.createContext(context2);
  for (let i = 0; i < 10; ++i) {
    script2.runInContext(context2);
  }
  console.log(context2);
  console.log('---vm context end---')
  console.log(`filename-> ${filename}`)
  console.log(`extname-> ${extname}`)
  // console.log(`content-> ${content}`)
}

test('./myModule.js')
