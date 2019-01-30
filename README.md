# Store complex objects in Bitcoin Script
This libraray allows you to store nested/hierarchical graphs of objects into Bitcoin Script which you can then store in Bitcoin. Later you can retrieve the object graph with fidelity.

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

Methods are `scriptify` and `unscriptify`
```
script = nestedpushdata.scriptify(json)
json = nestedpushdata.unscriptify(script)
```
## Installation
Clone and install.
```
git clone https://github.com/dfoderick/pushdropjson
cd pushdropjson
npm install
node index.js
```