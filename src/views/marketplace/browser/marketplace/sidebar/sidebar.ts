import styles from "./sidebar.css";
import SearchBar from "./search-bar/searchBar";

export default class Sidebar {
  private domElement!: HTMLDivElement;

  public render(): HTMLDivElement {
    this.domElement = document.createElement("div");
    this.domElement.classList.add(styles.sidebar);

    const searchBar = new SearchBar();
    this.domElement.appendChild(searchBar.render());

    return this.domElement;
  }
}
