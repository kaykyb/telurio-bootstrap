import { BrowserWindow, ipcMain, Menu, MenuItem } from "electron";
import * as path from "path";

import { IPC_CHANNELS } from "../../common/common/ipcChannels";

import InitializationArgs from "./common/classes/initializationArgs";
import CommonPanelColumn from "./common/classes/panelColumn";
import CommonPanelRow from "./common/classes/panelRow";

import CommonLayoutConfig from "./common/classes/commonLayoutConfig";
import Tab from "./common/classes/tab";
import I18nService from "../../common/node/services/i18n/i18nService";
import Marketplace from "../marketplace/marketplace";

const WINDOW_HEIGHT = 600;
const WINDOW_WIDTH = 800;

export default class Editor {
  public browserWindow?: BrowserWindow;

  private marketplace?: Marketplace;

  private i18nJson: string;
  private i18nService: I18nService;

  constructor(i18nService: I18nService, i18nJson: string) {
    this.i18nService = i18nService;
    this.i18nJson = i18nJson;

    this.startIpc();
    this.createWindow();
  }

  private createWindow() {
    this.browserWindow = new BrowserWindow({
      height: WINDOW_HEIGHT,
      width: WINDOW_WIDTH,

      autoHideMenuBar: true,

      show: false,

      webPreferences: {
        contextIsolation: false,
        nodeIntegration: false,
        preload: path.join(__dirname, "browser", "preload.compiled.js")
      }
    });

    const windowMenu = new Menu();
    windowMenu.insert(
      0,
      new MenuItem({
        label: "Marketplace",

        click: () => this.showMarketplace()
      })
    );

    this.browserWindow.setMenu(windowMenu);

    this.browserWindow.loadFile(path.join(__dirname, "browser", "index.html"));
    this.browserWindow.on("closed", () => {
      this.browserWindow = undefined;
    });
  }

  private startIpc() {
    ipcMain.on(IPC_CHANNELS.BROWSER_READY, (event: Electron.Event) => {
      if (this.browserWindow) {
        if (this.browserWindow.webContents === event.sender) {
          event.returnValue = this.getConfigs();
          this.browserWindow.show();
        }
      }
    });
  }

  private getConfigs(): InitializationArgs {
    return new InitializationArgs(
      new CommonLayoutConfig(
        new CommonPanelRow(600, [
          new CommonPanelColumn(800, [
            new CommonPanelRow(400, [
              new CommonPanelColumn(300, [
                new CommonPanelRow(400, undefined, [new Tab("a", "Painel A", true), new Tab("b", "Painel B")]),
                new CommonPanelRow(200, undefined, [new Tab("c", "Painel C"), new Tab("d", "Painel D", true)])
              ]),
              new CommonPanelColumn(500, undefined, [new Tab("e", "Painel E", true), new Tab("f", "Painel F")])
            ]),
            new CommonPanelRow(200, undefined, [new Tab("g", "Painel G", true), new Tab("h", "Painel H")])
          ])
        ])
      )
    );
  }

  // Methods
  private showMarketplace() {
    if (!this.marketplace) {
      this.marketplace = new Marketplace(this.i18nService, this.i18nJson, this);

      this.marketplace.onClose.addListener(() => {
        console.log("Marketplace Closed");
        this.marketplace = undefined;
      });
    }
  }
}
