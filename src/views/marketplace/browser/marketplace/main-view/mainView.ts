import Titlebar from "../../../../common/component/titlebar/titlebar";
import styles from "./mainView.css";
import { IPC_CHANNELS } from "../../../../../common/common/ipcChannels";
import ViewComponent from "../../../../common/viewComponent";

export default class MainView extends ViewComponent {
  private domElement?: HTMLDivElement;
  private titlebar?: Titlebar;

  public render(): HTMLDivElement {
    this.domElement = document.createElement("div");
    this.domElement.classList.add(styles.root);

    this.titlebar = new Titlebar(this.commonService, true);
    this.titlebar.onClose.addListener(() => {
      if (this.commonService.ipcService.ipc) {
        this.commonService.ipcService.ipc.send(IPC_CHANNELS.CLOSE_REQUEST);
      }
    });

    this.domElement.appendChild(this.titlebar.render());

    return this.domElement;
  }
}
