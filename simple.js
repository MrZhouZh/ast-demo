const parser = require('@babel/parser');
const traverse = require('@babel/traverse')
const generator = require('@babel/generator')

const sourceCode = `
const hello = () => {}
`

function compile(code) {
  const ast = parser.parse(code)

  const visitor = {
    Identifier(path) {
      const { node } = path
      if (node.name === 'hello') {
        node.name = 'world'
      }
    }
  }

  traverse.default(ast, visitor)

  return generator.default(ast, {}, code)
}

const { code } = compile(sourceCode)
console.log(code);
