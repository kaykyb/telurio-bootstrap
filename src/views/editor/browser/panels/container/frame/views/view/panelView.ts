import * as styles from "./panelView.css";

import Tab from "@src/views/editor/common/classes/tab";
import EditorBrowserService from "@src/views/editor/browser/service/editorBrowserService";
import Panel from "@src/views/editor/common/classes/panel";
import LogUtility from "@src/common/common/util/logUtility";
import ResizeObserver from "resize-observer-polyfill";
import PanelMessage from "@src/common/common/extensions/sdk/panelMessage";

export default class PanelView {
  public domElement!: HTMLElement;
  public iframe?: HTMLIFrameElement;
  public tab: Tab;

  private panel?: Panel;

  // tslint:disable-next-line:variable-name
  private _isActive: boolean = false;
  public get isActive(): boolean {
    return this._isActive;
  }
  public set isActive(v: boolean) {
    if (this._isActive && !v) {
      this.deactive();
    } else if (!this._isActive && v) {
      this.active();
    }

    this._isActive = v;
  }

  constructor(private readonly editorService: EditorBrowserService, tab: Tab, iframe?: HTMLIFrameElement) {
    this.handleWindowMessage = this.handleWindowMessage.bind(this);
    this.iframe = iframe;

    // workaround to the chrome < 72 iframe drop bug
    editorService.panelViewsIndex.push(this);

    this.load = this.load.bind(this);

    this.tab = tab;

    editorService.extensionBridge.onPanelRegister.addListener(this.load);

    window.addEventListener("message", this.handleWindowMessage);
  }

  public render(): HTMLElement {
    this.domElement = document.createElement("div");
    this.domElement.classList.add(styles.view, styles.deactive);

    if (!this.iframe) {
      this.iframe = document.createElement("iframe");
      this.iframe.height = "100%";
      this.iframe.width = "100%";
      this.iframe.sandbox.add("allow-scripts");
    }

    this.domElement.appendChild(this.iframe);
    return this.domElement;
  }

  private load(panel: Panel) {
    if (
      panel.name === this.tab.panelName &&
      this.iframe &&
      panel.owner.extension.name === this.tab.panelOwnerName // security
    ) {
      this.panel = panel;
      this.iframe.src = panel.htmlFile;
    }
  }

  private deactive() {
    this.domElement.classList.remove(styles.active);
    this.domElement.classList.add(styles.deactive);
  }

  private active() {
    this.domElement.classList.add(styles.active);
    this.domElement.classList.remove(styles.deactive);
  }

  private handleWindowMessage(ev: MessageEvent) {
    if (this.iframe && ev.source === this.iframe.contentWindow && ev.data) {
      const messageParsed: PanelMessage<any> = ev.data;

      switch (messageParsed.type) {
        case "requestTheme":
          this.sendTheme();
          break;

        case "sendMessage":
          this.propagateMessage(messageParsed.data);

        default:
          break;
      }
    }
  }

  private propagateMessage(data: string) {
    if (this.panel) {
      this.panel.onMessage.propagate({ panelArgs: this.tab.args, message: data });
    }
  }

  private sendTheme() {
    if (this.iframe && this.iframe.contentWindow) {
      this.iframe.contentWindow.postMessage(
        new PanelMessage(
          "theme",
          this.editorService.commonService.internalSettings.getSetting("themeColors")
        ),
        "*"
      );
    }
  }
}
