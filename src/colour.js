/* eslint-disable no-unused-vars */
/* eslint-disable spaced-comment */
//TODO: implement the colour models and spaces in the detailed

// import util from "./utility";
/**
 * Generic class that acts as an interface for all colours. \
 * All methods in this class never return
 */
class ColourInterface {
  /**
   * Gets the alpha component of this colour which actually represents the opacity of this colour.
   * This value is in the range [0, 1] where 0 is transparent and 1 is opaque.
   * @returns {number} a value representing the opacity of this colour in the closed range [0, 1]
   */
  getAlpha() {
    throw new TypeError("method not implemented");
  }

  /**
   * Sets the alpha component of this colour which actually represents the opacity of this colour.
   * @param {number} a the alpha value. This value is in the range [0, 1] where 0 is transparent and 1 is opaque.
   * @returns {void}
   */
  setAlpha(a) {
    throw new TypeError("method not implemented");
  }

  /**
   * Converts this `ColourInterface` object into an `RGBA` object with as much precision as possible
   * @returns {RGBA} returns a `RGBA` colour.
   */
  toRGB() {
    throw new TypeError("method not implemented");
  }

  /**
   * Returns a suitable string that can be passed directly to the css `color` or `background-color` property
   * @returns {string} a css compatible value that is a colour representative of this object
   */
  toString() {
    throw new TypeError("method not implemented");
  }

  /**
   * The same as {@link toString}
   * @returns {string} a css color property string
   */
  toJson() {
    return this.toString();
  }

  /**
   * Compares this colour with the argument and returns a value in the closed range [-1, 1]
   * where -1 denotes less than, 1 denotes greater than and 0 denotes equality. Colours are
   * compared on the basis of their luminance in descending order
   * @param {ColourInterface} c a colour to be compared
   */
  compareTo(c) {
    throw new TypeError("method not implemented");
  }

  /**
   * Provides an equality operator for colour objects
   * @param {any} c an object to be compared to this one
   */
  equals(c) {
    throw new TypeError("method not implemented");
  }
}
/**
 * Represents the sRGB or linear RGB (with an opacity/alpha component) colour space.
 * This is a central colour space as it is the only colour space in this module that
 * can convert to all other colour spaces in this module including `CIEXYZ`, `HSL`,
 * `HSV`, `HSI`, `Integer` and `NamedColour` objects.
 */
class RGBA extends ColourInterface {
  #r;
  #g;
  #b;
  #a;
  /**
   * Constructs an `RGBA` object by specifying components that cn later be changed through any
   * of the set method. When this constructor is called without a single argument, then an `RGBA`
   * object that is equivalent to an opaque black colour is instantiated.
   * @param {number} r The red component in the rgb colour model. The default is `0`
   * @param {number} g the green component in the rgb colour model. The default is `0`
   * @param {number} b the blue component in the rgb colour model. The default is `0`
   * @param {number} a the alpha component in the colour model. The default is `1`
   */
  constructor(r = 0, g = 0, b = 0, a = 1) {
    super();
    if (typeof r === "number") this.#r = Math.min(Math.max(r, -255), 255);
    else throw new TypeError("r is not a number");
    if (typeof g === "number") this.#g = Math.min(Math.max(g, -255), 255);
    else throw new TypeError("g is not a number");
    if (typeof b === "number") this.#b = Math.min(Math.max(b, -255), 255);
    else throw new TypeError("b is not a number");
    if (typeof a === "number") this.#a = Math.min(Math.max(a, 0), 1);
    else throw new TypeError("a is not a number");
  }

  /**
   * Gets the red component of this rgb colour.
   * @returns {number} a number (integer) between `0` and `255` representing the
   * red component in this sRGB space
   */
  getRed() {
    return this.#r;
  }

  /**
   * Gets the green component of this rgb colour.
   * @returns {number} a number (integer) between `0` and `255` representing the
   * green component in this sRGB space
   */
  getGreen() {
    return this.#g;
  }

  /**
   * Gets the blue component of this rgb colour.
   * @returns {number} a number (integer) between `0` and `255` representing the
   * blue component in this sRGB space
   */
  getBlue() {
    return this.#b;
  }

  /**
   * Gets the alpha value of this colour which controls the opacity.
   * `0` is for fully transparent and `1` is for fully opaque.
   * @returns {number} a number (floating-point) between `0` (fully transparent)
   * and `1` (fully opaque) representing the alpha of this colour.
   */
  getAlpha() {
    return this.#a;
  }

  /**
   * Sets the red component of this rgb colour. If `r < 0` then the red
   * is set to `0` or if `r > 255` then the red is set to `255` or else
   * the red is set to the value given as argument. \
   * This method returns `void`
   * @param {number} r the red value to be set as a value between `0`
   * (inclusive) and `255` (inclusive).
   * @default 0
   */
  setRed(r = 0) {
    this.#r = Math.min(Math.max(r, -255), 255);
  }

  /**
   * Sets the green component of this rgb colour. If `g < 0` then the green
   * is set to `0` or if `g > 255` then the green is set to `255` or else
   * the green is set to the value given as argument. \
   * This method returns `void`
   * @param {number} g the green value to be set as a value between `0`
   * (inclusive) and `255` (inclusive).
   * @default 0
   */
  setGreen(g = 0) {
    this.#g = Math.min(Math.max(g, -255), 255);
  }

  /**
   * Sets the blue component of this rgb colour. If `b < 0` then the blue
   * is set to `0` or if `b > 255` then the blue is set to `255` or else
   * the blue is set to the value given as argument. \
   * This method returns `void`
   * @param {number} b the blue value to be set as a value between `0`
   * (inclusive) and `255` (inclusive).
   * @default 0
   */
  setBlue(b = 0) {
    this.#b = Math.min(Math.max(b, -255), 255);
  }

  /**
   * Sets the alpha component of this colour. If `a < 0` then the alpha
   * is set to `0.0` or if `a > 1.0` then the alpha is set to `1.0` or else
   * the alpha is set to the value given as argument. \
   * This method returns `void`
   * @param {number} a the alpha value to be set as a value between `0.0`
   * (inclusive) and `1.0` (inclusive).
   * @default 1
   */
  setAlpha(a = 1) {
    this.#a = Math.min(Math.max(a, 0), 1);
  }

  toRGB() {
    return this;
  }

