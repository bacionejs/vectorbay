

<img width="50%" src="https://github.com/user-attachments/assets/8baaf088-0abf-4055-998d-aebd6dd43a4c" />

---

👉[Try it](https://bacionejs.github.io/vectorbay)  

---

> [!WARNING]
> Only supports a continuous path  

Draw your shape, click `copy` and paste the shape into your code.  
Example code:
```
<canvas id="C"></canvas> <script> 
let X=C.getContext("2d"),P=new Path2D();
C.width=C.height=400; X.translate(200,200); X.scale(20,20);
let p=[[0,-4],[1,-8,10,-5,0,4]];
p.map((a,i)=>P[i?"bezierCurveTo":"moveTo"](...a));
P.addPath(P,new DOMMatrix([-1,0,0,1,0,0])); // Delete line if non-mirrored
X.fill(P);
</script>
```

---

Heart  

<img width="20%" src="https://github.com/user-attachments/assets/2b03cbd8-2e26-4fae-9cba-97211da65907" />  
  
https://bacionejs.github.io/vectorbay?p=[[0,-4],[1,-8,10,-5,0,4]]  

---

Elephant (eyes were created by overlapping paths) 

<img width="20%" src="https://github.com/user-attachments/assets/e97100b8-6cd7-4a1e-b334-ecc0109ea5f5" />  

https://bacionejs.github.io/vectorbay?p=[[0,-7],[1,-8,2,-8,3,-7],[9,-10,9,-6,9,-2],[9,1,8,2,7,4],[5,4,5,3,3,1],[4,3,4,5,5,6],[3,5,2,3,2,3],[2,5,1,10,0,9],[0,3,0,0,0,-2],[3,-2,2,-2,3,-3],[5,-5,2,-4,0,-2]]  

---

Spaceship

<img width="20%" src="https://github.com/user-attachments/assets/04d1d53d-ba71-48e8-bb6c-b761e4bd5acc" />

https://bacionejs.github.io/vectorbay?p=[[0,-9],[1,-6,1,-4,2,-1],[2,0,3,0,3,1],[3,0,3,-1,3,-2],[4,-2,4,-2,5,-2],[5,-1,5,1,5,2],[5,2,6,2,6,2],[7,1,8,0,9,-1],[9,1,8,3,8,5],[6,6,5,8,3,9],[3,8,3,7,3,6],[3,6,2,5,2,5],[2,5,2,6,2,6],[1,6,1,6,0,6]]  

---

Mermaid (use m=0 for non-mirrored shape)  

<img width="20%" src="https://github.com/user-attachments/assets/32b4b1c7-83b8-4593-a607-901ec4178a30" />  

https://bacionejs.github.io/vectorbay?m=0&p=[[-8,0],[-8,0,-9,-1,-10,-4],[-4,-2,-6,-2,-4,1],[-2,2,-1,1,-1,0],[-1,-4,2,0,5,-2],[7,-3,6,-4,4,-3],[0,-2,-1,-3,-3,-5],[2,-2,6,-8,8,-4],[2,-6,8,-7,9,-5],[10,-4,9,-3,10,-3],[9,-2,9,-1,7,-2],[6,1,6,0,4,0],[1,0,2,0,0,2],[-2,4,-6,0,-10,5],[-10,3,-10,2,-8,0]]    

---
