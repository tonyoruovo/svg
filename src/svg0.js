const NUM_MATCH = /(?:\-|\+|\d)?\d*\.?\d+(?:[e|E][\-|\+]?\d+)?/g;
/**
 * @summary reassignFunctionValue
 * @param {number} v the value to be wrapped in trig function. May be returned 'as is'.
 * @param {string} str a check box for the sign of the function
 * @returns {string}
 */
function rfv(v, str) {
  return (
    (str.match(/\-?(?:sin|tan|cos)\(/) || [""])[0] +
    v +
    (str.match(/\)/) || [""])[0]
  );
}
/**
 * @summary Positional string
 * @description Returns the postional english word for the given index. e.g `ps(1) === "2nd"`, `ps(4) === "5th"`
 * @param {number} i the index
 * @returns {string}
 */
function ps(i) {
  switch (i) {
    case 0:
      return "1st";
    case 1:
      return "2nd";
    case 2:
      return "3rd";
    default:
      return i + 1 + "th";
  }
}
/**
 * @summary **n**ormalise**P**oin**t**
 * @description Translates the given point (which is assumed to be absolute) to the destination (relative) point
 * @param {{x:number,y:number}} pt the point to be normalised
 * @param {DOMRect | SVGRect} dst The dimension onto which the normalisation will be done
 * @returns {{x:number,y:number}}
 */
function nPt(pt, dst) {
  return { x: pt.x - dst.left, y: pt.y - dst.top };
}
/**
 * @summary **n**ormalise**B**o**x**
 * @description Translates the given {@linkcode DOMRect} (box) (which is assumed to be absolute) to the destination (relative) bounds.
 * @param {DOMRect} b the box to be normalised
 * @param {DOMRect | SVGRect} dst The dimension onto which the normalisation will be done
 * @param {number} [xB=0] the thickness (in pixels) of the left border of `dst`
 * @param {number} [xy=0] the thickness (in pixels) of the top border of `dst`
 * @returns {DOMRect}
 */
function nBx(b, dst, xB = 0, yB = 0) {
  b.x = b.left = b.x - dst.left - xB;
  b.y = b.top = b.y - dst.top - yB;
  return b;
}
/**
 * @summary **t**o**Deg**rees
 * @description Converts the radians argument to degrees
 * @param {number} x the number (in radians) to be converted
 * @returns {number} the degree value of the argument
 */
function tDeg(x) {
  return (x * 180) / Math.PI;
}
/**
 * @summary **t**o**Rad**ians
 * @description Converts the degrees argument to radians
 * @param {number} x the number (in degrees) to be converted
 * @returns {number} the radians value of the argument
 */
function tRad(x) {
  return (Math.PI * x) / 180;
}
/**
 * @summary **g**et**R**otation**A**ngle**F**rom**T**ransformation
 * @description Retrieves the rotation angle (in radians) from a given {@linkcode DOMMatrix}.
 * @param {DOMMatrix} x the tranformation matrix
 * @returns {number} the rotation angle in radians
 */
function gRAFT(x) {
  return Math.atan2(x.b, x.a);
}
/**
 * @summary **m**ultiply**P**ointby**3x3**matrix
 * @param {DOMPoint | {x: number,y: number}} p the point
 * @param {DOMMatrix} m the matrix
 * @returns {{x:number, y: number}}
 */
function mP3x3(p, m) {
  return {
    x:
      (p.x * m.a + p.x * m.b + p.x * m.c + p.x * m.d + p.x * m.e + p.x * m.f) /
      2,
    y:
      (p.y * m.a + p.y * m.b + p.y * m.c + p.y * m.d + p.y * m.e + p.y * m.f) /
      2,
  };
}
/**
 * @summary **Get** **Attr**ibute **Or** **Def**ault.
 * @description Gets the attribute whose qualified name is `a` from the `Element` whose HTML id is `id`.
 * @param {string} id the HTML `id` attribute of the `Element` from which the attribute value will be retrived
 * @param {string} a The attribute name. This is the same value that can be used as an argument for {@linkcode Element.getAttribute}
 * @param {string} [def=""] An optional default value to return if no attribute exist for the `Element` with the provided `id`.
 * @returns {string}
 */
function getAttrOrDef(id, a, def = "") {
  return (
    (document.getElementById(id) ?? { getAttribute: () => "" }).getAttribute(
      a
    ) || def
  );
}
/**
 * @summary **isDef**ault**Tr**ans**f**orm
 * @description Asserts that the given element has the SVG `tranform` attribute and that these tranforms
 * contained within are the defaults.
 * @param {SVGGeometryElement} s the value to be checked
 * @returns {boolean}
 */
function isDefTrf(s) {
  if(!s.hasAttribute("transform")) return false;
  const t = s.getAttribute("transform");
  if(t.length === 0) return false;
  return t.split(' ').every(x => isDefTr(x));
}
/**
 * @summary **isDef**ault**Mat**rix
 * @description Checks if the given string is the default matrix function i.e `matrix(1,0,0,1,0,0)`.
 * @param {string} s the string to be checked. This is the same string used for the matrix function inside the transform
 * attribute.
 * @returns {boolean}
 */
function isDefMat(s) {
  return s.substring(s.indexOf('(', 5), s.lastIndexOf(')', 6)).split(',').every((x, i) => {
    if(i === 0 || i === 3) return x.trim() === '1';
    else return x.trim() === '0';
  });
}
/**
 * @summary **isDef**ault**Tr**ans**l**a**t**e
 * @description Checks if the given string is the default translate function i.e `translate(0,0)`.
 * @param {string} s the string to be checked. This is the same string used for the translate function inside the transform
 * attribute.
 * @returns {boolean}
 */
function isDefTrlt(s) {
  return s.substring(s.indexOf('(', 8), s.lastIndexOf(')', 9)).split(',').every(x => x.trim() === '0');
}
/**
 * @summary **isDef**ault**Rot**ate
 * @description Checks if the given string is the default rotate function i.e `rotate(0,0,0)`.
 * @param {string} s the string to be checked. This is the same string used for the rotate function inside the transform
 * attribute.
 * @returns {boolean}
 */
function isDefRot(s) {
  return s.substring(s.indexOf('(', 5), s.lastIndexOf(')', 6)).split(',').every(x => x.trim() === '0');
}
/**
 * @summary **isDef**ault**Sc**ale
 * @description Checks if the given string is the default scale function i.e `scale(0,0)`.
 * @param {string} s the string to be checked. This is the same string used for the scale function inside the transform
 * attribute.
 * @returns {boolean}
 */
function isDefSc(s) {
  return s.substring(s.indexOf('(', 4), s.lastIndexOf(')', 5)).split(',').every(x => x.trim() === '0');
}
/**
 * @summary **isDef**ault**S**kew**X**
 * @description Checks if the given string is the default skewX function i.e `skewX(0)`.
 * @param {string} s the string to be checked. This is the same string used for the skewX function inside the transform
 * attribute.
 * @returns {boolean}
 */
function isDefSX(s) {
  return s.substring(s.indexOf('(', 4), s.lastIndexOf(')', 5)).split(',').every(x => x.trim() === '0');
}
/**
 * @summary **isDef**ault**S**kew**Y**
 * @description Checks if the given string is the default skewY function i.e `skewY(0)`.
 * @param {string} s the string to be checked. This is the same string used for the skewY function inside the transform
 * attribute.
 * @returns {boolean}
 */
function isDefSY(s) {
  return s.substring(s.indexOf('(', 4), s.lastIndexOf(')', 5)).split(',').every(x => x.trim() === '0');
}
/**
 * @summary **isDefTr**ansform
 * @description Checks if the given transform function contains only default values.
 * @param {string} s the value to be checked. This is the value of the transform function such as `rotate(34) translate(90, 125)`
 * @returns {boolean}
 */
function isDefTr(s) {
  switch(s.trim().substring(0, s.indexOf('('))){
    case "translate": return isDefTrlt(s);
    case "rotate": return isDefRot(s);
    case "scale": return isDefSc(s);
    case "skewX": return isDefSX(s);
    case "skewY": return isDefSX(s);
    case "matrix": return isDefMat(s);
    default: return false;
  }
}
/**
 * @typedef {Object} TransformGenericArgument a generic argument to a given {@linkcode TransformAttrFunction} whose name is not `matrix`.
 * It consists of a numerical value and a given unit.
 * @property {number} v the numerical value of this argument
 * @property {string} u the unit as string. This is equivalent to the CSS units acceptable for this argument, it may
 * also be an empty string.
 */
/**
 * @typedef {object} TransformMatrixArgument
 * @property {string} [tf] the name of the trigonometrical function such as `sin`, `tan` or `cos`. If this includes
 * a sign (negative), then it is included as the first character in this string. This will be an empty string if ther
 * is no trigonometrical function attached to this argument (value).
 */
/**
 * A definition of the abstraction of one of the values of the transform attribute in an SVG element such as
 * `rotate(45deg)`, `skewY(15)` or `matrix(3 1 -1 3 30 40)`. This interface represents a single
 * of the pre-described function.
 * @typedef {Object} TransformAttrFunction
 * @property {string} f the name of this tranform function as a `string`. It is one of `rotate`, `tanslate`, `scale`
 * `skewX`, `skewY` or `matrix`.
 * @property {(TransformGenericArgument & TransformMatrixArgument)[]} a the arguments to a given {@linkcode TransformAttrFunction}.
 * The number of elements in this array is directly proportional to the number of arguments of this function.
 */
/**
 * @summary **p**arse**Tr**ansform**F**unction
 * @description Parses a single function within the `transform` attribute into a POJO.
 * @param {string} s the translate function for the transform attribute's value of an element
 * @returns {TransformAttrFunction}
 */
function pTrF(s){
  const ip = s.indexOf('(');//index of the first open parenthesis
  const f = s.substring(0, ip);//the name of the function;
  const a = s.substring(ip + 1, s.lastIndexOf(')')).split(/(?:\,\s+|\,|\s+)/).filter(x => x && x.length > 0).map(x => ({
    tf: (x.match(/\-?(?:sin|cos|tan)/)??[""])[0],
    v: Number((x.match(NUM_MATCH)??[""])[0]),
    u: (x.match(/(?:[A-Za-z]+|%)$/)??[""])[0]??"",
  }));
  return ({f,a});
}
/**
 * @summary **p**arse**t**ransform**a**ttribute
 * @description Parses the value of the transform attribute of an SVG or HTML element into a POJO.
 * @param {string} [s=""] the value of the `transform` attribute on an SVG element. Note that this also goes for other
 * types of the `transform` attribute such as the ones used for `gradientTransform`, `patternTransform` etc.
 * @returns {TransformAttrFunction[]}
 */
function pta(s) {
  s ??= "";
  const r = s.split(/(?<=\))\s+/g);//split results
  if((!r) || r.length === 0) return [];
  return r.map(x => pTrF(x));
}
/**
 * A 2-length tuple representing the endpoints of a line such that the first element is one end and the last is another.
 * @typedef {[Point, Point]} Line
 */
/**
 * Gets the slope of the given line.
 * @param {Line} l the endpoints of the line
 * @returns {number} the slope of the given line or `NaN` if the line is parallel to the y-axis.
 */
function getSlope(l) {
  try {
    return (l2[1].y - l2[0].y)/(l[1].x - l[0].x);
  } catch (e) {
    return Number.NaN;
  }
}
/**
 * Gets the y-intercept of the given line.
 * @param {Line} l the endpoints of the line
 * @returns {number} the y-intercept of the given line or `NaN` if the line is vertical.
 */
function getYIntercept(l){
  try {
    return ((l[1].x*l2[0].y)-(l[0].x*l2[1].y)) / (l[1].x - l[0].x);
  } catch (e) {
    return Number.NaN;
  }
}
/**
 * @summary **isVert**ical
 * @description Checks if the given line is vertical and returns `true` if it is, otherwise returns `false`.
 * @param {Line} l the `Line` to be checked
 * @returns {boolean} `true` if the argument is a vertical line else returns `false`
 */
function isVert(l) {
  return (!Number.isFinite(getSlope(l)));
}
/**
 * @summary **isHor**i**z**ontal
 * @description Checks if the given line is horizontal and returns `true` if it is, otherwise returns `false`.
 * @param {Line} l the `Line` to be checked
 * @returns {boolean} `true` if the argument is a horizontal line else returns `false`
 */
function isHorz(l) {
  return getSlope(l) === 0;
}
/**
 * @summary **isPar**alle**l**
 * @description Checks if both line arguments are parallel to each other. This does not check for verticality.
 * If both are vertical then this method will return `false`, hence the caller is responsible for handling vertical special cases.
 * @param {Line} l1 the first line to be compared
 * @param {Line} l2 the second line to be compared
 * @returns {boolean} `true` if both lines are parallel or else `false`.
 */
function isParl(l1, l2) {
  return getSlope(l1) === getSlope(l2);
}
/**
 * @summary **isPerp**endicular
 * @description Checks if both line arguments are perpendicular to each other. This does not check for verticality.
 * If both are vertical then this method will return `false`, hence the caller is responsible for handling vertical special cases.
 * @param {Line} l1 One of 2 lines to be compared
 * @param {Line} l2 One of 2 lines to be compared
 * @returns {boolean} `true` if the first line argument is perpendicular to the second line argument. Otherwise, returns `false`.
 */
function isPerp(l1, l2) {
  return (getSlope(l1) * getSlope(l2)) === -1;
}
/**
 * @description Reflects the given point across the given line and returns the 
 * @param {DOMPoint} p the point to be reflected
 * @param {Line} l the line perpendicular to the line formed by points before and after the reflection
 * @returns {DOMPoint} the position of the `p` argument after the reflection across `line`
 */
function reflect(p, l) {
  let dx = l[1].x - l[0].x;
  let dy = l[1].y - l[0].y;
  let a = (dx * dx - dy * dy) / (dx * dx + dy * dy);
  let b = 2 * dx * dy / (dx * dx + dy * dy);
  return DOMPoint.fromPoint({x: (a * (p.x - l[0].x) + b * (p.y - l[0].y) + l[0].x),
  y: (b * (p.x - l[0].x) - a * (p.y - l[0].y) + l[0].y)});
}
/**
 * @summary **t**o**Par**allel
 * @description Computes the `Line` parallel to the given `Line` argument `l` which passes through the given `DOMPoint` `p`.
 * @param {Line} l the given line
 * @param {DOMPoint} p the point through the parallel line passes.
 * @returns {Line} the line parallel to the argument `l`.
 */
function tPar(l, p) {
  let [wx, wy] = [(l[1].x - l[0].x) / 2, (l[1].y - l[0].y) / 2];
  return [DOMPoint.fromPoint({x:p.x - wx,y:p.y - wy}), DOMPoint.fromPoint({x:p.x+wx,y:p.y+wy})];
}
/**
 * @summary **t**o**Perp**endicular
 * @description Computes and returns the line perpendicular (of which one of the endpoints is the given point) to the given line.
 * @param {Line} l the line whose perpendicular is to be computed
 * @param {DOMPoint} p one of the endpoints to the returned perpendicular line
 * @returns {Line} the perpendicular to the argument. This line bisects l at 1/2Pi (90 degrees) and is 2x the distance from `p` to
 * the point of bisection of `l`.
 */
function tPerp(l, p) {
  return [p, reflect(p, l)]
}
/**
 * @summary **midP**oin**t**
 * @description Gets the mid poinjt of `l`.
 * @param {Line} l a line
 * @returns {DOMPoint} the midpoint of `l`
 */
function midPt(l) {
  return DOMPoint.fromPoint({x:(l[1].x - l[0].x) / 2,y:(l[1].y - l[0].y) / 2});
}
/**
 * A 3-length tuple representing the points of a triangle.
 * @typedef {[DOMPoint, DOMPoint, DOMPoint]} Triangle
 */
/**
 * A POJO (data object) that contains the points of a right-angled triangle.
 * @typedef {Object} PythagoreanTriple
 * @property {DOMPoint} x the point that lies either at the left or right of the point at the right angle i.e the other endpoint at the 'horizontal side'
 * of the triangle that is not the point at the right angle.
 * @property {DOMPoint} y the point that lies either at the top or bottom of the point at the right angle i.e the other endpoint at the 'vertical side'
 * of the triangle that is not the point at the right angle.
 * @property {DOMPoint} z the point exactly at the right angle.
 * @property {() => number} hyp a helper method to get the length of the hypotenuse.
 * @property {() => number} w a helper method to get the length of the horizontal side. This is the width of the triangle.
 * @property {() => number} h a helper method to get the length of the vertical side. This is the height of the triangle.
 * @property {() => number} va a helper method to get the angle that the hypotenuse makes with the vertical (height) side.
 * @property {() => number} ha a helper method to get the angle that the hypotenuse makes with the horizonal (base) side.
 */
/**
 * @summary **py**thagorean**P**oin**t**
 * @description Gets a right-angled triangle relative to the origin of the user coordinate system. The hypotenuse of the returned data is the
 * distance of the argument from the origin `(0, 0)` of the user coordinate system. The `z` property is the point that lies on the x-axis,
 * the `x` property is the origin and the `y` property is the argument `p`.\
 * \
 * This is the pythagorean triple that the argument makes with the origin of the user coordinate system.
 * @param {DOMPoint} p a `DOMPoint` on the user coordinate system.
 * @returns {PythagoreanTriple} a right-angled triangle with extra data for the location of this point on the user coordinate system.
 */
function pyPt(p) {
  return {
    x: DOMPoint.fromPoint({x: 0, y: 0}),//origin
    y: p,
    z: DOMPoint.fromPoint({x:p.x,y:0}),
    hyp: () => getD([this.x, this.y]),
    w: () => getD([this.x, this.z]),
    h: () => getD([this.z, this.y]),
    ha: () => Math.asin(this.h() / this.hyp()),
    va: () => Math.atan2(this.w(), this.h())
  };
}
/**
 * @summary **fr**om**Hyp**otenuse
 * @description Constructs a right-angled triangle (represented by a {@linkcode PythagoreanTriple}) from the given endpoints relative to the
 * user coordinate system. The triangle is constructed such that {@linkcode PythagoreanTriple.z} is the `DOMPoint` with the smallest `y`.
 * @param {Line} l the endpoints of the hypotenuse of the returned `PythagoreanTriple`.
 * @param {boolean} [r=true] option to specify which side of the given line the {@linkplain PythagoreanTriple.z the point at the right angle}
 * should lie. Set to `true` (default) if the right angle point should always have the smallest `y` property 
 * @returns {PythagoreanTriple} the right-angled triangle whose hypotenuse is the argument.
 */
function frHyp(l, r = true) {
  l = reArrEP(l);
  if(r) {
    if(l[0].y <= l[1].y){//l is top-left<->bottom-right
      return {
        x: DOMPoint.fromPoint(l[0]),
        y: DOMPoint.fromPoint(l[1]),
        z: DOMPoint.fromPoint({x:l[1].x,y:l[0].y}),
        hyp: () => getD([this.x, this.y]),
        w: () => getD([this.x, this.z]),
        h: () => getD([this.z, this.y]),
        ha: () => Math.asin(this.h() / this.hyp()),
        va: () => Math.atan2(this.w(), this.h())
      };
    } else return {
      x: DOMPoint.fromPoint(l[1]),
      y: DOMPoint.fromPoint(l[0]),
      z: DOMPoint.fromPoint({x:l[0].x,y:l[1].y}),
      hyp: () => getD([this.x, this.y]),
      w: () => getD([this.x, this.z]),
      h: () => getD([this.z, this.y]),
      ha: () => Math.asin(this.h() / this.hyp()),
      va: () => Math.atan2(this.w(), this.h())
    }
  } else {
    if(l[0].y <= l[1].y){
      return {
        x: DOMPoint.fromPoint(l[1]),
        y: DOMPoint.fromPoint(l[0]),
        z: DOMPoint.fromPoint({x: l[0].x, y: l[1].y}),
        hyp: () => getD([this.x, this.y]),
        w: () => getD([this.x, this.z]),
        h: () => getD([this.z, this.y]),
        ha: () => Math.asin(this.h() / this.hyp()),
        va: () => Math.atan2(this.w(), this.h())
      }
    } else return {
      x: DOMPoint.fromPoint(l[0]),
      y: DOMPoint.fromPoint(l[1]),
      z: DOMPoint.fromPoint({x: l[1].x, y: l[0].y}),
      hyp: () => getD([this.x, this.y]),
      w: () => getD([this.x, this.z]),
      h: () => getD([this.z, this.y]),
      ha: () => Math.asin(this.h() / this.hyp()),
      va: () => Math.atan2(this.w(), this.h())
    };
  }
}
/**
 * @summary **sortP**oin**t**s
 * @description Sorts and orders the points in the given array and returns it. Note that this is a destructive operation.
 * @param {DOMPoint[]} p an array of points
 * @param {'x'|'y'|'z'} [by='x'] specifies that the ordering should be either by the `x` (default) or `y` property. 
 * @param {boolean} [a=true] a boolean value. If `true` (default) then the points are returned in their ascending
 * order (from min to max) else the alternative is the case.
 * @returns {DOMPoint[]} the list of points after re-ordering.
 */
function sortPt(p, by = 'x', a = true) {
  return a ? p.sort((p1, p2) => p1[by] - p2[by]) : p.sort((p1, p2) => p2[by] - p1[by]);
}
/**
 * @summary **sortL**i**n**e
 * @param {Object} args The destructed arguments.
 * @param {Line[]} args.l an array of 2-length arrays with each index consisting of a `DOMPoint`.
 * @param {'x'|'y'|'z'} [args.by='x'] specifies the point property by which the ordering is done
 * @param {'min'|'max'} [args.m='min'] specifies whether the ordering is done by the minimum (default)
 * or maximum value for the property given by the argument `by`.
 * @param {boolean} [args.a=true] a boolean value. If `true` (default) then the lines are returned in their ascending
 * order (from min to max) else the alternative is the case.
 * @returns {Line[]} the list of lines after re-ordering.
 */
function sortLn({l, by = 'x', m = "min", a = true}) {
  return a ? l.sort((l1, l2) => Math[m](l1[0][by], l1[1][by]) - Math[m](l2[0][by], l2[1][by])) : l.sort((l1, l2) => Math[m](l2[0][by], l2[1][by]) - Math[m](l1[0][by], l1[1][by]));
}
/**
 * @summary **eq**uals**P**oin**t**
 * @description Checks both points for equality.
 * @param {Point} p1 a point
 * @param {Point} p2 the second point
 * @returns {boolean} `true` if both points have the same location else returns `false`
 */
function eqPt(p1, p2) {
  return p1.x === p2.x && p1.y === p2.y;
}
/**
 * @summary **eq**uals**L**i**n**e
 * @description Checks both lines for equality.
 * @param {Line} l1 a first line segment
 * @param {Line} l2 the second line segment
 * @returns {boolean} `true` if both line segments have the same location else returns `false`
 */
function eqLn(l1, l2) {
  return eqPt(locVect(l1), locVect(l2));
}
/**
 * An interface representing a shape that can apply a given `transform` to itself without changing (mutating)
 * it's original values.
 * @callback Transformable
 * @param {DOMMatrix} m the tranform to be applied
 * @returns {DOMPoint} the coordinates of `this` that has been transformed using the given argument.
 */
/**
 * @typedef {Object} TransformablePoint A point that can transform itself safely without mutating
 * it's values.
 * @property {Transformable} tr Returns a `DOMPoint` that has been transformed with a specified transformation.
 */
/**
 * **Rect**angular**Struct**ure. An object that contains only the points of the vertices of a rectangle (such as a `DOMRect`)
 * and the centre point. Each of these points can be transformed separately wiout mutating the whole rectangle.
 * @typedef {Object} RectStruct
 * @property {DOMPoint & TransformablePoint} nw the north-west (top-left) point of the rectangle.
 * @property {DOMPoint & TransformablePoint} n the point directly above the centre of the rectangle i.e vertical north of the rectangle. 
 * @property {DOMPoint & TransformablePoint} ne the north-east (top-right) point of the rectangle.
 * @property {DOMPoint & TransformablePoint} e the point directly right of the centre of the rectangle i.e horizontal east of the rectangle.
 * @property {DOMPoint & TransformablePoint} se the south-east (bottom-right) point of the rectangle.
 * @property {DOMPoint & TransformablePoint} s the point directly below the centre of the rectangle i.e vertical south of the rectangle.
 * @property {DOMPoint & TransformablePoint} sw the south-west (bottom-left) point of the rectangle.
 * @property {DOMPoint & TransformablePoint} w the point directly left of the centre of the rectangle i.e horizontal west of the rectangle.
 * @property {DOMPoint & TransformablePoint} c the central point of the rectangle.
 */
/**
 * @summary **reArr**ange**E**nd**P**oints
 * @description Re-arranges (sorts) the endpoints of a given line so that the leftmost (or top-most) point (in a 2D cartesian plane)
 * comes first in the 2-length array.
 * @param {Line} l a 2-length tuple representing the endpoints of the line.
 * @param {boolean} [t=true] a `boolean` value, whereby if `!!t === true` then horizontal sorting (sorts by x-axis: ascending)
 * will be carried out else vertical sorting (sorts by y-axis: ascending) is carried out. The default is `true`.
 * @returns {Line} a 2-length tuple representing the endpoints of a line such that the first element is
 * the left-most/top-most point.
 */
function reArrEP(l, t = true) {
/**
 * @summary **norm**alise**L**i**n**e**Hor**i**z**ontal
 * @description Re-arranges the endpoints of a given line so that the leftmost point (in a 2D cartesian plane)
 * comes first in the 2-length array and, consequentially, the rightmost point comes last.\
 * \
 * Note that *left-most point* here refers to the `DOMPoint` (index in the input array) whose `x` property
 * is closest to `0`.
 * @param {Line} l a 2-length tuple representing the endpoints of the line.
 * @returns {Line} a 2-length tuple representing the endpoints of a line such that the first element is
 * the leftmost point and the last element is the rightmost point.
 */
function normLnHorz(l) {
  return l[0].x <= l[1].x ? l : [l[1], l[0]];
}
/**
 * @summary **norm**alise**L**i**n**e**Vert**ical
 * @description Re-arranges the endpoints of a given line so that the top-most point (in a 2D cartesian plane)
 * comes first in the 2-length array and, consequentially, the bottom-most point comes last.\
 * \
 * Note that *top-most* here refers to the `DOMPoint` (index in the input array) whose `y` property
 * is closest to `0`.
 * @param {Line} l a 2-length tuple representing the endpoints of the line.
 * @returns {Line} a 2-length tuple representing the endpoints of a line such that the first element is
 * the top-most point and the last element is the bottom-most point.
 */
function normLnVert(l) {
  return l[0].y <= l[1].y ? l : [l[1], l[0]];
}
  return t ? normLnHorz(l) : normLnVert(l);
}
/**
 * @summary **getD**istance
 * @description Gets the distance between the given points
 * @param {Line} l the endpoints of the line whose distance is to be calculated.
 * @returns {number} the distance between the specified endpoints
 */
function getD(l) {
  const f = a => a*a;//square function
  return Math.sqrt(f(l[1].x - l[0].x) + f(l[1].y - l[0].y));
}
/**
 * @summary **diag**onal
 * @description Gets a diagonal of the `RectStruct` argument depending on whether the longer (or shorter) one is specified.
 * No matter what is returned, the left-most point will be the 1st element of the returned tuple.
 * \
 * In a `RectStruct`, there are 2 diagonals. They are specified as follows:
 * ```js
 * const element = document.querySelector("ellipse");
 * const vertices = frDR(element.getBoundingClientRect());//May sometimes also be getBBox()
 * const diagonal_1 = [vertices.nw, vertices.se];//first diagonal
 * const diagonal_2 = [vertices.sw, vertices.ne];//second diagonal
 * ```
 * @param {RectStruct} r a `RectStruct` object
 * @param {boolean} l `true` if the longer diagonal should be returned or `false` if otherwise. If bothe diagonal are the same length,
 * then the `[nw, se]` one is returned regardless of this value.
 * @returns {Line} a 2-length tuple representing the endpoints of the diagonal.
 */
function diag(r, l = true) {
  /**
   * @summary **l**ongest**d**iagonal
   * @description Gets the longest diagonal from the given rectangular structure and returns it. If both are the same
   * length, then the line segment (`nw`<-->`se`) diagonal is returned such that the leftmost point is the first element.
   * No matter what is returned, the left-most point will be the 1st element of the returned tuple.
   * @param {RectStruct} r the rectangle whose diagonal is to be taken.
   * @returns {[DOMPoint & TransformablePoint, DOMPoint & TransformablePoint]} the endpoints of the longest diagonal of
   * the argument.
   */
  function ld(r) {
    return getD([r.nw, r.se]) >= getD([r.sw, r.ne]) ? reArrEP([r.nw, r.se]) : reArrEP([r.sw, r.ne]);
  }
  /**
   * @summary **s**hortest**d**iagonal
   * @description Gets the shortest diagonal from the given rectangular structure and returns it. If both are the same
   * length, then the line segment (`nw`<-->`se`) diagonal is returned such that the leftmost point is the first element.
   * No matter what is returned, the left-most point will be the 1st element of the returned tuple.
   * @param {RectStruct} r the rectangle whose diagonal is to be taken.
   * @returns {[DOMPoint & TransformablePoint, DOMPoint & TransformablePoint]} the endpoints of the longest diagonal of
   * the argument.
   */
  function sd(r) {
    return getD([r.nw, r.se]) <= getD([r.sw, r.ne]) ? reArrEP([r.nw, r.se]) : reArrEP([r.sw, r.ne]);
  }
  return l ? ld(r) : sd(r);
}
/**
 * @summary **w**rap**D**OM**P**oint.
 * @description Wraps the given `DOMPoint` with a `TransformablePoint` and returns the result.
 * @param {DOMPoint} p the value to be wrapped
 * @returns {DOMPoint & TransformablePoint} the transformed `DOMPoint`.
 */
function wDP(p) {
  p.tr = m => DOMPoint.fromPoint({x: p.x, y: p.y, z: p.z, w: p.w}).matrixTransform(m);
  return p;
}
/**
 * @summary **fr**om**D**OM**R**ect
 * @description Creates a {@linkcode RectStruct} from the given {@linkcode DOMRect}.
 * @param {DOMRect} r A `DOMRect` from which the structure will be created.
 * @returns {RectStruct} a `RectStruct` from the argument.
 */
function frDR(r) {
  return {
    nw: wDP(DOMPoint.fromPoint({x: r.left, y: r.top})),
    n: wDP(DOMPoint.fromPoint({x: r.left + (r.width / 2), y: r.top})),
    ne: wDP(DOMPoint.fromPoint({x: r.left + r.width, y: r.top})),
    e: wDP(DOMPoint.fromPoint({x: r.left + r.width, y: r.top + (r.height / 2)})),
    se: wDP(DOMPoint.fromPoint({x: r.left + r.width, y: r.top + r.height})),
    s: wDP(DOMPoint.fromPoint({x: r.left + (r.width / 2), y: r.top + r.height})),
    sw: wDP(DOMPoint.fromPoint({x: r.left, y: r.top + r.height})),
    w: wDP(DOMPoint.fromPoint({x: r.left, y: r.top + (r.height / 2)})),
    c: wDP(DOMPoint.fromPoint({x: r.left + (r.width / 2), y: r.top + (r.height / 2)})),
  };
}
/**
 * @summary **imm**utable**Tr**ansformation
 * @description Transforms the given rect without altering any of it's properties.
 * @param {RectStruct} r any `RectStruct`
 * @param {DOMMatrix} t the transform to be applied
 * @returns {RectStruct} the transformed rect. Note that the returned values donot implement {@linkcode Transformable} interface (functor).
 */
function immTr(r, t) {
  return Object.keys(r).reduce((p, c) => {
    p[c] = r[c].tr(t);
    return p;
  }, {});
  // return {
  //   nw: r.nw.tr(t),
  //   ne: r.ne.tr(t),
  //   se: r.se.tr(t),
  //   sw: r.sw.tr(t),
  //   c: r.c.tr(t)
  // }
}
/**
 * Gets the north-west (0) (default), north (0.5), north-east (1)
 * @param {Point[]} p the list of points to search
 * @param {number} dir the direction of the point.
 * @returns {Point}
 */
function compassPoints(p, dir) {
  switch(dir) {
    case 0:
    default:
      return {x: Math.min(...p.map(x => x.x)), y: Math.min(...p.map(y => y.y))};
    case 1:
      return {x: Math.max(...p.map(x => x.x)), y: Math.min(...p.map(y => y.y))};
    case 2:
      return {x: Math.max(...p.map(x => x.x)), y: Math.max(...p.map(y => y.y))};
    case 3:
      return {x: Math.min(...p.map(x => x.x)), y: Math.max(...p.map(y => y.y))};
  }
}
/**
 * @summary **getV**ertex**P**oin**t**of**Circ**umscribed**Rect**angle
 * @description Gets a point at one of the vertex of the upright circumscribed rectangle in which the `RectStruct` argument is inscribed.\
 * \
 * Note that the `RectStruct` argument may have been transformed, hence it is assumed that it's vertexes are not at their original
 * positions, therefore, another circumscribed (bounding box) `RectStruct` is created such that the argument `r` is inscribed in it.
 * @param {RectStruct} r a `RectStruct`.
 * @param {0|1|2|3} [v] a `number` specifying which vertex to be returned. The following are valid values:
 * - **`0`** (default) - Returns a point (`DOMPoint`) with the smallest `x` and smallest `y` of the bounding rectangle of `r`. That is, the
 * north-western vertex of the bounding box (circumscribed upright rectangle) of the argument `r`
 * - **`1`** - Returns a point (`DOMPoint`) with the largest `x` and smallest `y` of the bounding rectangle of `r`. That is, the
 * north-eastern vertex of the bounding box (circumscribed upright rectangle) of the argument `r`
 * - **`2`** - Returns a point (`DOMPoint`) with the largest `x` and largest `y` of the bounding rectangle of `r`. That is, the
 * south-eastern vertex of the bounding box (circumscribed upright rectangle) of the argument `r`
 * - **`3`** - Returns a point (`DOMPoint`) with the smallest `x` and largest `y` of the bounding rectangle of `r`. That is, the
 * south-western vertex of the bounding box (circumscribed upright rectangle) of the argument `r`
 * @returns {DOMPoint} a `DOMPoint` representing one of the vertex of the circumscribed rect of the rect formed by the argument `r`.
 */
function getVPtCircRect(r, v/*, exclude = []*/) {
    const x = Object.keys(r)./*filter(x => exclude.indexOf(x) >= 0).*/map(x => r[x].x);
    const y = Object.keys(r)./*filter(x => exclude.indexOf(x) >= 0).*/map(y => r[y].y);
  switch (v) {
    default:
    case 0:
      return DOMPoint.fromPoint({x: Math.min(...x), y: Math.min(...y)});
    case 1:
      return DOMPoint.fromPoint({x: Math.max(...x), y: Math.min(...y)});
    case 2:
      return DOMPoint.fromPoint({x: Math.max(...x), y: Math.max(...y)});
    case 3:
      return DOMPoint.fromPoint({x: Math.min(...x), y: Math.max(...y)});
  }
}
/**
 * @summary **loc**ated**Vec**tor
 * @description Constructs a mathematical vector (in form of a {@linkcode Point}) from the given `Line` returning a located vector.
 * A located (position) vector is a vector constructed from the 2 endpoints of a line.
 * @param {Line} l a 2-length number array where the first element serves as the origin and the last serves as the location in the
 * coordinate system.
 * @returns {Point} a location in a coordinate system where the origin (0,0) is the first index of the argument.
 */
function locVect(l){
  return {x: l[1].x - l[0].x, y: l[1].y - l[0].y};
}
/**
 * @summary **vec**tor**Dir**ection
 * @description Computes the direction of the resultant positional vector of the given line segment.
 * @param {Line} l a line segment
 * @returns {number} the direction of the resultant positional vector of
 * the argument
 */
