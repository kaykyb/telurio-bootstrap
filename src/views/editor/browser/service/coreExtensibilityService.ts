import EditorExtensionBridge from "./editorExtensionBridge";
import EditorExtensionBridgeCommandArgs from "@src/common/common/extensions/editorExtensionBridgeCommandArgs";
import EditorExtensionBridgeCommand from "@src/common/common/extensions/editorExtensionBridgeCommand";
import CommonViewBrowserService from "@src/views/common/browser/services/commonViewBrowserService";
import PanelRegistrationArgs from "../../common/classes/panelRegistrationArgs";
import LogUtility from "@src/common/common/util/logUtility";
import LoadableExtension from "@src/common/common/extensions/loadableExtension";
import { SecurityValidation } from "@src/common/common/securityValidation";
import ExtensionHost from "../extensions/extensionHost";
import IExtensionHost from "../../common/extensions/extensionHostInterface";
import ExtensionMessage from "@src/common/common/extensions/sdk/extensionMessage";
import PanelHostCommunicationArgs from "@src/common/common/extensions/sdk/panelHostCommunicationArgs";
import CommonManifests from "@src/common/common/extensions/commonManifests";

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
    this.handleRegisterPanel = this.handleRegisterPanel.bind(this);
  }

  private registerCommands() {
    this.registerCommand("getSetting", "settings", this.handleGetSetting);
    this.registerCommand("registerPanel", "panels", this.handleRegisterPanel);
  }

  private registerCommand(
    cmd: string,
    permissionRequired: string,
    listener: (event: EditorExtensionBridgeCommandArgs<any>) => any
  ): EditorExtensionBridgeCommand<any> {
    const command = this.extensionBridge.registerCommand(
      "core." + cmd,
      "core." + permissionRequired,
      CommonManifests.getCoreExtensionManifest([], this.commonService.i18n).extension
    );
    command.addListener(listener);
    return command;
  }

  //#region Command Handlers
  private handleGetSetting(event: EditorExtensionBridgeCommandArgs<string>) {
    if (!event.cbCmdId || !event.sender.extension.contributions) {
      return;
    }

    if (!event.sender.extension.contributions.settings) {
      return;
    }

    const settingName = event.sender.extension.name + "." + event.args;
    const settingMetadata = event.sender.extension.contributions.settings.find(x => x.name === event.args);

    if (settingMetadata) {
      const setting = this.commonService.userSettings.getSetting(settingName) || settingMetadata.defaultValue;

      this.extensionBridge
        .getCommand(event.cbCmdId)
        .execute(setting, CommonManifests.getCoreExtensionManifest([], this.commonService.i18n));
      return;
    }

    this.extensionBridge
      .getCommand(event.cbCmdId)
      .execute(undefined, CommonManifests.getCoreExtensionManifest([], this.commonService.i18n));
  }

  private handleRegisterPanel(
    event: EditorExtensionBridgeCommandArgs<PanelRegistrationArgs>,
    senderHost?: IExtensionHost
  ) {
    const extSourceUri = event.sender.sourceUri;
    const extName = event.sender.extension.name;

    const htmlUrl = extSourceUri + extName + "/" + event.args.htmlFile;

    if (!this.checkURLOwnership([htmlUrl], event.sender)) {
      LogUtility.err(
        "InvalidPermissions",
        "Security",
        "An extension tried to access a file that it doesn't have permission to."
      );
      throw new Error("InvalidPermissions");
    }

    const panel = this.extensionBridge.registerPanel(event.args.name, event.sender, htmlUrl);
    panel.onMessage.addListener(data => {
      if (senderHost) {
        senderHost.postMessage(
          new ExtensionMessage(
            "messageFromPanel",
            new PanelHostCommunicationArgs(panel.name, data.tab, data.message)
          )
        );
      }
    });
  }

  private checkURLOwnership(urls: string[], ext: LoadableExtension): boolean {
    let ownership = true;

    urls.forEach(v => {
      const url = new URL(v);
      if (!SecurityValidation.checkFileURLOwnership(url, ext)) {
        ownership = false;
      }
    });

    return ownership;
  }
  //#endregion
}
