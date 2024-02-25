const bb = document.body.getBoundingClientRect();
//Create the SVG element
const SVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
SVG.setAttribute("viewBox", `0 0 ${bb.width} ${bb.height}`);
SVG.setAttribute("id", "canvas");
//Create the group element that holds the guide lines
const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
g.setAttribute("id", "gl");
g.setAttribute("stroke-width", "1");
g.setAttribute("stroke", "#00000011");
g.setAttribute("fill", "none");
//Create the group element that holds all drawn objects/shapes
const obj = document.createElementNS("http://www.w3.org/2000/svg", "g");
obj.setAttribute("id", "objects");
//Create group for selection lines
const sl = document.createElementNS("http://www.w3.org/2000/svg", "g");
const rct = document.createElementNS("http://www.w3.org/2000/svg", "rect");
rct.setAttribute("x", "-9999");
rct.setAttribute("y", "-9999");
rct.setAttribute("width", "0");
rct.setAttribute("height", "0");
rct.setAttribute("id", "rect-sel");
//center of the selection rect
const crct = document.createElementNS("http://www.w3.org/2000/svg", "circle");
crct.setAttribute("cx", "-9999");
crct.setAttribute("cy", "-9999");
crct.setAttribute("r", "0");
crct.setAttribute("id", "rcs");
sl.setAttribute("id", "selection-shapes");
sl.setAttribute("fill", "none");
sl.appendChild(rct);
sl.appendChild(crct);
//appendages
SVG.appendChild(g);
SVG.appendChild(obj);
SVG.appendChild(sl);
SVG.addEventListener("mouseout", () => {
  try {
    mouseUp();
  } catch (e) {}
});
SVG.addEventListener("mousedown", mouseDown);
SVG.addEventListener("mouseup", mouseUp);
SVG.addEventListener("mousemove", mouseMoved);
//SVG.addEventListener("click", e => console.log(e.target));
document.body.appendChild(SVG);
dml(20, 20);
const primitives = {
  circle,
  neutral,
  svg,
  shape,
};
primitives.svg.x.l("canvas");
primitives.svg.y.l("canvas");
primitives.svg.width.l("canvas");
primitives.svg.height.l("canvas");
primitives.svg.viewbox.l("canvas");
primitives.svg.preserveAspectRatio.l("canvas");
/**
 * @summary The number of pixels (length) a mouse click must drag before it can be considered as a 'mouse drag'.
 * @constant {6} DELTA
 * @type {6}
 */
const DELTA = 6;
/**
 * @summary Contains a Cartesian point - the location holding the initial click of the mouse on the drawing canvas -
 * and other info to properly manage the drawing of a shape or object. This represents the selected object to be drawn.
 * @typedef {Object} Context
 * @property {Point} pt contains the location of the initial click of the user on the canvas. This location has been
 * translated from the client points (`MouseEvent.clientX` and `MouseEvent.clientY`) to element (SVG canvas) coordinate.
 * @property {Point} cl contains the client location where the initial click was made.
 * @property {string[]} id the list of HTML ids of the currently selected shapes, objects or elements.
 */
/**@type {Context}*/
let cxt = { id: [], attributes: {} };
/**The stack of shapes. The first shape/object is `0`, the next is `1` and so on...*/
let st = 0;
/**@type {HTMLDialogElement} */
const dialog = document.getElementById("init-attr");

const body = dialog.querySelector(".body");
body.appendChild(fill.def.l());
body.appendChild(fillOpacity.def.l());
body.appendChild(fillRule.def.l());
body.appendChild(stroke.def.l());
body.appendChild(strokeOpacity.def.l());
body.appendChild(strokeWidth.def.l());
body.appendChild(shapeRendering.def.l());
body.appendChild(vectorEffect.def.l());
body.appendChild(strokeDashOffset.def.l());
body.appendChild(lineCap.def.l());
body.appendChild(strokeLineJoin.def.l());
body.appendChild(strokeMiterLimit.def.l());
dialog.querySelector(".foot button[type='submit']").onclick = (e) => {
  cxt.attributes.fill = (!document.getElementById("fill-type-vis").checked) ? document.getElementById("fill").dataset.fill : undefined;
  cxt.attributes.stroke = (!document.getElementById("stroke-type-vis").checked) ? document.getElementById("stroke").dataset.stroke : undefined;
  cxt.attributes["fill-opacity"] = (!document.getElementById("fill-opacity-vis").checked) ? fillOpacity.def.v() : undefined;
  cxt.attributes["fill-rule"] = (!document.getElementById("fill-rule-vis").checked) ? fillRule.def.v() : undefined;
  cxt.attributes["stroke-opacity"] = (!document.getElementById("stroke-opacity-vis").checked) ? strokeOpacity.def.v() : undefined;
  cxt.attributes["stroke-width"] = (!document.getElementById("stroke-width-vis").checked) ? strokeWidth.def.v() : undefined;
  cxt.attributes["shape-rendering"] = (!document.getElementById("shape-rendering-vis").checked) ? shapeRendering.def.v() : undefined;
  cxt.attributes["vector-effect"] = (!document.getElementById("vector-effect-vis").checked) ? vectorEffect.def.v() : undefined;
  cxt.attributes["stroke-dashoffset"] = (!document.getElementById("stroke-dashoffset-vis").checked) ? strokeDashOffset.def.v() : undefined;
  cxt.attributes["stroke-linecap"] = (!document.getElementById("stroke-linecap-vis").checked) ? lineCap.def.v() : undefined;
  cxt.attributes["stroke-linejoin"] = (!document.getElementById("stroke-linejoin-vis").checked) ? strokeLineJoin.def.v() : undefined;
  cxt.attributes["stroke-miterlimit"] = (!document.getElementById("stroke-miterlimit-vis").checked) ? strokeMiterLimit.def.v() : undefined;
};
/**
 * @summary Was supposed to be for opening the side bar
 * @returns {void}
 */
