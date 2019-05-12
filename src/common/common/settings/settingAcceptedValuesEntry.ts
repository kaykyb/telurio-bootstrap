import Label from "@src/common/common/extensions/manifest-type/label";

export default class SettingAcceptedValuesEntry<T> {
  constructor(public label: Label[], public value: T) {}
}
