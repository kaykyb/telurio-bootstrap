import PanelMessage from "./panelMessage";
import IThemeColors from "../../themes/themeColors";
import ThemeBrowserService from "@src/common/browser/services/themeBrowserService";
import PanelHostCommunicationArgs from "./panelHostCommunicationArgs";
import CommonEvent from "../../commonEvent";

export default class PanelBridge {
  public onMessageFromHost = new CommonEvent<any>();

  constructor() {
    this.handleWindowMessage = this.handleWindowMessage.bind(this);
    this.handleTheme = this.handleTheme.bind(this);

    window.addEventListener("message", this.handleWindowMessage);
  }

  public applyTheme() {
    window.top.postMessage(new PanelMessage("requestTheme", undefined), "*");
  }

  public sendMessage(data: any) {
    window.top.postMessage(new PanelMessage("sendMessage", data), "*");
  }

  //#region Event Handlers
  private handleWindowMessage(ev: MessageEvent) {
    const data = ev.data as PanelMessage<any>;
    switch (data.type) {
      case "theme":
        this.handleTheme(data.data);
        break;

      case "messageFromHost":
        this.onMessageFromHost.propagate(data.data);
        break;

      default:
        break;
    }
  }

  private handleTheme(theme: IThemeColors) {
    const themeService = new ThemeBrowserService();
    themeService.apply(theme);
  }
}
