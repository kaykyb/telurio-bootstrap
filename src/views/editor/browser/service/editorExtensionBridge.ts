import EditorExtensionBridgeCommand from "../../../../common/common/extensions/editorExtensionBridgeCommand";
import ExtensionManifest from "@src/common/common/extensions/manifest-type/extensionManifest";
import CommonEvent from "@src/common/common/commonEvent";

export default class EditorExtensionBridge {
  public onCommandRegister = new CommonEvent<EditorExtensionBridgeCommand<any>>();

  public commands: { [key: string]: EditorExtensionBridgeCommand<any> } = {};

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
}
