const bsv = require('bsv')
const Stack = require('./stack')
//possible delimiters. Still experimenting
const Delimiter_drop = new bsv.Opcode('OP_DROP')
const Delimiter_reserved = new bsv.Opcode('OP_RESERVED') 
const Delimiter_0 = new bsv.Opcode('OP_0')
const Delimiter = Delimiter_0

//build script from json object
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
        s.add(Delimiter)
    }
    else {
        s.add(new Buffer(k)).add(Delimiter).add(new Buffer(v)).add(Delimiter)
    }
}

//pull json object out of script
function unscriptify(s) {
    const stack = new Stack()
    let isreadingkey = true
    let issamelevel = false
    for (i = 0; i < s.chunks.length; i++)
    {
        let item = s.chunks[i]
        let next = s.chunks[i+1]
        if (isreadingkey) {
            if (isDelimiter(item)) {
                stack.pop()
            } else {
                stack.currentkey = item.buf.toString()
                if (!issamelevel && !isDelimiter(item)) {
                    stack.newLevel()
                }
                else {
                    stack.set(null)
                }
                isreadingkey = !isDelimiter(next)
                //TODO: assert next item is delimiter
                if (!isreadingkey) {
                    i++
                }
            }
        } else {
            if (issamelevel || isDelimiter(next)) {
                stack.set(item.buf.toString())
                isreadingkey = isDelimiter(next)
                issamelevel = isDelimiter(next)
            }
            else {
                stack.newLevel()
            }
            i++
        }
        //console.log(stack.stack)
    }
    if (stack.stack.length > 1) {
        throw "Stack should only have one item after unscriptify"
    }
    return stack.top()
}

function isDelimiter(item) {
    return item.opcodenum === Delimiter.toNumber()
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
