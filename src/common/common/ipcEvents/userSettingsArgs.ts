import ISettingStore from "@src/common/common/settings/settingStore";

export default class UserSettingsArgs {
  constructor(public readonly userSettings: ISettingStore) {}
}
