import SettingKey from "@src/common/common/settings/settingKey";
import EditorExtensionBridgeCommand from "@src/common/common/extensions/editorExtensionBridgeCommand";
import ICommandIndex from "@src/common/common/extensions/commandIndex";

/**
 * The arguments that should be expected.
 */
export default interface IEditorDevToolsIpcArgs {
  //#region [Browser args] --> Node
  // Environment Non-binary Questions
  GET_EXT_COMMANDS: undefined;

  // Environment Non-binary Requests
  EXEC_EXT_COMMAND: string;

  //#endregion

  // ---------------------------------------

  //#region [Node args] --> Browser
  // Environment Non-binary Events
  UPDATE_EXT_COMMANDS: ICommandIndex;
}
