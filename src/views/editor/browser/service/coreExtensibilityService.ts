import EditorExtensionBridge from "./editorExtensionBridge";
import { CORE_EXTENSION_MANIFEST } from "@src/common/common/extensions/coreExtensionManifest";
import EditorExtensionBridgeCommandArgs from "@src/common/common/extensions/editorExtensionBridgeCommandArgs";
import EditorExtensionBridgeCommand from "@src/common/common/extensions/editorExtensionBridgeCommand";
import CommonViewBrowserService from "@src/views/common/services/commonViewBrowserService";

export default class CoreExtensibilityService {
  constructor(
    private readonly extensionBridge: EditorExtensionBridge,
    public readonly commonService: CommonViewBrowserService
  ) {
    this.init();
  }

  private init() {
    this.bindCommands();
    this.registerCommands();
  }

  private bindCommands() {
    this.handleGetSetting = this.handleGetSetting.bind(this);
  }

  private registerCommands() {
    this.registerCommand("getSetting", "settings", this.handleGetSetting);
  }

  private registerCommand(
    cmd: string,
    permissionRequired: string,
    listener: (event: EditorExtensionBridgeCommandArgs<any>) => any
  ): EditorExtensionBridgeCommand<any> {
    const command = this.extensionBridge.registerCommand(
      "core." + cmd,
      "core." + permissionRequired,
      CORE_EXTENSION_MANIFEST
    );
    command.addListener(listener);
    return command;
  }

  //#region Command Handlers
  private handleGetSetting(event: EditorExtensionBridgeCommandArgs<string>) {
    if (!event.cbCmdId || !event.sender.contributions) {
      return;
    }

    if (!event.sender.contributions.settings) {
      return;
    }

    const settingName = event.sender.name + "." + event.args;
    const settingMetadata = event.sender.contributions.settings.find(x => x.name === event.args);

    if (settingMetadata) {
      const setting = this.commonService.getSetting(settingName) || settingMetadata.defaultValue;

      this.extensionBridge.getCommand(event.cbCmdId).execute(setting, CORE_EXTENSION_MANIFEST);
      return;
    }

    this.extensionBridge.getCommand(event.cbCmdId).execute(undefined, CORE_EXTENSION_MANIFEST);
  }
  //#endregion
}
