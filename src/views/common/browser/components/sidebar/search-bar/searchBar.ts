import styles from "./searchBar.css";

import materialIcons from "@src/views/common/browser/fonts/material-icons/material-icons.css";
import Icon from "../../icon/icon";

export default class SearchBar {
  private domElement?: HTMLDivElement;

  // tslint:disable-next-line: variable-name
  private _placeholder: string = "";
  public get placeholder(): string {
    return this._placeholder;
  }
  public set placeholder(v: string) {
    if (this._placeholder !== v) {
      this._placeholder = v;
    }
  }

  constructor(placeholder: string) {
    this._placeholder = placeholder;
  }

  public render(placeholder = this.placeholder): HTMLDivElement {
    this.domElement = document.createElement("div");
    this.domElement.classList.add(styles.searchBar);

    const input = document.createElement("input");
    input.classList.add(styles.input);
    input.placeholder = placeholder;

    const iconContainer = document.createElement("div");
    iconContainer.classList.add(styles.icon);

    const icon = new Icon("search");
    iconContainer.appendChild(icon.render());

    iconContainer.onclick = () => input.focus();

    this.domElement.appendChild(input);
    this.domElement.appendChild(iconContainer);

    return this.domElement;
  }
}