function vecDir(l){
  return angDepr(l);
}
/**
 * @summary **ang**leOf**Depr**ession
 * @description Gets the angle (in radians) that the x-axis makes with the line, i.e the angle of depression given that the line of sight is
 * the argument. Note that this uses the coordinate system of DOM APIs.
 * @param {Line} l a 2-length array with the first element as the origin (start) and the second as the endpoint.
 * @returns {number} the angle (in radians) of depression. 
 */
function angDepr(l) {
  const {x, y} = locVect(l);
  return Math.atan2(y, x);
}
/**
 * calculates the bounding box (axis-aligned) of the given element.
 * @param {SVGCircleElement} e an SVG `<circle>` element
 * @returns {DOMRect}
 */
function cBB(e) {
  const canvas = document.getElementById("canvas");
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  const hasTransform = e.hasAttribute("transform");
  canvas.appendChild(group);
  if(hasTransform) {
    group.setAttribute("transform", e.getAttribute("transform"));
    e.removeAttribute("transform");
  }
  const parentGroup = e.parentElement;
  const bb = group.appendChild(parentGroup.removeChild(e)).getBBox();
  // console.log(bb);
  parentGroup.appendChild(group.removeChild(e));
  if(hasTransform) e.setAttribute("transform", group.getAttribute("transform"));
  // console.log(bb);
  group.remove();
  return bb;
}
/**
 * @summary **cr**eate**B**ounding**B**ox
 * @description Creates a bounding box around a given rect that will be transformed by the second argument.\
 * \
 * When a shape is transformed, it's bounding box properties are lost and have to be calculated afresh, this method
 * facilitates the recalculation of the bounding box of a shape (whose pre-transformed bounding box is the first
 * argument) so that the returned `DOMRect` is the bounding box of the post-transformed shape/element.
 * @param {DOMRect} r the rect to be transformed
 * @param {DOMMatrix} t the `transform` to be used
 * @param {Line} h the horizontal endpoints at which the shape touches the `DOMRect`.
 * @param {Line} v the vertical endpoints at which the shape touches the `DOMRect`.
 * @returns {DOMRect} the bounding box of the post-transformed shape whose pre-transformed bounding box is the first
 * argument `r`.
 * @test
 * ```html
 * <circle stroke-width="1" fill="none" stroke="#000000" cx="212.32801896310784" cy="162.15110062290316" id="756-174-0" class="ds" r="51" data-s="" transform="scale(1.7,1) rotate(82,391,229) skewX(33) skewY(20)"></circle>
 * ```
 */
function crBB(r, t) {
  const q = frDR(r);//quad
  const tr = immTr(q, t);

  //handle transforms
  const dimension = {width: r.width, height: r.height};

  const [dg1, dg2] = [[tr.nw, tr.se], [tr.sw, tr.ne]];//diagonals
  const [dg1l, dg2l] = [getD(dg1), getD(dg2)];//lengths of the diagonals
  /* horizontal and vertical line segments going through the center */
  const [hd, vd] = [[tr.w, tr.e], [tr.n, tr.s]];
  const [w, h] = [getD(hd), getD(vd)];//width and height
  const compass = [tr.c, tr.e];
  const direction = vecDir(compass);

  // console.log(tDeg(direction));

  // const isSkewed = dg1l !== dg2l;
  // const isScaled = Math.abs(w - h) > 0.1;
  // const isRotated = Math.abs(direction) === Math.PI / 2 || Math.abs(direction) <= 0.01;

  if(Math.abs(dg1l - dg2l) > 0.1) { //skew involved in transform
    const topo = [tr.nw, tr.ne, tr.se, tr.sw];
    const [nw0, ne0, sw0] = [getVPtCircRect(tr, 0), getVPtCircRect(tr, 1), getVPtCircRect(tr, 3)];
    const [nw1, ne1, sw1] = [compassPoints(topo, 0), compassPoints(topo, 1), compassPoints(topo, 3)];
    const [nw, ne, sw] = (() => {
      let nw = {x:nw0.x + Math.abs((nw1.x - nw0.x) / 2), y: nw0.y + Math.abs((nw1.y - nw0.y) / 2)};
      let ne = {x:ne0.x - Math.abs((ne0.x - ne1.x) / 2), y: nw.y};
      let sw = {x:nw.x, y: sw0.y - Math.abs((sw1.y - sw0.y) / 2)};
      return [nw, ne, sw];
    })();
    dimension.width = getD([nw, ne]);
    // dimension.width -= dimension.width/2
    dimension.height = getD([nw, sw]);
    // dimension.height -= dimension.height/2
    // console.log("skewed!", dimension);
  } else // rotation (or scale, reflection?) involved in transform
  if((Math.abs(w - h) > 0.1) || (Math.abs(direction) === Math.PI / 2 || Math.abs(direction) <= 0.01)) {
    // const [nw, ne, sw] = [getVPtCircRect(tr, 0), getVPtCircRect(tr, 1), getVPtCircRect(tr, 3)];
    const s = Object.keys(tr).reduce((p, c) => {
      p.xm = Math.min(p.xm, tr[c].x);
      p.xx = Math.max(p.xx, tr[c].x);
      p.ym = Math.min(p.ym, tr[c].y);
      p.yx = Math.max(p.yx, tr[c].y);
      return p;
    }, {xm: Number.MAX_SAFE_INTEGER, ym:Number.MAX_SAFE_INTEGER, xx:Number.MIN_SAFE_INTEGER, yx:Number.MIN_SAFE_INTEGER, });
    dimension.width = getD([{x:s.xm,y:s.ym}, {x:s.xx,y:s.ym}]);
    dimension.height = getD([{x:s.xm,y:s.ym}, {x:s.xm,y:s.yx}]);
    // console.log("rotated!", dimension);
  }
  // console.log(dimension);

  return DOMRect.fromRect({
    x: tr.c.x - (dimension.width / 2),
    y: tr.c.y - (dimension.height / 2),
    ...dimension
  });
/*
  // const l = diag(tr);
  // const s = diag(tr, false);
  // h[0] = h[0].matrixTransform(t);
  // h[1] = h[1].matrixTransform(t);
  // v[0] = v[0].matrixTransform(t);
  // v[1] = v[1].matrixTransform(t);
  // let prp = tPar(l, tr.ne);
  const cv = document.getElementById("canvas");
  cv.appendChild(lin([tr.n, tr.s], "n-s", "red")).classList.add("guide");
  cv.appendChild(lin([tr.w, tr.e], "w-e", "green")).classList.add("guide");
  cv.appendChild(lin([tr.nw, tr.se], "nw-se", "blue")).classList.add("guide");
  cv.appendChild(lin([tr.sw, tr.ne], "sw-ne", "black")).classList.add("guide");
  // cv.appendChild(lin(prp, "prl1", "orange"));
  // prp = tPerp(prp, tr.se);
  // cv.appendChild(lin(prp, "prp"));
  // cv.appendChild(lin(l, "l", "darkgray"));
  // cv.appendChild(circ(tr.c, "c", "gray")).classList.add("guide");
  // cv.appendChild(circ(tr.nw, "nw", "yellow")).classList.add("guide");
  // cv.appendChild(circ(tr.ne, "ne", "magenta")).classList.add("guide");
  // cv.appendChild(circ(tr.se, "se", "cyan")).classList.add("guide");
  // cv.appendChild(circ(tr.sw, "sw", "purple")).classList.add("guide");
  // cv.appendChild(lin([tr.nw, tr.se], "tl-br", "blue")).classList.add("guide");
  // cv.appendChild(lin([tr.sw, tr.ne], "bl-tr", "green")).classList.add("guide");
  // cv.appendChild(lin(h, "h", "orange")).classList.add("guide");
  // cv.appendChild(lin(v, "v", "brown")).classList.add("guide");
  // let trg = frHyp(s);
  // cv.appendChild(tri([trg.x, trg.y, trg.z], "tr1", "black")).classList.add("guide");
  // trg = frHyp(s, false);
  // cv.appendChild(tri([trg.x, trg.y, trg.z], "tr2", "black")).classList.add("guide");
  // trg = frHyp(l);
  // cv.appendChild(tri([trg.x, trg.y, trg.z], "tr3", "darkgoldenrod")).classList.add("guide");
  // trg = frHyp(l, false);
  // cv.appendChild(tri([trg.x, trg.y, trg.z], "tr4", "darkgoldenrod")).classList.add("guide");
  // const nw = getVPtCircRect(tr);
  // cv.appendChild(rectangle(
  //   DOMRect.fromRect({ x: nw.x, y: nw.y, width: getD([nw, getVPtCircRect(tr, 1)]), height: getD([nw, getVPtCircRect(tr, 3)])}),
  //   "outer-rect", "aqua"
  // )).classList.add("guide");

  // Calculations for rotation
  // console.log(Math.abs(tr.nw.y - tr.sw.y), Math.abs(tr.nw.x - tr.ne.x));
  const angle = angDepr([tr.c, tr.n]);
  // const [nw, ne, sw] = [getVPtCircRect(tr, 0), getVPtCircRect(tr, 1), getVPtCircRect(tr, 3)];
  // const [d1, d2] = sortLn({l: [[tr.nw, tr.ne], [tr.nw, tr.sw]], by: "y"});
  const [d1, d2] = [getD([tr.n, tr.s]), getD([tr.w, tr.e])];
  // const dim = {width: getD([nw, ne]), height: getD([nw, sw])}; // original
  const dim = {width: d2, height:d1};

  if(Math.abs(angle) === (Math.PI / 2) || Math.abs(angle) === 0) {
    // return DOMRect.fromRect({
    //   x: tr.c.x - (width / 2),
    //   y: tr.c.y - (height / 2),
    //   width,
    //   height
    // });
    return DOMRect.fromRect({
      x: tr.c.x - (dim.width / 2),
      y: tr.c.y - (dim.height / 2),
      ...dim
    });
  }

  // console.log(dim, toDegrees(angle), tr.c)

  // return bbecl(tr.c, {x: dim.width / 2, y: dim.height / 2}, angle);
  // return axABBoxEp(tr.c, {width: dim.width / 2, height: dim.height / 2}, angle);
  return bb_ellipse(tr.c.x, tr.c.y, dim.width / 2, dim.height / 2, angle);*/

}
/**
 * @summary **asGeom**etri**z**e**Mat**rix**2D**
 * @description Wraps the given `DOMMatrix` with the Geometrize library `Matrix2D`.
 * @param {DOMMatrix} m a matrix to be wrapped
 * @returns {Matrix2D}
 */
function asGeomzMat2D(m){
  // return Geometrize.Matrix2D(
  //   m.a, m.b, m.c, m.d, m.e, m.f
  // );
  return Geometrize.Matrix2D(
    m.a, m.c, m.e,
    m.b, m.d, m.f
  );
}
/**
 * @summary **ax**is**Al**igned**B**ounding**Box**Of**E**lli**p**se
 * @description Calculates and returns the axis-aligned bounding box for an ellipse with the given centre, axis and angle of rotation.
 * @param {Point} centre the centre pf the ellipse
 * @param {Dimension} axis the length of the minor axis (width) and major axis (height) i.e the radius of the x and y axis respectively
 * @param {number} angle the angle (in radians) to which the eliipse is tilted. A value equal to `Math.PI / 2` or `0` means that the
 * ellipse is right-side up (upright or axis-aligned).
 * @returns {{x:number, y:number, width: number, height: number}} the axis-aligned circumscribed rectangle (bounding box) for this ellipse.
 */
function axABBoxEp(centre,axis,angle) {
  let a = axis.width * Math.cos(angle);
  let b = axis.height * Math.sin(angle);
  let c = axis.width * Math.sin(angle);
  let d = axis.height * Math.cos(angle);
  let width = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)) * 2;
  let height = Math.sqrt(Math.pow(c, 2) + Math.pow(d, 2)) * 2;
  let x = centre.x - (width * 0.5);
  let y = centre.y - (height * 0.5);
  return {
    x,y,width,height
  };
}
/**
 * 
 * @param {number} theta 
 * @param {number} cx 
 * @param {number} cy 
 * @param {number} rx 
 * @param {number} ry 
 * @param {number} alpha 
 * @returns 
 */
function arc(theta, cx, cy, rx, ry, alpha)
{
    // theta is angle in radians around arc
    // alpha is angle of rotation of ellipse in radians
    const cos = Math.cos(alpha), sin = Math.sin(alpha),
      x = rx*Math.cos(theta), y = ry*Math.sin(theta);
    return {
        x: cx + cos*x - sin*y,
        y: cy + sin*x + cos*y
    };
}
/**
 * 
 * @param {number} cx 
 * @param {number} cy 
 * @param {number} rx 
 * @param {number} ry 
 * @param {number} alpha 
 * @returns 
 */
function bb_ellipse(cx, cy, rx, ry, alpha)
{
    var tan = Math.tan(alpha),
        p1, p2, p3, p4, theta,
        xmin, ymin, xmax, ymax
    ;
    // find min/max from zeroes of directional derivative along x and y
    // along x axis
    theta = Math.atan2(-ry*tan, rx);
    // get point for this theta
    p1 = arc(theta, cx, cy, rx, ry, alpha);
    // get anti-symmetric point
    p2 = arc(theta + Math.PI, cx, cy, rx, ry, alpha);
    // along y axis
    theta = Math.atan2(ry, rx*tan);
    // get point for this theta
    p3 = arc(theta, cx, cy, rx, ry, alpha);
    // get anti-symmetric point
    p4 = arc(theta + Math.PI, cx, cy, rx, ry, alpha);
    // compute min/max values
    ymin = Math.min(p3.y, p4.y)
    xmin = Math.min(p1.x, p2.x);
    ymax = Math.max(p3.y, p4.y);
    xmax = Math.max(p1.x, p2.x);
    // return bounding box vertices
    return {x: xmin, y: ymin, width: xmax - xmin, height: ymax - ymin};
    // return [
    // {x: xmin, y: ymin},
    // {x: xmax, y: ymin},
    // {x: xmax, y: ymax},
    // {x: xmin, y: ymax}
    // ];
}
function bbecl(c, r, a) {
  // let radians = degrees * (Math.PI / 180);
  let r90 = a + Math.PI / 2;
  let ux = r.x * Math.cos(a);
  let uy = r.x * Math.sin(a);
  // let vx = r.y * Math.cos(r90);
  // let vy = r.y * Math.sin(r90);

  let width = Math.sqrt(ux * ux + vx * vx) * 2;
  let height = Math.sqrt(uy * uy + vy * vy) * 2;
  let x = c.x - (width / 2);
  let y = c.y - (height / 2);
  return {width,height,x,y};
}
/**
 * @summary **circ**le
 * @description Constructs an SVG `<circle>` element with no outline but filled with the given CSS color. If the element
 * already exists in the DOM, then the given `id` is used to retrieve it.
 * @param {DOMPoint} cp the centre point of this circle
 * @param {string} id the HTML `id` of the `<circle>` element
 * @param {string} [cl="red"] the CSS color used as the fill
 * @returns {SVGCircleElement} a pre-configured `<circle>` element
 */
function circ(cp, id, cl = "red") {
  const c = document.getElementById(id) ?? document.createElementNS("http://www.w3.org/2000/svg", "circle");
  c.setAttribute("id", id);
  c.setAttribute("stroke", "none");
  c.setAttribute("fill", cl);
  c.setAttribute("r", "5");
  c.setAttribute("cx", cp.x);
  c.setAttribute("cy", cp.y);
  try {c.remove();} catch (e) {}
  return c;
  
}
/**
 * @summary **rectangle**
 * @description Constructs an SVG `<rect>` element with no fill but outlined with the given CSS color. If the element already exists in the DOM, then the given id is used to retrieve it.
 * @param {DOMRect} r the rect from which the element is drawn. This holds the location and dimension data
 * @param {string} id the HTML id of the returned element
 * @param {string} cl the optional CSS colour of the outline the retuirned `<rect>` element.
 */
function rectangle(r, id, cl="red") {
  const rt = document.getElementById(id) ?? document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rt.setAttribute("id", id);
  rt.setAttribute("stroke", cl);
  rt.setAttribute("stroke-width", "0.5");
  rt.setAttribute("fill", "none");
  rt.setAttribute("x", r.x);
  rt.setAttribute("y", r.y);
  rt.setAttribute("width", r.width);
  rt.setAttribute("height", r.height);
  try {rt.remove();} catch (e) {}
  return rt;
}
/**
 * @summary **tri**angle
 * @description Constructs an SVG `<polygon>` element representing a triangle with no fill but outlined with the given CSS color. If the element already exists in the DOM, then the given id is used to retrieve it.
 * @param {Triangle} t the triangle from which the element is drawn. This holds the location and dimension data
 * @param {string} id the HTML id of the returned element
 * @param {string} cl the optional CSS colour of the outline the returned `<polygon>` element representing a triangle.
 */
function tri(t, id, cl="red") {
  const tg = document.getElementById(id) ?? document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  tg.setAttribute("id", id);
  tg.setAttribute("stroke", cl);
  tg.setAttribute("stroke-width", "0.5");
  tg.setAttribute("fill", "none");
  tg.setAttribute("points", t.map(x => x.x + "," + x.y).join(' '));
  try {tg.remove();} catch (e) {}
  return tg;
}
/**
 * @summary **lin**e
 * @description Constructs an SVG `<line>` element with no fill but outlined with the given CSS color. If the element
 * already exists in the DOM, then the given `id` is used to retrieve it.
 * @param {Line} l the endpoints of this line
 * @param {string} id the HTML `id` of the `<line>` element
 * @param {string} cl the CSS color used as the stroke
 * @returns {SVGCircleElement} a pre-configured `<line>` element
 */
function lin(l, id, cl = "red") {
  const ln = document.getElementById(id) ?? document.createElementNS("http://www.w3.org/2000/svg", "line");
  ln.setAttribute("id", id);
  ln.setAttribute("stroke", cl);
  ln.setAttribute("stroke-width", "0.5");
  ln.setAttribute("fill", "none");
  ln.setAttribute("x1", l[0].x);
  ln.setAttribute("y1", l[0].y);
  ln.setAttribute("x2", l[1].x);
  ln.setAttribute("y2", l[1].y);
  try {ln.remove();} catch (e) {}
  return ln;
  
}
/**
 * @summary **t**e**xtC**on**tr**o**l**
 * @description Creates 2 controls used for changing the attributes of an `SVGElement` whose id is given in the `id` argument.
 * The first control is an `<input>` element with the 
 * @param {Object} val The values to use for the text control
 * @param {string} val.title the value of the `title` attribute of the `<input>` element.
 * @param {string} val.def the initial value of the `<input>` element.
 * @param {string} val.label the value of the `<label>` element that is to label the `<input>` element.
 * @param {(e:Event, id: string) => void} val.onchange the function that is called inside the `oninput` of the `<input>` element.
 * The first element is the `Event` object. The next is the id of the `SVGElement` to be changed
 * @param {Object} unit the values to use for the `<select>` element.
 * @param {string} unit.title the value of the `title` attribute of the `<select>` element.
 * @param {string} [unit.def=""] the initial value of the `<select>` element.
 * @param {string} unit.label the value of the `<label>` element that is to label the `<select>` element.
 * @param {[[string, string]]} unit.values an array of values used for creating the `<option>` elements for the `<select>` element.
 * Each index contains a 2-length tuple whereby the tuple's first index is the value `<option>` element's value and the next is it's
 * display text.
 * @param {(e:Event, id: string) => void} unit.onchange the function that is called inside the `onchange` of the `<input>` element.
 * The first element is the `Event` object. The next is the id of the `SVGElement` to be changed
 * @param {string} id the HTML id of the `SVGElement` which this control directly relates to
 * @returns {HTMLLIElement} wraps all controls that were created in a `HTMLLIElement` (list item) and returns that list item.
 */
function txtCtrl(val, unit, id) {
  const li = document.createElement('li');

  const input = document.createElement('input');
  
  input.setAttribute('title', val.title);
  input.setAttribute('value', val.def);
  input.addEventListener('input', (e) => val.onchange(e, id));
  const inputLabel = document.createElement('label');
  inputLabel.textContent = val.label;
  input.id = id + "-" + val.label;
  inputLabel.htmlFor = input.id;
  inputLabel.title = input.title;

  const select = document.createElement('select');
  select.setAttribute('title', unit.title);
  unit.values.forEach(([value, text]) => {
    const option = document.createElement('option');
    option.setAttribute('value', value);
    option.textContent = text;
    select.appendChild(option);
  });
  select.value = unit.def || '';
  select.addEventListener('change', (e) => unit.onchange(e, id));
  const selectLabel = document.createElement('label');
  selectLabel.textContent = unit.label;
  select.id = id + "-" + val.label + "-" + unit.label;
  selectLabel.htmlFor = select.id;
  selectLabel.title = select.title;

  const inputSpan = document.createElement('span');
  const selectSpan = document.createElement('span');
  
  inputSpan.appendChild(inputLabel);
  inputSpan.appendChild(input);
  
  selectSpan.appendChild(selectLabel);
  selectSpan.appendChild(select);
  
  li.appendChild(inputSpan);
  li.appendChild(selectSpan);
  
  return li;
}
/**
 * @description Gets the bounding box of a shape after skew transformation
 * @param {DOMRect} r the bounding box of the shape before transformation
 * @param {DOMMatrix} ctm the skew transformation data
 * @returns {DOMRect} the bounding box of the shape after transformation
 */
function circumscribedDOMRect(r, ctm) {
  const {x, y, width, height} = r;
  // const {a, b, c, d, e, f} = ctm;
  // return new DOMRect(x + a * width, y + b * height, width * Math.sqrt(a * a + b * b), height * Math.sqrt(c * c + d * d));const {x, y, width, height} = r;
  const {a, b, c, d, e, f} = ctm;
  // TODO: Implement skew transformation on the bounding box of the shape
  const skewX = a * width + c * height;
  const skewY = b * width + d * height;
  const newWidth = Math.sqrt(skewX * skewX + skewY * skewY);
  const newHeight = Math.sqrt(width * width + height * height);
  return new DOMRect(x, y, newWidth, newHeight);
}

