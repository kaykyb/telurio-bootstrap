import DropArea from "./drop-areas/drop-area/dropArea";
import PanelViews from "./views/panelViews";
import InnerPanelDropAreas from "./drop-areas/innerPanelDropAreas";

import * as styles from "./panelFrame.css";

import Tab from "@src/views/editor/common/classes/tab";
import ObservableArray, { ObservableArrayEvent } from "@src/common/common/observableArray";
import TrackableEvent from "@src/common/common/trackableEvent";
import EditorBrowserService from "../../../service/editorBrowserService";

export default class PanelFrame {
  public onTabDrop = new TrackableEvent<Tab, DropArea>();
  public domElement?: HTMLDivElement;

  private iframe!: HTMLIFrameElement;
  private iframeContainer!: HTMLDivElement;

  private tabs: ObservableArray<Tab>;
  private panelViews?: PanelViews;

  constructor(private readonly editorService: EditorBrowserService, tabs: ObservableArray<Tab>) {
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

    this.panelViews = new PanelViews(this.editorService, this.tabs);
    this.domElement.appendChild(this.panelViews.render());

    return this.domElement;
  }

  public setActiveTab(t: string) {
    if (this.panelViews) {
      this.panelViews.setActiveTab(t);
    }
  }
}