function toggleSideBar() {
  document.querySelector("nav").classList.toggle("open");
}
/**
 * @summary Called whenever an `onchange` is detected in the primitives select box.
 * @returns {void}
 */
function onSelPrim() {
  const cv = document.querySelector("#canvas");
  const val = document.querySelector("#prims").value;
  if (
    val &&
    val.length > 0 &&
    val !== "neutral" &&
    document.getElementById("disable-modal").checked
  ) {
    /**@type {HTMLDialogElement} */
    const dialog = document.getElementById("init-attr");

    dialog.show();
  }
  // primitives[val].dialog.l();
  //const cl = document.querySelector("#canvas").classList;
  //if(document.querySelector("#prims").value.length > 0 && !cl.contains("insert")) cl.add("insert");//cl.toggle("insert");
  if (val.length > 0) {
    cv.setAttribute("data-action", "insert");
  }
}
/**
 * @summary Draws the horizontal measurement lines
 * @param {DOMRect} b the `DOMRect` (rectangle) in which the lines are to be drawn
 * @param {Element} gl an element that is a child of the `SVGElement` which will be the
 * parent of the drawn lines.
 * @param {number} [y=0] the `y` point on the cartesian plane from which the initial line will be drawn
 * @param {number} [xs=5] the number of pixels between the horizontal lines
 * @returns {void}
 */
function hl(b, gl, y = 0, xs = 5) {
  // Draw the horizontal line
  while (y < b.height) {
    const l = document.createElementNS("http://www.w3.org/2000/svg", "line");
    l.setAttribute("x1", "0");
    l.setAttribute("y1", y + "");
    l.setAttribute("x2", b.width + "");
    l.setAttribute("y2", y + "");

    y += xs;
    gl.appendChild(l);
  }
}
/**
 * @summary Draws the vertical measurement lines
 * @param {DOMRect} b the `DOMRect` (rectangle) in which the lines are to be drawn
 * @param {Element} gl an element that is a child of the `SVGElement` which will be the
 * parent of the drawn lines.
 * @param {number} [x=0] the `x` point on the cartesian plane from which the initial line will be drawn
 * @param {number} [ys=5] the number of pixels between the vertical lines
 * @returns {void}
 */
function vl(b, gl, x = 0, ys = 5) {
  // Draw the vertical line
  while (x < b.width) {
    const l = document.createElementNS("http://www.w3.org/2000/svg", "line");
    l.setAttribute("x1", x + "");
    l.setAttribute("y1", "0");
    l.setAttribute("x2", x + "");
    l.setAttribute("y2", b.height + "");

    x += ys;
    gl.appendChild(l);
  }
}
/**
 * @summary Draws the measurement lines
 * @param {number} [xs=5] the number of pixels between the horizontal lines
 * @param {number} [ys=5] the number of pixels between the vertical lines
 * @returns {void}
 */
function dml(xs = 5, ys = 5) {
  const svg = document.querySelector("svg#canvas");
  const gl = svg.getElementById("gl");
  const b = svg.getBoundingClientRect();
  let x = 0;
  let y = 0;
  hl(b, gl, y, xs);
  vl(b, gl, x, ys);
}
/**
 * @summary handles the click events fired when the mouse is held down.
 * @description this just instantiates the `cxt` object by populating it, so that when `mousemove` checks for it's nullability,
 * then it may known that this is a click and drag event if `cxt` is non-null.
 * @param {MouseEvent} e
 * @returns {void}
 */
