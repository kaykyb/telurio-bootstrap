import { BrowserWindow, ipcMain } from "electron";
import * as path from "path";

import { IPC_CHANNELS } from "@src/common/common/ipcChannels";
import I18nService from "@src/common/node/services/i18n/i18nService";
import I18nArgs from "@src/common/common/ipcEvents/i18nArgs";
import CommonEvent from "@src/common/common/commonEvent";
import CommonViewInitArgs from "../common/commonViewInitArgs";
import ExtensionManager from "./extensionManager";
import UserSettingsService from "@src/common/node/services/settings/user/userSettingsService";
import UserSettingsArgs from "@src/common/common/ipcEvents/userSettingsArgs";
import LoadableExtension from "@src/common/common/extensions/loadableExtension";
import NodeUtil from "@src/common/node/util";
import InternalSettingsService from "@src/common/node/services/settings/internal/internalSettingsService";
import InternalSettingsArgs from "@src/common/common/ipcEvents/internalSettingsArgs";

export default class CommonViewMain {
  public onWindowReady = new CommonEvent();

  private extensionsManager: ExtensionManager = new ExtensionManager();

  constructor(
    private readonly browserWindow: BrowserWindow,
    private readonly i18nService: I18nService,
    private readonly userSettingsService: UserSettingsService,
    private readonly internalSettingsService: InternalSettingsService
  ) {
    // binds
    this.handleBrowserReady = this.handleBrowserReady.bind(this);
    this.handleCloseRequest = this.handleCloseRequest.bind(this);
    this.handleShowDevTools = this.handleShowDevTools.bind(this);
    this.handleLoadExtensions = this.handleLoadExtensions.bind(this);
    this.handleSetUserSetting = this.handleSetUserSetting.bind(this);
    this.handleUserSettingChange = this.handleUserSettingChange.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClosing = this.handleClosing.bind(this);
    this.handleMinimizeRequest = this.handleMinimizeRequest.bind(this);
    this.handleMaximizeOrRestoreRequest = this.handleMaximizeOrRestoreRequest.bind(this);
    this.handleWindowMaximize = this.handleWindowMaximize.bind(this);
    this.handleWindowMinimize = this.handleWindowMinimize.bind(this);
    this.handleWindowRestore = this.handleWindowRestore.bind(this);
    this.handleIsMaximized = this.handleIsMaximized.bind(this);
    this.handleGetClosable = this.handleGetClosable.bind(this);
    this.handleGetMaximizable = this.handleGetMaximizable.bind(this);
    this.handleGetMinimizable = this.handleGetMinimizable.bind(this);

    this.startIpc();
  }

  public removeListeners() {
    this.userSettingsService.onSettingChange.removeListener(this.handleUserSettingChange);
    this.internalSettingsService.onSettingChange.removeListener(this.handleInternalSettingChange);

    ipcMain.removeListener(IPC_CHANNELS.BROWSER_READY, this.handleBrowserReady);
    ipcMain.removeListener(IPC_CHANNELS.CLOSE_REQUEST, this.handleCloseRequest);
    ipcMain.removeListener(IPC_CHANNELS.SHOW_DEV_TOOLS, this.handleShowDevTools);
    ipcMain.removeListener(IPC_CHANNELS.GET_EXTENSIONS, this.handleLoadExtensions);
    ipcMain.removeListener(IPC_CHANNELS.READY_TO_SHOW, this.handleShow);
    ipcMain.removeListener(IPC_CHANNELS.SET_USER_SETTING, this.handleSetUserSetting);
    ipcMain.removeListener(IPC_CHANNELS.SET_INTERNAL_SETTING, this.handleSetInternalSetting);
    ipcMain.removeListener(IPC_CHANNELS.MINIMIZE, this.handleMinimizeRequest);
    ipcMain.removeListener(IPC_CHANNELS.MAXIMIZE_OR_RESTORE, this.handleMaximizeOrRestoreRequest);
    ipcMain.removeListener(IPC_CHANNELS.IS_MAXIMIZED, this.handleIsMaximized);
    ipcMain.removeListener(IPC_CHANNELS.IS_WINDOW_CLOSABLE, this.handleGetClosable);
    ipcMain.removeListener(IPC_CHANNELS.IS_WINDOW_MAXIMIZABLE, this.handleGetMaximizable);
    ipcMain.removeListener(IPC_CHANNELS.IS_WINDOW_MINIMIZABLE, this.handleGetMinimizable);

    if (this.browserWindow) {
      this.browserWindow.removeListener("closed", this.handleClosing);
      this.browserWindow.removeListener("minimize", this.handleWindowMinimize);
      this.browserWindow.removeListener("restore", this.handleWindowRestore);
      this.browserWindow.removeListener("maximize", this.handleWindowMaximize);
    }
  }

