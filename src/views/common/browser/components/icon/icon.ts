import styles from "./icon.css";

import FeatherIcons from "@src/common/browser/icons/feather";

export default class Icon {
  constructor(private icon: string, private size = 16) {}

  public render(): HTMLDivElement {
    const iconContainer = document.createElement("div");
    iconContainer.classList.add(styles.iconContainer);

    // apply size
    iconContainer.style.width = this.size + "px";
    iconContainer.style.maxWidth = this.size + "px";

    const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgIcon.setAttribute("viewBox", "0 0 24 24");

    svgIcon.classList.add(styles.icon);

    svgIcon.innerHTML = FeatherIcons.getSvgPath(this.icon);

    svgIcon.style.width = this.size + "px";
    svgIcon.style.height = this.size + "px";

    iconContainer.appendChild(svgIcon);

    return iconContainer;
  }
}
