class Sandbox {
  name;
  constructor(name, context = {}) {
    this.name = name
    const fakeWindow = Object.create({})

    return new Proxy(fakeWindow, {
      get(target, key) {
        console.log(target, `get`, context)
        // 优先使用共享对象
        if (Object.keys(context).includes(key)) {
          return context[key]
        }
        if (typeof target[key] === 'function' && /^[a-z]/.test(key)) {
          return target[key].bind && target[key].bind(target)
        } else {
          return target[key]
        }
      },
      set(target, key, value) {
        if (Object.keys(context).includes(key)) {
          context[key] = value
        }
        target[key] = value
      },
    })
  }
}

const context = {
  document: window.document,
  globalData: 'abc'
}

const sandbox1 = new Sandbox('app1', context)
const sandbox2 = new Sandbox('app2', context)

sandbox1.test = 1
sandbox2.test = 2
window.test = 3

console.log('sandbox1-> ', sandbox1)
console.log('sandbox2-> ', sandbox2)
console.log('window-> ', window)

sandbox1.globalData = '123'

console.log(sandbox1.globalData)  // 123
console.log(sandbox2.globalData)  // 123
