import Tab from "../../../../common/classes/tab";

import * as styles from "./panelFrame.css";

import InnerPanelDropAreas from "./drop-areas/innerPanelDropAreas";

import ObservableArray, { ObservableArrayEvent } from "../../../../../../common/common/observableArray";
import TrackableEvent from "../../../../../../common/common/trackableEvent";
import DropArea from "./drop-areas/drop-area/dropArea";
import PanelViews from "./views/panelViews";

export default class PanelFrame {
  public onTabDrop = new TrackableEvent<Tab, DropArea>();
  public domElement?: HTMLDivElement;

  private iframe!: HTMLIFrameElement;
  private iframeContainer!: HTMLDivElement;

  private tabs: ObservableArray<Tab>;
  private panelViews?: PanelViews;

  constructor(tabs: ObservableArray<Tab>) {
    this.tabs = tabs;
  }

  public render(): HTMLDivElement {
    this.domElement = document.createElement("div");
    this.domElement.classList.add(styles.frame);

    const dropAreas = new InnerPanelDropAreas();
    this.domElement.appendChild(dropAreas.render());

    dropAreas.onTabDrop.addListener((tab, sender) => {
      this.onTabDrop.propagate(tab, sender);
    });

    this.panelViews = new PanelViews(this.tabs);
    this.domElement.appendChild(this.panelViews.render());

    return this.domElement;
  }

  public setActiveTab(t: string) {
    if (this.panelViews) {
      this.panelViews.setActiveTab(t);
    }
  }
}
