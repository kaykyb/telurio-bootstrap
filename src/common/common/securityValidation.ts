import LoadableExtension from "./extensions/loadableExtension";

export class SecurityValidation {
  public static checkFileURLOwnership(dir: URL, ext: LoadableExtension): boolean {
    const absoluteEntry = dir.href;

    if (!absoluteEntry.startsWith(ext.sourceUri + ext.extension.name + "/")) {
      return false;
    }

    return true;
  }
}