const transform = {
  matrix: {
    desc: "Affine matrix settings",
    m0: {
      desc: "",
      val: {
        desc: "the 1st value of the 3X3 matrix",
        v: (id) => {
          const mv = transform.matrix.m0.v(id);
          if (mv.length > 0) {
            return mv.match(NUM_MATCH)[0];
          }
          return "";
        },
        f: (id, e) => {
          let n = e.target.valueAsNumber ?? Number(e.target.value);
          if (Number.isFinite(n) && !Number.isNaN(n)) {
            /**@type {SVGGraphicsElement} */
            const shape = document.getElementById(id);
            let trf = shape.getAttribute("transform");
            if (trf !== undefined && trf !== null && trf.length > 0) {
              let fns = trf.split(" ");
              let index = 0;
              let t = "";
              for (; index < fns.length; index++) {
                t = fns[index];
                if (t.startsWith("matrix")) break;
                else t = "";
              }
              if (t && t.length > 0) {
                //there is a 'matrix' function in this transform attr
                let args = t
                  .replace("matrix(", "")
                  .replace(/\)$/, "")
                  .trim()
                  .split(",");
                args[0] = rfv(n, args[0]);
                // console.log(args);
                fns[index] = "matrix(" + args.join(",") + ")";
                // console.log(fns, index);
                shape.setAttribute("transform", fns.join(" "));
              } else {
                /**@type {HTMLSelectElement} The select for trigonometry*/
                const m0f = document.getElementById(id + "-m0f");
                /**@type {HTMLInputElement} The checkbox for the sign*/
                const m0s = document.getElementById(id + "-m0s");
                if (m0f.value === "tan")
                  fns.push(
                    m0s.checked
                      ? `matrix(-tan(${n}),0,0,0,0,0)`
                      : `matrix(tan(${n}),0,0,0,0,0)`
                  );
                else if (m0f.value === "sin")
                  fns.push(
                    m0s.checked
                      ? `matrix(-sin(${n}),0,0,0,0,0)`
                      : `matrix(sin(${n}),0,0,0,0,0)`
                  );
                else if (m0f.value === "cos")
                  fns.push(
                    m0s.checked
                      ? `matrix(-cos(${n}),0,0,0,0,0)`
                      : `matrix(cos(${n}),0,0,0,0,0)`
                  );
                else fns.push(`matrix(${n},0,0,1,0,0)`);
                shape.setAttribute("transform", fns.join(" "));
              }
            } else {
              /**@type {HTMLSelectElement} The select for trigonometry*/
              const m0f = document.getElementById(id + "-m0f");
              /**@type {HTMLInputElement} The checkbox for the sign*/
              const m0s = document.getElementById(id + "-m0s");
              if (m0f.value === "tan")
                shape.setAttribute(
                  "transform",
                  m0s.checked
                    ? `matrix(-tan(${n}),0,0,0,0,0)`
                    : `matrix(tan(${n}),0,0,0,0,0)`
                );
              else if (m0f.value === "sin")
                shape.setAttribute(
                  "transform",
                  m0s.checked
                    ? `matrix(-sin(${n}),0,0,0,0,0)`
                    : `matrix(sin(${n}),0,0,0,0,0)`
                );
              else if (m0f.value === "cos")
                shape.setAttribute(
                  "transform",
                  m0s.checked
                    ? `matrix(-cos(${n}),0,0,0,0,0)`
                    : `matrix(cos(${n}),0,0,0,0,0)`
                );
              else shape.setAttribute("transform", `matrix(${n},0,0,1,0,0)`);
            }
            primitives[shape.tagName].ssg(id);
          }
        },
        l: (id) => {
          let s = document.createElement("span");
          s.style.display = "flex";
          s.style.flexDirection = "row";

          let lb = document.createElement("label");
          lb.htmlFor = id + "-m0v";
          lb.title = transform.matrix.m0.val.desc;
          lb.textContent = "matrix 0";
          s.appendChild(lb);

          let ctrl = document.createElement("input");
          ctrl.type = "number";
          ctrl.name = lb.htmlFor;
          ctrl.id = lb.htmlFor;
          ctrl.title = lb.title;
          const v = transform.matrix.m0.val.v(id);
          ctrl.value = v.length > 0 ? v : "1";
          ctrl.oninput = (e) => transform.matrix.m0.val.f(id, e);
          ctrl.disabled = transform.matrix.v(id).length < 1;
          s.appendChild(ctrl);

          return s;
        },
      },
      trig: {
        desc: "the trig function to be applied to the 1st value of the 3X3 matrix",
        v: (id) => {
          const mv = transform.matrix.m0.v(id);
          if (mv.length > 0) {
            return (mv.match(/(sin|cos|tan)/) ?? [""])[0];
          }
          return "";
        },
        f: (id, e) => {
          /**@type {HTMLSelectElement} */
          const st = document.getElementById(id + "-m0f");
          const shape = document.getElementById(id);
          const trf = shape ? shape.getAttribute("transform") : null;
          if (trf) {
            let fns = trf.split(" ");
            let index = 0;
            let t = "";
            for (; index < fns.length; index++) {
              t = fns[index];
              if (t.startsWith("matrix")) break;
              else t = "";
            }
            if (t && t.length > 0) {
              const args = t
                .replace("matrix(", "")
                .replace(/\)$/, "")
                .trim()
                .split(",");
              let ty = st.value;
              if (ty.length > 0) {
                if (args[0].startsWith("-"))
                  args[0] = "-" + ty + "(" + args[0].match(NUM_MATCH)[0] + ")";
                else args[0] = ty + "(" + args[0].match(NUM_MATCH)[0] + ")";
              } else args[0] = args[0].match(NUM_MATCH)[0];
              if (shape) {
                fns[index] = "matrix(" + args.join(",") + ")";
                shape.setAttribute("transform", fns.join(" "));
                primitives[shape.tagName].ssg(id);
              }
            }
          }
        },
        l: (id) => {
          let s = document.createElement("span");
          s.style.display = "flex";
          s.style.flexDirection = "row";

          let lb = document.createElement("label");
          lb.htmlFor = id + "-m0f";
          lb.title = transform.matrix.m0.trig.desc;
          lb.textContent = "trig";
          s.appendChild(lb);

          let sel = document.createElement("select");
          let op = document.createElement("option");
          op.value = "sin";
          op.textContent = op.value;
          sel.appendChild(op);
          op = document.createElement("option");
          op.value = "cos";
          op.textContent = op.value;
          sel.appendChild(op);
          op = document.createElement("option");
          op.value = "tan";
          op.textContent = op.value;
          sel.appendChild(op);
          op = document.createElement("option");
          op.value = "";
          op.textContent = "none";
          sel.appendChild(op);
          sel.name = lb.htmlFor;
          sel.id = lb.htmlFor;
          sel.title = lb.title;
          sel.value = transform.matrix.m0.trig.v(id);
          sel.oninput = (e) => transform.matrix.m0.trig.f(id, e);
          sel.disabled = transform.matrix.v(id).length < 1;
          s.appendChild(sel);

          return s;
        },
      },
      sig: {
        desc: "If checked, the trig function will have a negative sign",
        v: (id) => {
          const mv = transform.matrix.m0.v(id);
          if (mv.length > 0) {
            return (mv.match(/\-?(sin|cos|tan)/) ?? [""])[0].startsWith("-")
              ? "-"
              : "";
          }
          return "";
        },
        f: (id, e) => {
          const shape = document.getElementById(id);
          const trf = shape ? shape.getAttribute("transform") : null;
          const chk = e.target.checked;
          if (trf) {
            let fns = trf.split(" ");
            let index = 0;
            let t = "";
            for (; index < fns.length; index++) {
              t = fns[index];
              if (t.startsWith("matrix")) break;
              else t = "";
            }
            if (t && t.length > 0) {
              const args = t
                .replace("matrix(", "")
                .replace(/\)$/, "")
                .trim()
                .split(",");
              let ty = (args[0].match(/(?:sin|cos|tan)\(/) || [""])[0];
              if (ty.length > 0) {
                args[0] =
                  (chk ? "-" : "") + ty + args[0].match(NUM_MATCH)[0] + ")";
              } else args[0] = args[0].match(NUM_MATCH)[0];
              if (shape) {
                fns[index] = "matrix(" + args.join(",") + ")";
                shape.setAttribute("transform", fns.join(" "));
                primitives[shape.tagName].ssg(id);
              }
            }
          }
        },
        l: (id) => {
          let s = document.createElement("span");
          s.style.display = "flex";
          s.style.flexDirection = "row";

          let lb = document.createElement("label");
          lb.htmlFor = id + "-m0s";
          lb.title = transform.matrix.m0.sig.desc;
          lb.textContent = "negative";
          s.appendChild(lb);

          let ctrl = document.createElement("input");
          ctrl.type = "checkbox";
          ctrl.name = lb.htmlFor;
          ctrl.id = lb.htmlFor;
          ctrl.title = lb.title;
          ctrl.checked = transform.matrix.m0.sig.v(id) === "-";
          ctrl.oninput = (e) => transform.matrix.m0.sig.f(id, e);
          ctrl.disabled = transform.matrix.v(id).length < 1;
          s.appendChild(ctrl);

          return s;
        },
      },
      v: (id) =>
        transform.matrix
          .v(id)
          .replace("matrix(", "")
          .replace(")", "")
          .split(",")[0] ?? "",
      f: (id, e) => {},
      l: (id) => {
        let s = document.createElement("span");
        s.style.display = "flex";
        s.style.flexDirection = "row";
        s.appendChild(transform.matrix.m0.val.l(id));
        s.appendChild(transform.matrix.m0.trig.l(id));
        s.appendChild(transform.matrix.m0.sig.l(id));
        return s;
      },
    },
    m1: {
      desc: "",
      val: {
        desc: "the 2nd value of the 3X3 matrix",
        v: (id) => {
          const mv = transform.matrix.m1.v(id);
          if (mv.length > 0) {
            return mv.match(NUM_MATCH)[0];
          }
          return "";
        },
        f: (id, e) => {
          let n = e.target.valueAsNumber ?? Number(e.target.value);
          if (Number.isFinite(n) && !Number.isNaN(n)) {
            /**@type {SVGGraphicsElement} */
            const shape = document.getElementById(id);
            let trf = shape.getAttribute("transform");
            if (trf !== undefined && trf !== null && trf.length > 0) {
              let fns = trf.split(" ");
              let index = 0;
              let t = "";
              for (; index < fns.length; index++) {
                t = fns[index];
                if (t.startsWith("matrix")) break;
                else t = "";
              }
              if (t && t.length > 0) {
                //there is a 'matrix' function in this transform attr
                let args = t
                  .replace("matrix(", "")
                  .replace(/\)$/, "")
                  .trim()
                  .split(",");
                args[1] = rfv(n, args[1]);
                fns[index] = "matrix(" + args.join(",") + ")";
                shape.setAttribute("transform", fns.join(" "));
              } else {
                /**@type {HTMLSelectElement} The select for trigonometry*/
                const m1f = document.getElementById(id + "-m1f");
                /**@type {HTMLInputElement} The checkbox for the sign*/
                const m1s = document.getElementById(id + "-m1s");
                if (m1f.value === "tan")
                  fns.push(
                    m1s.checked
                      ? `matrix(0,-tan(${n}),0,0,0,0)`
                      : `matrix(0,tan(${n}),0,0,0,0)`
                  );
                else if (m1f.value === "sin")
                  fns.push(
                    m1s.checked
                      ? `matrix(0,-sin(${n}),0,0,0,0)`
                      : `matrix(0,sin(${n}),0,0,0,0)`
                  );
                else if (m1f.value === "cos")
                  fns.push(
                    m1s.checked
                      ? `matrix(0,-cos(${n}),0,0,0,0)`
                      : `matrix(0,cos(${n}),0,0,0,0)`
                  );
                else fns.push(`matrix(1,${n},0,1,0,0)`);
                shape.setAttribute("transform", fns.join(" "));
              }
            } else {
              /**@type {HTMLSelectElement} The select for trigonometry*/
              const m1f = document.getElementById(id + "-m1f");
              /**@type {HTMLInputElement} The checkbox for the sign*/
              const m1s = document.getElementById(id + "-m1s");
              if (m1f.value === "tan")
                shape.setAttribute(
                  "transform",
                  m1s.checked
                    ? `matrix(0,-tan(${n}),0,0,0,0)`
                    : `matrix(0,tan(${n}),0,0,0,0)`
                );
              else if (m1f.value === "sin")
                shape.setAttribute(
                  "transform",
                  m1s.checked
                    ? `matrix(0,-sin(${n}),0,0,0,0)`
                    : `matrix(0,sin(${n}),0,0,0,0)`
                );
              else if (m1f.value === "cos")
                shape.setAttribute(
                  "transform",
                  m1s.checked
                    ? `matrix(0,-cos(${n}),0,0,0,0)`
                    : `matrix(0,cos(${n}),0,0,0,0)`
                );
              else shape.setAttribute("transform", `matrix(1,${n},0,1,0,0)`);
            }
            primitives[shape.tagName].ssg(id);
          }
        },
        l: (id) => {
          let s = document.createElement("span");
          s.style.display = "flex";
          s.style.flexDirection = "row";

          let lb = document.createElement("label");
          lb.htmlFor = id + "-m1v";
          lb.title = transform.matrix.m1.val.desc;
          lb.textContent = "matrix 1";
          s.appendChild(lb);

          let ctrl = document.createElement("input");
          ctrl.type = "number";
          ctrl.name = lb.htmlFor;
          ctrl.id = lb.htmlFor;
          ctrl.title = lb.title;
          const v = transform.matrix.m1.val.v(id);
          ctrl.value = v.length > 0 ? v : "0";
          ctrl.oninput = (e) => transform.matrix.m1.val.f(id, e);
          ctrl.disabled = transform.matrix.v(id).length < 1;
          s.appendChild(ctrl);

          return s;
        },
      },
      trig: {
        desc: "the trig function to be applied to the 2nd value of the 3X3 matrix",
        v: (id) => {
          const mv = transform.matrix.m1.v(id);
          if (mv.length > 0) {
            return (mv.match(/(sin|cos|tan)/) ?? [""])[0];
          }
          return "";
        },
        f: (id, e) => {
          /**@type {HTMLSelectElement} */
          const st = document.getElementById(id + "-m1f");
          const shape = document.getElementById(id);
          const trf = shape ? shape.getAttribute("transform") : null;
          if (trf) {
            let fns = trf.split(" ");
            let index = 0;
            let t = "";
            for (; index < fns.length; index++) {
              t = fns[index];
              if (t.startsWith("matrix")) break;
              else t = "";
            }
            if (t && t.length > 0) {
              const args = t
                .replace("matrix(", "")
                .replace(/\)$/, "")
                .trim()
                .split(",");
              let ty = st.value;
              if (ty.length > 0) {
                if (args[1].startsWith("-"))
                  args[1] = "-" + ty + "(" + args[1].match(NUM_MATCH)[0] + ")";
                else args[1] = ty + "(" + args[1].match(NUM_MATCH)[0] + ")";
              } else args[1] = args[1].match(NUM_MATCH)[0];
              if (shape) {
                fns[index] = "matrix(" + args.join(",") + ")";
                shape.setAttribute("transform", fns.join(" "));
                primitives[shape.tagName].ssg(id);
              }
            }
          }
        },
        l: (id) => {
          let s = document.createElement("span");
          s.style.display = "flex";
          s.style.flexDirection = "row";

          let lb = document.createElement("label");
          lb.htmlFor = id + "-m1f";
          lb.title = transform.matrix.m1.trig.desc;
          lb.textContent = "trig";
          s.appendChild(lb);

          let sel = document.createElement("select");
          let op = document.createElement("option");
          op.value = "sin";
          op.textContent = op.value;
          sel.appendChild(op);
          op = document.createElement("option");
          op.value = "cos";
          op.textContent = op.value;
          sel.appendChild(op);
          op = document.createElement("option");
          op.value = "tan";
          op.textContent = op.value;
          sel.appendChild(op);
          op = document.createElement("option");
          op.value = "";
          op.textContent = "none";
          sel.appendChild(op);
          sel.name = lb.htmlFor;
          sel.id = lb.htmlFor;
          sel.title = lb.title;
          sel.value = transform.matrix.m1.trig.v(id);
          sel.oninput = (e) => transform.matrix.m1.trig.f(id, e);
          sel.disabled = transform.matrix.v(id).length < 1;
          s.appendChild(sel);

          return s;
        },
      },
      sig: {
        desc: "If checked, the trig function will have a negative sign",
        v: (id) => {
          const mv = transform.matrix.m1.v(id);
          if (mv.length > 0) {
            return (mv.match(/\-?(sin|cos|tan)/) ?? [""])[0].startsWith("-")
              ? "-"
              : "";
          }
          return "";
        },
        f: (id, e) => {
          const shape = document.getElementById(id);
          const trf = shape ? shape.getAttribute("transform") : null;
          const chk = e.target.checked;
          // console.log(chk);
          if (trf) {
            let fns = trf.split(" ");
            let index = 0;
            let t = "";
            for (; index < fns.length; index++) {
              t = fns[index];
              if (t.startsWith("matrix")) break;
              else t = "";
            }
            if (t && t.length > 0) {
              const args = t
                .replace("matrix(", "")
                .replace(/\)$/, "")
                .trim()
                .split(",");
              let ty = (args[1].match(/(?:sin|cos|tan)\(/) || [""])[0];
              if (ty.length > 0) {
                args[1] =
                  (chk ? "-" : "") + ty + args[1].match(NUM_MATCH)[0] + ")";
              } else args[1] = args[1].match(NUM_MATCH)[0];
              if (shape) {
                fns[index] = "matrix(" + args.join(",") + ")";
                shape.setAttribute("transform", fns.join(" "));
                primitives[shape.tagName].ssg(id);
              }
            }
          }
        },
        l: (id) => {
          let s = document.createElement("span");
          s.style.display = "flex";
          s.style.flexDirection = "row";

          let lb = document.createElement("label");
          lb.htmlFor = id + "-m1s";
          lb.title = transform.matrix.m1.sig.desc;
          lb.textContent = "negative";
          s.appendChild(lb);

          let ctrl = document.createElement("input");
          ctrl.type = "checkbox";
          ctrl.name = lb.htmlFor;
          ctrl.id = lb.htmlFor;
          ctrl.title = lb.title;
          ctrl.checked = transform.matrix.m1.sig.v(id) === "-";
          ctrl.oninput = (e) => transform.matrix.m1.sig.f(id, e);
          ctrl.disabled = transform.matrix.v(id).length < 1;
          s.appendChild(ctrl);

          return s;
        },
      },
      v: (id) =>
        transform.matrix
          .v(id)
          .replace("matrix(", "")
          .replace(")", "")
          .split(",")[1] ?? "",
      f: (id, e) => {},
      l: (id) => {
        let s = document.createElement("span");
        s.style.display = "flex";
        s.style.flexDirection = "row";
        s.appendChild(transform.matrix.m1.val.l(id));
        s.appendChild(transform.matrix.m1.trig.l(id));
        s.appendChild(transform.matrix.m1.sig.l(id));
        return s;
      },
    },
    m2: {
      desc: "",
      val: {
        desc: "the 3rd value of the 3X3 matrix",
        v: (id) => {
          const mv = transform.matrix.m2.v(id);
          if (mv.length > 0) {
            return mv.match(NUM_MATCH)[0];
          }
          return "";
        },
        f: (id, e) => {
          let n = e.target.valueAsNumber ?? Number(e.target.value);
          if (Number.isFinite(n) && !Number.isNaN(n)) {
            /**@type {SVGGraphicsElement} */
            const shape = document.getElementById(id);
            let trf = shape.getAttribute("transform");
            if (trf !== undefined && trf !== null && trf.length > 0) {
              let fns = trf.split(" ");
              let index = 0;
              let t = "";
              for (; index < fns.length; index++) {
                t = fns[index];
                if (t.startsWith("matrix")) break;
                else t = "";
              }
              if (t && t.length > 0) {
                //there is a 'matrix' function in this transform attr
                let args = t
                  .replace("matrix(", "")
                  .replace(/\)$/, "")
                  .trim()
                  .split(",");
                args[2] = rfv(n, args[2]);
                // console.log(args);
                fns[index] = "matrix(" + args.join(",") + ")";
                // console.log(fns, index);
                shape.setAttribute("transform", fns.join(" "));
              } else {
                /**@type {HTMLSelectElement} The select for trigonometry*/
                const m2f = document.getElementById(id + "-m2f");
                /**@type {HTMLInputElement} The checkbox for the sign*/
                const m2s = document.getElementById(id + "-m2s");
                if (m2f.value === "tan")
                  fns.push(
                    m2s.checked
                      ? `matrix(0,0,-tan(${n}),0,0,0)`
                      : `matrix(0,0,tan(${n}),0,0,0)`
                  );
                else if (m2f.value === "sin")
                  fns.push(
                    m2s.checked
                      ? `matrix(0,0,-sin(${n}),0,0,0)`
                      : `matrix(0,0,sin(${n}),0,0,0)`
                  );
                else if (m2f.value === "cos")
                  fns.push(
                    m2s.checked
                      ? `matrix(0,0,-cos(${n}),0,0,0)`
                      : `matrix(0,0,cos(${n}),0,0,0)`
                  );
                else fns.push(`matrix(1,0,${n},1,0,0)`);
                shape.setAttribute("transform", fns.join(" "));
              }
            } else {
              /**@type {HTMLSelectElement} The select for trigonometry*/
              const m2f = document.getElementById(id + "-m2f");
              /**@type {HTMLInputElement} The checkbox for the sign*/
              const m2s = document.getElementById(id + "-m2s");
              if (m2f.value === "tan")
                shape.setAttribute(
                  "transform",
                  m2s.checked
                    ? `matrix(0,0,-tan(${n}),0,0,0)`
                    : `matrix(0,0,tan(${n}),0,0,0)`
                );
              else if (m2f.value === "sin")
                shape.setAttribute(
                  "transform",
                  m2s.checked
                    ? `matrix(0,0,-sin(${n}),0,0,0)`
                    : `matrix(0,0,sin(${n}),0,0,0)`
                );
              else if (m2f.value === "cos")
                shape.setAttribute(
                  "transform",
                  m2s.checked
                    ? `matrix(0,0,-cos(${n}),0,0,0)`
                    : `matrix(0,0,cos(${n}),0,0,0)`
                );
              else shape.setAttribute("transform", `matrix(1,0,${n},1,0,0)`);
            }
            primitives[shape.tagName].ssg(id);
          }
        },
        l: (id) => {
          let s = document.createElement("span");
          s.style.display = "flex";
          s.style.flexDirection = "row";

          let lb = document.createElement("label");
          lb.htmlFor = id + "-m2v";
          lb.title = transform.matrix.m2.val.desc;
          lb.textContent = "matrix 2";
          s.appendChild(lb);

          let ctrl = document.createElement("input");
          ctrl.type = "number";
          ctrl.name = lb.htmlFor;
          ctrl.id = lb.htmlFor;
          ctrl.title = lb.title;
          const v = transform.matrix.m2.val.v(id);
          ctrl.value = v.length > 0 ? v : "0";
          ctrl.oninput = (e) => transform.matrix.m2.val.f(id, e);
          ctrl.disabled = transform.matrix.v(id).length < 1;
          s.appendChild(ctrl);

          return s;
        },
      },
      trig: {
        desc: "the trig function to be applied to the 3rd value of the 3X3 matrix",
        v: (id) => {
          const mv = transform.matrix.m2.v(id);
          if (mv.length > 0) {
            return (mv.match(/(sin|cos|tan)/) ?? [""])[0];
          }
          return "";
        },
        f: (id, e) => {
          /**@type {HTMLSelectElement} */
          const st = document.getElementById(id + "-m2f");
          const shape = document.getElementById(id);
          const trf = shape ? shape.getAttribute("transform") : null;
          if (trf) {
            let fns = trf.split(" ");
            let index = 0;
            let t = "";
            for (; index < fns.length; index++) {
              t = fns[index];
              if (t.startsWith("matrix")) break;
              else t = "";
            }
            if (t && t.length > 0) {
              const args = t
                .replace("matrix(", "")
                .replace(/\)$/, "")
                .trim()
                .split(",");
              let ty = st.value;
              if (ty.length > 0) {
                if (args[2].startsWith("-"))
                  args[2] = "-" + ty + "(" + args[2].match(NUM_MATCH)[0] + ")";
                else args[2] = ty + "(" + args[2].match(NUM_MATCH)[0] + ")";
              } else args[2] = args[2].match(NUM_MATCH)[0];
              if (shape) {
                fns[index] = "matrix(" + args.join(",") + ")";
                shape.setAttribute("transform", fns.join(" "));
                primitives[shape.tagName].ssg(id);
              }
            }
          }
        },
        l: (id) => {
          let s = document.createElement("span");
          s.style.display = "flex";
          s.style.flexDirection = "row";

          let lb = document.createElement("label");
          lb.htmlFor = id + "-m2f";
          lb.title = transform.matrix.m2.trig.desc;
          lb.textContent = "trig";
          s.appendChild(lb);

          let sel = document.createElement("select");
          let op = document.createElement("option");
          op.value = "sin";
          op.textContent = op.value;
          sel.appendChild(op);
          op = document.createElement("option");
          op.value = "cos";
          op.textContent = op.value;
          sel.appendChild(op);
          op = document.createElement("option");
          op.value = "tan";
          op.textContent = op.value;
          sel.appendChild(op);
          op = document.createElement("option");
          op.value = "";
          op.textContent = "none";
          sel.appendChild(op);
          sel.name = lb.htmlFor;
          sel.id = lb.htmlFor;
          sel.title = lb.title;
          sel.value = transform.matrix.m2.trig.v(id);
          sel.oninput = (e) => transform.matrix.m2.trig.f(id, e);
          sel.disabled = transform.matrix.v(id).length < 1;
          s.appendChild(sel);

          return s;
        },
      },
      sig: {
        desc: "If checked, the trig function will have a negative sign",
        v: (id) => {
          const mv = transform.matrix.m2.v(id);
          if (mv.length > 0) {
            return (mv.match(/\-?(sin|cos|tan)/) ?? [""])[0].startsWith("-")
              ? "-"
              : "";
          }
          return "";
        },
        f: (id, e) => {
          const shape = document.getElementById(id);
          const trf = shape ? shape.getAttribute("transform") : null;
          const chk = e.target.checked;
          // console.log(chk);
          if (trf) {
            let fns = trf.split(" ");
            let index = 0;
            let t = "";
            for (; index < fns.length; index++) {
              t = fns[index];
              if (t.startsWith("matrix")) break;
              else t = "";
            }
            if (t && t.length > 0) {
              const args = t
                .replace("matrix(", "")
                .replace(/\)$/, "")
                .trim()
                .split(",");
              let ty = (args[2].match(/(?:sin|cos|tan)\(/) || [""])[0];
              if (ty.length > 0) {
                args[2] =
                  (chk ? "-" : "") + ty + args[2].match(NUM_MATCH)[0] + ")";
              } else args[2] = args[2].match(NUM_MATCH)[0];
              if (shape) {
                fns[index] = "matrix(" + args.join(",") + ")";
                shape.setAttribute("transform", fns.join(" "));
                primitives[shape.tagName].ssg(id);
              }
            }
          }
        },
        l: (id) => {
          let s = document.createElement("span");
          s.style.display = "flex";
          s.style.flexDirection = "row";

          let lb = document.createElement("label");
          lb.htmlFor = id + "-m2s";
          lb.title = transform.matrix.m2.sig.desc;
          lb.textContent = "negative";
          s.appendChild(lb);

          let ctrl = document.createElement("input");
          ctrl.type = "checkbox";
          ctrl.name = lb.htmlFor;
          ctrl.id = lb.htmlFor;
          ctrl.title = lb.title;
          ctrl.checked = transform.matrix.m2.sig.v(id) === "-";
          ctrl.oninput = (e) => transform.matrix.m2.sig.f(id, e);
          ctrl.disabled = transform.matrix.v(id).length < 1;
          s.appendChild(ctrl);

          return s;
        },
      },
      v: (id) =>
        transform.matrix
          .v(id)
          .replace("matrix(", "")
          .replace(")", "")
          .split(",")[1] ?? "",
      f: (id, e) => {},
      l: (id) => {
        let s = document.createElement("span");
        s.style.display = "flex";
        s.style.flexDirection = "row";
        s.appendChild(transform.matrix.m2.val.l(id));
        s.appendChild(transform.matrix.m2.trig.l(id));
        s.appendChild(transform.matrix.m2.sig.l(id));
        return s;
      },
    },
    m3: {
      desc: "",
      val: {
        desc: "the 4th value of the 3X3 matrix",
        v: (id) => {
          const mv = transform.matrix.m3.v(id);
          if (mv.length > 0) {
            return mv.match(NUM_MATCH)[0];
          }
          return "";
        },
        f: (id, e) => {
          let n = e.target.valueAsNumber ?? Number(e.target.value);
          if (Number.isFinite(n) && !Number.isNaN(n)) {
            /**@type {SVGGraphicsElement} */
            const shape = document.getElementById(id);
            let trf = shape.getAttribute("transform");
            if (trf !== undefined && trf !== null && trf.length > 0) {
              let fns = trf.split(" ");
              let index = 0;
              let t = "";
              for (; index < fns.length; index++) {
                t = fns[index];
                if (t.startsWith("matrix")) break;
                else t = "";
              }
              if (t && t.length > 0) {
                //there is a 'matrix' function in this transform attr
                let args = t
                  .replace("matrix(", "")
                  .replace(/\)$/, "")
                  .trim()
                  .split(",");
                args[3] = rfv(n, args[3]);
                // console.log(args);
                fns[index] = "matrix(" + args.join(",") + ")";
                // console.log(fns, index);
                shape.setAttribute("transform", fns.join(" "));
              } else {
                /**@type {HTMLSelectElement} The select for trigonometry*/
                const m3f = document.getElementById(id + "-m3f");
                /**@type {HTMLInputElement} The checkbox for the sign*/
                const m3s = document.getElementById(id + "-m3s");
                if (m3f.value === "tan")
                  fns.push(
                    m3s.checked
                      ? `matrix(0,0,0,-tan(${n}),0,0)`
                      : `matrix(0,0,0,tan(${n}),0,0)`
                  );
                else if (m3f.value === "sin")
                  fns.push(
                    m3s.checked
                      ? `matrix(0,0,0,-sin(${n}),0,0)`
                      : `matrix(0,0,0,sin(${n}),0,0)`
                  );
                else if (m3f.value === "cos")
                  fns.push(
                    m3s.checked
                      ? `matrix(0,0,0,-cos(${n}),0,0)`
                      : `matrix(0,0,0,cos(${n}),0,0)`
                  );
                else fns.push(`matrix(1,0,0,${n},0,0)`);
                shape.setAttribute("transform", fns.join(" "));
              }
            } else {
              /**@type {HTMLSelectElement} The select for trigonometry*/
              const m3f = document.getElementById(id + "-m3f");
              /**@type {HTMLInputElement} The checkbox for the sign*/
              const m3s = document.getElementById(id + "-m3s");
              if (m3f.value === "tan")
                shape.setAttribute(
                  "transform",
                  m3s.checked
                    ? `matrix(0,0,0,-tan(${n}),0,0)`
                    : `matrix(0,0,0,tan(${n}),0,0)`
                );
              else if (m3f.value === "sin")
                shape.setAttribute(
                  "transform",
                  m3s.checked
                    ? `matrix(0,0,0,-sin(${n}),0,0)`
                    : `matrix(0,0,0,sin(${n}),0,0)`
                );
              else if (m3f.value === "cos")
                shape.setAttribute(
                  "transform",
                  m3s.checked
                    ? `matrix(0,0,0,-cos(${n}),0,0)`
                    : `matrix(0,0,0,cos(${n}),0,0)`
                );
              else shape.setAttribute("transform", `matrix(1,0,0,${n},0,0)`);
            }
            primitives[shape.tagName].ssg(id);
          }
        },
        l: (id) => {
          let s = document.createElement("span");
          s.style.display = "flex";
          s.style.flexDirection = "row";

          let lb = document.createElement("label");
          lb.htmlFor = id + "-m3v";
          lb.title = transform.matrix.m3.val.desc;
          lb.textContent = "matrix 3";
          s.appendChild(lb);

          let ctrl = document.createElement("input");
          ctrl.type = "number";
          ctrl.name = lb.htmlFor;
          ctrl.id = lb.htmlFor;
          ctrl.title = lb.title;
          const v = transform.matrix.m3.val.v(id);
          ctrl.value = v.length > 0 ? v : "1";
          ctrl.oninput = (e) => transform.matrix.m3.val.f(id, e);
          ctrl.disabled = transform.matrix.v(id).length < 1;
          s.appendChild(ctrl);

          return s;
        },
      },
      trig: {
        desc: "the trig function to be applied to the 4th value of the 3X3 matrix",
        v: (id) => {
          const mv = transform.matrix.m3.v(id);
          if (mv.length > 0) {
            return (mv.match(/(sin|cos|tan)/) ?? [""])[0];
          }
          return "";
        },
        f: (id, e) => {
          /**@type {HTMLSelectElement} */
          const st = document.getElementById(id + "-m3f");
          const shape = document.getElementById(id);
          const trf = shape ? shape.getAttribute("transform") : null;
          if (trf) {
            let fns = trf.split(" ");
            let index = 0;
            let t = "";
            for (; index < fns.length; index++) {
              t = fns[index];
              if (t.startsWith("matrix")) break;
              else t = "";
            }
            if (t && t.length > 0) {
              const args = t
                .replace("matrix(", "")
                .replace(/\)$/, "")
                .trim()
                .split(",");
              let ty = st.value;
              if (ty.length > 0) {
                if (args[3].startsWith("-"))
                  args[3] = "-" + ty + "(" + args[3].match(NUM_MATCH)[0] + ")";
                else args[3] = ty + "(" + args[3].match(NUM_MATCH)[0] + ")";
              } else args[3] = args[3].match(NUM_MATCH)[0];
              if (shape) {
                fns[index] = "matrix(" + args.join(",") + ")";
                shape.setAttribute("transform", fns.join(" "));
                primitives[shape.tagName].ssg(id);
              }
            }
          }
        },
        l: (id) => {
          let s = document.createElement("span");
          s.style.display = "flex";
          s.style.flexDirection = "row";

          let lb = document.createElement("label");
          lb.htmlFor = id + "-m3f";
          lb.title = transform.matrix.m3.trig.desc;
          lb.textContent = "trig";
          s.appendChild(lb);

          let sel = document.createElement("select");
          let op = document.createElement("option");
          op.value = "sin";
          op.textContent = op.value;
          sel.appendChild(op);
          op = document.createElement("option");
          op.value = "cos";
          op.textContent = op.value;
          sel.appendChild(op);
          op = document.createElement("option");
          op.value = "tan";
          op.textContent = op.value;
          sel.appendChild(op);
          op = document.createElement("option");
          op.value = "";
          op.textContent = "none";
          sel.appendChild(op);
          sel.name = lb.htmlFor;
          sel.id = lb.htmlFor;
          sel.title = lb.title;
          sel.value = transform.matrix.m3.trig.v(id);
          sel.oninput = (e) => transform.matrix.m3.trig.f(id, e);
          sel.disabled = transform.matrix.v(id).length < 1;
          s.appendChild(sel);

          return s;
        },
      },
      sig: {
        desc: "If checked, the trig function will have a negative sign",
        v: (id) => {
          const mv = transform.matrix.m3.v(id);
          if (mv.length > 0) {
            return (mv.match(/\-?(sin|cos|tan)/) ?? [""])[0].startsWith("-")
              ? "-"
              : "";
          }
          return "";
        },
        f: (id, e) => {
          const shape = document.getElementById(id);
          const trf = shape ? shape.getAttribute("transform") : null;
          const chk = e.target.checked;
          // console.log(chk);
          if (trf) {
            let fns = trf.split(" ");
            let index = 0;
            let t = "";
            for (; index < fns.length; index++) {
              t = fns[index];
              if (t.startsWith("matrix")) break;
              else t = "";
            }
            if (t && t.length > 0) {
              const args = t
                .replace("matrix(", "")
                .replace(/\)$/, "")
                .trim()
                .split(",");
              let ty = (args[3].match(/(?:sin|cos|tan)\(/) || [""])[0];
              if (ty.length > 0) {
                args[3] =
                  (chk ? "-" : "") + ty + args[3].match(NUM_MATCH)[0] + ")";
              } else args[3] = args[3].match(NUM_MATCH)[0];
              if (shape) {
                fns[index] = "matrix(" + args.join(",") + ")";
                shape.setAttribute("transform", fns.join(" "));
                primitives[shape.tagName].ssg(id);
              }
            }
          }
        },
        l: (id) => {
          let s = document.createElement("span");
          s.style.display = "flex";
          s.style.flexDirection = "row";

          let lb = document.createElement("label");
          lb.htmlFor = id + "-m3s";
          lb.title = transform.matrix.m3.sig.desc;
          lb.textContent = "negative";
          s.appendChild(lb);

          let ctrl = document.createElement("input");
          ctrl.type = "checkbox";
          ctrl.name = lb.htmlFor;
          ctrl.id = lb.htmlFor;
          ctrl.title = lb.title;
          ctrl.checked = transform.matrix.m3.sig.v(id) === "-";
          ctrl.oninput = (e) => transform.matrix.m3.sig.f(id, e);
          ctrl.disabled = transform.matrix.v(id).length < 1;
          s.appendChild(ctrl);

          return s;
        },
      },
      v: (id) =>
        transform.matrix
          .v(id)
          .replace("matrix(", "")
          .replace(")", "")
          .split(",")[1] ?? "",
      f: (id, e) => {},
      l: (id) => {
        let s = document.createElement("span");
        s.style.display = "flex";
        s.style.flexDirection = "row";
        s.appendChild(transform.matrix.m3.val.l(id));
        s.appendChild(transform.matrix.m3.trig.l(id));
        s.appendChild(transform.matrix.m3.sig.l(id));
        return s;
      },
    },
    m4: {
      desc: "",
      val: {
        desc: "the 5th value of the 3X3 matrix",
        v: (id) => {
          const mv = transform.matrix.m4.v(id);
          if (mv.length > 0) {
            return mv.match(NUM_MATCH)[0];
          }
          return "";
        },
        f: (id, e) => {
          let n = e.target.valueAsNumber ?? Number(e.target.value);
          if (Number.isFinite(n) && !Number.isNaN(n)) {
            /**@type {SVGGraphicsElement} */
            const shape = document.getElementById(id);
            let trf = shape.getAttribute("transform");
            if (trf !== undefined && trf !== null && trf.length > 0) {
              let fns = trf.split(" ");
              let index = 0;
              let t = "";
              for (; index < fns.length; index++) {
                t = fns[index];
                if (t.startsWith("matrix")) break;
                else t = "";
              }
              if (t && t.length > 0) {
                //there is a 'matrix' function in this transform attr
                let args = t
                  .replace("matrix(", "")
                  .replace(/\)$/, "")
                  .trim()
                  .split(",");
                args[4] = rfv(n, args[4]);
                // console.log(args);
                fns[index] = "matrix(" + args.join(",") + ")";
                // console.log(fns, index);
                shape.setAttribute("transform", fns.join(" "));
              } else {
                /**@type {HTMLSelectElement} The select for trigonometry*/
                const m4f = document.getElementById(id + "-m4f");
                /**@type {HTMLInputElement} The checkbox for the sign*/
                const m4s = document.getElementById(id + "-m4s");
                if (m4f.value === "tan")
                  fns.push(
                    m4s.checked
                      ? `matrix(0,0,0,0,-tan(${n}),0)`
                      : `matrix(0,0,0,0,tan(${n}),0)`
                  );
                else if (m4f.value === "sin")
                  fns.push(
                    m4s.checked
                      ? `matrix(0,0,0,0,-sin(${n}),0)`
                      : `matrix(0,0,0,0,sin(${n}),0)`
                  );
                else if (m4f.value === "cos")
                  fns.push(
                    m4s.checked
                      ? `matrix(0,0,0,0,-cos(${n}),0)`
                      : `matrix(0,0,0,0,cos(${n}),0)`
                  );
                else fns.push(`matrix(1,0,0,1,${n},0)`);
                shape.setAttribute("transform", fns.join(" "));
              }
            } else {
              /**@type {HTMLSelectElement} The select for trigonometry*/
              const m4f = document.getElementById(id + "-m4f");
              /**@type {HTMLInputElement} The checkbox for the sign*/
              const m4s = document.getElementById(id + "-m4s");
              if (m4f.value === "tan")
                shape.setAttribute(
                  "transform",
                  m4s.checked
                    ? `matrix(0,0,0,0,-tan(${n}),0)`
                    : `matrix(0,0,0,0,tan(${n}),0)`
                );
              else if (m4f.value === "sin")
                shape.setAttribute(
                  "transform",
                  m4s.checked
                    ? `matrix(0,0,0,0,-sin(${n}),0)`
                    : `matrix(0,0,0,0,sin(${n}),0)`
                );
              else if (m4f.value === "cos")
                shape.setAttribute(
                  "transform",
                  m4s.checked
                    ? `matrix(0,0,0,0,-cos(${n}),0)`
                    : `matrix(0,0,0,0,cos(${n}),0)`
                );
              else shape.setAttribute("transform", `matrix(1,0,0,1,${n},0)`);
            }
            primitives[shape.tagName].ssg(id);
          }
        },
        l: (id) => {
          let s = document.createElement("span");
          s.style.display = "flex";
          s.style.flexDirection = "row";

          let lb = document.createElement("label");
          lb.htmlFor = id + "-m4v";
          lb.title = transform.matrix.m4.val.desc;
          lb.textContent = "matrix 4";
          s.appendChild(lb);

          let ctrl = document.createElement("input");
          ctrl.type = "number";
          ctrl.name = lb.htmlFor;
          ctrl.id = lb.htmlFor;
          ctrl.title = lb.title;
          const v = transform.matrix.m4.val.v(id);
          ctrl.value = v.length > 0 ? v : "0";
          ctrl.oninput = (e) => transform.matrix.m4.val.f(id, e);
          ctrl.disabled = transform.matrix.v(id).length < 1;
          s.appendChild(ctrl);

          return s;
        },
      },
      trig: {
        desc: "the trig function to be applied to the 4th value of the 3X3 matrix",
        v: (id) => {
          const mv = transform.matrix.m4.v(id);
          if (mv.length > 0) {
            return (mv.match(/(sin|cos|tan)/) ?? [""])[0];
          }
          return "";
        },
        f: (id, e) => {
          /**@type {HTMLSelectElement} */
          const st = document.getElementById(id + "-m4f");
          const shape = document.getElementById(id);
          const trf = shape ? shape.getAttribute("transform") : null;
          if (trf) {
            let fns = trf.split(" ");
            let index = 0;
            let t = "";
            for (; index < fns.length; index++) {
              t = fns[index];
              if (t.startsWith("matrix")) break;
              else t = "";
            }
            if (t && t.length > 0) {
              const args = t
                .replace("matrix(", "")
                .replace(/\)$/, "")
                .trim()
                .split(",");
              let ty = st.value;
              if (ty.length > 0) {
                if (args[4].startsWith("-"))
                  args[4] = "-" + ty + "(" + args[4].match(NUM_MATCH)[0] + ")";
                else args[4] = ty + "(" + args[4].match(NUM_MATCH)[0] + ")";
              } else args[4] = args[4].match(NUM_MATCH)[0];
              if (shape) {
                fns[index] = "matrix(" + args.join(",") + ")";
                shape.setAttribute("transform", fns.join(" "));
                primitives[shape.tagName].ssg(id);
              }
            }
          }
        },
        l: (id) => {
          let s = document.createElement("span");
          s.style.display = "flex";
          s.style.flexDirection = "row";

          let lb = document.createElement("label");
          lb.htmlFor = id + "-m4f";
          lb.title = transform.matrix.m4.trig.desc;
          lb.textContent = "trig";
          s.appendChild(lb);

          let sel = document.createElement("select");
          let op = document.createElement("option");
          op.value = "sin";
          op.textContent = op.value;
          sel.appendChild(op);
          op = document.createElement("option");
          op.value = "cos";
          op.textContent = op.value;
          sel.appendChild(op);
          op = document.createElement("option");
          op.value = "tan";
          op.textContent = op.value;
          sel.appendChild(op);
          op = document.createElement("option");
          op.value = "";
          op.textContent = "none";
          sel.appendChild(op);
          sel.name = lb.htmlFor;
          sel.id = lb.htmlFor;
          sel.title = lb.title;
          sel.value = transform.matrix.m4.trig.v(id);
          sel.oninput = (e) => transform.matrix.m4.trig.f(id, e);
          sel.disabled = transform.matrix.v(id).length < 1;
          s.appendChild(sel);

          return s;
        },
      },
      sig: {
        desc: "If checked, the trig function will have a negative sign",
        v: (id) => {
          const mv = transform.matrix.m4.v(id);
          if (mv.length > 0) {
            return (mv.match(/\-?(sin|cos|tan)/) ?? [""])[0].startsWith("-")
              ? "-"
              : "";
          }
          return "";
        },
        f: (id, e) => {
          const shape = document.getElementById(id);
          const trf = shape ? shape.getAttribute("transform") : null;
          const chk = e.target.checked;
          // console.log(chk);
          if (trf) {
            let fns = trf.split(" ");
            let index = 0;
            let t = "";
            for (; index < fns.length; index++) {
              t = fns[index];
              if (t.startsWith("matrix")) break;
              else t = "";
            }
            if (t && t.length > 0) {
              const args = t
                .replace("matrix(", "")
                .replace(/\)$/, "")
                .trim()
                .split(",");
              let ty = (args[4].match(/(?:sin|cos|tan)\(/) || [""])[0];
              if (ty.length > 0) {
                args[4] =
                  (chk ? "-" : "") + ty + args[4].match(NUM_MATCH)[0] + ")";
              } else args[4] = args[4].match(NUM_MATCH)[0];
              if (shape) {
                fns[index] = "matrix(" + args.join(",") + ")";
                shape.setAttribute("transform", fns.join(" "));
                primitives[shape.tagName].ssg(id);
              }
            }
          }
        },
        l: (id) => {
          let s = document.createElement("span");
          s.style.display = "flex";
          s.style.flexDirection = "row";

          let lb = document.createElement("label");
          lb.htmlFor = id + "-m4s";
          lb.title = transform.matrix.m4.sig.desc;
          lb.textContent = "negative";
          s.appendChild(lb);

          let ctrl = document.createElement("input");
          ctrl.type = "checkbox";
          ctrl.name = lb.htmlFor;
          ctrl.id = lb.htmlFor;
          ctrl.title = lb.title;
          ctrl.checked = transform.matrix.m4.sig.v(id) === "-";
          ctrl.oninput = (e) => transform.matrix.m4.sig.f(id, e);
          ctrl.disabled = transform.matrix.v(id).length < 1;
          s.appendChild(ctrl);

          return s;
        },
      },
      v: (id) =>
        transform.matrix
          .v(id)
          .replace("matrix(", "")
          .replace(")", "")
          .split(",")[1] ?? "",
      f: (id, e) => {},
      l: (id) => {
        let s = document.createElement("span");
        s.style.display = "flex";
        s.style.flexDirection = "row";
        s.appendChild(transform.matrix.m4.val.l(id));
        s.appendChild(transform.matrix.m4.trig.l(id));
        s.appendChild(transform.matrix.m4.sig.l(id));
        return s;
      },
    },
    m5: {
      desc: "",
      val: {
        desc: "the 6th value of the 3X3 matrix",
        v: (id) => {
          const mv = transform.matrix.m5.v(id);
          if (mv.length > 0) {
            return mv.match(NUM_MATCH)[0];
          }
          return "";
        },
        f: (id, e) => {
          let n = e.target.valueAsNumber ?? Number(e.target.value);
          if (Number.isFinite(n) && !Number.isNaN(n)) {
            /**@type {SVGGraphicsElement} */
            const shape = document.getElementById(id);
            let trf = shape.getAttribute("transform");
            if (trf !== undefined && trf !== null && trf.length > 0) {
              let fns = trf.split(" ");
              let index = 0;
              let t = "";
              for (; index < fns.length; index++) {
                t = fns[index];
                if (t.startsWith("matrix")) break;
                else t = "";
              }
              if (t && t.length > 0) {
                //there is a 'matrix' function in this transform attr
                let args = t
                  .replace("matrix(", "")
                  .replace(/\)$/, "")
                  .trim()
                  .split(",");
                args[5] = rfv(n, args[5]);
                // console.log(args);
                fns[index] = "matrix(" + args.join(",") + ")";
                // console.log(fns, index);
                shape.setAttribute("transform", fns.join(" "));
              } else {
                /**@type {HTMLSelectElement} The select for trigonometry*/
                const m5f = document.getElementById(id + "-m5f");
                /**@type {HTMLInputElement} The checkbox for the sign*/
                const m5s = document.getElementById(id + "-m5s");
                if (m5f.value === "tan")
                  fns.push(
                    m5s.checked
                      ? `matrix(0,0,0,0,0,-tan(${n}))`
                      : `matrix(0,0,0,0,0,tan(${n}))`
                  );
                else if (m5f.value === "sin")
                  fns.push(
                    m5s.checked
                      ? `matrix(0,0,0,0,0,-sin(${n}))`
                      : `matrix(0,0,0,0,0,sin${n})`
                  );
                else if (m5f.value === "cos")
                  fns.push(
                    m5s.checked
                      ? `matrix(0,0,0,0,0,-cos(${n}))`
                      : `matrix(0,0,0,0,0,cos(${n}))`
                  );
                else fns.push(`matrix(1,0,0,1,0,${n})`);
                shape.setAttribute("transform", fns.join(" "));
              }
            } else {
              /**@type {HTMLSelectElement} The select for trigonometry*/
              const m5f = document.getElementById(id + "-m5f");
              /**@type {HTMLInputElement} The checkbox for the sign*/
              const m5s = document.getElementById(id + "-m5s");
              if (m5f.value === "tan")
                shape.setAttribute(
                  "transform",
                  m5s.checked
                    ? `matrix(0,0,0,0,0,-tan(${n}))`
                    : `matrix(0,0,0,0,0,tan(${n}))`
                );
              else if (m5f.value === "sin")
                shape.setAttribute(
                  "transform",
                  m5s.checked
                    ? `matrix(0,0,0,0,0,-sin(${n}))`
                    : `matrix(0,0,0,0,0,sin${n})`
                );
              else if (m5f.value === "cos")
                shape.setAttribute(
                  "transform",
                  m5s.checked
                    ? `matrix(0,0,0,0,0,-cos(${n}))`
                    : `matrix(0,0,0,0,0,cos(${n}))`
                );
              else shape.setAttribute("transform", `matrix(1,0,0,1,0,${n})`);
            }
            primitives[shape.tagName].ssg(id);
          }
        },
        l: (id) => {
          let s = document.createElement("span");
          s.style.display = "flex";
          s.style.flexDirection = "row";

          let lb = document.createElement("label");
          lb.htmlFor = id + "-m5v";
          lb.title = transform.matrix.m5.val.desc;
          lb.textContent = "matrix 5";
          s.appendChild(lb);

          let ctrl = document.createElement("input");
          ctrl.type = "number";
          ctrl.name = lb.htmlFor;
          ctrl.id = lb.htmlFor;
          ctrl.title = lb.title;
          const v = transform.matrix.m5.val.v(id);
          ctrl.value = v.length > 0 ? v : "0";
          ctrl.oninput = (e) => transform.matrix.m5.val.f(id, e);
          ctrl.disabled = transform.matrix.v(id).length < 1;
          s.appendChild(ctrl);

          return s;
        },
      },
      trig: {
        desc: "the trig function to be applied to the 5th value of the 3X3 matrix",
        v: (id) => {
          const mv = transform.matrix.m5.v(id);
          if (mv.length > 0) {
            return (mv.match(/(sin|cos|tan)/) ?? [""])[0];
          }
          return "";
        },
        f: (id, e) => {
          /**@type {HTMLSelectElement} */
          const st = document.getElementById(id + "-m5f");
          const shape = document.getElementById(id);
          const trf = shape ? shape.getAttribute("transform") : null;
          if (trf) {
            let fns = trf.split(" ");
            let index = 0;
            let t = "";
            for (; index < fns.length; index++) {
              t = fns[index];
              if (t.startsWith("matrix")) break;
              else t = "";
            }
            if (t && t.length > 0) {
              const args = t
                .replace("matrix(", "")
                .replace(/\)$/, "")
                .trim()
                .split(",");
              let ty = st.value;
              if (ty.length > 0) {
                if (args[5].startsWith("-"))
                  args[5] = "-" + ty + "(" + args[5].match(NUM_MATCH)[0] + ")";
                else args[5] = ty + "(" + args[5].match(NUM_MATCH)[0] + ")";
              } else args[5] = args[5].match(NUM_MATCH)[0];
              if (shape) {
                fns[index] = "matrix(" + args.join(",") + ")";
                shape.setAttribute("transform", fns.join(" "));
                primitives[shape.tagName].ssg(id);
              }
            }
          }
        },
        l: (id) => {
          let s = document.createElement("span");
          s.style.display = "flex";
          s.style.flexDirection = "row";

          let lb = document.createElement("label");
          lb.htmlFor = id + "-m5f";
          lb.title = transform.matrix.m5.trig.desc;
          lb.textContent = "trig";
          s.appendChild(lb);

          let sel = document.createElement("select");
          let op = document.createElement("option");
          op.value = "sin";
          op.textContent = op.value;
          sel.appendChild(op);
          op = document.createElement("option");
          op.value = "cos";
          op.textContent = op.value;
          sel.appendChild(op);
          op = document.createElement("option");
          op.value = "tan";
          op.textContent = op.value;
          sel.appendChild(op);
          op = document.createElement("option");
          op.value = "";
          op.textContent = "none";
          sel.appendChild(op);
          sel.name = lb.htmlFor;
          sel.id = lb.htmlFor;
          sel.title = lb.title;
          sel.value = transform.matrix.m5.trig.v(id);
          sel.oninput = (e) => transform.matrix.m5.trig.f(id, e);
          sel.disabled = transform.matrix.v(id).length < 1;
          s.appendChild(sel);

          return s;
        },
      },
      sig: {
        desc: "If checked, the trig function will have a negative sign",
        v: (id) => {
          const mv = transform.matrix.m5.v(id);
          if (mv.length > 0) {
            return (mv.match(/\-?(sin|cos|tan)/) ?? [""])[0].startsWith("-")
              ? "-"
              : "";
          }
          return "";
        },
        f: (id, e) => {
          const shape = document.getElementById(id);
          const trf = shape ? shape.getAttribute("transform") : null;
          const chk = e.target.checked;
          // console.log(chk);
          if (trf) {
            let fns = trf.split(" ");
            let index = 0;
            let t = "";
            for (; index < fns.length; index++) {
              t = fns[index];
              if (t.startsWith("matrix")) break;
              else t = "";
            }
            if (t && t.length > 0) {
              const args = t
                .replace("matrix(", "")
                .replace(/\)$/, "")
                .trim()
                .split(",");
              let ty = (args[5].match(/(?:sin|cos|tan)\(/) || [""])[0];
              if (ty.length > 0) {
                args[5] =
                  (chk ? "-" : "") + ty + args[5].match(NUM_MATCH)[0] + ")";
              } else args[5] = args[5].match(NUM_MATCH)[0];
              if (shape) {
                fns[index] = "matrix(" + args.join(",") + ")";
                shape.setAttribute("transform", fns.join(" "));
                primitives[shape.tagName].ssg(id);
              }
            }
          }
        },
        l: (id) => {
          let s = document.createElement("span");
          s.style.display = "flex";
          s.style.flexDirection = "row";

          let lb = document.createElement("label");
          lb.htmlFor = id + "-m5s";
          lb.title = transform.matrix.m5.sig.desc;
          lb.textContent = "negative";
          s.appendChild(lb);

          let ctrl = document.createElement("input");
          ctrl.type = "checkbox";
          ctrl.name = lb.htmlFor;
          ctrl.id = lb.htmlFor;
          ctrl.title = lb.title;
          ctrl.checked = transform.matrix.m5.sig.v(id) === "-";
          ctrl.oninput = (e) => transform.matrix.m5.sig.f(id, e);
          ctrl.disabled = transform.matrix.v(id).length < 1;
          s.appendChild(ctrl);

          return s;
        },
      },
      v: (id) =>
        transform.matrix
          .v(id)
          .replace("matrix(", "")
          .replace(")", "")
          .split(",")[1] ?? "",
      f: (id, e) => {},
      l: (id) => {
        let s = document.createElement("span");
        s.style.display = "flex";
        s.style.flexDirection = "row";
        s.appendChild(transform.matrix.m5.val.l(id));
        s.appendChild(transform.matrix.m5.trig.l(id));
        s.appendChild(transform.matrix.m5.sig.l(id));
        return s;
      },
    },
    v: (id) =>
      transform
        .v(id)
        .split(" ")
        .filter((x) => x.indexOf("matrix") > -1)[0] ?? "",
    f: (id, e) => {
      const ta = getAttrOrDef(id, "transform", "");
      const shape = document.getElementById(id);
      if (e.target.checked) {
        if (ta.length > 0) {
          const tf = ta
            .split(" ")
            .filter((x) => x.indexOf("matrix") < 0)
            .join(" ")
            .trim();
          const val = transform.matrix.v(id);
          shape.dataset.m = val.length > 0 ? val : "";
          if (tf.length > 0) {
            shape.setAttribute("transform", tf);
          } else {
            shape.removeAttribute("transform");
          }
        }
        document.getElementById(id + "-m0v").setAttribute("disabled", "true");
        document.getElementById(id + "-m0f").setAttribute("disabled", "true");
        document.getElementById(id + "-m0s").setAttribute("disabled", "true");
        document.getElementById(id + "-m1v").setAttribute("disabled", "true");
        document.getElementById(id + "-m1f").setAttribute("disabled", "true");
        document.getElementById(id + "-m1s").setAttribute("disabled", "true");
        document.getElementById(id + "-m2v").setAttribute("disabled", "true");
        document.getElementById(id + "-m2f").setAttribute("disabled", "true");
        document.getElementById(id + "-m2s").setAttribute("disabled", "true");
        document.getElementById(id + "-m3v").setAttribute("disabled", "true");
        document.getElementById(id + "-m3f").setAttribute("disabled", "true");
        document.getElementById(id + "-m3s").setAttribute("disabled", "true");
        document.getElementById(id + "-m4v").setAttribute("disabled", "true");
        document.getElementById(id + "-m4f").setAttribute("disabled", "true");
        document.getElementById(id + "-m4s").setAttribute("disabled", "true");
        document.getElementById(id + "-m5v").setAttribute("disabled", "true");
        document.getElementById(id + "-m5f").setAttribute("disabled", "true");
        document.getElementById(id + "-m5s").setAttribute("disabled", "true");
      } else {
        if (ta.length > 0) {
          const tf = ta.split(" ").filter((x) => x.indexOf("matrix") < 0);
          if (tf.length > 0) {
            tf.push((shape.dataset.m ??= "matrix(0,0,0,0,0,0)"));
            shape.setAttribute("transform", tf.join(" "));
          }
        } else if (shape.dataset.m) {
          shape.setAttribute("transform", shape.dataset.m);
        }
        document.getElementById(id + "-m0v").removeAttribute("disabled");
        document.getElementById(id + "-m0f").removeAttribute("disabled");
        document.getElementById(id + "-m0s").removeAttribute("disabled");
        document.getElementById(id + "-m1v").removeAttribute("disabled");
        document.getElementById(id + "-m1f").removeAttribute("disabled");
        document.getElementById(id + "-m1s").removeAttribute("disabled");
        document.getElementById(id + "-m2v").removeAttribute("disabled");
        document.getElementById(id + "-m2f").removeAttribute("disabled");
        document.getElementById(id + "-m2s").removeAttribute("disabled");
        document.getElementById(id + "-m3v").removeAttribute("disabled");
        document.getElementById(id + "-m3f").removeAttribute("disabled");
        document.getElementById(id + "-m3s").removeAttribute("disabled");
        document.getElementById(id + "-m4v").removeAttribute("disabled");
        document.getElementById(id + "-m4f").removeAttribute("disabled");
        document.getElementById(id + "-m4s").removeAttribute("disabled");
        document.getElementById(id + "-m5v").removeAttribute("disabled");
        document.getElementById(id + "-m5f").removeAttribute("disabled");
        document.getElementById(id + "-m5s").removeAttribute("disabled");
      }
      primitives[shape.tagName].ssg(id);
    },
    l: (id) => {
      let d = document.createElement("div");
      d.style.display = "flex";
      d.style.flexDirection = "column";
      d.title = transform.matrix.desc;

      let sp = document.createElement("span");
      sp.style.display = "flex";
      sp.style.flexDirection = "row";
      sp.style.justifyContent = "space-between";
      sp.style.alignItems = "center";

      let h5 = document.createElement("h5");
      h5.title = transform.matrix.desc;
      h5.textContent = "Matrix";
      sp.appendChild(h5);

      let sp2 = document.createElement("span");

      let lb = document.createElement("label");
      lb.htmlFor = id + "-m-vis";
      lb.title = "Remove the matrix value from the transform attribute";
      lb.textContent = "disable";
      sp2.appendChild(lb);

      let ctrl = document.createElement("input");
      ctrl.type = "checkbox";
      ctrl.id = lb.htmlFor;
      ctrl.name = lb.htmlFor;
      ctrl.title = lb.title;
      ctrl.checked = transform.matrix.v(id).length < 1;
      ctrl.disabled = transform.v(id).length < 1;
      ctrl.onclick = (e) => transform.matrix.f(id, e);
      sp2.appendChild(ctrl);
      sp.appendChild(sp2);

      d.appendChild(sp);
      d.appendChild(transform.matrix.m0.l(id));
      d.appendChild(transform.matrix.m1.l(id));
      d.appendChild(transform.matrix.m2.l(id));
      d.appendChild(transform.matrix.m3.l(id));
      d.appendChild(transform.matrix.m4.l(id));
      d.appendChild(transform.matrix.m5.l(id));

      return d;
    },
  },
  rotate: {
    desc: "Rotation settings",
    a: {
      desc: "The angle of rotation",
      v: (id) =>
        transform.rotate
          .v(id)
          .replace("rotate(", "")
          .replace(/\)$/, "")
          .split(",")[0],
      f: (id, e) => {
        /**@type {HTMLInputElement} */
        const ra = e.target;
        let n = ra.valueAsNumber ?? Number(ra.value);
        if (Number.isFinite(n) && !Number.isNaN(n)) {
          /**@type {SVGGeometryElement} */
          const shape = document.getElementById(id);
          let trf = shape.getAttribute("transform");
          if (trf !== undefined && trf !== null && trf.length > 0) {
            let tfn = trf.split(" "); //transform function
            if (tfn.some((x) => x.startsWith("rotate"))) {
              for (let i = 0; i < tfn.length; i++) {
                if (tfn[i].startsWith("rotate")) {
                  let args = tfn[i]
                    .replace("rotate(", "")
                    .replace(/\)$/, "")
                    .trim()
                    .split(",");
                  args[0] = n;
                  tfn[i] = "rotate(" + args.join(",") + ")";
                  break;
                }
              }
              shape.setAttribute("transform", tfn.join(" "));
            } else {
              tfn.push(`rotate(${n})`);
              shape.setAttribute("transform", tfn.join(" "));
            }
          } else {
            shape.setAttribute("transform", `rotate(${n})`);
          }
          primitives[shape.tagName].ssg(id);
        }
      },
      l: (id) => {
        let s = document.createElement("span");
        s.style.display = "flex";
        s.style.flexDirection = "row";

        let lb = document.createElement("label");
        lb.htmlFor = id + "-r-a";
        lb.title = transform.rotate.a.desc;
        lb.textContent = "Angle of rotation";
        s.appendChild(lb);

        let ctrl = document.createElement("input");
        const v = transform.rotate.a.v(id);
        ctrl.type = "range";
        ctrl.min = "0";
        ctrl.max = "360";
        ctrl.step = "0.5";
        ctrl.name = lb.htmlFor;
        ctrl.id = lb.htmlFor;
        ctrl.title = lb.title;
        ctrl.value = v.length > 0 ? v : "0";
        ctrl.oninput = (e) => transform.rotate.a.f(id, e);
        ctrl.disabled = v.length < 1;
        s.appendChild(ctrl);

        return s;
      },
    },
    x: {
      desc: "The x-axis of the angle of rotation",
      v: (id) =>
        transform.rotate
          .v(id)
          .replace("rotate(", "")
          .replace(/\)$/, "")
          .split(",")[1] ?? "",
      f: (id, e) => {
        /**@type {HTMLInputElement} */
        const rx = e.target;
        let n = rx.valueAsNumber ?? Number(rx.value);
        if (Number.isFinite(n) && !Number.isNaN(n)) {
          /**@type {SVGGraphicsElement} */
          const shape = document.getElementById(id);
          let trf = shape.getAttribute("transform");
          if (trf !== undefined && trf !== null && trf.length > 0) {
            let tfn = trf.split(" "); //transform function
            if (tfn.some((x) => x.startsWith("rotate"))) {
              for (let i = 0; i < tfn.length; i++) {
                if (tfn[i].startsWith("rotate")) {
                  let args = tfn[i]
                    .replace("rotate(", "")
                    .replace(/\)$/, "")
                    .trim()
                    .split(",");
                  args[0] ??= 0;
                  args[1] = n;
                  args[2] ??= 0;
                  tfn[i] = "rotate(" + args.join(",") + ")";
                  break;
                }
              }
              shape.setAttribute("transform", tfn.join(" "));
            } else {
              tfn.push(`rotate(0,${n},0)`);
              shape.setAttribute("transform", tfn.join(" "));
            }
          } else {
            shape.setAttribute("transform", `rotate(0,${n},0)`);
          }
          primitives[shape.tagName].ssg(id);
        }
      },
      l: (id) => {
        let s = document.createElement("span");
        s.style.display = "flex";
        s.style.flexDirection = "row";

        let lb = document.createElement("label");
        lb.htmlFor = id + "-r-x";
        lb.title = transform.rotate.x.desc;
        lb.textContent = "rotate x";
        s.appendChild(lb);

        let ctrl = document.createElement("input");
        ctrl.type = "number";
        ctrl.name = lb.htmlFor;
        ctrl.id = lb.htmlFor;
        ctrl.title = lb.title;
        const v = transform.rotate.x.v(id);
        ctrl.value = v.length > 0 ? v : "0";
        ctrl.oninput = (e) => transform.rotate.x.f(id, e);
        ctrl.disabled = transform.rotate.v(id).length < 1;
        s.appendChild(ctrl);

        return s;
      },
    },
    y: {
      desc: "The y-axis of the angle of rotation",
      v: (id) =>
        transform.rotate
          .v(id)
          .replace("rotate(", "")
          .replace(/\)$/, "")
          .split(",")[2] ?? "",
      f: (id, e) => {
        /**@type {HTMLInputElement} */
        const rx = e.target;
        let n = rx.valueAsNumber ?? Number(rx.value);
        if (Number.isFinite(n) && !Number.isNaN(n)) {
          /**@type {SVGGraphicsElement} */
          const shape = document.getElementById(id);
          let trf = shape.getAttribute("transform");
          if (trf !== undefined && trf !== null && trf.length > 0) {
            let tfn = trf.split(" "); //transform function
            if (tfn.some((x) => x.startsWith("rotate"))) {
              for (let i = 0; i < tfn.length; i++) {
                if (tfn[i].startsWith("rotate")) {
                  let args = tfn[i]
                    .replace("rotate(", "")
                    .replace(/\)$/, "")
                    .trim()
                    .split(",");
                  args[0] ??= 0;
                  args[1] ??= 0;
                  args[2] = n;
                  tfn[i] = "rotate(" + args.join(",") + ")";
                  break;
                }
              }
              shape.setAttribute("transform", tfn.join(" "));
            } else {
              tfn.push(`rotate(0,${n},0)`);
              shape.setAttribute("transform", tfn.join(" "));
            }
          } else {
            shape.setAttribute("transform", `rotate(0,${n},0)`);
          }
          primitives[shape.tagName].ssg(id);
        }
      },
      l: (id) => {
        let s = document.createElement("span");
        s.style.display = "flex";
        s.style.flexDirection = "row";

        let lb = document.createElement("label");
        lb.htmlFor = id + "-r-y";
        lb.title = transform.rotate.y.desc;
        lb.textContent = "rotate y";
        s.appendChild(lb);

        let ctrl = document.createElement("input");
        ctrl.type = "number";
        ctrl.name = lb.htmlFor;
        ctrl.id = lb.htmlFor;
        ctrl.title = lb.title;
        const v = transform.rotate.y.v(id);
        ctrl.value = v.length > 0 ? v : "0";
        ctrl.oninput = (e) => transform.rotate.y.f(id, e);
        ctrl.disabled = transform.rotate.v(id).length < 1;
        s.appendChild(ctrl);

        return s;
      },
    },
    v: (id) =>
      transform
        .v(id)
        .split(" ")
        .filter((x) => x.indexOf("rotate") > -1)[0] ?? "",
    f: (id, e) => {
      const shape = document.getElementById(id);
      /**@type {HTMLInputElement} */
      const ch = e.target;
      if (ch.checked) {
        const val = transform
          .v(id)
          .split(" ")
          .filter((x) => x.indexOf("rotate") < 0)
          .join(" ");
        shape.dataset.r = transform.rotate.v(id) ?? "";
        if (val && val.length > 0) shape.setAttribute("transform", val);
        else shape.removeAttribute("transform");

        document.getElementById(id + "-r-a").setAttribute("disabled", "true");
        document.getElementById(id + "-r-x").setAttribute("disabled", "true");
        document.getElementById(id + "-r-y").setAttribute("disabled", "true");
      } else {
        const a = document.getElementById(id + "-r-a");
        const x = document.getElementById(id + "-r-x");
        const y = document.getElementById(id + "-r-y");

        a.removeAttribute("disabled");
        x.removeAttribute("disabled");
        y.removeAttribute("disabled");

        if (shape.dataset.r && shape.dataset.r.length > 0) {
          const args = shape.dataset.r
            .replace("rotate(", "")
            .replace(/\)$/, "")
            .split(",");
          a.value = args[0] ?? "";
          x.value = args[1] ?? "";
          y.value = args[2] ?? "";
          const val = transform.v(id).split(" ");
          if (val[0].length > 0) {
            val.push(shape.dataset.r);
            shape.setAttribute("transform", val.join(" "));
          } else {
            shape.setAttribute("transform", shape.dataset.r);
          }
        }
      }
      primitives[shape.tagName].ssg(id);
    },
    l: (id) => {
      let d = document.createElement("div");
      d.style.display = "flex";
      d.style.flexDirection = "column";
      d.title = transform.rotate.desc;

      let sp = document.createElement("span");
      sp.style.display = "flex";
      sp.style.flexDirection = "row";
      sp.style.justifyContent = "space-between";
      sp.style.alignItems = "center";

      let h5 = document.createElement("h5");
      h5.title = transform.rotate.desc;
      h5.textContent = "Rotate";
      sp.appendChild(h5);

      let sp2 = document.createElement("span");

      let lb = document.createElement("label");
      lb.htmlFor = id + "-r-vis";
      lb.title = "Remove the rotate value from the transform attribute";
      lb.textContent = "disable";
      sp2.appendChild(lb);

      let ctrl = document.createElement("input");
      ctrl.type = "checkbox";
      ctrl.id = lb.htmlFor;
      ctrl.name = lb.htmlFor;
      ctrl.title = lb.title;
      ctrl.checked = (transform.rotate.v(id) || "").length < 1;
      ctrl.disabled = transform.v(id).length < 1;
      ctrl.onclick = (e) => transform.rotate.f(id, e);
      sp2.appendChild(ctrl);
      sp.appendChild(sp2);

      d.appendChild(sp);
      d.appendChild(transform.rotate.a.l(id));
      d.appendChild(transform.rotate.x.l(id));
      d.appendChild(transform.rotate.y.l(id));

      return d;
    },
  },
  translate: {
    desc: "Translation settings",
    x: {
      desc: "The x-axis of the translation",
      v: (id) =>
        transform.translate
          .v(id)
          .replace("translate(", "")
          .replace(/\)$/, "")
          .split(",")[0] ?? "",
      f: (id, e) => {
        /**@type {HTMLInputElement} */
        const tx = e.target;
        let n = tx.valueAsNumber ?? Number(tx.value);
        if (Number.isFinite(n) && !Number.isNaN(n)) {
          /**@type {SVGGraphicsElement} */
          const shape = document.getElementById(id);
          let trf = shape.getAttribute("transform");
          if (trf !== undefined && trf !== null && trf.length > 0) {
            let tfn = trf.split(" "); //transform function
            if (tfn.some((x) => x.startsWith("translate"))) {
              for (let i = 0; i < tfn.length; i++) {
                if (tfn[i].startsWith("translate")) {
                  let args = tfn[i]
                    .replace("translate(", "")
                    .replace(/\)$/, "")
                    .trim()
                    .split(",");
                  args[0] = n;
                  args[1] ??= 0;
                  tfn[i] = "translate(" + args.join(",") + ")";
                  break;
                }
              }
              shape.setAttribute("transform", tfn.join(" "));
            } else {
              tfn.push(`translate(${n},0)`);
              shape.setAttribute("transform", tfn.join(" "));
            }
          } else {
            shape.setAttribute("transform", `translate(${n},0)`);
          }
          primitives[shape.tagName].ssg(id);
        }
      },
      l: (id) => {
        let s = document.createElement("span");
        s.style.display = "flex";
        s.style.flexDirection = "row";

        let lb = document.createElement("label");
        lb.htmlFor = id + "-t-x";
        lb.title = transform.translate.x.desc;
        lb.textContent = "translate x";
        s.appendChild(lb);

        let ctrl = document.createElement("input");
        ctrl.type = "number";
        ctrl.name = lb.htmlFor;
        ctrl.id = lb.htmlFor;
        ctrl.title = lb.title;
        const v = transform.translate.x.v(id);
        ctrl.value = v.length > 0 ? v : "0";
        ctrl.oninput = (e) => transform.translate.x.f(id, e);
        ctrl.disabled = transform.translate.v(id).length < 1;
        s.appendChild(ctrl);

        return s;
      },
    },
    y: {
      desc: "The y-axis of the translation",
      v: (id) =>
        transform.translate
          .v(id)
          .replace("translate(", "")
          .replace(/\)$/, "")
          .split(",")[1] ?? "",
      f: (id, e) => {
        /**@type {HTMLInputElement} */
        const ry = e.target;
        let n = ry.valueAsNumber ?? Number(ry.value);
        if (Number.isFinite(n) && !Number.isNaN(n)) {
          /**@type {SVGGraphicsElement} */
          const shape = document.getElementById(id);
          let trf = shape.getAttribute("transform");
          if (trf !== undefined && trf !== null && trf.length > 0) {
            let tfn = trf.split(" "); //transform function
            if (tfn.some((x) => x.startsWith("translate"))) {
              for (let i = 0; i < tfn.length; i++) {
                if (tfn[i].startsWith("translate")) {
                  let args = tfn[i]
                    .replace("translate(", "")
                    .replace(/\)$/, "")
                    .trim()
                    .split(",");
                  args[0] ??= 0;
                  args[1] = n;
                  tfn[i] = "translate(" + args.join(",") + ")";
                  break;
                }
              }
              shape.setAttribute("transform", tfn.join(" "));
            } else {
              tfn.push(`translate(0,${n})`);
              shape.setAttribute("transform", tfn.join(" "));
            }
          } else {
            shape.setAttribute("transform", `translate(0,${n})`);
          }
          primitives[shape.tagName].ssg(id);
        }
      },
      l: (id) => {
        let s = document.createElement("span");
        s.style.display = "flex";
        s.style.flexDirection = "row";

        let lb = document.createElement("label");
        lb.htmlFor = id + "-t-y";
        lb.title = transform.translate.y.desc;
        lb.textContent = "translate y";
        s.appendChild(lb);

        let ctrl = document.createElement("input");
        ctrl.type = "number";
        ctrl.name = lb.htmlFor;
        ctrl.id = lb.htmlFor;
        ctrl.title = lb.title;
        const v = transform.translate.y.v(id);
        ctrl.value = v.length > 0 ? v : "0";
        ctrl.oninput = (e) => transform.translate.y.f(id, e);
        ctrl.disabled = transform.translate.v(id).length < 1;
        s.appendChild(ctrl);

        return s;
      },
    },
    v: (id) =>
      transform
        .v(id)
        .split(" ")
        .filter((x) => x.indexOf("translate") > -1)[0] ?? "",
    f: (id, e) => {
      const shape = document.getElementById(id);
      /**@type {HTMLInputElement} */
      const ch = e.target;
      if (ch.checked) {
        const val = transform
          .v(id)
          .split(" ")
          .filter((x) => x.indexOf("translate") < 0)
          .join(" ");
        shape.dataset.t = transform.translate.v(id) ?? "";
        if (val && val.length > 0) shape.setAttribute("transform", val);
        else shape.removeAttribute("transform");

        document.getElementById(id + "-t-x").setAttribute("disabled", "true");
        document.getElementById(id + "-t-y").setAttribute("disabled", "true");
      } else {
        const x = document.getElementById(id + "-t-x");
        const y = document.getElementById(id + "-t-y");

        x.removeAttribute("disabled");
        y.removeAttribute("disabled");

        if (shape.dataset.t && shape.dataset.t.length > 0) {
          const args = shape.dataset.t
            .replace("translate(", "")
            .replace(/\)$/, "")
            .split(",");
          x.value = args[0] ?? "";
          y.value = args[1] ?? "";
          const val = transform.v(id).split(" ");
          if (val[0].length > 0) {
            val.push(shape.dataset.t);
            shape.setAttribute("transform", val.join(" "));
          } else {
            shape.setAttribute("transform", shape.dataset.t);
          }
        }
      }
      primitives[shape.tagName].ssg(id);
    },
    l: (id) => {
      let d = document.createElement("div");
      d.style.display = "flex";
      d.style.flexDirection = "column";
      d.title = transform.translate.desc;

      let sp = document.createElement("span");
      sp.style.display = "flex";
      sp.style.flexDirection = "row";
      sp.style.justifyContent = "space-between";
      sp.style.alignItems = "center";

      let h5 = document.createElement("h5");
      h5.title = transform.translate.desc;
      h5.textContent = "Translate";
      sp.appendChild(h5);

      let sp2 = document.createElement("span");

      let lb = document.createElement("label");
      lb.htmlFor = id + "-t-vis";
      lb.title = "Remove the translate value from the transform attribute";
      lb.textContent = "disable";
      sp2.appendChild(lb);

      let ctrl = document.createElement("input");
      ctrl.type = "checkbox";
      ctrl.id = lb.htmlFor;
      ctrl.name = lb.htmlFor;
      ctrl.title = lb.title;
      ctrl.checked = transform.translate.v(id).length < 1;
      ctrl.disabled = transform.v(id).length < 1;
      ctrl.onclick = (e) => transform.translate.f(id, e);
      sp2.appendChild(ctrl);
      sp.appendChild(sp2);

      d.appendChild(sp);
      d.appendChild(transform.translate.x.l(id));
      d.appendChild(transform.translate.y.l(id));

      return d;
    },
  },
  scale: {
    desc: "Scale settings",
    x: {
      desc: "The x-axis of the scaling",
      v: (id) =>
        transform.scale
          .v(id)
          .replace("scale(", "")
          .replace(/\)$/, "")
          .split(",")[0] ?? "",
      f: (id, e) => {
        /**@type {HTMLInputElement} */
        const sx = e.target;
        let n = sx.valueAsNumber ?? Number(sx.value);
        if (Number.isFinite(n) && !Number.isNaN(n)) {
          /**@type {SVGGraphicsElement} */
          const shape = document.getElementById(id);
          let trf = shape.getAttribute("transform");
          if (trf !== undefined && trf !== null && trf.length > 0) {
            let tfn = trf.split(" "); //transform function
            if (tfn.some((x) => x.startsWith("scale"))) {
              for (let i = 0; i < tfn.length; i++) {
                if (tfn[i].startsWith("scale")) {
                  let args = tfn[i]
                    .replace("scale(", "")
                    .replace(/\)$/, "")
                    .trim()
                    .split(",");
                  args[0] = n;
                  args[1] ??= 0;
                  tfn[i] = "scale(" + args.join(",") + ")";
                  break;
                }
              }
              shape.setAttribute("transform", tfn.join(" "));
            } else {
              tfn.push(`scale(${n},1)`);
              shape.setAttribute("transform", tfn.join(" "));
            }
          } else {
            shape.setAttribute("transform", `scale(${n},1)`);
          }
          primitives[shape.tagName].ssg(id);
        }
      },
      l: (id) => {
        let s = document.createElement("span");
        s.style.display = "flex";
        s.style.flexDirection = "row";

        let lb = document.createElement("label");
        lb.htmlFor = id + "-s-x";
        lb.title = transform.scale.x.desc;
        lb.textContent = "scale x";
        s.appendChild(lb);

        let ctrl = document.createElement("input");
        ctrl.type = "number";
        ctrl.name = lb.htmlFor;
        ctrl.id = lb.htmlFor;
        ctrl.title = lb.title;
        const v = transform.scale.x.v(id);
        ctrl.value = v.length > 0 ? v : "0";
        ctrl.oninput = (e) => transform.scale.x.f(id, e);
        ctrl.disabled = transform.scale.v(id).length < 1;
        s.appendChild(ctrl);

        return s;
      },
    },
    y: {
      desc: "The y-axis of the scaling",
      v: (id) =>
        transform.scale
          .v(id)
          .replace("scale(", "")
          .replace(/\)$/, "")
          .split(",")[1] ?? "",
      f: (id, e) => {
        /**@type {HTMLInputElement} */
        const ry = e.target;
        let n = ry.valueAsNumber ?? Number(ry.value);
        if (Number.isFinite(n) && !Number.isNaN(n)) {
          /**@type {SVGGraphicsElement} */
          const shape = document.getElementById(id);
          let trf = shape.getAttribute("transform");
          if (trf !== undefined && trf !== null && trf.length > 0) {
            let tfn = trf.split(" "); //transform function
            if (tfn.some((x) => x.startsWith("scale"))) {
              for (let i = 0; i < tfn.length; i++) {
                if (tfn[i].startsWith("scale")) {
                  let args = tfn[i]
                    .replace("scale(", "")
                    .replace(/\)$/, "")
                    .trim()
                    .split(",");
                  args[0] ??= 0;
                  args[1] = n;
                  tfn[i] = "scale(" + args.join(",") + ")";
                  break;
                }
              }
              shape.setAttribute("transform", tfn.join(" "));
            } else {
              tfn.push(`scale(0,${n})`);
              shape.setAttribute("transform", tfn.join(" "));
            }
          } else {
            shape.setAttribute("transform", `scale(0,${n})`);
          }
          primitives[shape.tagName].ssg(id);
        }
      },
      l: (id) => {
        let s = document.createElement("span");
        s.style.display = "flex";
        s.style.flexDirection = "row";

        let lb = document.createElement("label");
        lb.htmlFor = id + "-s-y";
        lb.title = transform.scale.y.desc;
        lb.textContent = "scale y";
        s.appendChild(lb);

        let ctrl = document.createElement("input");
        ctrl.type = "number";
        ctrl.name = lb.htmlFor;
        ctrl.id = lb.htmlFor;
        ctrl.title = lb.title;
        const v = transform.scale.y.v(id);
        ctrl.value = v.length > 0 ? v : "0";
        ctrl.oninput = (e) => transform.scale.y.f(id, e);
        ctrl.disabled = transform.scale.v(id).length < 1;
        s.appendChild(ctrl);

        return s;
      },
    },
    v: (id) =>
      transform
        .v(id)
        .split(" ")
        .filter((x) => x.indexOf("scale") > -1)[0] ?? "",
    f: (id, e) => {
      const shape = document.getElementById(id);
      /**@type {HTMLInputElement} */
      const ch = e.target;
      if (ch.checked) {
        const val = transform
          .v(id)
          .split(" ")
          .filter((x) => x.indexOf("scale") < 0)
          .join(" ");
        shape.dataset.s = transform.scale.v(id) ?? "";
        if (val && val.length > 0) shape.setAttribute("transform", val);
        else shape.removeAttribute("transform");

        document.getElementById(id + "-s-x").setAttribute("disabled", "true");
        document.getElementById(id + "-s-y").setAttribute("disabled", "true");
      } else {
        const x = document.getElementById(id + "-s-x");
        const y = document.getElementById(id + "-s-y");

        x.removeAttribute("disabled");
        y.removeAttribute("disabled");

        if (shape.dataset.s && shape.dataset.s.length > 0) {
          const args = shape.dataset.s
            .replace("scale(", "")
            .replace(/\)$/, "")
            .split(",");
          x.value = args[0] ?? "";
          y.value = args[1] ?? "";
          const val = transform.v(id).split(" ");
          if (val[0].length > 0) {
            val.push(shape.dataset.s);
            shape.setAttribute("transform", val.join(" "));
          } else {
            shape.setAttribute("transform", shape.dataset.s);
          }
        }
      }
      primitives[shape.tagName].ssg(id);
    },
    l: (id) => {
      let d = document.createElement("div");
      d.style.display = "flex";
      d.style.flexDirection = "column";
      d.title = transform.scale.desc;

      let sp = document.createElement("span");
      sp.style.display = "flex";
      sp.style.flexDirection = "row";
      sp.style.justifyContent = "space-between";
      sp.style.alignItems = "center";

      let h5 = document.createElement("h5");
      h5.title = transform.scale.desc;
      h5.textContent = "Scale";
      sp.appendChild(h5);

      let sp2 = document.createElement("span");

      let lb = document.createElement("label");
      lb.htmlFor = id + "-s-vis";
      lb.title = "Remove the scale value from the transform attribute";
      lb.textContent = "disable";
      sp2.appendChild(lb);

      let ctrl = document.createElement("input");
      ctrl.type = "checkbox";
      ctrl.id = lb.htmlFor;
      ctrl.name = lb.htmlFor;
      ctrl.title = lb.title;
      ctrl.checked = transform.scale.v(id).length < 1;
      ctrl.disabled = transform.v(id).length < 1;
      ctrl.onclick = (e) => transform.scale.f(id, e);
      sp2.appendChild(ctrl);
      sp.appendChild(sp2);

      d.appendChild(sp);
      d.appendChild(transform.scale.x.l(id));
      d.appendChild(transform.scale.y.l(id));

      return d;
    },
  },
  skewX: {
    desc: "The x-axis of the skew",
    v: (id) =>
      ((
        transform
          .v(id)
          .split(" ")
          .filter((x) => x.indexOf("skewX") > -1)[0] ?? ""
      ).match(NUM_MATCH) || [""])[0],
    f: (id, e) => {
      /**@type {HTMLInputElement} */
      const sx = e.target;
      let n = sx.valueAsNumber ?? Number(sx.value);
      if (Number.isFinite(n) && !Number.isNaN(n)) {
        /**@type {SVGGraphicsElement} */
        const shape = document.getElementById(id);
        let trf = shape.getAttribute("transform");
        if (trf !== undefined && trf !== null && trf.length > 0) {
          let tfn = trf.split(" "); //transform function
          if (tfn.some((x) => x.startsWith("skewX"))) {
            for (let i = 0; i < tfn.length; i++) {
              if (tfn[i].startsWith("skewX")) {
                let args = tfn[i]
                  .replace("skewX(", "")
                  .replace(/\)$/, "")
                  .trim()
                  .split(",");
                args[0] = n;
                tfn[i] = "skewX(" + args.join(",") + ")";
                break;
              }
            }
            shape.setAttribute("transform", tfn.join(" "));
          } else {
            tfn.push(`skewX(${n})`);
            shape.setAttribute("transform", tfn.join(" "));
          }
        } else {
          shape.setAttribute("transform", `skewX(${n})`);
        }
        primitives[shape.tagName].ssg(id);
      }
    },
    l: (id) => {
      let s = document.createElement("span");
      s.style.display = "flex";
      s.style.flexDirection = "row";

      let lb = document.createElement("label");
      lb.htmlFor = id + "-skw-x";
      lb.title = transform.skewX.desc;
      lb.textContent = "skew x";
      s.appendChild(lb);

      let ctrl = document.createElement("input");
      ctrl.type = "number";
      ctrl.name = lb.htmlFor;
      ctrl.id = lb.htmlFor;
      ctrl.title = lb.title;
      const v = transform.skewX.v(id);
      ctrl.value = v.length > 0 ? v : "0";
      ctrl.oninput = (e) => transform.skewX.f(id, e);
      ctrl.disabled = v.length < 1;
      s.appendChild(ctrl);

      lb = document.createElement("label");
      lb.htmlFor = id + "-skw-x-vis";
      lb.title = "Remove the skewX value from the transform attribute";
      lb.textContent = "disable";
      s.appendChild(lb);

      ctrl = document.createElement("input");
      ctrl.type = "checkbox";
      ctrl.name = lb.htmlFor;
      ctrl.id = lb.htmlFor;
      ctrl.title = lb.title;
      ctrl.checked = transform.skewX.v(id).length < 1;
      ctrl.disabled = transform.v(id).length < 1;
      ctrl.onclick = (e) => {
        const shape = document.getElementById(id);
        /**@type {HTMLInputElement} */
        const ch = e.target;
        if (ch.checked) {
          const val = transform
            .v(id)
            .split(" ")
            .filter((x) => x.indexOf("skewX") < 0)
            .join(" ");
          shape.dataset.skwx = ("skewX(" + transform.skewX.v(id) + ")") ?? "";
          if (val && val.length > 0) shape.setAttribute("transform", val);
          else shape.removeAttribute("transform");

          document
            .getElementById(id + "-skw-x")
            .setAttribute("disabled", "true");
        } else {
          const x = document.getElementById(id + "-skw-x");

          x.removeAttribute("disabled");

          if (shape.dataset.skwx && shape.dataset.skwx.length > 0) {
            const args = shape.dataset.skwx
              .replace("skewX(", "")
              .replace(/\)$/, "")
              .split(",");
            x.value = args[0] ?? "";
            const val = transform.v(id).split(" ");
            if (val[0].length > 0) {
              val.push(shape.dataset.skwx);
              shape.setAttribute("transform", val.join(" "));
            } else {
              shape.setAttribute("transform", shape.dataset.skwx);
            }
          }
        }
        primitives[shape.tagName].ssg(id);
      };
      s.appendChild(ctrl);

      return s;
    },
  },
  skewY: {
    desc: "The y-axis of the skew",
    v: (id) =>
      ((
        transform
          .v(id)
          .split(" ")
          .filter((x) => x.indexOf("skewY") > -1)[0] ?? ""
      ).match(NUM_MATCH) || [""])[0],
    f: (id, e) => {
      /**@type {HTMLInputElement} */
      const sy = e.target;
      let n = sy.valueAsNumber ?? Number(sy.value);
      if (Number.isFinite(n) && !Number.isNaN(n)) {
        /**@type {SVGGraphicsElement} */
        const shape = document.getElementById(id);
        let trf = shape.getAttribute("transform");
        if (trf !== undefined && trf !== null && trf.length > 0) {
          let tfn = trf.split(" "); //transform function
          if (tfn.some((x) => x.startsWith("skewY"))) {
            for (let i = 0; i < tfn.length; i++) {
              if (tfn[i].startsWith("skewY")) {
                let args = tfn[i]
                  .replace("skewY(", "")
                  .replace(/\)$/, "")
                  .trim()
                  .split(",");
                args[0] = n;
                tfn[i] = "skewY(" + args.join(",") + ")";
                break;
              }
            }
            shape.setAttribute("transform", tfn.join(" "));
          } else {
            tfn.push(`skewY(${n})`);
            shape.setAttribute("transform", tfn.join(" "));
          }
        } else {
          shape.setAttribute("transform", `skewY(${n})`);
        }
        primitives[shape.tagName].ssg(id);
      }
    },
    l: (id) => {
      let s = document.createElement("span");
      s.style.display = "flex";
      s.style.flexDirection = "row";

      let lb = document.createElement("label");
      lb.htmlFor = id + "-skw-y";
      lb.title = transform.skewY.desc;
      lb.textContent = "skew y";
      s.appendChild(lb);

      let ctrl = document.createElement("input");
      ctrl.type = "number";
      ctrl.name = lb.htmlFor;
      ctrl.id = lb.htmlFor;
      ctrl.title = lb.title;
      const v = transform.skewY.v(id);
      ctrl.value = v.length > 0 ? v : "0";
      ctrl.oninput = (e) => transform.skewY.f(id, e);
      ctrl.disabled = v.length < 1;
      s.appendChild(ctrl);

      lb = document.createElement("label");
      lb.htmlFor = id + "-skw-y-vis";
      lb.title = "Remove the skewY value from the transform attribute";
      lb.textContent = "disable";
      s.appendChild(lb);

      ctrl = document.createElement("input");
      ctrl.type = "checkbox";
      ctrl.name = lb.htmlFor;
      ctrl.id = lb.htmlFor;
      ctrl.title = lb.title;
      ctrl.checked = transform.skewY.v(id).length < 1;
      ctrl.disabled = transform.v(id).length < 1;
      ctrl.onclick = (e) => {
        const shape = document.getElementById(id);
        /**@type {HTMLInputElement} */
        const ch = e.target;
        if (ch.checked) {
          const val = transform
            .v(id)
            .split(" ")
            .filter((x) => x.indexOf("skewY") < 0)
            .join(" ");
          shape.dataset.skwy = ("skewY(" + transform.skewY.v(id) + ")") ?? "";
          if (val && val.length > 0) shape.setAttribute("transform", val);
          else shape.removeAttribute("transform");

          document
            .getElementById(id + "-skw-y")
            .setAttribute("disabled", "true");
        } else {
          const x = document.getElementById(id + "-skw-y");

          x.removeAttribute("disabled");

          if (shape.dataset.skwy && shape.dataset.skwy.length > 0) {
            const args = shape.dataset.skwy
              .replace("skewY(", "")
              .replace(/\)$/, "")
              .split(",");
            x.value = args[0] ?? "";
            const val = transform.v(id).split(" ");
            if (val[0].length > 0) {
              val.push(shape.dataset.skwy);
              shape.setAttribute("transform", val.join(" "));
            } else {
              shape.setAttribute("transform", shape.dataset.skwy);
            }
          }
        }
        primitives[shape.tagName].ssg(id);
      };
      s.appendChild(ctrl);

      return s;
    },
  },
  desc: "Apply a transform to this object",
  anim: false,
  v: (id) => getAttrOrDef(id, "transform", ""),
  f: (id, e) => {
    const shape = document.getElementById(id);
    /**@type {HTMLInputElement} */
    const ch = e.target;

    const mat = document.getElementById(id + "-m-vis");
    const rot = document.getElementById(id + "-r-vis");
    const trn = document.getElementById(id + "-t-vis");
    const scl = document.getElementById(id + "-s-vis");
    const skwx = document.getElementById(id + "-skw-x-vis");
    const skwy = document.getElementById(id + "-skw-y-vis");
    if (ch.checked) {
      mat.checked = ch.checked;
      rot.checked = ch.checked;
      trn.checked = ch.checked;
      scl.checked = ch.checked;
      skwx.checked = ch.checked;
      skwy.checked = ch.checked;
      const val = transform.v(id);
      shape.dataset.transform = val.length > 0 ? val : "";
      shape.removeAttribute("transform");

      mat.setAttribute("disabled", "true");
      rot.setAttribute("disabled", "true");
      trn.setAttribute("disabled", "true");
      scl.setAttribute("disabled", "true");
      skwx.setAttribute("disabled", "true");
      skwy.setAttribute("disabled", "true");
    } else {
      mat.removeAttribute("disabled");
      rot.removeAttribute("disabled");
      trn.removeAttribute("disabled");
      scl.removeAttribute("disabled");
      skwx.removeAttribute("disabled");
      skwy.removeAttribute("disabled");

      if (shape.dataset.transform && shape.dataset.transform.length > 0) {
        shape.setAttribute("transform", shape.dataset.transform);
      }
    }
  },
  l: (id, attr) => {
    attr ??= document.querySelector("li.attributes .attr");

    let li = document.createElement("li");
    li.classList.add("attribute");

    let div = document.createElement("div");
    div.style.display = "flex";
    div.style.flexDirection = "row";
    div.style.justifyContent = "space-between";
    div.style.alignItems = "center";

    let h5 = document.createElement("h5");
    h5.textContent = "Transform";
    h5.title = transform.desc;
    div.appendChild(h5);

    let span = document.createElement("span");

    let lb = document.createElement("label");
    lb.htmlFor = id + "-t";
    lb.title = "Remove the transform attribute";
    lb.textContent = "disable all tranformations";
    span.appendChild(lb);

    let ctrl = document.createElement("input");
    ctrl.type = "checkbox";
    ctrl.name = lb.htmlFor;
    ctrl.id = lb.htmlFor;
    ctrl.title = lb.title;
    ctrl.checked = transform.v(id).length < 1;
    ctrl.onclick = (e) => transform.f(id, e);
    span.appendChild(ctrl);
    div.appendChild(span);
    li.appendChild(div);
    attr.appendChild(li);

    li = document.createElement("li");
    li.setAttribute("class", "attribute");
    li.appendChild(transform.translate.l(id));
    attr.appendChild(li);

    li = document.createElement("li");
    li.setAttribute("class", "attribute");
    li.appendChild(transform.rotate.l(id));
    attr.appendChild(li);

    li = document.createElement("li");
    li.setAttribute("class", "attribute");
    li.appendChild(transform.scale.l(id));
    attr.appendChild(li);

    li = document.createElement("li");
    li.setAttribute("class", "attribute");
    li.appendChild(transform.skewX.l(id));
    attr.appendChild(li);

    li = document.createElement("li");
    li.setAttribute("class", "attribute");
    li.appendChild(transform.skewY.l(id));
    attr.appendChild(li);

    li = document.createElement("li");
    li.setAttribute("class", "attribute");
    li.appendChild(transform.matrix.l(id));
    attr.appendChild(li);
  },
};

