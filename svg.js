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
 * Computes the distance between 2 points: this and the argument. This is meant to be implemented by a {@linkcode Line}.
 * @callback GetDistance
 * @param {Point} another the point to which the calcuation will be made
 * @returns {Line} a {@linkcode Line} that represents the distance between this and the argument.
 */
/**
 * An interface for working with points. This is an impelementation of a point.
 * @typedef {Object} Pointed
 * @property {GetDistance} dist gets the distance between this point and the argument
 * @property {(p: Point) => readonly [-1|0|1, -1|0|1]} pos Gets the position of this point in relation to the argument.
 * The returned value is 2-length tuple that contains `-1` (representing less), `0` (representing exactly) or
 * `1` (representing greater). The first element of the tuple is the relative position of the x-axis and the
 * 2nd is the relative position of the y-axis.\
 * This denotes the direction of P0 (this point) and P1 (argument).
 */
/**
 * Computes whether or not this line is perpendicular to the argument.
 * @callback IsPerpendicular
 * @param {Line} x the value to be tested for.
 * @returns {boolean} `true` if the argument is perpendicular this else returns `false`.
 */
/**
 * Computes a line formed from the given point and perpendicular to this line.
 * @callback ToPerpendicular
 * @param {Point} x the value to be computed.
 * @returns {Line} a line perpendicular to this line.
 */
/**
 * Computes whether or not this line passes through the given point, line or bound.
 * @callback Intersects
 * @param {Point | Line | Bound} x the value to be tested for.
 * @returns {boolean | Point} `true` (or the point of intersection) if the argument is on the boundary of this else returns `false`.
 */
/**
 * Computes whether or not this line is parallel to the given line.
 * @callback IsParallel
 * @param {Line} x the value to be tested for.
 * @returns {boolean} `true` if the argument is parallel to this else returns `false`.
 */
/**
 * Computes a line formed from the given point and parallel to this line.
 * @callback ToParallel
 * @param {Point} x the value to be computed.
 * @returns {Line} a line parallel to this.
 */
/**
 * An interface for working with lines. This is an implementation of a line.
 * @typedef {Object} Linear
 * @property {GetDistance} dist Calculates the line between the given point and this line.
 * @property {Intersects} int tests whether or not the argument intersects this line. To 'intersects` means the
 * object must have one of its points on the exact path traced by this line.
 * @property {IsParallel} par tests whether or not the argument is parallel to this line.
 * @property {ToParallel} top converts the point argument to a line parallel to this. The
 * {@linkcode Line.start} returned is the same as the argument.
 * @property {IsPerpendicular} perp tests whether or not the argument is perpendicular to this line. They may not
 * neccessarily intersect one another.
 * @property {ToPerpendicular} topp converts the point argument to a line perpendicular to this.
 * Note that the returned line may not intersects with this one. Also, the {@linkcode Line.start} of
 * the returned line is the same point as the argument.
 * @property {() => boolean} isV checks if this line is vertical
 * @property {() => boolean} isH checks if this line is horizontal
 * @property {()=>Rectangle & Rectangular} rect Gets the rectangle whose diagonal is this line.
 */
/**
 * Tests if the given value contains the point, line or bounded rectangle.
 * @callback Contains
 * @param {Point | Line | Bound} val the value to be tested
 * @returns {boolean} `true` if the argument is inside this rectangle.
 */
/**
 * @typedef {Object} Rectangular
 * @property {Contains} con tests if this rect contains any of the arguments
 * @property {Intersects} int tests if this rect intersects any of the arguments
 * @property {() => RightAngledTriangle} ur the upper-right triangle formed
 * by the top-left-down-right diagonal of this rect
 * @property {() => RightAngledTriangle} ll the lower-left triangle formed
 * by the top-left-down-right diagonal of this rect
 */
/**
 * Defines a size in a cartesian plane (2D).
 * @typedef {Object} Dimension
 * @property {number} w the width
 * @property {number} h the height
 */
/**
 * A location on a given 2-dimensional coordinate system with a specified `x` and `y` property.
 * @typedef {Object} Point
 * @property {number} x the position on the x-axis. This is in pixels.
 * @property {number} y the position on the y-axis. This is in pixels.
 */
