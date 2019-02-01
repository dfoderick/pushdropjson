const nestedpushdata = require('./src/nestedpushdata')

// const simpleArray = ["a","b"]
// console.log(simpleArray)
// const simpleScript = nestedpushdata.scriptify(simpleArray)
// console.log(simpleScript)
// const retrievedSimple = nestedpushdata.unscriptify(simpleScript)
// console.log(retrievedSimple)

const complexArray = ["a",["b",["c","d","e","f"]]]
console.log(complexArray)
const complexScript = nestedpushdata.scriptify(complexArray)
console.log(complexScript)
const retrievedComplex = nestedpushdata.unscriptify(complexScript)
console.log(retrievedComplex)

// const simpleJson = {a:"b"}
// console.log(simpleJson)
// const simpleScript = nestedpushdata.scriptify(simpleJson)
// console.log(simpleScript)
// const retrievedSimple = nestedpushdata.unscriptify(simpleScript)
// console.log(retrievedSimple)

// const complexJson = {a:{b:{c:"d",e:"f"}}}
// console.log(complexJson)
// const complexScript = nestedpushdata.scriptify(complexJson)
// console.log(complexScript)
// const retrievedComplex = nestedpushdata.unscriptify(complexScript)
// console.log(retrievedComplex)
