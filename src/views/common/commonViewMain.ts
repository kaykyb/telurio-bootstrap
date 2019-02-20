import { BrowserWindow, ipcMain } from "electron";
import * as path from "path";

import { IPC_CHANNELS } from "@src/common/common/ipcChannels";
import I18nService from "@src/common/node/services/i18n/i18nService";
import I18nArgs from "@src/common/common/ipcEvents/i18nArgs";
import CommonEvent from "@src/common/common/commonEvent";
import CommonViewInitArgs from "./commonViewInitArgs";
import ExtensionManager from "./extensionManager";

export default class CommonViewMain {
  public onWindowReady = new CommonEvent();

  private extensionsManager: ExtensionManager = new ExtensionManager();

  constructor(private browserWindow: BrowserWindow, private i18nService: I18nService) {
    this.handleBrowserReady = this.handleBrowserReady.bind(this);
    this.handleCloseRequest = this.handleCloseRequest.bind(this);
    this.handleShowDevTools = this.handleShowDevTools.bind(this);
    this.handleLoadExtensions = this.handleLoadExtensions.bind(this);

    this.handleShow = this.handleShow.bind(this);
    this.handleClosing = this.handleClosing.bind(this);

    this.startIpc();
  }

  public removeListeners() {
    ipcMain.removeListener(IPC_CHANNELS.BROWSER_READY, this.handleBrowserReady);
    ipcMain.removeListener(IPC_CHANNELS.CLOSE_REQUEST, this.handleCloseRequest);
    ipcMain.removeListener(IPC_CHANNELS.SHOW_DEV_TOOLS, this.handleShowDevTools);
    ipcMain.removeListener(IPC_CHANNELS.GET_EXTENSIONS, this.handleLoadExtensions);
    ipcMain.removeListener(IPC_CHANNELS.READY_TO_SHOW, this.handleShow);

    if (this.browserWindow) {
      this.browserWindow.removeListener("closed", this.handleClosing);
    }
  }

  private startIpc() {
    ipcMain.addListener(IPC_CHANNELS.BROWSER_READY, this.handleBrowserReady);
    ipcMain.addListener(IPC_CHANNELS.CLOSE_REQUEST, this.handleCloseRequest);
    ipcMain.addListener(IPC_CHANNELS.SHOW_DEV_TOOLS, this.handleShowDevTools);
    ipcMain.addListener(IPC_CHANNELS.GET_EXTENSIONS, this.handleLoadExtensions);
    ipcMain.addListener(IPC_CHANNELS.READY_TO_SHOW, this.handleShow);

    if (this.browserWindow) {
      this.browserWindow.addListener("closed", this.handleClosing);
    }
  }

  private handleShow(event: Electron.Event) {
    if (this.isCurrentWindow(event.sender)) {
      this.browserWindow.show();
    }
  }

  private handleClosing() {
    this.removeListeners();
  }

  private handleLoadExtensions(event: Electron.Event) {
    if (this.isCurrentWindow(event.sender) && this.extensionsManager) {
      // Array<{ exts: ExtensionManifest[]; sourceDir: string }>
      const srcDir = path.join(__dirname, "..", "..", "parts");
      event.returnValue = [{ exts: this.extensionsManager.loadExtensionsDir(srcDir), sourceDir: "file:///" + srcDir }];
    }
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
    if (this.browserWindow && this.browserWindow.webContents) {
      if (this.browserWindow.webContents === event.sender) {
        if (this.browserWindow) {
          this.browserWindow.close();
        }
      }
    }
  }

  private handleShowDevTools(event: Electron.Event) {
    if (this.browserWindow && this.browserWindow.webContents) {
      if (this.browserWindow.webContents === event.sender) {
        if (this.browserWindow) {
          this.browserWindow.webContents.toggleDevTools();
        }
      }
    }
  }

  private getCommonConfigs(): CommonViewInitArgs {
    const i18nArgs = new I18nArgs(this.i18nService.language!);
    return new CommonViewInitArgs(i18nArgs);
  }

  private isCurrentWindow(webContents: any): boolean {
    if (this.browserWindow && this.browserWindow.webContents) {
      if (this.browserWindow.webContents === webContents) {
        return true;
      }
    }

    return false;
  }
}
