class CcResizeComponent extends HTMLElement {
  constructor(component, modal) {
    super();
    this.component = component;
    this.modal = modal;
    
    this.raster = {x : 1, y: 1};

    this.mousemove = this.mousemove.bind(this);
    this.mouseup = this.mouseup.bind(this);

    document.body.appendChild(this);
  }

  connectedCallback() {
    var coord = getCoords (this.component);
    
    this.top = coord.top;
    this.left = coord.left;
    this.width = this.component.offsetWidth;
    this.height = this.component.offsetHeight;

    this.componentOffsetTop = coord.top - this.component.offsetTop;
    this.componentOffsetLeft = coord.left - this.component.offsetLeft;

    if (this.modal) {
      this.style.boxSizing = "border-box";
      this.style.top = "0px";
      this.style.left = "0px";
      this.style.bottom = "0px";
      this.style.right = "0px";
      this.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    } else {
      this.style.boxSizing = "border-box";
      this.style.top = (this.top) + "px";
      this.style.left = (this.left) + "px";
      this.style.width = (this.width) + "px";
      this.style.height = (this.height) + "px";
    }
    this.style.position = "absolute";
    this.style.zIndex = 99999;

    this.movestart = null;

    document.addEventListener('mousemove', this.mousemove, false);
    document.addEventListener('mouseup', this.mouseup, false);

    if (this.modal) {
      this.addEventListener("mousedown", (e) => {
        if (e.button != 0) {
          return;
        }
        this.parentElement.removeChild(this);
      });
    }

    this.border = document.createElement("div");
    this.border.style.border = "1px dashed red";
    this.border.style.position = "absolute";
    this.border.style.cursor = "move";
    this.border.style.boxSizing = "border-box";
    this.resizeborder();
    this.appendChild(this.border);

    this.label = document.createElement("div");
    this.label.style.bottom = "5px";
    this.label.style.left = "5px";
    this.label.style.right = "5px";
    this.label.style.top = "5px";
    this.label.style.position = "absolute";
    this.label.style.color = "rgba(128, 128, 128, 0.9)";
    this.label.style.overflow = "hidden";

    this.border.appendChild(this.label);

    this.border.addEventListener("mousedown", (e) => {
      if (e.button != 0) {
        return;
      }
      this.movestart = { x: e.clientX, y: e.clientY, pos: "m"};
      this.origheight = this.height;
      this.origwidth = this.width;
      this.origtop = this.top;
      this.origleft = this.left;
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
      this.movestart = { x: e.clientX, y: e.clientY, pos: "br"};
      this.origheight = this.height;
      this.origwidth = this.width;
      this.origtop = this.top;
      this.origleft = this.left;
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
      this.movestart = { x: e.clientX, y: e.clientY, pos: "tl"};
      this.origheight = this.height;
      this.origwidth = this.width;
      this.origtop = this.top;
      this.origleft = this.left;
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
      this.movestart = { x: e.clientX, y: e.clientY, pos: "tr"};
      this.origheight = this.height;
      this.origwidth = this.width;
      this.origtop = this.top;
      this.origleft = this.left;
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
      this.movestart = { x: e.clientX, y: e.clientY, pos: "bl"};
      this.origheight = this.height;
      this.origwidth = this.width;
      this.origtop = this.top;
      this.origleft = this.left;
      e.preventDefault();
      e.stopPropagation();
    });

    this.border.appendChild(this.bottomleft);

    this.tophandle = document.createElement("div");
    this.tophandle.style.top = "-5px";
    this.tophandle.style.left = "calc(50% - 5px)";
    this.tophandle.style.width = "10px";
    this.tophandle.style.height = "10px";
    this.tophandle.style.border = "1px solid #808080";
    this.tophandle.style.backgroundColor = "#c0c0c0";
    this.tophandle.style.position = "absolute";
    this.tophandle.style.cursor = "ns-resize";

    this.tophandle.addEventListener("mousedown", (e) => {
      if (e.button != 0) {
        return;
      }
      this.movestart = { x: e.clientX, y: e.clientY, pos: "t"};
      this.origheight = this.height;
      this.origwidth = this.width;
      this.origtop = this.top;
      this.origleft = this.left;
      e.preventDefault();
      e.stopPropagation();
    });

    this.border.appendChild(this.tophandle);

    this.lefthandle = document.createElement("div");
    this.lefthandle.style.top = "calc(50% - 5px)";
    this.lefthandle.style.left = "-5px";
    this.lefthandle.style.width = "10px";
    this.lefthandle.style.height = "10px";
    this.lefthandle.style.border = "1px solid #808080";
    this.lefthandle.style.backgroundColor = "#c0c0c0";
    this.lefthandle.style.position = "absolute";
    this.lefthandle.style.cursor = "ew-resize";

    this.lefthandle.addEventListener("mousedown", (e) => {
      if (e.button != 0) {
        return;
      }
      this.movestart = { x: e.clientX, y: e.clientY, pos: "l"};
      this.origheight = this.height;
      this.origwidth = this.width;
      this.origtop = this.top;
      this.origleft = this.left;
      e.preventDefault();
      e.stopPropagation();
    });

    this.border.appendChild(this.lefthandle);


    this.bottomhandle = document.createElement("div");
    this.bottomhandle.style.bottom = "-5px";
    this.bottomhandle.style.left = "calc(50% - 5px)";
    this.bottomhandle.style.width = "10px";
    this.bottomhandle.style.height = "10px";
    this.bottomhandle.style.border = "1px solid #808080";
    this.bottomhandle.style.backgroundColor = "#c0c0c0";
    this.bottomhandle.style.position = "absolute";
    this.bottomhandle.style.cursor = "ns-resize";

    this.bottomhandle.addEventListener("mousedown", (e) => {
      if (e.button != 0) {
        return;
      }
      this.movestart = { x: e.clientX, y: e.clientY, pos: "b"};
      this.origheight = this.height;
      this.origwidth = this.width;
      this.origtop = this.top;
      this.origleft = this.left;
      e.preventDefault();
      e.stopPropagation();
    });

    this.border.appendChild(this.bottomhandle);

    this.righthandle = document.createElement("div");
    this.righthandle.style.top = "calc(50% - 5px)";
    this.righthandle.style.right = "-5px";
    this.righthandle.style.width = "10px";
    this.righthandle.style.height = "10px";
    this.righthandle.style.border = "1px solid #808080";
    this.righthandle.style.backgroundColor = "#c0c0c0";
    this.righthandle.style.position = "absolute";
    this.righthandle.style.cursor = "ew-resize";
    this.righthandle.addEventListener("mousedown", (e) => {
      if (e.button != 0) {
        return;
      }
      this.movestart = { x: e.clientX, y: e.clientY, pos: "r"};
      this.origheight = this.height;
      this.origwidth = this.width;
      this.origtop = this.top;
      this.origleft = this.left;
      e.preventDefault();
      e.stopPropagation();
    });

    this.border.appendChild(this.righthandle);
  }

