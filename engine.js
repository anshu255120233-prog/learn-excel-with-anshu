/* ---- formula engine (no eval) ---- */
const COLS="ABCDEFGH".split(""),ROWS=12;let raw={};
function load(ds){raw={};ds.forEach((r,i)=>r.forEach((v,j)=>raw[COLS[j]+(i+1)]=String(v)));raw.A12="Answer"}
function tok(s){const re=/\s*(?:(\d+\.?\d*)|"([^"]*)"|(\$?[A-Za-z]+\$?\d+(?::\$?[A-Za-z]+\$?\d+)?)(?![\w(])|([A-Za-z_][\w.]*)|(<>|<=|>=|[-+*\/^&=<>(),]))/y;const o=[];while(re.lastIndex<s.length){if(/^\s*$/.test(s.slice(re.lastIndex)))break;const p=re.lastIndex+1,m=re.exec(s);if(!m)throw Error("Unexpected character at position "+p);o.push(m[1]?{t:"n",v:+m[1]}:m[2]!==undefined?{t:"s",v:m[2]}:m[3]?{t:"r",v:m[3].replace(/\$/g,"").toUpperCase()}:m[4]?{t:"f",v:m[4].toUpperCase()}:{t:"o",v:m[5]})}return o}
function parse(t){let p=0;const nx=()=>t[p++],O=v=>t[p]&&t[p].t==="o"&&t[p].v===v;
const lv=(ops,sub)=>()=>{let l=sub();while(t[p]&&t[p].t==="o"&&ops.includes(t[p].v)){const o=nx().v;l={k:"b",o,l,r:sub()}}return l};
function un(){if(O("-")){nx();return{k:"u",e:un()}}return pr()}
const pw=lv(["^"],un),mul=lv(["*","/"],pw),add=lv(["+","-"],mul),cat=lv(["&"],add),cmp=lv(["=","<>","<",">","<=",">="],cat);
function pr(){const x=nx();if(!x)throw Error("Formula ended unexpectedly");
if(x.t==="n"||x.t==="s")return{k:"v",v:x.v};if(x.t==="r")return{k:"r",v:x.v};
if(x.t==="f"){if(O("(")){nx();const a=[];if(!O(")")){do{a.push(cmp())}while(O(",")&&nx())}if(!O(")"))throw Error("Missing closing parenthesis");nx();return{k:"f",n:x.v,a}}
if(x.v==="TRUE"||x.v==="FALSE")return{k:"v",v:x.v==="TRUE"};throw Error("Unknown name: "+x.v)}
if(x.v==="("){const e=cmp();if(!O(")"))throw Error("Missing closing parenthesis");nx();return e}throw Error('Unexpected "'+x.v+'"')}
const r=cmp();if(p<t.length)throw Error('Unexpected "'+t[p].v+'"');return r}
const ci=c=>c.charCodeAt(0)-65;
function pc(a){const m=/^([A-Z]+)(\d+)$/.exec(a);if(!m||m[1].length>1||ci(m[1])>7||+m[2]<1||+m[2]>ROWS)throw Error("Invalid reference "+a+" (grid is A1:H"+ROWS+")");return[ci(m[1]),+m[2]]}
function cellVal(k,seen){if(seen.includes(k))throw Error("Circular reference at "+k);const s=raw[k];if(s==null||s==="")return"";if(s[0]==="=")return ev(parse(tok(s.slice(1))),[...seen,k]);const n=Number(s);return s.trim()!==""&&!isNaN(n)?n:s}
function range(s,seen){const[a,b]=s.split(":"),[c1,r1]=pc(a),[c2,r2]=pc(b);const o=[];for(let r=Math.min(r1,r2);r<=Math.max(r1,r2);r++){const w=[];for(let c=Math.min(c1,c2);c<=Math.max(c1,c2);c++)w.push(cellVal(COLS[c]+r,seen));o.push(w)}return o}
const num=v=>{const x=typeof v==="number"?v:v===""?0:typeof v==="boolean"?+v:Number(v);if(isNaN(x))throw Error("#VALUE! expected a number but got text");return x};
const flat=a=>Array.isArray(a)?a.flat():[a],eq=(a,b)=>String(a).toLowerCase()===String(b).toLowerCase();
function bin(o,l,r){if(o==="&")return String(l)+String(r);if("+-*/^".includes(o)){l=num(l);r=num(r);if(o==="/"&&r===0)throw Error("#DIV/0! division by zero");return o==="+"?l+r:o==="-"?l-r:o==="*"?l*r:o==="/"?l/r:Math.pow(l,r)}
const both=typeof l==="number"&&typeof r==="number",a=both?l:String(l).toLowerCase(),b=both?r:String(r).toLowerCase();return{"=":a===b,"<>":a!==b,"<":a<b,">":a>b,"<=":a<=b,">=":a>=b}[o]}
function ev(n,seen){switch(n.k){case"v":return n.v;case"r":if(n.v.includes(":"))return range(n.v,seen);pc(n.v);return cellVal(n.v,seen);case"u":return-num(ev(n.e,seen));case"b":return bin(n.o,ev(n.l,seen),ev(n.r,seen));
case"f":{if(n.n==="IFERROR"){try{return ev(n.a[0],seen)}catch(x){return n.a.length>1?ev(n.a[1],seen):""}}const f=F[n.n];if(!f)throw Error("Function "+n.n+" is not supported in this simulator");return f(...n.a.map(a=>ev(a,seen)))}}}
function crit(c){if(typeof c!=="string")return v=>v===c;const m=/^(<>|<=|>=|=|<|>)?(.*)$/.exec(c),o=m[1]||"=",x=m[2],xn=x!==""&&!isNaN(x)?+x:null;
return v=>{if(xn!==null&&typeof v==="number")return{"=":v===xn,"<>":v!==xn,"<":v<xn,">":v>xn,"<=":v<=xn,">=":v>=xn}[o];return o==="="?eq(v,x):o==="<>"?!eq(v,x):false}}
const nums=a=>a.flatMap(x=>Array.isArray(x)?x.flat().filter(y=>typeof y==="number"):[num(x)]);
const matchAll=(p)=>{const R=[];for(let i=0;i<p.length;i+=2)R.push([flat(p[i]),crit(p[i+1])]);return R[0][0].map((_,j)=>R.every(([r,f])=>f(r[j])))};
const F={SUM:(...a)=>sum(nums(a)),AVERAGE:(...a)=>{const n=nums(a);if(!n.length)throw Error("#DIV/0! no numbers");return sum(n)/n.length},MIN:(...a)=>Math.min(...nums(a)),MAX:(...a)=>Math.max(...nums(a)),COUNT:(...a)=>nums(a).length,
IF:(c,y,n=false)=>c?y:n,
SUMIF:(r,c,s)=>{const R=flat(r),S=flat(s===undefined?r:s),f=crit(c);return sum(R.map((v,i)=>f(v)&&typeof S[i]==="number"?S[i]:0))},
SUMIFS:(s,...p)=>{const m=matchAll(p),S=flat(s);return sum(S.map((v,i)=>m[i]&&typeof v==="number"?v:0))},
COUNTIF:(r,c)=>flat(r).filter(crit(c)).length,COUNTIFS:(...p)=>matchAll(p).filter(Boolean).length,
VLOOKUP:(v,tb,c,ap=true)=>{const k=num(c);if(!Array.isArray(tb)||k<1||k>tb[0].length)throw Error("#REF! column index out of range");let row;
if(ap===false||ap===0)row=tb.find(r=>eq(r[0],v));else for(const r of tb)if(r[0]<=v)row=r;if(!row)throw Error("#N/A value not found");return row[k-1]},
XLOOKUP:(v,l,r,nf)=>{const i=flat(l).findIndex(x=>eq(x,v));if(i<0){if(nf!==undefined)return nf;throw Error("#N/A value not found")}return flat(r)[i]},
CONCAT:(...a)=>a.flatMap(flat).join(""),LEFT:(s,n=1)=>String(s).slice(0,num(n)),RIGHT:(s,n=1)=>{n=num(n);return n?String(s).slice(-n):""},LEN:s=>String(s).length};
const fmt=v=>typeof v==="boolean"?(v?"TRUE":"FALSE"):typeof v==="number"?String(Number(v.toFixed(6))):Array.isArray(v)?"#VALUE!":String(v);
const esc=s=>String(s).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;");
const disp=k=>{try{return fmt(cellVal(k,[]))}catch(e){return"#ERR"}};