  /**
   * Converts this `RGBA` object into an `Integer` object with 100% precision where
   * all components map exactly to the integer.
   * @returns {Integer} returns an `Integer` colour
   */
  toInteger() {
    return new Integer(
      (this.#r << 24) |
        (this.#g << 16) |
        (this.#b << 8) |
        Math.floor(this.#a * 0xff)
    );
  }

  /**
   * Converts this `RGBA` object into an `CIEXYZA` object with as much precision as possible
   * @returns {CIEXYZA} returns a `CIEXYZA` colour
   */
  toCIEXYZ() {
    const r = this.#r / 0xff;
    const g = this.#g / 0xff;
    const b = this.#b / 0xff;
    const x = r * 0.4124564 + g * 0.357561 + b * 0.1804375;
    const y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
    const z = r * 0.0193339 + g * 0.119192 + b * 0.9503041;
    return new CIEXYZA(x, y, z, this.#a);
  }

  /**
   * Converts a colour in the linear RGB colour space to a HSL colour
   * @param {number[]} rgba an array with all the components of a linear RGB colour including the alpha component
   * which is at the last index
   * @returns {number[]} returns an array of all the components of a HSL colour including the alpha component
   * which is at the last index
   */
  static #linearToHSL(rgba) {
    const vmax = Math.max(rgba[0], rgba[1], rgba[2]);
    const vmin = Math.min(rgba[0], rgba[1], rgba[2]);
    const vadd = vmax + vmin;
    // NOTE: "Lightness" is the midpoint between
    // the greatest and least RGB component;
    const lt = vadd / 2.0;
    if (vmax === vmin) return [0, 0, lt, rgba[3]];
    const vd = vmax - vmin;
    let divisor = vadd;
    if (lt > 0.5) divisor = 2.0 - vadd;
    const s = vd / divisor;
    let h = 0;
    const hvd = vd / 2.0;
    const deg60 = Math.PI / 3;
    if (rgba[0] === vmax) {
      h = ((vmax - rgba[2]) * deg60 + hvd) / vd;
      h = h - ((vmax - rgba[1]) * deg60 + hvd) / vd;
    } else if (rgba[2] === vmax) {
      h = (Math.PI * 4) / 3 + ((vmax - rgba[1]) * deg60 + hvd) / vd;
      h = h - ((vmax - rgba[0]) * deg60 + hvd) / vd;
    } else {
      h = (Math.PI * 2) / 3 + ((vmax - rgba[0]) * deg60 + hvd) / vd;
      h = h - ((vmax - rgba[2]) * deg60 + hvd) / vd;
    }
    if (h < 0) h = Math.PI * 2 - rem(-h, Math.PI * 2);
    if (h >= Math.PI * 2) h = rem(h, Math.PI * 2);
    return [h, s, lt, rgba[3]];
  }

  /**
   * Converts this `RGBA` object into an `HSLA` object with as much precision as possible
   * @returns {HSLA} returns a `HSLA` colour
   */
  toHSL() {
    const l = sToLinearRGB(this);
    const hsl = RGBA.#linearToHSL([
      l.getRed() / 0xff,
      l.getGreen() / 0xff,
      l.getBlue() / 0xff,
      l.getAlpha(),
    ]);
    return new HSLA(toDegrees(hsl[0]), hsl[1], hsl[2], hsl[3]);
  }

  /**
   * Converts this `RGBA` object into an `HSLA` object with as much precision as possible
   * @deprecated this method is abadoned due to the fact that it does not take linear RGBA
   * into consideration
   * @returns {HSLA} returns a `HSLA` colour
   */
  #toHSLDegrees() {
    const r = this.#r / 0xff;
    const g = this.#g / 0xff;
    const b = this.#b / 0xff;
    const v = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const c = (v + min) / 2;
    let h = 0;
    let s = 0;
    const l = v - c / 2;

    if (c === 0) h = 0;
    else if (v === r) h = 60 * ((g - b) / c);
    else if (v === g) h = 60 * (2 + (b - r) / c);
    else if (v === b) h = 60 * (4 + (r - g) / c);

    if (l === 0 || l === 1) s = 0;
    else s = (v - l) / Math.min(l, 1 - l);
    return new HSLA(h, s, l, this.#a);
  }

  /**
   * Converts this `RGBA` object into an `HSVA` object with as much precision as possible
   * @deprecated this method is abadoned due to the fact that it does not take linear RGBA
   * into consideration
   * @returns {HSVA} returns a `HSVA` colour
   */
  #toHSVDegrees() {
    const r = this.#r / 0xff;
    const g = this.#g / 0xff;
    const b = this.#b / 0xff;
    const v = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const c = (v + min) / 2;
    let h = 0;
    let s = 0;

    if (c === 0) h = 0;
    else if (v === r) h = 60 * ((g - b) / c);
    else if (v === g) h = 60 * (2 + (b - r) / c);
    else if (v === b) h = 60 * (4 + (r - g) / c);

    if (v === 0) s = 0;
    else s = c / v;
    return new HSVA(h, s, v, this.#a);
  }

  /**
   * Converts a colour in the linear RGB colour space to a HSV colour
   * @param {number[]} rgba an array with all the components of a linear RGB colour including the alpha component
   * which is at the last index
   * @returns {number[]} returns an array of all the components of a HSV colour including the alpha component
   * which is at the last index
   */
  static #linearToHSV(rgba) {
    const mx = Math.max(rgba[0], rgba[1], rgba[2]);
    const mn = Math.min(rgba[0], rgba[1], rgba[2]);
    // NOTE: "Value" is the highest of the
    // three components
    if (mx === mn) return [0, 0, mx, rgba[3]];
    const s = (mx - mn) / mx;
    let h = 0;
    if (rgba[0] === mx) h = (rgba[1] - rgba[2]) / (mx - mn);
    else if (rgba[1] === mx) h = 2 + (rgba[2] - rgba[0]) / (mx - mn);
    else h = 4 + (rgba[0] - rgba[1]) / (mx - mn);
    if (h < 0) h = 6 - rem(-h, 6);
    if (h >= 6) h = rem(h, 6);
    return [h * (Math.PI / 3), s, mx, rgba[3]];
  }

  /**
   * Converts this `RGBA` object into an `HSVA` object with as much precision as possible
   * @returns {HSVA} returns a `HSVA` colour
   */
  toHSV() {
    const l = sToLinearRGB(this);
    const hsv = RGBA.#linearToHSV([
      l.getRed() / 0xff,
      l.getGreen() / 0xff,
      l.getBlue() / 0xff,
      l.getAlpha(),
    ]);
    return new HSVA(toDegrees(hsv[0]), hsv[1], hsv[2], hsv[3]);
  }

  /**
   * Converts this `RGBA` object into an `HSIA` object with as much precision as possible
   * @returns {HSIA} returns a `HSIA` colour
   */
  toHSI() {
    const r = this.#r / 0xff;
    const g = this.#g / 0xff;
    const b = this.#b / 0xff;
    const v = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const c = v - min;
    let h = 0;
    let s = 0;
    const i = (r + g + b) / 3;

    if (c === 0) h = 0;
    else if (v === r) h = 60 * ((g - b) / c);
    else if (v === g) h = 60 * (2 + (b - r) / c);
    else if (v === b) h = 60 * (4 + (r - g) / c);

    if (i === 0) s = 0;
    else s = 1 - min / i;
    return new HSIA(h, s, i, this.#a);
  }

  /**
   * Converts this `RGBA` object into a css `NamedColour` object with as much precision as possible.
   * If this rgb caolour cannot be mapped to a corresponding css colour string, then black is returned.
   * In the future, I would like to increase the named colours and when a colour is not supported as
   * a colour name, then it's integer variant will be returned rather than just returning black
   * @returns {NamedColour} returns a css `NamedColour` colour
   */
  toNamedColour() {
    const color = this.toInteger().getColour();
    const colorArray = Object.keys(namedColors).filter(
      (c) => namedColors[c] === color
    );

    if (colorArray.length > 0) return new NamedColour(colorArray[0]);
    return new NamedColour("black");
  }

  /**
   * Returns a string in the form that is compatible with css.
   * @returns {string} a string in the form `rgba(red, green, blue, alpha)` where
   * each of the arguments in the string is replaced by their actual value
   */
  toString() {
    return this.#a === 1 ? `rgb(${this.#r}, ${this.#g}, ${this.#b})`
    : `rgba(${this.#r}, ${this.#g}, ${this.#b}, ${this.#a})`;
  }

  compareTo(c) {
    try {
      const self = this.toInteger().getColour();
      const i = c.toRGB().toInteger().getColour();
      return self < i ? -1 : self > i ? 1 : 0;
    } catch (e) {
      throw new TypeError("the argument is not a colour.");
    }
  }

  equals(c) {
    try {
      return this.compareTo(c) === 0;
    } catch (e) {
      return false;
    }
  }
}
class CIEXYZA extends ColourInterface {
  #x;
  #y;
  #z;
  #a;
  constructor(x = 0, y = 0, z = 0, a = 1) {
    super();
    if (typeof x === "number") this.#x = x < 0 ? 0 : x > 1 ? 1 : x;
    else throw new TypeError("x is not a number");
    if (typeof y === "number") this.#y = y < 0 ? 0 : y > 1 ? 1 : y;
    else throw new TypeError("y is not a number");
    if (typeof z === "number") this.#z = z < 0 ? 0 : z > 1 ? 1 : z;
    else throw new TypeError("z is not a number");
    if (typeof a === "number") this.#a = a < 0 ? 0 : a > 1 ? 1 : a;
    else throw new TypeError("a is not a number");
  }

  /**
   * Returns the `x` value of this colour
   * @returns {number} the `x` value
   */
  getX() {
    return this.#x;
  }

  /**
   * Returns the `y` value of this colour
   * @returns {number} the `y` value
   */
  getY() {
    return this.#y;
  }

  /**
   * Returns the `z` value of this colour
   * @returns {number} the `z` value
   */
  getZ() {
    return this.#z;
  }

  getAlpha() {
    return this.#a;
  }

  /**
   * Sets the `x` value of this colour where the default value is 0.
   * `x` lies in the closed range [0, 1]
   * @returns {void}
   */
  setX(x = 0) {
    if (typeof x === "number") this.#x = x < 0 ? 0 : x > 1 ? 1 : x;
    else throw new TypeError("not a number");
  }

  /**
   * Sets the `y` value of this colour where the default value is 0.
   * `y` lies in the closed range [0, 1]
   * @returns {void}
   */
  setY(y = 0) {
    if (typeof y === "number") this.#y = y < 0 ? 0 : y > 1 ? 1 : y;
    else throw new TypeError("not a number");
  }

  /**
   * Sets the `x` value of this colour where the default value is 0.
   * `x` lies in the closed range [0, 1]
   * @returns {void}
   */
  setZ(z = 0) {
    if (typeof z === "number") this.#z = z < 0 ? 0 : z > 1 ? 1 : z;
    else throw new TypeError("not a number");
  }

  setAlpha(a = 0) {
    if (typeof a === "number") this.#a = a < 0 ? 0 : a > 1 ? 1 : a;
    else throw new TypeError("not a number");
  }

  toRGB() {
    const rgba = [0.0, 0.0, 0.0];
    rgba[0] = 3.2404542 * this.#x + -1.5371385 * this.#y + -0.4985314 * this.#z;
    rgba[1] = -0.969266 * this.#x + 1.8760108 * this.#y + 0.041556 * this.#z;
    rgba[2] = 0.0556434 * this.#x + -0.2040259 * this.#y + 1.0572252 * this.#z;

    return new RGBA(rgba[0] * 0xff, rgba[1] * 0xff, rgba[2] * 0xff, this.#a);
  }

  /**
   * Returns a string in the form that is compatible with css.
   * @returns {string} a string in the form `ciexyza(x, y, z, alpha)` where
   * `x`, `y` and `z` are the percentage of their actual value
   */
  toString() {
    return `ciexyza(${this.#x * 100}%, ${this.#y * 100}%, ${this.#z * 100}%, ${
      this.#a
    })`;
  }

  compareTo(c) {
    try {
      const self = this.toRGB().getColour();
      const i = c.toRGB().toInteger().getColour();
      return self < i ? -1 : self > i ? 1 : 0;
    } catch (e) {
      throw new TypeError("the argument is not a colour.");
    }
  }

  equals(c) {
    try {
      return this.compareTo(c) === 0;
    } catch (e) {
      return false;
    }
  }
}
class HSLA extends ColourInterface {
  #h;
  #s;
  #l;
  #a;
  constructor(h = 0, s = 0, l = 0, a = 1) {
    super();
    if (typeof h === "number") {
      this.#h = toRadians(
        h < -360 ? -(h % Math.abs(360)) : h > 360 ? h % 360 : h
      );
    } else throw new TypeError("h is not a number");
    if (typeof s === "number") this.#s = Math.min(Math.max(s, -1), 1);
    else throw new TypeError("y is not a number");
    if (typeof l === "number") this.#l = Math.min(Math.max(l, -1), 1);
    else throw new TypeError("l is not a number");
    if (typeof a === "number") this.#a = Math.min(Math.max(a, 0), 1);
    else throw new TypeError("a is not a number");
  }

  /**
   * Returns the `hue` value of this colour
   * @returns {number} the `hue` value
   */
  getHue() {
    return toDegrees(this.#h);
  }

  /**
   * Returns the `saturation` value of this colour
   * @returns {number} the `saturation` value
   */
  getSaturation() {
    return this.#s;
  }

  /**
   * Returns the `lightness` value of this colour
   * @returns {number} the `lightness` value
   */
  getLightness() {
    return this.#l;
  }

  getAlpha() {
    return this.#a;
  }

  /**
   * Sets the `hue` value of this colour where the default value is 0.
   * `hue` lies in the closed range [-360, 360]
   * @returns {void}
   */
  setHue(h = 0) {
    if (typeof h === "number") {
      this.#h = toRadians(
        h < -360 ? -(h % Math.abs(360)) : h > 360 ? h % 360 : h
      );
    } else throw new TypeError("not a number");
  }

  /**
   * Sets the `saturation` value of this colour where the default value is 0.
   * `saturation` lies in the closed range [-1, 1]
   * @returns {void}
   */
  setSaturation(s = 0) {
    if (typeof s === "number") this.#s = Math.min(Math.max(s, -1), 1);
    else throw new TypeError("not a number");
  }

