import ExtensionPermission from "./extensionPermission";
import ExtensionCommand from "./extensionCommand";
import SettingMetadata from "@src/common/common/settings/settingMetadata";
import ExtensionSettingsSection from "./extensionSettingsSection";
import ExtensionTheme from "./extensionTheme";

export default class ExtensionContributions {
  constructor(
    public commands?: ExtensionCommand[],
    public permissions?: ExtensionPermission[],
    public settings?: Array<SettingMetadata<any>>,
    public settingsSections?: ExtensionSettingsSection[],
    public colorThemes?: ExtensionTheme[]
  ) {}
}
