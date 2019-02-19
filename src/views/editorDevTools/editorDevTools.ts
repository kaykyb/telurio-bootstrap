import { BrowserWindow, ipcMain } from "electron";
import * as path from "path";

import I18nService from "@src/common/node/services/i18n/i18nService";
import Editor from "../editor/editor";
import CommonViewMain from "../common/commonViewMain";
import CommonEvent from "@src/common/common/commonEvent";
import { EditorExtensionBridgeCommand } from "../editor/browser/service/editorExtensionBridge";
import { EDITOR_DEV_TOOLS_IPC_CHANNELS } from "./common/editorDevToolsIpcChannels";

const WINDOW_HEIGHT = 500;
const WINDOW_WIDTH = 800;

export default class EditorDevTools {
  public onClose = new CommonEvent();

  private commonMain?: CommonViewMain;
  private browserWindow?: BrowserWindow;

  constructor(
    i18nService: I18nService,
    i18nJson: string,
    private editorWindow: BrowserWindow,
    private editorCommands: { [key: string]: EditorExtensionBridgeCommand }
  ) {
    // bind ipc event handlers
    this.handleSendCommands = this.handleSendCommands.bind(this);
    this.removeListeners = this.removeListeners.bind(this);

    // starts
    this.createWindow(i18nService, i18nJson);
  }

  private createWindow(i18nService: I18nService, i18nJson: string) {
    this.browserWindow = new BrowserWindow({
      height: WINDOW_HEIGHT,
      width: WINDOW_WIDTH,

      autoHideMenuBar: true,
      frame: false,
      maximizable: false,
      minimizable: false,
      parent: this.editorWindow,
      resizable: false,
      show: false,
      webPreferences: {
        contextIsolation: false,
        nodeIntegration: false,
        preload: path.join(__dirname, "browser", "preload.compiled.js")
      }
    });

    this.startIpc();

    this.browserWindow.loadFile(path.join(__dirname, "browser", "index.html"));
    this.browserWindow.on("closed", () => {
      this.browserWindow = undefined;
      this.commonMain = undefined;
      this.onClose.propagate({});
    });

    this.commonMain = new CommonViewMain(this.browserWindow, i18nService, i18nJson);
  }

  private startIpc() {
    ipcMain.addListener(EDITOR_DEV_TOOLS_IPC_CHANNELS.GET_EXT_COMMANDS, this.handleSendCommands);

    if (this.browserWindow) {
      this.browserWindow.addListener("closed", this.removeListeners);
    }
  }

  private removeListeners() {
    ipcMain.removeListener(EDITOR_DEV_TOOLS_IPC_CHANNELS.GET_EXT_COMMANDS, this.handleSendCommands);

    if (this.browserWindow) {
      this.browserWindow.removeListener("closed", this.removeListeners);
    }
  }

  private isCurrentWindow(webContents: any): boolean {
    if (this.browserWindow && this.browserWindow.webContents) {
      if (this.browserWindow.webContents === webContents) {
        return true;
      }
    }

    return false;
  }

  //#region IPC Event Handlers
  private handleSendCommands(event: Electron.Event) {
    if (this.isCurrentWindow(event.sender)) {
      this.browserWindow!.webContents.send(EDITOR_DEV_TOOLS_IPC_CHANNELS.GET_EXT_COMMANDS_RETURN, this.editorCommands);
    }
  }
  //#endregion
}
