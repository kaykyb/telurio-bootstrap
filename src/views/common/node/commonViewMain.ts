import { BrowserWindow, ipcMain } from "electron";
import * as path from "path";

import I18nService from "@src/common/node/services/i18n/i18nService";
import I18nArgs from "@src/common/common/ipcEvents/i18nArgs";
import CommonEvent from "@src/common/common/commonEvent";
import CommonViewInitArgs from "../common/commonViewInitArgs";
import ExtensionManager from "./extensionManager";
import UserSettingsService from "@src/common/node/services/settings/user/userSettingsService";
import UserSettingsArgs from "@src/common/common/ipcEvents/userSettingsArgs";
import LoadableExtension from "@src/common/common/extensions/loadableExtension";
import InternalSettingsService from "@src/common/node/services/settings/internal/internalSettingsService";
import InternalSettingsArgs from "@src/common/common/ipcEvents/internalSettingsArgs";
import { IpcNodeService } from "@src/common/node/services/ipc/ipcNodeService";
import ICommonViewIpcReturns from "../common/ipc/CommonViewIpcReturns";
import ICommonViewIpcArgs from "../common/ipc/CommonViewIpcArgs";
import SettingKey from "@src/common/node/services/settings/settingKey";
import { ENV } from "@src/env";

export default class CommonViewMain {
  public onWindowReady = new CommonEvent();
  public onCloseRequest = new CommonEvent();

  private extensionsManager: ExtensionManager = new ExtensionManager();
  private ipcService: IpcNodeService<ICommonViewIpcArgs, ICommonViewIpcReturns>;

  constructor(
    private readonly browserWindow: BrowserWindow,
    private readonly i18nService: I18nService,
    private readonly userSettingsService: UserSettingsService,
    private readonly internalSettingsService: InternalSettingsService
  ) {
    this.ipcService = new IpcNodeService<ICommonViewIpcArgs, ICommonViewIpcReturns>(
      browserWindow,
      ENV.IPC_COMMON_PREFIX
    );

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

    this.ipcService.removeAllListeners();

    if (this.browserWindow) {
      this.browserWindow.removeListener("closed", this.handleClosing);
      this.browserWindow.removeListener("minimize", this.handleWindowMinimize);
      this.browserWindow.removeListener("restore", this.handleWindowRestore);
      this.browserWindow.removeListener("maximize", this.handleWindowMaximize);
    }
  }

  private startIpc() {
    const ipc = this.ipcService;

    this.userSettingsService.onSettingChange.addListener(this.handleUserSettingChange);
    this.internalSettingsService.onSettingChange.addListener(this.handleInternalSettingChange);

    // Initialization Events
    ipc.addListener("BROWSER_READY", this.handleBrowserReady);
    ipc.addListener("READY_TO_SHOW", this.handleShow);

    // Window Commands
    ipc.addListener("TOGGLE_DEV_TOOLS", this.handleShowDevTools);
    ipc.addListener("CLOSE", this.handleCloseRequest);
    ipc.addListener("MAXIMIZE_OR_RESTORE", this.handleMaximizeOrRestoreRequest);
    ipc.addListener("MINIMIZE", this.handleMinimizeRequest);

    // Window Binary Questions
    ipc.addListener("IS_MAXIMIZED", this.handleIsMaximized);
    ipc.addListener("IS_WINDOW_CLOSABLE", this.handleGetClosable);
    ipc.addListener("IS_WINDOW_MAXIMIZABLE", this.handleGetMaximizable);
    ipc.addListener("IS_WINDOW_MINIMIZABLE", this.handleGetMinimizable);

    // Environment Non-binary Questions
    ipc.addListener("GET_EXTENSIONS", this.handleLoadExtensions);

    // Environement Non-binary Requests
    ipc.addListener("SET_USER_SETTING", this.handleSetUserSetting);
    ipc.addListener("SET_INTERNAL_SETTING", this.handleSetInternalSetting);

    if (this.browserWindow) {
      this.browserWindow.addListener("closed", this.handleClosing);
      this.browserWindow.addListener("minimize", this.handleWindowMinimize);
      this.browserWindow.addListener("unmaximize", this.handleWindowRestore);
      this.browserWindow.addListener("maximize", this.handleWindowMaximize);
    }
  }

  private handleGetMaximizable(args: undefined, callback: (returnValue: boolean) => void) {
    callback(this.browserWindow.isMaximizable());
  }

  private handleGetMinimizable(args: undefined, callback: (returnValue: boolean) => void) {
    callback(this.browserWindow.isMinimizable());
  }

  private handleGetClosable(args: undefined, callback: (returnValue: boolean) => void) {
    callback(this.browserWindow.isClosable());
  }

  private handleIsMaximized(args: undefined, callback: (returnValue: boolean) => void) {
    callback(this.browserWindow.isMaximized());
  }

  private handleWindowMinimize() {
    this.ipcService.send("MINIMIZED");
  }

  private handleWindowRestore() {
    this.ipcService.send("RESTORED");
  }

  private handleWindowMaximize() {
    this.ipcService.send("MAXIMIZED");
  }

  private handleUserSettingChange(setting: SettingKey<any>) {
    this.ipcService.send("USER_SETTING_UPDATE", setting);
  }

  private handleSetUserSetting(setting: SettingKey<any>) {
    this.userSettingsService.setSettingAndSave(setting.key, setting.value);
  }

  private handleInternalSettingChange(setting: SettingKey<any>) {
    this.ipcService.send("INTERNAL_SETTING_UPDATE", setting);
  }

  private handleSetInternalSetting(setting: SettingKey<any>) {
    this.internalSettingsService.setSettingAndSave(setting.key, setting.value);
  }

  private handleShow() {
    this.browserWindow.show();
  }

  private handleClosing() {
    // this.onCloseRequest.propagate({});
  }

  private handleLoadExtensions(args: undefined, callback: (returnValue: LoadableExtension[]) => void) {
    if (this.extensionsManager) {
      const internalExtDir = path.join(__dirname, "..", "..", "..", "parts");
      const exts = this.extensionsManager
        .loadExtensionsDir(internalExtDir)
        .map<LoadableExtension>(v => new LoadableExtension(v, ENV.INTERNAL_EXT_PROTOCOL, internalExtDir));

      callback(exts);
    }
  }

  private handleBrowserReady(args: undefined, callback: (returnValue: CommonViewInitArgs) => void) {
    callback(this.getInitArgs());
    this.onWindowReady.propagate({});
  }

  private handleCloseRequest() {
    this.onCloseRequest.propagate({});
  }

  private handleShowDevTools() {
    this.browserWindow.webContents.toggleDevTools();
  }

  private handleMaximizeOrRestoreRequest() {
    if (this.browserWindow!.isMaximized()) {
      this.browserWindow!.restore();
      return;
    }
    this.browserWindow!.maximize();
  }

  private handleMinimizeRequest() {
    this.browserWindow.minimize();
  }

  private getInitArgs(): CommonViewInitArgs {
    const i18nArgs = new I18nArgs(this.i18nService.language!);
    const userSettingsArgs = new UserSettingsArgs(this.userSettingsService.settings);
    const internalSettingsArgs = new InternalSettingsArgs(this.internalSettingsService.settings);

    return new CommonViewInitArgs(i18nArgs, userSettingsArgs, internalSettingsArgs);
  }
}
