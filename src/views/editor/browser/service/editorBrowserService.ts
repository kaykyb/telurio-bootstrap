import EditorExtensionBridge from "./editorExtensionBridge";

import CommonLayoutConfig from "@src/views/editor/common/classes/commonLayoutConfig";
import CommonViewBrowserService from "@src/views/common/browser/services/commonViewBrowserService";
import { EDITOR_IPC_CHANNELS } from "@src/views/editor/common/ipcChannels";
import CommonPanelRow from "@src/views/editor/common/classes/panelRow";
import CoreExtensibilityService from "./coreExtensibilityService";
import PanelView from "../panels/container/frame/views/view/panelView";
import PanelTab from "../panels/container/tabs/tab/panelTab";

export default class EditorBrowserService {
  public extensionBridge: EditorExtensionBridge = new EditorExtensionBridge();
  public coreService: CoreExtensibilityService;

  public panelViewsIndex: PanelView[] = [];
  public panelTabsIndex: PanelTab[] = [];

  constructor(public readonly commonService: CommonViewBrowserService) {
    this.coreService = new CoreExtensibilityService(this.extensionBridge, commonService);
    this.initIpc();
  }

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

  public showEditorDevTools() {
    if (this.commonService.ipcService.ipc) {
      return this.commonService.ipcService.ipc.send(EDITOR_IPC_CHANNELS.OPEN_EDITOR_DEVTOOLS);
    }
  }

  private initIpc() {
    if (this.commonService.ipcService.ipc) {
      const ipc = this.commonService.ipcService.ipc;

      ipc.on(EDITOR_IPC_CHANNELS.GET_EXT_COMMANDS, (e: any) => {
        e.sender.send(EDITOR_IPC_CHANNELS.GET_EXT_COMMANDS_RETURN, this.extensionBridge.commands);
      });

      this.extensionBridge.onCommandRegister.addListener(() => {
        ipc.send(EDITOR_IPC_CHANNELS.UPDATE_EXT_COMMANDS, this.extensionBridge.commands);
      });
    }
  }
}
