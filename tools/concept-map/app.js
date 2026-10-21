'use strict';
// Text is inserted with textContent; imported strings are never interpreted as HTML.
function validateGraph(value) {
  if (!value || value.version !== 1 || !Array.isArray(value.nodes) || !Array.isArray(value.edges)
      || value.nodes.length < 1 || value.nodes.length > 100 || value.edges.length > 250) throw Error('Invalid graph size or version');
  const ids = new Set();
  function text(v, limit) { if (typeof v !== 'string' || v.length > limit) throw Error('Invalid text'); return v; }
  const nodes = value.nodes.map(n => {
    if (!n || typeof n !== 'object') throw Error('Invalid node');
    const id = text(n.id, 80);
    if (!id || ids.has(id)) throw Error('Duplicate or empty node ID'); ids.add(id);
    if (!Number.isFinite(n.x) || !Number.isFinite(n.y) || n.x < 0 || n.x > 2160 || n.y < 0 || n.y > 1440) throw Error('Position outside canvas');
    const title = text(n.title, 120); if (!title.trim()) throw Error('Title is required');
    return {id, title, note:text(n.note, 2000), source:text(n.source, 300), x:n.x, y:n.y};
  });
  const pairs = new Set();
  const edges = value.edges.map(e => {
    if (!e || !ids.has(e.from) || !ids.has(e.to) || e.from === e.to) throw Error('Invalid edge');
    const key = JSON.stringify([e.from, e.to]); if (pairs.has(key)) throw Error('Duplicate edge'); pairs.add(key);
    return {from:e.from, to:e.to, label:text(e.label, 120)};
  });
  return {version:1, nodes, edges};
}
if (typeof module !== 'undefined') module.exports = {validateGraph};
if (typeof document !== 'undefined') (() => {
  const $ = id => document.getElementById(id);
  let graph = validateGraph({version:1,nodes:[
    {id:'start',title:'比例 / Ratio',note:'虚构样本：3 个蓝色、2 个白色计数片。',source:'synthetic-source.md · Ratios',x:60,y:70},
    {id:'whole',title:'整体 / Whole',note:'总数 3 + 2 = 5。先定义整体，再计算部分所占比例。',source:'synthetic-source.md · Ratios',x:400,y:70},
    {id:'fraction',title:'分数 / Fraction',note:'蓝色占 3/5；白色占 2/5。',source:'synthetic-source.md · Ratios',x:400,y:330},
    {id:'percent',title:'百分数 / Percentage',note:'3/5 × 100% = 60%。用反向计算核验：5 × 60% = 3。',source:'synthetic-source.md · Percentages; reverse check derived',x:740,y:330}
  ],edges:[{from:'start',to:'whole',label:'确定分母 / denominator'},{from:'whole',to:'fraction',label:'部分 ÷ 整体'},{from:'fraction',to:'percent',label:'乘以 100%'}]});
  let selected = graph.nodes[0].id, history = [], drag = null;
  const status = message => { $('status').textContent = message; };
  function remember() { history.push(JSON.stringify(graph)); if (history.length > 40) history.shift(); $('undo').disabled = false; }
  function lines() {
    const svg = $('edges'); svg.replaceChildren();
    const ns = 'http://www.w3.org/2000/svg';
    for (const edge of graph.edges) {
      const a=graph.nodes.find(n=>n.id===edge.from), b=graph.nodes.find(n=>n.id===edge.to);
      const x1=a.x+110,y1=a.y+60,x2=b.x+110,y2=b.y+60;
      const path=document.createElementNS(ns,'path'); path.setAttribute('d',`M${x1} ${y1} L${x2} ${y2}`); svg.append(path);
      const label=document.createElementNS(ns,'text'); label.setAttribute('x',(x1+x2)/2);label.setAttribute('y',(y1+y2)/2-9);label.setAttribute('text-anchor','middle');label.textContent=edge.label;svg.append(label);
    }
  }
  function choose(id) {
    selected=id; const node=graph.nodes.find(n=>n.id===id);
    for(const button of $('nodes').children) button.setAttribute('aria-pressed',String(button.dataset.id===id));
    $('title').value=node.title;$('note').value=node.note;$('source').value=node.source;
    const parent=$('parent');parent.replaceChildren();
    const option=document.createElement('option');option.value='';option.textContent='无 / None';parent.append(option);
    for(const candidate of graph.nodes.filter(n=>n.id!==id)) {const o=document.createElement('option');o.value=candidate.id;o.textContent=candidate.title;parent.append(o);}
    const incoming=graph.edges.find(e=>e.to===id);parent.value=incoming?incoming.from:'';$('relation').value=incoming?incoming.label:'';
    $('remove').disabled=graph.nodes.length===1;
  }
  function render(focus=false) {
    $('nodes').replaceChildren();
    for(const node of graph.nodes) {
      const button=document.createElement('button');button.className='node';button.dataset.id=node.id;button.style.left=node.x+'px';button.style.top=node.y+'px';
      for(const [tag,value] of [['strong',node.title],['span',node.note],['small',node.source]]) {const part=document.createElement(tag);part.textContent=value;button.append(part);}
      button.addEventListener('click',()=>choose(node.id));
      button.addEventListener('pointerdown',event=>{if(event.button!==0)return;choose(node.id);remember();drag={id:node.id,x:event.clientX,y:event.clientY,startX:node.x,startY:node.y,pointer:event.pointerId};$('board').setPointerCapture(event.pointerId);});
      button.addEventListener('keydown',event=>{const moves={ArrowLeft:[-10,0],ArrowRight:[10,0],ArrowUp:[0,-10],ArrowDown:[0,10]};if(!moves[event.key])return;event.preventDefault();remember();node.x=Math.max(0,Math.min(2160,node.x+moves[event.key][0]));node.y=Math.max(0,Math.min(1440,node.y+moves[event.key][1]));selected=node.id;render(true);});
      $('nodes').append(button);
    }
    if(!graph.nodes.some(n=>n.id===selected))selected=graph.nodes[0].id;
    lines();choose(selected);$('undo').disabled=!history.length;
    if(focus) [...$('nodes').children].find(b=>b.dataset.id===selected).focus();
  }
  $('board').addEventListener('pointermove',event=>{if(!drag||event.pointerId!==drag.pointer)return;const node=graph.nodes.find(n=>n.id===drag.id);node.x=Math.max(0,Math.min(2160,drag.startX+event.clientX-drag.x));node.y=Math.max(0,Math.min(1440,drag.startY+event.clientY-drag.y));const button=[...$('nodes').children].find(b=>b.dataset.id===node.id);button.style.left=node.x+'px';button.style.top=node.y+'px';lines();});
  for(const event of ['pointerup','pointercancel'])$('board').addEventListener(event,()=>{drag=null;});
  $('editor').addEventListener('submit',event=>{
    event.preventDefault();const candidate=JSON.parse(JSON.stringify(graph));const node=candidate.nodes.find(n=>n.id===selected);
    node.title=$('title').value;node.note=$('note').value;node.source=$('source').value;
    candidate.edges=candidate.edges.filter(e=>e.to!==selected);
    if($('parent').value)candidate.edges.push({from:$('parent').value,to:selected,label:$('relation').value});
    try{validateGraph(candidate);remember();graph=candidate;render();status('编辑已应用；保存 JSON 以保留。Edits applied; save to retain.');}catch(error){status('编辑无效 / Invalid edit: '+error.message);}
  });
  $('add').onclick=()=>{if(graph.nodes.length>=100||graph.edges.length>=250){status('已达到节点或关系数量上限。Graph limit reached.');return;}remember();const parent=selected;const base=graph.nodes.find(n=>n.id===parent);const id='node-'+Date.now()+'-'+Math.random().toString(36).slice(2);graph.nodes.push({id,title:'新概念 / New concept',note:'',source:'',x:Math.min(2160,base.x+280),y:Math.min(1440,base.y+180)});graph.edges.push({from:parent,to:id,label:'关系待核验 / Verify relation'});selected=id;render();status('已添加节点。Node added.');};
  $('remove').onclick=()=>{if(graph.nodes.length===1)return;remember();graph.nodes=graph.nodes.filter(n=>n.id!==selected);graph.edges=graph.edges.filter(e=>e.from!==selected&&e.to!==selected);render();status('已删除节点与相连关系，可撤销。Deleted; undo is available.');};
  $('undo').onclick=()=>{if(!history.length)return;graph=JSON.parse(history.pop());render();status('已撤销。Undone.');};
  $('export').onclick=()=>{const blob=new Blob([JSON.stringify(validateGraph(graph),null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='concept-map.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status('已下载当前图谱。Current graph downloaded.');};
  $('import').onchange=async event=>{const file=event.target.files[0];if(!file)return;try{if(file.size>1000000)throw Error('File exceeds 1 MB');const next=validateGraph(JSON.parse(await file.text()));remember();graph=next;selected=graph.nodes[0].id;render();status('已导入，可撤销。Imported; undo is available.');}catch(error){status('导入失败，当前图谱保留。Import rejected: '+error.message);}finally{event.target.value='';}};
  $('print').onclick=()=>window.print();
  render();
})();
