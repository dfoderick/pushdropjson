const bsv = require('bsv')
const Stack = require('./stack')
//possible delimiters. Still experimenting
// const Delimiter_drop = new bsv.Opcode('OP_DROP')
// const Delimiter_reserved = new bsv.Opcode('OP_RESERVED') 
// const Delimiter_0 = new bsv.Opcode('OP_0')
// const Delimiter = Delimiter_drop

//build script from json object
function scriptify(jsonDict, delimiter = new bsv.Opcode('OP_0')) {
    const s = new bsv.Script()
    Object.keys(jsonDict).forEach(key => { push(s, key, jsonDict[key], delimiter) })
    return s
}

function push(s, k, v, delimiter) {
    if( v !== null && typeof v == "object" ) {
        s.add(new Buffer(k))
        Object.entries(v).forEach(([key, value]) => {
            push(s, key, value, delimiter)
        })
        s.add(delimiter)
    }
    else {
        //console.log(`${k}:${v} ${typeof v}`)
        s.add(getPushValue(k)).add(delimiter).add(getPushValue(v)).add(delimiter)
    }
}

function getPushValue(val) {
    if (typeof val === "number") {
        return val
    }
    return new Buffer(val)
}

//pull json object out of script
function unscriptify(s, delimiter = new bsv.Opcode('OP_0')) {
    const stack = new Stack()
    let isreadingkey = true
    let issamelevel = false
    for (i = 0; i < s.chunks.length; i++)
    {
        let item = s.chunks[i]
        let next = s.chunks[i+1]
        if (isreadingkey) {
            if (isDelimiter(item, delimiter)) {
                stack.pop()
            } else {
                stack.currentkey = getValue(item)
                if (!issamelevel && !isDelimiter(item, delimiter)) {
                    stack.newLevel()
                }
                else {
                    stack.set(null)
                }
                isreadingkey = !isDelimiter(next, delimiter)
                //TODO: assert next item is delimiter
                if (!isreadingkey) {
                    i++
                }
            }
        } else {
            if (issamelevel || isDelimiter(next, delimiter)) {
                //console.log(item)
                stack.set(getValue(item))
                isreadingkey = isDelimiter(next, delimiter)
                issamelevel = isDelimiter(next, delimiter)
            }
            else {
                stack.newLevel()
            }
            i++
        }
    }
    if (stack.stack.length > 1) {
        throw "Stack should only have one item after unscriptify"
    }
    return stack.top()
}

function getValue(item) {
    if (item.buf) {
        return item.buf.toString()
    }
    return item.opcodenum
}

function isDelimiter(item, delimiter) {
    return item.opcodenum === delimiter.toNumber()
}

//add op_return to script if it needs it
//assumption is script contains data only and user wants it compatible with op_Return
function putData(s) {
    if (!s.isDataOut()) {
        const opReturnWithData = new bsv.Script().add("OP_RETURN")
        s.chunks.map(chunk => opReturnWithData.add(chunk))
        return opReturnWithData
    }
    return s
}

module.exports = {scriptify, unscriptify, putData}
