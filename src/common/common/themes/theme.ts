import LoadableExtension from "../extensions/loadableExtension";
import ExtensionTheme from "../extensions/manifest-type/extensionTheme";

export default class Theme {
  constructor(public extTheme: ExtensionTheme, public owner: LoadableExtension) {}
}
