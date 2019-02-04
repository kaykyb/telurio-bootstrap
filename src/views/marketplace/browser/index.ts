import styles from "./index.css";
import icons from "../../common/fonts/material-icons/material-icons.css";
import Sidebar from "./marketplace/sidebar/sidebar";
import { IPC_CHANNELS } from "../../../common/common/ipcChannels";
import InitializationArgs from "../../editor/common/classes/initializationArgs";
import I18nArgs from "../../../common/common/ipcEvents/i18nArgs";
import MarketplaceBrowserService from "./service/marketplaceBrowserService";
import BrowserI18nService from "../../../common/browser/i18nService";

// insert root class
declare global {
  // tslint:disable-next-line:interface-name
  interface Window {
    ipc: Electron.IpcRenderer;
  }
}

if (window.ipc) {
  // window.ipc.on(IPC_CHANNELS.INITIALIZATION_ARGUMENTS, (e: Event, i: InitializationArgs) => start(i));
  window.ipc.on(IPC_CHANNELS.I18N_STRINGS, (e: Event, i: I18nArgs) => start(i));
}

function start(i18nArgs: I18nArgs) {
  MarketplaceBrowserService.i18n = new BrowserI18nService(i18nArgs.strJson);

  document.title = MarketplaceBrowserService.i18n.s("extView.Title");

  const root = document.getElementById("app-root");

  if (root) {
    root.classList.add(styles.root);

    const sidebar = new Sidebar();
    root.appendChild(sidebar.render());
  }
}

window.ipc.send(IPC_CHANNELS.BROWSER_READY);