/**
 * A location on a given 2-dimensional coordinate system with a specified `x` and `y` property.
 * @typedef {Object} Line
 * @property {Point} start the start position of the line.
 * @property {Point} end the end position of the line.
 * @property {()=>number} l the computed length (in pixels) of the line.
 * @property {()=>number} m the slope of the line. This will always be `Number.NaN` for vertical lines
 * and `0` for horizontal lines.
 * @property {()=>number} b the y-intercept of the line. This will always be `Number.NaN` for vertical
 * lines and equal to `Line.start.y || Line.end.y` for horizontal lines.
 */
/**
 * A right-angled triangle formed when the user clicks and drags on the screen
 * @typedef {Object} RightAngledTriangle
 * @property {Line} h the hypotenuse of this triangle, i.e the side facing the right-angle.\
 * In Pythagoras, `h`^2 = `o`^2 + `a`^2 i.e `h = sqrt((o**2) + (a**2))`.
 * @property {Line} o one of 2 sides that are not the hypotenuse of this triangle.\
 * In Pythagoras, `o`^2 = `a`^2 - `h`^2 i.e `o = sqrt((a**2) - (h**2))`.\
 * This is always on the right of the hypotenuse.
 * @property {Line} a one of 2 sides that are not the hypotenuse of this triangle.\
 * In Pythagoras, `a`^2 = `o`^2 - `h`^2 i.e `a = sqrt((o**2) - (h**2))`.\
 * This is always on the left of the hypotenuse.
 */
/**
 * A rectangle on a 2-diemsional plane.
 * @typedef {Object} Rectangle
 * @property {Point} c the coordinate of the top-left vertex
 * @property {Dimension} d the dimension of this rectangle specifying it's 2-D size.
 */
/**
 * @typedef {Object} Ellipse
 * @property {Line} rx half of the straight (horizontal) line cutting the ellipse in half and passing through it's centre.
 * @property {Line} ry half of the perpendicular (horizontal) line cutting the ellipse in half and passing through it's centre.
 */
/**
 * A Rectangular shape that surround a particular shape.
 * @typedef {Object} Bound
 * @property {Rectangle} cr the concentric rectangle on this bound.
 * @property {Ellipse} cc the concentric ellipse on this bound
 */
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
/**
 * @summary To {@linkcode Pointed}
 * @description Implements the pointed interface to the given `Point`
 * @param {Point} p the object which will extend the `Pointer` interface
 * @returns {Point & Pointed}
 */
function tPtd(p) {
  isV = (a) => a.start.x === a.end.x && a.start.y !== a.end.y;
  isH = (a) => a.start.y === a.end.y && l.start.x !== l.end.x;
  return {
    ...p,
    dist: (a) => {
      return {
        end: a,
        l: () =>
          Math.sqrt(
            Math.abs((Math.max(p.x, a.x) - Math.min(p.x, a.x)) ** 2) +
              Math.abs((Math.max(p.y, a.y) - Math.min(p.y, a.y)) ** 2)
          ),
        start: p,
        m: () =>
          isH({ start: p, end: a })
            ? 0
            : isV({ start: p, end: a })
            ? Number.NaN
            : (Math.max(p.y, a.y) - Math.max(p.y, a.y)) /
              (Math.max(p.x, a.x) - Math.max(p.x, a.x)),
        b: () =>
          isH({ start: p, end: a })
            ? p.y || a.y
            : isV({ start: p, end: a })
            ? Number.NaN
            : p.y -
              ((Math.max(p.y, a.y) - Math.max(p.y, a.y)) /
                (Math.max(p.x, a.x) - Math.max(p.x, a.x))) *
                p.x,
      };
    },
    pos: (pt) =>
      Object.freeze([
        p.x > pt.x ? 1 : p.x === pt.x ? 0 : -1,
        p.y > pt.y ? 1 : p.y === pt.y ? 0 : -1,
      ]),
  };
}
/**
 * @summary To {@linkcode Point}.
 * @description Converts a mouse pointer coordinate on the screen to an API-supported `Pointed` object.
 * @param {number} x the location on the x-axis
 * @param {number} y the location on the y-axis
 * @param {DOMRect} [rel] an optional relative bounds where the point is contained
 * @returns {Pointed & Point}
 */
function tP(x, y, rel) {
  return !rel
    ? tPtd({ x, y })
    : tPtd({
        x: x - rel.x,
        y: y - rel.y,
      });
}
/**
 * @todo: fix the `int` method for rectangle (not bounds). Also do so in the doc for `Linear`.
 * @summary To {@linkcode Line}
 * @description Converts a pair of points to an API-supported `Line` with `Linear` methods.
 * @param {Point} p1 the location on the x-axis
 * @param {Point} p2 the location on the y-axis
 * @returns {Line & Linear}
 */
