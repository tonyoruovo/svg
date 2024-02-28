self.onmessage = e => {
    const args = e.data;
    self.postMessage(getD(ld(frDR(args))) * 0.0125);
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
      nw: wDP(DOMPoint.fromPoint({x: r.x, y: r.y})),
      ne: wDP(DOMPoint.fromPoint({x: r.x + r.width, y: r.y})),
      se: wDP(DOMPoint.fromPoint({x: r.x + r.width, y: r.y + r.height})),
      sw: wDP(DOMPoint.fromPoint({x: r.x, y: r.y + r.height})),
      c: wDP(DOMPoint.fromPoint({x: r.x + (r.width / 2), y: r.y + (r.height / 2)})),
    };
  }
  /**
   * @summary **norm**alise**L**i**n**e
   * @description Re-arranges the endpoints of a given line so that the leftmost (or top-most) point (in a 2D cartesian plane)
   * comes first in the 2-length array.
   * @param {[DOMPoint, DOMPoint]} l a 2-length tuple representing the endpoints of the line.
   * @param {boolean} [t=true] a `boolean` value, whereby if `!!t === true` then {@linkplain normLnHorz horizontal normalisation}
   * will be carried out else {@linkplain normLnVert vertical normalisation} is carried out.
   * @returns {[DOMPoint, DOMPoint]} a 2-length tuple representing the endpoints of a line such that the first element is
   * the left-most/top-most point.
   */
  function normLn(l, t = true) {
    return t ? normLnHorz(l) : normLnVert(l);
  }
  /**
   * @summary **norm**alise**L**i**n**e**Hor**i**z**ontal
   * @description Re-arranges the endpoints of a given line so that the leftmost point (in a 2D cartesian plane)
   * comes first in the 2-length array and, consequentially, the rightmost point comes last.\
   * \
   * Note that *left-most point* here refers to the `DOMPoint` (index in the input array) whose `x` property
   * is closest to `0`.
   * @param {[DOMPoint, DOMPoint]} l a 2-length tuple representing the endpoints of the line.
   * @returns {[DOMPoint, DOMPoint]} a 2-length tuple representing the endpoints of a line such that the first element is
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
   * @param {[DOMPoint, DOMPoint]} l a 2-length tuple representing the endpoints of the line.
   * @returns {[DOMPoint, DOMPoint]} a 2-length tuple representing the endpoints of a line such that the first element is
   * the top-most point and the last element is the bottom-most point.
   */
  function normLnVert(l) {
    return l[0].y <= l[1].y ? l : [l[1], l[0]];
  }
  /**
   * @summary **getD**istance
   * @description Gets the distance between the given points
   * @param {[DOMPoint, DOMPoint]} l the endpoints of the line whose distance is to be calculated.
   * @returns {number} the distance between the specified endpoints
   */
  function getD(l) {
    const f = a => a*a;//square function
    return Math.sqrt(f(l[1].x - l[0].x) + f(l[1].y - l[0].y));
  }
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
    return getD([r.nw, r.se]) >= getD([r.sw, r.ne]) ? normLn([r.nw, r.se]) : normLn([r.sw, r.ne]);
  }