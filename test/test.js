const assert = require('assert')
const nestedpushdata = require('../src/nestedpushdata')
const Stack = require('../src/stack')

describe('pushdropjson', function() {
    describe('#stack', function() {
        it('stack can add object', function() {
            const stack = new Stack()
          stack.newLevel()
          assert.equal(stack.stack.length, 1)
        })
        it('stack keeps current key', function() {
            const stack = new Stack()
            stack.currentkey = "a"
            assert.equal(stack.currentkey, "a")
        })
  
    })
    describe('#stringify', function() {
    it('simple flat json can be retrieved', function() {
      const simpleJson = {a:"b"}
      const simpleScript = nestedpushdata.scriptify(simpleJson)
      const retrievedSimple = nestedpushdata.unscriptify(simpleScript)
      assert.equal(retrievedSimple.a, "b")
    })
    it('complex json can be retrieved', function() {
        const json = {a:{b:{c:"d",e:"f"}}}
        const script = nestedpushdata.scriptify(json)
        const retrieved = nestedpushdata.unscriptify(script)
        assert.equal(retrieved.a.b.c, "d")
        assert.equal(retrieved.a.b.e, "f")
      })
    })
})