import Ii18nLanguage from "./i18nLanguage";

export default class I18nLanguageFile {
  constructor(
    public language: {
      code: string;
      name: string;
    },
    public contents: Ii18nLanguage
  ) {}
}
