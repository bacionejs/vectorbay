
---

👉[Try it](https://bacionijs.github.io/vectorbay)  

---

> [!WARNING]
> Only supports a continuous path  

Draw your shape, click `copy` and paste the shape into your code.  
Example code:
```html
<canvas id="C"></canvas> <script> 
let X=C.getContext("2d"), t=0, p=[[0,-4],[1,-8,10,-5,0,4]];
C.width=C.height=400;

(function draw() {
    X.setTransform(1,0,0,1,0,0); X.clearRect(0,0,400,400); 
    X.translate(200,200); X.scale(20,20);
    let P=new Path2D(); t+=0.15;
    
    p.map((a,i) => {
        let n = a; // Comment out for animation
        // let n = a.map((x,j) => j&1 ? x+Math.sin(t+a[j-1]*.2)*1 : x); // Uncomment for animation
        P[i?"bezierCurveTo":"moveTo"](...n);
    });
    
    P.addPath(P,new DOMMatrix([-1,0,0,1,0,0])); // Delete line if non-mirrored
    X.fill(P);
    
    // requestAnimationFrame(draw); // Uncomment to loop animation
})();
</script>


---

Spaceship

https://bacionejs.github.io/vectorbay?p=[[0,-9],[1,-6,1,-4,2,-1],[2,0,3,0,3,1],[3,0,3,-1,3,-2],[4,-2,4,-2,5,-2],[5,-1,5,1,5,2],[5,2,6,2,6,2],[7,1,8,0,9,-1],[9,1,8,3,8,5],[6,6,5,8,3,9],[3,8,3,7,3,6],[3,6,2,5,2,5],[2,5,2,6,2,6],[1,6,1,6,0,6]]  

---

Dolphin (use m=0 for non-mirrored shape)  
 
https://bacionejs.github.io/vectorbay?m=0&p=[[-0.2,-3.8],[1,-4.5,-2,-7.3,2,-4.5],[3.6,-3.3,7,-4,7,-2],[8.8,-1.4,9.2,-0.8,6.4,-1.2],[5.1,-1.4,6,-1,4,-1],[4,0,0.8,3.2,2.2,0.1],[4,-3,-0.4,0.4,-5,-0.1],[-9,5.1,-6.2,0.1,-7,-0.8],[-6.4,-1.8,-9.9,-5.4,-4.8,-1.9],[-3.8,-1.8,-3.3,-2.1,-1.5,-3.1]]

---
