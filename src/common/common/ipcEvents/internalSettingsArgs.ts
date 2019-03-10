import ISettingStore from "@src/common/node/services/settings/settingStore";

export default class InternalSettingsArgs {
  constructor(public readonly internalSettings: ISettingStore) {}
}