  disconnectedCallback() {
    document.removeEventListener('mousemove', this.mousemove);
    document.removeEventListener('mouseup', this.mouseup);
  }

  mouseup (e) {
    if (e.button != 0) {
      return;
    }
    if (this.movestart) {
      this.dispatchEvent(new CustomEvent("finished", {detail: {}}));
    }
    this.movestart = null;
  }

  mousemove (e) {
    if (this.movestart) {
      switch (this.movestart.pos) {
        case "br":
          this.height = rasterize(this.origheight + (e.clientY - this.movestart.y), this.raster.y, this.top - this.componentOffsetTop);
          this.width = rasterize(this.origwidth + (e.clientX - this.movestart.x), this.raster.x, this.left - this.componentOffsetLeft);
          break;
        case "r":
          this.width = rasterize(this.origwidth + (e.clientX - this.movestart.x), this.raster.x, this.left - this.componentOffsetLeft);
          break;
        case "b":
          this.height = rasterize(this.origheight + (e.clientY - this.movestart.y), this.raster.y, this.top - this.componentOffsetTop);
          break;
        case "tl":
          this.top = rasterize(this.origtop + (e.clientY - this.movestart.y), this.raster.y, 0 - this.componentOffsetTop);
          this.left = rasterize(this.origleft + (e.clientX - this.movestart.x), this.raster.x, 0 - this.componentOffsetLeft);
          this.height = this.origheight - (this.top - this.origtop);
          this.width = this.origwidth - (this.left - this.origleft);
          break;
        case "t":
          this.top = rasterize(this.origtop + (e.clientY - this.movestart.y), this.raster.y, 0 - this.componentOffsetTop);
          this.height = this.origheight - (this.top - this.origtop);
          break;
        case "l":
          this.left = rasterize(this.origleft + (e.clientX - this.movestart.x), this.raster.x, 0 - this.componentOffsetLeft);
          this.width = this.origwidth - (this.left - this.origleft);
          break;
        case "tr":
          this.top = rasterize(this.origtop + (e.clientY - this.movestart.y), this.raster.y, 0 - this.componentOffsetTop);
          this.height = this.origheight - (this.top - this.origtop);
          this.width = rasterize(this.origwidth + (e.clientX - this.movestart.x), this.raster.x, this.left - this.componentOffsetLeft);
          break;
        case "bl":
          this.left = rasterize(this.origleft + (e.clientX - this.movestart.x), this.raster.x, 0 - this.componentOffsetLeft);
          this.width = this.origwidth - (this.left - this.origleft);
          this.height = rasterize(this.origheight + (e.clientY - this.movestart.y), this.raster.y, this.top - this.componentOffsetTop);
          break;
        case "m":
          this.top = rasterize(this.origtop + (e.clientY - this.movestart.y), this.raster.y, 0 - this.componentOffsetTop);
          this.left = rasterize(this.origleft + (e.clientX - this.movestart.x), this.raster.x, 0 - this.componentOffsetLeft);
          break;
      }
      // this.movestart.x = e.clientX;
      // this.movestart.y = e.clientY;

      this.resizeborder();
      this.dispatchEvent(new CustomEvent("resized", {detail: {top: this.top - this.componentOffsetTop, left: this.left - this.componentOffsetLeft, width: this.width, height: this.height}}));
    }
  }

  resizeborder() {
    if (this.modal) {
      this.border.style.top = this.top + "px";
      this.border.style.left = this.left + "px";
      this.border.style.width = this.width + "px";
      this.border.style.height = this.height + "px";
    } else {
      this.style.top = (this.top - 20) + "px";
      this.style.left = (this.left - 20) + "px";
      this.style.width = (this.width + 40) + "px";
      this.style.height = (this.height + 40) + "px";
      this.border.style.top = "20px";
      this.border.style.left = "20px";
      this.border.style.right = "20px";
      this.border.style.bottom = "20px";
    }

    if (this.label) {
//      this.label.innerHTML = "Top:&nbsp;" + this.componentOffsetTop + ", Left:&nbsp;" + this.componentOffsetLeft + "<br>Width:&nbsp;" + this.width + ", Height:&nbsp;" + this.height;
    }
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

function rasterize (x, step, offset) {
  if (step == 1) {
    return x;
  }
  var mod = (x + offset) % step;
  if (mod == 0) {
    return x;
  }
  if (mod < step / 2) {
    return x - mod;
  }
  return x + (step - mod);
}
