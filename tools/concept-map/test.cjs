// Pure data-boundary tests; browser interaction is evaluated separately.
const assert = require('node:assert/strict');
const {validateGraph} = require('./app.js');
const valid = {version:1,nodes:[{id:'a',title:'A',note:'literal <img src=x onerror=alert(1)>',source:'synthetic',x:0,y:0}],edges:[]};
assert.equal(validateGraph(valid).nodes[0].note, valid.nodes[0].note);
for(const change of [g=>g.nodes.push({...g.nodes[0]}),g=>g.nodes[0].x=Infinity,g=>g.nodes[0].title=' ',g=>g.edges.push({from:'a',to:'missing',label:'x'}),g=>g.edges.push({from:'a',to:'a',label:'x'}),g=>g.nodes=Array.from({length:101},(_,i)=>({...g.nodes[0],id:String(i)}))]) {
  const candidate=JSON.parse(JSON.stringify(valid));change(candidate);assert.throws(()=>validateGraph(candidate));
}
const unknown=JSON.parse(JSON.stringify(valid));unknown.nodes[0].privateField='not retained';
assert.equal(validateGraph(unknown).nodes[0].privateField,undefined);
console.log('8 graph validation cases passed.');
