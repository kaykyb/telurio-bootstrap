import EditorExtensionBridgeCommand from "@src/common/common/extensions/editorExtensionBridgeCommand";
import CommonLayoutConfig from "../classes/commonLayoutConfig";
import ICommandIndex from "@src/common/common/extensions/commandIndex";

/**
 * The returns that should be expected.
 */
export default interface IEditorIpcReturns {
  //#region Browser --> [Node returns]
  //  Window commands
  OPEN_EDITOR_DEVTOOLS: undefined;
  OPEN_MARKETPLACE: undefined;

  // Environment Non-binary Questions
  GET_WORKSPACE_CONFIGS: CommonLayoutConfig;

  // Environment Non-binary Requests
  UPDATE_EXT_COMMANDS: undefined;
  //#endregion

  // ---------------------------------------

  //#region Node --> [Browser returns]
  // Environment Non-binary Events
  EXEC_EXT_COMMAND: undefined;
  GET_EXT_COMMANDS: ICommandIndex;
  GET_EDITOR_LAYOUT: CommonLayoutConfig;
}
