import * as fs from "fs-extra";
import * as path from "path";
import ISettingStore from "../../../../common/settings/settingStore";
import CommonEvent from "@src/common/common/commonEvent";
import { ENV } from "@src/env";

export default class InternalSettingsService {
  public onSettingChange = new CommonEvent<{ key: string; value: any }>();

  public settings: ISettingStore = {};

  constructor(private appDataPath: string) {
    this.loadSettings();
  }

  public setSettingAndSave(key: string, value: any, propagate = true) {
    this.settings[key] = value;
    if (propagate) {
      this.onSettingChange.propagate({ key, value });
    }
    this.save();
  }

  private save() {
    const settingsFile = path.join(this.appDataPath, ENV.INTERNAL_SETTINGS_APPDATA_PATH);
    fs.writeFile(settingsFile, JSON.stringify(this.settings), "utf8");
  }

  private loadSettings(): void {
    const settingsFile = path.join(this.appDataPath, ENV.INTERNAL_SETTINGS_APPDATA_PATH);

    if (!fs.existsSync(settingsFile)) {
      // create settings
      this.createSettings(settingsFile);
      return this.loadSettings();
    }

    const json = fs.readFileSync(settingsFile, "utf8");
    this.settings = JSON.parse(json);
  }

  private createSettings(settingsFilePath: string) {
    fs.copySync(path.join(__dirname, "defaultSettings.json"), settingsFilePath);
  }
}
