import Label from "@src/common/common/extensions/manifest-type/label";
import SettingAcceptedValuesEntry from "./settingAcceptedValuesEntry";

interface ISettingsMap {
  // any: any;
  number: number;
  string: string;
  boolean: boolean;
  stringArr: string[];
  numberArr: number[];
  booleanArr: boolean[];
}

export default class SettingMetadata<K extends keyof ISettingsMap> {
  /**
   * Definition for a setting key
   * @param type The Type of the value stored
   * @param name The Name of the setting key
   * @param defaultValue The default value
   */
  constructor(
    public type: Extract<K, string>,
    public name: string,
    public label: Label[],
    public defaultValue: ISettingsMap[K],
    public acceptedValues?: Array<SettingAcceptedValuesEntry<ISettingsMap[K]>>,
    public description?: Label[],
    public section?: string
  ) {}
}
