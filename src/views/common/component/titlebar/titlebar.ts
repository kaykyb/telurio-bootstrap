import styles from "./titlebar.css";
import WindowControls from "./window-controls/windowControls";
import CommonEvent from "../../../../common/common/commonEvent";
import { IS_DEV } from "../../../../env";
import IconButton from "./icon-button/iconButton";
import CommonViewBrowserService from "../../services/commonViewBrowserService";
import { IPC_CHANNELS } from "../../../../common/common/ipcChannels";

export default class Titlebar {
  public onClose = new CommonEvent();

  public closable: boolean;

  private domElement?: HTMLDivElement;
  private windowControls?: WindowControls;

  private rightSideElements?: HTMLElement;
  private leftSideElements?: HTMLElement;

  constructor(closable: boolean, rightSideElements?: HTMLElement, leftSideElements?: HTMLElement) {
    this.closable = closable;
    this.rightSideElements = rightSideElements;
    this.leftSideElements = leftSideElements;
  }

  public render(): HTMLDivElement {
    this.domElement = document.createElement("div");
    this.domElement.classList.add(styles.titlebar);

    const dragArea = document.createElement("div");
    dragArea.classList.add(styles.drag);

    const title = document.createElement("div");
    title.classList.add(styles.title);
    title.innerText = document.title;

    // stackoverflow -> https://stackoverflow.com/a/29540461 Creative Commons CC BY-SA
    new MutationObserver(mutations => {
      title.innerText = document.title;
    }).observe(document.querySelector("title") as HTMLTitleElement, {
      characterData: true,
      childList: true,
      subtree: true
    });

    // Left Side Controls
    const leftSideControlsContainer = document.createElement("div");
    leftSideControlsContainer.classList.add(styles.controlsContainer);

    // adds code button to devtools
    if (IS_DEV) {
      const devBtn = new IconButton("code");
      leftSideControlsContainer.appendChild(devBtn.render());

      devBtn.onClick.addListener(() => {
        if (CommonViewBrowserService.ipcService.ipc) {
          CommonViewBrowserService.ipcService.ipc.send(IPC_CHANNELS.SHOW_DEV_TOOLS);
        }
      });
    }

    // Window Controls
    const windowControlsContainer = document.createElement("div");
    windowControlsContainer.classList.add(styles.controlsContainer);

    this.windowControls = new WindowControls(this.closable);
    this.windowControls.onCloseClick.addListener(() => {
      if (CommonViewBrowserService.ipcService.ipc) {
        CommonViewBrowserService.ipcService.ipc.send(IPC_CHANNELS.CLOSE_REQUEST);
      }
    });

    windowControlsContainer.appendChild(this.windowControls.render());

    this.domElement.appendChild(leftSideControlsContainer);
    this.domElement.appendChild(dragArea);
    this.domElement.appendChild(windowControlsContainer);
    this.domElement.appendChild(title);

    return this.domElement;
  }
}
