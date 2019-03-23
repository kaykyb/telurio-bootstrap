import styles from "./iconButton.css";
import CommonEvent from "@src/common/common/commonEvent";
import FeatherIcons from "@src/common/browser/icons/feather";

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

    const icon = document.createElement("div");
    icon.classList.add(styles.iconContainer);

    const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgIcon.setAttribute("viewBox", "0 0 24 24");

    svgIcon.classList.add(styles.icon);

    svgIcon.innerHTML = FeatherIcons.getSvgPath(this.icon);

    icon.appendChild(svgIcon);

    this.domElement.appendChild(icon);
    this.domElement.onclick = () => this.onClick.propagate({});
    return this.domElement;
  }
}
