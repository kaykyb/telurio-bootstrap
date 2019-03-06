import * as fs from "fs";
import * as path from "path";
import I18nLanguageFile from "./i18nLanguageFile";

export default class I18nService {
  public static getAvailableLocations(): string[] {
    let availableLocations: string[] = [];
    const stringsPath = path.join(__dirname, "strings");

    if (fs.existsSync(stringsPath)) {
      const files = fs.readdirSync(stringsPath);
      availableLocations = files.map(fileName => fileName.replace(".json", ""));
    }

    return availableLocations;
  }

  public locale: string;
  public language?: I18nLanguageFile;

  constructor(locale: string, keepRaw = false) {
    this.locale = locale;
    this.loadStrings(false, keepRaw);
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
      // app is corrupted
    }

    if (json !== "") {
      this.language = JSON.parse(json);
    }
  }
}
