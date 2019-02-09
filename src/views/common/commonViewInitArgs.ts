import I18nArgs from "../../common/common/ipcEvents/i18nArgs";

export default class CommonViewInitArgs {
  public static getDefault(): CommonViewInitArgs {
    return new CommonViewInitArgs(new I18nArgs("", ""));
  }

  public i18nArgs: I18nArgs;

  constructor(i18nArgs: I18nArgs) {
    this.i18nArgs = i18nArgs;
  }
}