function tl(p1, p2) {
  /**@type {Line & Linear}*/
  const l = tPtd(p1).dist(p2);
  l.dist = (p) => {
    //From JDK 1.2 (java.awt.geom.Line2D.ptLineDistSq)
    let x1 = l.start.x,
      x2 = l.end.x,
      y1 = l.start.y,
      y2 = l.end.y,
      px = p.x,
      py = p.y;
    x2 -= x1;
    y2 -= y1;
    px -= x1;
    py -= y1;
    let dp = px * x2 + py * y2;
    let prleSq; // = dp * dp / (x2 * x2 + y2 * y2);
    if (dp <= 0) prleSq = 0;
    else {
      px = x2 - px;
      py = y2 - py;
      dp = px * x2 + py * y2;
      if (dp <= 0) prleSq = 0;
      else prleSq = (dp * dp) / (x2 * x2 + y2 * y2);
    }
    let dq = px * px + py * py - prleSq;
    const ln = dq > 0 ? Math.sqrt(dq) : 0;
    return {
      end: { x: p.x + ln, y: p.y + ln },
      l: ln,
      start: p,
    };
  };
  l.int = (l2) => {
    if (l2.x && l2.y) {
      //a point
      return (
        l.start.x <= l2.x &&
        l.start.y <= l2.y &&
        l.end.x >= l2.x &&
        l.end.y >= l2.y
      );
    } else if (l2.start && l2.end) {
      //a line
      let x1 = l.start.x,
        x2 = l.end.x,
        y1 = l.start.y,
        y2 = l.end.y,
        x3 = l2.start.x,
        y3 = l2.start.y,
        x4 = l2.end.x,
        y4 = l2.end.y;

      // Check if none of the lines are of length 0
      if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
        return false;
      }

      let dn = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

      // Lines are parallel
      if (dn === 0) {
        return false;
      }

      let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / dn;
      let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / dn;

      // is the intersection along the segments
      if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
        return false;
      }

      // Return a object with the x and y coordinates of the intersection
      let x = x1 + ua * (x2 - x1);
      let y = y1 + ua * (y2 - y1);

      return { x, y };
    } else if (l2.cr && l2.cc) {
      //a rect

      return (
        l.int(l2.cr.t1.o) ||
        l.int(l2.cr.t1.a) ||
        l.int(l2.cr.t2.o) ||
        l.int(l2.cr.t2.a)
      );
    } else throw new TypeError("unknown shape");
  };
  l.par = (l2) => {
    const [m1, m2] = [l.m(), l2.m()];
    return m1 === m2 || (Number.isNaN(m1) && Number.isNaN(m2));
  };
  l.perp = (l2) => {
    if (l.isV() || Number.isNaN(l2.m())) return false;
    return l.m() * l2.m() === -1;
  };
  l.top = (p) => {
    if (l.isV()) {
      const l0 = tPtd(l.start).dist(p).l();
      const l1 = tPtd(l.end).dist(p).l();
      if (l0 <= l1) {
        const pos = tPtd(p).pos(l.start);
        switch (pos[1]) {
          case -1:
          case 1:
            return tPtd({ x: p.x, y: l.start.y }).dist(l.end);
          case 0:
            return tPtd(l.start).dist(l.end);
          default:
            throw TypeError("unknown point poisition to start");
        }
      } else {
        const pos = tPtd(p).pos(l.end);
        switch (pos[1]) {
          case -1:
          case 1:
            return tPtd({ x: p.x, y: l.end.y }).dist(l.start);
          case 0:
            return tPtd(l.end).dist(l.start);
          default:
            throw TypeError("unknown point poisition to end");
        }
      }
    } else if (l.isH()) {
      const l0 = tPtd(l.start).dist(p).l();
      const l1 = tPtd(l.end).dist(p).l();
      if (l0 <= l1) {
        const pos = tPtd(p).pos(l.start);
        switch (pos[0]) {
          case -1:
          case 1:
            return tPtd({ x: l.start.x, y: p.y }).dist(l.end);
          case 0:
            return tPtd(l.start).dist(l.end);
          default:
            throw TypeError("unknown point poisition to start");
        }
      } else {
        const pos = tPtd(p).pos(l.end);
        switch (pos[0]) {
          case -1:
          case 1:
            return tPtd({ x: l.end.x, y: p.y }).dist(l.start);
          case 0:
            return tPtd(l.end).dist(l.start);
          default:
            throw TypeError("unknown point poisition to end");
        }
      }
    }
    let x1 = l.start.x,
      y1 = l.start.y,
      x2 = l.end.x,
      y2 = l.end.y,
      m = l.m(),
      x3 = p.x,
      y3 = p.y;
    const pl = (x) => m * (x - x3) + y3; //Parallel line through p
    // Find the x-coordinates of intersection points A and B
    const xA = (y1 - y3 + m * x3 + m * m * x1) / (m * m + 1);
    const xB = (y2 - y3 + m * x3 + m * m * x2) / (m * m + 1);
    // Find the y-coordinates of points A and B
    const yA = pl(xA);
    const yB = pl(xB);

    // Return the coordinates of points A and B
    return tP(xA, yA).dist(tP(xB, yB));
  };
  l.topp = (p) => {
    if (l.isV()) return tPtd(p).dist({ ...p, x: l.start.x || l.end.x });
    else if (l.isH()) return tPtd(p).dist({ ...p, y: l.start.y || l.end.y });
    return tPtd(p).dist({ ...p, y: (-1 / l.m()) * (p.x - p.x) + p.y });
  };
  l.isH = () => l.start.y === l.end.y && l.start.x !== l.end.x;
  l.isV = () => l.start.x === l.end.x && l.start.y !== l.end.y;
  l.rect = () => {
    /**@type {Rectangle & Rectangular} */
    const r = { d: {} };
    const direction = tPtd(l.start).pos(l.end);
    if (direction[0] >= 0 && direction[1] >= 0) {
      //upward and forward
      r.c = { x: l.start.x, y: l.end.y - l.start.y };
      r.d.w = Math.abs(l.end.x - l.start.x);
      r.d.h = Math.abs(l.end.y - l.start.y);
    } else if (direction[0] <= 0) {
      // backward and downward
      r.c = { x: l.start.x - l.end.x, y: l.start.y - l.end.y };
      r.d.w = Math.abs(l.start.x - l.end.x);
      r.d.h = Math.abs(l.start.y - l.end.y);
    } else if (direction[1] <= 0) {
      // backward and upward
      r.c = { ...l.end };
      r.d.w = Math.abs(l.start.x - l.end.x);
      r.d.h = Math.abs(l.end.y - l.start.y);
    } else {
      //forward and downward
      r.c = { ...l.start };
      r.d.w = Math.abs(l.end.x - l.start.x); //|x2 - x1| increasing
      r.d.h = Math.abs(l.start.y - l.end.y); //|y1 - y2| decreasing
    }

    r.ll = () => ({
      a: tPtd({ x: r.c.x, y: r.c.y + r.d.h }).dist({
        x: r.c.x + r.d.w,
        y: r.c.y + r.d.h,
      }),
      h: tPtd({ x: r.c.x, y: r.c.y }).dist({
        x: r.c.x + r.d.w,
        y: r.c.y + r.d.h,
      }),
      o: tPtd({ x: r.c.x, y: r.c.y }).dist({ x: r.c.x, y: r.c.y + r.d.h }),
    });
    r.ur = () => ({
      a: tPtd({ x: r.c.x, y: r.c.y }).dist({ x: r.c.x + r.d.w, y: r.c.y }),
      h: tPtd({ x: r.c.x, y: r.c.y }).dist({
        x: r.c.x + r.d.w,
        y: r.c.y + r.d.h,
      }),
      o: tPtd({ x: r.c.x + r.d.w, y: r.c.y }).dist({
        x: r.c.x + r.d.w,
        y: r.c.y + r.d.h,
      }),
    });
    r.con = (val) => {
      if (val.x && val.y) return r.c.x <= val.x && r.c.y;
    };

    return r;
  };

  return l;
}
/**
 * Converts a `DOMRect` to an API-supported `Rectangle` with `Rectangular` methods
 * @param {DOMRect} r the value to be converted
 * @returns {Rectangular & Rectangle}
 */
function toRect(r) {
  /**@type {Linear & Line} */
  let l = {
    start,
  };
  /**@type {RightAngledTriangle} */
  let t = {};
}
