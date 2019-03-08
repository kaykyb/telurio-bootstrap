export const IPC_CHANNELS = {
  BROWSER_READY: "browserReady",
  IS_DEV: "isDev",

  IS_MAXIMIZED: "isMaximized",

  READY_TO_SHOW: "readyToShow",
  SHOW_DEV_TOOLS: "showDevTools",

  CLOSE_REQUEST: "closeRequest",
  MAXIMIZE_OR_RESTORE: "maximizeOrRestore",
  MINIMIZE: "minimize",

  MAXIMIZED: "closed",
  MINIMIZED: "minimized",
  RESTORED: "restored",

  IS_WINDOW_CLOSABLE: "isWindowClosable",
  IS_WINDOW_MAXIMIZABLE: "isWindowMaximizable",
  IS_WINDOW_MINIMIZABLE: "isWindowMinimizable",

  GET_EXTENSIONS: "LoadExtensions",

  /** Envia o I18nArgs */
  I18N_STRINGS: "i18nStrings",

  /** Argumentos de inicialização da UI do Editor. */
  INITIALIZATION_ARGUMENTS: "initializationArgs",

  SETTINGS_UPDATE: "settingsUpdate",
  SET_SETTING: "setSetting"
};
