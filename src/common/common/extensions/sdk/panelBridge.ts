import PanelMessage from "./panelMessage";
import ITheme from "../../theme";
import ThemeBrowserService from "@src/common/browser/services/themeBrowserService";

export default class PanelBridge {
  constructor() {
    this.handleWindowMessage = this.handleWindowMessage.bind(this);
    this.handleTheme = this.handleTheme.bind(this);

    window.addEventListener("message", this.handleWindowMessage);
  }

  public applyTheme() {
    window.top.postMessage(new PanelMessage("requestTheme", undefined), "*");
  }

  //#region Event Handlers
  private handleWindowMessage(ev: MessageEvent) {
    const data = ev.data as PanelMessage<any>;
    switch (data.type) {
      case "theme":
        this.handleTheme(data.data);
        break;

      default:
        break;
    }
  }

  private handleTheme(theme: ITheme) {
    const themeService = new ThemeBrowserService();
    themeService.apply(theme);
  }
}
