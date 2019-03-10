import ISettingStore from "@src/common/node/services/settings/settingStore";
import CommonEvent from "@src/common/common/commonEvent";

export default class ConfigurationManager {
  public onSettingChangeRequest = new CommonEvent<{ key: string; value: string }>();

  constructor(private readonly settings: ISettingStore) {}

  public containsSetting(key: string) {
    return this.settings.hasOwnProperty(key);
  }

  public getSetting(key: string): any {
    return this.settings[key];
  }

  public setSetting(key: string, value: any) {
    this.updateSetting(key, value);
    this.onSettingChangeRequest.propagate({ key, value });
    // if (this.ipcService.ipc) {
    //   this.ipcService.ipc.send(IPC_CHANNELS.SET_SETTING, { key, value });
    // }
  }

  public updateSetting(key: string, value: any) {
    this.settings[key] = value;
  }
}
