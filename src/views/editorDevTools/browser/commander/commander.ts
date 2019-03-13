import styles from "./commander.css";
import EditorDevToolsViewComponent from "../editorDevToolsViewComponent";
import CommandsList from "./commandsList/commandsList";
import EditorDevToolsBrowserService from "../service/editorDevToolsService";
import EditorExtensionBridgeCommand from "@src/common/common/extensions/editorExtensionBridgeCommand";
import ICommandIndex from "@src/common/common/extensions/commandIndex";

export default class Commander {
  private domElement?: HTMLDivElement;

  constructor(public readonly editorDevToolsService: EditorDevToolsBrowserService) {
    this.handleCmdList = this.handleCmdList.bind(this);
  }

  public render(): HTMLDivElement {
    this.domElement = document.createElement("div");
    this.domElement.classList.add(styles.commander);

    this.editorDevToolsService.getEditorCommands().then(this.handleCmdList);
    this.editorDevToolsService.onExtCommandsUpdate.addListener(this.handleCmdList);

    return this.domElement;
  }

  private handleCmdList(cmds: ICommandIndex) {
    const commandsList = new CommandsList(this.editorDevToolsService, cmds);
    this.domElement!.appendChild(commandsList.render());
  }
}
