import LoadableExtension from "@src/common/common/extensions/loadableExtension";
import CommonViewInitArgs from "../commonViewInitArgs";

/**
 * The return values that should be expected.
 */
export default interface ICommonViewIpcReturns {
  //#region Browser --> [Node returns]
  // Initialization Messages
  BROWSER_READY: CommonViewInitArgs;
  READY_TO_SHOW: undefined;

  // Window Commands
  TOGGLE_DEV_TOOLS: undefined;
  CLOSE: undefined;
  MAXIMIZE_OR_RESTORE: undefined;
  MINIMIZE: undefined;

  // Window Binary Questions
  IS_DEV: boolean;
  IS_MAXIMIZED: boolean;
  IS_WINDOW_CLOSABLE: boolean;
  IS_WINDOW_MAXIMIZABLE: boolean;
  IS_WINDOW_MINIMIZABLE: boolean;

  // Environment Non-binary Questions
  GET_EXTENSIONS: LoadableExtension[];

  // Environment Non-binary Requests
  SET_USER_SETTING: undefined;
  SET_INTERNAL_SETTING: undefined;
  //#endregion

  // ---------------------------------------

  //#region Node --> [Browser returns]
  // Environment Non-binary Events
  USER_SETTING_UPDATE: undefined;
  INTERNAL_SETTING_UPDATE: undefined;

  // Window Events
  MAXIMIZED: undefined;
  MINIMIZED: undefined;
  RESTORED: undefined;
}
