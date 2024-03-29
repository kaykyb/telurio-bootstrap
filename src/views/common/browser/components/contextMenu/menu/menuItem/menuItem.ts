import styles from "./menuItem.css";
import ContextMenuItem from "../../contextMenuItem";
import Menu from "../menu";
import CommonEvent from "@src/common/common/commonEvent";
import FeatherIcons from "@src/common/browser/icons/feather";

export default class MenuItem {
  public onPropagate = new CommonEvent();

  private submenu?: Menu;
  private domElement?: HTMLDivElement;

  constructor(private ctxItem: ContextMenuItem) {}

  public render(): HTMLDivElement {
    this.domElement = document.createElement("div");
    this.domElement.classList.add(styles.item);

    // add icon
    const iconContainer = document.createElement("div");
    iconContainer.classList.add(styles.iconContainer);

    if (this.ctxItem.icon) {
      const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svgIcon.setAttribute("viewBox", "0 0 24 24");

      svgIcon.classList.add(styles.icon);

      svgIcon.innerHTML = FeatherIcons.getSvgPath(this.ctxItem.icon);

      iconContainer.appendChild(svgIcon);
    }

    this.domElement.appendChild(iconContainer);

    // add text
    const label = document.createElement("div");

    label.textContent = this.ctxItem.label;

    this.domElement.appendChild(label);

    // add shortcut
    if (this.ctxItem.shortcut) {
      const shortcut = document.createElement("div");
      shortcut.classList.add(styles.shortcut);

      shortcut.textContent = this.ctxItem.shortcut;

      this.domElement.appendChild(shortcut);
    }

    // add placeholder
    const placeholder = document.createElement("div");
    placeholder.classList.add(styles.placeholder);

    this.domElement.appendChild(placeholder);

    // add arrow
    const arrow = document.createElement("div");
    arrow.classList.add(styles.arrow);

    if (this.ctxItem.subitems) {
      const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svgIcon.setAttribute("viewBox", "0 0 24 24");

      svgIcon.classList.add(styles.icon);

      svgIcon.innerHTML = FeatherIcons.getSvgPath("chevron-right");

      arrow.appendChild(svgIcon);
    }

    this.domElement.appendChild(arrow);

    // assign events
    this.domElement.onclick = () => {
      if (this.ctxItem.callback && !this.ctxItem.subitems) {
        this.onPropagate.propagate({});
        this.ctxItem.callback();
      }
    };

    if (this.ctxItem.subitems) {
      this.domElement.addEventListener("mouseenter", this.showSubitems.bind(this));
      this.domElement.addEventListener("mouseleave", this.closeSubitems.bind(this));
    }

    return this.domElement;
  }

  public showSubitems() {
    if (this.submenu) {
      return;
    }

    if (!this.domElement) {
      return;
    }

    if (!this.ctxItem.subitems) {
      return;
    }

    const rect = this.domElement.getBoundingClientRect();

    this.submenu = new Menu(this.ctxItem.subitems);
    this.submenu.onPropagate.addListener(() => this.onPropagate.propagate({}));
    this.domElement.appendChild(this.submenu.render());

    this.submenu.setPosition(rect.left + rect.width, rect.top);
  }

  public closeSubitems() {
    if (this.submenu && this.submenu.domElement) {
      this.submenu.domElement.remove();
      this.submenu = undefined;
    }
  }
}
