const bs = require('bitcoinsource')

function push(s, k, v) {

    if( v !== null && typeof v == "object" ) {
        s.add(new Buffer(k)).add("OP_DROP")
        Object.entries(v).forEach(([key, value]) => {
            push(s, key, value)
        })
    }
    else {
        s.add(new Buffer(k)).add("OP_DROP").add(new Buffer(v)).add("OP_DROP")  
    }
}

//const d = {a:{b:{c:"d",e:"f"}}}

const d = {a:{b:"c"}}

const s = new bs.Script()
s.add("OP_RETURN")

Object.keys(d).forEach(key => 
    {
        push(s, key, d[key])
    })

console.log(s)
//console.log(s.getData())
