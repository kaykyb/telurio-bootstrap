import ExtensionManifest from "@src/common/common/extensions/manifest-type/extensionManifest";
import LoadableExtension from "./loadableExtension";

/**
 * Editor extension command activation arguments.
 * @template T Command arguments object type
 */
export default class EditorExtensionBridgeCommandArgs<T> {
  /**
   * Editor extension command activation arguments.
   *
   * @param cmd The command executed.
   * @param args The arguments of the command.
   * @param cbCmdId The command to be used as a callback.
   * @param sender The extension sending this command.
   */
  constructor(
    public cmd: string,
    public args: T,
    public sender: LoadableExtension,
    public cbCmdId?: string
  ) {}
}
