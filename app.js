/* ---- state and views ---- */
let cur=0,hn=0,sel="B12",dm={mode:"v",p:"103",i:-1,tm:null},dsKey="emp";
const NAV=[["home","home"],["courses","courses"],["lab","lab"],["data","data"],["about","about"]];
const route=()=>{const h=location.hash.slice(1);return /^t-\d+-\d+$/.test(h)?"topic":NAV.some(n=>n[0]===h)?h:"home"};
const logo=`<svg viewBox="0 0 40 40" width="38" height="38" aria-hidden="true"><rect width="40" height="40" rx="8" fill="#1d6f42"/><path d="M0 13.3H40M0 26.6H40M13.3 0V40M26.6 0V40" stroke="#fff" stroke-opacity=".28"/><text x="20" y="29" text-anchor="middle" font-size="26" font-weight="800" fill="#fff" font-family="Georgia,serif">A</text></svg>`;
function head(){const r=route();document.getElementById("hd").innerHTML=`<a class="logo" href="#home">${logo}<span><b>Learn Excel with Anshu</b><small>${t("tag")}</small></span></a><nav aria-label="Main">${NAV.map(([k])=>`<a href="#${k}" class="${r===k||(r==="topic"&&k==="courses")?"on":""}">${t(k)}</a>`).join("")}</nav><button data-a="lang" aria-label="Language">${lang==="en"?"हिंदी":"English"}</button><button data-a="theme" aria-label="Theme">◐</button>`;
document.getElementById("ft").innerHTML=`<div class="logo" style="justify-content:center">${logo}<b>Learn Excel with Anshu</b></div><div>${t("tag")} · Anshu Singh, Satna, Madhya Pradesh, India</div><div>${t("foot")}</div>`;document.documentElement.lang=lang==="hi"?"hi":"en"}
function table(rows,x=""){return`<div class="sc"><table>${rows.map((r,i)=>`<tr>${r.map(c=>i?`<td>${esc(c)}</td>`:`<th>${esc(c)}</th>`).join("")}</tr>`).join("")}</table></div>`}
const V={
home:()=>`<section class="hero"><h1>${t("h1")}</h1><p>${t("sub")}</p><div class="row" style="justify-content:center"><a href="#lab"><button class="p">${t("start")}</button></a><a href="#courses"><button>${t("explore")}</button></a></div></section>
<div class="card"><h2>${t("why")}</h2><div class="grid3"><div class="card"><b>👀 ${t("w1")}</b><p class="mut">${t("w1d")}</p></div><div class="card"><b>⌨️ ${t("w2")}</b><p class="mut">${t("w2d")}</p></div><div class="card"><b>🔒 ${t("w3")}</b><p class="mut">${t("w3d")}</p></div></div></div>
<div class="card"><h2>${t("cT")}</h2><p>${LV.map((l,i)=>`<span class="chip">${i+1}. ${L({en:l[0],hi:l[1]})}</span>`).join("")}</p></div>
<div class="card"><h2>${t("aT")}</h2>${demoShell()}</div>`,
courses:()=>`<h2>${t("cT")}</h2><p class="mut">${t("cD")}</p>${LV.map((l,i)=>`<details class="card"><summary>${t("lvl")} ${i+1}: ${L({en:l[0],hi:l[1]})}</summary><p>${l[2].split(", ").map((x,k)=>`<a class="chip" href="#t-${i}-${k}">${x}</a>`).join("")}</p></details>`).join("")}`,
lab:()=>`<h2>${t("lT")}</h2><div class="card"><h2>${t("aT")}</h2><p class="mut">${t("aD")}</p>${demoShell()}</div><div class="card"><h2>${t("sT")}</h2><p class="mut">${t("sD")}</p><div class="row">${EX.slice(0,4).map((e,i)=>`<button data-a="ex" data-i="${i}" class="${cur===i?"p":""}">${i+1}. ${L(e.lv)}</button>`).join("")}<button data-a="free" class="${cur<0?"p":""}">${t("free")}</button></div><div id="exbox"></div><div class="row"><label for="fb"><b>${t("fx")}</b></label></div>${toolbar()}<input id="fb" autocapitalize="off" autocomplete="off" spellcheck="false" aria-label="Formula bar"><div class="sc" id="gw" style="margin-top:8px">${gridHTML()}</div><div class="msg" id="st" role="status"></div></div>`,
data:()=>`<h2>${t("dT")}</h2><p class="mut">${t("dD")}</p>${[["emp","Employee Data (HR)",D],["sales","Sales Data",S]].map(([k,n,d])=>`<div class="card"><h2>${n}</h2>${table(d)}<div class="row"><button data-a="copy" data-k="${k}">${t("copy")}</button><button class="p" data-a="loadds" data-k="${k}">${t("load")}</button><span id="cp-${k}" class="mut"></span></div></div>`).join("")}`,
about:()=>`<div class="card"><h2>${t("abT")}</h2><p><b>Anshu Singh</b><br>Satna, Madhya Pradesh, India</p><p>${t("abD")}</p></div>`};
/* animation demo */
function demoShell(){return`<div class="row"><button data-a="dm" data-m="v" class="${dm.mode==="v"?"p":""}">VLOOKUP</button><button data-a="dm" data-m="s" class="${dm.mode==="s"?"p":""}">SUMIF</button><button data-a="dm" data-m="i" class="${dm.mode==="i"?"p":""}">IF</button></div><div class="row"><label>${t("pick")}: <select id="dp" data-a="dpick">${(dm.mode==="v"?E.map(r=>r[0]):dm.mode==="s"?["HR","IT","Finance","Sales"]:["Marks >= 40"]).map(o=>`<option ${String(o)===dm.p?"selected":""}>${o}</option>`).join("")}</select></label><button class="p" data-a="play">▶ ${t("play")}</button></div><div id="demo" aria-live="polite">${demoHTML()}</div>`}
function demoHTML(){const{mode,p,i}=dm;let tot=0,found=false,f="",note="";
const rows=E.map((r,k)=>{let c="",res="";if(i>=k){if(mode==="v"){const m=String(r[0])===p;if(m){c="hit";found=true}else if(!found)c="dim"}
else if(mode==="s"){if(r[2]===p){c="hit";tot+=r[4]}else c="dim"}else{const ok=r[5]>=40;c=ok?"hit":"bad";res=ok?t("pass"):t("fail")}}
if(i===k&&c!=="hit"&&c!=="bad")c+=" cur";if(mode==="v"&&found&&i>=k&&String(r[0])!==p)c="dim";return`<tr class="${c}"><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[4]}</td><td>${r[5]}</td>${mode==="i"?`<td class="res">${res}</td>`:""}</tr>`}).join("");
if(mode==="v"){f=`=VLOOKUP(${p},A2:B9,2,FALSE)`;const r=E.find(x=>String(x[0])===p);note=i<0?"":found?`${t("s_f")} → <b>${r[1]}</b>`:`${t("s_v")} ${p}… ${t("chk")} ${i+2}`}
else if(mode==="s"){f=`=SUMIF(C2:C9,"${p}",E2:E9)`;note=i<0?"":`${t("chk")} ${Math.min(i,7)+2}. ${t("s_t")}: <b>${tot}</b>`}
else{f=`=IF(F2>=40,"Pass","Fail")`;note=i<0?"":`${t("chk")} ${Math.min(i,7)+2}`}
return`<p><code>${esc(f)}</code></p><div class="sc"><table><tr><th>ID</th><th>Name</th><th>Dept</th><th>Salary</th><th>Marks</th>${mode==="i"?"<th>→</th>":""}</tr>${rows}</table></div><div class="msg">${note||"▶"}</div>`}
function play(){clearInterval(dm.tm);dm.i=-1;const reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
const fin=()=>dm.mode==="v"?dm.i>=E.findIndex(r=>String(r[0])===dm.p):dm.i>=7;
if(reduce){dm.i=dm.mode==="v"?E.findIndex(r=>String(r[0])===dm.p):7;paint();return}
dm.tm=setInterval(()=>{dm.i++;paint();if(fin())clearInterval(dm.tm)},650)}
function paint(){const d=document.getElementById("demo");if(d)d.innerHTML=demoHTML()}
/* simulator */
function gridHTML(){let h="<table class='g'><tr><th></th>"+COLS.map(c=>`<th>${c}</th>`).join("")+"</tr>";for(let r=1;r<=ROWS;r++)h+=`<tr><th>${r}</th>`+COLS.map(c=>`<td><input autocapitalize="off" autocomplete="off" spellcheck="false" data-c="${c}${r}" aria-label="${c}${r}" value="${esc(disp(c+r))}"></td>`).join("")+"</tr>";return h+"</table>"}
function refresh(skip){document.querySelectorAll(".g input").forEach(i=>{if(i!==skip)i.value=disp(i.dataset.c)})}
function status(){const s=document.getElementById("st");if(!s)return;try{s.textContent=sel+" = "+fmt(cellVal(sel,[]))}catch(e){s.textContent="⚠ "+e.message}}
function exbox(msg){const b=document.getElementById("exbox");if(!b)return;if(cur<0){b.innerHTML="";return}const e=EX[cur];
b.innerHTML=`<p><b>${t("task")}:</b> ${L(e.task)}<br><span class="mut">${t("ans")}</span></p><div class="row"><button data-a="hint">💡 ${t("hint")}</button><button class="p" data-a="check">${t("check")}</button><button data-a="rst">${t("reset")}</button></div>${msg?`<div class="msg">${msg}</div>`:""}`}
function loadEx(i){cur=i;hn=0;load(D);sel="B12";const g=document.getElementById("gw");if(g){g.innerHTML=gridHTML();document.getElementById("fb").value="";status();exbox()}}
function check(){const e=EX[cur];let v;try{v=cellVal("B12",[])}catch(x){return exbox("⚠ "+x.message)}
const ok=typeof e.exp==="number"?typeof v==="number"&&Math.abs(v-e.exp)<1e-6:eq(v,e.exp);
exbox(ok?`✅ ${t("ok")}${L(e.ex)}<br>${t("solution")}: <code>${esc(e.sol)}</code>`:"❌ "+t("no"))}
function render(){clearInterval(dm.tm);head();const r=route();if(r==="lab"&&(cur===4||Object.keys(raw).length===0)){cur=cur===4?0:cur;load(D)}if(r==="topic")setTopic();document.getElementById("app").innerHTML=V[r]();if(r==="lab"||r==="topic"){document.getElementById("fb").value=raw[sel]||"";exbox();status()}window.scrollTo(0,0)}
document.addEventListener("click",e=>{const b=e.target.closest("[data-a]");if(!b)return;const a=b.dataset.a;
if(a==="lang"){lang=lang==="en"?"hi":"en";try{ST&&ST.setItem("lw-lang",lang)}catch(x){}const y=scrollY;render();scrollTo(0,y)}
else if(a==="theme"){const d=document.documentElement,dark=d.dataset.theme?d.dataset.theme==="dark":matchMedia("(prefers-color-scheme:dark)").matches;d.dataset.theme=dark?"light":"dark"}
else if(a==="dm"){dm.mode=b.dataset.m;dm.p=dm.mode==="v"?"103":dm.mode==="s"?"HR":"Marks >= 40";dm.i=-1;clearInterval(dm.tm);document.getElementById("demo").parentElement.innerHTML=demoShell()}
else if(a==="play")play();
else if(a==="ex"){load(D);loadEx(+b.dataset.i);render_btns()}else if(a==="free"){load(D);loadEx(-1);render_btns()}
else if(a==="hint"){const h=EX[cur].hints;exbox(hn<h.length?"💡 "+L(h[hn++]):t("noh"))}
else if(a==="check")check();else if(a==="rst"){loadEx(cur)}
else if(a==="copy"){const d=b.dataset.k==="emp"?D:S,csv=d.map(r=>r.join(",")).join("\n"),o=document.getElementById("cp-"+b.dataset.k);
(navigator.clipboard?navigator.clipboard.writeText(csv):Promise.reject()).then(()=>o.textContent=t("copied"),()=>o.textContent=t("cf"))}
else if(a==="loadds"){load(b.dataset.k==="emp"?D:S);cur=-1;location.hash="lab";render()}});
function render_btns(){document.querySelectorAll("[data-a=ex],[data-a=free]").forEach(x=>x.classList.toggle("p",x.dataset.a==="ex"?+x.dataset.i===cur:cur<0))}
document.addEventListener("change",e=>{if(e.target.dataset.a==="dpick"){dm.p=e.target.value;dm.i=-1;clearInterval(dm.tm);paint()}});
document.addEventListener("focusin",e=>{const i=e.target;if(i.dataset&&i.dataset.c){sel=i.dataset.c;i.value=raw[sel]||"";document.getElementById("fb").value=raw[sel]||"";status()}});
document.addEventListener("focusout",e=>{if(e.target.dataset&&e.target.dataset.c||e.target.id==="fb")refresh()});
document.addEventListener("input",e=>{const i=e.target;if(i.dataset&&i.dataset.c){raw[i.dataset.c]=i.value;document.getElementById("fb").value=i.value;status()}
else if(i.id==="fb"){raw[sel]=i.value;const c=document.querySelector(`.g input[data-c="${sel}"]`);if(c)c.value=i.value;status()}});
document.addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target.id==="fb"){e.target.blur();refresh()}});

