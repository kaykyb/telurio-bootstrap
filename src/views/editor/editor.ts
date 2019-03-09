import { BrowserWindow, ipcMain, Menu, MenuItem } from "electron";
import * as path from "path";

import CommonPanelColumn from "./common/classes/panelColumn";
import CommonPanelRow from "./common/classes/panelRow";
import CommonLayoutConfig from "./common/classes/commonLayoutConfig";
import Tab from "./common/classes/tab";
import Marketplace from "../marketplace/marketplace";
import CommonViewMain from "../common/node/commonViewMain";
import { EDITOR_IPC_CHANNELS } from "./common/ipcChannels";
import EditorDevTools from "../editorDevTools/editorDevTools";

import I18nService from "@src/common/node/services/i18n/i18nService";
import EditorExtensionBridgeCommand from "@src/common/common/extensions/editorExtensionBridgeCommand";
import UserSettingsService from "@src/common/node/services/settings/user/userSettingsService";

// the sizes to use to create the window
const WINDOW_HEIGHT = 600;
const WINDOW_WIDTH = 800;

/**
 * Starts as new Editor Window
 */
export default class Editor {
  public browserWindow?: BrowserWindow;
  private commonMain?: CommonViewMain;

  // editor window dialogs
  private marketplace?: Marketplace;
  private editorDevTools?: EditorDevTools;

  constructor(
    private readonly i18nService: I18nService,
    private readonly userSettingsService: UserSettingsService
  ) {
    this.bindMethods();
    this.createWindow(i18nService);
  }

  private bindMethods() {
    this.removeListeners = this.removeListeners.bind(this);
    this.handleGetWorkspaceConfigs = this.handleGetWorkspaceConfigs.bind(this);
    this.handleShowMarketplace = this.handleShowMarketplace.bind(this);
    this.handleShowEditorDevTools = this.handleShowEditorDevTools.bind(this);
    this.handleUpdateExtCommands = this.handleUpdateExtCommands.bind(this);
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
    this.browserWindow.webContents.openDevTools();

    this.browserWindow.on("closed", () => {
      this.browserWindow = undefined;
    });

    this.commonMain = new CommonViewMain(this.browserWindow, i18nService, this.userSettingsService);
  }

  private startIpc() {
    ipcMain.addListener(EDITOR_IPC_CHANNELS.GET_WORKSPACE_CONFIGS, this.handleGetWorkspaceConfigs);
    ipcMain.addListener(EDITOR_IPC_CHANNELS.OPEN_EDITOR_DEVTOOLS, this.handleShowEditorDevTools);
    ipcMain.addListener(EDITOR_IPC_CHANNELS.OPEN_MARKETPLACE, this.handleShowMarketplace);
    ipcMain.addListener(EDITOR_IPC_CHANNELS.UPDATE_EXT_COMMANDS, this.handleUpdateExtCommands);

    if (this.browserWindow) {
      this.browserWindow.addListener("closed", this.removeListeners);
    }
  }

  private removeListeners() {
    ipcMain.removeListener(EDITOR_IPC_CHANNELS.GET_WORKSPACE_CONFIGS, this.handleGetWorkspaceConfigs);
    ipcMain.removeListener(EDITOR_IPC_CHANNELS.OPEN_EDITOR_DEVTOOLS, this.handleShowEditorDevTools);
    ipcMain.removeListener(EDITOR_IPC_CHANNELS.OPEN_MARKETPLACE, this.handleShowMarketplace);
    ipcMain.removeListener(EDITOR_IPC_CHANNELS.UPDATE_EXT_COMMANDS, this.handleUpdateExtCommands);

    if (this.browserWindow) {
      this.browserWindow.removeListener("closed", this.removeListeners);
    }
  }

  /**
   * Handle the IPC call for update the commands list on the Editor Dev Tools
   * @param event The Electron IPC Event
   * @param cmds The new Commands Array
   */
  private handleUpdateExtCommands(
    event: Electron.Event,
    cmds: { [key: string]: EditorExtensionBridgeCommand<any> }
  ) {
    if (this.editorDevTools && this.isCurrentWindow(event.sender)) {
      this.editorDevTools.updateExtCommands(cmds);
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

  private getConfigs(): CommonLayoutConfig {
    return new CommonLayoutConfig(
      new CommonPanelRow(600, [
        new CommonPanelColumn(800, [
          new CommonPanelRow(400, [
            new CommonPanelColumn(300, [
              new CommonPanelRow(400, undefined, [
                new Tab("cake", "a", "Painel A", "0", true),
                new Tab("cake", "b", "Painel B")
              ]),
              new CommonPanelRow(200, undefined, [
                new Tab("cake", "c", "Painel C"),
                new Tab("cake", "d", "Painel D", "0", true)
              ])
            ]),
            new CommonPanelColumn(500, undefined, [
              new Tab("cake", "e", "Painel E", "0", true),
              new Tab("cake", "f", "Painel F")
            ])
          ]),
          new CommonPanelRow(200, undefined, [
            new Tab("cake", "g", "Painel G", "0", true),
            new Tab("cake", "h", "Painel H")
          ])
        ])
      ])
    );
  }

  // Methods
  private showMarketplace() {
    if (!this.marketplace && this.browserWindow) {
      this.marketplace = new Marketplace(this.i18nService, this.browserWindow, this.userSettingsService);

      this.marketplace.onClose.addListener(() => {
        this.marketplace = undefined;
      });
    }
  }

  private showEditorDevTools() {
    if (!this.editorDevTools && this.browserWindow) {
      ipcMain.once(
        EDITOR_IPC_CHANNELS.GET_EXT_COMMANDS_RETURN,
        (event: Electron.Event, commands: { [key: string]: EditorExtensionBridgeCommand<any> }) => {
          if (this.isCurrentWindow(event.sender)) {
            if (!this.editorDevTools && this.browserWindow) {
              this.editorDevTools = new EditorDevTools(
                this.i18nService,
                this.browserWindow,
                commands,
                this.userSettingsService
              );

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

  /**
   * Check if a window is this.browserWindow.
   * @param webContents Electron webContents to compare to this.browserWindow.webContents
   */
  private isCurrentWindow(webContents: any): boolean {
    if (this.browserWindow && this.browserWindow.webContents) {
      if (this.browserWindow.webContents === webContents) {
        return true;
      }
    }

    return false;
  }
}
