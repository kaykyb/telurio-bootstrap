import styles from "./index.css";
import icons from "../../common/fonts/material-icons/material-icons.css";
import Sidebar from "./marketplace/sidebar/sidebar";
import { IPC_CHANNELS } from "../../../common/common/ipcChannels";
import InitializationArgs from "../../editor/common/classes/initializationArgs";
import I18nArgs from "../../../common/common/ipcEvents/i18nArgs";
import MarketplaceBrowserService from "./service/marketplaceBrowserService";
import BrowserI18nService from "../../../common/browser/i18nService";
import MainView from "./marketplace/main-view/mainView";
import Electron from "electron";
import IpcService from "../../../common/browser/ipcService";

// starts ipc service
MarketplaceBrowserService.ipcService = new IpcService();

if (MarketplaceBrowserService.ipcService.ipc) {
  // window.ipc.on(IPC_CHANNELS.INITIALIZATION_ARGUMENTS, (e: Event, i: InitializationArgs) => start(i));
  MarketplaceBrowserService.ipcService.ipc.on(IPC_CHANNELS.I18N_STRINGS, (e: Event, i: I18nArgs) => start(i));
}

function start(i18nArgs: I18nArgs) {
  MarketplaceBrowserService.i18n = new BrowserI18nService(i18nArgs.strJson);

  document.title = MarketplaceBrowserService.i18n.s("extView.Title");

  const root = document.getElementById("app-root");

  if (root) {
    root.classList.add(styles.root);

    const sidebar = new Sidebar();
    root.appendChild(sidebar.render());

    const mainView = new MainView();
    root.appendChild(mainView.render());
  }
}

if (MarketplaceBrowserService.ipcService.ipc) {
  MarketplaceBrowserService.ipcService.ipc.send(IPC_CHANNELS.BROWSER_READY);
}
