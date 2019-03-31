import ExtensionPermission from "./extensionPermission";
import ExtensionCommand from "./extensionCommand";
import SettingMetadata from "@src/common/node/services/settings/settingMetadata";
import ExtensionSettingsSection from "./extensionSettingsSection";

export default class ExtensionContributions {
  constructor(
    public commands?: ExtensionCommand[],
    public permissions?: ExtensionPermission[],
    public settings?: Array<SettingMetadata<any>>,
    public settingsSections?: ExtensionSettingsSection[]
  ) {}
}
