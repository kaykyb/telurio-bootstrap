import styles from "./sidebar.css";
import SearchBar from "./search-bar/searchBar";

export default class Sidebar {
  private domElement!: HTMLDivElement;

  private searchBar?: SearchBar;

  // tslint:disable-next-line: variable-name
  public get placeholder(): string {
    if (this.searchBar) {
      return this.searchBar.placeholder;
    }

    return "";
  }
  public set placeholder(v: string) {
    if (this.searchBar) {
      this.searchBar.placeholder = v;
    }
  }

  constructor(private initialSearchBarPlaceholder: string, private listElement: HTMLElement) {}

  public render(): HTMLDivElement {
    this.domElement = document.createElement("div");
    this.domElement.classList.add(styles.sidebar);

    const outContainer = document.createElement("div");
    outContainer.classList.add(styles.container);

    const searchBar = new SearchBar(this.initialSearchBarPlaceholder);
    outContainer.appendChild(searchBar.render());

    const listElementContainer = document.createElement("div");
    listElementContainer.classList.add(styles.listContainer);

    listElementContainer.appendChild(this.listElement);

    outContainer.appendChild(listElementContainer);

    this.domElement.appendChild(outContainer);

    return this.domElement;
  }
}
