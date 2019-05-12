import SettingKey from "@src/common/common/settings/settingKey";
import EditorExtensionBridgeCommand from "@src/common/common/extensions/editorExtensionBridgeCommand";
import ICommandIndex from "@src/common/common/extensions/commandIndex";

/**
 * The arguments that should be expected.
 */
export default interface IEditorDevToolsIpcReturns {
  //#region Browser  --> [Node returns]
  // Environment Non-binary Questions
  GET_EXT_COMMANDS: ICommandIndex;

  // Environment Non-binary Requests
  EXEC_EXT_COMMAND: undefined;

  //#endregion

  // ---------------------------------------

  //#region Node --> [Browser returns]
  // Environment Non-binary Events
  UPDATE_EXT_COMMANDS: undefined;
}