  /**
   * Sets the `lightness` value of this colour where the default value is 0.
   * `lightness` lies in the closed range [-1, 1]
   * @returns {void}
   */
  setLightness(l = 0) {
    if (typeof l === "number") this.#l = Math.min(Math.max(l, -1), 1);
    else throw new TypeError("not a number");
  }

  setAlpha(a = 0) {
    if (typeof a === "number") this.#a = Math.min(Math.max(a, 0), 1);
    else throw new TypeError("not a number");
  }

  #toRGBDegrees() {
    const h = this.#h / 60;
    const s = this.#s;
    const l = this.#l;
    const c = (1.0 - Math.abs(2.0 * l - 1.0)) * s;
    const x = c * (1.0 - Math.abs((h % 2) - 1));

    let r = 0.0;
    let g = 0.0;
    let b = 0.0;

    if (h >= 0.0 && h < 1.0) {
      r = c;
      g = x;
    } else if (h >= 1.0 && h < 2.0) {
      r = x;
      g = c;
    } else if (h >= 2.0 && h < 3.0) {
      g = c;
      b = x;
    } else if (h >= 3.0 && h < 4.0) {
      g = x;
      b = c;
    } else if (h >= 4.0 && h < 5.0) {
      r = x;
      b = c;
    } else if (h >= 5.0 && h < 6.0) {
      r = c;
      b = x;
    }

    const m = l - c / 2;
    r += m;
    g += m;
    b += m;

    return new RGBA(
      Math.floor(r * 255),
      Math.floor(g * 255),
      Math.floor(b * 255),
      this.#a
    );
  }

  toRGB() {
    const array = [this.#h, this.#s, this.#l, this.#a];
    const rgb = HSLA.#toLinearRGB(array);
    return linearTosRGB(
      new RGBA(rgb[0] * 0xff, rgb[1] * 0xff, rgb[2] * 0xff, rgb[3])
    );
  }

  /**
   * Converts a HSL colour to a colour in the linear RGB colour space
   * @param {number[]} hsla an array with all the components of a HSL colour including the alpha component
   * which is at the last index
   * @returns {number[]} returns an array of all the components of a colour in the linear RGB colour space including the alpha component
   * which is at the last index
   */
  static #toLinearRGB(hsla) {
    if (hsla[1] === 0) return [hsla[2], hsla[2], hsla[2], hsla[3]];
    const lum = hsla[2];
    const sat = hsla[1];
    let bb = 0;
    if (lum <= 0.5) bb = lum * (1.0 + sat);
    if (lum > 0.5) bb = lum + sat - lum * sat;
    const a = lum * 2 - bb;
    let hueval = hsla[0];
    if (hueval < 0) hueval = Math.PI * 2 - rem(-hueval, Math.PI * 2);
    if (hueval >= Math.PI * 2) hueval = rem(hueval, Math.PI * 2);
    const deg60 = Math.PI / 3;
    const deg240 = (Math.PI * 4) / 3;
    let hue = hueval + (Math.PI * 2) / 3;
    let hue2 = hueval - (Math.PI * 2) / 3;
    if (hue >= Math.PI * 2) hue = hue - Math.PI * 2;
    if (hue2 < 0) hue2 = hue2 + Math.PI * 2;
    const rgb = [a, a, a, hsla[3]];
    const hues = [hue, hueval, hue2];
    let i = 0;
    while (i < 3) {
      if (hues[i] < deg60) rgb[i] = a + ((bb - a) * hues[i]) / deg60;
      else if (hues[i] < Math.PI) rgb[i] = bb;
      else if (hues[i] < deg240) {
        rgb[i] = a + ((bb - a) * (deg240 - hues[i])) / deg60;
      }
      i = i + 1;
    }
    return rgb;
  }

  /**
   * Returns a string in the form that is compatible with css.
   * @returns {string} a string in the form `hsla(h, s, l, alpha)` where
   * `h` is in degrees, `s` and `l` are the percentage of their actual values
   */
  toString() {
    return `hsla(${toDegrees(this.#h)}deg, ${this.#s * 100}%, ${
      this.#l * 100
    }%, ${this.#a})`;
  }

  compareTo(c) {
    try {
      const self = this.toRGB().getColour();
      const i = c.toRGB().toInteger().getColour();
      return self < i ? -1 : self > i ? 1 : 0;
    } catch (e) {
      throw new TypeError("the argument is not a colour.");
    }
  }

  equals(c) {
    try {
      return this.compareTo(c) === 0;
    } catch (e) {
      return false;
    }
  }
}
class HSVA extends ColourInterface {
  #h;
  #s;
  #v;
  #a;
  constructor(h = 0, s = 0, v = 0, a = 1) {
    super();
    if (typeof h === "number") {
      this.#h = toRadians(
        h < -360 ? -(h % Math.abs(360)) : h > 360 ? h % 360 : h
      );
    } else throw new TypeError("h is not a number");
    if (typeof s === "number") this.#s = Math.min(Math.max(s, -1), 1);
    else throw new TypeError("y is not a number");
    if (typeof v === "number") this.#v = Math.min(Math.max(v, -1), 1);
    else throw new TypeError("v is not a number");
    if (typeof a === "number") this.#a = Math.min(Math.max(a, 0), 1);
    else throw new TypeError("a is not a number");
  }

  getHue() {
    return toDegrees(this.#h);
  }

  getSaturation() {
    return this.#s;
  }

  getValue() {
    return this.#v;
  }

  getAlpha() {
    return this.#a;
  }

  setHue(h = 0) {
    if (typeof h === "number") {
      this.#h = toRadians(
        h < -360 ? -(h % Math.abs(360)) : h > 360 ? h % 360 : h
      );
    } else throw new TypeError("not a number");
  }

  setSaturation(s = 0) {
    if (typeof s === "number") this.#s = Math.min(Math.max(s, -1), 1);
    else throw new TypeError("not a number");
  }

  setValue(v = 0) {
    if (typeof v === "number") this.#v = Math.min(Math.max(v, -1), 1);
    else throw new TypeError("not a number");
  }

  setAlpha(a = 0) {
    if (typeof a === "number") this.#a = Math.min(Math.max(a, 0), 1);
    else throw new TypeError("not a number");
  }

  #toRGBDegrees() {
    const h = this.#h / 60;
    const s = this.#s;
    const v = this.#v;
    const c = v * s;
    const x = c * (1.0 - Math.abs((h % 2) - 1));

    let r = 0.0;
    let g = 0.0;
    let b = 0.0;

    if (h >= 0.0 && h < 1.0) {
      r = c;
      g = x;
    } else if (h >= 1.0 && h < 2.0) {
      r = x;
      g = c;
    } else if (h >= 2.0 && h < 3.0) {
      g = c;
      b = x;
    } else if (h >= 3.0 && h < 4.0) {
      g = x;
      b = c;
    } else if (h >= 4.0 && h < 5.0) {
      r = x;
      b = c;
    } else if (h >= 5.0 && h < 6.0) {
      r = c;
      b = x;
    }

    const m = v - c;
    r += m;
    g += m;
    b += m;

    return new RGBA(
      Math.floor(r * 255),
      Math.floor(g * 255),
      Math.floor(b * 255),
      this.#a
    );
  }

  static #toLinearRGB(hsva) {
    let hue = hsva[0];
    const sat = hsva[1];
    const val = hsva[2];
    if (hue < 0) hue = Math.PI * 2 - rem(-hue, Math.PI * 2);
    if (hue >= Math.PI * 2) hue = rem(hue, Math.PI * 2);
    const hue60 = (hue * 3) / Math.PI;
    const hi = Math.floor(hue60);
    const f = hue60 - hi;
    const c = val * (1 - sat);
    const a = val * (1 - sat * f);
    const e = val * (1 - sat * (1 - f));
    if (hi === 0) return [val, e, c, hsva[3]];
    if (hi === 1) return [a, val, c, hsva[3]];
    if (hi === 2) return [c, val, e, hsva[3]];
    if (hi === 3) return [c, a, val, hsva[3]];
    if (hi === 4) return [e, c, val, hsva[3]];
    return [val, c, a, hsva[3]];
  }

  toRGB() {
    const rgb = HSVA.#toLinearRGB([this.#h, this.#s, this.#v, this.#a]);
    return linearTosRGB(
      new RGBA(rgb[0] * 0xff, rgb[1] * 0xff, rgb[2] * 0xff, rgb[3])
    );
  }

  toString() {
    return `hsva(${toDegrees(this.#h)}deg, ${this.#s * 100}%, ${
      this.#v * 100
    }%, ${this.#a})`;
  }

  compareTo(c) {
    try {
      const self = this.toRGB().getColour();
      const i = c.toRGB().toInteger().getColour();
      return self < i ? -1 : self > i ? 1 : 0;
    } catch (e) {
      throw new TypeError("the argument is not a colour.");
    }
  }

  equals(c) {
    try {
      return this.compareTo(c) === 0;
    } catch (e) {
      return false;
    }
  }
}
class HSIA extends ColourInterface {
  #h;
  #s;
  #i;
  #a;
  constructor(h = 0, s = 0, i = 0, a = 1) {
    super();
    if (typeof h === "number") this.#h = h < 0 ? 0 : h > 360 ? h % 360 : h;
    else throw new TypeError("h is not a number");
    if (typeof s === "number") this.#s = s < 0 ? 0 : s > 1 ? 1 : s;
    else throw new TypeError("y is not a number");
    if (typeof i === "number") this.#i = i < 0 ? 0 : i > 1 ? 1 : i;
    else throw new TypeError("i is not a number");
    if (typeof a === "number") this.#a = a < 0 ? 0 : a > 1 ? 1 : a;
    else throw new TypeError("a is not a number");
  }

  getHue() {
    return this.#h;
  }

  getSaturation() {
    return this.#s;
  }

  getIntensity() {
    return this.#i;
  }

  getAlpha() {
    return this.#a;
  }

  setHue(h = 0) {
    if (typeof h === "number") this.#h = h < 0 ? 0 : h > 360 ? 360 : h;
    else throw new TypeError("not a number");
  }

  setSaturation(s = 0) {
    if (typeof s === "number") this.#s = s < 0 ? 0 : s > 1 ? 1 : s;
    else throw new TypeError("not a number");
  }

