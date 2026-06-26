let D=document,U=new URLSearchParams(location.search);
let M=U.get("m")!==null?+U.get("m"):1;
let s=U.get("p")||"kglcufko";
let p=[[...s.slice(0,2)],...s.slice(2).match(/.{1,6}/g)||[]] .map(a=>[...a].map(c=>c.charCodeAt()-107));
let hist=[],hIdx=-1,sel={i:-1,t:-1},drag=0;
let C=D.getElementById("C"),X=C.getContext("2d"),W,H,S;
let toolbar=D.getElementById("toolbar")

let save=()=>{
hist=hist.slice(0,hIdx+1);
hist.push(JSON.stringify(p));
hIdx++;
};
save();

function element(tag,parent){return (parent||document.body).appendChild(document.createElement(tag))}

let keys=[

{d:"M0 10 v-6 l5 -4 l5 4 v6 z",f:function home(){window.open("https://github.com/bacionejs/vectorbay", "_blank")}},
{d:"M2 5 h6 M5 2 v6",f:function add(){p.splice(sel.i+1,0,[0,0,0,0,0,0]);sel={i:sel.i+1,t:0};save();}},
{d:"M2 5 h6",f:function del(){p.splice(sel.i,1);sel={i:-1,t:-1};save();}},
{d:"M10 5 Q5 0  0 7 m0 -4 v4 h4",f:function undo(){p=JSON.parse(hist[--hIdx])}},
{d:"M0  5 Q5 0 10 7 m0 -4 v4 h-4",f:function redo(){p=JSON.parse(hist[++hIdx])}},
{d:"M3 8 h-2 v-8 h6 v2 h2 v8 h-6 v-8 h6",f:function copy(){
navigator.clipboard.writeText("https://github.com/bacionejs/vectorbay?"+
(!keys.mirror?"m=0&":"")+
"p="+String.fromCharCode(...p.flat(Infinity).map(n => n + 107)));
}},
{d:"M3 1 v8 M7 1 v8 M1 3 h8 M1 7 h8",f:function snap(){keys[this.f.name]^=1;}},
{d:"M5 6 m-3 -3 l3 3 l3 -3",f:function fill(){keys[this.f.name]^=1;}},
{d:"M4 5 m3 -3 l-3 3 l3 3",f:function mirror(){keys[this.f.name]^=1;}},
{d:"M1 5 A4 4 0 1 0 9 5 A4 4 0 1 0 1 5",f:function unclutter(){keys[this.f.name]^=1;}},

];

keys.forEach(k=>{
let e=element("div",toolbar);
e.innerHTML=`<svg viewBox="-5 -5 20 20"><path d="${k.d}" fill=none stroke="currentColor"/></svg>`
e.onclick=()=>{k.f();draw();}
k.e=e;
})

keys.mirror^=M;
keys.fill^=1;
keys.snap^=1;

function draw(){
  W=C.width=C.clientWidth;
  H=C.height=C.clientHeight;
  S=W/20;
  X.clearRect(0,0,W,H);
  X.save();
  X.translate(W/2,H/2);
  X.scale(S,S);
  keys.forEach(k=>k.e.style.background=keys[k.f.name]?"gray":"")
  if(!keys.unclutter){
    X.lineWidth=1/S;X.strokeStyle="#eee";X.beginPath();
    for(let i=-10;i<=10;i++){
      X.moveTo(i,-10);X.lineTo(i,10);
      X.moveTo(-10,i);X.lineTo(10,i);
    }
    X.stroke();
    X.strokeStyle="#ccc";X.beginPath();
    X.moveTo(0,-10);X.lineTo(0,10);
    X.moveTo(-10,0);X.lineTo(10,0);
    X.stroke();
  }
  let P=new Path2D();
  p.forEach((s,i)=>P[i?"bezierCurveTo":"moveTo"](...s));
  if(keys.mirror)P.addPath(P,new DOMMatrix([-1,0,0,1,0,0]));
  if(keys.fill){X.fillStyle="black";X.fill(P);}
  if(!keys.unclutter){
    X.lineWidth=2/S;X.strokeStyle="blue";X.stroke(P);
    let dp=(x,y,c,i,t)=>{
      X.fillStyle=(sel.i===i&&sel.t===t)?"lime":c;
      X.beginPath();X.arc(x,y,6/S,0,7);X.fill();
    };
    let ln=(x1,y1,x2,y2)=>{
      X.lineWidth=1.5/S;X.strokeStyle="purple";
      X.beginPath();X.moveTo(x1,y1);X.lineTo(x2,y2);X.stroke();
    };
    p.forEach((s,i)=>{
      if(i===0)dp(s[0],s[1],"red",0,0);
      else{
        let r=p[i-1],px=r.length>2?r[4]:r[0],py=r.length>2?r[5]:r[1];
        ln(px,py,s[0],s[1]);
        ln(s[4],s[5],s[2],s[3]);
        dp(s[0],s[1],"orange",i,1);
        dp(s[2],s[3],"orange",i,2);
        dp(s[4],s[5],"red",i,0);
      }
    });
  }
  X.restore();
}

let tx=e=>(e.offsetX-W/2)/S;
let ty=e=>(e.offsetY-H/2)/S;
C.onpointerdown=e=>{
  let x=tx(e),y=ty(e),md=0.6,b={i:-1,t:-1};
  let c=(px,py,i,t)=>{
    let d=Math.hypot(px-x,py-y);
    if(d<md){md=d;b={i,t};}
  };
  if(!keys.unclutter){
    p.forEach((s,i)=>{
      if(i===0)c(s[0],s[1],0,0);
      else{c(s[4],s[5],i,0);c(s[0],s[1],i,1);c(s[2],s[3],i,2);}
    });
  }
  sel=b;
  if(sel.i>-1)drag=1;
  draw();
};
C.onpointermove=e=>{
  if(!drag)return;
  let x=tx(e),y=ty(e),s=p[sel.i];
  if(keys.snap){x=Math.round(x);y=Math.round(y);}
  x=Math.max(-10,Math.min(10,x)),y=Math.max(-10,Math.min(10,y));
  if(sel.i===0){s[0]=x;s[1]=y;}
  else{
    if(sel.t===0){s[4]=x;s[5]=y;}
    else if(sel.t===1){s[0]=x;s[1]=y;}
    else{s[2]=x;s[3]=y;}
  }
  draw();
};
C.onpointerup=()=>{if(drag){drag=0;save();}};
window.onresize=draw;
setTimeout(draw,0);
