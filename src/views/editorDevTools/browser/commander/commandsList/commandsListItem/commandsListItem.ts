import styles from "./commandsListItem.css";

import EditorDevToolsViewComponent from "@src/views/editorDevTools/browser/editorDevToolsViewComponent";
import EditorDevToolsBrowserService from "@src/views/editorDevTools/browser/service/editorDevToolsService";

export default class CommandsListItem extends EditorDevToolsViewComponent {
  private domElement?: HTMLDivElement;

  constructor(
    public readonly editorDevToolsService: EditorDevToolsBrowserService,
    private command: string,
    private permissionRequired?: string
  ) {
    super(editorDevToolsService);
  }

  public render(): HTMLDivElement {
    const i18n = this.editorDevToolsService.commonService.i18n.contents;

    this.domElement = document.createElement("div");
    this.domElement.classList.add(styles.commandsListItem);

    const name = document.createElement("p");
    name.classList.add(styles.name);
    name.textContent = this.command;

    const permission = document.createElement("div");
    permission.classList.add(styles.permission);

    const permissionLabel = document.createElement("p");
    permissionLabel.classList.add(styles.permissionLabel);
    permissionLabel.textContent = i18n.editorDevToolsView.cmdList.permissionLabel;
    permission.appendChild(permissionLabel);

    const permissionContrib = document.createElement("p");
    permissionContrib.classList.add(styles.permissionContrib);
    permissionContrib.textContent = this.permissionRequired
      ? this.permissionRequired
      : i18n.editorDevToolsView.cmdList.nonePermission;

    permission.appendChild(permissionContrib);

    this.domElement.appendChild(name);
    this.domElement.appendChild(permission);

    return this.domElement;
  }
}
