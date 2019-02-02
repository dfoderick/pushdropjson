const assert = require('assert')
const bsv = require('bsv')
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
      it('isDataOut', function() {
        const script = new bsv.Script()
        script.add("OP_RETURN").add("OP_1").add("OP_0")
        assert.equal(script.isDataOut(), true)
      })
      it('script is data out', function() {
        // cant use op_drop delimiter
        const simpleJson = {a:"b"}
        const simpleScript = nestedpushdata.putData(nestedpushdata.scriptify(simpleJson))
        console.log(simpleScript)
        assert.equal(simpleScript.isDataOut(), true)
      })
      it('numbers supported', function() {
        const j = {a: '9', 'b': 9}
        const s = nestedpushdata.scriptify(j, new bsv.Opcode('OP_DROP'))
        console.log(s)
        const r = nestedpushdata.unscriptify(s, new bsv.Opcode('OP_DROP'))
        assert.equal(r.a, '9')
        //numbers are supported
        assert.equal(r.b, 9)
      })
      })
})