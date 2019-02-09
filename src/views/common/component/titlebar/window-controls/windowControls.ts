import styles from "./windowControls.css";
import WindowButton from "./window-button/windowButton";
import CommonEvent from "../../../../../common/common/commonEvent";

export default class WindowControls {
  public onCloseClick = new CommonEvent();

  private closable: boolean;
  private domElement?: HTMLDivElement;

  private closeBtn?: WindowButton;

  constructor(closable: boolean) {
    this.closable = closable;
  }

  public render(): HTMLDivElement {
    this.domElement = document.createElement("div");
    this.domElement.classList.add(styles.controls);

    if (this.closable) {
      this.closeBtn = new WindowButton("close");
      this.domElement.appendChild(this.closeBtn.render());
      this.closeBtn.onClick.addListener(() => this.onCloseClick.propagate({}));
    }

    return this.domElement;
  }
}