const fill = {
  anim: true,
  desc: "The color or image used as the background for the enclosed part of the shape",
  def: {
    v: () => document.getElementById("fill").dataset.fill,
    f: (val, fill) => {
      switch (val) {
        case "none":
          fill.dataset.fill = "none";
          break;
        case "url": {
          const span = document.createElement("span");
          const ctrl = document.createElement("input");
          ctrl.title = fill.children[0].title;
          ctrl.onchange = (e) => {
            document.getElementById("fill").dataset.fill = e.target.value;
          };
          span.appendChild(ctrl);
          fill.insertBefore(span, fill.children[fill.children.length - 1]);
          fill.dataset.fill = "";
          break;
        }
        case "picker": {
          const span = document.createElement("span");
          span.style.display = "flex";
          span.style.flexDirection = "row";
          span.style.justifyContent = "space-around";
          span.style.alignItems = "center";
          const ctrl = document.createElement("input");
          ctrl.type = "color";
          ctrl.value = "#000000";
          ctrl.onchange = (e) => {
            e.target.nextSibling.style.backgroundColor = e.target.value;
            document.getElementById("fill").dataset.fill = e.target.value;
          };
          span.appendChild(ctrl);
          const div = document.createElement("div");
          div.style.width = "25px";
          div.style.height = "25px";
          div.style.backgroundColor = ctrl.value;
          span.appendChild(div);
          fill.insertBefore(span, fill.children[fill.children.length - 1]);
          fill.dataset.fill = "#000000";
          break;
        }
        case "keyword": {
          const span = document.createElement("span");
          span.style.display = "flex";
          span.style.flexDirection = "row";
          span.style.justifyContent = "space-around";
          span.style.alignItems = "center";
          const sl = document.createElement("select");
          fill.style.visibility = "hidden";
          document.body.style.cursor = "progress";
          Object.keys(namedColors).forEach((key) => {
            if (key === "transparent") return;
            const op = document.createElement("option");
            op.value = key;
            op.textContent = key;
            sl.appendChild(op);
          });
          fill.style.visibility = "visible";
          document.body.style.cursor = "default";
          sl.value = "black";
          sl.onchange = (e) => {
            e.target.nextSibling.style.backgroundColor = e.target.value;
            document.getElementById("fill").dataset.fill = e.target.value;
          };
          span.appendChild(sl);
          const div = document.createElement("div");
          div.style.width = "25px";
          div.style.height = "25px";
          div.style.backgroundColor = sl.value;
          span.appendChild(div);
          fill.insertBefore(span, fill.children[fill.children.length - 1]);
          fill.dataset.fill = sl.value;
          break;
        }
        case "wikipedia": {
          const span = document.createElement("span");
          span.style.display = "flex";
          span.style.flexDirection = "row";
          span.style.justifyContent = "space-around";
          span.style.alignItems = "center";
          const sl = document.createElement("select");
          fill.style.visibility = "hidden";
          document.body.style.cursor = "progress";
          Object.keys(colors).forEach((key) => {
            const op = document.createElement("option");
            op.value = colors[key];
            op.textContent = key;
            sl.appendChild(op);
          });
          fill.style.visibility = "visible";
          document.body.style.cursor = "default";
          sl.onchange = (e) => {
            e.target.nextSibling.style.backgroundColor = e.target.value;
            document.getElementById("fill").dataset.fill = e.target.value;
          };
          sl.value = "#000000";
          span.appendChild(sl);
          const div = document.createElement("div");
          div.style.width = "25px";
          div.style.height = "25px";
          div.style.backgroundColor = sl.value;
          span.appendChild(div);
          fill.insertBefore(span, fill.children[fill.children.length - 1]);
          fill.dataset.fill = "#000000";
          break;
        }
        case "context": {
          const span = document.createElement("span");
          const sl = document.createElement("select");
          let op = document.createElement("option");
          op.value = "context-fill";
          op.textContent = op.value;
          op.selected = true;
          op.title =
            "a reference to the paint layers generated for the fill property, respectively, of the context element of the element being painted";
          sl.appendChild(op);
          op = document.createElement("option");
          op.value = "context-stroke";
          op.textContent = op.value;
          op.title =
            "a reference to the paint layers generated for the stroke property, respectively, of the context element of the element being painted";
          sl.appendChild(op);
          sl.onchange = (e) => {
            e.target.title = e.target.selectedOptions[0].title;
            document.getElementById("fill").dataset.fill = e.target.value;
          };
          span.appendChild(sl);
          fill.insertBefore(span, fill.children[fill.children.length - 1]);
          fill.dataset.fill = "context-fill";
          break;
        }
        default:
          break;
      }
    },
    l: () => {
      const div = document.createElement("div");
      div.style.display = "flex";
      div.style.flexDirection = "row";
      div.style.justifyContent = "space-around";
      div.style.alignContent = "center";
      div.id = "fill";
      div.title = fill.desc;
      let lb = document.createElement("label");
      lb.title = "select a fill type";
      lb.htmlFor = "fill-type";
      lb.textContent = "Fill type";
      const sl = document.createElement("select");
      let op = document.createElement("option");
      op.value = "none";
      op.title = "set the fill to none";
      op.textContent = op.value;
      op.selected = true;
      sl.appendChild(op);
      op = document.createElement("option");
      op.value = "url";
      op.title =
        "A URL reference to a paint server element, which is an element that defines\n1. a paint server: 'linearGradient', 'pattern' and 'radialGradient'. e.g url(#my-gradient)\n2. a color function (hsl(), rgb(), ciexyz() color() etc)\n3. a color name (aquamarine, gold)";
      op.textContent = op.value;
      sl.appendChild(op);
      op = document.createElement("option");
      op.value = "keyword";
      op.title = "choose a html/css keyword";
      op.textContent = op.value;
      sl.appendChild(op);
      op = document.createElement("option");
      op.value = "picker";
      op.title = "use a color picker";
      op.textContent = op.value;
      sl.appendChild(op);
      op = document.createElement("option");
      op.value = "wikipedia";
      op.title = "Choose from known names";
      op.textContent = op.value;
      sl.appendChild(op);
      op = document.createElement("option");
      op.value = "context";
      op.title = "Choose context-fill or context-stroke";
      op.textContent = op.value;
      sl.appendChild(op);
      sl.id = lb.htmlFor;
      sl.name = lb.htmlFor;
      sl.title = sl.selectedOptions[0].title;
      sl.onchange = (e) => {
        e.target.title = e.target.selectedOptions[0].title;
        const fl = document.getElementById("fill");
        if (fl.childElementCount === 3) fl.removeChild(fl.children[1]);
        fill.def.f(e.target.value, fl);
      };
      div.dataset.fill = sl.value;
      lb.appendChild(sl);
      div.appendChild(lb);
      lb = document.createElement("label");
      lb.title = "disable the fill attribute";
      lb.htmlFor = "fill-type-vis";
      lb.textContent = "disable";
      const ctrl = document.createElement("input");
      ctrl.id = lb.htmlFor;
      ctrl.name = lb.htmlFor;
      ctrl.type = "checkbox";
      ctrl.checked = sl.disabled;
      ctrl.onclick = (e) => {
        const fill = document.getElementById("fill");
        if (e.target.checked) {
          document.getElementById("fill-type").setAttribute("disabled", "true");
          if (fill.children.length === 3) {
            fill.children[1].style.visibility = "hidden";
            fill.children[1].style.pointerEvents = "none";
          }
        } else {
          document.getElementById("fill-type").removeAttribute("disabled");
          if (fill.children.length === 3) {
            fill.children[1].style.visibility = "visible";
            fill.children[1].style.pointerEvents = "auto";
          }
        }
        /*set the fill to data-value and vice-versa*/
      };
      lb.appendChild(ctrl);
      div.appendChild(lb);

      return div;
    },
  },
  v: (id) => getAttrOrDef(id, "fill"),
  f: (id, val, fill) => {
    switch (val) {
      case "none":
        fill.dataset.fill = "none";
        break;
      case "url": {
        const span = document.createElement("span");
        const ctrl = document.createElement("input");
        ctrl.title = fill.children[0].title;
        ctrl.onchange = (e) => {
          document.getElementById(id + "-fill").dataset.fill = e.target.value;
          document.getElementById(id).setAttribute("fill", e.target.value);
        };
        span.appendChild(ctrl);
        fill.insertBefore(span, fill.children[fill.children.length - 1]);
        fill.dataset.fill = "";
        break;
      }
      case "picker": {
        const span = document.createElement("span");
        span.style.display = "flex";
        span.style.flexDirection = "row";
        span.style.justifyContent = "space-around";
        span.style.alignItems = "center";
        const ctrl = document.createElement("input");
        ctrl.type = "color";
        ctrl.value = "#000000";
        ctrl.onchange = (e) => {
          e.target.nextSibling.style.backgroundColor = e.target.value;
          document.getElementById(id + "-fill").dataset.fill = e.target.value;
          document.getElementById(id).setAttribute("fill", e.target.value);
        };
        span.appendChild(ctrl);
        const div = document.createElement("div");
        div.style.width = "25px";
        div.style.height = "25px";
        div.style.backgroundColor = ctrl.value;
        span.appendChild(div);
        fill.insertBefore(span, fill.children[fill.children.length - 1]);
        fill.dataset.fill = "#000000";
        break;
      }
      case "keyword": {
        const span = document.createElement("span");
        span.style.display = "flex";
        span.style.flexDirection = "row";
        span.style.justifyContent = "space-around";
        span.style.alignItems = "center";
        const sl = document.createElement("select");
        fill.style.visibility = "hidden";
        document.body.style.cursor = "progress";
        Object.keys(namedColors).forEach((key) => {
          if (key === "transparent") return;
          const op = document.createElement("option");
          op.value = key;
          op.textContent = key;
          sl.appendChild(op);
        });
        fill.style.visibility = "visible";
        document.body.style.cursor = "default";
        sl.value = "black";
        sl.onchange = (e) => {
          e.target.nextSibling.style.backgroundColor = e.target.value;
          document.getElementById(id + "-fill").dataset.fill = e.target.value;
          document.getElementById(id).setAttribute("fill", e.target.value);
        };
        span.appendChild(sl);
        const div = document.createElement("div");
        div.style.width = "25px";
        div.style.height = "25px";
        div.style.backgroundColor = sl.value;
        span.appendChild(div);
        fill.insertBefore(span, fill.children[fill.children.length - 1]);
        fill.dataset.fill = sl.value;
        break;
      }
      case "wikipedia": {
        const span = document.createElement("span");
        span.style.display = "flex";
        span.style.flexDirection = "row";
        span.style.justifyContent = "space-around";
        span.style.alignItems = "center";
        const sl = document.createElement("select");
        fill.style.visibility = "hidden";
        document.body.style.cursor = "progress";
        Object.keys(colors).forEach((key) => {
          const op = document.createElement("option");
          op.value = colors[key];
          op.textContent = key;
          sl.appendChild(op);
        });
        fill.style.visibility = "visible";
        document.body.style.cursor = "default";
        sl.onchange = (e) => {
          e.target.nextSibling.style.backgroundColor = e.target.value;
          document.getElementById(id + "-fill").dataset.fill = e.target.value;
          document.getElementById(id).setAttribute("fill", e.target.value);
        };
        sl.value = "#000000";
        span.appendChild(sl);
        const div = document.createElement("div");
        div.style.width = "25px";
        div.style.height = "25px";
        div.style.backgroundColor = sl.value;
        span.appendChild(div);
        fill.insertBefore(span, fill.children[fill.children.length - 1]);
        fill.dataset.fill = "#000000";
        break;
      }
      case "context": {
        const span = document.createElement("span");
        const sl = document.createElement("select");
        let op = document.createElement("option");
        op.value = "context-fill";
        op.textContent = op.value;
        op.selected = true;
        op.title =
          "a reference to the paint layers generated for the fill property, respectively, of the context element of the element being painted";
        sl.appendChild(op);
        op = document.createElement("option");
        op.value = "context-stroke";
        op.textContent = op.value;
        op.title =
          "a reference to the paint layers generated for the stroke property, respectively, of the context element of the element being painted";
        sl.appendChild(op);
        sl.onchange = (e) => {
          e.target.title = e.target.selectedOptions[0].title;
          document.getElementById(id + "-fill").dataset.fill = e.target.value;
          document.getElementById(id).setAttribute("fill", e.target.value);
        };
        span.appendChild(sl);
        fill.insertBefore(span, fill.children[fill.children.length - 1]);
        fill.dataset.fill = "context-fill";
        break;
      }
      default:
        break;
    }
  },
  l: (id, attr) => {
    attr ??= document.querySelector("li.attributes .attr");

    //fill
    let li = document.createElement("li");
    li.setAttribute("class", "attribute");

    const div = document.createElement("div");
    div.style.display = "flex";
    div.style.flexDirection = "row";
    div.style.justifyContent = "space-around";
    div.style.alignContent = "center";
    div.id = id + "-fill";
    div.title = fill.desc;
    let span = document.createElement("span");
    let lb = document.createElement("label");
    lb.title = "select a fill type";
    lb.htmlFor = id + "-fill-type";
    lb.textContent = "Fill type";
    span.appendChild(lb);
    const sl = document.createElement("select");
    let v = fill.v(id);
    let op = document.createElement("option");
    op.value = "none";
    op.title = "set the fill to none";
    op.textContent = op.value;
    op.selected = v === "none" || v === "";
    sl.appendChild(op);
    op = document.createElement("option");
    op.value = "url";
    op.title =
      "A URL reference to a paint server element, which is an element that defines\n1. a paint server: 'linearGradient', 'pattern' and 'radialGradient'. e.g url(#my-gradient)\n2. a color function (hsl(), rgb(), ciexyz() color() etc)\n3. a color name (aquamarine, gold)";
    op.textContent = op.value;
    op.selected = v.startsWith("url");
    sl.appendChild(op);
    op = document.createElement("option");
    op.value = "keyword";
    op.title = "choose a html/css keyword";
    op.textContent = op.value;
    op.selected = !v.startsWith("none") && /^[a-z][a-z]+[a-z]$/.test(v);
    sl.appendChild(op);
    op = document.createElement("option");
    op.value = "picker";
    op.title = "use a color picker";
    op.textContent = op.value;
    op.selected = v.startsWith("#");
    sl.appendChild(op);
    op = document.createElement("option");
    op.value = "wikipedia";
    op.title = "Choose from known names";
    op.textContent = op.value;
    sl.appendChild(op);
    op = document.createElement("option");
    op.value = "context";
    op.title = "Choose context-fill or context-stroke";
    op.textContent = op.value;
    op.selected = v.startsWith("context");
    sl.appendChild(op);
    sl.id = lb.htmlFor;
    sl.name = lb.htmlFor;
    sl.disabled = v === "";
    sl.title = sl.selectedOptions[0].title;
    sl.onchange = (e) => {
      e.target.title = e.target.selectedOptions[0].title;
      const fl = document.getElementById(id + "-fill");
      if (fl.childElementCount === 3) fl.removeChild(fl.children[1]);
      fill.f(id, e.target.value, fl);
      document.getElementById(id).setAttribute("fill", fl.dataset.fill);
      //set the shape's fill to the default
    };
    div.dataset.fill = sl.value;
    span.appendChild(sl);
    div.appendChild(span);
    span = document.createElement("span");
    lb = document.createElement("label");
    lb.title = "disable the fill attribute";
    lb.htmlFor = id + "-fill-type-vis";
    lb.textContent = "disable";
    span.appendChild(lb);
    const ctrl = document.createElement("input");
    ctrl.id = lb.htmlFor;
    ctrl.name = lb.htmlFor;
    ctrl.type = "checkbox";
    ctrl.checked = sl.disabled;
    ctrl.onclick = (e) => {
      const fill = document.getElementById(id + "-fill");
      if (e.target.checked) {
        document
          .getElementById(id + "-fill-type")
          .setAttribute("disabled", "true");
        if (fill.children.length === 3) {
          fill.children[1].style.visibility = "hidden";
          fill.children[1].style.pointerEvents = "none";
        }
        document.getElementById(id).removeAttribute("fill");
      } else {
        document.getElementById(id + "-fill-type").removeAttribute("disabled");
        if (fill.children.length === 3) {
          fill.children[1].style.visibility = "visible";
          fill.children[1].style.pointerEvents = "auto";
        }
        document.getElementById(id).setAttribute("fill", fill.dataset.fill);
      }
      /*set the fill to data-value and vice-versa*/
    };
    span.appendChild(ctrl);
    div.appendChild(span);
    li.appendChild(div);
    attr.appendChild(li);
    fill.f(id, sl.value, div);
  },
};

