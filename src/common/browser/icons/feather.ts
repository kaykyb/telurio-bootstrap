import { FEATHER_ICONS } from "./featherIcons";

// typescript adapted version of feather-icons
export default class FeatherIcons {
  public static getSvgPath(icon: string): string {
    return FEATHER_ICONS[icon];
  }
}
