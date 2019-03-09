import ExtensionManifest from "./manifest-type/extensionManifest";

export default class LoadableExtension {
  /**
   * A extension that can be loaded.
   * @param extension The extension manifest.
   * @param sourceUri The absolute extension root path with the protocol (https:/file:).
   * @param sourceDir The absolute extension root path on the filesystem.
   */
  constructor(public extension: ExtensionManifest, public sourceUri: string, public sourceDir: string) {}
}
