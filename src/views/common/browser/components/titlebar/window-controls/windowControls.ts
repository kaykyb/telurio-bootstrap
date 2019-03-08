import styles from "./windowControls.css";
import WindowButton from "./window-button/windowButton";

import CommonEvent from "@src/common/common/commonEvent";

export default class WindowControls {
  public onCloseClick = new CommonEvent();
  public onMinimizeClick = new CommonEvent();
  public onMaximizeClick = new CommonEvent();
  public onRestoreClick = new CommonEvent();

  private domElement?: HTMLDivElement;

  private closeBtn?: WindowButton;
  private maximizeBtn?: WindowButton;
  private minimizeBtn?: WindowButton;
  private restoreBtn?: WindowButton;

  constructor(
    private closable: boolean,
    private minimizable: boolean,
    private maximizable: boolean,
    private maximized: boolean
  ) {}

  public render(): HTMLDivElement {
    this.domElement = document.createElement("div");
    this.domElement.classList.add(styles.controls);

    if (this.minimizable) {
      this.minimizeBtn = new WindowButton("minimize");
      this.domElement.appendChild(this.minimizeBtn.render());
      this.minimizeBtn.onClick.addListener(() => this.onMinimizeClick.propagate({}));
    }

    if (this.maximizable) {
      this.maximizeBtn = new WindowButton("maximize");
      this.domElement.appendChild(this.maximizeBtn.render());
      this.maximizeBtn.onClick.addListener(() => this.onMaximizeClick.propagate({}));

      this.restoreBtn = new WindowButton("restore");
      this.domElement.appendChild(this.restoreBtn.render());
      this.restoreBtn.onClick.addListener(() => this.onMaximizeClick.propagate({}));

      if (this.maximized) {
        this.maximizeBtn.hide();
      } else {
        this.restoreBtn.hide();
      }
    }

    if (this.closable) {
      this.closeBtn = new WindowButton("close");
      this.domElement.appendChild(this.closeBtn.render());
      this.closeBtn.onClick.addListener(() => this.onCloseClick.propagate({}));
    }

    return this.domElement;
  }

  public wasMaximized() {
    if (this.maximizeBtn && this.restoreBtn) {
      this.maximizeBtn.hide();
      this.restoreBtn.show();
    }
  }

  public wasRestored() {
    if (this.maximizeBtn && this.restoreBtn) {
      this.maximizeBtn.show();
      this.restoreBtn.hide();
    }
  }
}
