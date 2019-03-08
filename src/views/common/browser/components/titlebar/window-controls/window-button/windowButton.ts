import styles from "./windowButton.css";

import CommonEvent from "@src/common/common/commonEvent";

export default class WindowButton {
  public onClick = new CommonEvent();
  private button: "close" | "minimize" | "maximize" | "restore";
  private domElement?: HTMLButtonElement;

  constructor(button: "close" | "minimize" | "maximize" | "restore") {
    this.button = button;
  }

  public render(): HTMLButtonElement {
    this.domElement = document.createElement("button");
    this.domElement.classList.add(styles.button);

    const icon = document.createElement("div");
    icon.classList.add(styles.icon);

    this.domElement.appendChild(icon);

    switch (this.button) {
      case "close":
        this.domElement.classList.add(styles.closeButton);
        icon.classList.add(styles.close);
        break;

      case "minimize":
        icon.classList.add(styles.minimize);
        break;

      case "maximize":
        icon.classList.add(styles.maximize);
        break;

      case "restore":
        icon.classList.add(styles.restore);
        break;

      default:
        break;
    }

    this.domElement.onclick = () => this.onClick.propagate({});

    return this.domElement;
  }

  public hide() {
    if (this.domElement) {
      this.domElement.style.display = "none";
    }
  }

  public show() {
    if (this.domElement) {
      this.domElement.style.display = "inline-block";
    }
  }
}
