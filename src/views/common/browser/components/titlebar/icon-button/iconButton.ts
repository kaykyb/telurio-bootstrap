import styles from "./iconButton.css";
import CommonEvent from "@src/common/common/commonEvent";
import { materialIcons } from "@src/views/common/browser/fonts/material-icons/material-icons.css";

export default class IconButton {
  public onClick = new CommonEvent();
  private icon: string;
  private domElement?: HTMLButtonElement;

  constructor(icon: string) {
    this.icon = icon;
  }

  public render(): HTMLButtonElement {
    this.domElement = document.createElement("button");
    this.domElement.classList.add(styles.button);

    const icon = document.createElement("i");
    icon.classList.add(styles.icon, materialIcons);
    icon.innerText = this.icon;

    this.domElement.appendChild(icon);
    this.domElement.onclick = () => this.onClick.propagate({});
    return this.domElement;
  }
}
