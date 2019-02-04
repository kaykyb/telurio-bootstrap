export default class I18nArgs {
  public locale: string;
  public strJson: string;

  constructor(locale: string, strJson: string) {
    this.locale = locale;
    this.strJson = strJson;
  }
}
