import EditorExtensionBridge from "./editorExtensionBridge";

import CommonLayoutConfig from "@src/views/editor/common/classes/commonLayoutConfig";
import CommonViewBrowserService from "@src/views/common/browser/services/commonViewBrowserService";
import CoreExtensibilityService from "./coreExtensibilityService";
import PanelView from "../panels/container/frame/views/view/panelView";
import PanelTab from "../panels/container/tabs/tab/panelTab";
import IEditorIpcReturns from "../../common/ipc/EditorIpcServiceReturns";
import IEditorIpcArgs from "../../common/ipc/EditorIpcServiceArgs";
import IpcBrowserService from "@src/common/browser/services/ipc/ipcBrowserService";
import EditorExtensionBridgeCommand from "@src/common/common/extensions/editorExtensionBridgeCommand";
import ICommandIndex from "@src/common/common/extensions/commandIndex";
import ThemeBrowserService from "@src/common/browser/services/themeBrowserService";
import PanelManager from "../panels/panelManager";
import ExtensionManager from "@src/views/common/node/extensionManager";

export default class EditorBrowserService {
  public panelManager?: PanelManager;

  public extensionBridge: EditorExtensionBridge = new EditorExtensionBridge();
  public coreService: CoreExtensibilityService;

  public panelViewsIndex: PanelView[] = [];
  public panelTabsIndex: PanelTab[] = [];

  private ipcService = new IpcBrowserService<IEditorIpcArgs, IEditorIpcReturns>("EDITOR");

  constructor(public readonly commonService: CommonViewBrowserService) {
    this.handleGetExtCommands = this.handleGetExtCommands.bind(this);
    this.handleGetLayout = this.handleGetLayout.bind(this);

    this.coreService = new CoreExtensibilityService(this.extensionBridge, commonService);

    this.initIpc();
  }

  public async getLayoutConfigs(): Promise<CommonLayoutConfig> {
    return this.ipcService.sendAndReturn("GET_WORKSPACE_CONFIGS");
  }

  public showMarketplace() {
    this.ipcService.send("OPEN_MARKETPLACE");
  }

  public showEditorDevTools() {
    this.ipcService.send("OPEN_EDITOR_DEVTOOLS");
  }

  private initIpc() {
    this.ipcService.addListener("GET_EXT_COMMANDS", this.handleGetExtCommands);
    this.ipcService.addListener("GET_EDITOR_LAYOUT", this.handleGetLayout);

    this.extensionBridge.onCommandRegister.addListener(() => {
      this.ipcService.send("UPDATE_EXT_COMMANDS", this.extensionBridge.commands);
    });
  }

  private handleGetLayout(args: undefined, resolve: (returnValue: CommonLayoutConfig) => any) {
    if (this.panelManager) {
      resolve(this.panelManager.getCurrentLayoutConfig());
    }
  }

  private handleGetExtCommands(args: undefined, resolve: (returnValue: ICommandIndex) => any) {
    resolve(this.extensionBridge.commands);
  }
}