function mouseDown(e) {
  if (e.button === 0) {
    //left mouse button
    /**@type {HTMLSelectElement} */
    const pr = document.querySelector("#prims");
    primitives[pr.value || "neutral"].md(e);
  }
}
/**
 * @summary handles the click events fired when the mouse is released.
 * @description this just invalidates the `cxt` object by setting it to `null`.
 * @param {MouseEvent} e the mouse event to be triggered.
 * @returns {void}
 */
function mouseUp(e) {
  const pr = document.querySelector("#prims");
  primitives[pr.value || "neutral"].mu(e);

  //cv.classList.remove("insert");
  document.querySelector(".state").textContent = "";
  onSelObj(id[0]);
  pr.value = "neutral";
  //cxt = null;
  document.getElementById("canvas").setAttribute("data-action", "select");
}
/**
 * @summary handles the click events fired when the mouse is moved.
 * @description this
 * @param {MouseEvent} e
 * @returns {void}
 */
function mouseMoved(e) {
  const rect = document.querySelector("#canvas").getBoundingClientRect();
  document.querySelector(".loc").textContent =
    "[" + (e.clientX - rect.left) + ", " + (e.clientY - rect.top) + "]";
  // if(e.button === 0 && (Math.abs(e.clientX - cxt.px) >= DELTA || Math.abs(e.clientY - cxt.py) >= DELTA)) console.log(e.button);
  if (
    cxt.cl &&
    cxt.pt &&
    (Math.abs(e.clientX - cxt.cl.x) >= DELTA ||
      Math.abs(e.clientY - cxt.cl.y) >= DELTA)
  ) {
    //click & drag
    const pr = document.querySelector("#prims");
    primitives[pr.value || "neutral"].mm(e);
  }
}
/**
 * @summary Called whenever an `onchange` is detected in the primitives select box.
 * @returns {void}
 */
