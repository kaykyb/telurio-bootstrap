import styles from "./searchBar.css";
import materialIcons from "../../../../../common/fonts/material-icons/material-icons.css";
import MarketplaceBrowserService from "../../../service/marketplaceBrowserService";

export default class SearchBar {
  private domElement?: HTMLDivElement;

  public render(): HTMLDivElement {
    this.domElement = document.createElement("div");
    this.domElement.classList.add(styles.searchBar);

    const input = document.createElement("input");
    input.classList.add(styles.input);
    input.placeholder = MarketplaceBrowserService.i18n.s("extView.SearchBarText");

    const icon = document.createElement("i");
    icon.classList.add(materialIcons.materialIcons, styles.icon);
    icon.innerHTML = "search";

    this.domElement.appendChild(input);
    this.domElement.appendChild(icon);

    return this.domElement;
  }
}
