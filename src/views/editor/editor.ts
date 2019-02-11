import { BrowserWindow, ipcMain, Menu, MenuItem } from "electron";
import * as path from "path";

import { IPC_CHANNELS } from "../../common/common/ipcChannels";

import InitializationArgs from "./common/classes/initializationArgs";
import CommonPanelColumn from "./common/classes/panelColumn";
import CommonPanelRow from "./common/classes/panelRow";

import CommonLayoutConfig from "./common/classes/commonLayoutConfig";
import Tab from "./common/classes/tab";
import I18nService from "../../common/node/services/i18n/i18nService";
import Marketplace from "../marketplace/marketplace";
import CommonViewMain from "../common/commonViewMain";
import { EDITOR_IPC_CHANNELS } from "./common/ipcChannels";
import ExtensionManager from "./extensionManager";

const WINDOW_HEIGHT = 600;
const WINDOW_WIDTH = 800;

export default class Editor {
  public browserWindow?: BrowserWindow;
  private commonMain?: CommonViewMain;
  private marketplace?: Marketplace;
  private extensionsManager: ExtensionManager = new ExtensionManager();

  constructor(private i18nService: I18nService, private i18nJson: string) {
    this.removeListeners = this.removeListeners.bind(this);

    this.handleGetWorkspaceConfigs = this.handleGetWorkspaceConfigs.bind(this);
    this.handleLoadExtensions = this.handleLoadExtensions.bind(this);

    this.createWindow(i18nService, i18nJson);
  }

  private createWindow(i18nService: I18nService, i18nJson: string) {
    this.browserWindow = new BrowserWindow({
      height: WINDOW_HEIGHT,
      width: WINDOW_WIDTH,

      frame: false,
      show: false,

      webPreferences: {
        contextIsolation: false,
        nodeIntegration: false,
        preload: path.join(__dirname, "browser", "preload.compiled.js")
      }
    });

    const windowMenu = new Menu();
    windowMenu.insert(
      0,
      new MenuItem({
        label: "Marketplace",

        click: () => this.showMarketplace()
      })
    );

    this.browserWindow.setMenu(windowMenu);

    this.startIpc();

    this.browserWindow.loadFile(path.join(__dirname, "browser", "index.html"));
    this.browserWindow.webContents.openDevTools();

    this.browserWindow.on("closed", () => {
      this.browserWindow = undefined;
    });

    this.commonMain = new CommonViewMain(this.browserWindow, i18nService, i18nJson);
    this.commonMain.onWindowReady.addListener(this.onWindowReady.bind(this));
  }

  private startIpc() {
    ipcMain.addListener(EDITOR_IPC_CHANNELS.GET_WORKSPACE_CONFIGS, this.handleGetWorkspaceConfigs);
    ipcMain.addListener(EDITOR_IPC_CHANNELS.LOAD_EXTENSIONS, this.handleLoadExtensions);

    if (this.browserWindow) {
      this.browserWindow.addListener("closed", this.removeListeners);
    }
  }

  private removeListeners() {
    ipcMain.removeListener(EDITOR_IPC_CHANNELS.GET_WORKSPACE_CONFIGS, this.handleGetWorkspaceConfigs);
    ipcMain.removeListener(EDITOR_IPC_CHANNELS.LOAD_EXTENSIONS, this.handleLoadExtensions);

    if (this.browserWindow) {
      this.browserWindow.removeListener("closed", this.removeListeners);
    }
  }

  private handleLoadExtensions(event: Electron.Event) {
    if (this.isCurrentWindow(event.sender) && this.extensionsManager) {
      // Array<{ exts: ExtensionManifest[]; sourceDir: string }>
      const srcDir = path.join(__dirname, "..", "..", "parts");
      event.returnValue = [{ exts: this.extensionsManager.loadExtensionsDir(srcDir), sourceDir: "file:///" + srcDir }];
    }
  }

  private handleGetWorkspaceConfigs(event: Electron.Event) {
    if (this.isCurrentWindow(event.sender)) {
      event.returnValue = this.getConfigs();
    }
  }

  private onWindowReady() {
    if (this.browserWindow) {
      this.browserWindow.show();
    }
  }

  private getConfigs(): CommonLayoutConfig {
    return new CommonLayoutConfig(
      new CommonPanelRow(600, [
        new CommonPanelColumn(800, [
          new CommonPanelRow(400, [
            new CommonPanelColumn(300, [
              new CommonPanelRow(400, undefined, [new Tab("a", "Painel A", true), new Tab("b", "Painel B")]),
              new CommonPanelRow(200, undefined, [new Tab("c", "Painel C"), new Tab("d", "Painel D", true)])
            ]),
            new CommonPanelColumn(500, undefined, [new Tab("e", "Painel E", true), new Tab("f", "Painel F")])
          ]),
          new CommonPanelRow(200, undefined, [new Tab("g", "Painel G", true), new Tab("h", "Painel H")])
        ])
      ])
    );
  }

  // Methods
  private showMarketplace() {
    if (!this.marketplace) {
      this.marketplace = new Marketplace(this.i18nService, this.i18nJson, this);

      this.marketplace.onClose.addListener(() => {
        this.marketplace = undefined;
      });
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
}
