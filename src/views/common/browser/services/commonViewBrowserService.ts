import CommonViewInitArgs from "@src/views/common/common/commonViewInitArgs";
import IpcBrowserService from "@src/common/browser/services/ipc/ipcBrowserService";
import I18nLanguageFile from "@src/common/node/services/i18n/i18nLanguageFile";
import CommonEvent from "@src/common/common/commonEvent";
import LoadableExtension from "@src/common/common/extensions/loadableExtension";
import ConfigurationManager from "./subservices/configurationManager";
import ICommonViewIpcReturns from "../../common/ipc/CommonViewIpcReturns";
import ICommonViewIpcArgs from "../../common/ipc/CommonViewIpcArgs";
import { ENV } from "@src/env";
import SettingKey from "@src/common/node/services/settings/settingKey";
import ThemeBrowserService from "@src/common/browser/services/themeBrowserService";

export default class CommonViewBrowserService {
  public onMinimize = new CommonEvent();
  public onMaximize = new CommonEvent();
  public onRestore = new CommonEvent();

  public i18n!: I18nLanguageFile;

  public userSettings!: ConfigurationManager;
  public internalSettings!: ConfigurationManager;

  private extensions?: LoadableExtension[];
  private ipcService: IpcBrowserService<ICommonViewIpcArgs, ICommonViewIpcReturns>;

  private themeService = new ThemeBrowserService();

  constructor() {
    this.ipcService = new IpcBrowserService<ICommonViewIpcArgs, ICommonViewIpcReturns>(ENV.IPC_COMMON_PREFIX);

    this.handleUserSettingsUpdate = this.handleUserSettingsUpdate.bind(this);
    this.handleWindowMaximized = this.handleWindowMaximized.bind(this);
    this.handleWindowMinimized = this.handleWindowMinimized.bind(this);
    this.handleWindowRestored = this.handleWindowRestored.bind(this);

    this.addIpcListeners();
  }

  public async start() {
    const initArgs = await this.ipcService.sendAndReturn("BROWSER_READY");

    this.i18n = initArgs.i18nArgs.i18nLanguageFile;
    this.userSettings = new ConfigurationManager(initArgs.userSettingsArg.userSettings);
    this.internalSettings = new ConfigurationManager(initArgs.internalSettingsArgs.internalSettings);

    // apply theme
    this.themeService.apply(this.internalSettings.getSetting("themeColors"));
  }

  public async getWindowIsCloseable(): Promise<boolean> {
    return this.ipcService.sendAndReturn("IS_WINDOW_CLOSABLE");
  }

  public async getWindowIsMaximizable(): Promise<boolean> {
    return this.ipcService.sendAndReturn("IS_WINDOW_MAXIMIZABLE");
  }

  public async getWindowIsMinimizable(): Promise<boolean> {
    return this.ipcService.sendAndReturn("IS_WINDOW_MINIMIZABLE");
  }

  public async getIsMaximized(): Promise<boolean> {
    return this.ipcService.sendAndReturn("IS_MAXIMIZED");
  }

  public maximizeOrRestore() {
    this.ipcService.send("MAXIMIZE_OR_RESTORE");
  }

  public minimize() {
    this.ipcService.send("MINIMIZE");
  }

  public async getExtensions(): Promise<LoadableExtension[]> {
    if (this.extensions) {
      return this.extensions;
    }

    this.extensions = await this.ipcService.sendAndReturn("GET_EXTENSIONS");
    return this.extensions!;
  }

  public show() {
    this.ipcService.send("READY_TO_SHOW");
  }

  public showDevTools() {
    this.ipcService.send("TOGGLE_DEV_TOOLS");
  }

  public close() {
    this.ipcService.send("CLOSE");
  }

  private removeIpcListeners() {
    this.ipcService.removeListener("USER_SETTING_UPDATE", this.handleUserSettingsUpdate);
    this.ipcService.removeListener("INTERNAL_SETTING_UPDATE", this.handleInternalSettingsUpdate);

    this.ipcService.removeListener("MAXIMIZED", this.handleWindowMaximized);
    this.ipcService.removeListener("MINIMIZED", this.handleWindowMinimized);
    this.ipcService.removeListener("RESTORED", this.handleWindowRestored);
  }

  private addIpcListeners() {
    this.ipcService.addListener("USER_SETTING_UPDATE", this.handleUserSettingsUpdate);
    this.ipcService.addListener("INTERNAL_SETTING_UPDATE", this.handleInternalSettingsUpdate);

    this.ipcService.addListener("MAXIMIZED", this.handleWindowMaximized);
    this.ipcService.addListener("MINIMIZED", this.handleWindowMinimized);
    this.ipcService.addListener("RESTORED", this.handleWindowRestored);
  }

  private handleWindowMaximized() {
    this.onMaximize.propagate({});
  }

  private handleWindowMinimized() {
    this.onMinimize.propagate({});
  }

  private handleWindowRestored() {
    this.onRestore.propagate({});
  }

  private handleUserSettingsUpdate(setting: SettingKey<any>) {
    this.userSettings.updateSetting(setting.key, setting.value);
  }

  private handleInternalSettingsUpdate(setting: SettingKey<any>) {
    this.internalSettings.updateSetting(setting.key, setting.value);
  }
}
