import ExtensionManifest from "./manifest-type/extensionManifest";
import LoadableExtension from "./loadableExtension";

export const CORE_EXTENSION_MANIFEST: LoadableExtension = new LoadableExtension(
  new ExtensionManifest(
    "",
    "core",

    [
      {
        content: "Telurio Core",
        lang: "en"
      }
    ],

    "0.1.0",

    "Telurio Developers",

    []
  ),
  "",
  ""
);

export const EDITOR_EXTENSION_MANIFEST: LoadableExtension = new LoadableExtension(
  new ExtensionManifest(
    "",
    "editor",

    [
      {
        content: "Telurio Editor",
        lang: "en"
      }
    ],

    "0.1.0",

    "Telurio Developers",

    []
  ),
  "",
  ""
);