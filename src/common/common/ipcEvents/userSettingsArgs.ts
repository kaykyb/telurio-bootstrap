import ISettingStore from "@src/common/node/services/settings/settingStore";

export default class UserSettingsArgs {
  constructor(public userSettings: ISettingStore) {}
}
