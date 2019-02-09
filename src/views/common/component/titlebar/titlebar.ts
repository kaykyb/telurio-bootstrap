import styles from "./titlebar.css";
import WindowControls from "./window-controls/windowControls";
import CommonEvent from "../../../../common/common/commonEvent";

export default class Titlebar {
  public onClose = new CommonEvent();

  public closable: boolean;

  private domElement?: HTMLDivElement;
  private windowControls?: WindowControls;

  constructor(closable: boolean) {
    this.closable = closable;
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

    const windowControlsContainer = document.createElement("div");
    windowControlsContainer.classList.add(styles.controlsContainer);

    this.windowControls = new WindowControls(this.closable);
    this.windowControls.onCloseClick.addListener(() => this.onClose.propagate({}));

    windowControlsContainer.appendChild(this.windowControls.render());

    this.domElement.appendChild(dragArea);
    this.domElement.appendChild(windowControlsContainer);
    this.domElement.appendChild(title);

    return this.domElement;
  }
}
