import Tab from "../../../../../common/classes/tab";
import * as styles from "./panelTab.css";

import TrackableEvent from "../../../../../../../common/common/trackableEvent";
import TabUtils from "../../common/tabUtils";
import CommonEvent from "../../../../../../../common/common/commonEvent";

export default class PanelTab {
  public onTabDragOut = new TrackableEvent<Tab, PanelTab>();
  public onTabDrop = new TrackableEvent<Tab, PanelTab>();
  public onClick = new CommonEvent<PanelTab>();

  public tab: Tab;
  public domElement!: HTMLDivElement;

  private dragEndMutes = 0;

  // tslint:disable-next-line:variable-name
  private _isActive: boolean = false;
  public get isActive(): boolean {
    return this._isActive;
  }
  public set isActive(v: boolean) {
    if (this._isActive && !v) {
      this.deactive();
    } else if (!this._isActive && v) {
      this.active();
    }

    this._isActive = v;
  }

  constructor(tab: Tab) {
    this.tab = tab;
  }

  public render(): HTMLDivElement {
    this.domElement = document.createElement("div");
    this.domElement.className = styles.tab;
    this.domElement.innerText = this.tab.panelTitle;
    this.domElement.draggable = true;

    this.domElement.ondragstart = this.handleDragStart.bind(this);
    this.domElement.ondragend = this.handleDragEnd.bind(this);

    this.domElement.ondragover = this.handleDragOver.bind(this);
    this.domElement.ondragleave = this.handleDragLeave.bind(this);
    this.domElement.ondragenter = this.handleDragEnter.bind(this);

    this.domElement.ondrop = this.handleDrop.bind(this);

    this.domElement.onclick = () => this.onClick.propagate(this);

    return this.domElement;
  }

  private deactive() {
    this.domElement.classList.remove(styles.active);
  }

  private active() {
    this.domElement.classList.add(styles.active);
  }

  private handleDragOver(ev: DragEvent) {
    ev.preventDefault();

    if (ev.dataTransfer) {
      ev.dataTransfer.dropEffect = "move";
    }
  }

  private handleDragEnter(ev: DragEvent) {
    this.domElement.classList.add(styles.dragOver);
  }

  private handleDragLeave(ev: DragEvent) {
    this.domElement.classList.remove(styles.dragOver);
  }

  private handleDragStart(ev: DragEvent) {
    if (ev.dataTransfer) {
      ev.dataTransfer.setData("editor/tab", JSON.stringify(this.tab));
    }
  }

  private handleDragEnd(ev: DragEvent) {
    if (ev.dataTransfer && ev.dataTransfer.dropEffect !== "none") {
      this.onTabDragOut.propagate(this.tab, this);
    }
  }

  private handleDrop(ev: DragEvent) {
    this.domElement.classList.remove(styles.dragOver);

    const tab = TabUtils.getTabFromDropData(ev);

    if (tab) {
      this.onTabDrop.propagate(tab, this);
    }
  }
}
