let g_CcDividerCounter = 0;

class CcDivider extends HTMLElement {
  constructor() {
    super();
    this.horizontal = true;

    this.minSize1 = 0;
    this.minSize2 = 0;
    this.maxSize1 = 0;
    this.maxSize2 = 0;

    this.dividerSize = 10;

    this.dividerImage = null;

    this.size1 = -1;


    this.mousemove = this.mousemove.bind(this);
    this.mouseup = this.mouseup.bind(this);
    this.resizehandler = this.resizehandler.bind(this);

    this.divider = null;
    this.dividerCounter = g_CcDividerCounter++;
  }

  connectedCallback() {
    this.style.display = "block";
    this.style.width = "100%";
    this.style.height = "100%";
    this.style.position = "relative";

    document.addEventListener('mousemove', this.mousemove, false);
    document.addEventListener('mouseup', this.mouseup, false);
    document.addEventListener('cc-divider-resize', this.resizehandler, false);

    if (this.getAttribute("horizontal") === "true") {
      this.horizontal = true;
    } else if (this.getAttribute("horizontal") === "false") {
      this.horizontal = false;
    } else if (this.getAttribute("vertical") === "true") {
      this.horizontal = true;
    } else if (this.getAttribute("vertical") === "false") {
      this.horizontal = false;
    } else if (this.getAttribute("horizontal") !== null) {
      this.horizontal = true;
    } else if (this.getAttribute("vertical") !== null ) {
      this.horizontal = false;
    }

    setTimeout(() => {
      this.refresh();
    }, 1);
  }

  disconnectedCallback() {
    document.removeEventListener('mousemove', this.mousemove);
    document.removeEventListener('mouseup', this.mouseup);
    document.removeEventListener('cc-divider-resize', this.resizehandler, false);
  }

  refresh() {
    if (this.size1 == -1) {
      if (this.horizontal) {
        this.size1 = parseInt((this.offsetHeight - this.dividerSize) / 2);
        this.size2 = this.offsetHeight - (this.size1 + this.dividerSize)
      } else {
        this.size1 = parseInt((this.offsetWidth - this.dividerSize) / 2);
        this.size2 = this.offsetWidth - (this.size1 + this.dividerSize)
      }
      this.fixSizes();
    }
    if (!this.divider) {
      for(var i = this.childNodes.length - 1; i >= 0; i--) {
        if (this.childNodes[i].nodeName == "#text") {
          this.removeChild(this.childNodes[i]);
        }
      }
      while(this.childNodes.length < 2) {
        this.appendChild(document.createElement("div"));
      }
      while(this.childNodes.length > 2) {
        this.removeChild(this.childNodes[this.childNodes.length - 1]);
      }
      this.divider = document.createElement("div");
      this.divider.style.position = "absolute";
      this.divider.style.top = "0px";
      this.divider.style.left = "0px";
      this.divider.style.cursor = this.horizontal ? "ns-resize" : "ew-resize";
      if (this.dividerImage) {
        this.divider.style.background = this.dividerImage;
      } else {
        this.divider.style.backgroundColor = "#ccc";
      }
      this.appendChild(this.divider);


      this.divider.addEventListener("mousedown", (e) => {
        if (e.button != 0) {
          return;
        }
        this.movestart = { x: e.clientX, y: e.clientY};
        this.origsize1 = this.size1;
        e.preventDefault();
        e.stopPropagation();
      });

      this.childNodes[0].style.position = "absolute";
      this.childNodes[0].style.overflow = "hidden";

      this.childNodes[1].style.position = "absolute";
      this.childNodes[1].style.overflow = "hidden";
    }

    if (this.dividerImage) {
      this.divider.style.background = "url(" + this.dividerImage + ")";
    }

    if (this.horizontal) {
      this.divider.style.right = "0px";
      this.divider.style.height = (this.dividerSize) + "px";
      this.divider.style.top = (this.size1) + "px";

      this.childNodes[0].style.top = "0px";
      this.childNodes[0].style.left = "0px";
      this.childNodes[0].style.right = "0px";
      this.childNodes[0].style.height = (this.size1) + "px";

      this.childNodes[1].style.bottom = "0px";
      this.childNodes[1].style.left = "0px";
      this.childNodes[1].style.right = "0px";
      this.childNodes[1].style.height = (this.size2) + "px";
    } else {
      this.divider.style.bottom = "0px";
      this.divider.style.width = (this.dividerSize) + "px";
      this.divider.style.left = (this.size1) + "px";

      this.childNodes[0].style.top = "0px";
      this.childNodes[0].style.left = "0px";
      this.childNodes[0].style.bottom = "0px";
      this.childNodes[0].style.width = (this.size1) + "px";

      this.childNodes[1].style.top = "0px";
      this.childNodes[1].style.right = "0px";
      this.childNodes[1].style.bottom = "0px";
      this.childNodes[1].style.width = (this.size2) + "px";
    }
  }

  resizehandler (e) {
    if (e.detail.dividerCounter == this.dividerCounter) {
      return;
    }
    this.fixSizes();
    this.refresh();
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
      if (this.horizontal) {
        this.size1 = this.origsize1 + (e.clientY - this.movestart.y);
        this.size2 = this.offsetHeight - (this.size1 + this.dividerSize)
      } else {
        this.size1 = this.origsize1 + (e.clientX - this.movestart.x);
        this.size2 = this.offsetWidth - (this.size1 + this.dividerSize)
      }

      this.fixSizes();

      this.refresh();
      this.dispatchEvent(new CustomEvent("resized", {detail: {size1: this.size1, size2: this.size2}}));
      document.dispatchEvent(new CustomEvent("cc-divider-resize", {detail: {size1: this.size1, size2: this.size2, dividerCounter: this.dividerCounter}}));
    }
  }

  fixSizes() {
    var max = this.horizontal ? this.offsetHeight : this.offsetWidth;

    if (this.size2 < this.minSize2) {
      this.size2 = this.minSize2;
      this.size1 = max - (this.size2 + this.dividerSize)
    } else if (this.maxSize2 > 0 && this.size2 > this.maxSize2) {
      this.size2 = this.maxSize2;
      this.size1 = max - (this.size2 + this.dividerSize)
    }

    if (this.size1 < this.minSize1) {
      this.size1 = this.minSize1;
    } else if (this.maxSize1 > 0 && this.size1 > this.maxSize1) {
      this.size1 = this.maxSize1;
    }
    this.size2 = max - (this.size1 + this.dividerSize)

    if (this.size2 < 0) {
      this.size2 = 0;
      this.size1 = max - (this.size2 + this.dividerSize)
    }
  }
}

window.customElements.define("cc-divider", CcDivider);
