import EditorExtensionBridgeCommandArgs from "./editorExtensionBridgeCommandArgs";
import ExtensionManifest from "@src/common/common/extensions/manifest-type/extensionManifest";

/**
 * Editor extension command.
 * @template T Command arguments object ype
 */
export default class EditorExtensionBridgeCommand<T> {
  private listeners: Array<(event: EditorExtensionBridgeCommandArgs<T>) => any> = [];

  /**
   * Editor extension command.
   *
   * @param cmd The extension command that this objects represents.
   * @param permissionRequired The permission required to run this command.
   */
  constructor(public cmd: string, public owner: ExtensionManifest, public permissionRequired?: string) {}

  /**
   * Adds a listener to the listeners array.
   *
   * @param listener The listener callback to add to the listeners array.
   */
  public addListener(listener: (event: EditorExtensionBridgeCommandArgs<T>) => any) {
    this.listeners.push(listener);
  }

  /**
   * Removes a listener from the listeners array.
   *
   * @param listener The listener callback to remove from the listeners array.
   */
  public removeListener(listener: (event: EditorExtensionBridgeCommandArgs<T>) => any) {
    this.listeners.forEach((v, i) => {
      if (v === listener) {
        this.listeners.splice(i, 1);
      }
    });
  }

  /**
   * Executes this command.
   *
   * @param args The arguments of the command.
   * @param cbCmdId The command to be used as a callback
   * @param sender The extension sending this command.
   * If no extension is provided, then the "core" is assumed to be the sender.
   *
   * @returns Returns true if the command was propagated sucessfully or false if the provided sender doesn't have
   * enough permissions to run this commmand.
   */
  public execute(args: T, sender: ExtensionManifest, cbCmdId?: string): boolean {
    if (!sender || !this.permissionRequired || sender.permissions.indexOf(this.permissionRequired) >= 0) {
      this.propagate(new EditorExtensionBridgeCommandArgs<T>(this.cmd, args, sender, cbCmdId));
      return true;
    }

    // tslint:disable-next-line: no-console
    console.error(
      `INSUFICIENT_PERMISSIONS: ${sender.name} doesn't have the required permission ${
        this.permissionRequired
      } to execute ${this.cmd}`
    );

    return false;
  }

  private propagate(event: EditorExtensionBridgeCommandArgs<T>) {
    this.listeners.forEach(listener => {
      listener(event);
    });
  }
}
