import { BrowserWindow, ipcMain } from "electron";
import * as path from "path";

import CommonViewMain from "../common/node/commonViewMain";
import { EDITOR_DEV_TOOLS_IPC_CHANNELS } from "./common/editorDevToolsIpcChannels";

import I18nService from "@src/common/node/services/i18n/i18nService";
import CommonEvent from "@src/common/common/commonEvent";
import EditorExtensionBridgeCommand from "@src/common/common/extensions/editorExtensionBridgeCommand";
import UserSettingsService from "@src/common/node/services/settings/user/userSettingsService";
import InternalSettingsService from "@src/common/node/services/settings/internal/internalSettingsService";

const WINDOW_HEIGHT = 500;
const WINDOW_WIDTH = 800;

export default class EditorDevTools {
  public onClose = new CommonEvent();

  private commonMain?: CommonViewMain;
  private browserWindow?: BrowserWindow;

  constructor(
    i18nService: I18nService,
    private editorWindow: BrowserWindow,
    private editorCommands: { [key: string]: EditorExtensionBridgeCommand<any> },
    private userSettingsService: UserSettingsService,
    private readonly internalSettingsService: InternalSettingsService
  ) {
    // bind ipc event handlers
    this.handleSendCommands = this.handleSendCommands.bind(this);
    this.removeListeners = this.removeListeners.bind(this);

    // starts
    this.createWindow(i18nService);
  }

  public updateExtCommands(cmds: { [key: string]: EditorExtensionBridgeCommand<any> }) {
    if (this.browserWindow) {
      this.browserWindow.webContents.send(EDITOR_DEV_TOOLS_IPC_CHANNELS.UPDATE_EXT_COMMANDS, cmds);
    }
  }

  private createWindow(i18nService: I18nService) {
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

    this.commonMain = new CommonViewMain(
      this.browserWindow,
      i18nService,
      this.userSettingsService,
      this.internalSettingsService
    );
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
      this.browserWindow!.webContents.send(
        EDITOR_DEV_TOOLS_IPC_CHANNELS.GET_EXT_COMMANDS_RETURN,
        this.editorCommands
      );
    }
  }
  //#endregion
}
