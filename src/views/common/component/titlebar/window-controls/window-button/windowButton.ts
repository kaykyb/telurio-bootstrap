import styles from "./windowButton.css";

import CommonEvent from "@src/common/common/commonEvent";

export default class WindowButton {
  public onClick = new CommonEvent();
  private button: "close" | "minimize" | "maximize" | "reset";
  private domElement?: HTMLButtonElement;

  constructor(button: "close" | "minimize" | "maximize" | "reset") {
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
        icon.classList.add(styles.close);
        break;

      default:
        break;
    }

    this.domElement.onclick = () => this.onClick.propagate({});

    return this.domElement;
  }
}
