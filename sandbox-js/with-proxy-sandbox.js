function compileCode(code) {
  code = `with (sandbox) { ${code} }`;
  const fn = new Function('sandbox', code);
  return (sandbox) => {
    const proxy = new Proxy(sandbox, {
      // 拦截所有属性，防止到 Proxy 对象以外的作用域链查找。
      has(target, key) {
        return true;
      },
      get(target, key, receiver) {
        // 加固，防止逃逸
        if (key === Symbol.unscopables) {
          return undefined;
        }
        return Reflect.get(target, key, receiver);
      },
    });
    return fn(proxy);
  };
}
