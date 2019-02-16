import I18nArgs from "../../common/common/ipcEvents/i18nArgs";

export default class CommonViewInitArgs {
  public i18nArgs: I18nArgs;

  constructor(i18nArgs: I18nArgs) {
    this.i18nArgs = i18nArgs;
  }
}
