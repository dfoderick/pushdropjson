# Store complex objects in Bitcoin Script
This libraray allows you to serialize nested/hierarchical graphs of objects into Bitcoin Script which you can then store in Bitcoin. Later you can retrieve the object graph with fidelity.

# Why use OP_DROP?
In the future, some of the data that would currently be put into OP_RETURN will instead be put into script embedded into a transaction output that is spendable. In that scenario, miners will execute the "data" in the output script and every push onto the stack should be popped.

## !Important Note!
There are many limitations to this approach right now, mostly because of core code requiring Standard scripts (isStandard). Once non-standard script are allowed then storing hierarchical data in script will have more merit.

Basically, restrictions to [NULLDATA](https://bitcoin.org/en/glossary/null-data-transaction) mean that only pushdata can be put in OP_RETURN. Therefore, OP_DROP will not work as a delimiter.

Therefore, this approach is currently useful for P2SH redeem script.

Simple data types (strings and small integers) are supported.

## Example Script
This is your json object.
```
{ a: { 
        b: { 
            c: 'd', 
            e: 'f' 
        } 
    } 
}
```
This is how the Bitcoin Script looks like that stores the json.
```
<Script: 1 0x61 1 0x62 1 0x63 OP_DROP 1 0x64 OP_DROP 1 0x65 OP_DROP 1 0x66 OP_DROP OP_DROP OP_DROP>
```
Same Script but formatted to show how the BitCoin structure matches the object scructure.
```
PushData1 'a'
    PushData1 'b' 
        PushData1 'c' OP_DROP PushData1 'd' OP_DROP 
        PushData1 'e' OP_DROP PushData1 'e' OP_DROP 
    OP_DROP 
OP_DROP
```
## Example Code
The code for the above example looks like this.
```
const complexJson = {a:{b:{c:"d",e:"f"}}}
const complexScript = nestedpushdata.scriptify(complexJson)
const retrievedComplex = nestedpushdata.unscriptify(complexScript)
```

Methods are `scriptify`, `unscriptify` and `putData` 
```
script = nestedpushdata.scriptify(json)
json = nestedpushdata.unscriptify(script)

scriptWithReturn = nestedpushdata.putData(script)
```
## Installation
Clone and install.
```
git clone https://github.com/dfoderick/pushdropjson
cd pushdropjson
npm install
node index.js
```