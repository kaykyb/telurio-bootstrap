import styles from "./item.css";

import TreeViewListItem from "../treeViewListItem";
import CommonEvent from "@src/common/common/commonEvent";
import DetailsList from "../treeViewList";
import Icon from "../../icon/icon";

export default class Item {
  public onOpen = new CommonEvent<TreeViewListItem>();
  public onClose = new CommonEvent<TreeViewListItem>();
  public onSelect = new CommonEvent<{ item: TreeViewListItem; propagate: boolean }>();
  public onUnselect = new CommonEvent<TreeViewListItem>();

  public sublist?: DetailsList;

  private domElement?: HTMLDivElement;
  private clickableElement?: HTMLDivElement;
  private expandableElement?: HTMLDivElement;

  private isOpen = false;

  constructor(public item: TreeViewListItem, private padding: number) {}

  public render(): HTMLDivElement {
    this.domElement = document.createElement("div");
    this.domElement.classList.add(styles.container, this.isOpen ? styles.open : "closed");

    // clickable element
    this.clickableElement = document.createElement("div");
    this.clickableElement.classList.add(styles.clickableElement);

    this.clickableElement.style.paddingLeft = this.padding + "px";

    this.domElement.appendChild(this.clickableElement);

    // left side icon
    const iconContainer = document.createElement("div");
    iconContainer.classList.add(styles.iconContainer);

    if (this.item.icon) {
      const icon = new Icon(this.item.icon);
      iconContainer.appendChild(icon.render());
    }

    this.clickableElement.appendChild(iconContainer);

    // label
    const label = document.createElement("div");
    label.classList.add(styles.labelContainer);

    label.innerText = this.item.label;

    this.clickableElement.appendChild(label);

    // sublist
    if (this.item.sublist) {
      // right side icon
      const rightSideIconContainer = document.createElement("div");
      rightSideIconContainer.classList.add(styles.iconContainer);
      this.expandableElement = document.createElement("div");
      this.expandableElement.classList.add(styles.expandableElement);

      // sublist
      this.sublist = new DetailsList(this.item.sublist, this.padding + 16);
      this.sublist.onSelect.addListener(this.handleSublistSelect.bind(this));
      this.expandableElement.appendChild(this.sublist.render());
      this.domElement.appendChild(this.expandableElement);

      // click
      this.clickableElement.addEventListener("click", this.toggle.bind(this));

      // chevron right
      const chevronRight = document.createElement("div");
      chevronRight.classList.add(styles.chevronRightIconContainer);
      const icon = new Icon("chevron-right");
      chevronRight.appendChild(icon.render());

      // chevron down
      const chevronDown = document.createElement("div");
      chevronDown.classList.add(styles.chevronDownIconContainer);
      const iconDown = new Icon("chevron-down");
      chevronDown.appendChild(iconDown.render());

      rightSideIconContainer.appendChild(chevronDown);
      rightSideIconContainer.appendChild(chevronRight);

      this.clickableElement.appendChild(rightSideIconContainer);
    }

    this.clickableElement.addEventListener("click", this.handleClick.bind(this));

    return this.domElement;
  }

  public isSelected = () => this.isSelected;

  public toggle() {
    this.isOpen ? this.close() : this.open();
  }

  public open() {
    if (!this.domElement) {
      return;
    }

    this.domElement.classList.add(styles.open);
    this.isOpen = true;
    this.onOpen.propagate(this.item);
  }

  public close() {
    if (!this.domElement) {
      return;
    }

    this.domElement.classList.remove(styles.open);
    this.isOpen = false;

    this.onClose.propagate(this.item);
  }

  public select(propagate = true) {
    if (!this.domElement) {
      return;
    }

    this.domElement.classList.add(styles.selected);

    this.onSelect.propagate({ item: this.item, propagate });
  }

  public unselect() {
    if (!this.domElement) {
      return;
    }

    this.domElement.classList.remove(styles.selected);

    this.onUnselect.propagate(this.item);
  }

  public hide() {
    if (!this.domElement) {
      return;
    }

    if (!this.domElement.classList.contains(styles.hidden)) {
      this.domElement.classList.add(styles.hidden);
    }
  }

  public show() {
    if (!this.domElement) {
      return;
    }

    if (this.domElement.classList.contains(styles.hidden)) {
      this.domElement.classList.remove(styles.hidden);
    }
  }

  private handleSublistSelect(ev: { item: TreeViewListItem; propagate: boolean }) {
    this.open();
    this.onSelect.propagate(ev);
  }

  private handleClick() {
    this.select();
  }
}