  setIntegetIntensity(i = 0) {
    if (typeof i === "number") this.#i = i < 0 ? 0 : i > 1 ? 1 : i;
    else throw new TypeError("not a number");
  }

  setAlpha(a = 0) {
    if (typeof a === "number") this.#a = a < 0 ? 0 : a > 1 ? 1 : a;
    else throw new TypeError("not a number");
  }

  toRGB() {
    const h = this.#h / 60;
    const s = this.#s;
    const i = this.#i;
    const z = 1 - Math.abs((h % 2) - 1);
    const c = (3 * i * s) / (1 + z);
    const x = c * z;

    let r = 0.0;
    let g = 0.0;
    let b = 0.0;

    if (h >= 0.0 && h < 1.0) {
      r = c;
      g = x;
    } else if (h >= 1.0 && h < 2.0) {
      r = x;
      g = c;
    } else if (h >= 2.0 && h < 3.0) {
      g = c;
      b = x;
    } else if (h >= 3.0 && h < 4.0) {
      g = x;
      b = c;
    } else if (h >= 4.0 && h < 5.0) {
      r = x;
      b = c;
    } else if (h >= 5.0 && h < 6.0) {
      r = c;
      b = x;
    }

    const m = i * (1 - s);
    r += m;
    g += m;
    b += m;

    return new RGBA(
      Math.floor(r * 255),
      Math.floor(g * 255),
      Math.floor(b * 255),
      this.#a
    );
  }

  toString() {
    return `hsia(${this.#h}, ${this.#s * 100}%, ${this.#i * 100}%, ${this.#a})`;
  }

  compareTo(c) {
    try {
      const self = this.toRGB().getColour();
      const i = c.toRGB().toInteger().getColour();
      return self < i ? -1 : self > i ? 1 : 0;
    } catch (e) {
      throw new TypeError("the argument is not a colour.");
    }
  }

  equals(c) {
    try {
      return this.compareTo(c) === 0;
    } catch (e) {
      return false;
    }
  }
}
/**
 * Represents the rgb colour model where all components are
 * packed into a 32 bit integer. The red, green and blue
 * component maps to the successive 8 bits from the highest
 * and alpha component maps to the lowest 8 bits in the integer. \
 * This is a direct representative of css colour strings that
 * are in the form `#rrggbbaa`
 */
class Integer extends ColourInterface {
  #c;
  /**
   * Constructs an Integer colour from a 32 bit number.
   * @param {number} c a 32 bit number representing the RGB colour. If this value
   * is greater than `4,294,967,295` (32 bit unsigned), then it is pegged at
   * `4,294,967,295`.
   */
  constructor(c) {
    super();
    if (typeof c === "number") {
      this.#c = Math.floor(c > 0xff_ff_ff_ff ? 0xff_ff_ff_ff : c);
    } else throw new TypeError("c is not a number");
  }

  /**
   * Converts this object to a 32 bit number and returns it.
   * @returns {number} the current colour as a 32 bit number
   */
  getColour() {
    return this.#c;
  }

