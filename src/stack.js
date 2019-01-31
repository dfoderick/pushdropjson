//A specialized stack

class Stack {

    constructor() {
        this.currentkey = null
        this.stack = []
    }

    set(val) {
        // console.log(`${this.currentkey} = ${val}`)
        const t = this.top()
        if (t) {
            t[this.currentkey] = val
        }
    }

    pop() {
        return this.stack.pop()
    }

    top() {
        if (!this.stack.length) return null
        return this.stack.slice(-1)[0] 
    }

    newLevel() {
        const t = this.top()
        const newone = {}
        newone[this.currentkey] = null
        if (t) {
            let last = Object.keys(t)[Object.keys(t).length-1]
            t[last] = newone
        }
        this.stack.push(newone)
    }

}

module.exports = Stack