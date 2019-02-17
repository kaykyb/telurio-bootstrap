import EditorExtensionBridge from "./editorExtensionBridge";

import CommonLayoutConfig from "@src/views/editor/common/classes/commonLayoutConfig";
import CommonViewBrowserService from "@src/views/common/services/commonViewBrowserService";
import { EDITOR_IPC_CHANNELS } from "@src/views/editor/common/ipcChannels";
import CommonPanelRow from "@src/views/editor/common/classes/panelRow";

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
