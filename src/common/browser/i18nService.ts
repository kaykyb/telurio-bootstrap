export default class BrowserI18nService {
  private strings!: { [k: string]: string };

  constructor(strsJson: string) {
    this.strings = JSON.parse(strsJson);
  }

  public s(str: string): string {
    return this.strings[str];
  }
}
