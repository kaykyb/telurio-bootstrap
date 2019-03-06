interface ISettingsMap {
  any: any;
  number: number;
  string: string;
  boolean: boolean;
  stringArr: string[];
  numberArr: number[];
  booleanArr: boolean[];
}

export default class SettingMetadata<K extends keyof ISettingsMap> {
  constructor(public type: K, public name: string, public defaultValue: ISettingsMap[K]) {}
}
