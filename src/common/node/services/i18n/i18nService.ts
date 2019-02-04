import * as fs from "fs";
import * as path from "path";

export default class I18nService {
  public locale: string;
  private strings!: { [k: string]: string };
  private rawJson?: string;

  constructor(locale: string, keepRaw = false) {
    this.locale = locale;
    this.loadStrings(false, keepRaw);
  }

  public s(str: string): string {
    return this.strings[str];
  }

  // popRawJson?
  public disposeRawJson(): string | null {
    if (this.rawJson) {
      const j = this.rawJson;
      this.rawJson = "";
      return j;
    }

    return null;
  }

  private loadStrings(lastTry: boolean, keepRaw: boolean) {
    const localeFile = path.join(__dirname, "strings", this.locale + ".json");
    let json: string = "";
    if (fs.existsSync(localeFile)) {
      json = fs.readFileSync(localeFile, "utf8");
    } else if (!lastTry) {
      this.locale = "en";
      this.loadStrings(true, keepRaw);
      return;
    } else {
      // error
    }

    if (json !== "") {
      this.strings = JSON.parse(json);

      if (keepRaw) {
        this.rawJson = json;
      }
    }
  }
}
