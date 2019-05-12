import ISettingStore from "@src/common/common/settings/settingStore";

export default class InternalSettingsArgs {
  constructor(public readonly internalSettings: ISettingStore) {}
}
