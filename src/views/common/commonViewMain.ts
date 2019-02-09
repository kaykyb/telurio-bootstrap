import { BrowserWindow, ipcMain } from "electron";
import * as path from "path";

import { IPC_CHANNELS } from "../../common/common/ipcChannels";
import I18nService from "../../common/node/services/i18n/i18nService";
import I18nArgs from "../../common/common/ipcEvents/i18nArgs";
import Editor from "../editor/editor";
import CommonEvent from "../../common/common/commonEvent";
import CommonViewInitArgs from "./commonViewInitArgs";

export default class CommonViewMain {
  public onWindowReady = new CommonEvent();

  private browserWindow?: BrowserWindow;
  private i18nJson: string;
  private i18nService: I18nService;

  constructor(browserWindow: BrowserWindow, i18nService: I18nService, i18nJson: string) {
    this.i18nService = i18nService;
    this.i18nJson = i18nJson;
    this.browserWindow = browserWindow;

    this.handleBrowserReady = this.handleBrowserReady.bind(this);
    this.handleCloseRequest = this.handleCloseRequest.bind(this);
    this.handleShowDevTools = this.handleShowDevTools.bind(this);
    this.handleClosing = this.handleClosing.bind(this);

    this.startIpc();
  }

  public removeListeners() {
    ipcMain.removeListener(IPC_CHANNELS.BROWSER_READY, this.handleBrowserReady);
    ipcMain.removeListener(IPC_CHANNELS.CLOSE_REQUEST, this.handleCloseRequest);
    ipcMain.removeListener(IPC_CHANNELS.SHOW_DEV_TOOLS, this.handleShowDevTools);
    if (this.browserWindow) {
      this.browserWindow.removeListener("closed", this.handleClosing);
    }
  }

  private startIpc() {
    ipcMain.addListener(IPC_CHANNELS.BROWSER_READY, this.handleBrowserReady);
    ipcMain.addListener(IPC_CHANNELS.CLOSE_REQUEST, this.handleCloseRequest);
    ipcMain.addListener(IPC_CHANNELS.SHOW_DEV_TOOLS, this.handleShowDevTools);
    if (this.browserWindow) {
      this.browserWindow.addListener("closed", this.handleClosing);
    }
  }

  private handleClosing() {
    this.removeListeners();
  }

  private handleBrowserReady(event: Electron.Event) {
    if (this.browserWindow && this.browserWindow.webContents) {
      if (this.browserWindow.webContents === event.sender) {
        // send common configs
        event.returnValue = this.getCommonConfigs();
        this.onWindowReady.propagate({});
      }
    }
  }

  private handleCloseRequest(event: Electron.Event) {
    if (this.browserWindow) {
      this.browserWindow.close();
    }
  }

  private handleShowDevTools(event: Electron.Event) {
    if (this.browserWindow) {
      this.browserWindow.webContents.toggleDevTools();
    }
  }

  private getCommonConfigs(): CommonViewInitArgs {
    const i18nArgs = new I18nArgs(this.i18nService.locale, this.i18nJson);
    return new CommonViewInitArgs(i18nArgs);
  }
}
