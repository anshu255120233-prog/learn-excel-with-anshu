/* Extra functions for topic labs */
Object.assign(F,{
COUNTA:(...a)=>a.flatMap(flat).filter(x=>x!=="").length,PRODUCT:(...a)=>nums(a).reduce((x,y)=>x*y,1),
ROUND:(x,n=0)=>{const p=10**num(n);return Math.round(num(x)*p)/p},ROUNDUP:(x,n=0)=>{const p=10**num(n);return Math.ceil(num(x)*p-1e-9)/p},ROUNDDOWN:(x,n=0)=>{const p=10**num(n);return Math.trunc(num(x)*p+1e-9)/p},
AND:(...a)=>a.flatMap(flat).every(Boolean),OR:(...a)=>a.flatMap(flat).some(Boolean),NOT:x=>!x,
IFS:(...a)=>{for(let i=0;i<a.length;i+=2)if(a[i])return a[i+1];throw Error("#N/A no condition matched")},
AVERAGEIF:(r,c,s)=>{const R=flat(r),S=flat(s===undefined?r:s),f=crit(c),v=R.map((x,i)=>f(x)&&typeof S[i]==="number"?S[i]:null).filter(x=>x!==null);if(!v.length)throw Error("#DIV/0! no matching rows");return sum(v)/v.length},
UPPER:s=>String(s).toUpperCase(),LOWER:s=>String(s).toLowerCase(),PROPER:s=>String(s).toLowerCase().replace(/(^|\s)\S/g,m=>m.toUpperCase()),
TRIM:s=>String(s).trim().replace(/\s+/g," "),MID:(s,a,n)=>String(s).substr(num(a)-1,num(n)),
FIND:(a,b)=>{const i=String(b).indexOf(String(a));if(i<0)throw Error("#VALUE! text not found");return i+1},
SUBSTITUTE:(s,a,b)=>String(s).split(String(a)).join(String(b)),TEXTJOIN:(d,ig,...a)=>a.flatMap(flat).filter(x=>!ig||x!=="").join(d),
INDEX:(r,i,j=1)=>{const m=Array.isArray(r)?r:[[r]],row=m[num(i)-1];if(!row||row[num(j)-1]===undefined)throw Error("#REF! position out of range");return row[num(j)-1]},
MATCH:(v,r,ty=1)=>{const R=flat(r);let i=-1;if(ty===0)i=R.findIndex(x=>eq(x,v));else R.forEach((x,k)=>{if(x<=v)i=k});if(i<0)throw Error("#N/A value not found");return i+1},
CHOOSE:(i,...a)=>{const v=a[num(i)-1];if(v===undefined)throw Error("#VALUE! index out of range");return v}});
Object.assign(T.en,{what:"What is it?",syntax:"Syntax",anim:"Animated explanation",labT:"Practice Lab for this topic",prev:"Previous",next:"Next",
gw:"{n} is a topic in Level {l}. Use the guided practice below with the sample employee data.",
g1:"Open the Employee dataset (Datasets page) in Excel, or use the grid below.",g2:"Practice “{n}” on that data, following your course notes or Excel Help.",g3:"Try a related formula in the grid below to confirm your result.",gn:"Guided practice (self-check)"});
Object.assign(T.hi,{what:"यह क्या है?",syntax:"सिंटैक्स",anim:"एनिमेटेड व्याख्या",labT:"इस टॉपिक की प्रैक्टिस लैब",prev:"पिछला",next:"अगला",
gw:"{n}, Level {l} का एक टॉपिक है। नीचे दिए गए कर्मचारी डेटा पर निर्देशित अभ्यास करें।",
g1:"Employee डेटासेट (Datasets पेज) को Excel में खोलें, या नीचे की ग्रिड इस्तेमाल करें।",g2:"उस डेटा पर “{n}” का अभ्यास करें, अपने कोर्स नोट्स या Excel Help के साथ।",g3:"नतीजा जाँचने के लिए नीचे की ग्रिड में कोई संबंधित फ़ॉर्मूला आज़माएँ।",gn:"निर्देशित अभ्यास (खुद जाँचें)"});
/* [name, syntax, desc EN, desc HI, task EN, task HI, solution] */
const TR=[
["SUM","SUM(number1, [number2], ...)","Adds all the numbers in a range.","रेंज की सभी संख्याओं को जोड़ता है।","Find the total salary of all employees.","सभी कर्मचारियों की कुल सैलरी निकालें।","=SUM(E2:E9)"],
["AVERAGE","AVERAGE(range)","Returns the mean of the numbers.","संख्याओं का औसत देता है।","Find the average salary.","औसत सैलरी निकालें।","=AVERAGE(E2:E9)"],
["MIN","MIN(range)","Returns the smallest number.","सबसे छोटी संख्या देता है।","Find the lowest salary.","सबसे कम सैलरी निकालें।","=MIN(E2:E9)"],
["MAX","MAX(range)","Returns the largest number.","सबसे बड़ी संख्या देता है।","Find the highest marks.","सबसे ज़्यादा मार्क्स निकालें।","=MAX(F2:F9)"],
["COUNT","COUNT(range)","Counts cells that contain numbers.","संख्या वाले सेल गिनता है।","Count how many salaries are listed.","कितनी सैलरी दर्ज हैं, गिनें।","=COUNT(E2:E9)"],
["COUNTA","COUNTA(range)","Counts all non-empty cells, including text.","टेक्स्ट सहित सभी भरे सेल गिनता है।","Count the employee names.","कर्मचारियों के नाम गिनें।","=COUNTA(B2:B9)"],
["PRODUCT","PRODUCT(number1, ...)","Multiplies numbers together.","संख्याओं को गुणा करता है।","Multiply 12, 5 and 3.","12, 5 और 3 का गुणनफल निकालें।","=PRODUCT(12,5,3)"],
["ROUND","ROUND(number, digits)","Rounds a number. A negative digits value rounds to tens, hundreds and so on.","संख्या को राउंड करता है। ऋणात्मक digits दहाई, सैकड़ा आदि पर राउंड करता है।","Round the average salary to the nearest hundred.","औसत सैलरी को निकटतम सैकड़े में राउंड करें।","=ROUND(AVERAGE(E2:E9),-2)"],
["ROUNDUP","ROUNDUP(number, digits)","Always rounds away from zero.","हमेशा ऊपर की ओर राउंड करता है।","Round 4.231 up to 2 decimals.","4.231 को 2 दशमलव तक ऊपर राउंड करें।","=ROUNDUP(4.231,2)"],
["ROUNDDOWN","ROUNDDOWN(number, digits)","Always rounds toward zero.","हमेशा नीचे की ओर राउंड करता है।","Round 4.239 down to 2 decimals.","4.239 को 2 दशमलव तक नीचे राउंड करें।","=ROUNDDOWN(4.239,2)"],
["IF","IF(test, value_if_true, value_if_false)","Returns one value when a test is TRUE and another when it is FALSE.","टेस्ट सही हो तो एक मान, गलत हो तो दूसरा मान देता है।","Show Pass or Fail for the marks in F2 (pass mark is 40).","F2 के मार्क्स पर Pass या Fail दिखाएँ (पास मार्क 40)।",'=IF(F2>=40,"Pass","Fail")'],
["Nested IF","IF(test1, a, IF(test2, b, c))","Puts one IF inside another to handle more than two outcomes.","दो से ज़्यादा नतीजों के लिए एक IF के अंदर दूसरा IF लगाता है।","Grade F3: A if 60 or more, B if 40 or more, otherwise C.","F3 का ग्रेड: 60+ पर A, 40+ पर B, वरना C।",'=IF(F3>=60,"A",IF(F3>=40,"B","C"))'],
["IFS","IFS(test1, value1, test2, value2, ...)","Checks several tests in order and returns the first match.","कई शर्तें क्रम से जाँचकर पहली सही शर्त का मान देता है।","For F4: 80 or more is Distinction, 40 or more is Pass, else Fail.","F4 के लिए: 80+ Distinction, 40+ Pass, वरना Fail।",'=IFS(F4>=80,"Distinction",F4>=40,"Pass",TRUE,"Fail")'],
["AND","AND(test1, test2, ...)","TRUE only if every test is TRUE.","तभी TRUE जब सभी शर्तें सही हों।","Is employee 1 from Indore AND earning above 30000?","क्या कर्मचारी 1 इंदौर से है और 30000 से ज़्यादा कमाता है?",'=AND(D2="Indore",E2>30000)'],
["OR","OR(test1, test2, ...)","TRUE if at least one test is TRUE.","कम से कम एक शर्त सही हो तो TRUE।","Is employee 2 (row 3) in IT or HR?","क्या कर्मचारी 2 (पंक्ति 3) IT या HR में है?",'=OR(C3="IT",C3="HR")'],
["NOT","NOT(test)","Reverses TRUE and FALSE.","TRUE को FALSE और FALSE को TRUE करता है।","Is it NOT true that F3 is 40 or more?","क्या F3 का 40 या अधिक होना गलत है?","=NOT(F3>=40)"],
["IFERROR","IFERROR(value, value_if_error)","Shows a friendly value instead of an error.","एरर की जगह पढ़ने लायक मान दिखाता है।","Look up ID 999 and show Not found when it is missing.","ID 999 खोजें, न मिले तो Not found दिखाएँ।",'=IFERROR(VLOOKUP(999,A2:F9,2,FALSE),"Not found")'],
["SUMIF","SUMIF(range, criteria, [sum_range])","Adds values that meet one condition.","एक शर्त पूरी करने वाले मान जोड़ता है।","Total salary of the HR department.","HR विभाग की कुल सैलरी।",'=SUMIF(C2:C9,"HR",E2:E9)'],
["SUMIFS","SUMIFS(sum_range, range1, criteria1, ...)","Adds values that meet several conditions.","कई शर्तें पूरी करने वाले मान जोड़ता है।","Total salary of HR employees in Indore.","इंदौर के HR कर्मचारियों की कुल सैलरी।",'=SUMIFS(E2:E9,C2:C9,"HR",D2:D9,"Indore")'],
["COUNTIF","COUNTIF(range, criteria)","Counts cells that meet one condition.","एक शर्त पूरी करने वाले सेल गिनता है।","Count employees in IT.","IT के कर्मचारी गिनें।",'=COUNTIF(C2:C9,"IT")'],
["COUNTIFS","COUNTIFS(range1, criteria1, ...)","Counts rows that meet all conditions.","सभी शर्तें पूरी करने वाली पंक्तियाँ गिनता है।","Count employees in Indore earning more than 40000.","इंदौर में 40000 से ज़्यादा कमाने वाले कर्मचारी गिनें।",'=COUNTIFS(D2:D9,"Indore",E2:E9,">40000")'],
["AVERAGEIF","AVERAGEIF(range, criteria, [average_range])","Averages values that meet one condition.","एक शर्त पूरी करने वाले मानों का औसत।","Average salary of the IT department.","IT विभाग की औसत सैलरी।",'=AVERAGEIF(C2:C9,"IT",E2:E9)'],
["VLOOKUP","VLOOKUP(lookup_value, table, col_index, [range_lookup])","Finds a value in the first column and returns a value from another column. Use FALSE for an exact match.","पहले कॉलम में मान खोजकर दूसरे कॉलम से परिणाम देता है। Exact match के लिए FALSE लगाएँ।","Return the name of the employee with ID 106.","ID 106 वाले कर्मचारी का नाम निकालें।","=VLOOKUP(106,A2:F9,2,FALSE)"],
["XLOOKUP","XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found])","Searches one range and returns the matching item from another. Exact match by default.","एक रेंज में खोजकर दूसरी रेंज से मेल खाता मान देता है। डिफ़ॉल्ट exact match।","Return the city of employee ID 104.","ID 104 वाले कर्मचारी का शहर निकालें।","=XLOOKUP(104,A2:A9,D2:D9)"],
["INDEX","INDEX(range, row, [column])","Returns the value at a given position in a range.","रेंज में दी गई स्थिति का मान देता है।","Return the 3rd name in B2:B9.","B2:B9 का तीसरा नाम निकालें।","=INDEX(B2:B9,3)"],
["MATCH","MATCH(lookup_value, range, [match_type])","Returns the position of a value in a range. Use 0 for exact match.","रेंज में मान की स्थिति बताता है। Exact match के लिए 0।","Find the position of ID 105 in A2:A9.","A2:A9 में ID 105 की स्थिति निकालें।","=MATCH(105,A2:A9,0)"],
["INDEX + MATCH","INDEX(return_range, MATCH(value, lookup_range, 0))","A flexible lookup: MATCH finds the row, INDEX returns the value.","MATCH पंक्ति खोजता है और INDEX मान लौटाता है।","Find the salary of ID 106.","ID 106 की सैलरी निकालें।","=INDEX(E2:E9,MATCH(106,A2:A9,0))"],
["CHOOSE","CHOOSE(index, value1, value2, ...)","Picks a value from a list by its number.","संख्या के आधार पर सूची से मान चुनता है।","Return Medium using CHOOSE with index 2.","index 2 से CHOOSE द्वारा Medium निकालें।",'=CHOOSE(2,"Low","Medium","High")'],
["LEFT","LEFT(text, [num_chars])","Returns characters from the start of text.","टेक्स्ट की शुरुआत से अक्षर लेता है।","First 3 letters of B2.","B2 के पहले 3 अक्षर।","=LEFT(B2,3)"],
["RIGHT","RIGHT(text, [num_chars])","Returns characters from the end of text.","टेक्स्ट के अंत से अक्षर लेता है।","Last 5 letters of B2.","B2 के आखिरी 5 अक्षर।","=RIGHT(B2,5)"],
["MID","MID(text, start, length)","Returns characters from the middle of text.","टेक्स्ट के बीच से अक्षर लेता है।","Take 5 letters of B2 starting at position 7.","B2 में स्थिति 7 से 5 अक्षर लें।","=MID(B2,7,5)"],
["LEN","LEN(text)","Counts characters, including spaces.","स्पेस सहित अक्षर गिनता है।","Count the characters in B4.","B4 के अक्षर गिनें।","=LEN(B4)"],
["TRIM","TRIM(text)","Removes extra spaces.","अतिरिक्त स्पेस हटाता है।",'Clean the text "  Excel   Lab " with TRIM.','"  Excel   Lab " को TRIM से साफ़ करें।','=TRIM("  Excel   Lab ")'],
["UPPER","UPPER(text)","Converts text to capitals.","टेक्स्ट को बड़े अक्षरों में बदलता है।","Show B2 in capitals.","B2 को कैपिटल में दिखाएँ।","=UPPER(B2)"],
["LOWER","LOWER(text)","Converts text to small letters.","टेक्स्ट को छोटे अक्षरों में बदलता है।","Show B3 in small letters.","B3 को छोटे अक्षरों में दिखाएँ।","=LOWER(B3)"],
["PROPER","PROPER(text)","Capitalizes the first letter of each word.","हर शब्द का पहला अक्षर बड़ा करता है।",'Fix the case of "anshu singh of satna".','"anshu singh of satna" का केस ठीक करें।','=PROPER("anshu singh of satna")'],
["CONCAT","CONCAT(text1, text2, ...)","Joins text together.","टेक्स्ट को जोड़ता है।",'Make "Name - Dept" for row 2, like Rahul Verma - HR.',"पंक्ति 2 के लिए “नाम - विभाग” बनाएँ।",'=CONCAT(B2," - ",C2)'],
["TEXTJOIN","TEXTJOIN(delimiter, ignore_empty, text1, ...)","Joins many items with a separator.","कई आइटम को सेपरेटर के साथ जोड़ता है।","Join the names in B2:B4 with a comma and space.","B2:B4 के नाम कॉमा और स्पेस से जोड़ें।",'=TEXTJOIN(", ",TRUE,B2:B4)'],
["FIND","FIND(find_text, within_text)","Returns the position of text inside other text (case-sensitive).","टेक्स्ट के अंदर किसी टेक्स्ट की स्थिति बताता है।","Find the position of the space in B2.","B2 में स्पेस की स्थिति निकालें।",'=FIND(" ",B2)'],
["SUBSTITUTE","SUBSTITUTE(text, old, new)","Replaces matching text with new text.","मिलते टेक्स्ट को नए टेक्स्ट से बदलता है।","Replace Indore with Satna in D2.","D2 में Indore को Satna से बदलें।",'=SUBSTITUTE(D2,"Indore","Satna")']];
const TD={};TR.forEach(r=>TD[r[0]]={fx:r[1],en:r[2],hi:r[3],te:r[4],th:r[5],sol:r[6]});
const FL=LV.flatMap((l,i)=>l[2].split(", ").map((n,k)=>[i,k,n]));
function expected(sol){const keep=raw;load(D);let v;try{v=ev(parse(tok(sol.slice(1))),[])}finally{raw=keep}return v}
function topicInfo(){const m=/^t-(\d+)-(\d+)$/.exec(location.hash.slice(1));if(!m)return null;const i=+m[1],k=+m[2],l=LV[i];if(!l)return null;const n=l[2].split(", ")[k];return n?{i,k,l,n}:null}
const DM={IF:["i","Marks >= 40"],SUMIF:["s","HR"],VLOOKUP:["v","103"]};
function setTopic(){const o=topicInfo();load(D);sel="B12";hn=0;cur=-1;if(!o)return;const d=TD[o.n];
if(d){EX[4]={lv:{en:"Topic lab",hi:"टॉपिक लैब"},task:{en:d.te,hi:d.th},exp:expected(d.sol),sol:d.sol,
hints:[{en:"Syntax: "+d.fx,hi:"सिंटैक्स: "+d.fx},{en:"Start with "+d.sol.slice(0,d.sol.indexOf("(")+1)+" … and use the cell references shown in the grid.",hi:"शुरुआत "+d.sol.slice(0,d.sol.indexOf("(")+1)+" … से करें और ग्रिड के सेल रेफ़रेंस इस्तेमाल करें।"}],ex:{en:d.en,hi:d.hi}};cur=4}
if(DM[o.n]){dm.mode=DM[o.n][0];dm.p=DM[o.n][1];dm.i=-1}}
V.topic=()=>{const o=topicInfo();if(!o)return`<div class="card"><a href="#courses">← ${t("courses")}</a></div>`;
const d=TD[o.n],f=FL.findIndex(x=>x[0]===o.i&&x[1]===o.k),pv=FL[f-1],nx=FL[f+1],lk=x=>`#t-${x[0]}-${x[1]}`,lvn=L({en:o.l[0],hi:o.l[1]});
return`<p><a href="#courses">← ${t("courses")}</a> · ${t("lvl")} ${o.i+1}: ${lvn}</p><h2>${o.n}</h2>
<div class="card"><h3>${t("what")}</h3><p>${d?L({en:d.en,hi:d.hi}):t("gw").replace("{n}",o.n).replace("{l}",o.i+1)}</p>${d?`<h3>${t("syntax")}</h3><p><code>${esc(d.fx)}</code></p>`:""}</div>
${DM[o.n]?`<div class="card"><h3>${t("anim")}</h3>${demoShell()}</div>`:""}
<div class="card"><h3>${t("labT")}</h3>${d?`<div id="exbox"></div>`:`<p><b>${t("gn")}</b></p>${["g1","g2","g3"].map(k=>`<label class="ck"><input type="checkbox"><span>${t(k).replace("{n}",o.n)}</span></label>`).join("")}<p><a href="#data"><button>${t("dT")}</button></a></p>`}
${toolbar()}<input id="fb" autocapitalize="off" autocomplete="off" spellcheck="false" aria-label="Formula bar"><div class="sc" id="gw" style="margin-top:8px">${gridHTML()}</div><div class="msg" id="st" role="status"></div></div>
<div class="row" style="justify-content:space-between">${pv?`<a href="${lk(pv)}"><button>← ${t("prev")}: ${pv[2]}</button></a>`:"<span></span>"}${nx?`<a href="${lk(nx)}"><button class="p">${t("next")}: ${nx[2]} →</button></a>`:""}</div>`};
