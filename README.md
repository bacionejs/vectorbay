## **VectorBay**  
*A hangar for building your spaceships.*

**VectorBay** is a minimalist vector drawing tool for designing symmetrical spaceships with precision and ease. Most vector apps are either too complex or too limited. VectorBay aims to hit the sweet spot: fast, focused, and built with game dev in mind.

---

### 🔧 Features

- **Grid Size Slider**  
  Adjust the drawing resolution to suit the level of detail you need.

- **Open Image**  
  Load a bitmap image as a background layer to trace over.

- **Undo**  
  Step back through your drawing history.

- **Clear**  
  Wipe the canvas clean and start from scratch.

- **Copy & Paste**  
  System clipboard support for easy transfer.

- **Edit Mode**  
  Select and reposition existing points.

- **Mirror**  
  Automatically mirror points for symmetrical spaceship designs. Choose full symmetry or mirror just one side.

- **Helper Function**  
  Convert your vector array to canvas-friendly paths.  
  Includes a sample usage pattern for drawing with `CanvasRenderingContext2D`.

---

### 🧰 Helper Function

This function converts your vector arrays into a `Path2D` object that can be rendered using `ctx.fill()` or `ctx.stroke()`.

```js
function shape(array, gridsize = 1, mirror = true) {
  let p = new Path2D;
  for (let i of array) {
    for (let x of mirror ? [1, -1] : [1]) {
      p.moveTo(x * i[0] / gridsize, i[1] / gridsize);
      for (let j = 2; j < i.length; j += 2)
        p.lineTo(x * i[j] / gridsize, i[j + 1] / gridsize);
    }
  }
  return p;
}
```

- `array`: An array of points (e.g., `[x1, y1, x2, y2, ...]`) or an array of such arrays.
- `gridsize`: The **pixel size of one grid square** in VectorBay. This matches the value you selected using the Grid Size Slider.
- `mirror`: If `true`, mirrors the shape across the vertical axis to create a full ship from a half design.

#### 🔍 Usage Example — Basic Ship

```js
ctx.fill(shape([0, -3, 2, 0, 0, 0], 20, true));
```

#### 🔍 Usage Example — Ship with Engine Flame

```js
ctx.fill(shape([
  [0, -3, 2, 0, 0, 0],     // ship body
  [0, 1, 1, 1, 0, 2]       // engine flame
], 20, true));
```

> ✅ **In Practice:** You can use `shape()` to define ships in vector space and apply `ctx.translate()`, `ctx.rotate()`, and `ctx.scale()` dynamically at draw time — for example, to rotate based on angle, or scale with health. This keeps your geometry clean and logic modular.

---

### 💡 Why Half-Ships?

Designing **half-ships** is a powerful feature:

- ✏️ **Easier to Edit**  
  You only need to tweak one side of your design — changes automatically mirror to the other side.

- 🧠 **Cleaner Code**  
  Mirroring keeps your shape arrays shorter and easier to maintain, especially for complex designs.

- ⚠️ **Note on Asymmetry**  
  If you're building **asymmetrical ships**, disable mirroring by setting `mirror` (a.k.a. `isHalfShip`) to `false`.  
  In that case, you’ll need to draw the entire shape manually.

---

### ⚠️ Limitations

- **No Curves**  
  Only straight-line polygonal shapes are supported.

- **Single Shape Only**  
  VectorBay currently only supports editing one shape at a time.  
  To use multiple shapes, create them individually and wrap them as sub-arrays:

```js
let fullShip = [shape1, shape2, shape3];
```