  private startIpc() {
    this.userSettingsService.onSettingChange.addListener(this.handleUserSettingChange);
    this.internalSettingsService.onSettingChange.addListener(this.handleInternalSettingChange);

    ipcMain.addListener(IPC_CHANNELS.BROWSER_READY, this.handleBrowserReady);
    ipcMain.addListener(IPC_CHANNELS.CLOSE_REQUEST, this.handleCloseRequest);
    ipcMain.addListener(IPC_CHANNELS.SHOW_DEV_TOOLS, this.handleShowDevTools);
    ipcMain.addListener(IPC_CHANNELS.GET_EXTENSIONS, this.handleLoadExtensions);
    ipcMain.addListener(IPC_CHANNELS.READY_TO_SHOW, this.handleShow);
    ipcMain.addListener(IPC_CHANNELS.SET_USER_SETTING, this.handleSetUserSetting);
    ipcMain.addListener(IPC_CHANNELS.SET_INTERNAL_SETTING, this.handleSetInternalSetting);
    ipcMain.addListener(IPC_CHANNELS.MINIMIZE, this.handleMinimizeRequest);
    ipcMain.addListener(IPC_CHANNELS.MAXIMIZE_OR_RESTORE, this.handleMaximizeOrRestoreRequest);
    ipcMain.addListener(IPC_CHANNELS.IS_MAXIMIZED, this.handleIsMaximized);
    ipcMain.addListener(IPC_CHANNELS.IS_WINDOW_CLOSABLE, this.handleGetClosable);
    ipcMain.addListener(IPC_CHANNELS.IS_WINDOW_MAXIMIZABLE, this.handleGetMaximizable);
    ipcMain.addListener(IPC_CHANNELS.IS_WINDOW_MINIMIZABLE, this.handleGetMinimizable);

    if (this.browserWindow) {
      this.browserWindow.addListener("closed", this.handleClosing);
      this.browserWindow.addListener("minimize", this.handleWindowMinimize);
      this.browserWindow.addListener("unmaximize", this.handleWindowRestore);
      this.browserWindow.addListener("maximize", this.handleWindowMaximize);
    }
  }

  private handleGetMaximizable(event: Electron.Event) {
    if (this.isCurrentWindow(event.sender)) {
      event.returnValue = this.browserWindow.isMaximizable();
    }
  }

  private handleGetMinimizable(event: Electron.Event) {
    if (this.isCurrentWindow(event.sender)) {
      event.returnValue = this.browserWindow.isMinimizable();
    }
  }

  private handleGetClosable(event: Electron.Event) {
    if (this.isCurrentWindow(event.sender)) {
      event.returnValue = this.browserWindow.isClosable();
    }
  }

  private handleIsMaximized(event: Electron.Event) {
    if (this.isCurrentWindow(event.sender)) {
      event.returnValue = this.browserWindow.isMaximized();
    }
  }

  private handleWindowMinimize() {
    this.browserWindow.webContents.send(IPC_CHANNELS.MINIMIZED);
  }

  private handleWindowRestore() {
    this.browserWindow.webContents.send(IPC_CHANNELS.RESTORED);
  }

  private handleWindowMaximize() {
    this.browserWindow.webContents.send(IPC_CHANNELS.MAXIMIZED);
  }

  private handleUserSettingChange(setting: { key: string; value: any }) {
    this.browserWindow.webContents.send(IPC_CHANNELS.USER_SETTINGS_UPDATE, setting);
  }

  private handleSetUserSetting(event: Electron.Event, setting: { key: string; value: any }) {
    if (this.isCurrentWindow(event.sender)) {
      this.userSettingsService.setSettingAndSave(setting.key, setting.value);
    }
  }

  private handleInternalSettingChange(setting: { key: string; value: any }) {
    this.browserWindow.webContents.send(IPC_CHANNELS.INTERNAL_SETTINGS_UPDATE, setting);
  }

  private handleSetInternalSetting(event: Electron.Event, setting: { key: string; value: any }) {
    if (this.isCurrentWindow(event.sender)) {
      this.internalSettingsService.setSettingAndSave(setting.key, setting.value);
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
      const srcDir = path.join(__dirname, "..", "..", "..", "parts");
      event.returnValue = this.extensionsManager
        .loadExtensionsDir(srcDir)
        .map<LoadableExtension>(v => new LoadableExtension(v, "telurio-ext://", srcDir));
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

  private handleMaximizeOrRestoreRequest(event: Electron.Event) {
    if (this.isCurrentWindow(event.sender)) {
      if (this.browserWindow!.isMaximized()) {
        this.browserWindow!.restore();
      } else {
        this.browserWindow!.maximize();
      }
    }
  }

  private handleMinimizeRequest(event: Electron.Event) {
    if (this.isCurrentWindow(event.sender)) {
      this.browserWindow.minimize();
    }
  }

  private getCommonConfigs(): CommonViewInitArgs {
    const i18nArgs = new I18nArgs(this.i18nService.language!);
    const userSettingsArgs = new UserSettingsArgs(this.userSettingsService.settings);
    const internalSettingsArgs = new InternalSettingsArgs(this.internalSettingsService.settings);

    return new CommonViewInitArgs(i18nArgs, userSettingsArgs, internalSettingsArgs);
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
