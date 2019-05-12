import LoadableExtension from "../extensions/loadableExtension";
import ExtensionTheme from "../extensions/manifest-type/extensionTheme";
import ExtensionManifest from "../extensions/manifest-type/extensionManifest";
import Theme from "../themes/theme";

export default class ExtUtil {
  public static getAvailableThemes(exts: LoadableExtension[]): Theme[] {
    const themesFound: Theme[] = [];

    exts.forEach(ext => {
      if (ext.extension.contributions && ext.extension.contributions.colorThemes) {
        ext.extension.contributions.colorThemes.forEach(theme => {
          if (this.isThemeValid(theme)) {
            const normalizedTheme = new Theme(theme, ext);
            themesFound.push(normalizedTheme);
          }
        });
      }
    });

    return themesFound;
  }

  public static isThemeValid(theme: ExtensionTheme): boolean {
    return (
      theme.file !== undefined &&
      theme.name !== undefined &&
      theme.type !== undefined &&
      theme.label !== undefined
    );
  }

  public static getSecureObjectUrl(ext: LoadableExtension, obj: string): string {
    return new URL(ext.sourceUri + obj).href;
  }

  public static getSecureObjectId(ext: ExtensionManifest, obj: string): string {
    return ext.name + "." + obj;
  }
}
