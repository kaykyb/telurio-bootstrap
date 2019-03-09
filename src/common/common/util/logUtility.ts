export default class LogUtility {
  public static err(code: string, level: "Security" | "Exception", message: string) {
    // tslint:disable-next-line: no-console
    console.error(`(${code}) [${level}]: ${message}`);
  }
}