const fillOpacity = {
  desc: "the opacity of the paint server (color, gradient, pattern, etc.) applied to the fill of a shape",
  def: {
    v: () => document.getElementById("fill-opacity").valueAsNumber / 100,
    f: (e) => {
      const fo = document.getElementById("fill-opacity");
      if (e.target.checked) {
        fo.setAttribute("disabled", "true");
      } else {
        fo.removeAttribute("disabled");
      }
    },
    l: () => {
      const div = document.createElement("div");
      let span = document.createElement("span");
      let lb = document.createElement("label");
      lb.title = fillOpacity.desc;
      lb.htmlFor = "fill-opacity";
      lb.textContent = "fill opacity";
      let ctrl = document.createElement("input");
      ctrl.type = "range";
      ctrl.min = "0";
      ctrl.max = "100";
      ctrl.step = "1";
      ctrl.name = lb.htmlFor;
      ctrl.id = lb.htmlFor;
      ctrl.title = lb.title;
      ctrl.value = ctrl.max;
      ctrl.disabled = true;
      lb.appendChild(ctrl);
      span.appendChild(lb);
      div.appendChild(span);

      span = document.createElement("span");
      lb = document.createElement("label");
      lb.htmlFor = "fill-opacity-vis";
      lb.textContent = "disable";
      lb.title = "Remove the fill-opacity attribute";

      ctrl = document.createElement("input");
      ctrl.type = "checkbox";
      ctrl.name = lb.htmlFor;
      ctrl.id = lb.htmlFor;
      ctrl.title = lb.title;
      ctrl.checked = true;
      ctrl.onclick = (e) => fillOpacity.def.f(e);
      lb.appendChild(ctrl);
      span.appendChild(lb);
      div.appendChild(span);
      return div;
    },
  },
  v: (id) => getAttrOrDef(id, "fill-opacity"),
  f: (id, e) =>
    document
      .getElementById(id)
      .setAttribute("fill-opacity", e.target.valueAsNumber / 100),
  l: (id, attr) => {
    let li = document.createElement("li");
    li.setAttribute("class", "attribute");

    let lb = document.createElement("label");
    lb.htmlFor = id + "-fo";
    lb.textContent = "fill opacity";
    lb.title = fillOpacity.desc;
    li.appendChild(lb);

    let ctrl = document.createElement("input");
    const v = fillOpacity.v(id);
    ctrl.type = "range";
    ctrl.min = 0;
    ctrl.max = 100;
    ctrl.step = 1;
    ctrl.name = lb.htmlFor;
    ctrl.id = lb.htmlFor;
    ctrl.title = lb.title;
    ctrl.oninput = (e) => fillOpacity.f(id, e);
    ctrl.disabled = v === "";
    ctrl.value = v !== "" ? Number(v) * 100 : "100";
    li.appendChild(ctrl);

    lb = document.createElement("label");
    lb.htmlFor = id + "-fo-vis";
    lb.textContent = "disable";
    lb.title = "Remove the fill-opacity attribute";
    li.appendChild(lb);

    ctrl = document.createElement("input");
    ctrl.type = "checkbox";
    ctrl.name = lb.htmlFor;
    ctrl.id = lb.htmlFor;
    ctrl.title = lb.title;
    ctrl.checked = fillOpacity.v(id).length < 1;
    ctrl.onclick = (e) => {
      const shape = document.getElementById(id);
      const v = fillOpacity.v(id);
      if (e.target.checked) {
        shape.dataset.fillOpacity = v.length > 0 ? v : "";
        shape.removeAttribute("fill-opacity");
        document.getElementById(id + "-fo").setAttribute("disabled", "true");
      } else {
        if (shape.dataset.fillOpacity && shape.dataset.fillOpacity.length > 0)
          shape.setAttribute("fill-opacity", shape.dataset.fillOpacity);
        document.getElementById(id + "-fo").removeAttribute("disabled");
      }
    };
    li.appendChild(ctrl);

    attr.appendChild(li);
  },
};

const fillRule = {
  desc: "the algorithm to use to determine the inside part of a shape",
  def: {
    v: () => document.getElementById("fill-rule").value,
    f: (e) => {
      const fo = document.getElementById("fill-rule");
      if (e.target.checked) {
        fo.setAttribute("disabled", "true");
      } else {
        fo.removeAttribute("disabled");
      }
    },
    l: () => {
      const div = document.createElement("div");
      let span = document.createElement("span");
      let lb = document.createElement("label");
      lb.htmlFor = "fill-rule";
      lb.textContent = "fill rule";
      lb.title = fillRule.desc;
      let sel = document.createElement("select");
      let op = document.createElement("option");
      op.value = "nonzero";
      op.textContent = op.value;
      sel.appendChild(op);
      op = document.createElement("option");
      op.value = "evenodd";
      op.textContent = op.value;
      sel.appendChild(op);
      sel.name = lb.htmlFor;
      sel.id = lb.htmlFor;
      sel.title = lb.title;
      sel.disabled = true;
      lb.appendChild(sel);
      span.appendChild(lb);
      div.appendChild(span);

      span = document.createElement("span");
      lb = document.createElement("label");
      lb.htmlFor = "fill-rule-vis";
      lb.textContent = "disable";
      lb.title = "Remove the fill-rule attribute";

      ctrl = document.createElement("input");
      ctrl.type = "checkbox";
      ctrl.name = lb.htmlFor;
      ctrl.id = lb.htmlFor;
      ctrl.title = lb.title;
      ctrl.checked = true;
      ctrl.onclick = (e) => fillRule.def.f(e);
      lb.appendChild(ctrl);
      span.appendChild(lb);
      div.appendChild(span);
      return div;
    },
  },
  v: (id) => getAttrOrDef(id, "fill-rule"),
  f: (id, e) =>
    document.getElementById(id).setAttribute("fill-rule", e.target.value),
  l: (id, attr) => {
    let li = document.createElement("li");
    li.setAttribute("class", "attribute");

    let lb = document.createElement("label");
    lb.htmlFor = id + "-fr";
    lb.textContent = "fill rule";
    lb.title = "the algorithm to use to determine the inside part of a shape";
    li.appendChild(lb);

    let sel = document.createElement("select");
    let op = document.createElement("option");
    op.value = "nonzero";
    op.textContent = op.value;
    op.selected = fillRule.v(id) === op.value;
    sel.appendChild(op);
    op = document.createElement("option");
    op.value = "evenodd";
    op.textContent = op.value;
    op.selected = fillRule.v(id) === op.value;
    sel.appendChild(op);
    op = document.createElement("option");
    op.value = "";
    op.textContent = op.value;
    op.selected = fillRule.v(id) === op.value;
    sel.prepend(op);
    sel.name = lb.htmlFor;
    sel.id = lb.htmlFor;
    sel.title = lb.title;
    sel.onchange = (e) => fillRule.f(id, e);
    sel.disabled = fillRule.v(id) === "";
    li.appendChild(sel);

    lb = document.createElement("label");
    lb.htmlFor = id + "-fr-vis";
    lb.textContent = "disable";
    lb.title = "Remove the fill-rule attribute";
    li.appendChild(lb);

    let ctrl = document.createElement("input");
    ctrl.type = "checkbox";
    ctrl.name = lb.htmlFor;
    ctrl.id = lb.htmlFor;
    ctrl.title = lb.title;
    ctrl.checked = fillRule.v(id).length < 1;
    ctrl.onclick = (e) => {
      const shape = document.getElementById(id);
      if (e.target.checked) {
        shape.dataset.fillRule =
          fillRule.v(id).length > 0 ? fillRule.v(id) : "";
        shape.removeAttribute("fill-rule");
        document.getElementById(id + "-fr").setAttribute("disabled", "true");
      } else {
        if (shape.dataset.fillRule && shape.dataset.fillRule.length > 0)
          shape.setAttribute("fill-rule", shape.dataset.fillRule);
        document.getElementById(id + "-fr").removeAttribute("disabled");
      }
    };
    li.appendChild(ctrl);

    attr.appendChild(li);
  },
};

