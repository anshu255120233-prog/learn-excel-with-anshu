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
/* Formula Explorer: every formula with editable values */
Object.assign(T.en,{xT:"Formula Explorer (all formulas)",xD:"Pick any formula. Change its values (cells, ranges, numbers, text) in the boxes or in the formula box. The result updates instantly using the data in the grid below, so you can edit that data too.",xP:"Change values:"});
Object.assign(T.hi,{xT:"फ़ॉर्मूला एक्सप्लोरर (सभी फ़ॉर्मूले)",xD:"कोई भी फ़ॉर्मूला चुनें। उसके मान (सेल, रेंज, संख्या, टेक्स्ट) बॉक्स में या फ़ॉर्मूला बॉक्स में बदलें। नतीजा नीचे की ग्रिड के डेटा से तुरंत बदलता है, और वह डेटा भी आप बदल सकते हैं।",xP:"मान बदलें:"});
(()=>{const st=document.createElement("style");st.textContent=".xrow{display:flex;flex-wrap:wrap;gap:4px;align-items:center;font:15px ui-monospace,Consolas,monospace;margin:8px 0}.xp{font:inherit;padding:4px 6px;min-height:38px;border:1px solid var(--g);border-radius:8px;background:var(--card);color:var(--tx)}#xf{width:100%;font:15px ui-monospace,Consolas,monospace;padding:8px;border:1px solid var(--bd);border-radius:10px;background:var(--card);color:var(--tx);min-height:44px}";document.head.appendChild(st)})();
let xn="SUMIF",xt=tok(TD.SUMIF.sol.slice(1));
const xs=()=>"="+xt.map(k=>k.t==="s"?'"'+k.v+'"':String(k.v)).join("");
const xPar=()=>"<b>=</b>"+xt.map((k,i)=>["n","s","r"].includes(k.t)?`<input class="xp" data-xi="${i}" value="${esc(k.v)}" size="${Math.max(3,String(k.v).length+1)}" autocapitalize="off" autocomplete="off" spellcheck="false" aria-label="${esc(k.v)}">`:`<span>${esc(k.v)}</span>`).join("");
const xRes=(f=xs())=>{try{return"= "+fmt(ev(parse(tok(f.slice(1))),[]))}catch(e){return"⚠ "+e.message}};
const xDesc=()=>{const d=TD[xn];return L({en:d.en,hi:d.hi})+" <code>"+esc(d.fx)+"</code>"};
function xShow(f){const r=document.getElementById("xr");if(r)r.textContent=xRes(f)}
function xReload(){xt=tok(TD[xn].sol.slice(1));document.getElementById("xd").innerHTML=xDesc();document.getElementById("xpar").innerHTML=xPar();document.getElementById("xf").value=xs();xShow()}
function xCard(){const o=LV.map((l,i)=>{const n=l[2].split(", ").filter(x=>TD[x]);return n.length?`<optgroup label="${t("lvl")} ${i+1}: ${L({en:l[0],hi:l[1]})}">${n.map(x=>`<option ${x===xn?"selected":""}>${x}</option>`).join("")}</optgroup>`:""}).join("");
return`<div class="card"><h2>${t("xT")}</h2><p class="mut">${t("xD")}</p><select data-x="sel" aria-label="${t("xT")}">${o}</select><p id="xd">${xDesc()}</p><p class="mut" style="margin:0">${t("xP")}</p><div class="xrow" id="xpar">${xPar()}</div><label for="xf"><b>${t("fx")}</b></label><input id="xf" autocapitalize="off" autocomplete="off" spellcheck="false" value="${esc(xs())}"><div class="row"><button data-x="reset">${t("reset")}</button></div><div class="msg" id="xr" role="status">${esc(xRes())}</div></div>`}
const _lab=V.lab;V.lab=()=>{const h=_lab(),m='<div class="card"><h2>'+t("sT");return h.replace(m,xCard()+m)};
document.addEventListener("change",e=>{if(e.target.dataset.x==="sel"){xn=e.target.value;xReload()}});
document.addEventListener("click",e=>{if(e.target.dataset&&e.target.dataset.x==="reset")xReload()});
document.addEventListener("input",e=>{const i=e.target;if(i.classList&&i.classList.contains("xp")){xt[+i.dataset.xi].v=i.value;document.getElementById("xf").value=xs();xShow()}
else if(i.id==="xf"){const f=i.value[0]==="="?i.value:"="+i.value;try{xt=tok(f.slice(1));document.getElementById("xpar").innerHTML=xPar()}catch(x){}xShow(f)}
else if(i.dataset&&i.dataset.c||i.id==="fb")xShow()});
