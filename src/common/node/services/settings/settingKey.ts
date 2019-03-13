export default class SettingKey<T> {
  constructor(public readonly key: string, public readonly value: T) {}
}