function onSelObj(id) {
  if (id) {
    /**@type {SVGGraphicsElement} */
    const sp = document.getElementById(id); //.getBoundingClientRect();
    if (!sp) return;
    const attr = document.querySelector("li.attributes .attr");
    while (attr.firstChild) attr.removeChild(attr.lastChild);
    const cv = document.getElementById("canvas");
    switch (sp.tagName) {
      default:
        return;
      case "circle": {
        const rct = document.querySelector("g#selection-shapes > #rect-sel");
        /*const r = Number(sp.getAttribute("r"));
				const rect = {
					x: Number(sp.getAttribute("cx")) - r,
					y: Number(sp.getAttribute("cy")) - r,
					w: r+r,
					h: r+r
				};*/

        const r = sp.getBBox();
        const rect = {
          x: r.x,
          y: r.y,
          w: r.width,
          h: r.height,
        };

        //guide lines for the selected circle
        rct.setAttribute("x", rect.x);
        rct.setAttribute("y", rect.y);
        rct.setAttribute("width", rect.w);
        rct.setAttribute("height", rect.h);

        //attributes of a circle

        //cx
        let li = document.createElement("li");
        li.setAttribute("class", "attribute");

        let lb = document.createElement("label");
        lb.setAttribute("for", id + "-cx");
        lb.textContent = "cx";
        li.appendChild(lb);

        let ip = document.createElement("input");
        ip.setAttribute("type", "number");
        ip.setAttribute("name", id + "-cx");
        ip.setAttribute("id", id + "-cx");
        ip.value = sp.getAttribute("cx");
        li.appendChild(ip);
        attr.appendChild(li);

        //cy
        li = document.createElement("li");
        li.setAttribute("class", "attribute");

        lb = document.createElement("label");
        lb.setAttribute("for", id + "-cy");
        lb.textContent = "cy";
        li.appendChild(lb);

        ip = document.createElement("input");
        ip.setAttribute("type", "number");
        ip.setAttribute("name", id + "-cy");
        ip.setAttribute("id", id + "-cy");
        ip.value = sp.getAttribute("cy");
        li.appendChild(ip);
        attr.appendChild(li);

        //r
        li = document.createElement("li");
        li.setAttribute("class", "attribute");

        lb = document.createElement("label");
        lb.setAttribute("for", id + "-r");
        lb.textContent = "r";
        li.appendChild(lb);

        ip = document.createElement("input");
        ip.setAttribute("type", "number");
        ip.setAttribute("name", id + "-r");
        ip.setAttribute("id", id + "-r");
        ip.value = sp.getAttribute("r");
        li.appendChild(ip);
        attr.appendChild(li);

        //id
        li = document.createElement("li");
        li.setAttribute("class", "attribute");

        lb = document.createElement("label");
        lb.setAttribute("for", id + "-id");
        lb.textContent = "id";
        li.appendChild(lb);

        ip = document.createElement("input");
        ip.setAttribute("name", id + "-id");
        ip.setAttribute("id", id + "-id");
        ip.value = sp.getAttribute("id");
        li.appendChild(ip);
        attr.appendChild(li);

        //stroke-width
        li = document.createElement("li");
        li.setAttribute("class", "attribute");

        lb = document.createElement("label");
        lb.setAttribute("for", id + "-stroke-width");
        lb.textContent = "stroke-width";
        li.appendChild(lb);

        ip = document.createElement("input");
        ip.setAttribute("type", "number");
        ip.setAttribute("name", id + "-stroke-width");
        ip.setAttribute("id", id + "-stroke-width");
        ip.value = sp.getAttribute("stroke-width");
        li.appendChild(ip);
        attr.appendChild(li);

        //stroke-dasharray
        li = document.createElement("li");
        li.setAttribute("class", "attribute");

        lb = document.createElement("label");
        lb.setAttribute("for", id + "-stroke-dasharray");
        lb.textContent = "stroke-dasharray";
        li.appendChild(lb);

        ip = document.createElement("input");
        ip.setAttribute("name", id + "-stroke-dasharray");
        ip.setAttribute("id", id + "-stroke-dasharray");
        ip.value = sp.getAttribute("stroke-dasharray") ?? "0";
        li.appendChild(ip);
        attr.appendChild(li);

        //stroke
        li = document.createElement("li");
        li.setAttribute("class", "attribute");

        lb = document.createElement("label");
        lb.setAttribute("for", id + "-stroke");
        lb.textContent = "stroke";
        li.appendChild(lb);

        ip = document.createElement("input");
        ip.setAttribute("type", "color");
        ip.setAttribute("name", id + "-stroke");
        ip.setAttribute("id", id + "-stroke");
        ip.value = sp.getAttribute("stroke")
          ? "#00000000"
          : sp.getAttribute("stroke") === "none"
          ? "#00000000"
          : sp.getAttribute("stroke");
        li.appendChild(ip);
        attr.appendChild(li);

        //fill
        li = document.createElement("li");
        li.setAttribute("class", "attribute");

        lb = document.createElement("label");
        lb.setAttribute("for", id + "-fill");
        lb.textContent = "fill";
        li.appendChild(lb);

        ip = document.createElement("input");
        ip.setAttribute("type", "color");
        ip.setAttribute("name", id + "-fill");
        ip.setAttribute("id", id + "-fill");
        ip.value = sp.getAttribute("fill")
          ? "#00000000"
          : sp.getAttribute("fill") === "none"
          ? "#00000000"
          : sp.getAttribute("fill");
        li.appendChild(ip);
        attr.appendChild(li);
        break;
      }
    }
  }
}
/**
 * @summary Does `a` and `b` intersects?
 * @description Checks if both `DOMRect` objects intersects one another, and returns `true` if they do.
 * @param {DOMRect} a the first rectangle to be compared
 * @param {DOMRect} b the second rectangle to be compared
 * @returns {boolean} `true` if `a` intersects `b` else returns `false`.
 */
function intersects(a, b) {
  return (
    b.width + b.x >= a.x &&
    b.x <= a.x + a.width &&
    b.y <= a.y + a.height &&
    b.y + b.height >= a.y
  );
}
/**
 * @summary Does `a` contain and `b`?
 * @description Checks if the `DOMRect` object `a` contains `b` and returns `true` if it does.
 * @param {DOMRect} a the first rectangle to be compared
 * @param {DOMRect} b the second rectangle to be compared
 * @returns {boolean} `true` if `a` contains `b` else returns `false`.
 */
function contains(a, b) {
  return (
    a.x <= b.x &&
    a.y <= b.y &&
    a.x + a.width >= b.x + b.width &&
    a.y + a.height >= b.y + b.height
  );
}
/**
 * @summary Is `b` concentric to `a`?
 * @description Checks if both `DOMRect` objects are concentric and returns `true` if they are.
 * @param {DOMRect} a the first rectangle to be compared
 * @param {DOMRect} b the second rectangle to be compared
 * @returns {boolean} `true` if `a` and `b` have the same center else returns `false`.
 */
function isConcentric(a, b) {
  // const aR = a.x + a.width;//a.right
  // const aB = a.y + a.height;//a.bottom
  // const bR = b.x + b.width;//b.right
  // const bB = b.y + b.height;//b.bottom
  // return (aR / 2) === (bR / 2) && (aB / 2) === (bB / 2);
  return (
    (a.x + a.width) / 2 === (b.x + b.width) / 2 &&
    (a.y + a.height) / 2 === (b.y + b.height) / 2
  );
}
