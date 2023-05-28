// 修改全局对象 window 方法
const setWindowProp = (prop, value, isDel) => {
  if (value === undefined || isDel) {
    delete window[prop]
  } else {
    window[prop] = value
  }
}

class SandboxWindow {
  name
  proxy = null

  // 沙箱新增全局变量
  addedPropsMap = new Map()

  // 沙箱更新全局变量
  modifiedPropsOriginalValueMap = new Map()

  // 持续记录更新的(新增和修改的)全局变量的 map, 用于在任意时刻做沙箱激活
  currentUpdatedPropsValueMap = new Map()

  // 沙箱被激活钩子
  active() {
    // 根据之前修改的记录重新修改 window 属性, 还原沙箱之前的状态
    this.currentUpdatedPropsValueMap.forEach((v, p) => setWindowProp(p, v))
  }

  // 沙箱被卸载
  inactive() {
    // 将沙箱期间修改的属性还原为原先的属性
    this.modifiedPropsOriginalValueMap.forEach((v, p) => setWindowProp(p, v))
    // 将沙箱期间新增的全局变量消除
    this.addedPropsMap.forEach((_, p) => setWindowProp(p, undefined, true))
  }

  constructor(name) {
    this.name = name
    const fakeWindow = Object.create(null)
    const { addedPropsMap, modifiedPropsOriginalValueMap, currentUpdatedPropsValueMap } = this
    const proxy = new Proxy(fakeWindow, {
      get(target, prop) {
        return window[prop]
      },
      set(_, prop, value) {
        if (!window.hasOwnProperty(prop)) {
          // 如果 window 上没有的属性, 则记录到新增属性里
          addedPropsMap.set(prop, value)
        } else if (!modifiedPropsOriginalValueMap.has(prop)) {
          // 如果当前 window 对象有该属性, 且为更新过, 则记录该属性在 window 上的初始值
          const originalValue = window[prop]
          modifiedPropsOriginalValueMap.set(prop, originalValue)
        }

        // 记录修改属性以及修改后的值
        currentUpdatedPropsValueMap.set(prop, value)

        // 设置值到全局 window 上
        setWindowProp(prop, value)
        console.log(`window.prop`, window[prop])

        return true
      }
    })

    this.proxy = proxy
  }
}

const sandboxInstance = new SandboxWindow('app')
const proxyWindow = sandboxInstance.proxy
proxyWindow.testa = 1
console.log(window.testa, proxyWindow.testa)  // 1 1

sandboxInstance.inactive()
console.log(window.testa, proxyWindow.testa)  // undefined undefined

sandboxInstance.active()
console.log(window.testa, proxyWindow.testa)  // 1 1


