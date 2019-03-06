import CommonViewInitArgs from "../commonViewInitArgs";

import BrowserI18nService from "@src/common/browser/browseri18nService";
import IpcService from "@src/common/browser/ipcService";
import { IPC_CHANNELS } from "@src/common/common/ipcChannels";
import ExtensionManifest from "@src/common/common/extensions/manifest-type/extensionManifest";
import I18nLanguageFile from "@src/common/node/services/i18n/i18nLanguageFile";
import SettingMetadata from "@src/common/node/services/settings/settingMetadata";
import ISettingStore from "@src/common/node/services/settings/settingStore";

export default class CommonViewBrowserService {
  public i18n!: I18nLanguageFile;

  public ipcService: IpcService;

  private userSettings!: ISettingStore;

  constructor() {
    this.handleSettingsUpdate = this.handleSettingsUpdate.bind(this);

    this.ipcService = new IpcService();

    this.addIpcListeners();

    if (this.ipcService.ipc) {
      const initArgs: CommonViewInitArgs = this.ipcService.ipc.sendSync(IPC_CHANNELS.BROWSER_READY);

      // this.i18n = new BrowserI18nService(initArgs.i18nArgs.i18nLanguageFile);

      this.i18n = initArgs.i18nArgs.i18nLanguageFile;
      this.userSettings = initArgs.userSettingsArg.userSettings;

      return;
    }

    // this.i18n = new BrowserI18nService(new I18nLanguageFile({ code: "null", name: "null" }));
  }

  public getExtensions(): Array<{
    exts: ExtensionManifest[];
    sourceDir: string;
  }> {
    if (this.ipcService.ipc) {
      return this.ipcService.ipc.sendSync(IPC_CHANNELS.GET_EXTENSIONS);
    }

    return [];
  }

  public show() {
    if (this.ipcService.ipc) {
      return this.ipcService.ipc.send(IPC_CHANNELS.READY_TO_SHOW);
    }
  }

  public containsSetting(key: string) {
    return this.userSettings.hasOwnProperty(key);
  }

  public getSetting(key: string): any {
    return this.userSettings[key];
  }

  public setSetting(key: string, value: any) {
    this.userSettings[key] = value;
    if (this.ipcService.ipc) {
      this.ipcService.ipc.send(IPC_CHANNELS.SET_SETTING, { key, value });
    }
  }

  private removeIpcListeners() {
    if (this.ipcService.ipc) {
      this.ipcService.ipc.removeListener(IPC_CHANNELS.SETTINGS_UPDATE, this.handleSettingsUpdate);
    }
  }

  private addIpcListeners() {
    if (this.ipcService.ipc) {
      this.ipcService.ipc.addListener(IPC_CHANNELS.SETTINGS_UPDATE, this.handleSettingsUpdate);
    }
  }

  private handleSettingsUpdate(setting: { key: string; value: any }) {
    this.userSettings[setting.key] = setting.value;
  }
}
