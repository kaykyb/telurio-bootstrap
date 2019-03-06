import EditorBrowserService from "../service/editorBrowserService";
import ExtensionManifest from "@src/common/common/extensions/manifest-type/extensionManifest";
import EditorExtensionBridgeCommandArgs from "../../../../common/common/extensions/editorExtensionBridgeCommandArgs";
import ExtensionMessage from "@src/common/common/extensions/extensionMessage";
import ExtensionCommandActivationArgs from "@src/common/common/extensions/extensionCommandActivationArgs";

export default class ExtensionHost {
  private sandbox?: HTMLIFrameElement;
  private isOnSecureContext = true;

  constructor(
    public extDir: string,
    public ext: ExtensionManifest,
    public editorService: EditorBrowserService
  ) {
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

    const html =
      "<html><body><script src=" +
      this.extDir +
      "/" +
      this.ext.name +
      "/" +
      this.ext.entry +
      "></script></body></html>";

    this.sandbox.srcdoc = html;
    this.sandbox.addEventListener("load", this.addSandboxEventListeners);

    return this.sandbox;
  }

  private registerExtCommands() {
    if (this.ext.contributions && this.ext.contributions.commands) {
      this.ext.contributions.commands.forEach(c => {
        const cmd = this.editorService.extensionBridge.registerCommand(
          this.ext.name + "." + c.name,
          this.ext.name + "." + c.permissionRequired,
          this.ext
        );

        cmd.addListener(this.handleCommandActivation);
      });
    }
  }

  private handleCommandActivation(args: EditorExtensionBridgeCommandArgs<any[]>): any {
    if (args.cmd.startsWith(this.ext.name + ".")) {
      const realCmd = args.cmd.slice(this.ext.name.length + 1, args.cmd.length);

      if (this.sandbox && this.sandbox.contentWindow) {
        this.sandbox.contentWindow!.postMessage(
          new ExtensionMessage("cmd", new ExtensionCommandActivationArgs(realCmd, args.args, args.cbCmdId)),
          this.editorService.commonService.ipcService.ipc ? "*" : window.origin
        );
      }
    }
  }

  private addSandboxEventListeners() {
    // TODO
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
      const cbCmdId = this.ext.name + "." + "!returnCallback." + args.cbCmdId;
      const cbCmd = this.editorService.extensionBridge.registerCommand(cbCmdId, cbCmdId, this.ext);

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
