import EditorBrowserService from "../service/editorBrowserService";
import ExtensionManifest from "@src/common/common/extensions/manifest-type/extensionManifest";
import ExtensionHost from "./extensionHost";
import LoadableExtension from "@src/common/common/extensions/loadableExtension";

export default class ExtensionManager {
  private extensions: LoadableExtension[];
  private extHosts: { [ext: string]: ExtensionHost } = {};

  constructor(private readonly editorService: EditorBrowserService) {
    this.extensions = this.editorService.commonService.getExtensions();
    this.loadExtensions();
  }

  private loadExtensions() {
    const extHostContainer: HTMLDivElement = document.createElement("div");
    extHostContainer.style.display = "none";

    const frag: DocumentFragment = document.createDocumentFragment();

    this.extensions.forEach(ext => {
      const extHost = new ExtensionHost(ext, this.editorService);
      this.extHosts[ext.extension.name] = extHost;
      frag.appendChild(extHost.render());
    });

    // this.extensionsDirs.forEach(extDir => {
    //   extDir.exts.forEach(extManifest => {
    //     const extHost = new ExtensionHost(extDir.sourceDir, extManifest, this.editorService);
    //     this.extHosts[extManifest.name] = extHost;
    //     frag.appendChild(extHost.render());
    //   });
    // });

    extHostContainer.appendChild(frag);

    const root = document.getElementById("app-root");
    if (root) {
      root.appendChild(extHostContainer);
    }
  }
}
