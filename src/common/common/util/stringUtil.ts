import Label from "../extensions/manifest-type/label";

export default class StringUtil {
  public static getAppropriateLabel(from: Label[], lang: string): Label {
    const locLabel = from.find(l => l.lang === lang);
    const enLabel = from.find(l => l.lang === "en");
    const zeroLabel = from[0];

    return locLabel || enLabel || zeroLabel;
  }

  // based on stackoverflow answer --> https://stackoverflow.com/a/4673436 CC BY-SA
  public static format(str: string, ...args: string[]): string {
    return str.replace(/{(\d+)}/g, (match, n) => {
      return args[n] !== undefined ? args[n] : match;
    });
  }
}
