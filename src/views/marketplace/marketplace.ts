import { BrowserWindow } from "electron";
import * as path from "path";

import I18nService from "../../common/node/services/i18n/i18nService";
import Editor from "../editor/editor";
import CommonViewMain from "../common/commonViewMain";
import CommonEvent from "../../common/common/commonEvent";

const WINDOW_HEIGHT = 500;
const WINDOW_WIDTH = 800;

export default class Marketplace {
  public onClose = new CommonEvent();

  private parentEditor: Editor;
  private commonMain?: CommonViewMain;
  private browserWindow?: BrowserWindow;

  constructor(i18nService: I18nService, i18nJson: string, parentEditor: Editor) {
    this.parentEditor = parentEditor;
    this.createWindow(i18nService, i18nJson);
  }

  private createWindow(i18nService: I18nService, i18nJson: string) {
    this.browserWindow = new BrowserWindow({
      height: WINDOW_HEIGHT,
      width: WINDOW_WIDTH,

      autoHideMenuBar: true,
      frame: false,
      maximizable: false,
      minimizable: false,
      parent: this.parentEditor.browserWindow,
      resizable: false,
      show: false,
      webPreferences: {
        contextIsolation: false,
        nodeIntegration: false,
        preload: path.join(__dirname, "browser", "preload.compiled.js")
      }
    });

    this.browserWindow.loadFile(path.join(__dirname, "browser", "index.html"));
    this.browserWindow.on("closed", () => {
      this.browserWindow = undefined;
      this.commonMain = undefined;
      this.onClose.propagate({});
    });

    this.commonMain = new CommonViewMain(this.browserWindow, i18nService, i18nJson);
    this.commonMain.onWindowReady.addListener(this.onWindowReady.bind(this));
  }

  private onWindowReady() {
    if (this.browserWindow) {
      this.browserWindow.show();
    }
  }
}
