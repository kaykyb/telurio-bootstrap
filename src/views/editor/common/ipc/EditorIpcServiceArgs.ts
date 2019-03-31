import SettingKey from "@src/common/node/services/settings/settingKey";
import EditorExtensionBridgeCommand from "@src/common/common/extensions/editorExtensionBridgeCommand";
import ICommandIndex from "@src/common/common/extensions/commandIndex";

/**
 * The arguments that should be expected.
 */
export default interface IEditorIpcArgs {
  //#region [Browser args] --> Node
  //  Window commands
  OPEN_EDITOR_DEVTOOLS: undefined;
  OPEN_MARKETPLACE: undefined;
  OPEN_SETTINGS_EDITOR: undefined;

  // Environment Non-binary Questions
  GET_WORKSPACE_CONFIGS: undefined;

  // Environment Non-binary Requests
  UPDATE_EXT_COMMANDS: ICommandIndex;
  //#endregion

  // ---------------------------------------

  //#region [Node args] --> Browser
  // Environment Non-binary Events
  EXEC_EXT_COMMAND: string;
  GET_EXT_COMMANDS: undefined;
  GET_EDITOR_LAYOUT: undefined;
}
