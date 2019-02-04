import * as styles from "./celResizer.css";

export default class CelResizer {
  public onPrepareForResize?: () => void;
  public onDelta?: (delta: number) => void;
  public onMouseUp?: () => void;

  private ownerType: "row" | "col";

  constructor(ownerType: "row" | "col") {
    this.ownerType = ownerType;

    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  public render(): HTMLDivElement {
    const r = document.createElement("div");
    r.classList.add(styles.resizer);
    r.classList.add(this.ownerType === "row" ? styles.row : styles.col);

    r.onmousedown = this.handleMouseDown.bind(this);

    return r;
  }

  private handleMouseDown(ev: MouseEvent) {
    if (this.onPrepareForResize) {
      this.onPrepareForResize();
    }

    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("mouseup", this.handleMouseUp);
  }

  private handleMouseMove(ev: MouseEvent) {
    if (this.onDelta) {
      const delta = this.ownerType === "row" ? ev.movementY : ev.movementX;
      this.onDelta(delta);
    }
  }

  private handleMouseUp(ev: MouseEvent) {
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mouseup", this.handleMouseUp);

    if (this.onMouseUp) {
      this.onMouseUp();
    }
  }
}
