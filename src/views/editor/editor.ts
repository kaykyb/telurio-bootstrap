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
import InternalSettingsService from "@src/common/node/services/settings/internal/internalSettingsService";
import { IpcNodeService } from "@src/common/node/services/ipc/ipcNodeService";
import IEditorIpcArgs from "./common/ipc/EditorIpcServiceArgs";
import IEditorIpcReturns from "./common/ipc/EditorIpcServiceReturns";
import ICommandIndex from "@src/common/common/extensions/commandIndex";
import SettingsEditor from "../settingsEditor/settingsEditor";

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
  private settingsEditor?: SettingsEditor;

  private ipcService!: IpcNodeService<IEditorIpcArgs, IEditorIpcReturns>;

  constructor(
    private readonly i18nService: I18nService,
    private readonly userSettingsService: UserSettingsService,
    private readonly internalSettingsService: InternalSettingsService
  ) {
    this.bindMethods();
    this.createWindow(i18nService);
  }

  private bindMethods() {
    this.removeListeners = this.removeListeners.bind(this);
    this.handleGetWorkspaceConfigs = this.handleGetWorkspaceConfigs.bind(this);
    this.handleShowMarketplace = this.handleShowMarketplace.bind(this);
    this.handleShowEditorDevTools = this.handleShowEditorDevTools.bind(this);
    this.handleShowSettingsEditor = this.handleShowSettingsEditor.bind(this);
    this.handleUpdateExtCommands = this.handleUpdateExtCommands.bind(this);
  }

  private createWindow(i18nService: I18nService) {
    let targetWindowHeight = WINDOW_HEIGHT;
    let targetWindowWidth = WINDOW_WIDTH;
    let targetWindowX;
    let targetWindowY;
    let isMaximized;

    const windowState = this.internalSettingsService.settings.windowState;

    if (windowState && windowState.editor) {
      targetWindowHeight = windowState.editor.height;
      targetWindowWidth = windowState.editor.width;
      targetWindowX = windowState.editor.x;
      targetWindowY = windowState.editor.y;
      isMaximized = windowState.editor.maximized;
    }

    this.browserWindow = new BrowserWindow({
      height: targetWindowHeight,
      width: targetWindowWidth,

      x: targetWindowX,
      y: targetWindowY,

      frame: false,
      show: false,

      webPreferences: {
        contextIsolation: false,
        nodeIntegration: false,
        preload: path.join(__dirname, "browser", "preload.compiled.js")
      },

      backgroundColor: this.getWindowColor()
    });

    if (isMaximized) {
      this.browserWindow.once("show", () => {
        if (this.browserWindow) {
          this.browserWindow.maximize();
        }
      });
    }

    this.ipcService = new IpcNodeService<IEditorIpcArgs, IEditorIpcReturns>(this.browserWindow, "EDITOR");

    this.startIpc();

    this.browserWindow.loadFile(path.join(__dirname, "browser", "index.html"));

    this.browserWindow.webContents.toggleDevTools();

    this.browserWindow.on("closed", () => {
      this.browserWindow = undefined;
      this.commonMain = undefined;
    });

    this.commonMain = new CommonViewMain(
      this.browserWindow,
      i18nService,
      this.userSettingsService,
      this.internalSettingsService
    );

    this.commonMain.onCloseRequest.addListener(async () => {
      if (this.commonMain && this.browserWindow) {
        this.saveWindowState();
        this.saveEditorStateAndClose();
      }
    });
  }

  private getWindowColor(): string {
    const themeColors = this.internalSettingsService.settings.themeColors;

    if (themeColors && themeColors.background) {
      if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/.test(themeColors.background)) {
        return themeColors.background;
      }
    }

    return "#000000";
  }

  private startIpc() {
    if (this.browserWindow) {
      this.browserWindow.addListener("closed", this.removeListeners);
    }

    this.ipcService.addListener("GET_WORKSPACE_CONFIGS", this.handleGetWorkspaceConfigs);
    this.ipcService.addListener("OPEN_EDITOR_DEVTOOLS", this.handleShowEditorDevTools);
    this.ipcService.addListener("OPEN_MARKETPLACE", this.handleShowMarketplace);
    this.ipcService.addListener("OPEN_SETTINGS_EDITOR", this.handleShowSettingsEditor);
    this.ipcService.addListener("UPDATE_EXT_COMMANDS", this.handleUpdateExtCommands);
  }

  private removeListeners() {
    this.ipcService.removeAllListeners();

    if (this.browserWindow) {
      this.browserWindow.removeListener("closed", this.removeListeners);
    }
  }

  /**
   * Handle the IPC call for update the commands list on the Editor Dev Tools
   * @param event The Electron IPC Event
   * @param cmds The new Commands Array
   */
  private handleUpdateExtCommands(args: ICommandIndex) {
    if (this.editorDevTools) {
      this.editorDevTools.updateExtCommands(args);
    }
  }

  private handleGetWorkspaceConfigs(args: undefined, resolve: (returnValue: CommonLayoutConfig) => void) {
    resolve(this.getConfigs());
  }

  private handleShowMarketplace() {
    this.showMarketplace();
  }

  private handleShowEditorDevTools() {
    this.showEditorDevTools();
  }

  private handleShowSettingsEditor() {
    this.showSettingsWindow();
  }

  private getConfigs(): CommonLayoutConfig {
    return this.internalSettingsService.settings.editorState.layout;
  }

  // Methods
  private showMarketplace() {
    if (!this.marketplace && this.browserWindow) {
      this.marketplace = new Marketplace(
        this.i18nService,
        this.browserWindow,
        this.userSettingsService,
        this.internalSettingsService
      );

      this.marketplace.onClose.addListener(() => {
        this.marketplace = undefined;
      });
    }
  }

  private async showEditorDevTools() {
    if (this.editorDevTools) {
      return; // already open
    }

    const cmds = await this.ipcService.sendAndReturn("GET_EXT_COMMANDS");

    // maybe the user closed the window in te meantime
    if (this.browserWindow) {
      this.editorDevTools = new EditorDevTools(
        this.i18nService,
        this.browserWindow,
        cmds,
        this.userSettingsService,
        this.internalSettingsService
      );

      this.editorDevTools.onClose.addListener(() => {
        this.editorDevTools = undefined;
      });
    }
  }

  private showSettingsWindow() {
    if (!this.settingsEditor && this.browserWindow) {
      this.settingsEditor = new SettingsEditor(
        this.i18nService,
        this.browserWindow,
        this.userSettingsService,
        this.internalSettingsService
      );

      this.settingsEditor.onClose.addListener(() => {
        this.settingsEditor = undefined;
      });
    }
  }

  private saveWindowState() {
    if (!this.browserWindow) {
      return;
    }

    let windowState = this.internalSettingsService.settings.windowState;
    let currentState;

    if (this.browserWindow.isMaximized()) {
      currentState = { ...windowState.editor, maximized: true };
    } else {
      currentState = { ...this.browserWindow.getBounds(), maximized: false };
    }

    if (windowState) {
      windowState.editor = currentState;
    } else {
      windowState = {
        editor: windowState
      };
    }

    this.internalSettingsService.setSettingAndSave("windowState", windowState, false);
  }

  private async saveEditorStateAndClose() {
    if (!this.browserWindow) {
      return;
    }

    const layout = await this.ipcService.sendAndReturn("GET_EDITOR_LAYOUT");

    this.internalSettingsService.setSettingAndSave("editorState", { layout }, false);

    if (this.commonMain && this.browserWindow) {
      this.commonMain.removeListeners();
      this.browserWindow.close();
    }
  }
}
