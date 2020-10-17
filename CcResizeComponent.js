class CcResizeComponent extends HTMLElement {
  constructor(component) {
    super();
    this.component = component;
    document.body.appendChild(this);
  }

  connectedCallback() {
    var coord = getCoords (this.component);
    
    this.top = coord.top;
    this.left = coord.left;
    this.width = this.component.offsetWidth;
    this.height = this.component.offsetHeight;

    this.style.top = "0px";
    this.style.left = "0px";
    this.style.bottom = "0px";
    this.style.right = "0px";
    this.style.position = "absolute";

    this.mouse = {x: 0, y: 0};
    this.movestart = null;

    this.addEventListener('mousemove', (e) => {
      var coord = getCoords(e.target);
      this.mouse.x = e.offsetX + coord.left;
      this.mouse.y = e.offsetY + coord.top;


      if (this.movestart) {
        switch (this.movestart.pos) {
          case "br":
            this.height += this.mouse.y - this.movestart.y;
            this.width += this.mouse.x - this.movestart.x;
            break;
          case "tl":
            this.top += this.mouse.y - this.movestart.y;
            this.left += this.mouse.x - this.movestart.x;
            this.height -= this.mouse.y - this.movestart.y;
            this.width -= this.mouse.x - this.movestart.x;
            break;
          case "tr":
            this.top += this.mouse.y - this.movestart.y;
            this.height -= this.mouse.y - this.movestart.y;
            this.width += this.mouse.x - this.movestart.x;
            break;
          case "bl":
            this.left += this.mouse.x - this.movestart.x;
            this.width -= this.mouse.x - this.movestart.x;
            this.height += this.mouse.y - this.movestart.y;
            break;
          case "m":
            this.top += this.mouse.y - this.movestart.y;
            this.left += this.mouse.x - this.movestart.x;
            break;
        }
        this.movestart.x = this.mouse.x;
        this.movestart.y = this.mouse.y;

        this.resizeborder();
        this.dispatchEvent(new CustomEvent("resized", {detail: {top: this.top, left: this.left, width: this.width, height: this.height}}));
      }
    }, false);

    this.addEventListener('mouseup', (e) => {
      if (e.button != 0) {
        return;
      }
      this.movestart = null;
    }, false);

    this.addEventListener("mousedown", (e) => {
      if (e.button != 0) {
        return;
      }
      this.parentElement.removeChild(this);
    });

    this.border = document.createElement("div");
    this.border.style.border = "1px dashed red";
    this.border.style.position = "absolute";
    this.border.style.cursor = "move";
    this.resizeborder();
    this.appendChild(this.border);

    this.border.addEventListener("mousedown", (e) => {
      if (e.button != 0) {
        return;
      }
      this.movestart = { x: this.mouse.x, y: this.mouse.y, pos: "m"};
      e.preventDefault();
      e.stopPropagation();
    });

    this.bottomright = document.createElement("div");
    this.bottomright.style.bottom = "-5px";
    this.bottomright.style.right = "-5px";
    this.bottomright.style.width = "10px";
    this.bottomright.style.height = "10px";
    this.bottomright.style.border = "1px solid #808080";
    this.bottomright.style.backgroundColor = "#c0c0c0";
    this.bottomright.style.position = "absolute";
    this.bottomright.style.cursor = "nwse-resize";

    this.bottomright.addEventListener("mousedown", (e) => {
      if (e.button != 0) {
        return;
      }
      this.movestart = { x: this.mouse.x, y: this.mouse.y, pos: "br"};
      e.preventDefault();
      e.stopPropagation();
    });

    this.border.appendChild(this.bottomright);

    this.topleft = document.createElement("div");
    this.topleft.style.top = "-5px";
    this.topleft.style.left = "-5px";
    this.topleft.style.width = "10px";
    this.topleft.style.height = "10px";
    this.topleft.style.border = "1px solid #808080";
    this.topleft.style.backgroundColor = "#c0c0c0";
    this.topleft.style.position = "absolute";
    this.topleft.style.cursor = "nwse-resize";

    this.topleft.addEventListener("mousedown", (e) => {
      if (e.button != 0) {
        return;
      }
      this.movestart = { x: this.mouse.x, y: this.mouse.y, pos: "tl"};
      e.preventDefault();
      e.stopPropagation();
    });

    this.border.appendChild(this.topleft);

    this.topright = document.createElement("div");
    this.topright.style.top = "-5px";
    this.topright.style.right = "-5px";
    this.topright.style.width = "10px";
    this.topright.style.height = "10px";
    this.topright.style.border = "1px solid #808080";
    this.topright.style.backgroundColor = "#c0c0c0";
    this.topright.style.position = "absolute";
    this.topright.style.cursor = "nesw-resize";

    this.topright.addEventListener("mousedown", (e) => {
      if (e.button != 0) {
        return;
      }
      this.movestart = { x: this.mouse.x, y: this.mouse.y, pos: "tr"};
      e.preventDefault();
      e.stopPropagation();
    });

    this.border.appendChild(this.topright);

    this.bottomleft = document.createElement("div");
    this.bottomleft.style.bottom = "-5px";
    this.bottomleft.style.left = "-5px";
    this.bottomleft.style.width = "10px";
    this.bottomleft.style.height = "10px";
    this.bottomleft.style.border = "1px solid #808080";
    this.bottomleft.style.backgroundColor = "#c0c0c0";
    this.bottomleft.style.position = "absolute";
    this.bottomleft.style.cursor = "nesw-resize";

    this.bottomleft.addEventListener("mousedown", (e) => {
      if (e.button != 0) {
        return;
      }
      this.movestart = { x: this.mouse.x, y: this.mouse.y, pos: "bl"};
      e.preventDefault();
      e.stopPropagation();
    });

    this.border.appendChild(this.bottomleft);
  }

  resizeborder() {
    this.border.style.top = this.top + "px";
    this.border.style.left = this.left + "px";
    this.border.style.width = this.width + "px";
    this.border.style.height = this.height + "px";
  }
}

window.customElements.define("cc-resize-component", CcResizeComponent);

function getCoords(elem) { // crossbrowser version
  var box = elem.getBoundingClientRect();

  var body = document.body;
  var docEl = document.documentElement;

  var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

  var clientTop = docEl.clientTop || body.clientTop || 0;
  var clientLeft = docEl.clientLeft || body.clientLeft || 0;

  var top  = box.top +  scrollTop - clientTop;
  var left = box.left + scrollLeft - clientLeft;

  return { top: Math.round(top), left: Math.round(left) };
}