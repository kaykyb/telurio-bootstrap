import EditorExtensionBridgeCommand from "../../../../common/common/extensions/editorExtensionBridgeCommand";
import ExtensionManifest from "@src/common/common/extensions/manifest-type/extensionManifest";
import CommonEvent from "@src/common/common/commonEvent";
import Panel from "../../common/classes/panel";
import LoadableExtension from "@src/common/common/extensions/loadableExtension";

export default class EditorExtensionBridge {
  public onCommandRegister = new CommonEvent<EditorExtensionBridgeCommand<any>>();
  public onPanelRegister = new CommonEvent<Panel>();

  public commands: { [key: string]: EditorExtensionBridgeCommand<any> } = {};

  public panels: Panel[] = [];

  // Commands
  public registerCommand(
    cmd: string,
    permissionRequired: string,
    owner: ExtensionManifest
  ): EditorExtensionBridgeCommand<any> {
    const eCmd = new EditorExtensionBridgeCommand(cmd, owner, permissionRequired);
    this.commands[cmd] = eCmd;
    this.onCommandRegister.propagate(eCmd);
    return eCmd;
  }

  public removeCommand(cmd: string) {
    delete this.commands[cmd];
  }

  public getCommand(cmd: string): EditorExtensionBridgeCommand<any> {
    return this.commands[cmd];
  }

  // Panels
  public registerPanel(name: string, owner: LoadableExtension, contentsUrl: string) {
    const panel = new Panel(name, owner, contentsUrl);

    this.panels.push(panel);
    this.onPanelRegister.propagate(panel);
  }
}
