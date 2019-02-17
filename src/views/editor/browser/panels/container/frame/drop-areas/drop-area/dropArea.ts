import * as styles from "./dropArea.css";

import TrackableEvent from "@src/common/common/trackableEvent";
import Tab from "@src/views/editor/common/classes/tab";
import TabUtils from "@src/views/editor/browser/panels/container/common/tabUtils";

export default class DropArea {
  public pos: "right" | "left" | "top" | "bottom";

  public onTabDrop = new TrackableEvent<Tab, DropArea>();

  private domElement?: HTMLDivElement;

  constructor(pos: "right" | "left" | "top" | "bottom") {
    this.pos = pos;
  }

  public render(): HTMLDivElement {
    this.domElement = document.createElement("div");

    this.domElement.classList.add(styles.dropArea);
    this.domElement.classList.add(this.getPosClass(this.pos));

    this.domElement.ondragover = this.handleDragOver.bind(this);
    this.domElement.ondragenter = this.handleDragEnter.bind(this);
    this.domElement.ondragleave = this.handleDragLeave.bind(this);
    this.domElement.ondrop = this.handleDrop.bind(this);

    return this.domElement;
  }

  private handleDragOver(ev: DragEvent) {
    ev.preventDefault();

    if (ev.dataTransfer) {
      ev.dataTransfer.dropEffect = "move";
    }
  }

  private handleDragEnter(ev: DragEvent) {
    this.domElement!.classList.add(styles.dragOver);
  }

  private handleDragLeave(ev: DragEvent) {
    this.domElement!.classList.remove(styles.dragOver);
  }

  private handleDrop(ev: DragEvent) {
    this.domElement!.classList.remove(styles.dragOver);

    const tab = TabUtils.getTabFromDropData(ev);

    if (tab) {
      this.onTabDrop.propagate(tab, this);
    }
  }

  private getPosClass(pos: "right" | "left" | "top" | "bottom"): string {
    switch (pos) {
      case "right":
        return styles.right;
        break;

      case "left":
        return styles.left;
        break;

      case "top":
        return styles.top;
        break;

      default:
        return styles.bottom;
        break;
    }
  }
}
