import styles from "./sidebar.css";
import SearchBar from "./search-bar/searchBar";
import ViewComponent from "@src/views/common/viewComponent";

export default class Sidebar extends ViewComponent {
  private domElement!: HTMLDivElement;

  public render(): HTMLDivElement {
    this.domElement = document.createElement("div");
    this.domElement.classList.add(styles.sidebar);

    const searchBar = new SearchBar(this.commonService);
    this.domElement.appendChild(searchBar.render());

    return this.domElement;
  }
}
