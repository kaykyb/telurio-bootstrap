import styles from "./menu.css";
import MenuItem from "./menuItem/menuItem";
import ContextMenuItem from "../contextMenuItem";
import CommonEvent from "@src/common/common/commonEvent";

export default class Menu {
  public onPropagate = new CommonEvent();

  public domElement?: HTMLDivElement;

  constructor(private items: ContextMenuItem[]) {}

  public render(): HTMLDivElement {
    this.domElement = document.createElement("div");
    this.domElement.classList.add(styles.menu);

    this.setItems(this.items);

    window.requestAnimationFrame(this.checkBorders.bind(this));

    return this.domElement;
  }

  public setPosition(x: number, y: number) {
    if (this.domElement) {
      this.domElement.style.left = x + "px";
      this.domElement.style.top = y + "px";

      window.requestAnimationFrame(this.checkBorders.bind(this));
    }
  }

  public setItems(items: ContextMenuItem[]) {
    this.items = items;

    const frag = document.createDocumentFragment();

    this.items.forEach(item => {
      const menuItem = new MenuItem(item);
      menuItem.onPropagate.addListener(() => this.onPropagate.propagate({}));
      frag.appendChild(menuItem.render());
    });

    if (this.domElement) {
      this.domElement.innerHTML = "";
      this.domElement.appendChild(frag);
    }
  }

  public checkBorders() {
    if (!this.domElement) {
      return;
    }

    const rect = this.domElement.getBoundingClientRect();

    const x = rect.left;
    const y = rect.top;

    const height = rect.height;
    const width = rect.width;

    const viewportWidth = document.body.offsetWidth;
    const viewportHeight = document.body.offsetHeight;

    if (x + width > viewportWidth) {
      const targetX = x - width;
      this.domElement.style.left = targetX + "px";
    }

    if (y + height > viewportHeight) {
      const targetY = y - height;
      this.domElement.style.top = targetY + "px";
    }
  }
}
