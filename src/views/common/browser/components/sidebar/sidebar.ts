import styles from "./sidebar.css";
import SearchBar from "./search-bar/searchBar";
import CommonEvent from "@src/common/common/commonEvent";

export default class Sidebar {
  public onSearchBarTextChange = new CommonEvent<string>();

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

    this.searchBar = new SearchBar(this.initialSearchBarPlaceholder);
    outContainer.appendChild(this.searchBar.render());

    const listElementContainer = document.createElement("div");
    listElementContainer.classList.add(styles.listContainer);

    listElementContainer.appendChild(this.listElement);

    outContainer.appendChild(listElementContainer);

    this.searchBar.onChange.addListener(s => this.onSearchBarTextChange.propagate(s));

    this.domElement.appendChild(outContainer);

    return this.domElement;
  }
}
