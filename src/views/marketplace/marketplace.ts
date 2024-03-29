import { BrowserWindow } from "electron";
import * as path from "path";

import CommonViewMain from "../common/node/commonViewMain";

import I18nService from "@src/common/node/services/i18n/i18nService";
import CommonEvent from "@src/common/common/commonEvent";
import UserSettingsService from "@src/common/node/services/settings/user/userSettingsService";
import InternalSettingsService from "@src/common/node/services/settings/internal/internalSettingsService";

const WINDOW_HEIGHT = 500;
const WINDOW_WIDTH = 800;

export default class Marketplace {
  public onClose = new CommonEvent();

  private commonMain?: CommonViewMain;
  private browserWindow?: BrowserWindow;

  constructor(
    i18nService: I18nService,
    private parentWindow: BrowserWindow,
    private userSettingsService: UserSettingsService,
    private readonly internalSettingsService: InternalSettingsService
  ) {
    this.createWindow(i18nService);
  }

  private createWindow(i18nService: I18nService) {
    this.browserWindow = new BrowserWindow({
      height: WINDOW_HEIGHT,
      width: WINDOW_WIDTH,

      autoHideMenuBar: true,
      frame: false,
      maximizable: false,
      minimizable: false,
      parent: this.parentWindow,
      resizable: false,
      show: false,
      webPreferences: {
        contextIsolation: false,
        nodeIntegration: false,
        preload: path.join(__dirname, "browser", "preload.compiled.js")
      },

      backgroundColor: this.getWindowColor()
    });

    this.browserWindow.loadFile(path.join(__dirname, "browser", "index.html"));
    this.browserWindow.on("closed", () => {
      this.browserWindow = undefined;
      this.commonMain = undefined;
      this.onClose.propagate({});
    });

    this.commonMain = new CommonViewMain(
      this.browserWindow,
      i18nService,
      this.userSettingsService,
      this.internalSettingsService
    );

    this.commonMain.onCloseRequest.addListener(() => {
      if (this.commonMain && this.browserWindow) {
        this.commonMain.removeListeners();
        this.browserWindow.close();
      }
    });
  }

  private getWindowColor(): string {
    const themeColors = this.internalSettingsService.settings.themeColors;

    if (themeColors && themeColors.background) {
      if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/.test(themeColors.background)) {
        return themeColors.background;
      }
    }

    return "#000000";
  }
}
