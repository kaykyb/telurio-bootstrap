import BrowserI18nService from "../../../../common/browser/i18nService";
import IpcService from "../../../../common/browser/ipcService";
import CommonLayoutConfig from "../../common/classes/commonLayoutConfig";
import CommonViewBrowserService from "../../../common/services/commonViewBrowserService";
import { EDITOR_IPC_CHANNELS } from "../../common/ipcChannels";
import CommonPanelRow from "../../common/classes/panelRow";
import ExtensionManifest from "../../../../common/common/extensions/manifest-type/extensionManifest";
import { IPC_CHANNELS } from "../../../../common/common/ipcChannels";

export default class EditorBrowserService {
  constructor(public commonService: CommonViewBrowserService) {}

  public getLayoutConfigs(): CommonLayoutConfig {
    if (this.commonService.ipcService.ipc) {
      return this.commonService.ipcService.ipc.sendSync(EDITOR_IPC_CHANNELS.GET_WORKSPACE_CONFIGS);
    }

    return new CommonLayoutConfig(new CommonPanelRow(0));
  }

  public showMarketplace() {
    if (this.commonService.ipcService.ipc) {
      return this.commonService.ipcService.ipc.send(EDITOR_IPC_CHANNELS.OPEN_MARKETPLACE);
    }
  }
}
