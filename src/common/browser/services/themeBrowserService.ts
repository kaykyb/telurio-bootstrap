import IThemeColors from "@src/common/common/themes/themeColors";

export default class ThemeBrowserService {
  public apply(theme: IThemeColors) {
    const root = document.documentElement;

    for (const variable in theme) {
      if (theme.hasOwnProperty(variable)) {
        const v = theme[variable];
        root.style.setProperty("--" + variable, v);
      }
    }
  }
}
