import Tab from "../../../../../../common/classes/tab";
import * as styles from "./panelView.css";

export default class PanelView {
  public domElement!: HTMLElement;
  public tab: Tab;

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

  public render(): HTMLElement {
    this.domElement = document.createElement("div");
    this.domElement.classList.add(styles.view, styles.deactive);
    this.domElement.innerText = JSON.stringify(this.tab);
    return this.domElement;
  }

  private deactive() {
    this.domElement.classList.remove(styles.active);
    this.domElement.classList.add(styles.deactive);
  }

  private active() {
    this.domElement.classList.add(styles.active);
    this.domElement.classList.remove(styles.deactive);
  }
}
