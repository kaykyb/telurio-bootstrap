import I18nArgs from "@src/common/common/ipcEvents/i18nArgs";
import UserSettingsArgs from "@src/common/common/ipcEvents/userSettingsArgs";

export default class CommonViewInitArgs {
  constructor(public i18nArgs: I18nArgs, public userSettingsArg: UserSettingsArgs) {}
}
