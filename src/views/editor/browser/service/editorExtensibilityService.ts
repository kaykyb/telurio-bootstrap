import EditorExtensionBridge from "./editorExtensionBridge";
import { CORE_EXTENSION_MANIFEST } from "@src/common/common/extensions/commonManifests";
import EditorExtensionBridgeCommandArgs from "@src/common/common/extensions/editorExtensionBridgeCommandArgs";
import EditorExtensionBridgeCommand from "@src/common/common/extensions/editorExtensionBridgeCommand";
import CommonViewBrowserService from "@src/views/common/browser/services/commonViewBrowserService";
import EditorBrowserService from "./editorBrowserService";
import IExtensionHost from "../../common/extensions/extensionHostInterface";

export default class EditorExtensibilityService {
  constructor(
    private readonly extensionBridge: EditorExtensionBridge,
    public readonly editorService: EditorBrowserService
  ) {
    this.init();
  }

  private init() {
    this.bindCommands();
    this.registerCommands();
  }

  private bindCommands() {
    this.handleGetOwnedTabs = this.handleGetOwnedTabs.bind(this);
    this.handleSendMessageToTab = this.handleSendMessageToTab.bind(this);
  }

  private registerCommands() {
    this.registerCommand("getOwnedTabs", "panels", this.handleGetOwnedTabs);
    this.registerCommand("sendMessageToTab", "panels", this.handleSendMessageToTab);
  }

  private registerCommand(
    cmd: string,
    permissionRequired: string,
    listener: (event: EditorExtensionBridgeCommandArgs<any>) => any
  ): EditorExtensionBridgeCommand<any> {
    const command = this.extensionBridge.registerCommand(
      "core.editor." + cmd,
      "core." + permissionRequired,
      CORE_EXTENSION_MANIFEST.extension
    );
    command.addListener(listener);
    return command;
  }

  //#region Command Handlers
  private handleGetOwnedTabs(event: EditorExtensionBridgeCommandArgs<any>) {
    if (!event.cbCmdId) {
      return;
    }

    const ownedTabs = this.editorService.panelViewsIndex
      .filter(v => v.tab.panelOwnerName === event.sender.extension.name)
      .map(v => v.tab);

    this.extensionBridge.getCommand(event.cbCmdId).execute(ownedTabs, CORE_EXTENSION_MANIFEST);
  }

  private handleSendMessageToTab(event: EditorExtensionBridgeCommandArgs<{ tabId: string; message: any }>) {
    const tab = this.editorService.panelViewsIndex.find(
      v => v.tab.panelOwnerName === event.sender.extension.name && v.tab.id === event.args.tabId
    );

    if (!tab) {
      return;
    }

    tab.sendMessageToPanel(event.args.message);
  }
  //#endregion
}
