import CommonViewInitArgs from "../commonViewInitArgs";

import BrowserI18nService from "@src/common/browser/browseri18nService";
import IpcService from "@src/common/browser/ipcService";
import { IPC_CHANNELS } from "@src/common/common/ipcChannels";
import ExtensionManifest from "@src/common/common/extensions/manifest-type/extensionManifest";
import I18nLanguageFile from "@src/common/node/services/i18n/i18nLanguageFile";
import Ii18nLanguage from "@src/common/node/services/i18n/i18nLanguage";

export default class CommonViewBrowserService {
  public i18n!: I18nLanguageFile;
  public ipcService: IpcService;

  constructor() {
    this.ipcService = new IpcService();

    if (this.ipcService.ipc) {
      const initArgs: CommonViewInitArgs = this.ipcService.ipc.sendSync(IPC_CHANNELS.BROWSER_READY);
      // this.i18n = new BrowserI18nService(initArgs.i18nArgs.i18nLanguageFile);
      this.i18n = initArgs.i18nArgs.i18nLanguageFile;

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
}
