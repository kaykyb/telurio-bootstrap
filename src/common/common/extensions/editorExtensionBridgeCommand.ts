import EditorExtensionBridgeCommandArgs from "./editorExtensionBridgeCommandArgs";
import ExtensionManifest from "@src/common/common/extensions/manifest-type/extensionManifest";
import LoadableExtension from "./loadableExtension";
import LogUtility from "../util/logUtility";
import IExtensionHost from "@src/views/editor/common/extensions/extensionHostInterface";

/**
 * Editor extension command.
 * @template T Command arguments object ype
 */
export default class EditorExtensionBridgeCommand<T> {
  private listeners: Array<
    (event: EditorExtensionBridgeCommandArgs<T>, senderHost?: IExtensionHost) => any
  > = [];

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
   * @param senderHost The host of the sender.
   * If no extension is provided, then the "core" is assumed to be the sender.
   *
   * @returns Returns true if the command was propagated sucessfully or false if the provided sender doesn't have
   * enough permissions to run this commmand.
   */
  public execute(args: T, sender: LoadableExtension, cbCmdId?: string, senderHost?: IExtensionHost): boolean {
    if (
      !sender ||
      !this.permissionRequired ||
      sender.extension.permissions.indexOf(this.permissionRequired) >= 0
    ) {
      this.propagate(new EditorExtensionBridgeCommandArgs<T>(this.cmd, args, sender, cbCmdId), senderHost);
      return true;
    }

    LogUtility.err(
      "InsuficientPermissions",
      "Security",
      `${sender.extension.name} doesn't have the required permission ${this.permissionRequired} to execute ${
        this.cmd
      }`
    );

    return false;
  }

  private propagate(event: EditorExtensionBridgeCommandArgs<T>, senderHost?: IExtensionHost) {
    this.listeners.forEach(listener => {
      listener(event, senderHost);
    });
  }
}
