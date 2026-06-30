let U=new URLSearchParams(location.search),M=U.get("m")||1,A=decode(U.get("p")||"[[0,-4],[1,-8,10,-5,0,4]]"); 
let hist=[],sel={i:-1,t:-1},drag=0,tx=e=>(e.offsetX-W/2)/S,ty=e=>(e.offsetY-H/2)/S,save=()=>{hist.splice(hist.i+1);hist.push(JSON.stringify(A));hist.i++;};
let toolbar=element("div",document.body,"toolbar"),C=element("canvas"),X=C.getContext("2d"),W,H,S,{round,max,min,hypot}=Math;
C.onpointerdown=e=>{sel=getpoint(tx(e),ty(e));drag=sel.i>-1;draw();}; C.onpointerup=()=>{if(drag){drag=0;save();}};
C.onpointermove=e=>{if(!drag)return;let x=tx(e),y=ty(e);keys.snap&&(x=round(x),y=round(y));x=max(-10,min(10,x));y=max(-10,min(10,y));setpoint(x,y);draw();}
let keys=[
{d:"M0 10 v-6 l5 -4 l5 4 v6 z",            f:function home(){window.open("https://github.com/bacionejs/vectorbay", "_blank")}},
{d:"M2 5 h6 M5 2 v6",                      f:function add(){A.splice(sel.i+1,0,[0,0,0,0,0,0]);sel={i:sel.i+1,t:0};save();}},
{d:"M2 5 h6",                              f:function del(){A.splice(sel.i,1);sel={i:-1,t:-1};save();}},
{d:"M10 5 Q5 0  0 7 m0 -4 v4 h4",          f:function undo(){A=JSON.parse(hist[--hist.i])}},
{d:"M0  5 Q5 0 10 7 m0 -4 v4 h-4",         f:function redo(){A=JSON.parse(hist[++hist.i])}},
{d:"M3 8 h-2 v-8 h6 v2 h2 v8 h-6 v-8 h6",  f:function copy(){navigator.clipboard.writeText(encode());}},
{d:"M3 1 v8 M7 1 v8 M1 3 h8 M1 7 h8",      f:function snap(){keys[this.f.name]^=1;}},
{d:"M5 6 m-3 -3 l3 3 l3 -3",               f:function fill(){keys[this.f.name]^=1;}},
{d:"M4 5 m3 -3 l-3 3 l3 3",                f:function mirror(){keys[this.f.name]^=1;}},
{d:"M1 5 A4 4 0 1 0 9 5 A4 4 0 1 0 1 5",   f:function unclutter(){keys[this.f.name]^=1;}},
];
keys.forEach(k=>{let e=element("div",toolbar,"keys");e.innerHTML=`<svg viewBox="-5 -5 20 20"><path d="${k.d}" fill=none stroke="currentColor"/></svg>`;e.onclick=()=>{k.f();draw();};e.ref=k;k.e=e;})
keys.mirror^=M;keys.fill^=1;keys.snap^=1;window.onresize=draw;setTimeout(draw,0);hist.i=-1;save();
// function decode(s){return[[...s.slice(0,2)],...s.slice(2).match(/.{1,6}/g)||[]] .map(a=>[...a].map(c=>c.charCodeAt()-107));}
function decode(s){return JSON.parse(s);}
// function encode(){return"https://bacionejs.github.io/vectorbay?"+(!keys.mirror?"m=0&":"")+"p="+String.fromCharCode(...A.flat(Infinity).map(n => n + 107));}
// function encode(){return JSON.stringify(A);}
// function encode(){return"http://127.0.0.1:8080/myapps/dev/vectorbay?"+(!keys.mirror?"m=0&":"")+"p="+String.fromCharCode(...A.flat(Infinity).map(n => n + 107));}
function encode(){return"https://bacionejs.github.io/vectorbay?"+(!keys.mirror?"m=0&":"")+"p="+JSON.stringify(A);}
function grid(){ X.lineWidth=1/S; for(let i=-10;i<11;i++) X.strokeStyle=i?"#eee":"#ccc", X.beginPath(), X.moveTo(i,-10),X.lineTo(i,10), X.moveTo(-10,i),X.lineTo(10,i), X.stroke(); }
function getpoint(x,y){let m=.6,b={i:-1,t:-1},c=(x1,y1,i,t)=>{let d=Math.hypot(x1-x,y1-y);d<m&&(m=d,b={i,t})};A.forEach((s,i)=>i?(c(s[4],s[5],i,0),c(s[0],s[1],i,1),c(s[2],s[3],i,2)):c(...s,0,0));return b;}
function setpoint(x,y){let s=A[sel.i],i=sel.i?sel.t?sel.t*2-2:4:0;s[i]=x;s[i+1]=y;}
function toggle(){keys.forEach(k=>k.e.style.background=keys[k.f.name]?"gray":"")}
function scale(){W=C.width=C.clientWidth;H=C.height=C.clientHeight;S=W/20;X.clearRect(0,0,W,H);X.translate(W/2,H/2);X.scale(S,S);}
function draw(){toggle();scale();if(keys.unclutter){shape()}else{grid();shape();points();}}
function shape(){let p=new Path2D();A.forEach((s,i)=>p[i?"bezierCurveTo":"moveTo"](...s));if(keys.mirror)p.addPath(p,new DOMMatrix([-1,0,0,1,0,0])); fill(p);}
function fill(p){ if(keys.fill){X.fillStyle="black";X.fill(p);}; X.lineWidth=2/S;X.strokeStyle="blue";X.stroke(p);}
function P(x,y,c,i,t){X.fillStyle=(sel.i==i&&sel.t==t)?"lime":c;X.beginPath();X.arc(x,y,6/S,0,7);X.fill();}
function L(x1,y1,x2,y2){X.lineWidth=1.5/S;X.strokeStyle="purple";X.beginPath();X.moveTo(x1,y1);X.lineTo(x2,y2);X.stroke();}
function points(){A.forEach((s,i)=>{let [a,b]=A[i-1]?.slice(i==1?0:-2)||[],[c,d,e,f,g,h]=s;if(i==0){P(c,d,"red",0,0);return;}L(a,b,c,d);L(e,f,g,h);P(c,d,"orange",i,1);P(e,f,"orange",i,2);P(g,h,"red",i,0);});}
function element(tag,p=document.body,c){let e=p.appendChild(document.createElement(tag));if(c)e.className=c;return e;}
element("style").textContent=`
*{margin:0;box-sizing:border-box;touch-action:none;user-select:none;} body{display:flex;} canvas{width:100dvmin;aspect-ratio:1;background:#fff;border:1px solid black;}
.toolbar{display:flex;background:silver;} .keys{display:grid;place-items:center;border:1px solid black;width:10cqmin;aspect-ratio:1;} .keys:active{background:gray}
@media(orientation:portrait ){body{flex-direction:column} .toolbar{flex-direction:row}} @media(orientation:landscape){body{flex-direction:row} .toolbar{flex-direction:column}}
`;
