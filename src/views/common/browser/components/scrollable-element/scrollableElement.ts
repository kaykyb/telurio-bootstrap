import ResizeObserver from "resize-observer-polyfill";
import styles from "./scrollableElement.css";

export default class ScrollableElement {
  private domElement?: HTMLDivElement;

  private contentContainer?: HTMLElement;

  private hScroll?: HTMLDivElement;
  private hScrollThumb?: HTMLDivElement;

  private vScroll?: HTMLDivElement;
  private vScrollThumb?: HTMLDivElement;

  private domElementResizeObserver?: ResizeObserver;
  private innerResizeObserver?: ResizeObserver;

  constructor(private inner: HTMLElement, private direction: "x" | "y" | "xy", private customSize?: string) {
    this.handleHorizontalScrollThumbUp = this.handleHorizontalScrollThumbUp.bind(this);
    this.handleHorizontalScrollThumbDown = this.handleHorizontalScrollThumbDown.bind(this);
    this.handleHorizontalScrollThumbDrag = this.handleHorizontalScrollThumbDrag.bind(this);
    this.handleVerticalScrollThumbUp = this.handleVerticalScrollThumbUp.bind(this);
    this.handleVerticalScrollThumbDown = this.handleVerticalScrollThumbDown.bind(this);
    this.handleVerticalScrollThumbDrag = this.handleVerticalScrollThumbDrag.bind(this);
    this.handleWheel = this.handleWheel.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  public render(): HTMLDivElement {
    this.domElement = document.createElement("div");
    this.domElement.classList.add(styles.scrollElement);

    // this.contentContainer = document.createElement("div");
    this.contentContainer = this.inner;
    const dirClass =
      this.direction === "xy" ? styles.scrollXY : this.direction === "x" ? styles.scrollX : styles.scrollY;
    this.contentContainer.classList.add(styles.container, dirClass);

    this.contentContainer.addEventListener("scroll", this.handleScroll);

    // this.contentContainer.appendChild(this.inner);
    this.domElement.appendChild(this.contentContainer);

    // insert horizontal scroll
    if (this.direction === "x" || this.direction === "xy") {
      this.insertHorizontalScroll(this.domElement);
    }

    // insert vertical scroll
    if (this.direction === "y" || this.direction === "xy") {
      this.insertVerticalScroll(this.domElement);
    }

    this.domElementResizeObserver = new ResizeObserver(entries => {
      this.updateScrolls();
    });
    this.domElementResizeObserver.observe(this.domElement);

    this.innerResizeObserver = new ResizeObserver(entries => {
      this.updateScrolls();
    });
    this.innerResizeObserver.observe(this.inner);

    new MutationObserver(mutations => {
      this.updateScrolls();
    }).observe(this.inner, {
      characterData: true,
      childList: true,
      subtree: true
    });

    this.updateScrolls();

    // this.domElement.addEventListener("wheel", this.handleWheel);

    return this.domElement;
  }

  private handleWheel(ev: WheelEvent) {
    if (!this.contentContainer) {
      return;
    }

    if (this.direction === "x") {
      return;
    }

    this.contentContainer.scrollTo(
      this.contentContainer.scrollLeft,
      this.contentContainer.scrollTop + ev.deltaY
    );
  }

  private handleHorizontalScrollThumbDown() {
    if (this.hScroll) {
      this.hScroll.classList.add(styles.scrolling);
      window.addEventListener("mousemove", this.handleHorizontalScrollThumbDrag);
      window.addEventListener("mouseup", this.handleHorizontalScrollThumbUp);
    }
  }

  private handleHorizontalScrollThumbDrag(event: MouseEvent) {
    if (this.contentContainer && this.hScroll && this.hScrollThumb) {
      const width = this.hScroll.offsetWidth;
      const scrollWidth = this.contentContainer.scrollWidth;

      this.contentContainer.scrollLeft += (event.movementX * scrollWidth) / width;
    }
  }

  private handleHorizontalScrollThumbUp() {
    if (this.hScroll) {
      this.hScroll.classList.remove(styles.scrolling);
    }
    window.removeEventListener("mousemove", this.handleHorizontalScrollThumbDrag);
    window.removeEventListener("mouseup", this.handleHorizontalScrollThumbUp);
  }

  private handleVerticalScrollThumbDown() {
    if (this.vScroll) {
      this.vScroll.classList.add(styles.scrolling);
      window.addEventListener("mousemove", this.handleVerticalScrollThumbDrag);
      window.addEventListener("mouseup", this.handleVerticalScrollThumbUp);
    }
  }

  private handleVerticalScrollThumbDrag(event: MouseEvent) {
    if (this.contentContainer && this.vScroll && this.vScrollThumb) {
      const height = this.vScroll.offsetHeight;
      const scrollHeight = this.contentContainer.scrollHeight;

      this.contentContainer.scrollTop += (event.movementY * scrollHeight) / height;
    }
  }

  private handleVerticalScrollThumbUp() {
    if (this.vScroll) {
      this.vScroll.classList.remove(styles.scrolling);
    }
    window.removeEventListener("mousemove", this.handleVerticalScrollThumbDrag);
    window.removeEventListener("mouseup", this.handleVerticalScrollThumbUp);
  }

  private handleScroll() {
    this.updateScrollsPosition();
  }

  private insertHorizontalScroll(insertIn: HTMLDivElement) {
    this.hScroll = document.createElement("div");
    this.hScrollThumb = document.createElement("div");

    this.hScroll.classList.add(styles.horizontalScrollTrack);
    this.hScrollThumb.classList.add(styles.horizontalScrollThumb);

    if (this.customSize) {
      this.hScroll.style.height = this.customSize;
    }

    this.hScrollThumb.addEventListener("mousedown", this.handleHorizontalScrollThumbDown);

    this.hScroll.appendChild(this.hScrollThumb);
    insertIn.appendChild(this.hScroll);
  }

  private insertVerticalScroll(insertIn: HTMLDivElement) {
    this.vScroll = document.createElement("div");
    this.vScrollThumb = document.createElement("div");

    this.vScroll.classList.add(styles.verticalScrollTrack);
    this.vScrollThumb.classList.add(styles.verticalScrollThumb);

    if (this.customSize) {
      this.vScroll.style.width = this.customSize;
    }

    this.vScrollThumb.addEventListener("mousedown", this.handleVerticalScrollThumbDown);

    this.vScroll.appendChild(this.vScrollThumb);
    insertIn.appendChild(this.vScroll);
  }

  private shouldShowHorizontalScroll(): boolean {
    if (this.contentContainer) {
      if (this.contentContainer.scrollWidth > this.contentContainer.offsetWidth) {
        return true;
      }
    }

    return false;
  }

  private shouldShowVerticalScroll(): boolean {
    if (this.contentContainer) {
      if (this.contentContainer.scrollHeight > this.contentContainer.offsetHeight) {
        return true;
      }
    }

    return false;
  }

  private updateHorizontalScroll() {
    if (this.contentContainer && this.hScroll && this.hScrollThumb) {
      if (this.shouldShowHorizontalScroll()) {
        // update visibility
        if (this.hScroll.classList.contains(styles.notVisible)) {
          this.hScroll.classList.remove(styles.notVisible);
        }

        // update sizes
        this.hScrollThumb.style.width =
          Math.pow(this.contentContainer.offsetWidth, 2) / this.contentContainer.scrollWidth + "px";
      } else {
        if (!this.hScroll.classList.contains(styles.notVisible)) {
          this.hScroll.classList.add(styles.notVisible);
        }
      }
    }
  }

  private updateVerticalScroll() {
    if (this.contentContainer && this.vScroll && this.vScrollThumb) {
      if (this.shouldShowVerticalScroll()) {
        // update visibility
        if (this.vScroll.classList.contains(styles.notVisible)) {
          this.vScroll.classList.remove(styles.notVisible);
        }

        // update sizes
        this.vScrollThumb.style.height =
          Math.pow(this.contentContainer.offsetHeight, 2) / this.contentContainer.scrollHeight + "px";
      } else {
        if (!this.vScroll.classList.contains(styles.notVisible)) {
          this.vScroll.classList.add(styles.notVisible);
        }
      }
    }
  }

  private updateScrolls() {
    this.updateHorizontalScroll();
    this.updateVerticalScroll();
  }

  private updateScrollsPosition() {
    if (
      (this.direction === "x" || this.direction === "xy") &&
      this.hScrollThumb &&
      this.hScroll &&
      this.contentContainer
    ) {
      this.hScrollThumb.style.left =
        (this.contentContainer.scrollLeft / this.contentContainer.scrollWidth) * this.hScroll.offsetWidth +
        "px";
    }

    if (
      (this.direction === "y" || this.direction === "xy") &&
      this.vScrollThumb &&
      this.vScroll &&
      this.contentContainer
    ) {
      this.vScrollThumb.style.top =
        (this.contentContainer.scrollTop / this.contentContainer.scrollHeight) * this.vScroll.offsetHeight +
        "px";
    }
  }
}
