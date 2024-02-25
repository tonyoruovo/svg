
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
      global.$primitives$[pr.value || "neutral"].md(e);
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
    global.$primitives$[pr.value || "neutral"].mu(e);
  
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
      global.$primitives$[pr.value || "neutral"].mm(e);
    }
  }