import fs from "fs";
import path from "path";
import ExtensionManifest from "@src/common/common/extensions/manifest-type/extensionManifest";

export default class ExtensionManager {
  private extManifests: ExtensionManifest[] = [];
  // private extHosts: { [extName: string]: ChildProcess } = {};
  private extDirs: string[] = [];

  public loadExtensionsDir(dir: string): ExtensionManifest[] {
    const addedExts: ExtensionManifest[] = [];
    this.extDirs.push(dir);

    const exts = this.getDirectories(dir);

    exts.forEach(extPath => {
      const addedExt = this.loadExtension(extPath);
      if (addedExt) {
        addedExts.push(addedExt);
      }
    });

    return addedExts;
  }

  public loadExtension(p: string): ExtensionManifest | null {
    const manifestPath = path.join(p, "manifest.json");
    if (fs.existsSync(manifestPath)) {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as ExtensionManifest;
      this.extManifests.push(manifest);
      return manifest;
      // this.extHosts[manifest.name] = fork(path.join(__dirname, "extensionHost.js"), [p]);
    }
    return null;
  }

  private getDirectories(dir: string): string[] {
    return fs
      .readdirSync(dir)
      .map(p => path.join(dir, p))
      .filter(p => fs.lstatSync(p).isDirectory());
  }
}
