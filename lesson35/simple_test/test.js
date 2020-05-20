const assert = require('assert')

const add = (x, y) => {
  return x + y
}
assert.equal(add(4, 5), 0, '4 plus 5 should equal 9')
assert.notEqual(add(4, 5), 6)
