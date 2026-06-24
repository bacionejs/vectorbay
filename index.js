let D=document,U=new URLSearchParams(location.search);
let defP="[[0,-4],[1,-8,10,-5,0,4]]";
let p=JSON.parse(U.get("p")||defP);
let M=U.get("m")!==null?+U.get("m"):1;

let st=[0,0,0,0,0,0,0,1,1,M,0];
let hist=[],hIdx=-1,sel={i:-1,t:-1},drag=0;
let C=D.getElementById("C"),X=C.getContext("2d"),W,H,S;
let toolbar=D.getElementById("toolbar"),btns=[];

let save=()=>{
hist=hist.slice(0,hIdx+1);
hist.push(JSON.stringify(p));
hIdx++;
};
save();

let svg=[
"M2 5 h6 M5 2 v6",//add
"M2 5 h6",//delete
"M10 5 Q5 0  0 7 M0  2 v5 h5",//undo
"M0  5 Q5 0 10 7 M10 2 v5 h-5",//redo
"M8.696 3.469 m0 -3 v3 h-3 m3 0 A4 4 0 1 0 8.696 6.531",//reset
"M3 8 h-2 v-8 h6 v2 h2 v8 h-6 v-8 h6",//copy
"M3 1 v8 M7 1 v8 M1 3 h8 M1 7 h8",//snap
"M5 6 m-3 -3 l3 3 l3 -3",//fill
"M4 5 m3 -3 l-3 3 l3 3",//mirror
"M1 5 A4 4 0 1 0 9 5 A4 4 0 1 0 1 5",//unclutter
];

for(let i=1;i<=10;i++){
  let b=D.createElement("div");
  b.innerHTML=`<svg viewBox="-5 -5 20 20"><path d="${svg[i-1]}" fill=none stroke="currentColor"/></svg>`
  toolbar.appendChild(b);
  btns.push(b);
  b.onclick=()=>{
    if(i===1&&sel.i>-1){p.splice(sel.i+1,0,[0,0,0,0,0,0]);sel={i:sel.i+1,t:0};save();}
    if(i===2&&sel.i>0){p.splice(sel.i,1);sel.i--;save();}
    if(i===3&&hIdx>0)p=JSON.parse(hist[--hIdx]);
    if(i===4&&hIdx<hist.length-1)p=JSON.parse(hist[++hIdx]);
    if(i===5){p=JSON.parse(defP);save();}
    if(i===6)navigator.clipboard.writeText(JSON.stringify(p));
    if(i>6)st[i]^=1;
    draw();
  };
}

function draw(){
  W=C.width=C.clientWidth;
  H=C.height=C.clientHeight;
  S=W/20;
  for(let i=7;i<=10;i++){
    btns[i-1].style.background=st[i]?"gray":"";
  }
  X.clearRect(0,0,W,H);
  X.save();
  X.translate(W/2,H/2);
  X.scale(S,S);
  if(!st[10]){
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
  if(st[9])P.addPath(P,new DOMMatrix([-1,0,0,1,0,0]));
  if(st[8]){X.fillStyle="black";X.fill(P);}
  if(!st[10]){
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
  if(!st[10]){
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
  if(st[7]){x=Math.round(x);y=Math.round(y);}
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
