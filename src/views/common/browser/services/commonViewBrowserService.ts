import CommonViewInitArgs from "@src/views/common/common/commonViewInitArgs";
import IpcService from "@src/common/browser/ipcService";
import { IPC_CHANNELS } from "@src/common/common/ipcChannels";
import ExtensionManifest from "@src/common/common/extensions/manifest-type/extensionManifest";
import I18nLanguageFile from "@src/common/node/services/i18n/i18nLanguageFile";
import ISettingStore from "@src/common/node/services/settings/settingStore";
import CommonEvent from "@src/common/common/commonEvent";
import LoadableExtension from "@src/common/common/extensions/loadableExtension";
import ConfigurationManager from "./subservices/configurationManager";

export default class CommonViewBrowserService {
  public onMinimize = new CommonEvent();
  public onMaximize = new CommonEvent();
  public onRestore = new CommonEvent();

  public i18n!: I18nLanguageFile;

  public ipcService: IpcService;

  public userSettings!: ConfigurationManager;
  public internalSettings!: ConfigurationManager;

  private extensions?: LoadableExtension[];

  constructor() {
    this.handleUserSettingsUpdate = this.handleUserSettingsUpdate.bind(this);

    this.handleWindowMaximized = this.handleWindowMaximized.bind(this);
    this.handleWindowMinimized = this.handleWindowMinimized.bind(this);
    this.handleWindowRestored = this.handleWindowRestored.bind(this);

    this.ipcService = new IpcService();

    this.addIpcListeners();

    if (this.ipcService.ipc) {
      const initArgs: CommonViewInitArgs = this.ipcService.ipc.sendSync(IPC_CHANNELS.BROWSER_READY);

      this.i18n = initArgs.i18nArgs.i18nLanguageFile;
      this.userSettings = new ConfigurationManager(initArgs.userSettingsArg.userSettings);
      this.internalSettings = new ConfigurationManager(initArgs.internalSettingsArgs.internalSettings);

      return;
    }

    // this.i18n = ...
  }

  public getWindowIsCloseable(): boolean {
    if (this.ipcService.ipc) {
      return this.ipcService.ipc.sendSync(IPC_CHANNELS.IS_WINDOW_CLOSABLE);
    }

    return false;
  }

  public getWindowIsMaximizable(): boolean {
    if (this.ipcService.ipc) {
      return this.ipcService.ipc.sendSync(IPC_CHANNELS.IS_WINDOW_MAXIMIZABLE);
    }

    return false;
  }

  public getWindowIsMinimizable(): boolean {
    if (this.ipcService.ipc) {
      return this.ipcService.ipc.sendSync(IPC_CHANNELS.IS_WINDOW_MINIMIZABLE);
    }

    return false;
  }

  public getIsMaximized(): boolean {
    if (this.ipcService.ipc) {
      return this.ipcService.ipc.sendSync(IPC_CHANNELS.IS_MAXIMIZED);
    }

    return false;
  }

  public maximizeOrRestore() {
    if (this.ipcService.ipc) {
      this.ipcService.ipc.send(IPC_CHANNELS.MAXIMIZE_OR_RESTORE);
    }
  }

  public minimize() {
    if (this.ipcService.ipc) {
      this.ipcService.ipc.send(IPC_CHANNELS.MINIMIZE);
    }
  }

  public getExtensions(): LoadableExtension[] {
    if (this.extensions) {
      return this.extensions;
    }

    if (this.ipcService.ipc) {
      this.extensions = this.ipcService.ipc.sendSync(IPC_CHANNELS.GET_EXTENSIONS);
      return this.extensions!;
    }

    return [];
  }

  public show() {
    if (this.ipcService.ipc) {
      return this.ipcService.ipc.send(IPC_CHANNELS.READY_TO_SHOW);
    }
  }

  private removeIpcListeners() {
    if (this.ipcService.ipc) {
      this.ipcService.ipc.removeListener(IPC_CHANNELS.USER_SETTINGS_UPDATE, this.handleUserSettingsUpdate);
      this.ipcService.ipc.removeListener(
        IPC_CHANNELS.INTERNAL_SETTINGS_UPDATE,
        this.handleInteralSettingsUpdate
      );

      this.ipcService.ipc.removeListener(IPC_CHANNELS.MAXIMIZED, this.handleWindowMaximized);
      this.ipcService.ipc.removeListener(IPC_CHANNELS.MINIMIZED, this.handleWindowMinimized);
      this.ipcService.ipc.removeListener(IPC_CHANNELS.RESTORED, this.handleWindowRestored);
    }
  }

  private addIpcListeners() {
    if (this.ipcService.ipc) {
      this.ipcService.ipc.addListener(IPC_CHANNELS.USER_SETTINGS_UPDATE, this.handleUserSettingsUpdate);
      this.ipcService.ipc.addListener(
        IPC_CHANNELS.INTERNAL_SETTINGS_UPDATE,
        this.handleInteralSettingsUpdate
      );

      this.ipcService.ipc.addListener(IPC_CHANNELS.MAXIMIZED, this.handleWindowMaximized);
      this.ipcService.ipc.addListener(IPC_CHANNELS.MINIMIZED, this.handleWindowMinimized);
      this.ipcService.ipc.addListener(IPC_CHANNELS.RESTORED, this.handleWindowRestored);
    }
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

  private handleUserSettingsUpdate(setting: { key: string; value: any }) {
    this.userSettings.updateSetting(setting.key, setting.value);
  }

  private handleInteralSettingsUpdate(setting: { key: string; value: any }) {
    this.internalSettings.updateSetting(setting.key, setting.value);
  }
}
