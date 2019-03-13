import EditorBrowserService from "../service/editorBrowserService";
import ExtensionManifest from "@src/common/common/extensions/manifest-type/extensionManifest";
import EditorExtensionBridgeCommandArgs from "../../../../common/common/extensions/editorExtensionBridgeCommandArgs";
import ExtensionMessage from "@src/common/common/extensions/extensionMessage";
import ExtensionCommandActivationArgs from "@src/common/common/extensions/extensionCommandActivationArgs";
import LoadableExtension from "@src/common/common/extensions/loadableExtension";
import LogUtility from "@src/common/common/util/logUtility";
import { ENV } from "@src/env";

export default class ExtensionHost {
  private sandbox?: HTMLIFrameElement;
  private isOnSecureContext = true;

  constructor(public ext: LoadableExtension, public editorService: EditorBrowserService) {
    this.handleCommandActivation = this.handleCommandActivation.bind(this);
    this.addSandboxEventListeners = this.addSandboxEventListeners.bind(this);
    this.handleWindowMessage = this.handleWindowMessage.bind(this);
    this.handleCmdExec = this.handleCmdExec.bind(this);

    this.addWindowMessageEventsListener();
  }

  public render(): HTMLIFrameElement {
    this.sandbox = document.createElement("iframe");
    this.sandbox.sandbox.add("allow-scripts");

    this.registerExtCommands();

    // Entry script url
    const relativeEntry = this.ext.extension.name + "/" + this.ext.extension.entry;
    const absoluteEntry = new URL(this.ext.sourceUri + relativeEntry).href;

    // Security: Check if URL is inside the extension root path
    if (!absoluteEntry.startsWith(this.ext.sourceUri + this.ext.extension.name + "/")) {
      LogUtility.err(
        "EH1",
        "Security",
        `The extension ${this.ext} tried to access ${absoluteEntry}, which it doesn't have permission to.`
      );
      throw new Error("EH1");
    }

    const html = '<html><body><script src="' + absoluteEntry + '"></script></body></html>';

    this.sandbox.srcdoc = html;
    this.sandbox.addEventListener("load", this.addSandboxEventListeners);

    return this.sandbox;
  }

  private registerExtCommands() {
    if (this.ext.extension.contributions && this.ext.extension.contributions.commands) {
      this.ext.extension.contributions.commands.forEach(c => {
        const cmd = this.editorService.extensionBridge.registerCommand(
          this.ext.extension.name + "." + c.name,
          this.ext.extension.name + "." + c.permissionRequired,
          this.ext.extension
        );

        cmd.addListener(this.handleCommandActivation);
      });
    }
  }

  private handleCommandActivation(args: EditorExtensionBridgeCommandArgs<any[]>): any {
    if (args.cmd.startsWith(this.ext.extension.name + ".")) {
      const realCmd = args.cmd.slice(this.ext.extension.name.length + 1, args.cmd.length);

      if (this.sandbox && this.sandbox.contentWindow) {
        this.sandbox.contentWindow!.postMessage(
          new ExtensionMessage("cmd", new ExtensionCommandActivationArgs(realCmd, args.args, args.cbCmdId)),
          "*"
        );
      }
    }
  }

  private addSandboxEventListeners() {
    // TODO: Add security events
  }

  private addWindowMessageEventsListener() {
    window.addEventListener("message", this.handleWindowMessage);
  }

  private handleWindowMessage(ev: MessageEvent) {
    if (this.sandbox && ev.source === this.sandbox.contentWindow && ev.data) {
      const messageParsed: ExtensionMessage = ev.data;

      switch (messageParsed.type) {
        case "cmd":
          this.handleCmdExec(messageParsed.data as ExtensionCommandActivationArgs);
          break;

        default:
          break;
      }
    }
  }

  private handleCmdExec(args: ExtensionCommandActivationArgs) {
    const cmd = this.editorService.extensionBridge.getCommand(args.cmd);

    if (args.cbCmdId) {
      const cbCmdId = this.ext.extension.name + "." + "!returnCallback." + args.cbCmdId;
      const cbCmd = this.editorService.extensionBridge.registerCommand(cbCmdId, cbCmdId, this.ext.extension);

      cmd.owner.permissions.push(cbCmdId);

      cbCmd.addListener((ev: EditorExtensionBridgeCommandArgs<any>) => {
        cmd.owner.permissions.splice(cmd.owner.permissions.indexOf(cbCmdId), 1);
        this.editorService.extensionBridge.removeCommand(cbCmdId);
        this.handleCommandActivation(ev);
      });

      if (!cmd.execute(args.args, this.ext, cbCmdId)) {
        this.editorService.extensionBridge.removeCommand(cbCmdId);
      }
    } else {
      cmd.execute(args.args, this.ext);
    }
  }
}
