import ExtensionManifest from "./manifest-type/extensionManifest";
import LoadableExtension from "./loadableExtension";
import SettingMetadata from "@src/common/node/services/settings/settingMetadata";
import Label from "./manifest-type/label";
import ExtensionSettingsSection from "./manifest-type/extensionSettingsSection";
import I18nLanguageFile from "@src/common/node/services/i18n/i18nLanguageFile";

export default class CommonManifests {
  public static getCoreExtensionManifest(lang?: I18nLanguageFile): LoadableExtension {
    if (lang && this.coreExtensionManifestCache.has(lang.language.code)) {
      const m = this.coreExtensionManifestCache.get(lang.language.code);
      if (m) {
        return m;
      }
    }

    const manifest = new LoadableExtension(
      new ExtensionManifest(
        "",
        "core",

        "Telurio Core",

        "0.1.0",

        "Telurio Developers",

        [],

        {
          settingsSections: [
            new ExtensionSettingsSection(
              "developer",
              [
                new Label(
                  lang ? lang.language.code : "en",
                  lang ? lang.contents.core.settingsSection.developer : "Developer"
                )
              ],
              "code"
            )
          ],

          settings: [
            new SettingMetadata(
              "boolean",
              "enableDevTools",
              [
                new Label(
                  lang ? lang.language.code : "en",
                  lang ? lang.contents.core.settings.enableDevTools.label : "Enable Developer Tools"
                )
              ],
              false,
              undefined,
              [
                new Label(
                  lang ? lang.language.code : "en",
                  lang
                    ? lang.contents.core.settings.enableDevTools.desc
                    : "Enable the Telurio Developer Tools for extension development."
                )
              ],
              "developer"
            )
          ]
        }
      ),
      "",
      ""
    );

    if (lang) {
      this.coreExtensionManifestCache.set(lang.language.code, manifest);
    }

    return manifest;
  }

  private static coreExtensionManifestCache = new Map<string, LoadableExtension>();
}

// export const CORE_EXTENSION_MANIFEST: LoadableExtension = CommonManifests.getCoreExtensionManifest();

export const EDITOR_EXTENSION_MANIFEST: LoadableExtension = new LoadableExtension(
  new ExtensionManifest(
    "",
    "editor",

    "Telurio Editor",

    "0.1.0",

    "Telurio Developers",

    []
  ),
  "",
  ""
);
