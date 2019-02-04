import { BrowserWindow, ipcMain } from "electron";
import * as path from "path";

import { IPC_CHANNELS } from "../../common/common/ipcChannels";
import I18nService from "../../common/node/services/i18n/i18nService";
import I18nArgs from "../../common/common/ipcEvents/i18nArgs";

const WINDOW_HEIGHT = 500;
const WINDOW_WIDTH = 800;

export default class Marketplace {
  private browserWindow?: BrowserWindow;
  private i18nJson?: string;
  private i18nService: I18nService;

  constructor(i18nService: I18nService, i18nJson: string) {
    this.i18nService = i18nService;
    this.i18nJson = i18nJson;
    this.startIpc();
    this.createWindow();
  }

  private createWindow() {
    this.browserWindow = new BrowserWindow({
      height: WINDOW_HEIGHT,
      width: WINDOW_WIDTH,

      webPreferences: {
        contextIsolation: false,
        nodeIntegration: false,
        preload: path.join(__dirname, "browser", "preload.compiled.js")
      }
    });

    this.browserWindow.loadFile(path.join(__dirname, "browser", "index.html"));
    this.browserWindow.on("closed", () => {
      this.browserWindow = undefined;
    });
  }

  private startIpc() {
    ipcMain.on(IPC_CHANNELS.BROWSER_READY, (event: Electron.Event) => {
      if (this.browserWindow) {
        if (this.browserWindow.webContents === event.sender) {
          this.sendConfigs();
        }
      }
    });
  }

  private sendConfigs() {
    if (this.browserWindow) {
      this.browserWindow.webContents.send(IPC_CHANNELS.INITIALIZATION_ARGUMENTS, "");
      if (this.i18nJson) {
        this.browserWindow.webContents.send(
          IPC_CHANNELS.I18N_STRINGS,
          new I18nArgs(this.i18nService.locale, this.i18nJson)
        );

        this.i18nJson = undefined;
      }
    }
  }
}
