import { BrowserWindow, ipcMain, Menu, MenuItem } from "electron";
import * as path from "path";

import { IPC_CHANNELS } from "@src/common/common/ipcChannels";

import InitializationArgs from "./common/classes/initializationArgs";
import CommonPanelColumn from "./common/classes/panelColumn";
import CommonPanelRow from "./common/classes/panelRow";

import CommonLayoutConfig from "./common/classes/commonLayoutConfig";
import Tab from "./common/classes/tab";
import I18nService from "../../common/node/services/i18n/i18nService";
import Marketplace from "../marketplace/marketplace";
import CommonViewMain from "../common/commonViewMain";
import { EDITOR_IPC_CHANNELS } from "./common/ipcChannels";
import ExtensionManager from "../common/extensionManager";
import EditorDevTools from "../editorDevTools/editorDevTools";
import { EditorExtensionBridgeCommand } from "./browser/service/editorExtensionBridge";

const WINDOW_HEIGHT = 600;
const WINDOW_WIDTH = 800;

export default class Editor {
  public browserWindow?: BrowserWindow;
  private commonMain?: CommonViewMain;

  private marketplace?: Marketplace;
  private editorDevTools?: EditorDevTools;

  constructor(private i18nService: I18nService) {
    this.removeListeners = this.removeListeners.bind(this);
    this.handleGetWorkspaceConfigs = this.handleGetWorkspaceConfigs.bind(this);
    this.handleShowMarketplace = this.handleShowMarketplace.bind(this);
    this.handleShowEditorDevTools = this.handleShowEditorDevTools.bind(this);

    this.createWindow(i18nService);
  }

  private createWindow(i18nService: I18nService) {
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

    this.startIpc();

    this.browserWindow.loadFile(path.join(__dirname, "browser", "index.html"));
    // this.browserWindow.webContents.openDevTools();

    this.browserWindow.on("closed", () => {
      this.browserWindow = undefined;
    });

    this.commonMain = new CommonViewMain(this.browserWindow, i18nService);
    // this.commonMain.onWindowReady.addListener(this.onWindowReady.bind(this));
  }

  private startIpc() {
    ipcMain.addListener(EDITOR_IPC_CHANNELS.GET_WORKSPACE_CONFIGS, this.handleGetWorkspaceConfigs);
    ipcMain.addListener(EDITOR_IPC_CHANNELS.OPEN_EDITOR_DEVTOOLS, this.handleShowEditorDevTools);
    ipcMain.addListener(EDITOR_IPC_CHANNELS.OPEN_MARKETPLACE, this.handleShowMarketplace);

    if (this.browserWindow) {
      this.browserWindow.addListener("closed", this.removeListeners);
    }
  }

  private removeListeners() {
    ipcMain.removeListener(EDITOR_IPC_CHANNELS.GET_WORKSPACE_CONFIGS, this.handleGetWorkspaceConfigs);
    ipcMain.removeListener(EDITOR_IPC_CHANNELS.OPEN_EDITOR_DEVTOOLS, this.handleShowEditorDevTools);
    ipcMain.removeListener(EDITOR_IPC_CHANNELS.OPEN_MARKETPLACE, this.handleShowMarketplace);

    if (this.browserWindow) {
      this.browserWindow.removeListener("closed", this.removeListeners);
    }
  }

  private handleGetWorkspaceConfigs(event: Electron.Event) {
    if (this.isCurrentWindow(event.sender)) {
      event.returnValue = this.getConfigs();
    }
  }

  private handleShowMarketplace(event: Electron.Event) {
    if (this.isCurrentWindow(event.sender)) {
      this.showMarketplace();
    }
  }

  private handleShowEditorDevTools(event: Electron.Event) {
    if (this.isCurrentWindow(event.sender)) {
      this.showEditorDevTools();
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
    if (!this.marketplace && this.browserWindow) {
      this.marketplace = new Marketplace(this.i18nService, this.browserWindow);

      this.marketplace.onClose.addListener(() => {
        this.marketplace = undefined;
      });
    }
  }

  private showEditorDevTools() {
    if (!this.editorDevTools && this.browserWindow) {
      ipcMain.once(
        EDITOR_IPC_CHANNELS.GET_EXT_COMMANDS_RETURN,
        (event: Electron.Event, commands: { [key: string]: EditorExtensionBridgeCommand }) => {
          if (this.isCurrentWindow(event.sender)) {
            if (!this.editorDevTools && this.browserWindow) {
              this.editorDevTools = new EditorDevTools(this.i18nService, this.browserWindow, commands);

              this.editorDevTools.onClose.addListener(() => {
                this.editorDevTools = undefined;
              });
            }
          }
        }
      );

      this.browserWindow.webContents.send(EDITOR_IPC_CHANNELS.GET_EXT_COMMANDS);
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
