import Titlebar from "../../../../common/component/titlebar/titlebar";
import styles from "./mainView.css";
import { IPC_CHANNELS } from "../../../../../common/common/ipcChannels";
import service from "../../../../common/services/commonViewBrowserService";

export default class MainView {
  private domElement?: HTMLDivElement;
  private titlebar?: Titlebar;

  public render(): HTMLDivElement {
    this.domElement = document.createElement("div");
    this.domElement.classList.add(styles.root);

    this.titlebar = new Titlebar(true);
    this.titlebar.onClose.addListener(() => {
      if (service.ipcService.ipc) {
        service.ipcService.ipc.send(IPC_CHANNELS.CLOSE_REQUEST);
      }
    });

    this.domElement.appendChild(this.titlebar.render());

    return this.domElement;
  }
}
