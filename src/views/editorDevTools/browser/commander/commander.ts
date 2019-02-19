import styles from "./commander.css";
import EditorDevToolsViewComponent from "../editorDevToolsViewComponent";
import CommandsList from "./commandsList/commandsList";

export default class Commander extends EditorDevToolsViewComponent {
  private domElement?: HTMLDivElement;

  public render(): HTMLDivElement {
    this.domElement = document.createElement("div");
    this.domElement.classList.add(styles.commander);

    this.editorDevToolsService.getEditorCommands().then(commands => {
      const commandsList = new CommandsList(this.editorDevToolsService, commands);
      this.domElement!.appendChild(commandsList.render());
    });

    return this.domElement;
  }
}
