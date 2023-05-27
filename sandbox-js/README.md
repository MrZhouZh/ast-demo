# 微前端沙箱实现

[微前端 JS 沙箱实现机制](https://zqianduan.com/pages/micro-app-sandbox.html)

[实现 JavaScript 沙箱的几种方式](https://learnku.com/articles/59591)


## SES 提案中

> https://www.npmjs.com/package/ses

```html
<script src="https://unpkg.com/ses" charset="utf-8"></script>
<script>
  const c = new Compartment();
  const code = `
  (function () {
    const arr = [1, 2, 3, 4];
    return arr.filter(x => x > 2);
  })
  `;
  const fn = c.evaluate(code);
  console.log(arr); // ReferenceError: arr is not defined
  console.log(fn()); // [3, 4]
</script>
```

