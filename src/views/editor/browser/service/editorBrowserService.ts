import BrowserI18nService from "../../../../common/browser/i18nService";
import IpcService from "../../../../common/browser/ipcService";
import CommonLayoutConfig from "../../common/classes/commonLayoutConfig";
import CommonViewBrowserService from "../../../common/services/commonViewBrowserService";
import { EDITOR_IPC_CHANNELS } from "../../common/ipcChannels";
import CommonPanelRow from "../../common/classes/panelRow";
import ExtensionManifest from "../../../../common/common/extensions/manifest-type/extensionManifest";

export default class EditorBrowserService {
  public static getLayoutConfigs(): CommonLayoutConfig {
    if (CommonViewBrowserService.ipcService.ipc) {
      return CommonViewBrowserService.ipcService.ipc.sendSync(EDITOR_IPC_CHANNELS.GET_WORKSPACE_CONFIGS);
    }

    return new CommonLayoutConfig(new CommonPanelRow(0));
  }

  public static getExtensions(): Array<{ exts: ExtensionManifest[]; sourceDir: string }> {
    if (CommonViewBrowserService.ipcService.ipc) {
      return CommonViewBrowserService.ipcService.ipc.sendSync(EDITOR_IPC_CHANNELS.LOAD_EXTENSIONS);
    }

    return [];
  }
}
