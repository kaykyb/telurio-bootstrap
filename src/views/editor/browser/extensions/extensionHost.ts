import EditorBrowserService from "../service/editorBrowserService";
import ExtensionManifest from "../../../../common/common/extensions/manifest-type/extensionManifest";
import CommonViewBrowserService from "../../../common/services/commonViewBrowserService";

export default class ExtensionHost {
  private extensionsDirs: Array<{ exts: ExtensionManifest[]; sourceDir: string }>;
  private extHosts: { [ext: string]: HTMLIFrameElement } = {};

  constructor() {
    this.extensionsDirs = CommonViewBrowserService.getExtensions();

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
}
