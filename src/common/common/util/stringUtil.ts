export default class StringUtil {
  // based on stackoverflow answer --> https://stackoverflow.com/a/4673436 CC BY-SA
  public static format(str: string, ...args: string[]): string {
    return str.replace(/{(\d+)}/g, (match, n) => {
      return args[n] !== undefined ? args[n] : match;
    });
  }
}
