import ExtensionManifest from "./manifest-type/extensionManifest";

export const CORE_EXTENSION_MANIFEST: ExtensionManifest = new ExtensionManifest(
  "",
  "core",

  [
    {
      content: "Telurio Core",
      lang: "en"
    }
  ],

  "0.0.1",

  "Telurio Developers",

  []
);
