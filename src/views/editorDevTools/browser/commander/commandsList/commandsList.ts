import styles from "./commandsList.css";

import EditorExtensionBridgeCommand from "@src/common/common/extensions/editorExtensionBridgeCommand";
import EditorDevToolsViewComponent from "@src/views/editorDevTools/browser/editorDevToolsViewComponent";
import EditorDevToolsBrowserService from "@src/views/editorDevTools/browser/service/editorDevToolsService";
import CommandsListItem from "./commandsListItem/commandsListItem";
import ICommandIndex from "@src/common/common/extensions/commandIndex";

export default class CommandsList extends EditorDevToolsViewComponent {
  private domElement?: HTMLDivElement;

  constructor(
    public readonly editorDevToolsService: EditorDevToolsBrowserService,
    private commands: ICommandIndex
  ) {
    super(editorDevToolsService);
  }

  public render(): HTMLDivElement {
    this.domElement = document.createElement("div");
    this.domElement.classList.add(styles.commandsList);

    const frag = document.createDocumentFragment();

    for (const key in this.commands) {
      if (this.commands.hasOwnProperty(key)) {
        const element = this.commands[key];

        const item = new CommandsListItem(this.editorDevToolsService, key, element.permissionRequired);
        frag.appendChild(item.render());
      }
    }

    this.domElement.appendChild(frag);

    return this.domElement;
  }
}