const shapeRendering = {
  desc: "provides hints to the renderer about what tradeoffs to make when rendering shapes",
  def: {
    v: () => document.getElementById("shape-rendering").value,
    f: (e) => {
      const fo = document.getElementById("shape-rendering");
      if (e.target.checked) {
        fo.setAttribute("disabled", "true");
      } else {
        fo.removeAttribute("disabled");
      }
    },
    l: () => {
      const div = document.createElement("div");
      let span = document.createElement("span");
      let lb = document.createElement("label");
      lb.htmlFor = "shape-rendering";
      lb.textContent = "shape rendering";
      lb.title = shapeRendering.desc;
      let sel = document.createElement("select");
      let op = document.createElement("option");
      op.value = "auto";
      op.textContent = op.value;
      sel.appendChild(op);
      op = document.createElement("option");
      op.value = "optimizeSpeed";
      op.textContent = op.value;
      sel.appendChild(op);
      op = document.createElement("option");
      op.value = "crispEdges";
      op.textContent = op.value;
      sel.appendChild(op);
      op = document.createElement("option");
      op.value = "geometricPrecision";
      op.textContent = op.value;
      sel.appendChild(op);
      sel.name = lb.htmlFor;
      sel.id = lb.htmlFor;
      sel.title = lb.title;
      sel.disabled = true;
      lb.appendChild(sel);
      span.appendChild(lb);
      div.appendChild(span);

      span = document.createElement("span");
      lb = document.createElement("label");
      lb.htmlFor = "shape-rendering-vis";
      lb.textContent = "disable";
      lb.title = "Remove the shape-rendering attribute";

      ctrl = document.createElement("input");
      ctrl.type = "checkbox";
      ctrl.name = lb.htmlFor;
      ctrl.id = lb.htmlFor;
      ctrl.title = lb.title;
      ctrl.checked = true;
      ctrl.onclick = (e) => shapeRendering.def.f(e);
      lb.appendChild(ctrl);
      span.appendChild(lb);
      div.appendChild(span);
      return div;
    },
  },
  v: (id) => getAttrOrDef(id, "shape-rendering"),
  f: (id, e) =>
    document.getElementById(id).setAttribute("shape-rendering", e.target.value),
  l: (id, attr) => {
    let li = document.createElement("li");
    li.setAttribute("class", "attribute");

    let lb = document.createElement("label");
    lb.htmlFor = id + "-sr";
    lb.textContent = "shape rendering";
    lb.title = shapeRendering.desc;
    li.appendChild(lb);

    let sel = document.createElement("select");
    const v = shapeRendering.v(id);
    let op = document.createElement("option");
    op.value = "auto";
    op.textContent = op.value;
    op.selected = v === op.value;
    sel.appendChild(op);
    op = document.createElement("option");
    op.value = "crispEdges";
    op.textContent = op.value;
    op.selected = v === op.value;
    sel.appendChild(op);
    op = document.createElement("option");
    op.value = "optimizeSpeed";
    op.textContent = op.value;
    op.selected = v === op.value;
    sel.appendChild(op);
    op = document.createElement("option");
    op.value = "geometricPrecision";
    op.textContent = op.value;
    op.selected = v === op.value;
    sel.appendChild(op);
    sel.name = lb.htmlFor;
    sel.id = lb.htmlFor;
    sel.title = lb.title;
    sel.onchange = (e) => shapeRendering.f(id, e);
    sel.disabled = v === "";
    li.appendChild(sel);

    lb = document.createElement("label");
    lb.htmlFor = id + "-sr-vis";
    lb.textContent = "disable";
    lb.title = "Remove the shape-rendering attribute";
    li.appendChild(lb);

    let ctrl = document.createElement("input");
    ctrl.type = "checkbox";
    ctrl.name = lb.htmlFor;
    ctrl.id = lb.htmlFor;
    ctrl.title = lb.title;
    ctrl.checked = shapeRendering.v(id).length < 1;
    ctrl.onclick = (e) => {
      const shape = document.getElementById(id);
      const v = shapeRendering.v(id);
      if (e.target.checked) {
        shape.dataset.shapeRendering = v.length > 0 ? v : "";
        shape.removeAttribute("shape-rendering");
        document.getElementById(id + "-sr").setAttribute("disabled", "true");
      } else {
        if (
          shape.dataset.shapeRendering &&
          shape.dataset.shapeRendering.length > 0
        )
          shape.setAttribute("shape-rendering", shape.dataset.shapeRendering);
        document.getElementById(id + "-sr").removeAttribute("disabled");
      }
    };
    li.appendChild(ctrl);

    attr.appendChild(li);
  },
};

const vectorEffect = {
  desc: "the vector effect to use when drawing an object",
  def: {
    v: () => document.getElementById("vector-effect").value,
    f: (e) => {
      const fo = document.getElementById("vector-effect");
      if (e.target.checked) {
        fo.setAttribute("disabled", "true");
      } else {
        fo.removeAttribute("disabled");
      }
    },
    l: () => {
      const div = document.createElement("div");
      let span = document.createElement("span");
      let lb = document.createElement("label");
      lb.htmlFor = "vector-effect";
      lb.textContent = "vector effect";
      lb.title = vectorEffect.desc;
      let sel = document.createElement("select");
      let op = document.createElement("option");
      op.value = "auto";
      op.textContent = op.value;
      sel.appendChild(op);
      op = document.createElement("option");
      op.value = "none";
      op.textContent = op.value;
      sel.appendChild(op);
      op = document.createElement("option");
      op.value = "non-scaling-stroke";
      op.textContent = op.value;
      sel.appendChild(op);
      op = document.createElement("option");
      op.value = "non-scaling-size";
      op.textContent = op.value;
      sel.appendChild(op);
      op = document.createElement("option");
      op.value = "non-rotation";
      op.textContent = op.value;
      sel.appendChild(op);
      op = document.createElement("option");
      op.value = "fixed-position";
      op.textContent = op.value;
      sel.appendChild(op);
      sel.name = lb.htmlFor;
      sel.id = lb.htmlFor;
      sel.title = lb.title;
      sel.disabled = true;
      lb.appendChild(sel);
      span.appendChild(lb);
      div.appendChild(span);

      span = document.createElement("span");
      lb = document.createElement("label");
      lb.htmlFor = "vector-effect-vis";
      lb.textContent = "disable";
      lb.title = "Remove the vector-effect attribute";

      ctrl = document.createElement("input");
      ctrl.type = "checkbox";
      ctrl.name = lb.htmlFor;
      ctrl.id = lb.htmlFor;
      ctrl.title = lb.title;
      ctrl.checked = true;
      ctrl.onclick = (e) => vectorEffect.def.f(e);
      lb.appendChild(ctrl);
      span.appendChild(lb);
      div.appendChild(span);
      return div;
    },
  },
  v: (id) => getAttrOrDef(id, "vector-effect"),
  f: (id, e) =>
    document.getElementById(id).setAttribute("vector-effect", e.target.value),
  l: (id, attr) => {
    let li = document.createElement("li");
    li.setAttribute("class", "attribute");

    let lb = document.createElement("label");
    lb.htmlFor = id + "-veceff";
    lb.textContent = "vector effect";
    lb.title = vectorEffect.desc;
    li.appendChild(lb);

    let sel = document.createElement("select");
    const v = vectorEffect.v(id);
    let op = document.createElement("option");
    op.value = "none";
    op.textContent = op.value;
    op.selected = v === op.value;
    sel.appendChild(op);
    op = document.createElement("option");
    op.value = "non-scaling-stroke";
    op.textContent = op.value;
    op.selected = v === op.value;
    sel.appendChild(op);
    op = document.createElement("option");
    op.value = "non-scaling-size";
    op.textContent = op.value;
    op.selected = v === op.value;
    sel.appendChild(op);
    op = document.createElement("option");
    op.value = "non-rotation";
    op.textContent = op.value;
    op.selected = v === op.value;
    sel.appendChild(op);
    op = document.createElement("option");
    op.value = "fixed-position";
    op.textContent = op.value;
    op.selected = v === op.value;
    sel.appendChild(op);
    sel.name = lb.htmlFor;
    sel.id = lb.htmlFor;
    sel.title = lb.title;
    sel.onchange = (e) => vectorEffect.f(id, e);
    sel.disabled = v === "";
    li.appendChild(sel);

    lb = document.createElement("label");
    lb.htmlFor = id + "-veceff-vis";
    lb.textContent = "disable";
    lb.title = "Remove the vector-effect attribute";
    li.appendChild(lb);

    let ctrl = document.createElement("input");
    ctrl.type = "checkbox";
    ctrl.name = lb.htmlFor;
    ctrl.id = lb.htmlFor;
    ctrl.title = lb.title;
    ctrl.checked = vectorEffect.v(id).length < 1;
    ctrl.onclick = (e) => {
      const shape = document.getElementById(id);
      const v = vectorEffect.v(id);
      if (e.target.checked) {
        shape.dataset.vectorEffect = v.length > 0 ? v : "";
        shape.removeAttribute("vector-effect");
        document
          .getElementById(id + "-veceff")
          .setAttribute("disabled", "true");
      } else {
        if (shape.dataset.vectorEffect && shape.dataset.vectorEffect.length > 0)
          shape.setAttribute("vector-effect", shape.dataset.vectorEffect);
        document.getElementById(id + "-veceff").removeAttribute("disabled");
      }
    };
    li.appendChild(ctrl);

    attr.appendChild(li);
  },
};

const strokeWidth = {
  desc: "The thickness the outline of a shape",
  def: {
    v: () => document.getElementById("stroke-width").value,
    f: (e) => {
      const fo = document.getElementById("stroke-width");
      if (e.target.checked) {
        fo.setAttribute("disabled", "true");
      } else {
        fo.removeAttribute("disabled");
      }
    },
    l: () => {
      const div = document.createElement("div");
      let span = document.createElement("span");
      let lb = document.createElement("label");
      lb.htmlFor = "stroke-width";
      lb.textContent = "stroke width";
      lb.title = strokeWidth.desc;
      let ctrl = document.createElement("input");
      ctrl.type = "number";
      ctrl.name = lb.htmlFor;
      ctrl.id = lb.htmlFor;
      ctrl.title = lb.title;
      ctrl.disabled = false;
      ctrl.value = 1;
      lb.appendChild(ctrl);
      span.appendChild(lb);
      div.appendChild(span);

      span = document.createElement("span");
      lb = document.createElement("label");
      lb.htmlFor = "stroke-width-vis";
      lb.textContent = "disable";
      lb.title = "Remove the stroke-width attribute";

      ctrl = document.createElement("input");
      ctrl.type = "checkbox";
      ctrl.name = lb.htmlFor;
      ctrl.id = lb.htmlFor;
      ctrl.title = lb.title;
      ctrl.checked = false;
      ctrl.onclick = (e) => strokeWidth.def.f(e);
      lb.appendChild(ctrl);
      span.appendChild(lb);
      div.appendChild(span);
      return div;
    },
  },
  v: (id) => getAttrOrDef(id, "stroke-width"),
  f: (id, e) =>
    document.getElementById(id).setAttribute("stroke-width", e.target.value),
  l: (id, attr) => {
    let li = document.createElement("li");
    li.setAttribute("class", "attribute");

    let lb = document.createElement("label");
    lb.htmlFor = id + "-str-width";
    lb.textContent = "stroke width";
    lb.title = strokeWidth.desc;
    li.appendChild(lb);

    let ctrl = document.createElement("input");
    const v = strokeWidth.v(id);
    ctrl.type = "number";
    ctrl.name = lb.htmlFor;
    ctrl.id = lb.htmlFor;
    ctrl.title = lb.title;
    ctrl.oninput = (e) => strokeWidth.f(id, e);
    ctrl.disabled = v === "";
    ctrl.value = v;
    li.appendChild(ctrl);

    lb = document.createElement("label");
    lb.htmlFor = id + "-str-width-vis";
    lb.textContent = "disable";
    lb.title = "Remove the stroke-width attribute";
    li.appendChild(lb);

    ctrl = document.createElement("input");
    ctrl.type = "checkbox";
    ctrl.name = lb.htmlFor;
    ctrl.id = lb.htmlFor;
    ctrl.title = lb.title;
    ctrl.checked = strokeWidth.v(id).length < 1;
    ctrl.onclick = (e) => {
      const shape = document.getElementById(id);
      const v = strokeWidth.v(id);
      if (e.target.checked) {
        shape.dataset.strokeWidth = v.length > 0 ? v : "";
        shape.removeAttribute("stroke-width");
        document
          .getElementById(id + "-str-width")
          .setAttribute("disabled", "true");
      } else {
        if (shape.dataset.strokeWidth && shape.dataset.strokeWidth.length > 0)
          shape.setAttribute("stroke-width", shape.dataset.strokeWidth);
        document.getElementById(id + "-str-width").removeAttribute("disabled");
      }
    };
    li.appendChild(ctrl);

    attr.appendChild(li);
  },
};

const strokeDashOffset = {
  desc: "configure the offset on the rendering of the associated dash array",
  def: {
    v: () => document.getElementById("stroke-dashoffset").valueAsNumber,
    f: (e) => {
      const fo = document.getElementById("stroke-dashoffset");
      if (e.target.checked) {
        fo.setAttribute("disabled", "true");
      } else {
        fo.removeAttribute("disabled");
      }
    },
    l: () => {
      const div = document.createElement("div");
      let span = document.createElement("span");
      let lb = document.createElement("label");
      lb.title = strokeDashOffset.desc;
      lb.htmlFor = "stroke-dashoffset";
      lb.textContent = "stroke dash offset";
      let ctrl = document.createElement("input");
      ctrl.type = "range";
      ctrl.min = -100;
      ctrl.max = 100;
      ctrl.step = 1;
      ctrl.name = lb.htmlFor;
      ctrl.id = lb.htmlFor;
      ctrl.title = lb.title;
      ctrl.value = 0;
      ctrl.disabled = true;
      lb.appendChild(ctrl);
      span.appendChild(lb);
      div.appendChild(span);

      span = document.createElement("span");
      lb = document.createElement("label");
      lb.htmlFor = "stroke-dashoffset-vis";
      lb.textContent = "disable";
      lb.title = "Remove the stroke-dashoffset attribute";

      ctrl = document.createElement("input");
      ctrl.type = "checkbox";
      ctrl.name = lb.htmlFor;
      ctrl.id = lb.htmlFor;
      ctrl.title = lb.title;
      ctrl.checked = true;
      ctrl.onclick = (e) => strokeDashOffset.def.f(e);
      lb.appendChild(ctrl);
      span.appendChild(lb);
      div.appendChild(span);
      return div;
    },
  },
  v: (id) => getAttrOrDef(id, "stroke-dashoffset"),
  f: (id, e) =>
    document
      .getElementById(id)
      .setAttribute("stroke-dashoffset", e.target.value),
  l: (id, attr) => {
    let li = document.createElement("li");
    li.setAttribute("class", "attribute");

    let lb = document.createElement("label");
    lb.htmlFor = id + "-stroke-do";
    lb.textContent = "stroke dash offset";
    lb.title = strokeDashOffset.desc;
    li.appendChild(lb);

    let ctrl = document.createElement("input");
    const v = strokeDashOffset.v(id);
    ctrl.type = "range";
    ctrl.min = -100;
    ctrl.max = 100;
    ctrl.step = 1;
    ctrl.name = lb.htmlFor;
    ctrl.id = lb.htmlFor;
    ctrl.title = lb.title;
    ctrl.oninput = (e) => strokeDashOffset.f(id, e);
    ctrl.disabled = v === "";
    ctrl.value = v;
    li.appendChild(ctrl);

    lb = document.createElement("label");
    lb.htmlFor = id + "-stroke-do-vis";
    lb.textContent = "disable";
    lb.title = "Remove the stroke-dashoffset attribute";
    li.appendChild(lb);

    ctrl = document.createElement("input");
    ctrl.type = "checkbox";
    ctrl.name = lb.htmlFor;
    ctrl.id = lb.htmlFor;
    ctrl.title = lb.title;
    ctrl.checked = strokeDashOffset.v(id).length < 1;
    ctrl.onclick = (e) => {
      const shape = document.getElementById(id);
      const v = strokeDashOffset.v(id);
      if (e.target.checked) {
        shape.dataset.strokeDashOffset = v.length > 0 ? v : "";
        shape.removeAttribute("stroke-dashoffset");
        document
          .getElementById(id + "-stroke-do")
          .setAttribute("disabled", "true");
      } else {
        if (
          shape.dataset.strokeDashOffset &&
          shape.dataset.strokeDashOffset.length > 0
        )
          shape.setAttribute(
            "stroke-dashoffset",
            shape.dataset.strokeDashOffset
          );
        document.getElementById(id + "-stroke-do").removeAttribute("disabled");
      }
    };
    li.appendChild(ctrl);

    attr.appendChild(li);
  },
};

const lineCap = {
  desc: "defines the shape of the open ends of an outline",
  def: {
    v: () => document.getElementById("stroke-linecap").value,
    f: (e) => {
      const fo = document.getElementById("stroke-linecap");
      if (e.target.checked) {
        fo.setAttribute("disabled", "true");
      } else {
        fo.removeAttribute("disabled");
      }
    },
    l: () => {
      const div = document.createElement("div");
      let span = document.createElement("span");
      let lb = document.createElement("label");
      lb.htmlFor = "stroke-linecap";
      lb.textContent = "line cap";
      lb.title = lineCap.desc;
      let sel = document.createElement("select");
      let op = document.createElement("option");
      op.value = "butt";
      op.textContent = op.value;
      sel.appendChild(op);
      op = document.createElement("option");
      op.value = "round";
      op.textContent = op.value;
      sel.appendChild(op);
      op = document.createElement("option");
      op.value = "square";
      op.textContent = op.value;
      sel.appendChild(op);
      sel.name = lb.htmlFor;
      sel.id = lb.htmlFor;
      sel.title = lb.title;
      sel.disabled = true;
      lb.appendChild(sel);
      span.appendChild(lb);
      div.appendChild(span);

      span = document.createElement("span");
      lb = document.createElement("label");
      lb.htmlFor = "stroke-linecap-vis";
      lb.textContent = "disable";
      lb.title = "Remove the stroke-linecap attribute";

      ctrl = document.createElement("input");
      ctrl.type = "checkbox";
      ctrl.name = lb.htmlFor;
      ctrl.id = lb.htmlFor;
      ctrl.title = lb.title;
      ctrl.checked = true;
      ctrl.onclick = (e) => lineCap.def.f(e);
      lb.appendChild(ctrl);
      span.appendChild(lb);
      div.appendChild(span);
      return div;
    },
  },
  v: (id) => getAttrOrDef(id, "stroke-linecap"),
  f: (id, e) =>
    document.getElementById(id).setAttribute("stroke-linecap", e.target.value),
  l: (id, attr) => {
    let li = document.createElement("li");
    li.setAttribute("class", "attribute");

    let lb = document.createElement("label");
    lb.htmlFor = id + "-stroke-lc";
    lb.textContent = "line cap";
    lb.title = lineCap.desc;
    li.appendChild(lb);

    let sel = document.createElement("select");
    const v = vectorEffect.v(id);
    let op = document.createElement("option");
    op.value = "";
    op.textContent = op.value;
    op.selected = v === op.value;
    sel.appendChild(op);
    op = document.createElement("option");
    op.value = "butt";
    op.textContent = op.value;
    op.selected = v === op.value;
    sel.appendChild(op);
    op = document.createElement("option");
    op.value = "round";
    op.textContent = op.value;
    op.selected = v === op.value;
    sel.appendChild(op);
    op = document.createElement("option");
    op.value = "square";
    op.textContent = op.value;
    op.selected = v === op.value;
    sel.appendChild(op);
    sel.name = lb.htmlFor;
    sel.id = lb.htmlFor;
    sel.title = lb.title;
    sel.oninput = (e) => lineCap.f(id, e);
    sel.disabled = v === "";
    li.appendChild(sel);

    lb = document.createElement("label");
    lb.htmlFor = id + "-stroke-lc-vis";
    lb.textContent = "disable";
    lb.title = "Remove the stroke-linecap attribute";
    li.appendChild(lb);

    ctrl = document.createElement("input");
    ctrl.type = "checkbox";
    ctrl.name = lb.htmlFor;
    ctrl.id = lb.htmlFor;
    ctrl.title = lb.title;
    ctrl.checked = lineCap.v(id).length < 1;
    ctrl.onclick = (e) => {
      const shape = document.getElementById(id);
      const v = lineCap.v(id);
      if (e.target.checked) {
        shape.dataset.lineCap = v.length > 0 ? v : "";
        shape.removeAttribute("stroke-linecap");
        document
          .getElementById(id + "-stroke-lc")
          .setAttribute("disabled", "true");
      } else {
        if (shape.dataset.lineCap && shape.dataset.lineCap.length > 0)
          shape.setAttribute("stroke-linecap", shape.dataset.lineCap);
        document.getElementById(id + "-stroke-lc").removeAttribute("disabled");
      }
    };
    li.appendChild(ctrl);

    attr.appendChild(li);
  },
};

const strokeLineJoin = {
  desc: "the shape to be used at the corners of paths when they are stroked",
  def: {
    v: () => document.getElementById("stroke-linejoin").value,
    f: (e) => {
      const fo = document.getElementById("stroke-linejoin");
      if (e.target.checked) {
        fo.setAttribute("disabled", "true");
      } else {
        fo.removeAttribute("disabled");
      }
    },
    l: () => {
      const div = document.createElement("div");
      let span = document.createElement("span");
      let lb = document.createElement("label");
      lb.htmlFor = "stroke-linejoin";
      lb.textContent = "Stroke line join";
      lb.title = strokeLineJoin.desc;
      let sel = document.createElement("select");
      let op = document.createElement("option");
      op.value = "miter";
      op.textContent = op.value;
      sel.appendChild(op);
      op = document.createElement("option");
      op.value = "arcs";
      op.textContent = op.value;
      sel.appendChild(op);
      op = document.createElement("option");
      op.value = "bevel";
      op.textContent = op.value;
      sel.appendChild(op);
      op = document.createElement("option");
      op.value = "miter-clip";
      op.textContent = op.value;
      sel.appendChild(op);
      op = document.createElement("option");
      op.value = "round";
      op.textContent = op.value;
      sel.appendChild(op);
      sel.name = lb.htmlFor;
      sel.id = lb.htmlFor;
      sel.title = lb.title;
      sel.disabled = true;
      lb.appendChild(sel);
      span.appendChild(lb);
      div.appendChild(span);

      span = document.createElement("span");
      lb = document.createElement("label");
      lb.htmlFor = "stroke-linejoin-vis";
      lb.textContent = "disable";
      lb.title = "Remove the stroke-linejoin attribute";

      ctrl = document.createElement("input");
      ctrl.type = "checkbox";
      ctrl.name = lb.htmlFor;
      ctrl.id = lb.htmlFor;
      ctrl.title = lb.title;
      ctrl.checked = true;
      ctrl.onclick = (e) => strokeLineJoin.def.f(e);
      lb.appendChild(ctrl);
      span.appendChild(lb);
      div.appendChild(span);
      return div;
    },
  },
  v: (id) => getAttrOrDef(id, "stroke-linejoin"),
  f: (id, e) =>
    document.getElementById(id).setAttribute("stroke-linejoin", e.target.value),
  l: (id, attr) => {
    let li = document.createElement("li");
    li.setAttribute("class", "attribute");

    let lb = document.createElement("label");
    lb.htmlFor = id + "-stroke-lj";
    lb.textContent = "line join";
    lb.title = strokeLineJoin.desc;
    li.appendChild(lb);

    let sel = document.createElement("select");
    const v = vectorEffect.v(id);
    let op = document.createElement("option");
    op.value = "";
    op.textContent = op.value;
    op.selected = v === op.value;
    sel.appendChild(op);
    op = document.createElement("option");
    op.value = "arcs";
    op.textContent = op.value;
    op.selected = v === op.value;
    sel.appendChild(op);
    op = document.createElement("option");
    op.value = "bevel";
    op.textContent = op.value;
    op.selected = v === op.value;
    sel.appendChild(op);
    op = document.createElement("option");
    op.value = "miter";
    op.textContent = op.value;
    op.selected = v === op.value;
    sel.appendChild(op);
    op = document.createElement("option");
    op.value = "miter-clip";
    op.textContent = op.value;
    op.selected = v === op.value;
    sel.appendChild(op);
    op = document.createElement("option");
    op.value = "round";
    op.textContent = op.value;
    op.selected = v === op.value;
    sel.appendChild(op);
    sel.name = lb.htmlFor;
    sel.id = lb.htmlFor;
    sel.title = lb.title;
    sel.oninput = (e) => strokeLineJoin.f(id, e);
    sel.disabled = v === "";
    li.appendChild(sel);

    lb = document.createElement("label");
    lb.htmlFor = id + "-stroke-lj-vis";
    lb.textContent = "disable";
    lb.title = "Remove the stroke-linejoin attribute";
    li.appendChild(lb);

    ctrl = document.createElement("input");
    ctrl.type = "checkbox";
    ctrl.name = lb.htmlFor;
    ctrl.id = lb.htmlFor;
    ctrl.title = lb.title;
    ctrl.checked = strokeLineJoin.v(id).length < 1;
    ctrl.onclick = (e) => {
      const shape = document.getElementById(id);
      const v = strokeLineJoin.v(id);
      if (e.target.checked) {
        shape.dataset.strokeLineJoin = v.length > 0 ? v : "";
        shape.removeAttribute("stroke-linejoin");
        document
          .getElementById(id + "-stroke-lj")
          .setAttribute("disabled", "true");
      } else {
        if (
          shape.dataset.strokeLineJoin &&
          shape.dataset.strokeLineJoin.length > 0
        )
          shape.setAttribute("stroke-linejoin", shape.dataset.strokeLineJoin);
        document.getElementById(id + "-stroke-lj").removeAttribute("disabled");
      }
    };
    li.appendChild(ctrl);

    attr.appendChild(li);
  },
};

const strokeMiterLimit = {
  desc: "a limit on the ratio of the miter length to the stroke-width used to draw a miter join",
  def: {
    v: () => document.getElementById("stroke-miterlimit").value,
    f: (e) => {
      const fo = document.getElementById("stroke-miterlimit");
      if (e.target.checked) {
        fo.setAttribute("disabled", "true");
      } else {
        fo.removeAttribute("disabled");
      }
    },
    l: () => {
      const div = document.createElement("div");
      let span = document.createElement("span");
      let lb = document.createElement("label");
      lb.htmlFor = "stroke-miterlimit";
      lb.textContent = "stroke miter limit";
      lb.title = strokeMiterLimit.desc;
      let ctrl = document.createElement("input");
      ctrl.type = "number";
      ctrl.name = lb.htmlFor;
      ctrl.id = lb.htmlFor;
      ctrl.title = lb.title;
      ctrl.disabled = true;
      ctrl.value = 4;
      lb.appendChild(ctrl);
      span.appendChild(lb);
      div.appendChild(span);

      span = document.createElement("span");
      lb = document.createElement("label");
      lb.htmlFor = "stroke-miterlimit-vis";
      lb.textContent = "disable";
      lb.title = "Remove the stroke-miterlimit attribute";

      ctrl = document.createElement("input");
      ctrl.type = "checkbox";
      ctrl.name = lb.htmlFor;
      ctrl.id = lb.htmlFor;
      ctrl.title = lb.title;
      ctrl.checked = true;
      ctrl.onclick = (e) => strokeMiterLimit.def.f(e);
      lb.appendChild(ctrl);
      span.appendChild(lb);
      div.appendChild(span);
      return div;
    },
  },
  v: (id) => getAttrOrDef(id, "stroke-miterlimit"),
  f: (id, e) =>
    document
      .getElementById(id)
      .setAttribute("stroke-miterlimit", e.target.value),
  l: (id, attr) => {
    let li = document.createElement("li");
    li.setAttribute("class", "attribute");

    let lb = document.createElement("label");
    lb.htmlFor = id + "-str-mit-lim";
    lb.textContent = "stroke miter limit";
    lb.title = strokeMiterLimit.desc;
    li.appendChild(lb);

    let ctrl = document.createElement("input");
    const v = strokeMiterLimit.v(id);
    ctrl.type = "number";
    ctrl.name = lb.htmlFor;
    ctrl.id = lb.htmlFor;
    ctrl.title = lb.title;
    ctrl.oninput = (e) => strokeMiterLimit.f(id, e);
    ctrl.disabled = v === "";
    ctrl.value = v;
    li.appendChild(ctrl);

    lb = document.createElement("label");
    lb.htmlFor = id + "-str-mit-lim-vis";
    lb.textContent = "disable";
    lb.title = "Remove the stroke-miterlimit attribute";
    li.appendChild(lb);

    ctrl = document.createElement("input");
    ctrl.type = "checkbox";
    ctrl.name = lb.htmlFor;
    ctrl.id = lb.htmlFor;
    ctrl.title = lb.title;
    ctrl.checked = strokeMiterLimit.v(id).length < 1;
    ctrl.onclick = (e) => {
      const shape = document.getElementById(id);
      const v = strokeMiterLimit.v(id);
      if (e.target.checked) {
        shape.dataset.strokeMiterLimit = v.length > 0 ? v : "";
        shape.removeAttribute("stroke-miterlimit");
        document
          .getElementById(id + "-str-mit-lim")
          .setAttribute("disabled", "true");
      } else {
        if (
          shape.dataset.strokeMiterLimit &&
          shape.dataset.strokeMiterLimit.length > 0
        )
          shape.setAttribute(
            "stroke-miterlimit",
            shape.dataset.strokeMiterLimit
          );
        document
          .getElementById(id + "-str-mit-lim")
          .removeAttribute("disabled");
      }
    };
    li.appendChild(ctrl);

    attr.appendChild(li);
  },
};

