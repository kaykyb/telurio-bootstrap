export default class BrowserI18nService {
  private readonly strings: { [k: string]: string };

  constructor(strsJson: string) {
    // tslint:disable-next-line: no-unsafe-any
    this.strings = JSON.parse(strsJson);
  }

  public s(str: string): string {
    return this.strings[str];
  }
}
