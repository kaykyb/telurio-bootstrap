import I18nArgs from "@src/common/common/ipcEvents/i18nArgs";
import UserSettingsArgs from "@src/common/common/ipcEvents/userSettingsArgs";
import InternalSettingsService from "@src/common/node/services/settings/internal/internalSettingsService";
import InternalSettingsArgs from "@src/common/common/ipcEvents/internalSettingsArgs";

export default class CommonViewInitArgs {
  constructor(
    public readonly i18nArgs: I18nArgs,
    public readonly userSettingsArg: UserSettingsArgs,
    public readonly internalSettingsArgs: InternalSettingsArgs
  ) {}
}
