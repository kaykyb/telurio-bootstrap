import CommonLayoutConfig from "../../common/classes/commonLayoutConfig";
import CommonViewBrowserService from "../../../common/services/commonViewBrowserService";
import { EDITOR_IPC_CHANNELS } from "../../common/ipcChannels";
import CommonPanelRow from "../../common/classes/panelRow";
import EditorExtensionBridge from "./editorExtensionBridge";

export default class EditorBrowserService {
  public extensionBridge: EditorExtensionBridge = new EditorExtensionBridge();

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
