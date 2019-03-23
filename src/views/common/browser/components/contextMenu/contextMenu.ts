import styles from "./contextMenu.css";
import Menu from "./menu/menu";
import ContextMenuItem from "./contextMenuItem";

export default class ContextMenu {
  private domElement?: HTMLDivElement;

  private menu: Menu;

  constructor() {
    this.close = this.close.bind(this);

    this.menu = new Menu([]);
    this.menu.onPropagate.addListener(this.close);
  }

  public render(): HTMLDivElement {
    this.domElement = document.createElement("div");
    this.domElement.classList.add(styles.overlay, styles.hidden);

    const clickLayer = document.createElement("div");
    clickLayer.classList.add(styles.overlay, styles.middleLayer);

    this.domElement.appendChild(clickLayer);
    this.domElement.appendChild(this.menu.render());

    clickLayer.addEventListener("click", this.close);

    window.addEventListener("resize", this.close);

    return this.domElement;
  }

  public show(items: ContextMenuItem[], x: number, y: number) {
    if (!this.domElement) {
      return;
    }

    this.menu.setItems(items);
    this.menu.setPosition(x, y);

    if (this.domElement.classList.contains(styles.hidden)) {
      this.domElement.classList.remove(styles.hidden);
    }
  }

  public close() {
    if (this.domElement && !this.domElement.classList.contains(styles.hidden)) {
      this.domElement.classList.add(styles.hidden);
    }
  }
}
