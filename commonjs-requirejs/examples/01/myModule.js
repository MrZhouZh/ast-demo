const path = require('path');
const vm = require('vm');
const fs = require('fs');

function MyModule(id = '') {
  this.id = id
  this.exports = {}
  this.loaded = false
}

MyModule._cache = {}
MyModule._extensions = {}

MyModule.wrapper = [
  `(function (myExports, myRequire, myModule, __filename, __dirname) {`,
  `\n});`
]

MyModule.wrap = function(script) {
  return MyModule.wrapper[0] + script + MyModule.wrapper[1]
}

MyModule.prototype.require = function(id) {
  return MyModule._load(id)
}

MyModule._load = function(request) {  // request 传入的路径
  const filename = MyModule._resolveFilename(request)

  // 检查缓存, 如果缓存存在且已加载, 直接返回缓存
  const cachedModule = MyModule._cache[filename]
  if (cachedModule) {
    return cachedModule.exports
  }

  // 如果缓存不存在, 则加载这个模块
  const module = new MyModule(filename)

  console.log(module)

  MyModule._cache[filename] = module

  module.load(filename)

  return module.exports
}

MyModule._resolveFilename = function(request) {
  return path.resolve(request)
}

MyModule.prototype.load = function(filename) {
  const extname = path.extname(filename)
  
  console.log(`extname: ${extname}`);

  MyModule._extensions[extname](this, filename)

  this.loaded = true
}

MyModule._extensions['.js'] = function(module, filename) {
  const content = fs.readFileSync(filename, 'utf8')
  module._compile(content, filename)
}

MyModule.prototype._compile = function(content, filename) {
  const self = this

  const wrapper = MyModule.wrap(content)

  console.log('_compile->>', wrapper)

  const compiledWrapper = vm.runInThisContext(wrapper, { filename })
  const dirname = path.dirname(filename)

  const args = [self.exports, self.require, self, filename, dirname]

  return compiledWrapper.apply(self.exports, args)
}

const myModuleInstance = new MyModule()
const MyRequire = (id) => {
  return myModuleInstance.require(id)
}

module.exports = {
  MyModule,
  MyRequire,
}
