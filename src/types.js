/**
 * This contains all types that may be used in the SVG Editor programme.
 * It also holds generic functions for manipulating such types.
 * @module Types
 */
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
 * A location on a given coordinate system.
 * @typedef {Object} Point
 * @property {number} x the location of this point on the x-axis
 * @property {number} y the location of this point on the y-axis
 */
/**
 * A size of a given object
 * @typedef {Object} Dimension
 * @property {number} width the width of this object
 * @property {number} height the height of this object
 */
/**
 * @typedef {Object} Rect
 * @property {Point} p the smallest x and y location on the user coordinate system
 * @property {Dimension} d the dimensions of this rect
 */
 /**
  * A functor which may be an alternate way to access a vector where an {@linkplain VectorArray an array} may
  * not be suitable.
  * @callback VectorAccess
  * @param {number} index the integer representing the index at which to access the coordinate,
  * component, entry or element stored therein.
  * @returns {number} the coordinate, component, entry or element stored therein.
  */
/**
 * A mathematical linear array or algebraic tuple.
 * @typedef {number[]} VectorArray
 */
/**
 * An interface to access coordinates, components, entries or elements in a vector.
 * Note that although this is defined as extending both the {@linkcode VectorAccess} and
 * {@linkcode VectorArray} interfaces, it need not be, hence it can be one or the other.
 * @typedef {VectorAccess & VectorArray} VectorLike
 */
/**
 * An algebraic vector over a real number field.
 * @typedef {Object} VectorProperties
 * @property {number} sp **sp**ace. The space (dimension) of this vector.
 * E.g a 2d vector will have this value be `2`, a 3d vector will always
 * have this value as `3` and so on...
 * @property {(vector: Vector) => boolean} eq Checks if the argument is equal to the caller and
 * returns `true` if it is, else, returns `false`.
 * @property {(addend: Vector | number) => Vector} add Performs the vector (or scalar) addition with the argument being
 * the addend and returns the result of the sum. This vector is not mutated in any way and the returned vector is the a different
 * object from this or the addend.\
 * \
 * If the argument is a `number`, then scalar addition is performed. If argument is a negative `number` or the vector is negative
 * (have all it's components be negative) then a subtraction will be performed.
 * @property {(addend: Vector | number) => Vector} addS same as {@linkcode VectorProperties.add} except
 * this object (caller) is mutated such that the returned value is the same object as the caller.
 * @property {(subtrahend: Vector | number) => Vector} sub Performs the vector (or scalar) subtraction with the argument being
 * the subtrahend and returns the result of the difference. This vector is not mutated in any way and the returned vector is the a different
 * object from this or the subtrahend.
 * @property {(subtrahend: Vector | number) => Vector} addS same as {@linkcode VectorProperties.sub} except
 * this object (caller) is mutated such that the returned value is the same object as the caller.
 * @property {(multiplicand: number) => Vector} mul Performs the scalar multiplication with the argument being
 * the multiplicand and returns the result of the multiplication. This vector is not mutated in any way and the returned
 * vector is the a different object from this.\
 * \
 * If argument is between `1` and `0` then a division will be performed.
 * @property {(multiplicand: Vector | number) => Vector} mulS same as {@linkcode VectorProperties.mul} except
 * this object (caller) is mutated such that the returned value is the same object as the caller.
 * @property {(vector: Vector) => number} dot Computes the dot product of this and the argument.
 * @property {() => number} norm the length (alias absolute value) of this vector
 * @property {(vector: Vector) => number} dist gets the distance between this vector and the argument vector.
 * @property {(vector: Vector) => number} ang gets the angle (in radians) between this vector and the argument vector.
 * @property {(vector: Vector) => Vector} proj projects this vector onto the argument vector and returns the result.
 * This vector is not mutated in any way and the returned vector is the a different object from this.
 * @property {(vector: Vector) => Vector} projS same as {@linkcode VectorProperties.proj} except
 * this object (caller) is mutated such that the returned value is the same object as the caller.
 * @property {(vector: Vector) => Vector} cross Computes the cross product if this vector and the argument are in
 * the 3-dimensional space, hence will throw if this or the argument is not 3d. This vector is not mutated in any way and the returned
 * vector is the a different object from this.
 * @property {(vector: Vector) => Vector} crossS same as {@linkcode VectorProperties.cross} except
 * this object (caller) is mutated such that the returned value is the same object as the caller.
 */
/**
 * @typedef {VectorLike & VectorProperties} Vector
 */
/**
 * Creates a {@linkcode Vector} wrapper for an array of numbers.
 * @param {VectorArray} a the number array to wrapped
 */
function arr2Vec(a) {
  const c = () => {};
  // a.caller = a;
  // a.call = a.apply = (f, fa, args) => {}
  a.sp = a.length;
  a.equals = v => {
    if(a.length !== v.sp) return false;
    for (let i = 0; i < a.length; i++) {
      const e = a[i];
      if(a[i] !== v[i]) return false;
    }
    return true;
  };

  return a;
}
/**@type {Vector} */
const a = [2, 3, 4];
const b = a(i)