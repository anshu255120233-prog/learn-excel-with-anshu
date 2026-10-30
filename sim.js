/* Simulator tools */
Object.assign(T.en,{insfn:"Insert function",fill:"Fill Down",clr:"Clear cell",tip:"Type = in a cell, then tap other cells to insert references. Shift+click makes a range (E2:E9). Use $ for absolute references ($E$2). Fill Down copies a formula to the rows below."});
Object.assign(T.hi,{insfn:"फ़ंक्शन जोड़ें",fill:"नीचे भरें",clr:"सेल साफ़ करें",tip:"किसी सेल में = लिखें, फिर दूसरे सेल दबाकर रेफ़रेंस जोड़ें। Shift+क्लिक से रेंज बनती है (E2:E9)। Absolute रेफ़रेंस के लिए $ लगाएँ ($E$2)। “नीचे भरें” फ़ॉर्मूला नीचे की पंक्तियों में कॉपी करता है।"});
function toolbar(){return`<div class="row" role="toolbar" aria-label="Tools"><select data-s="fn" aria-label="${t("insfn")}"><option value="">ƒx ${t("insfn")}</option>${Object.keys(F).sort().map(k=>`<option>${k}</option>`).join("")}</select><button data-s="fill">⬇ ${t("fill")}</button><button data-s="clear">✕ ${t("clr")}</button></div><p class="mut" style="margin:4px 0;font-size:14px">💡 ${t("tip")}</p>`}
const cellIn=k=>document.querySelector(`.g input[data-c="${k}"]`);
function setRaw(k,v){raw[k]=v;const i=cellIn(k);if(i)i.value=v;if(k===sel){const f=document.getElementById("fb");if(f)f.value=v}status()}
function shiftF(f,dr){return f.split('"').map((p,i)=>i%2?p:p.replace(/(\$?)([A-H])(\$?)(\d+)/g,(m,a,c,b,r)=>a+c+b+(b?r:+r+dr))).join('"')}
document.addEventListener("mousedown",e=>{const c=e.target.dataset&&e.target.dataset.c;if(!c||c===sel)return;const a=document.activeElement;if(!a||!(a.dataset&&a.dataset.c||a.id==="fb"))return;const s=raw[sel]||"";if(s[0]!=="=")return;
if(e.shiftKey&&/[A-H]\d+$/.test(s)){e.preventDefault();setRaw(sel,s.replace(/([A-H]\d+)$/,"$1:"+c))}else if(/[=(,+\-*\/&<>^:]$/.test(s)){e.preventDefault();setRaw(sel,s+c)}});
document.addEventListener("click",e=>{const b=e.target.closest("[data-s]");if(!b)return;const k=b.dataset.s;
if(k==="clear"){setRaw(sel,"");refresh()}
else if(k==="fill"){const col=COLS.indexOf(sel[0]),row=+sel.slice(1),nb=col>0?COLS[col-1]:COLS[col+1];let end=row;while(end<ROWS&&(raw[nb+(end+1)]||"")!=="")end++;if(end===row)end=ROWS;
for(let r=row+1;r<=end;r++){const s=raw[sel]||"";raw[sel[0]+r]=s[0]==="="?shiftF(s,r-row):s}refresh();status()}});
document.addEventListener("change",e=>{if(e.target.dataset.s!=="fn")return;const f=e.target.value;e.target.value="";if(!f)return;const s=raw[sel]||"";setRaw(sel,(s[0]==="="?s:"=")+f+"(");const i=cellIn(sel);if(i)i.focus()});
document.addEventListener("keydown",e=>{const c=e.target.dataset&&e.target.dataset.c;if(!c)return;const dr={Enter:e.shiftKey?-1:1,ArrowDown:1,ArrowUp:-1}[e.key];if(dr===undefined)return;e.preventDefault();const r=+c.slice(1)+dr;if(r<1||r>ROWS)return;const n=cellIn(c[0]+r);if(n)n.focus()});
