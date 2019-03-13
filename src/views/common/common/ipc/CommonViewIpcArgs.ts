import SettingKey from "@src/common/node/services/settings/settingKey";

/**
 * The arguments that should be expected.
 */
export default interface ICommonViewIpcArgs {
  //#region [Browser args] --> Node
  // Initialization Events
  BROWSER_READY: undefined;
  READY_TO_SHOW: undefined;

  // Window Commands
  TOGGLE_DEV_TOOLS: undefined;
  CLOSE: undefined;
  MAXIMIZE_OR_RESTORE: undefined;
  MINIMIZE: undefined;

  // Window Binary Questions
  IS_DEV: undefined;
  IS_MAXIMIZED: undefined;
  IS_WINDOW_CLOSABLE: undefined;
  IS_WINDOW_MAXIMIZABLE: undefined;
  IS_WINDOW_MINIMIZABLE: undefined;

  // Environment Non-binary Questions
  GET_EXTENSIONS: undefined;

  // Environment Non-binary Requests
  SET_USER_SETTING: SettingKey<any>;
  SET_INTERNAL_SETTING: SettingKey<any>;
  //#endregion

  // ---------------------------------------

  //#region [Node args] --> Browser
  // Environment Non-binary Events
  USER_SETTING_UPDATE: SettingKey<any>;
  INTERNAL_SETTING_UPDATE: SettingKey<any>;

  // Window Events
  MAXIMIZED: undefined;
  MINIMIZED: undefined;
  RESTORED: undefined;
}
