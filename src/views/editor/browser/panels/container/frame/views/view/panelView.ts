import * as styles from "./panelView.css";

import Tab from "@src/views/editor/common/classes/tab";
import EditorBrowserService from "@src/views/editor/browser/service/editorBrowserService";
import Panel from "@src/views/editor/common/classes/panel";
import LogUtility from "@src/common/common/util/logUtility";
import ResizeObserver from "resize-observer-polyfill";

export default class PanelView {
  public domElement!: HTMLElement;
  public iframe?: HTMLIFrameElement;
  public tab: Tab;

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
    this.iframe = iframe;

    // workaround to the chrome < 72 iframe drop bug
    editorService.panelViewsIndex.push(this);

    this.load = this.load.bind(this);

    this.tab = tab;

    editorService.extensionBridge.onPanelRegister.addListener(this.load);
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
    if (panel.name === this.tab.panelName && this.iframe) {
      this.iframe.src = panel.htmlFile;
      // let scripts = "";

      // panel.javascriptContents.forEach(script => {
      //   scripts = scripts + '<script src="' + script + '"></script>';
      // });

      // const html = "<html><body>" + scripts + "</body></html>";
      // this.iframe.srcdoc = html;
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
}
