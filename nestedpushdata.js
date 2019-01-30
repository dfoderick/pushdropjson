const bsv = require('bsv')

function scriptify(jsonDict) {
    const s = new bsv.Script()
    Object.keys(jsonDict).forEach(key => { push(s, key, jsonDict[key]) })
    return s
}

function push(s, k, v) {
    if( v !== null && typeof v == "object" ) {
        s.add(new Buffer(k))
        Object.entries(v).forEach(([key, value]) => {
            push(s, key, value)
        })
        s.add("OP_DROP")
    }
    else {
        s.add(new Buffer(k)).add("OP_DROP").add(new Buffer(v)).add("OP_DROP")  
    }
}

function unscriptify(s) {
    let isreadingkey = true
    let objectstack = {currentkey: null, stack: []}
    let issamelevel = false
    for (i = 0; i < s.chunks.length; i++)
    {
        let item = s.chunks[i]
        let next = s.chunks[i+1]
        if (isreadingkey) {
            if (isDrop(item)) {
                objectstack.stack.pop()
            } else {
                objectstack.currentkey = item.buf.toString()
                if (!issamelevel && !isDrop(item))
                {
                    newobj(objectstack)
                }
                else {
                    top(objectstack)[objectstack.currentkey] = null
                }
                isreadingkey = !isDrop(next)
                //TODO: assert next item is drop
                if (!isreadingkey) {
                    i++
                }
            }
        } else {
            if (issamelevel || isDrop(next))
            {
                top(objectstack)[objectstack.currentkey] = item.buf.toString()
                isreadingkey = isDrop(next)
                issamelevel = isDrop(next)
            }
            else {
                newobj(objectstack)
            }
            i++
        }
        //console.log(objectstack)
    }
    //TODO:assert only one item on stack
    //console.log(JSON.stringify(objectstack))
    return objectstack.stack[0]
}

function top(objectstack) {
    if (!objectstack.stack.length) return null
    return objectstack.stack.slice(-1)[0] 
}

function newobj(objectstack) {
    const t = top(objectstack)
    const newone = {}
    newone[objectstack.currentkey] = null
    if (t) {
        last = Object.keys(t)[Object.keys(t).length-1];
        t[last] = newone
    }
    objectstack.stack.push(newone)
}

function isDrop(item) {
    return item.opcodenum === 117
}

module.exports = {scriptify, unscriptify};
