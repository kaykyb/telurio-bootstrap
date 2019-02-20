import styles from "./searchBar.css";
import materialIcons from "@src/views/common/fonts/material-icons/material-icons.css";
import ViewComponent from "@src/views/common/viewComponent";

export default class SearchBar extends ViewComponent {
  private domElement?: HTMLDivElement;

  public render(): HTMLDivElement {
    this.domElement = document.createElement("div");
    this.domElement.classList.add(styles.searchBar);

    const input = document.createElement("input");
    input.classList.add(styles.input);
    input.placeholder = this.commonService.i18n.contents.marketplaceView.searchBarText;

    const icon = document.createElement("i");
    icon.classList.add(materialIcons.materialIcons, styles.icon);
    icon.innerHTML = "search";
    icon.onclick = () => input.focus();

    this.domElement.appendChild(input);
    this.domElement.appendChild(icon);

    return this.domElement;
  }
}
