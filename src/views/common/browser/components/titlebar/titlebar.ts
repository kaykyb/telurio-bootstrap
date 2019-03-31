import styles from "./titlebar.css";
import WindowControls from "./window-controls/windowControls";
import IconButton from "./icon-button/iconButton";

import CommonEvent from "@src/common/common/commonEvent";
import { ENV } from "@src/env";
import CommonViewBrowserService from "@src/views/common/browser/services/commonViewBrowserService";
import { IPC_CHANNELS } from "@src/common/common/ipcChannels";

export default class Titlebar {
  public onClose = new CommonEvent();

  private domElement?: HTMLDivElement;
  private windowControls?: WindowControls;

  private rightSideElements?: HTMLElement;
  private leftSideElements?: HTMLElement;

  constructor(
    private commonBrowserService: CommonViewBrowserService,
    rightSideElements?: HTMLElement,
    leftSideElements?: HTMLElement
  ) {
    this.rightSideElements = rightSideElements;
    this.leftSideElements = leftSideElements;
  }

  public async render(): Promise<HTMLDivElement> {
    this.domElement = document.createElement("div");
    this.domElement.classList.add(styles.titlebar);

    const dragArea = document.createElement("div");
    dragArea.classList.add(styles.drag);

    const title = document.createElement("div");
    title.classList.add(styles.title);
    title.textContent = document.title;

    // stackoverflow -> https://stackoverflow.com/a/29540461 Creative Commons CC BY-SA
    new MutationObserver(mutations => {
      title.textContent = document.title;
    }).observe(document.querySelector("title") as HTMLTitleElement, {
      characterData: true,
      childList: true,
      subtree: true
    });

    // Left Side Controls
    const leftSideControlsContainer = document.createElement("div");
    leftSideControlsContainer.classList.add(styles.controlsContainer);

    // adds code button to devtools
    if (ENV.IS_DEV) {
      const devBtn = new IconButton("code");
      leftSideControlsContainer.appendChild(devBtn.render());

      devBtn.onClick.addListener(() => {
        this.commonBrowserService.showDevTools();
      });
    }

    // Window Controls
    const windowControlsContainer = document.createElement("div");
    windowControlsContainer.classList.add(styles.controlsContainer);

    this.windowControls = new WindowControls(
      await this.commonBrowserService.getWindowIsCloseable(),
      await this.commonBrowserService.getWindowIsMinimizable(),
      await this.commonBrowserService.getWindowIsMaximizable(),
      await this.commonBrowserService.getIsMaximized()
    );

    this.windowControls.onCloseClick.addListener(() => {
      this.commonBrowserService.close();
    });

    this.windowControls.onMaximizeClick.addListener(() => {
      this.commonBrowserService.maximizeOrRestore();
    });

    this.windowControls.onRestoreClick.addListener(() => {
      this.commonBrowserService.maximizeOrRestore();
    });

    this.windowControls.onMinimizeClick.addListener(() => {
      this.commonBrowserService.minimize();
    });

    this.commonBrowserService.onMaximize.addListener(() => {
      if (this.windowControls) {
        this.windowControls.wasMaximized();
      }
    });

    this.commonBrowserService.onRestore.addListener(() => {
      if (this.windowControls) {
        this.windowControls.wasRestored();
      }
    });

    windowControlsContainer.appendChild(this.windowControls.render());

    if (this.leftSideElements) {
      this.domElement.appendChild(this.leftSideElements);
    }
    this.domElement.appendChild(leftSideControlsContainer);
    this.domElement.appendChild(dragArea);
    if (this.rightSideElements) {
      this.domElement.appendChild(this.rightSideElements);
    }
    this.domElement.appendChild(windowControlsContainer);
    this.domElement.appendChild(title);

    return this.domElement;
  }
}