const stroke = {
  def: {
    v: () => document.getElementById("stroke").dataset.stroke,
    f: (val, stroke) => {
      switch (val) {
        case "none":
          stroke.dataset.stroke = "none";
          break;
        case "url": {
          const span = document.createElement("span");
          const ctrl = document.createElement("input");
          ctrl.title = stroke.children[0].title;
          ctrl.onchange = (e) => {
            document.getElementById("stroke").dataset.stroke = e.target.value;
          };
          span.appendChild(ctrl);
          stroke.insertBefore(
            span,
            stroke.children[stroke.children.length - 1]
          );
          stroke.dataset.stroke = "";
          break;
        }
        case "picker": {
          const span = document.createElement("span");
          span.style.display = "flex";
          span.style.flexDirection = "row";
          span.style.justifyContent = "space-around";
          span.style.alignItems = "center";
          const ctrl = document.createElement("input");
          ctrl.type = "color";
          ctrl.value = "#000000";
          ctrl.onchange = (e) => {
            e.target.nextSibling.style.backgroundColor = e.target.value;
            document.getElementById("stroke").dataset.stroke = e.target.value;
          };
          span.appendChild(ctrl);
          const div = document.createElement("div");
          div.style.width = "25px";
          div.style.height = "25px";
          div.style.backgroundColor = ctrl.value;
          span.appendChild(div);
          stroke.insertBefore(
            span,
            stroke.children[stroke.children.length - 1]
          );
          stroke.dataset.stroke = "#000000";
          break;
        }
        case "keyword": {
          const span = document.createElement("span");
          span.style.display = "flex";
          span.style.flexDirection = "row";
          span.style.justifyContent = "space-around";
          span.style.alignItems = "center";
          const sl = document.createElement("select");
          stroke.style.visibility = "hidden";
          document.body.style.cursor = "progress";
          Object.keys(namedColors).forEach((key) => {
            if (key === "transparent") return;
            const op = document.createElement("option");
            op.value = key;
            op.textContent = key;
            sl.appendChild(op);
          });
          stroke.style.visibility = "visible";
          document.body.style.cursor = "default";
          sl.value = "black";
          sl.onchange = (e) => {
            e.target.nextSibling.style.backgroundColor = e.target.value;
            document.getElementById("stroke").dataset.stroke = e.target.value;
          };
          span.appendChild(sl);
          const div = document.createElement("div");
          div.style.width = "25px";
          div.style.height = "25px";
          div.style.backgroundColor = sl.value;
          span.appendChild(div);
          stroke.insertBefore(
            span,
            stroke.children[stroke.children.length - 1]
          );
          stroke.dataset.stroke = sl.value;
          break;
        }
        case "wikipedia": {
          const span = document.createElement("span");
          span.style.display = "flex";
          span.style.flexDirection = "row";
          span.style.justifyContent = "space-around";
          span.style.alignItems = "center";
          const sl = document.createElement("select");
          stroke.style.visibility = "hidden";
          document.body.style.cursor = "progress";
          Object.keys(colors).forEach((key) => {
            const op = document.createElement("option");
            op.value = colors[key];
            op.textContent = key;
            sl.appendChild(op);
          });
          stroke.style.visibility = "visible";
          document.body.style.cursor = "default";
          sl.onchange = (e) => {
            e.target.nextSibling.style.backgroundColor = e.target.value;
            document.getElementById("stroke").dataset.stroke = e.target.value;
          };
          sl.value = "#000000";
          span.appendChild(sl);
          const div = document.createElement("div");
          div.style.width = "25px";
          div.style.height = "25px";
          div.style.backgroundColor = sl.value;
          span.appendChild(div);
          stroke.insertBefore(
            span,
            stroke.children[stroke.children.length - 1]
          );
          stroke.dataset.stroke = "#000000";
          break;
        }
        case "context": {
          const span = document.createElement("span");
          const sl = document.createElement("select");
          let op = document.createElement("option");
          op.value = "context-stroke";
          op.textContent = op.value;
          op.selected = true;
          op.title =
            "a reference to the paint layers generated for the stroke property, respectively, of the context element of the element being painted";
          sl.appendChild(op);
          op = document.createElement("option");
          op.value = "context-fill";
          op.textContent = op.value;
          op.title =
            "a reference to the paint layers generated for the fill property, respectively, of the context element of the element being painted";
          sl.appendChild(op);
          sl.onchange = (e) => {
            e.target.title = e.target.selectedOptions[0].title;
            document.getElementById("stroke").dataset.stroke = e.target.value;
          };
          span.appendChild(sl);
          stroke.insertBefore(
            span,
            stroke.children[stroke.children.length - 1]
          );
          stroke.dataset.stroke = "context-stroke";
          break;
        }
        default:
          break;
      }
    },
    l: () => {
      const div = document.createElement("div");
      div.style.display = "flex";
      div.style.flexDirection = "row";
      div.style.justifyContent = "space-around";
      div.style.alignContent = "center";
      div.id = "stroke";
      div.title = stroke.desc;
      let lb = document.createElement("label");
      lb.title = "select a stroke type";
      lb.htmlFor = "stroke-type";
      lb.textContent = "Stroke type";
      const sl = document.createElement("select");
      let op = document.createElement("option");
      op.value = "none";
      op.title = "set the stroke to none";
      op.textContent = op.value;
      sl.appendChild(op);
      op = document.createElement("option");
      op.value = "url";
      op.title =
        "A URL reference to a paint server element, which is an element that defines\n1. a paint server: 'linearGradient', 'pattern' and 'radialGradient'. e.g url(#my-gradient)\n2. a color function (hsl(), rgb(), ciexyz() color() etc)\n3. a color name (aquamarine, gold)";
      op.textContent = op.value;
      sl.appendChild(op);
      op = document.createElement("option");
      op.value = "keyword";
      op.title = "choose a html/css keyword";
      op.textContent = op.value;
      sl.appendChild(op);
      op = document.createElement("option");
      op.value = "picker";
      op.title = "use a color picker";
      op.textContent = op.value;
      op.selected = true;
      sl.appendChild(op);
      op = document.createElement("option");
      op.value = "wikipedia";
      op.title = "Choose from known names";
      op.textContent = op.value;
      sl.appendChild(op);
      op = document.createElement("option");
      op.value = "context";
      op.title = "Choose context-stroke or context-stroke";
      op.textContent = op.value;
      sl.appendChild(op);
      sl.id = lb.htmlFor;
      sl.name = lb.htmlFor;
      sl.title = sl.selectedOptions[0].title;
      sl.onchange = (e) => {
        e.target.title = e.target.selectedOptions[0].title;
        const fl = document.getElementById("stroke");
        if (fl.childElementCount === 3) fl.removeChild(fl.children[1]);
        stroke.def.f(e.target.value, fl);
      };
      div.dataset.stroke = sl.value;
      lb.appendChild(sl);
      div.appendChild(lb);
      lb = document.createElement("label");
      lb.title = "disable the stroke attribute";
      lb.htmlFor = "stroke-type-vis";
      lb.textContent = "disable";
      const ctrl = document.createElement("input");
      ctrl.id = lb.htmlFor;
      ctrl.name = lb.htmlFor;
      ctrl.type = "checkbox";
      ctrl.checked = sl.disabled;
      ctrl.onclick = (e) => {
        const stroke = document.getElementById("stroke");
        if (e.target.checked) {
          document
            .getElementById("stroke-type")
            .setAttribute("disabled", "true");
          if (stroke.children.length === 3) {
            stroke.children[1].style.visibility = "hidden";
            stroke.children[1].style.pointerEvents = "none";
          }
        } else {
          document.getElementById("stroke-type").removeAttribute("disabled");
          if (stroke.children.length === 3) {
            stroke.children[1].style.visibility = "visible";
            stroke.children[1].style.pointerEvents = "auto";
          }
        }
        /*set the stroke to data-value and vice-versa*/
      };
      lb.appendChild(ctrl);
      div.appendChild(lb);
      stroke.def.f(sl.value, div);

      return div;
    },
  },
  desc: "the color (or any SVG paint servers like gradients or patterns) used to paint the outline of the shape",
  anim: true,
  v: (id) => getAttrOrDef(id, "stroke"),
  f: (id, val, stroke) => {
    switch (val) {
      case "none":
        stroke.dataset.stroke = "none";
        break;
      case "url": {
        const span = document.createElement("span");
        const ctrl = document.createElement("input");
        ctrl.title = stroke.children[0].title;
        ctrl.onchange = (e) => {
          document.getElementById(id + "-stroke").dataset.stroke =
            e.target.value;
          document.getElementById(id).setAttribute("stroke", e.target.value);
        };
        span.appendChild(ctrl);
        stroke.insertBefore(span, stroke.children[stroke.children.length - 1]);
        stroke.dataset.stroke = "";
        break;
      }
      case "picker": {
        const span = document.createElement("span");
        span.style.display = "flex";
        span.style.flexDirection = "row";
        span.style.justifyContent = "space-around";
        span.style.alignItems = "center";
        const ctrl = document.createElement("input");
        ctrl.type = "color";
        ctrl.value = "#000000";
        ctrl.onchange = (e) => {
          e.target.nextSibling.style.backgroundColor = e.target.value;
          document.getElementById(id + "-stroke").dataset.stroke =
            e.target.value;
          document.getElementById(id).setAttribute("stroke", e.target.value);
        };
        span.appendChild(ctrl);
        const div = document.createElement("div");
        div.style.width = "25px";
        div.style.height = "25px";
        div.style.backgroundColor = ctrl.value;
        span.appendChild(div);
        stroke.insertBefore(span, stroke.children[stroke.children.length - 1]);
        stroke.dataset.stroke = "#000000";
        break;
      }
      case "keyword": {
        const span = document.createElement("span");
        span.style.display = "flex";
        span.style.flexDirection = "row";
        span.style.justifyContent = "space-around";
        span.style.alignItems = "center";
        const sl = document.createElement("select");
        stroke.style.visibility = "hidden";
        document.body.style.cursor = "progress";
        Object.keys(namedColors).forEach((key) => {
          if (key === "transparent") return;
          const op = document.createElement("option");
          op.value = key;
          op.textContent = key;
          sl.appendChild(op);
        });
        stroke.style.visibility = "visible";
        document.body.style.cursor = "default";
        sl.value = "black";
        sl.onchange = (e) => {
          e.target.nextSibling.style.backgroundColor = e.target.value;
          document.getElementById(id + "-stroke").dataset.stroke =
            e.target.value;
          document.getElementById(id).setAttribute("stroke", e.target.value);
        };
        span.appendChild(sl);
        const div = document.createElement("div");
        div.style.width = "25px";
        div.style.height = "25px";
        div.style.backgroundColor = sl.value;
        span.appendChild(div);
        stroke.insertBefore(span, stroke.children[stroke.children.length - 1]);
        stroke.dataset.stroke = sl.value;
        break;
      }
      case "wikipedia": {
        const span = document.createElement("span");
        span.style.display = "flex";
        span.style.flexDirection = "row";
        span.style.justifyContent = "space-around";
        span.style.alignItems = "center";
        const sl = document.createElement("select");
        stroke.style.visibility = "hidden";
        document.body.style.cursor = "progress";
        Object.keys(colors).forEach((key) => {
          const op = document.createElement("option");
          op.value = colors[key];
          op.textContent = key;
          sl.appendChild(op);
        });
        stroke.style.visibility = "visible";
        document.body.style.cursor = "default";
        sl.onchange = (e) => {
          e.target.nextSibling.style.backgroundColor = e.target.value;
          document.getElementById(id + "-stroke").dataset.stroke =
            e.target.value;
          document.getElementById(id).setAttribute("stroke", e.target.value);
        };
        sl.value = "#000000";
        span.appendChild(sl);
        const div = document.createElement("div");
        div.style.width = "25px";
        div.style.height = "25px";
        div.style.backgroundColor = sl.value;
        span.appendChild(div);
        stroke.insertBefore(span, stroke.children[stroke.children.length - 1]);
        stroke.dataset.stroke = "#000000";
        break;
      }
      case "context": {
        const span = document.createElement("span");
        const sl = document.createElement("select");
        let op = document.createElement("option");
        op.value = "context-stroke";
        op.textContent = op.value;
        op.selected = true;
        op.title =
          "a reference to the paint layers generated for the stroke property, respectively, of the context element of the element being painted";
        sl.appendChild(op);
        op = document.createElement("option");
        op.value = "context-fill";
        op.textContent = op.value;
        op.title =
          "a reference to the paint layers generated for the fill property, respectively, of the context element of the element being painted";
        sl.appendChild(op);
        sl.onchange = (e) => {
          e.target.title = e.target.selectedOptions[0].title;
          document.getElementById(id + "-stroke").dataset.stroke =
            e.target.value;
          document.getElementById(id).setAttribute("stroke", e.target.value);
        };
        span.appendChild(sl);
        stroke.insertBefore(span, stroke.children[stroke.children.length - 1]);
        stroke.dataset.stroke = "context-stroke";
        break;
      }
      default:
        break;
    }
  },
  l: (id, attr) => {
    attr ??= document.querySelector("li.attributes .attr");

    //stroke
    let li = document.createElement("li");
    li.setAttribute("class", "attribute");

    const div = document.createElement("div");
    div.style.display = "flex";
    div.style.flexDirection = "row";
    div.style.justifyContent = "space-around";
    div.style.alignContent = "center";
    div.id = id + "-stroke";
    div.title = fill.desc;
    let span = document.createElement("span");
    let lb = document.createElement("label");
    lb.title = "select a stroke type";
    lb.htmlFor = id + "-stroke-type";
    lb.textContent = "Stroke type";
    span.appendChild(lb);
    const sl = document.createElement("select");
    let v = stroke.v(id);
    let op = document.createElement("option");
    op.value = "none";
    op.title = "set the stroke to none";
    op.textContent = op.value;
    op.selected = v === "none" || v === "";
    sl.appendChild(op);
    op = document.createElement("option");
    op.value = "url";
    op.title =
      "A URL reference to a paint server element, which is an element that defines\n1. a paint server: 'linearGradient', 'pattern' and 'radialGradient'. e.g url(#my-gradient)\n2. a color function (hsl(), rgb(), ciexyz() color() etc)\n3. a color name (aquamarine, gold)";
    op.textContent = op.value;
    op.selected = v.startsWith("url");
    sl.appendChild(op);
    op = document.createElement("option");
    op.value = "keyword";
    op.title = "choose a html/css keyword";
    op.textContent = op.value;
    op.selected = !v.startsWith("none") && /^[a-z][a-z]+[a-z]$/.test(v);
    sl.appendChild(op);
    op = document.createElement("option");
    op.value = "picker";
    op.title = "use a color picker";
    op.textContent = op.value;
    op.selected = v.startsWith("#");
    sl.appendChild(op);
    op = document.createElement("option");
    op.value = "wikipedia";
    op.title = "Choose from known names";
    op.textContent = op.value;
    sl.appendChild(op);
    op = document.createElement("option");
    op.value = "context";
    op.title = "Choose context-stroke or context-stroke";
    op.textContent = op.value;
    op.selected = v.startsWith("context");
    sl.appendChild(op);
    sl.id = lb.htmlFor;
    sl.name = lb.htmlFor;
    sl.disabled = v === "";
    sl.title = sl.selectedOptions[0].title;
    sl.onchange = (e) => {
      e.target.title = e.target.selectedOptions[0].title;
      const sk = document.getElementById(id + "-stroke");
      if (sk.childElementCount === 3) sk.removeChild(sk.children[1]);
      stroke.f(id, e.target.value, sk);
      document.getElementById(id).setAttribute("stroke", sk.dataset.stroke);
      //set the shape's stroke to the default
    };
    div.dataset.stroke = sl.value;
    span.appendChild(sl);
    div.appendChild(span);
    span = document.createElement("span");
    lb = document.createElement("label");
    lb.title = "disable the stroke attribute";
    lb.htmlFor = id + "-stroke-type-vis";
    lb.textContent = "disable";
    span.appendChild(lb);
    const ctrl = document.createElement("input");
    ctrl.id = lb.htmlFor;
    ctrl.name = lb.htmlFor;
    ctrl.type = "checkbox";
    ctrl.checked = sl.disabled;
    ctrl.onclick = (e) => {
      const stroke = document.getElementById(id + "-stroke");
      if (e.target.checked) {
        document
          .getElementById(id + "-stroke-type")
          .setAttribute("disabled", "true");
        if (stroke.children.length === 3) {
          stroke.children[1].style.visibility = "hidden";
          stroke.children[1].style.pointerEvents = "none";
        }
        document.getElementById(id).removeAttribute("stroke");
      } else {
        document
          .getElementById(id + "-stroke-type")
          .removeAttribute("disabled");
        if (stroke.children.length === 3) {
          stroke.children[1].style.visibility = "visible";
          stroke.children[1].style.pointerEvents = "auto";
        }
        document
          .getElementById(id)
          .setAttribute("stroke", stroke.dataset.stroke);
      }
      /*set the stroke to data-value and vice-versa*/
    };
    span.appendChild(ctrl);
    div.appendChild(span);
    li.appendChild(div);
    attr.appendChild(li);
    stroke.f(id, sl.value, div);
  },
};

const strokeOpacity = {
  desc: "the opacity of the paint server (color, gradient, pattern, etc.) applied to the stroke of a shape",
  def: {
    v: () => document.getElementById("stroke-opacity").valueAsNumber / 100,
    f: (e) => {
      const fo = document.getElementById("stroke-opacity");
      if (e.target.checked) {
        fo.setAttribute("disabled", "true");
      } else {
        fo.removeAttribute("disabled");
      }
    },
    l: () => {
      const div = document.createElement("div");
      let span = document.createElement("span");
      let lb = document.createElement("label");
      lb.title = strokeOpacity.desc;
      lb.htmlFor = "stroke-opacity";
      lb.textContent = "stroke opacity";
      let ctrl = document.createElement("input");
      ctrl.type = "range";
      ctrl.min = "0";
      ctrl.max = "100";
      ctrl.step = "1";
      ctrl.name = lb.htmlFor;
      ctrl.id = lb.htmlFor;
      ctrl.title = lb.title;
      ctrl.value = ctrl.max;
      ctrl.disabled = true;
      lb.appendChild(ctrl);
      span.appendChild(lb);
      div.appendChild(span);

      span = document.createElement("span");
      lb = document.createElement("label");
      lb.htmlFor = "stroke-opacity-vis";
      lb.textContent = "disable";
      lb.title = "Remove the stroke-opacity attribute";

      ctrl = document.createElement("input");
      ctrl.type = "checkbox";
      ctrl.name = lb.htmlFor;
      ctrl.id = lb.htmlFor;
      ctrl.title = lb.title;
      ctrl.checked = true;
      ctrl.onclick = (e) => strokeOpacity.def.f(e);
      lb.appendChild(ctrl);
      span.appendChild(lb);
      div.appendChild(span);
      return div;
    },
  },
  v: (id) => getAttrOrDef(id, "stroke-opacity"),
  f: (id, e) =>
    document
      .getElementById(id)
      .setAttribute("stroke-opacity", e.target.valueAsNumber / 100),
  l: (id, attr) => {
    let li = document.createElement("li");
    li.setAttribute("class", "attribute");

    let lb = document.createElement("label");
    lb.htmlFor = id + "-so";
    lb.textContent = "stroke opacity";
    lb.title = strokeOpacity.desc;
    li.appendChild(lb);

    let ctrl = document.createElement("input");
    const v = strokeOpacity.v(id);
    ctrl.type = "range";
    ctrl.min = 0;
    ctrl.max = 100;
    ctrl.step = 1;
    ctrl.name = lb.htmlFor;
    ctrl.id = lb.htmlFor;
    ctrl.title = lb.title;
    ctrl.oninput = (e) => strokeOpacity.f(id, e);
    ctrl.disabled = v === "";
    ctrl.value = v !== "" ? Number(v) * 100 : "100";
    li.appendChild(ctrl);

    lb = document.createElement("label");
    lb.htmlFor = id + "-so-vis";
    lb.textContent = "disable";
    lb.title = "Remove the stroke-opacity attribute";
    li.appendChild(lb);

    ctrl = document.createElement("input");
    ctrl.type = "checkbox";
    ctrl.name = lb.htmlFor;
    ctrl.id = lb.htmlFor;
    ctrl.title = lb.title;
    ctrl.checked = strokeOpacity.v(id).length < 1;
    ctrl.onclick = (e) => {
      const shape = document.getElementById(id);
      const v = strokeOpacity.v(id);
      if (e.target.checked) {
        shape.dataset.strokeOpacity = v.length > 0 ? v : "";
        shape.removeAttribute("stroke-opacity");
        document.getElementById(id + "-so").setAttribute("disabled", "true");
      } else {
        if (
          shape.dataset.strokeOpacity &&
          shape.dataset.strokeOpacity.length > 0
        )
          shape.setAttribute("stroke-opacity", shape.dataset.strokeOpacity);
        document.getElementById(id + "-so").removeAttribute("disabled");
      }
    };
    li.appendChild(ctrl);

    attr.appendChild(li);
  },
};

const strokeDashArray = {
  createArray: (id, attr) => {
    const shape = document.getElementById(id);
    const vals = (shape.getAttribute("stroke-dasharray") ?? "")
      .split(" ")
      .filter((x) => x && x.length > 0); //number of dashes
    const ci = vals.length; //current index;
    const na = document.getElementById(id + "-new-array");

    attr ??= document.querySelector("li.attributes .attr");

    //stroke array
    let li = document.createElement("li");
    li.setAttribute("class", "attribute");

    let lb = document.createElement("label");
    lb.title = "segment No. " + (ci + 1) + " of the shape outline";
    lb.htmlFor = id + "-sda-" + ci;
    lb.textContent = "dash array " + ci;
    li.appendChild(lb);

    let inp = document.createElement("input");
    inp.name = lb.htmlFor;
    inp.id = lb.htmlFor;
    inp.title = lb.title;
    inp.type = "number";
    inp.value = vals[ci] ?? "";
    inp.onchange = (e) => {
      const vals = (shape.getAttribute("stroke-dasharray") ?? "")
        .split(" ")
        .filter((x) => x && x.length > 0);
      vals[ci] = e.target.value;
      document
        .getElementById(id)
        .setAttribute("stroke-dasharray", vals.join(" "));
      if (NUM_MATCH.test(e.target.value))
        document.getElementById(id + "-new-array").removeAttribute("disabled");
      else
        document
          .getElementById(id + "-new-array")
          .setAttribute("disabled", "true");
    };
    li.appendChild(inp);
    if (na) na.remove();
    let btn = document.createElement("button");
    btn.textContent = "...";
    btn.title = "Append a new dash to the shape outline";
    btn.id = id + "-new-array";
    btn.onclick = () => strokeDashArray.createArray(id);
    btn.disabled = inp.value.length <= 0;
    li.appendChild(btn);
    attr.appendChild(li);
  },
  l: (id, attr) => {
    //dash array
    (document.getElementById(id).getAttribute("stroke-dasharray") ?? "")
      .split(" ")
      .forEach((x) => strokeDashArray.createArray(id));
  },
};

const misce = {
  anim: false,
  f: (id) => {},
  l: (id) => {
    const attr = document.querySelector("li.attributes .attr");
    const shape = document.getElementById(id);
  },
};

const cl = {
  type: ["s"],
  desc: "The value for the class attribute",
  anim: false,
};

const id = {
  type: ["s"],
  desc: "The value or the id attribute",
  anim: false,
};

const style = {
  type: ["o"],
  desc: "Object of key/value pairs representing the styles to apply",
  anim: false,
};

const circle = {
  md: (e) => {
    const cv = document.querySelector("#canvas");
    const rect = cv.getBoundingClientRect();
    cxt.pt = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    cxt.cl = { x: e.clientX, y: e.clientY };
    cxt.id = [`${cxt.pt.x}-${cxt.pt.y}-${st++}`];

    const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    c.setAttribute("stroke-width", "1");
    Object.keys(cxt.attributes).forEach((key) => {
      if (cxt.attributes[key]) c.setAttribute(key, cxt.attributes[key]);
    });
    c.setAttribute("cx", cxt.pt.x + "");
    c.setAttribute("cy", cxt.pt.y + "");
    c.setAttribute("id", cxt.id[0]);
    //ds is 'drawn shape'
    c.classList.add("ds");
    //guide line for the circle (radius)
    const ln = document.createElementNS("http://www.w3.org/2000/svg", "line");
    ln.setAttribute("stroke-width", "1");
    ln.setAttribute("stroke-dasharray", "2");
    ln.setAttribute("stroke", "#000000ff");
    ln.setAttribute("fill", "none");
    ln.setAttribute("x1", cxt.pt.x + "");
    ln.setAttribute("y1", cxt.pt.y + "");
    ln.setAttribute("x2", cxt.pt.x + "");
    ln.setAttribute("y2", cxt.pt.y + "");
    ln.setAttribute("id", cxt.id[0] + "-guide");

    cv.querySelector("#objects").appendChild(c);
    cv.querySelector("#objects").appendChild(ln);
  },
  mm: (e) => {
    /**@type {HTMLDivElement} a `div` that displays the radius of the circle */
    const sta = document.querySelector(".state");
    /**@type {DOMRect} the bounding box of the canvas (drawing area) */
    const rect = document.querySelector("#canvas").getBoundingClientRect();
    const cir = document.getElementById(cxt.id[0]);
    const gl = document.getElementById(cxt.id[0] + "-guide"); //for the guide line
    let b = -1,
      c = -1,
      a = -1;
    /*Using pythagoras a^2 = b^2 + c^2*/
    b =
      Math.max(e.clientX - rect.left, cxt.pt.x) -
      Math.min(e.clientX - rect.left, cxt.pt.x);
    c =
      Math.max(e.clientY - rect.top, cxt.pt.y) -
      Math.min(e.clientY - rect.top, cxt.pt.y);
    a = Math.sqrt(b * b + c * c);
    cir.setAttribute("r", a);
    gl.setAttribute("x2", e.clientX - rect.left);
    gl.setAttribute("y2", e.clientY - rect.top);
    sta.textContent = `r = ${a}px, cx = ${cxt.pt.x}, cy = ${cxt.pt.y}`;
  },
  mu: (e) => {
    if (e.button === 0) {
      const id = cxt.id[0];
      /**@type {SVGCircleElement} */
      const c = id ? document.getElementById(id) : null;
      if (c) {
        c.onclick = circle.cl;
        /*
         * This is where we should add all listeners such as:
         * Click listerners that select the circle, i.e put a selection box around the circle and populate the attributes sections
         * Drag listeners that enable resizing of the circle within designations on the bounding box
         */
        const r = c.getAttribute("r");
        if (!r || Number(r) <= 0 || Number.isNaN(Number(r))) {
          c.remove();
        }
        document.getElementById(cxt.id[0] + "-guide").remove();
        cxt.cl = null;
        cxt.pt = null;
      }
    }
  },
  /**@param {MouseEvent} e @param {string} id */
  mv: (e, id) => {
    /**@type {SVGCircleElement} */
    const cir = document.getElementById(id);
    const rect = document.getElementById("canvas").getBoundingClientRect();
    const dot = document.getElementById("rcs");
    // const start = dot.dataset.m
    //   .split("|")
    //   .reduce((p, c, i, a) => ({ x: Number(a[0]), y: Number(a[1]) }));
    // const cirStart = dot.dataset.c
    //   .split("|")
    //   .reduce((p, c, i, a) => ({ x: Number(a[0]), y: Number(a[1]) }));
    const m = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    const clone = cir.getCTM().isIdentity ? cir.getCTM() : DOMMatrix.fromMatrix(cir.getCTM()).inverse();
    const {x, y} = DOMPoint.fromPoint(m).matrixTransform(clone);
    // const [dx, dy] = [m.x - start.x, m.y - start.y];
    // cir.setAttribute("cx", cirStart.x + dx);
    // cir.setAttribute("cy", cirStart.y + dy);
    cir.setAttribute("cx", x);
    cir.setAttribute("cy", y);
    dot.setAttribute("cx", m.x);
    dot.setAttribute("cy", m.y);
  },
  /**@param {MouseEvent} [e] @param {string} id */
  cl: (e, id) => {
    /**@type {SVGCircleElement} */
    const c = e ? e.target : document.getElementById(id);
    /**@type {HTMLUListElement} */
    const attr = document.querySelector("li.attributes .attr");
    while (attr.firstChild) attr.removeChild(attr.lastChild);
    const pattr = attr.parentElement.querySelector("h4");
    pattr.textContent = "Circle Attributes";
    pattr.title = circle.desc;
    /**@type {SVGCircleElement} */
    const crct = document.querySelector("g#selection-shapes > #rcs");
    const rct = document.querySelector("g#selection-shapes > #rect-sel");

    circle.ssg(c.id);
    crct.onmousedown = (e) => {
      /**@type {SVGCircleElement} */
      const target = e.target;
      target.setAttribute("r", c.r.baseVal.valueAsString);
      // target.dataset.o = target.
      target.style.opacity = '0';
      const canvas = document.getElementById("canvas").getBoundingClientRect();
      target.dataset.m =
        e.clientX - canvas.left + "|" + (e.clientY - canvas.top);
      c.dataset.c = c.cx.baseVal.value + "|" + c.cy.baseVal.value;
      rct.style.display = "none";
      e.preventDefault();
      e.stopPropagation();
    };
    crct.onmousemove = (e) => {
      if (e.target.dataset.m && e.target.dataset.m.length > 0) {
        circle.mv(e, c.id);
      }
    };
    crct.onmouseup = (e) => {
      rct.style.display = "";
      e.target.style.opacity = "";
      delete e.target.dataset.m;
      delete c.dataset.c;
      circle.ssg(c.id);
      e.preventDefault();
      e.stopPropagation();
    };
    crct.onmouseleave = (e) => {
      rct.style.display = "";
      e.target.style.opacity = "";
      delete e.target.dataset.m;
      delete c.dataset.c;
      circle.ssg(c.id);
    };

    circle.cx.l(c.id, attr);
    circle.cy.l(c.id, attr);
    circle.r.l(c.id, attr);

    transform.l(c.id, attr);
    fill.l(c.id, attr);
    fillOpacity.l(c.id, attr);
    fillRule.l(c.id, attr);
    stroke.l(c.id, attr);
    strokeOpacity.l(c.id, attr);
    strokeWidth.l(c.id, attr);
    strokeDashOffset.l(c.id, attr);
    strokeMiterLimit.l(c.id, attr);
    lineCap.l(c.id, attr);
    strokeLineJoin.l(c.id, attr);
    shapeRendering.l(c.id, attr);
    vectorEffect.l(c.id, attr);
    strokeDashArray.l(c.id, attr);
  },
  bb: (id) => {
    /**@type {SVGCircleElement} */
    const c = document.getElementById(id);
    const [cx, cy, cr] = [
      c.cx.baseVal.value,
      c.cy.baseVal.value,
      c.r.baseVal.value
    ];
    // let ccc = Geometrize.Circle({x: cx, y: cy}, cr);
    // const g = asGeomzMat2D(c.getCTM());
    // console.log(c.getCTM());
    // console.log(g);
    // ccc = ccc.transform(g);
    // let bb = ccc.getBoundingBox();
    // bb = {
    //   x: bb.xmin, y: bb.ymin,
    //   width: Math.abs(bb.xmax - bb.xmin),
    //   height: Math.abs(bb.ymax - bb.ymin),
    // }
    // return DOMRect.fromRect(bb);
    return crBB(
      DOMRect.fromRect({
        x: cx - cr,
        y: cy - cr,
        width: cr * 2,
        height: cr * 2
      }),
      c.getCTM()
    );
    // return cBB(document.getElementById(id));
  },
  /**@summary Show selection graphic @param {string} id */
  ssg: (id) => {
    /**@type {SVGCircleElement} */
    const c = document.getElementById(id);
    const [cx, cy, cr] = [
      c.cx.baseVal.value,
      c.cy.baseVal.value,
      c.r.baseVal.value
    ];
    const bb = circle.bb(id)
    // console.log(JSON.stringify(bb));
    const br = document.querySelector("g#selection-shapes > #rect-sel"); //boundingRect
    const cd = document.querySelector("g#selection-shapes > #rcs"); //centreDot
    const cdp = DOMPoint.fromPoint({ x: cx, y: cy }).matrixTransform(
      c.getCTM()
    ); //centreDotPoint
    br.setAttribute("stroke", "red");
    br.setAttribute("fill", "none");
    br.setAttribute("stroke-width", "1");
    br.setAttribute("stroke-dasharray", "6");
    /**
     * Deduce the x,y cordinates of the selection rectangle by:
     * 1. Subtracting the tranformed center point of the original rectangle from width and height of
     *    the transformed rectangle.
     */
    br.setAttribute(
      "x",bb.x
    );
    br.setAttribute(
      "y",bb.y
    );
    br.setAttribute(
      "width",bb.width
    );
    br.setAttribute(
      "height",bb.height
    );
    cd.setAttribute("stroke", "none");
    cd.setAttribute("fill", br.getAttribute("stroke"));
    cd.setAttribute("cx", cdp.x);
    cd.setAttribute("cy", cdp.y);

    // const wk = new Worker("recalc-rad.js", {credentials: "same-origin"});
    // wk.postMessage(bb);
    // wk.onmessage = e => {
    //   cd.setAttribute("r",  e.data);
    // }

    cd.setAttribute("r", Math.max(bb.width, bb.height) * 0.0125);
  },
  /**@summary **r**emove**u**ser**i**nterface */
  rui: () => {
    let gl = document.querySelector("g#selection-shapes > #rect-sel");
    gl.setAttribute("x", -9999);
    gl.setAttribute("y", -9999);
    gl.setAttribute("width", 0);
    gl.setAttribute("height", 0);
    gl.removeAttribute("transform");
    gl = document.querySelector("g#selection-shapes > #rcs");
    gl.setAttribute("cx", -9999);
    gl.setAttribute("cy", -9999);
    gl.setAttribute("r", 0);
    gl.removeAttribute("transform");
    gl.onmousedown = undefined;
    gl.onmousemove = undefined;
    gl.onmouseup = undefined;
    gl.onmouseleave = undefined;
    delete gl.dataset.m;
  },
  desc: "A circle, based on a center point and a radius",
  cx: {
    type: ["n", "s"],
    desc: "The x-axis coordinate of the center of the circle.\nIf the attribute is not specified, the effect is as if a value of '0' were specified.\nAnimatable: yes.",
    anim: true,
    f: function (id, e) {
      const cx = Number(document.getElementById(`${id}-cx`).value);
      if (!Number.isNaN(cx) && Number.isFinite(cx)) {
        document.getElementById(id).setAttribute("cx", cx);

        circle.ssg(id);
      }
    },
    l: function (id, attr) {
      attr ??= document.querySelector("li.attributes .attr");

      const li = document.createElement("li");
      li.setAttribute("class", "attribute");
      li.title = circle.cx.desc;

      const lb = document.createElement("label");
      lb.setAttribute("for", id + "-cx");
      lb.textContent = "cx";
      lb.title = li.title;
      li.appendChild(lb);

      const ip = document.createElement("input");
      ip.setAttribute("type", "number");
      ip.setAttribute("name", id + "-cx");
      ip.setAttribute("id", id + "-cx");
      ip.value = document.getElementById(id).getAttribute("cx");
      ip.title = li.title;
      // ip.onchange = () => circle.cx.f(id);
      ip.oninput = (e) => circle.cx.f(id, e);
      li.appendChild(ip);
      attr.appendChild(li);
    },
  },
  cy: {
    type: ["n", "s"],
    desc: "The y-axis coordinate of the center of the circle.\nIf the attribute is not specified, the effect is as if a value of '0' were specified.\nAnimatable: yes.",
    anim: true,
    f: function (id, e) {
      const cy = Number(document.getElementById(`${id}-cy`).value);
      if (!Number.isNaN(cy) && Number.isFinite(cy)) {
        document.getElementById(id).setAttribute("cy", cy);

        circle.ssg(id);
      }
    },
    l: function (id, attr) {
      attr ??= document.querySelector("li.attributes .attr");

      const li = document.createElement("li");
      li.setAttribute("class", "attribute");
      li.title = circle.cy.desc;

      const lb = document.createElement("label");
      lb.setAttribute("for", id + "-cy");
      lb.textContent = "cy";
      lb.title = li.title;
      li.appendChild(lb);

      const ip = document.createElement("input");
      ip.setAttribute("type", "number");
      ip.setAttribute("name", id + "-cy");
      ip.setAttribute("id", id + "-cy");
      ip.value = document.getElementById(id).getAttribute("cy");
      ip.title = li.title;
      // ip.onchange = () => circle.cy.f(id);
      ip.oninput = () => circle.cy.f(id);
      li.appendChild(ip);
      attr.appendChild(li);
    },
  },
  r: {
    type: ["n", "s"],
    desc: "The radius of the circle.\nA negative value is an error. A value of zero disables rendering of the element.\nAnimatable: yes.",
    anim: true,
    f: function (id, e) {
      // const shape = document.getElementById(id);
      const r = Number(document.getElementById(`${id}-r`).value);
      if (!Number.isNaN(r) && Number.isFinite(r)) {
        document.getElementById(id).setAttribute("r", r);

        circle.ssg(id);
      }
    },
    l: function (id, attr) {
      attr ??= document.querySelector("li.attributes .attr");

      const li = document.createElement("li");
      li.setAttribute("class", "attribute");
      li.title = circle.r.desc;

      const lb = document.createElement("label");
      lb.setAttribute("for", id + "-r");
      lb.textContent = "r";
      lb.title = li.title;
      li.appendChild(lb);

      const ip = document.createElement("input");
      ip.setAttribute("type", "number");
      ip.setAttribute("name", id + "-r");
      ip.setAttribute("id", id + "-r");
      ip.value = document.getElementById(id).getAttribute("r");
      ip.title = li.title;
      ip.oninput = () => circle.r.f(id);
      li.appendChild(ip);
      attr.appendChild(li);
    },
  },
};

const line = {
  desc: "a line segment that starts at one point and ends at another.",
  x1: {
    type: ["n", "s"],
    desc: "The x-axis coordinate of the start of the line",
    anim: true,
  },
  y1: {
    type: ["n", "s"],
    desc: "The y-axis coordinate of the start of the line",
    anim: true,
  },
  x2: {
    type: ["n", "s"],
    desc: "The x-axis coordinate of the end of the line",
    anim: true,
  },
  y2: {
    type: ["n", "s"],
    desc: "The y-axis coordinate of the end of the line",
    anim: true,
  },
  transform,
  class: cl,
  id,
  style,
};

const ellipse = {
  desc: "An ellipse which is axis-aligned with the current user coordinate system based on a center point and two radii",
  cx: {
    type: ["n", "s"],
    desc: "The x-axis coordinate of the center of the ellipse",
    anim: true,
  },
  cy: {
    type: ["n", "s"],
    desc: "The y-axis coordinate of the center of the ellipse",
    anim: true,
  },
  rx: {
    type: ["n", "s"],
    desc: "The x-axis radius of the ellipse",
    anim: true,
  },
  ry: {
    type: ["n", "s"],
    desc: "The y-axis radius of the ellipse",
    anim: true,
  },
  transform,
  class: cl,
  id,
  style,
};

const rect = {
  desc: "A rectangle which is axis-aligned with the current user coordinate system. Rounded rectangles can be achieved by setting appropriate values for attributes ‘rx’ and ‘ry’",
  x: {
    type: ["n", "s"],
    desc: "The x-axis coordinate of the start of the line",
    anim: true,
  },
  y: {
    type: ["n", "s"],
    desc: "The y-axis coordinate of the start of the line",
    anim: true,
  },
  width: {
    type: ["n", "s"],
    desc: "The width of the rectangle.\nA negative value is an error.\nA value of zero disables rendering of the element",
    anim: true,
  },
  height: {
    type: ["n", "s"],
    desc: "The height of the rectangle.\nA negative value is an error.\nA value of zero disables rendering of the element",
    anim: true,
  },
  rx: {
    type: ["n", "s"],
    desc: "For rounded rectangles, the x-axis radius of the ellipse used to round off the corners of the rectangle.\nA negative value is an error.\nSee the notes below about what happens if the attribute is not specified",
    anim: true,
  },
  ry: {
    type: ["n", "s"],
    desc: "For rounded rectangles, the y-axis radius of the ellipse used to round off the corners of the rectangle.\nA negative value is an error.\nSee the notes below about what happens if the attribute is not specified",
    anim: true,
  },
  transform,
  class: cl,
  id,
  style,
};

const polyline = {
  desc: "Defines a set of connected straight line segments. Typically, ‘polyline’ elements define open shapes",
  points: {
    type: ["list"],
    anim: true,
    desc: "The points that make up the polyline. All coordinate values are in the user coordinate system",
  },
  transform,
  class: cl,
  id,
  style,
};

const polygon = {
  ...polyline,
  desc: "Defines a closed shape consisting of a set of connected straight line segments",
};

const text = {
  desc: "Defines a graphics element consisting of text",
  x: {
    type: ["list"],
    desc: "If a single <coordinate> is provided, then the value represents the new absolute X coordinate for the current text position for rendering the glyphs that correspond to the first character within this element or any of its descendants.\nIf a comma- or space-separated list of n <coordinate>s is provided, then the values represent new absolute X coordinates for the current text position for rendering the glyphs corresponding to each of the first n characters within this element or any of its descendants",
    anim: true,
  },
  y: {
    type: ["list"],
    desc: "The corresponding list of absolute Y coordinates for the glyphs corresponding to the characters within this element. The processing rules for the ‘y’ attribute parallel the processing rules for the ‘x’ attribute",
    anim: true,
  },
  dx: {
    type: ["list"],
    desc: "Shifts in the current text position along the x-axis for the characters within this element or any of its descendants",
    anim: true,
  },
  dy: {
    type: ["list"],
    desc: "Shifts in the current text position along the y-axis for the characters within this element or any of its descendants",
    anim: true,
  },
  rotate: {
    type: ["list"],
    desc: "The supplemental rotation about the current text position that will be applied to all of the glyphs corresponding to each character within this element",
    anim: true,
  },
  textLength: {
    type: ["n", "s"],
    desc: "The author's computation of the total sum of all of the advance values that correspond to character data within this element, including the advance value on the glyph (horizontal or vertical), the effect of properties ‘kerning’, ‘letter-spacing’ and ‘word-spacing’ and adjustments due to attributes ‘dx’ and ‘dy’ on ‘tspan’ elements. This value is used to calibrate the user agent's own calculations with that of the author",
    anim: true,
  },
  lengthAdjust: {
    type: ["n", "s"],
    desc: "Indicates the type of adjustments which the user agent shall make to make the rendered length of the text match the value specified on the ‘textLength’ attribute.\n'spacing' indicates that only the advance values are adjusted. The glyphs themselves are not stretched or compressed.\n'spacingAndGlyphs' indicates that the advance values are adjusted and the glyphs themselves stretched or compressed in one axis (i.e., a direction parallel to the inline-progression-direction)",
    anim: true,
  },
  transform,
  class: cl,
  id,
  style,
};

