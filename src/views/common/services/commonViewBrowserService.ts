import BrowserI18nService from "../../../common/browser/i18nService";
import IpcService from "../../../common/browser/ipcService";
import I18nArgs from "../../../common/common/ipcEvents/i18nArgs";
import { IPC_CHANNELS } from "../../../common/common/ipcChannels";
import CommonViewInitArgs from "../commonViewInitArgs";
import ExtensionManifest from "../../../common/common/extensions/manifest-type/extensionManifest";

export default class CommonViewBrowserService {
  public static i18n: BrowserI18nService;
  public static ipcService: IpcService;

  public static init(): CommonViewInitArgs {
    this.ipcService = new IpcService();

    if (this.ipcService.ipc) {
      const initArgs: CommonViewInitArgs = this.ipcService.ipc.sendSync(IPC_CHANNELS.BROWSER_READY);
      this.i18n = new BrowserI18nService(initArgs.i18nArgs.strJson);

      return initArgs;
    }

    return CommonViewInitArgs.getDefault();
  }

  public static getExtensions(): Array<{ exts: ExtensionManifest[]; sourceDir: string }> {
    if (CommonViewBrowserService.ipcService.ipc) {
      return CommonViewBrowserService.ipcService.ipc.sendSync(IPC_CHANNELS.GET_EXTENSIONS);
    }

    return [];
  }
}