  getAlpha() {
    // return util.lo(this.#c, Math.max(getLength(this.#c) - 8, 0)) / 0xff;
    // return Number(
    //   util.lo(util.toBigInt(this.#c), Math.max(util.length(this.#c) - 8, 0)) /
    //   0xffn
    // );
    // return lo(this.#c, Math.max(length(this.#c) - 8, 0)) / 0xff;
    return lo(this.#c, 8) / 0xff;
  }

  /**
   * Sets this colour using a 32 bit number that represents an rgba colour
   * @param {number} c a 32 bit number containing info about the red,
   * green, blue and alpha components of this colour. the default is
   * an opaque white
   */
  setColour(c = 0xff) {
    this.#c = c < 0 ? 0 : c > 0xff_ff_ff_ff ? 0xff_ff_ff_ff : c;
  }

  setAlpha(a = 1.0) {
    this.#c =
      a < 0
        ? this.#c & 0xffffff00
        : a > 1
        ? 0xff_ff_ff_ff & this.#c
        : // : ((this.#c >>> 8) << 8) | Math.floor(a * 0xff)
          shiftLeft(shiftRight(this.#c, 8), 8) | Math.floor(a * 0xff);
  }

  toRGB() {
    // console.log("Integer.toString: ", this.toString())
    return new RGBA(
      // shiftRight(this.#c, 24),
      (this.#c >>> 24) & 0xff,
      // lo(shiftRight(this.#c, 16), 8),
      (this.#c >>> 16) & 0xff,
      // lo(shiftRight(this.#c, 8), 8),
      (this.#c >>> 8) & 0xff,
      this.getAlpha()
    );
  }

  toString() {
    let x = `${((this.#c >> 24) & 0xff).toString(16)}${(
      (this.#c >> 16) &
      0xff
    ).toString(16)}${((this.#c >> 8) & 0xff).toString(
      16
    )}${(this.#c & 0xff).toString(16)}`;
    return `#${chars("0", 8 - x.length)}${x}`;
  }

  compareTo(c) {
    try {
      const self = this.getColour();
      const i = c.toRGB().toInteger().getColour();
      return self < i ? -1 : self > i ? 1 : 0;
    } catch (e) {
      throw new TypeError("the argument is not a colour.");
    }
  }

  equals(c) {
    try {
      return this.compareTo(c) === 0;
    } catch (e) {
      return false;
    }
  }
}
//#region
class NamedColour extends ColourInterface {
  #name;
  constructor(name) {
    super();
    if (typeof name === "string") {
      const isValid =
        Object.keys(namedColors).filter((c) => c === name).length >= 1;
      if (isValid) this.#name = name;
      else throw new TypeError("unknown colour name");
    } else throw new TypeError("name is not a string");
  }

  getName() {
    return this.#name;
  }

  setName(n = this.#name) {
    try {
      const isValid =
        Object.keys(namedColors).filter((c) => c === n).length >= 1;
      if (isValid) this.#name = n;
      else throw new TypeError("unknown colour name");
    } catch (e) {
      throw new TypeError("n is not a string");
    }
  }

  getAlpha() {
    return 1;
  }

  setAlpha(a = 1) {}
  toRGB() {
    return new Integer(namedColors[this.#name]).toRGB();
  }

  toString() {
    return this.#name;
  }

  compareTo(c) {
    try {
      const self = namedColors[this.#name];
      const i = c.toRGB().toInteger().getColour();
      return self < i ? -1 : self > i ? 1 : 0;
    } catch (e) {
      throw new TypeError("the argument is not a colour.");
    }
  }

  equals(c) {
    try {
      return this.compareTo(c) === 0;
    } catch (e) {
      return false;
    }
  }
}
/**
 * An object that has all standard css colours as it's properties
 */
const namedColors = {
  aliceblue: 0xf0f8ffff,
  antiquewhite: 0xfaebd7ff,
  aqua: 0x00ffffff,
  aquamarine: 0x7fffd4ff,
  azure: 0xf0ffffff,
  beige: 0xf5f5dcff,
  bisque: 0xffe4c4ff,
  black: 0x000000ff,
  blanchedalmond: 0xffebcdff,
  blue: 0x0000ffff,
  blueviolet: 0x8a2be2ff,
  brown: 0xa52a2aff,
  burlywood: 0xa52a2aff,
  cadetblue: 0x5f9ea0ff,
  chartreuse: 0x7fff00ff,
  chocolate: 0xd2691eff,
  coral: 0xff7f50ff,
  cornflowerblue: 0x6495edff,
  cornsilk: 0xfff8dcff,
  crimson: 0xdc143cff,
  cyan: 0x00ffffff,
  darkblue: 0x00008bff,
  darkcyan: 0x008b8bff,
  darkgoldenrod: 0xb8860bff,
  darkgray: 0xa9a9a9ff,
  darkkhaki: 0xbdb76bff,
  darkmagenta: 0x8b008bff,
  darkolivegreen: 0x556b2fff,
  darkorange: 0xff8c00ff,
  darkorchid: 0x9932ccff,
  darkred: 0x8b0000ff,
  darksalmon: 0xe9967aff,
  darkseagreen: 0x8fbc8fff,
  darkslateblue: 0x483d8bff,
  darkslategray: 0x2f4f4fff,
  darkslategrey: 0x2f4f4fff,
  darkturquoise: 0x00ced1ff,
  darkviolet: 0x9400d3ff,
  deeppink: 0xff1493ff,
  deepskyblue: 0x00bfffff,
  dimgray: 0x696969ff,
  dimgrey: 0x696969ff,
  dodgerblue: 0x1e90ffff,
  firebrick: 0xb22222ff,
  floralwhite: 0xfffaf0ff,
  forestgreen: 0x228b22ff,
  fushia: 0xff00ffff,
  gainsboro: 0xdcdcdcff,
  ghostwhite: 0xf8f8ffff,
  gold: 0xffd700ff,
  goldenrod: 0xdaa520ff,
  green: 0x8000ff,
  greenyellow: 0xadff2fff,
  gray: 0x808080ff,
  grey: 0x808080ff,
  honeydew: 0xf0fff0ff,
  hotpink: 0xff69b4ff,
  indianred: 0xcd5c5cff,
  indigo: 0x4b0082ff,
  ivory: 0xfffff0ff,
  khaki: 0xf0e68cff,
  lavender: 0xe6e6faff,
  lavenderblush: 0xfff0f5ff,
  lawngreen: 0x7cfc00ff,
  lemonchiffon: 0xfffacdff,
  lightblue: 0xadd8e6ff,
  lightcoral: 0xf08080ff,
  lightcyan: 0xe0ffffff,
  lightgoldenrodyellow: 0xfafad2ff,
  lightgray: 0xd3d3d3ff,
  lightgreen: 0x90ee90ff,
  lightgrey: 0xd3d3d3ff,
  lightpink: 0xffb6c1ff,
  lightsalmon: 0xffa07aff,
  lightseagreen: 0x20b2aaff,
  lightskyblue: 0x87cefaff,
  lightslategray: 0x778899ff,
  lightslategrey: 0x778899ff,
  lightsteelblue: 0xb0c4deff,
  lightyellow: 0xffffe0ff,
  lime: 0x00ff00ff,
  limegreen: 0x32cd32ff,
  linen: 0xfaf0e6ff,
  magenta: 0xff00ffff,
  maroon: 0x800000ff,
  mediumaquamarine: 0x66cdaaff,
  mediumblue: 0x0000cdff,
  mediumorchid: 0xba55d3ff,
  mediumpurple: 0x9370dbff,
  mediumseagreen: 0x3cb371ff,
  mediumslateblue: 0x7b68eeff,
  mediumspringgreen: 0x00fa9aff,
  mediumturquoise: 0x48d1ccff,
  mediumvioletred: 0xc71585ff,
  midnightblue: 0x191970ff,
  mintcream: 0xf5fffaff,
  mistyrose: 0xffe4e1ff,
  moccasin: 0xffe4b5ff,
  navajowhite: 0xffdeadff,
  navy: 0x000080ff,
  oldlace: 0xfdf5e6ff,
  olive: 0x808000ff,
  olivedrab: 0x6b8e23ff,
  orange: 0xffa500ff,
  orangered: 0xff4500ff,
  orchid: 0xda70d6ff,
  palegoldenrod: 0xeee8aaff,
  palegreen: 0x98fb98ff,
  paleturquoise: 0xafeeeeff,
  palevioletred: 0xdb7093ff,
  papayawhip: 0xffefd5ff,
  peachpuff: 0xffdab9ff,
  peru: 0xcd853fff,
  pink: 0xffc0cbff,
  plum: 0xdda0ddff,
  powderblue: 0xb0e0e6ff,
  purple: 0x800080ff,
  teal: 0x8080ff,
  rebeccapurple: 0x663399ff,
  red: 0xff0000ff,
  rosybrown: 0xbc8f8fff,
  royalblue: 0x4169e1ff,
  saddlebrown: 0x8b4513ff,
  salmon: 0xfa8072ff,
  sandybrown: 0xf4a460ff,
  seagreen: 0x2e8b57ff,
  seashell: 0xfff5eeff,
  sienna: 0xa0522dff,
  silver: 0xc0c0c0ff,
  skyblue: 0x87ceebff,
  slateblue: 0x6a5acdff,
  slategray: 0x708090ff,
  slategrey: 0x708090ff,
  snow: 0xfffafaff,
  springgreen: 0x00ff7fff,
  steelblue: 0x4682b4ff,
  tan: 0xd2b48cff,
  thistle: 0xd8bfd8ff,
  tomato: 0xff6347ff,
  transparent: 0,
  turquoise: 0x40e0d0ff,
  violet: 0xee82eeff,
  wheat: 0xf5deb3ff,
  white: 0xffffffff,
  whitesmoke: 0xf5f5f5ff,
  yellow: 0xffff00ff,
  yellowgreen: 0x9acd32ff,
};
/**
 * Calculates and returns `a - floor(a / b) * b`
 * @param {number} a first argument
 * @param {number} b second argument
 * @returns {number} returns `a - floor(a / b) * b`
 */
function rem(a, b) {
  return a - Math.floor(a / b) * b;
}
/**
 * Duplicates the first argument the specified number of _n_ times
 * @param {string} char the string to be duplicated
 * @param {number} n the number of times that the string will be duplicated. values
 * less than or equal to `0` will return an empty string
 * @returns {string} returns the first argument duplicated the specified number of
 * times
 */
function chars(char, n) {
  return n <= 0 ? "" : `${char}${chars(char, n - 1)}`;
}
//for integers whose absolute value is < 2**(31) - 1
/**
 * Computes and returns the unsigned equivalent of the argument.
 * Note that all positive values will return the exact same value
 * as themselves.
 * @param {number} i a `number` argument
 * @returns {number} the unsigned equivalent of `i`.
 */
function toUnsigned(i) {
  if (i >= 0) {
    return i;
  }
  return Math.floor(i);
}
/**
 * Returns a value in which all the bits gpecified by the argument are 'on'
 * @param {number} n a number value as representing the number of bits to switch on
 * @returns {number} return _n_ number of `1` bits
 */
function on(n) {
  return Number.parseInt(chars("1", n), 2);
}
/**
 * Performs a left shift on the first argument with the second argument
 * specifying the shift distance
 * @param {number} i the value which is the object of the shift
 * @param {number} n the number of bits to shift. The default
 * value is `1`
 * @returns {number} returns the first argument shifted _n_ number of times to the left
 */
function shiftLeft(i, n = 1) {
  if (i === 0) return i;
  if (n > 32) return 0;
  if (n < 0) return shiftRight(i, Math.abs(n));
  if (i < 0) {
    const l = length(Math.abs(i));
    const mask = Number.parseInt(
      `${chars("1", 32 - l)}${Math.abs(i).toString(2)}`,
      2
    );
    let s = mask.toString(2);
    s = s.substring(n, s.length) + chars("0", n);
    // return shiftLeft(toUnsigned(i), n);
    return Number.parseInt(
      s.length > 32 ? s.substring(s.length - 32, s.length) : s,
      2
    );
  }
  let s = i.toString(2);
  return Number.parseInt(s + chars("0", n), 2);
}
/**
 * Performs a right shift on the first argument with the second argument
 * specifying the shift distance
 * @param {number} i the value which is the object of the shift
 * @param {number} n the number of bits to shift. The default
 * value is `1`
 * @returns {number} returns the first argument shifted _n_ number of times to the right
 */
function shiftRight(i, n = 1) {
  if (i === 0 || n === 0) return i;
  if (n > 32) return 0;
  if (n < 0) return shiftLeft(i, Math.abs(n));
  if (i < 0) {
    const l = length(i);
    if (n > l) return 0;
    const mask = Number.parseInt(
      `${chars("1", 32 - l)}${Math.abs(i).toString(2)}`,
      2
    );
    return Number.parseInt(mask.substring(0, n), 2);
    // return shiftRight(toUnsigned(i), n);
  }
  let s = i.toString(2);
  return Number.parseInt(s.substring(0, n), 2);
}
/**
 * Parses the argument to an integer
 * @param {bigint | string | number} i a numerical value
 * @returns { number } returns the argument parsed to a `number` type as an integer
 */
function toNumber(i) {
  return Number.parseInt(i.toString());
}
/**
 * Calculates and returns the bit length of the given number
 * @param {number | bigint | string} i the number value
 * @returns {number} returns the bit length of the argument
 */
function length(i) {
  if (typeof i === "string") {
    let n = toNumber(i);
    return n < 0 ? 32 : n.toString(2).length;
  }
  if (typeof i === "number") {
    return i < 0 ? 32 : i.toString(2).length;
  } else if (i === "bigint") {
    let l = 0;
    while (i !== 0n) {
      i = i >> 1;
      l++;
    }
    return l;
  }
  return 0;
}
/**
 * Returns the last _n_ low bits of the value
 * @param {number | bigint} i a number value
 * @param {number} n the number of low bits to be returned. The default
 * value is `1`
 * @returns {number} returns the _n_ low bits of the given number
 */
function lo(i, n = 1) {
  if (i === 0 || n <= 0 || n >= 32) return i;
  if (i < 0) {
    const l = length(i);
    const mask = Number.parseInt(
      `${chars("1", 32 - l)}${Math.abs(i).toString(2)}`,
      2
    );
    return Number.parseInt(mask.toString(2).substring(32 - n));
  }
  const s = i.toString(2);
  return Number.parseInt(s.substring(s.length - n, s.length), 2);
}
/**
 * Returns the first _n_ high bits of the value
 * @param {number | bigint} i a number value
 * @param {number} n the number of high bits to be returned. The default
 * value is `1`
 * @returns {number} returns the _n_ high bits of the given number
 */
function hi(i, n = 1) {
  if (i === 0 || n <= 0 || n >= 32) return i;
  if (i < 0) {
    const l = length(i);
    const mask = Number.parseInt(
      `${chars("1", 32 - l)}${Math.abs(i).toString(2)}`,
      2
    );
    return Number.parseInt(mask.toString(2).substring(n), 2);
  }
  const s = i.toString(2);
  return Number.parseInt(s.substring(0, n), 2);
}
/**
 * Parses the string argument which is expected to be a css colour string such as:
 * `#fff`, `#2affff0f`, `black`, `rgba(23, 21, 111, .5)`, `hsla(23deg, 21%, 60%, .5)`
 * @param {string} c a css colour string such as `#fff`
 * @returns {RGBA|Integer|NamedColour|HSLA|HSVA|CIEXYZA|HSIA} a colour object
 * equivalent to the argument
 */
function parseColour(c) {
  c = c.trim();
  if (/^#{1}[A-Za-z|\d]{3,8}$/i.test(c)) {
    let str = c.substring(c.indexOf("#") + 1);
    if (str.length === 3) {
      str = `${str[0]}${str[0]}${str[1]}${str[1]}${str[2]}${str[2]}ff`;
    } else if (str.length === 6) {
      str = `${str}ff`;
    }
    return new Integer(Number.parseInt(str, 16));
    // } else if (/^rgba\\\\(\d{1,3}\,\d{1,3}\,\d{1,3}\,\d{1}\.\d+\\\\)$/i.test(c)) {
  } else if (c.startsWith("rgba")) {
    const values = c
      .substring(c.indexOf("(") + 1, c.indexOf(")"))
      .split(",", 4);
    return new RGBA(
      Number.parseInt(values[0]),
      Number.parseInt(values[1]),
      Number.parseInt(values[2]),
      Number.parseFloat(values[3])
    );
    // } else if (/^rgb\\\\(\d{1,3}\,\d{1,3}\,\d{1,3}\\\\)$/i.test(c)) {
  } else if (c.startsWith("rgb")) {
    const values = c
      .substring(c.indexOf("(") + 1, c.indexOf(")"))
      .split(",", 3);
    return new RGBA(
      Number.parseInt(values[0]),
      Number.parseInt(values[1]),
      Number.parseInt(values[2]),
      1.0
    );
    // } else if (/^hsla\(\d{1,3}\,\d{1,3}\,\d{1,3}\,\d{1}\.\d+\)$/i.test(c)) {
  } else if (c.startsWith("hsla")) {
    const values = c
      .substring(c.indexOf("(") + 1, c.indexOf(")"))
      .split(",", 4);
    return new HSLA(
      Number.parseInt(values[0]),
      Number.parseInt(values[1]),
      Number.parseInt(values[2]),
      Number.parseFloat(values[3])
    );
    // } else if (/^hsl\(\d{1,3}\,\d{1,3}\,\d{1,3}\)$/i.test(c)) {
  } else if (c.startsWith("hsl")) {
    const values = c
      .substring(c.indexOf("(") + 1, c.indexOf(")"))
      .split(",", 3);
    return new HSLA(
      Number.parseInt(values[0]),
      Number.parseInt(values[1]),
      Number.parseInt(values[2]),
      1.0
    );
  } else if (/^[A-Za-z]*$/i.test(c)) {
    return new NamedColour(c);
  }
  return new NamedColour("black");
}
/**
 * Extracts the background color of the element
 * and returns it as a css colour string
 * @param {HTMLElement} element an element
 * @returns {string} a css colour string
 */
const getBgColour = (element) => {
  if (element.currentStyle) {
    return element.currentStyle.backgroundColor;
  } else if (window.getComputedStyle) {
    const es = window.getComputedStyle(element, "");
    if (es) {
      return es.getPropertyValue("background-color");
    }
  }
  return element.style.backgroundColor;
};
/**
 * Extracts the color of the element
 * and returns it as a css colour string
 * @param {HTMLElement} element an element
 * @returns {string} a css colour string
 */
const getColour = (element) => {
  if (element.currentStyle) {
    return element.currentStyle.color;
  } else if (window.getComputedStyle) {
    const es = window.getComputedStyle(element, "");
    if (es) {
      return es.getPropertyValue("color");
    }
  }
  return element.style.color;
};
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/**
 * Calculates and returns the luminance value of the rgb input colour.
 * This function has no side-effects (does not mutate the argument) but
 * simply returns a value.
 * @param {RGBA} rgb a `ColourInterface` object of type `RGBA`
 * @returns {number} returns a number from 0 (darkest) to 1 (brightest)
 * representing the luminance. Both values are inclusive in the range
 * for the function.
 */
function getLuminance(rgb) {
  return (
    sRGBtoLinearRGB(rgb.getRed() / 0xff) * 0.2126 +
    sRGBtoLinearRGB(rgb.getGreen() / 0xff) * 0.7152 +
    sRGBtoLinearRGB(rgb.getBlue() / 0xff) * 0.0722
  );
}
/**
 * Lines an sRGB colour space with the standard RGB model i.e
 * converts an sRGB component into linear RGB.
 * @param {number} component an sRGB component such red, green or blue.
 * Alpha values are not supported. It is assumed that this value
 * is normalised into the range [0, 1].
 * @returns {number} a `number` which is the exact linear
 * representation of the component.
 */
function sRGBtoLinearRGB(component) {
  return component <= 0.03928
    ? component / 12.92
    : Math.pow((component + 0.055) / 1.055, 2.4);
}
/**
 * Converts the given colour from sRGB to
 * linear RGB in the same colour space. This
 * is similar to but not exactly gamma recorrection.
 * @param {RGBA} rgba an `RGB` colour object that is
 * a sRGB
 * @returns {RGBA} an `RGBA` colour object which is
 * the linear RGB representation in the same space.
 */
function sToLinearRGB(rgba) {
  return new RGBA(
    sRGBtoLinearRGB(rgba.getRed() / 0xff) * 0xff,
    sRGBtoLinearRGB(rgba.getGreen() / 0xff) * 0xff,
    sRGBtoLinearRGB(rgba.getBlue() / 0xff) * 0xff,
    rgba.getAlpha()
  );
}
/**
 * Converts the component from linear RGB to sRGB
 * @param {number} component A RGB component i.e red/green/blue component
 * @returns {number} the sRGB equivalent of the given component in the same space
 */
function linearRGBTosRGB(component) {
  return component <= 0.0031308
    ? 12.92 * component
    : Math.pow(component, 1.0 / 2.4) * 1.055 - 0.055;
}
/**
 * Converts the given colour from linear RGB to
 * sRGB in the same colour space. This
 * is similar to but not exactly gamma recorrection.
 * @param {RGBA} rgba an `RGB` colour object that is
 * a linear RGB
 * @returns {RGBA} an `RGBA` colour object which is
 * the sRGB representation in the same space.
 */
function linearTosRGB(rgba) {
  return new RGBA(
    linearRGBTosRGB(rgba.getRed() / 0xff) * 0xff,
    linearRGBTosRGB(rgba.getGreen() / 0xff) * 0xff,
    linearRGBTosRGB(rgba.getBlue() / 0xff) * 0xff,
    rgba.getAlpha()
  );
}
/**
 * Applys gamma to the given colour component. It is recommended
 * that if this component argument is member of the sRGB space,
 * then it should be converted to the equivalent linear component
 * in the same space before the gamma application is done. After
 * which it can be converted back
 * @param {number} c a color component possibly RGB
 * @returns {number} the component after gamma application
 */
function gamma(c) {
  return Math.pow(c, 2.2);
}
/**
 * Recorrects and remove all gamma traces from the given component. It is recommended
 * that if this component argument is member of the sRGB space,
 * then it should be converted to the equivalent linear component
 * in the same space before the gamma removal is done. After
 * which it can be converted back
 * @param {number} c acolour component possibly a member of the RGB model
 * @returns {number} the argument after removal of it's gamma properties
 */
function removeGamma(c) {
  return Math.pow(c, 1 / 2.2);
}
/**
 * Applies gamma to the given sRGB colour and returns
 * the result. This method nas no side effects.
 * @param {RGBA} rgba a color in the sRGB space
 * @returns {RGBA} the argument after gamma application
 */
function gammaCorrect(rgba) {
  const l = sToLinearRGB(rgba);
  return linearTosRGB(
    new RGBA(
      gamma(l.getRed() / 0xff) * 0xff,
      gamma(l.getGreen() / 0xff) * 0xff,
      gamma(l.getBlue() / 0xff) * 0xff,
      rgba.getAlpha()
    )
  );
}
/**
 * Removes the gamma present in the given sRGB colour and returns
 * the result. This method nas no side effects.
 * @param {RGBA} rgba a color in the sRGB space
 * @returns {RGBA} the argument after gamma removal
 */
function gammaReCorrect(rgba) {
  const l = sToLinearRGB(rgba);
  return linearTosRGB(
    new RGBA(
      removeGamma(l.getRed() / 0xff) * 0xff,
      removeGamma(l.getGreen() / 0xff) * 0xff,
      removeGamma(l.getBlue() / 0xff) * 0xff,
      rgba.getAlpha()
    )
  );
}
/**
 * Calculates the contrast of the first argument against the second argument and
 * returns a number which is a representative of it's ratio of brightness between
 * the 2 colours, whereby both colours are in the sRGB colour space. The first
 * argument is representative of the background colour and the second is representative
 * of the foreground colour, although this method deos not consider their order. This
 * method mainly helps with readability of text and distinguishibity between colours
 * by partially visually impared people. \
 * \
 * According to
 * web accessibility standards, normal text (foreground colour) should have a colour
 * contrast (against its background) ratio of 4.3 and 7.1 for it's minimum standards
 * and best practices repectively and large text should have 3.0 and 4.3 for minimum
 * standards and best practices respectively.
 * @param {RGBA} rgb1 a `ColourInterface` of type `RGBA` representingthe background colour
 * @param {RGBA} rgb2 a `ColourInterface` of type `RGBA` representingthe foreground colour
 * @returns {number} returns a number representing the contrast ratio between the 2
 * colours. The max value returned by this
 * method will be 21.0
 */
function getContrastRatio(rgb1, rgb2) {
  const l1 = getLuminance(rgb1);
  const l2 = getLuminance(rgb2);
  // const brightest = Math.max(l1, l2);
  // const darkest = Math.min(l1, l2);
  // return (brightest + 0.05) / (darkest + 0.05);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}
/**
 * Calculates and returns the gray-scale value of the argument
 * i.e returns a colour whereby only white and black is present
 * and all other colours have been removed
 * @param {RGBA} rgb an `RGBA` colour object
 * @returns {RGBA} the argument's gray-scale value
 */
function getGrayScale(rgb) {
  return linearTosRGB(
    new RGBA(
      getLuminance(rgb) * 0xff,
      getLuminance(rgb) * 0xff,
      getLuminance(rgb) * 0xff,
      rgb.getAlpha()
    )
  );
}
/**
 * Blends both colours using a general blending algorithm and returns a final result
 * with the same opacity given by the alpha (last) argument. This method does not
 * have side-effects.
 * @param {RGBA} c1 an `RGBA` colour object in the sRGB space
 * @param {RGBA} c2 an `RGBA` colour object in the sRGB space
 * @param {number} scale a value in the range [0, 1] that determines the distance
 * this method will travel before a color is returned in the blend. This is because
 * in blending colours, several colours are possibly "skipped" and a single
 * point in the RGB space is achieved, meanwhile around such a point, several other
 * colours (some may not even be perceptible to the human eye) may look equally
 * similar because that are around the same point. This value helps this method pinpoint
 * a point in the RGB space. The default is 0.5
 * @param {number} alpha the opacity in the range of [0, 1] of the value to be returned.
 * The default is 1.
 * @returns {RGBA} a new RGB colour with the same alpha as the last argument
 * blended with both the first and second argument then scaled with the third argument.
 */
function blend(c1, c2, scale = 0.5, alpha = 1) {
  const l1 = sToLinearRGB(c1);
  const l2 = sToLinearRGB(c2);
  return linearTosRGB(
    new RGBA(
      (l1.getRed() / 0xff + (l2.getRed() / 0xff - l1.getRed() / 0xff) * scale) *
        0xff,
      (l1.getGreen() / 0xff +
        (l2.getGreen() / 0xff - l1.getGreen() / 0xff) * scale) *
        0xff,
      (l1.getBlue() / 0xff +
        (l2.getBlue() / 0xff - l1.getBlue() / 0xff) * scale) *
        0xff,
      alpha
    )
  );
}
/**
 * Mixes black with (shades) the given rgb colour and returns the result
 * with no side effects. The thickness of the black which the given colour
 * is mixed with is given by the second argument
 * @param {RGBA} rgb an `RGBA` colour object in
 * the sRGB space
 * @param {number} scale the factor by which the
 * first argument is blackened i.e the percentage
 * of black to add to it. Ranges from 0 (no darkening,
 * leave as is) to 1 (all black)
 * @returns {RGBA} the first argument shaded (i.e mixed
 * with black) with the percentage given in the
 * second argument
 */
function shade(rgb, scale = 0.2) {
  return blend(rgb, new RGBA(0, 0, 0, 1), scale);
}
/**
 * Shades the colour input and returns it. This method does
 * not mutate it's argument.
 * @param {HSLA} hsl a `HSLA` colour object
 * @param {number} scale the factor by which the shade occurs.
 * Small values provides lighter shades and large value provide
 * darker shades. A negative value causes a tint as specified by
 * {@link tintHSL}. Note that if the argument colour already has
 * a lightness of `0`, this colour cannot be further shaded.
 * The default is `0.1`
 * @returns {HSLA} the argument colour shaded using the scale argument
 * to scale up the shading.
 */
function shadeHSL(hsl, scale = 0.1) {
  return new HSLA(
    hsl.getHue(),
    hsl.getSaturation(),
    hsl.getLightness() - scale,
    hsl.getAlpha()
  );
}
/**
 * Mixes white with (tints) the given rgb colour and returns the result
 * with no side effects. The intensity of the white which the given colour
 * is mixed with is given by the second argument
 * @param {RGBA} rgb an `RGBA` colour object in
 * the sRGB space
 * @param {number} scale the factor by which the
 * first argument is whitened i.e the percentage
 * of white to add to it. Ranges from 0 (no whitening,
 * leave as is) to 1 (all white)
 * @returns {RGBA} the first argument tinted (i.e mixed
 * with white) with the percentage given in the
 * second argument
 */
function tint(rgb, scale = 1) {
  // aka tint
  return blend(rgb, new RGBA(0xff, 0xff, 0xff, 1), scale);
}
/**
 * Tints the colour input and returns it. This method does
 * not mutate it's argument.
 * @param {HSLA} hsl a `HSLA` colour object
 * @param {number} scale the factor by which the tint occurs.
 * Small values provides thinner tints and large value provide
 * thicker tints. A negative value causes a shade as specified by
 * {@link shadeHSL}. Note that if the argument colour already has
 * a lightness of `100`, this colour cannot be further tinted.
 * The default is `0.1`
 * @returns {HSLA} the argument colour shaded using the scale argument
 * to scale up the tinting.
 */
function tintHSL(hsl, scale = 0.1) {
  return new HSLA(
    hsl.getHue(),
    hsl.getSaturation(),
    hsl.getLightness() + scale,
    hsl.getAlpha()
  );
}
/**
 * Mixes gray with (tones) the given rgb colour and returns the result
 * with no side effects. The amount of the gray which the given colour
 * is mixed with is given by the second argument
 * @param {RGBA} rgb an `RGBA` colour object in
 * the sRGB space
 * @param {number} scale the factor by which the
 * first argument is toned i.e the percentage
 * of gray to add to it. Ranges from 0 (no toning,
 * leave as is) to 1 (all gray)
 * @returns {RGBA} the first argument toned i.e (mixed
 * with gray) with the percentage given in the
 * second argument
 */
function tone(rgb, scale = 1) {
  return blend(
    rgb,
    new RGBA(
      Math.floor(0xff * 0.5),
      Math.floor(0xff * 0.5),
      Math.floor(0xff * 0.5),
      1
    ),
    scale
  );
}
/**
 * Tones the colour input and returns it. This method does
 * not mutate it's argument.
 * @param {HSLA} hsl a `HSLA` colour object
 * @param {number} scale the factor by which the tone occurs.
 * Small values provides lighter tones and large value provide
 * darker tones. A negative value causes a reduction in tone.
 * Note that if the argument colour already has
 * a saturation of `100`, this colour cannot be further toned.
 * The default is `0.1`
 * @returns {HSLA} the argument colour toned using the scale argument
 * to scale up the toning.
 */
function toneHSL(hsl, scale = 0.1) {
  return new HSLA(
    hsl.getHue(),
    hsl.getSaturation() + scale,
    hsl.getLightness(),
    hsl.getAlpha()
  );
}
/**
 * Colourises the source colour with the destination colour
 * using general formulae and returns the result with no
 * side effects. The opacity of the secon argument is the
 * same as that of the returned colour.
 * @param {RGBA} src the source, an `RGBA` colour object in
 * the sRGB space
 * @param {RGBA} dst the destination, an `RGBA` colour object in
 * the sRGB space
 * @returns {RGBA} the first argument coloured with the second argument
 */
function colourise(src, dst) {
  return blend(new RGBA(0, 0, 0, 1), dst, getLuminance(src), dst.getAlpha());
}
/**
 * Calculates the inversion of the given rgb colour
 * @param {RGBA} rgb an RGB colour
 * @returns {RGBA} an `RGBA` object after
 * the values have been inverted.
 */
function invert(rgb) {
  function cycle(x, min = 0, max = 0xff) {
    if (x < min) {
      return max + x;
    } else if (x > max) {
      return x % max;
    }
    return x;
  }
  return new RGBA(
    cycle(0xff - rgb.getRed()),
    cycle(0xff - rgb.getGreen()),
    cycle(0xff - rgb.getBlue()),
    rgb.getAlpha()
  );
}
/**
 * Converts `x` from radians to degrees
 * @param {number} x an angle in radians
 * @returns {number} x in degrees
 */
function toDegrees(x) {
  return (180 / Math.PI) * x;
}
/**
 * Converts `x` from degrees to radians
 * @param {number} x an angle in degrees
 * @returns {number} x in radians
 */
function toRadians(x) {
  return (Math.PI / 180) * x;
}
/**
 * Computes the harmony of the given colour with the given hues, and returns an appropriate
 * colour with no side-effects.
 * @param {HSLA | HSVA | HSIA | number[]} hsl a colour that implements the method `getHue()` and `getSaturation()` (no-argument)
 * both of which returns a number in degrees in the range [0, 360]. This may be `HSLA`, `HSVLA`, `HSIA` classes
 * or an array consisting of values in their logical order: hue, saturation, light|value|intensity|blackness, alpha (no-arg)
 * whereby  hue is in degrees and the rest components are in the range [0, 1]
 * @param  {...number} values list of angles (in radians) to add to the hue of the argument
 * @returns {HSLA | HSVA | HSIA | number[]} returns the argument after computing a new hue for it using
 * the harmonise algorithm and returns an object or array. If the argument is an instance of `HSLA` or
 * `HSVA` or `HSIA` then an object that is an instance of the respective class is returned otherwise an array or null (illegal values) is returned
 */
function harmonise(hsl, ...values) {
  if (
    !(
      hsl instanceof HSLA ||
      hsl instanceof HSVA ||
      hsl instanceof HSIA ||
      Array.isArray(hsl)
    )
  ) {
    return null;
  }
  let hue = toRadians(!Array.isArray(hsl) ? hsl.getHue() : hsl[0]);
  for (let i = 0; i < values.length; i++) {
    const e = values[i];
    hue += e;
  }

  return hsl instanceof HSLA
    ? new HSLA(
        toDegrees(hue),
        hsl.getSaturation(),
        hsl.getLightness(),
        hsl.getAlpha()
      )
    : hsl instanceof HSVA
    ? new HSVA(
        toDegrees(hue),
        hsl.getSaturation(),
        hsl.getValue(),
        hsl.getAlpha()
      )
    : hsl instanceof HSIA
    ? new HSIA(
        toDegrees(hue),
        hsl.getSaturation(),
        hsl.getIntensity(),
        hsl.getAlpha()
      )
    : [toDegrees(hue), hsl[1], hsl[2], hsl[3]];
}
/**
 * Calculates and returns an array representing the input and the colours that are analogous
 * to this input argument in the colour wheel without side effects (does not
 * mutate it's argument(s)).
 * @param {HSLA | HSVA | HSIA | number[]} hsl a colour object. Please see {@link harmonise}
 * for details on this argument type.
 * @param {number} angle the angle (in radians) used to pinpoint the hue within the range of colours analoguous to
 * the argument. It's range is (-inf, (2 * PI) / 3] equivalent to (-inf, 120] in degrees. This the sector in the colour
 * wheel where all the colors of slightly different hues reside
 * @returns {HSLA[] | HSVA[] | HSIA[] | number[][]} returns an array of whereby the first
 * elements specified by `numOfColors` are the left side (right side, if the hue is greater
 * than 180) of the argument's hue, the very next element is the argument and the remaining
 * elements are the other side of the argument's hue on the colour wheel, i.e `[away from 0, hsl, towards 0]`
 */
function analogous(hsl, angle, numOfColors = 1) {
  angle = Math.min(Math.max(angle, 0), (Math.PI * 2) / 3);
  const range = angle / numOfColors;
  const colors = [hsl]
  let currentRangeB = 0;//the current range backwards
  let currentRangeF = 0;// the current range forwards
  for(let i = 1; i < numOfColors + 1; i++) {
    currentRangeB += (range / ((numOfColors + 1) - i))
    colors.unshift(harmonise(hsl, currentRangeB))
    currentRangeF += -(range / i)
    colors.push(harmonise(hsl, currentRangeF))
  }
  // return [hsl, harmonise(hsl, angle), harmonise(hsl, -angle)];
  return colors;
}
/**
 * Computes the an array representing the input and it's complement on the colour
 * wheel and returns the result along with the original colour without side-effects.
 * @param {HSLA | HSVA | HSIA | number[]} hsl a colour object. Please see {@link harmonise}
 * for details on this argument type.
 * @returns {HSLA[] | HSVA[] | HSIA[] | number[][]} returns an array of length 2 of the argument whereby the first is the input
 * and the second is the result. Please see {@link harmonise} for details on the return type of the element
 * of the array.
 */
function complement(hsl) {
  return [hsl, harmonise(hsl, Math.PI)];
}
/**
 * Computes the split-complement of the input colour on the colour wheel and returns the
 * the result along with the original colour without side-effects. The split complimetary
 * of a hue based color is a 'Y' shape, where the 2 "limbs" of the Y are the generated
 * colours and the "tail" of the Y is the current colour.
 * @param {HSLA | HSVA | HSIA | number[]} hsl an `HSLA` object. Please see {@link harmonise}
 * for details on this argument type.
 * @param {number} angle specifies the degree of the "limbs" of the 'Y'. i.e how farther apart
 * the "limbs" of the 'Y' are or the degree of the acute angle of the generated colors. The
 * default is `(Math.PI / 2) / 2` (45 degrees). This value may not be less than `0` (0 degrees)
 * and may not be greater than `Math.PI / 2` (90 degrees).
 * @returns {HSLA[] | HSVA[] | HSIA[] | number[][]} returns an array of length 3 of the argument whereby the first is the input
 * and the second and third is the result. Please see {@link harmonise} for details on the return type of the element
 * of the array.
 */
function splitComplement(hsl, angle = (Math.PI / 2) / 2) {
  angle = Math.min(Math.max(angle, 0), Math.PI / 2)
  return [
    hsl,
    harmonise(hsl, Math.PI - angle),
    harmonise(hsl, Math.PI + angle),
  ];
}
/**
 * Computes the triadic of the input colour on the colour wheel and returns the
 * the result along with the original colour without side-effects.
 * @param {HSLA | HSVA | HSIA | number[]} hsl an `HSLA` object. Please see {@link harmonise}
 * for details on this argument type.
 * @returns {HSLA[] | HSVA[] | HSIA[] | number[][]} returns an array of length 3 of the argument whereby the first is the input
 * and the second and third is the result. Please see {@link harmonise} for details on the return type of the element
 * of the array.
 */
function triadic(hsl) {
  return [
    hsl,
    harmonise(hsl, (2 * Math.PI) / 3),
    harmonise(hsl, (4 * Math.PI) / 3),
  ];
}
/**
 * Computes the an array representing the input and it's two-tone equivalent on the colour
 * wheel and returns the result along with the original colour without side-effects.
 * @param {HSLA | HSVA | HSIA | number[]} hsl a colour object. Please see {@link harmonise}
 * for details on this argument type.
 * @param {number} angle the angle (in radians) used to pinpoint the hue within the range of colours analoguous to
 * the argument. It's range is [-(Math.PI/2), Math.PI/2] equivalent to [-90, 90] in degrees.
 * @returns {HSLA[] | HSVA[] | HSIA[] | number[][]} returns an array of length 2 of the argument whereby the first is the input
 * and the second is the result. Please see {@link harmonise} for details on the return type of the element
 * of the array.
 */
function twoTone(hsl, angle) {
  return [hsl, harmonise(hsl, Math.min(Math.max(-(Math.PI / 2), angle), Math.PI / 2))];
}
/**
 * Computes the an array representing the input and it's off-complement equivalent on the colour
 * wheel and returns the result along with the original colour without side-effects.
 * @param {HSLA | HSVA | HSIA | number[]} hsl a colour object. Please see {@link harmonise}
 * for details on this argument type.
 * @param {number} angle the angle (in radians) used to pinpoint the hue within the range of colours analoguous to
 * the argument. It's range is [-Math.PI, -(Math.PI/2)] if negative and [Math.PI/2, Math.PI] if positive.
 * The degree equivalent is: [-180, -90] and [90, 180] respectively. The default is `(2 * Math.PI) / 3` (`120` degrees).
 * @returns {HSLA[] | HSVA[] | HSIA[] | number[][]} returns an array of length 2 of the argument whereby the first is the input
 * and the second is the result. Please see {@link harmonise} for details on the return type of the element
 * of the array.
 */
function offComplemetary(hsl, angle = (2 * Math.PI) / 3) {
  if (angle >= 0) {
    return [
      hsl,
      harmonise(hsl, Math.min(Math.max(Math.PI / 2, angle), Math.PI)),
    ];
  }
  return [
    hsl,
    harmonise(hsl, Math.min(Math.max(-Math.PI, angle), -(Math.PI / 2))),
  ];
}
/**
 * Computes the an array representing the input and it's double-complements equivalent on the colour
 * wheel and returns the result along with the original colour without side-effects.
 * @param {HSLA | HSVA | HSIA | number[]} hsl a colour object. Please see {@link harmonise}
 * for details on this argument type.
 * @param {number} angle the angle (in radians) used to pinpoint the hue within the range of colours analoguous to
 * the argument. It's range is [-Math.PI/2, Math.PI/2] for radians and [-90, 90].
 * @returns {HSLA[] | HSVA[] | HSIA[] | number[][]} returns an array of length 4 of the argument whereby the first is the input
 * and the second, third and fourth is the result. Please see {@link harmonise} for details on the return type of the element
 * of the array.
 */
function doubleComplemetary(hsl, angle) {
  angle = Math.min(Math.max(-(Math.PI / 2), angle), Math.PI / 2);
  return [
    hsl,
    harmonise(hsl, angle),
    harmonise(hsl, Math.PI),
    harmonise(hsl, Math.PI + angle),
  ];
}
/**
 * Computes the an array representing the input and it's teradic equivalents on the colour
 * wheel and returns the result along with the original colour without side-effects.
 * @param {HSLA | HSVA | HSIA | number[]} hsl a colour object. Please see {@link harmonise}
 * for details on this argument type.
 * @returns {HSLA[] | HSVA[] | HSIA[] | number[][]} returns an array of length 4 of the argument whereby the first is the input
 * and the second, third and fourth is the result. Please see {@link harmonise} for details on the return type of the element
 * of the array.
 */
function tetradic(hsl) {
  return doubleComplemetary(hsl, Math.PI / 2);
}
/**
 * Computes the specified number of monochrome colours (colours with the same hue)
 * within the argument.
 * @param {HSLA | HSVA | HSIA | number[]} hsl a colour object. Please see {@link harmonise}
 * for details on this argument type.
 * @param {number} n the length of the array to be returned i.e the number of components to return.
 * A `0` length returns an empty array
 * @param {number[]} alphas an array of alpha values (in the range [0, 1])
 * used to adjust the alpha component of each colour in the same index to
 * be returned whose length must be equal to the `n` argument. The default
 * is an empty array.
 * @param {number} angle the angle (in radians) representing the value
 * that subtends the circumference length of the colour wheel. Smaller
 * values returns colours with minimal diference.
 * Larger values return colours with maximum difference .
 * @returns {HSLA[] | HSVA[] | HSIA[] | number[][]} returns an array of colours as specified by the arguments. Please see
 * {@link harmonise} for details on the return type of the element
 * of the array.
 * @throws a `RangeError` if `n < 0` or if `alphas.length > 0 && alphas.length != n`
 */
function nColour(hsl, n, alphas = [], angle) {
  if (n < 0) throw new RangeError("n was negative");
  if (alphas.length > 0 && alphas.length !== n) {
    throw new RangeError(
      "alphas does not have the required number of elements. Use an empty array for all opaque colours."
    );
  }
  const values = [];
  for (let i = 0; i < n; i++) {
    const c = harmonise(hsl, ((i - 1) * (2 * Math.PI)) / (i === 0 ? 1 : i));
    if (c !== null || c !== undefined) {
      if (alphas[i] !== undefined && typeof alphas[i] === "number") {
        if (!Array.isArray(c)) c.setAlpha(alphas[i]);
        else c[3] = alphas[i];
      }
      values.push(c);
    }
  }
  return values;
}
/**
 * Computes the specified number of colours to the right of the argument colour on
 * the circumference of the colour wheel and returns all the result including the
 * input colour. This ca be used to return the entire colour wheel:
 * ````js
 * const hsl = new HSLA(0, 1, .5);//The colour red
 * cont num = 14;//number of colours to generate
 * const alphas = [];
 * let i = 0;
 * do {
 *  alphas.push(Math.random());
 * }while(++i < num);
 * //A revolution of the wheel with an interval
 * //of about 7.5 degrees per colour
 * const c = colours(hsl, num, alphas, Math.PI / 24);
 * //do what you want with the colours...
 * ````
 * The above code will generate the entire colour wheel
 * from the right of this colour.
 * @param {HSLA | HSVA | HSIA | number[]} hsl a colour object. Please see {@link harmonise}
 * for details on this argument type.
 * @param {number} n the length of the array to be returned i.e the number of components to return.
 * A `0` length returns an empty array
 * @param {number[]} alphas an array of alpha values (in the range [0, 1])
 * used to adjust the alpha component of each colour in the same index to
 * be returned whose length must be equal to the `n` argument. The default
 * is an empty array.
 * @param {number} angle the angle (in radians) representing the value
 * that subtends the circumference length of the colour wheel. Smaller
 * values returns colours with minimal diference and could all be in the
 * same temperature or even the same hue recognisable to the human eye.
 * Larger values return colours with max difference from cold to cool to
 * warm to hot colours on the wheel. The default is `π / 24`.
 * @returns {(HSLA | HSVA | HSIA | number[])[]} returns an array of colours as specified by the arguments. Please see
 * {@link harmonise} for details on the return type of the element
 * of the array.
 * @throws a `RangeError` if `n < 0` or if `alphas.length > 0 && alphas.length != n`
 */
function colours(hsl, n, alphas = [], angle = Math.PI / 24) {
  if (n < 0) throw new RangeError("n was negative");
  if (alphas.length > 0 && alphas.length !== n) {
    throw new RangeError(
      "alphas does not have the required number of elements. Use an empty array for all opaque colours."
    );
  }
  const values = [];
  let lastHue = angle;
  for (let i = 1; i <= n; i++) {
    const c = harmonise(hsl, lastHue);
    if (c !== null || c !== undefined) {
      if (alphas[i] !== undefined && typeof alphas[i] === "number") {
        if (!Array.isArray(c)) c.setAlpha(alphas[i]);
        else c[3] = alphas[i];
      }
      values.push(c);
      lastHue += angle;
    }
  }
  return values;
}
/**
 * Attempts to generate the entire colour wheel.
 * @param {number} aspc a value representing the angle of sector per colour in the
 * range[0, 2 * PI]. It's default is (2 * Math.PI) / 48.
 * @generator generates a color of the `HSLA` type.
 * @returns {Generator<HSLA, void>}
 */
function* generateWheel(aspc = (2 * Math.PI) / 48) {
  // default 7.5deg
  if (aspc <= 0)
    throw new RangeError(
      "angle of sector per colour (aspc) cannot be 0 or less"
    );
  const numOfSectors = Math.round(toDegrees((2 * Math.PI) / aspc));
  const baseRed = new HSLA(0, 1, 0.5); // RED
  const lastHue = aspc;
  let i = 0;
  do {
    i++;
    yield harmonise(baseRed, lastHue + aspc)[0];
  } while (i < numOfSectors);
}
