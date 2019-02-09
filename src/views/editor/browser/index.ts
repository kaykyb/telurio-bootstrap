import PanelManager from "./panels/panelManager";

import { IPC_CHANNELS } from "../../../common/common/ipcChannels";

import InitializationArgs from "../common/classes/initializationArgs";

import styles from "./index.css";
import Electron from "electron";

import EditorBrowserService from "./service/editorBrowserService";
import IpcService from "../../../common/browser/ipcService";

EditorBrowserService.ipcService = new IpcService();

// if (window.ipc) {
//   window.ipc.on(IPC_CHANNELS.INITIALIZATION_ARGUMENTS, (e: Event, i: InitializationArgs) => start(i));
// }

// script ----------------------------
const root = document.getElementById("app-root") as HTMLElement;
root.classList.add(styles.root);
let panelManager: PanelManager;

function start(args: InitializationArgs) {
  panelManager = new PanelManager(root, args.layoutConfig);
}

if (EditorBrowserService.ipcService.ipc) {
  start(EditorBrowserService.ipcService.ipc.sendSync(IPC_CHANNELS.BROWSER_READY));
}
