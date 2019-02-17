import EditorBrowserService from "../service/editorBrowserService";
import ExtensionManifest from "../../../../common/common/extensions/manifest-type/extensionManifest";
import CommonViewBrowserService from "../../../common/services/commonViewBrowserService";
import ViewComponent from "../../../common/viewComponent";
import EditorViewComponent from "../editorViewComponent";
import ExtensionMessage from "../../../../common/common/extensions/extensionMessage";
import ExtensionCommandActivationArgs from "../../../../common/common/extensions/extensionCommandActivationArgs";

export default class ExtensionManager extends EditorViewComponent {
  private returnCmds: { [callbackId: string]: (v: any) => any } = {};

  private extensionsDirs: Array<{
    exts: ExtensionManifest[];
    sourceDir: string;
  }>;
  private extHosts: { [ext: string]: HTMLIFrameElement } = {};

  constructor(editorService: EditorBrowserService) {
    super(editorService);

    this.handleCommandActivation = this.handleCommandActivation.bind(this);

    this.extensionsDirs = this.editorService.commonService.getExtensions();
    this.loadExtensions();
  }

  private loadExtensions() {
    const extHostContainer = document.createElement("div");
    extHostContainer.style.display = "none";

    const frag = document.createDocumentFragment();

    this.extensionsDirs.forEach(extDir => {
      extDir.exts.forEach(extManifest => {
        const extHost = document.createElement("iframe");
        extHost.sandbox.add("allow-scripts");

        this.registerExtCommands(extManifest);

        const html =
          "<html><body><script src=" +
          extDir.sourceDir +
          "/" +
          extManifest.name +
          "/" +
          extManifest.entry +
          "></script></body></html>";

        extHost.srcdoc = html;

        this.extHosts[extManifest.name] = extHost;
        frag.appendChild(extHost);
      });
    });

    extHostContainer.appendChild(frag);

    const root = document.getElementById("app-root");
    if (root) {
      root.appendChild(extHostContainer);
    }
  }

  private registerExtCommands(ext: ExtensionManifest) {
    if (ext.contributions && ext.contributions.commands) {
      ext.contributions.commands.forEach(c => {
        this.editorService.extensionBridge.registerCommand(
          ext.name + "." + c.name,
          (args: any[], cb?: (v: any) => any) => this.handleCommandActivation(ext.name, c.name, args, cb)
        );
      });
    }
  }

  private handleCommandActivation(ext: string, cmd: string, args: any[], callback?: (v: any) => any): any {
    if (cmd.startsWith(ext)) {
      let callbackId: string | undefined;
      const realCmd = cmd.slice(ext.length + 1, cmd.length);

      if (callback) {
        callbackId = this.getCmdCallbackId(ext);
        this.returnCmds[callbackId] = callback;
      }

      if (this.extHosts && this.extHosts[ext] && this.extHosts[ext].contentWindow) {
        this.extHosts[ext].contentWindow!.postMessage(
          new ExtensionMessage("cmd", new ExtensionCommandActivationArgs(realCmd, args, callbackId)),
          "*"
        );
      }
    }
  }

  private getCmdCallbackId(ext: string): string {
    const callbackId = ext + Math.random();

    // Ensures that the id is unique, if it's not, generates another id.
    if (this.returnCmds[callbackId]) {
      return this.getCmdCallbackId(ext);
    }

    return callbackId;
  }
}