const textPath = {
  desc: "To specify that a block of text is to be rendered along the shape of a ‘path’",
  startOffset: {
    type: ["n", "s"],
    desc: "An offset from the start of the ‘path’ for the initial current text position, calculated using the user agent's distance along the path algorithm.",
  },
  method: {
    type: ["s"],
    desc: "Indicates the method by which text should be rendered along the path.",
  },
  spacing: {
    type: ["s"],
    desc: "Indicates the method by which text should be rendered along the path.",
  },
  "xlink:href": {
    type: ["s"],
    desc: "the id of the shape (SVG object) that may be used for specifying the line on which the text may stand",
  },
};

const path = {
  desc: "Paths represent the outline of a shape which can be filled, stroked, used as a clipping path, or any combination of the three",
  d: {
    desc: "The definition of the outline of a shape",
    anim: false,
    type: ["s"],
  },
  pathLength: {
    desc: "The author's computation of the total length of the path, in user units",
    anim: true,
    type: ["n", "s"],
  },
};

const neutral = {
  md: (e) => {
    const rect = document.querySelector("#canvas").getBoundingClientRect();
    cxt.pt = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    cxt.cl = { x: e.clientX, y: e.clientY };
    if (cxt.id.length === 1) {
      primitives[document.getElementById(cxt.id[0]).tagName].rui();
    } else {
      let gl = document.querySelector("g#selection-shapes > #rect-sel");
      gl.setAttribute("stroke", "red");
      gl.setAttribute("fill", "none");
      gl.setAttribute("stroke-width", "1");
      gl.setAttribute("stroke-dasharray", "6");
      gl.setAttribute("x", -9999);
      gl.setAttribute("y", -9999);
      gl.setAttribute("width", 0);
      gl.setAttribute("height", 0);
      gl.removeAttribute("transform");
      gl = document.querySelector("g#selection-shapes > #rcs");
      gl.setAttribute("cx", -9999);
      gl.setAttribute("cy", -9999);
      gl.setAttribute("r", 0);
      gl.setAttribute("stroke", "red");
      gl.removeAttribute("transform");
      gl.onmousedown = undefined;
      gl.onmousemove = undefined;
      gl.onmouseup = undefined;
      gl.onmouseleave = undefined;
      delete gl.dataset.m;
    }

    /**@type {HTMLUListElement} */
    const attr = document.querySelector("li.attributes .attr");
    while (attr.firstChild) attr.removeChild(attr.lastChild);
  },
  mm: (e) => {
    const rect = document.querySelector("#canvas").getBoundingClientRect();
    const sta = document.querySelector(".state");
    // Draw selection box by giving it dimensions such as a width and height
    /**@type {SVGRectElement} */
    const rct = document.querySelector("g#selection-shapes > #rect-sel");
    let b, c;
    /**Using pythagoras a^2 = b^2 + c^2 and trigonometry*/
    b =
      Math.max(e.clientX - rect.left, cxt.pt.x) -
      Math.min(e.clientX - rect.left, cxt.pt.x);
    c =
      Math.max(e.clientY - rect.top, cxt.pt.y) -
      Math.min(e.clientY - rect.top, cxt.pt.y);
    if (e.clientX - rect.left < cxt.pt.x && e.clientY - rect.top < cxt.pt.y) {
      rct.setAttribute("x", e.clientX - rect.left);
      rct.setAttribute("y", e.clientY - rect.top);
      rct.setAttribute("width", b);
      rct.setAttribute("height", c);
      // console.log("e.clientX - rect.left < cxt.x && e.clientY - rect.top < cxt.y");
    } else if (e.clientX - rect.left < cxt.pt.x) {
      rct.setAttribute("x", cxt.pt.x - b);
      rct.setAttribute("y", cxt.pt.y);
      rct.setAttribute("width", b);
      rct.setAttribute("height", c);
      // console.log("e.clientX - rect.left < cxt.x");
    } else if (e.clientY - rect.top < cxt.pt.y) {
      rct.setAttribute("x", cxt.pt.x);
      rct.setAttribute("y", cxt.pt.y - c);
      rct.setAttribute("width", b);
      rct.setAttribute("height", c);
      // console.log("e.clientY - rect.top < cxt.y");
    } else {
      rct.setAttribute("x", cxt.pt.x);
      rct.setAttribute("y", cxt.pt.y);
      rct.setAttribute("width", b);
      rct.setAttribute("height", c);
    }
    sta.textContent = `x = ${rct.getAttribute("x")}, y = ${rct.getAttribute(
      "y"
    )}, width = ${rct.getAttribute("width")}px, height = ${rct.getAttribute(
      "height"
    )}px`;
  },
  mu: (e) => {
    if (e.button == 0) {
      // Complete the drawing of the selection box
      /**@type {SVGRectElement}*/
      const rct = document.querySelector("g#selection-shapes > #rect-sel");

      const shapes = document.getElementsByClassName("ds");
      const rect = {
        maxX: -99999999,
        maxY: -99999999,
        minX: 99999999,
        minY: 99999999,
      };
      /**@type {string[]}*/
      let ar = [];
      cxt.id = [];
      for (let i = 0; i < shapes.length; i++) {
        /**@type {SVGGraphicsElement}*/
        const shape = shapes[i];
        const bb = primitives[shape.tagName].bb(shape.id);
        if (contains(rct.getBBox(), bb)) {
          if (rect.maxX < bb.x + bb.width) rect.maxX = bb.x + bb.width;
          if (rect.maxY < bb.y + bb.height) rect.maxY = bb.y + bb.height;
          if (rect.minX > bb.x) rect.minX = bb.x;
          if (rect.minY > bb.y) rect.minY = bb.y;

          cxt.id.push(shape.id);

          const attrList = Object.keys(
            primitives[document.getElementById(shape.id).tagName]
          );
          if (ar.length > 0) {
            ar = ar.filter((x) => attrList.indexOf(x) >= 0);
          } else {
            ar = attrList;
          }
        }
      }

      if (ar.length <= 0) {
        rct.setAttribute("x", -9999);
        rct.setAttribute("y", -9999);
        rct.setAttribute("width", 0);
        rct.setAttribute("height", 0);
        rct.removeAttribute("transform");
      }  else if(cxt.id.length === 1) {
        primitives[document.getElementById(cxt.id[0]).tagName].cl(undefined, cxt.id[0]);
      } else {
        neutral.ssg(cxt.id);

        /**@type {HTMLElement} */
        const dot = document.querySelector("#rcs");
        dot.onmousedown = e => {
          const t = e.target;
          t.setAttribute("r", Math.max(rct.width.baseVal.value, rct.height.baseVal.value));
          t.style.opacity = '0';
          const canvas = document.getElementById("canvas").getBoundingClientRect();
          t.dataset.m =
            e.clientX - canvas.left + "|" + (e.clientY - canvas.top);
          rct.style.display = "none";
          e.preventDefault();
          e.stopPropagation();
        };
        dot.onmousemove = e => {
          if (e.target.dataset.m && e.target.dataset.m.length > 0) {
            cxt.id.forEach(x => {
              // const me = new MouseEvent("mousemove", {});
              /**@type {SVGSVGElement} */
              const canvas = document.getElementById("canvas");
              const rect = canvas.getBoundingClientRect();
              const shape = document.getElementById(x);
              const object = primitives[shape.tagName];
              const bb = object.bb(x);
              let centre = {x:bb.x+(bb.width/2),y:bb.y+(bb.height/2)};
              const client = {x:e.clientX - rect.x,y:e.clientY - rect.y};
              centre = locVect([centre, client]);
              centre = DOMPoint.fromPoint(client).matrixTransform(e.target.getCTM().translate(centre.x, centre.y))
              const me = {clientX:centre.x,clientY:centre.y};
              object.mv(me, x);
            });
          }
        };
        dot.onmouseup = e => {
          rct.style.display = "";
          e.target.style.opacity = "";
          delete e.target.dataset.m;
          neutral.ssg(cxt.id);
          e.preventDefault();
          e.stopPropagation();
        };
        dot.onmouseleave = e => {
          rct.style.display = "";
          e.target.style.opacity = "";
          delete e.target.dataset.m;
          neutral.ssg(cxt.id);
        };
      }

      cxt.pt = null;
      cxt.cl = null;
    }
  },
  /**@param {string[]} ids */
  bb: ids => {
    const rect = {
      maxX: -99999999,
      maxY: -99999999,
      minX: 99999999,
      minY: 99999999,
    };
    ids.forEach(id => {
      const bb = primitives[document.getElementById(id).tagName].bb(id);
      if (rect.maxX < bb.x + bb.width) rect.maxX = bb.x + bb.width;
      if (rect.maxY < bb.y + bb.height) rect.maxY = bb.y + bb.height;
      if (rect.minX > bb.x) rect.minX = bb.x;
      if (rect.minY > bb.y) rect.minY = bb.y;
    });
    return new DOMRect(rect.minX, rect.minY, Math.abs(rect.maxX - rect.minX), Math.abs(rect.maxY - rect.minY));
  },
  ssg: (ids) => {
    const bb = neutral.bb(ids);
    const br = document.getElementById("rect-sel");
    const dot = document.getElementById("rcs");
    br.setAttribute("stroke", "red");
    br.setAttribute("fill", "none");
    br.setAttribute("stroke-width", "1");
    br.setAttribute("stroke-dasharray", "6");
    br.setAttribute(
      "x",bb.x
    );
    br.setAttribute(
      "y",bb.y
    );
    br.setAttribute(
      "width",bb.width
    );
    br.setAttribute(
      "height",bb.height
    );
    dot.setAttribute("stroke", "none");
    dot.setAttribute("fill", br.getAttribute("stroke"));
    dot.style.opacity = '0.5';
    dot.setAttribute("cx", bb.x + (bb.width/2));
    dot.setAttribute("cy", bb.y + (bb.height/2));
    dot.setAttribute("r", Math.max(bb.width, bb.height) * 0.0125);
  }
};

const svg = {
  height: {
    desc: "The vertical length of the SVG element",
    v: (id) => {
      const atb = document.getElementById(id).getAttribute("height") || "";
      return {
        val: Number((atb.match(NUM_MATCH) || ["^^^"])[0]),
        unit: (atb.match(/(?:%|[A-Za-z]+)$/g) || [""])[0],
        toStr() {
          return this.val + this.unit;
        }
      } 
    },
    l: (id, attr) => {
      /**@type {HTMLUListElement} */
      attr ??= document.querySelector("li.attributes .svg-attr");
      const atb = svg.height.v(id);
      const li = txtCtrl({
        def: Number.isFinite(atb.val) ? atb.val : document.getElementById(id).getBoundingClientRect().height,
        label: "height",
        title: svg.height.desc,
        onchange: (e, id) => {
          const val = Number((e.target
            .value.match(NUM_MATCH)||[""])[0]);
          if (Number.isFinite(val)) {atb.val = val; document.getElementById(id).setAttribute("height", atb.toStr());}
        }
      }, {
        def: Number.isFinite(atb.val) ? atb.unit : "remove",
        label: "unit",
        title: "Choose a unit for this length",
        values: [["", "No unit"], ['px', 'Pixels'],
        ['em', 'Ems'],
        ['rem', 'Root ems'],
        ['vw', 'Viewport width'],
        ['vh', 'Viewport height'],
        ['vmin', 'Minimum viewport'],
        ['vmax', 'Maximum viewport'],
        ['cm', 'Centimeters'],
        ['mm', 'Millimeters'],
        ['in', 'Inches'],
        ['pt', 'Points'],
        ['fr', 'Fraction'],
        ['pc', 'Picas'],
        ['%', 'Percentage'],["Q", "Quarter millimetres"],
        ["remove", "Remove unit"]
        ],
        onchange: (e, id) => {
          const unit = (e.target.value.match(/(?:%|[A-Za-z]+)$/)||[""])[0];
          if(unit !== "remove") {atb.unit = unit; document.getElementById(id).setAttribute("height", atb.toStr());}
          else document.getElementById(id).removeAttribute("height");
        }
      }, id)

      attr.appendChild(li);
    },
  },
  preserveAspectRatio: {
    meetOrSlice: {
      desc: "Scale the graphic such that\n1. the aspect ratio is preserved",
      v: (id) =>
        (
          document.getElementById(id).getAttribute("preserveAspectRatio") || ""
        ).split(" ")[1],
      f: (id, e) => {
        const mos = document.getElementById(id + "-meetOrSlice");
        const canvas = document.getElementById(id);
        const vals = (canvas.getAttribute("preserveAspectRatio") || "").split(
          " "
        );
        vals[1] = mos.value;
        if (!vals[0]) vals[0] = "xMidYMid";
        canvas.setAttribute("preserveAspectRatio", vals.join(" "));
        const lb = document.querySelector(
          'label[for="' + id + '-meetOrSlice"]'
        );
        if (mos.value === "meet")
          lb.title =
            svg.preserveAspectRatio.meetOrSlice.desc +
            "\n2. the entire ‘viewBox’ is visible within the viewport\n3. the ‘viewBox’ is scaled up as much as possible, while still meeting the other criteria";
        else if (mos.value === "slice")
          lb.title =
            svg.preserveAspectRatio.meetOrSlice.desc +
            "\n2. the entire SVG viewport is covered by the ‘viewBox’\n3. the ‘viewBox’ is scaled down as much as possible, while still meeting the other criteria";
        else lb.title = svg.preserveAspectRatio.meetOrSlice.desc;
        mos.title = lb.title;
      },
      l: (id, attr) => {
        /**@type {HTMLUListElement} */
        attr ??= document.querySelector("li.attributes .svg-attr");

        let li = document.createElement("li");
        li.title = svg.preserveAspectRatio.meetOrSlice.desc;
        li.setAttribute("class", "attribute");

        let lb = document.createElement("label");
        lb.title = li.title;
        lb.htmlFor = id + "-meetOrSlice";
        lb.textContent = "meetOrSlice";
        li.appendChild(lb);

        let sel = document.createElement("select");
        const val = svg.preserveAspectRatio.meetOrSlice.v(id);
        let op = document.createElement("option");
        op.value = "meet";
        op.textContent = "meet";
        op.selected = val === "meet" || val === "" || !val;
        sel.appendChild(op);
        op = document.createElement("option");
        op.value = "slice";
        op.textContent = "slice";
        op.selected = val === "slice";
        sel.appendChild(op);
        sel.id = lb.htmlFor;
        sel.name = lb.htmlFor;
        sel.title = lb.title;
        sel.disabled = val === "" || !val;
        sel.onchange = (e) => svg.preserveAspectRatio.meetOrSlice.f(id);
        li.appendChild(sel);

        attr.appendChild(li);
      },
    },
    desc: "How the svg fragment must be deformed if it is displayed with a different aspect ratio",
    v: (id) =>
      (
        document.getElementById(id).getAttribute("preserveAspectRatio") || ""
      ).split(" ")[0],
    f: (id, e) => {
      const val = document.getElementById(id + "-preserveAspectRatio").value;
      const canvas = document.getElementById(id);
      const vals = (canvas.getAttribute("preserveAspectRatio") || "").split(
        " "
      );
      if (val) {
        vals[0] = val;
        canvas.setAttribute("preserveAspectRatio", vals.join(" "));
      }
    },
    l: (id, attr) => {
      /**@type {HTMLUListElement} */
      attr ??= document.querySelector("li.attributes .svg-attr");

      let li = document.createElement("li");
      li.title = svg.preserveAspectRatio.desc;
      li.setAttribute("class", "attribute");

      let lb = document.createElement("label");
      lb.title = li.title;
      lb.htmlFor = id + "-preserveAspectRatio";
      lb.textContent = "preserveAspectRatio";
      li.appendChild(lb);

      let sel = document.createElement("select");
      const val = svg.preserveAspectRatio.v(id);
      let op = document.createElement("option");
      op.value = "none";
      op.textContent = "none";
      op.selected = val === "none";
      sel.appendChild(op);
      op = document.createElement("option");
      op.value = "xMinYMin";
      op.textContent = "xMinYMin";
      op.selected = val === "xMinYMin";
      sel.appendChild(op);
      op = document.createElement("option");
      op.value = "xMidYMin";
      op.textContent = "xMidYMin";
      op.selected = val === "xMidYMin";
      sel.appendChild(op);
      op = document.createElement("option");
      op.value = "xMaxYMin";
      op.textContent = "xMaxYMin";
      op.selected = val === "xMaxYMin";
      sel.appendChild(op);
      op = document.createElement("option");
      op.value = "xMinYMid";
      op.textContent = "xMinYMid";
      op.selected = val === "xMinYMid";
      sel.appendChild(op);
      op = document.createElement("option");
      op.value = "xMidYMid";
      op.textContent = "xMidYMid";
      op.selected = val === "xMidYMid" || val === "" || !val;
      sel.appendChild(op);
      op = document.createElement("option");
      op.value = "xMaxYMid";
      op.textContent = "xMaxYMid";
      op.selected = val === "xMaxYMid";
      sel.appendChild(op);
      op = document.createElement("option");
      op.value = "xMinYMax";
      op.textContent = "xMinYMax";
      op.selected = val === "xMinYMax";
      sel.appendChild(op);
      op = document.createElement("option");
      op.value = "xMidYMax";
      op.textContent = "xMidYMax";
      op.selected = val === "xMidYMax";
      sel.appendChild(op);
      op = document.createElement("option");
      op.value = "xMaxYMax";
      op.textContent = "xMaxYMax";
      op.selected = val === "xMaxYMax";
      sel.appendChild(op);
      sel.title = lb.title;
      sel.name = lb.htmlFor;
      sel.id = lb.htmlFor;
      sel.disabled = val === "" || !val;
      sel.oninput = (e) => svg.preserveAspectRatio.f(id);
      // sel.onchange = (e) => svg.preserveAspectRatio.f(e.target.id);
      li.appendChild(sel);

      lb = document.createElement("label");
      lb.title = "remove \u201dpreserveAspectRatio\u201c attr";
      lb.htmlFor = id + "-preserveAspectRatio-vis";
      lb.textContent = "disable";
      li.appendChild(lb);

      ctrl = document.createElement("input");
      ctrl.type = "checkbox";
      ctrl.title = lb.title;
      ctrl.name = lb.htmlFor;
      ctrl.id = lb.htmlFor;
      ctrl.checked = !document
        .getElementById(id)
        .hasAttribute("preserveAspectRatio");
      ctrl.onclick = (e) => {
        const canvas = document.getElementById(id);
        if (e.target.checked) {
          canvas.dataset.preserveAspectRatio = canvas.getAttribute(
            "preserveAspectRatio"
          );
          canvas.removeAttribute("preserveAspectRatio");
          document
            .getElementById(id + "-preserveAspectRatio")
            .setAttribute("disabled", "true");
          document
            .getElementById(id + "-meetOrSlice")
            .setAttribute("disabled", "true");
        } else {
          canvas.setAttribute(
            "preserveAspectRatio",
            canvas.dataset.preserveAspectRatio ??
              (canvas.dataset.preserveAspectRatio = "xMidYMid")
          );
          document
            .getElementById(id + "-preserveAspectRatio")
            .removeAttribute("disabled");
          document
            .getElementById(id + "-meetOrSlice")
            .removeAttribute("disabled");
        }
      };
      li.appendChild(ctrl);

      attr.appendChild(li);
      svg.preserveAspectRatio.meetOrSlice.l(id);
    },
  },
  viewbox: {
    desc: "the position and dimension, in user space, of an SVG viewport. This is the rectangle in user space which is mapped to the bounds of the viewport established for the associated SVG element",
    x: {
      desc: "the min x position of the view port",
      v: (id) =>
        (document.getElementById(id).getAttribute("viewBox") || "").split(
          " "
        )[0],
      f: (id, e) => {
        const canvas = document.querySelector(id);
        const txt = document.getElementById(id + "-viewbox-x");
        const vals = (canvas.getAttribute("viewBox") || "").split(" ");
        const val = txt.value.match(NUM_MATCH);
        if (val) {
          vals[0] = val[0];
          canvas.setAttribute("viewBox", vals.join(" "));
        }
      },
      l: (id, attr) => {
        /**@type {HTMLUListElement} */
        attr ??= document.querySelector("li.attributes .svg-attr");

        let li = document.createElement("li");
        li.title = svg.viewbox.x.desc;
        li.setAttribute("class", "attribute");

        let lb = document.createElement("label");
        lb.title = li.title;
        lb.htmlFor = id + "-viewbox-x";
        lb.textContent = "min x";
        li.appendChild(lb);

        let ctrl = document.createElement("input");
        ctrl.type = "number";
        ctrl.title = lb.title;
        ctrl.name = lb.htmlFor;
        ctrl.id = lb.htmlFor;
        ctrl.disabled = !document.getElementById(id).hasAttribute("viewBox");
        ctrl.value = svg.viewbox.x.v(id);
        ctrl.oninput = (e) => svg.viewbox.x.f(id);
        li.appendChild(ctrl);

        attr.appendChild(li);
      },
    },
    y: {
      desc: "the min y position of the viewport",
      v: (id) =>
        (document.getElementById(id).getAttribute("viewBox") || "").split(
          " "
        )[1],
      f: (id, e) => {
        const canvas = document.getElementById(id);
        const txt = document.getElementById(id + "-viewbox-y");
        const vals = (canvas.getAttribute("viewBox") || "").split(" ");
        const val = txt.value.match(NUM_MATCH);
        if (val) {
          vals[1] = val[0];
          canvas.setAttribute("viewBox", vals.join(" "));
        }
      },
      l: (id, attr) => {
        /**@type {HTMLUListElement} */
        attr ??= document.querySelector("li.attributes .svg-attr");

        let li = document.createElement("li");
        li.title = svg.viewbox.y.desc;
        li.setAttribute("class", "attribute");

        let lb = document.createElement("label");
        lb.title = li.title;
        lb.htmlFor = id + "-viewbox-y";
        lb.textContent = "min y";
        li.appendChild(lb);

        let ctrl = document.createElement("input");
        ctrl.type = "number";
        ctrl.title = lb.title;
        ctrl.name = lb.htmlFor;
        ctrl.id = lb.htmlFor;
        ctrl.disabled = !document.getElementById(id).hasAttribute("viewBox");
        ctrl.value = svg.viewbox.y.v(id);
        ctrl.oninput = (e) => svg.viewbox.y.f(id);
        li.appendChild(ctrl);

        attr.appendChild(li);
      },
    },
    width: {
      desc: "the width of the viewport",
      v: (id) =>
        (document.getElementById(id).getAttribute("viewBox") || "").split(
          " "
        )[2],
      f: (id, e) => {
        const canvas = document.getElementById(id);
        const txt = document.getElementById(id + "-viewbox-width");
        const vals = (canvas.getAttribute("viewBox") || "").split(" ");
        const val = txt.value.match(NUM_MATCH);
        if (val) {
          vals[2] = val[0];
          canvas.setAttribute("viewBox", vals.join(" "));
        }
      },
      l: (id, attr) => {
        /**@type {HTMLUListElement} */
        attr ??= document.querySelector("li.attributes .svg-attr");

        let li = document.createElement("li");
        li.title = svg.viewbox.width.desc;
        li.setAttribute("class", "attribute");

        let lb = document.createElement("label");
        lb.title = li.title;
        lb.htmlFor = id + "-viewbox-width";
        lb.textContent = "width";
        li.appendChild(lb);

        let ctrl = document.createElement("input");
        ctrl.type = "number";
        ctrl.title = lb.title;
        ctrl.name = lb.htmlFor;
        ctrl.id = lb.htmlFor;
        ctrl.disabled = !document.getElementById(id).hasAttribute("viewBox");
        ctrl.value = svg.viewbox.width.v(id);
        ctrl.oninput = (e) => svg.viewbox.width.f(id);
        li.appendChild(ctrl);

        attr.appendChild(li);
      },
    },
    height: {
      desc: "the height of the viewport",
      v: (id) =>
        (document.getElementById(id).getAttribute("viewBox") || "").split(
          " "
        )[3],
      f: (id, e) => {
        const canvas = document.getElementById(id);
        const txt = document.getElementById(id + "-viewbox-height");
        const vals = (canvas.getAttribute("viewBox") || "").split(" ");
        const val = txt.value.match(NUM_MATCH);
        if (val) {sxsaxx
          vals[3] = val[0];
          canvas.setAttribute("viewBox", vals.join(" "));
        }
      },
      l: (id, attr) => {
        /**@type {HTMLUListElement} */
        attr ??= document.querySelector("li.attributes .svg-attr");

        let li = document.createElement("li");
        li.title = svg.viewbox.height.desc;
        li.setAttribute("class", "attribute");

        let lb = document.createElement("label");
        lb.title = li.title;
        lb.htmlFor = id + "-viewbox-height";
        lb.textContent = "height";
        li.appendChild(lb);

        let ctrl = document.createElement("input");
        ctrl.type = "number";
        ctrl.title = lb.title;
        ctrl.name = lb.htmlFor;
        ctrl.id = lb.htmlFor;
        ctrl.disabled = !document.getElementById(id).hasAttribute("viewBox");
        ctrl.value = svg.viewbox.height.v(id);
        ctrl.oninput = (e) => svg.viewbox.height.f(id);
        li.appendChild(ctrl);

        attr.appendChild(li);
      },
    },
    f: (id, e) => {
      /**@type {SVGSVGElement} */
      const canvas = document.getElementById(id);
      /**@type {HTMLInputElement} */
      const checkbox = document.getElementById(id + "-viewbox-vis");
      if (checkbox.checked) {
        canvas.dataset.viewbox = canvas.getAttribute("viewBox");
        canvas.removeAttribute("viewBox");
        document
          .getElementById(id + "-viewbox-x")
          .setAttribute("disabled", "true");
        document
          .getElementById(id + "-viewbox-y")
          .setAttribute("disabled", "true");
        document
          .getElementById(id + "-viewbox-width")
          .setAttribute("disabled", "true");
        document
          .getElementById(id + "-viewbox-height")
          .setAttribute("disabled", "true");
      } else {
        canvas.setAttribute(
          "viewBox",
          canvas.dataset.viewbox ??
            (canvas.dataset.viewbox = `0 0 ${bb.width} ${bb.height}`)
        );
        document.getElementById(id + "-viewbox-x").removeAttribute("disabled");
        document.getElementById(id + "-viewbox-y").removeAttribute("disabled");
        document
          .getElementById(id + "-viewbox-width")
          .removeAttribute("disabled");
        document
          .getElementById(id + "-viewbox-height")
          .removeAttribute("disabled");
      }
    },
    l: (id, attr) => {
      /**@type {HTMLUListElement} */
      attr ??= document.querySelector("li.attributes .svg-attr");

      let li = document.createElement("li");
      li.title = svg.viewbox.desc;
      li.style.display = "flex";
      li.style.flexDirection = "row";
      li.style.justifyContent = "space-between";
      li.style.alignItems = "center";

      let p = document.createElement("p");
      p.title = svg.viewbox.desc;
      p.textContent = "viewBox";
      li.appendChild(p);

      let span = document.createElement("span");

      let lb = document.createElement("label");
      lb.title = "disable the \u2019viewBox\u2018 atrribute";
      lb.htmlFor = id + "-viewbox-vis";
      lb.textContent = "disable";
      span.appendChild(lb);

      let ctrl = document.createElement("input");
      ctrl.type = "checkbox";
      ctrl.title = lb.title;
      ctrl.id = lb.htmlFor;
      ctrl.name = lb.htmlFor;
      ctrl.checked = !document.getElementById(id).hasAttribute("viewBox");
      ctrl.onclick = (e) => svg.viewbox.f(id);
      span.appendChild(ctrl);
      li.appendChild(span);

      attr.appendChild(li);
      svg.viewbox.x.l(id);
      svg.viewbox.y.l(id);
      svg.viewbox.width.l(id);
      svg.viewbox.height.l(id);
    },
  },
  width: {
    desc: "The horizontal length of the SVG element",
    v: (id) => {
      const atb = document.getElementById(id).getAttribute("width") || "";
      return {
        val: Number((atb.match(NUM_MATCH) || ["^^^"])[0]),
        unit: (atb.match(/(?:%|[A-Za-z]+)$/g) || [""])[0],
        toStr() {
          return this.val + this.unit;
        }
      } 
    },
    l: (id, attr) => {
      /**@type {HTMLUListElement} */
      attr ??= document.querySelector("li.attributes .svg-attr");
      const atb = svg.width.v(id);
      const li = txtCtrl({
        def: Number.isFinite(atb.val) ? atb.val : document.getElementById(id).getBoundingClientRect().width,
        label: "width",
        title: svg.width.desc,
        onchange: (e, id) => {
          const val = Number((e.target
            .value.match(NUM_MATCH)||[""])[0]);
          if (Number.isFinite(val)) {atb.val = val; document.getElementById(id).setAttribute("width", atb.toStr());}
        }
      }, {
        def: Number.isFinite(atb.val) ? atb.unit : "remove",
        label: "unit",
        title: "Choose a unit for this length",
        values: [["", "No unit"], ['px', 'Pixels'],
        ['em', 'Ems'],
        ['rem', 'Root ems'],
        ['vw', 'Viewport width'],
        ['vh', 'Viewport height'],
        ['vmin', 'Minimum viewport'],
        ['vmax', 'Maximum viewport'],
        ['cm', 'Centimeters'],
        ['mm', 'Millimeters'],
        ['in', 'Inches'],
        ['pt', 'Points'],
        ['fr', 'Fraction'],
        ['pc', 'Picas'],
        ['%', 'Percentage'],["Q", "Quarter millimetres"],
        ["remove", "Remove unit"]
        ],
        onchange: (e, id) => {
          const unit = (e.target.value.match(/(?:%|[A-Za-z]+)$/)||[""])[0];
          if(unit !== "remove") {atb.unit = unit; document.getElementById(id).setAttribute("width", atb.toStr());}
          else document.getElementById(id).removeAttribute("width");
        }
      }, id)

      attr.appendChild(li);
    },
  },
  x: {
    desc: "the x coordinate of the upper left corner of its viewport",
    v: (id) => {
      const atb = document.getElementById(id).getAttribute("x") || "";
      return {
        val: Number((atb.match(NUM_MATCH) || ["^^^"])[0]),
        unit: (atb.match(/(?:%|[A-Za-z]+)$/g) || [""])[0],
        toStr() {
          return this.val + this.unit;
        }
      } 
    },
    l: (id, attr) => {
      /**@type {HTMLUListElement} */
      attr ??= document.querySelector("li.attributes .svg-attr");
      const atb = svg.x.v(id);
      const li = txtCtrl({
        def: Number.isFinite(atb.val) ? atb.val : '0',
        label: "x",
        title: svg.x.desc,
        onchange: (e, id) => {
          const val = Number((e.target
            .value.match(NUM_MATCH)||[""])[0]);
          if (Number.isFinite(val)) {atb.val = val; document.getElementById(id).setAttribute("x", atb.toStr());}
        }
      }, {
        def: Number.isFinite(atb.val) ? atb.unit : "remove",
        label: "unit",
        title: "Choose a unit for this value",
        values: [["", "No unit"], ['px', 'Pixels'],
        ['em', 'Ems'],
        ['rem', 'Root ems'],
        ['vw', 'Viewport width'],
        ['vh', 'Viewport height'],
        ['vmin', 'Minimum viewport'],
        ['vmax', 'Maximum viewport'],
        ['cm', 'Centimeters'],
        ['mm', 'Millimeters'],
        ['in', 'Inches'],
        ['pt', 'Points'],
        ['fr', 'Fraction'],
        ['pc', 'Picas'],
        ['%', 'Percentage'],["Q", "Quarter millimetres"],
        ["remove", "Remove unit"]
        ],
        onchange: (e, id) => {
          const unit = (e.target.value.match(/(?:%|[A-Za-z]+)$/)||[""])[0];
          if(unit !== "remove") {atb.unit = unit; document.getElementById(id).setAttribute("x", atb.toStr());}
          else document.getElementById(id).removeAttribute("x");
        }
      }, id)

      attr.appendChild(li);
    },
  },
  y: {
    desc: "the y coordinate of the upper left corner of its viewport",
    v: (id) => {
      const atb = document.getElementById(id).getAttribute("y") || "";
      return {
        val: Number((atb.match(NUM_MATCH) || ["^^^"])[0]),
        unit: (atb.match(/(?:%|[A-Za-z]+)$/g) || [""])[0],
        toStr() {
          return this.val + this.unit;
        }
      } 
    },
    l: (id, attr) => {
      /**@type {HTMLUListElement} */
      attr ??= document.querySelector("li.attributes .svg-attr");
      const atb = svg.y.v(id);
      const li = txtCtrl({
        def: Number.isFinite(atb.val) ? atb.val : '0',
        label: "y",
        title: svg.y.desc,
        onchange: (e, id) => {
          const val = Number((e.target
            .value.match(NUM_MATCH)||[""])[0]);
          if (Number.isFinite(val)) {atb.val = val; document.getElementById(id).setAttribute("y", atb.toStr());}
        }
      }, {
        def: Number.isFinite(atb.val) ? atb.unit : "remove",
        label: "unit",
        title: "Choose a unit for this value",
        values: [["", "No unit"], ['px', 'Pixels'],
        ['em', 'Ems'],
        ['rem', 'Root ems'],
        ['vw', 'Viewport width'],
        ['vh', 'Viewport height'],
        ['vmin', 'Minimum viewport'],
        ['vmax', 'Maximum viewport'],
        ['cm', 'Centimeters'],
        ['mm', 'Millimeters'],
        ['in', 'Inches'],
        ['pt', 'Points'],
        ['fr', 'Fraction'],
        ['pc', 'Picas'],
        ['%', 'Percentage'],["Q", "Quarter millimetres"],
        ["remove", "Remove unit"]
        ],
        onchange: (e, id) => {
          const unit = (e.target.value.match(/(?:%|[A-Za-z]+)$/)||[""])[0];
          if(unit !== "remove") {atb.unit = unit; document.getElementById(id).setAttribute("y", atb.toStr());}
          else document.getElementById(id).removeAttribute("y");
        }
      }, id)

      attr.appendChild(li);
    },
  },
};
const shape = {
  desc: "",
  f: (id) => {},
  l: (id) => {},
};

// apply the visual bounding box (around selected shapes) properly during tranformations
// use 'oninput' for as opposed to 'onchange'
// add enable and disble checkbox for all attr of a shape
// use tables for all map-like atrr (i.e attributes that have a key/pairs). Use this for the style attrbute.
// whereby the key is the name of the css property (e.g color) rendered as the first cell of the table's row
// and the value(s) is/are the a textfield, list, drop down or table.
// streamline all attributes. e.g make 'matrix' as a direct attribute of 'transform'
// The values of the transform attribute should be infinite. This means that rotate should be able to be added infinitely
// The unit types of the value of an attribute should be accounted for
// bulk move
// bulk resize (left, right, top down)
// default controls for every known attr
// paint server
// clipping
// masking
// filter
// Animation
// Be able to convert a line to a linearGradient
// Be able to convert a circle to a radialGradient
// Be able to convert a path to a marker
// Be able to convert an image to a pattern
