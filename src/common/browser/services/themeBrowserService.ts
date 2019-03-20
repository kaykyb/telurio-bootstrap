import ITheme from "@src/common/common/theme";

export default class ThemeBrowserService {
  public apply(theme: ITheme) {
    const root = document.documentElement;

    for (const variable in theme) {
      if (theme.hasOwnProperty(variable)) {
        const v = theme[variable];
        root.style.setProperty("--" + variable, v);
      }
    }
  }
}
