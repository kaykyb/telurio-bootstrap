import styles from "./mainView.css";

import Titlebar from "@src/views/common/browser/components/titlebar/titlebar";
import { IPC_CHANNELS } from "@src/common/common/ipcChannels";
import ViewComponent from "@src/views/common/browser/viewComponent";

export default class MainView extends ViewComponent {
  private domElement?: HTMLDivElement;
  private titlebar?: Titlebar;

  public render(): HTMLDivElement {
    this.domElement = document.createElement("div");
    this.domElement.classList.add(styles.root);

    this.titlebar = new Titlebar(this.commonService);
    this.titlebar.onClose.addListener(() => {
      if (this.commonService.ipcService.ipc) {
        this.commonService.ipcService.ipc.send(IPC_CHANNELS.CLOSE_REQUEST);
      }
    });

    this.domElement.appendChild(this.titlebar.render());

    return this.domElement;
  }
}
