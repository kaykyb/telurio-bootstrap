import PanelTabs from "./tabs/panelTabs";

import Tab from "../../../common/classes/tab";
import PanelFrame from "./frame/panelFrame";

import * as styles from "./panelContainer.css";

import ObservableArray from "../../../../../common/common/observableArray";
import TrackableEvent from "../../../../../common/common/trackableEvent";
import DropArea from "./frame/drop-areas/drop-area/dropArea";
import CommonEvent from "../../../../../common/common/commonEvent";
import PanelTab from "./tabs/tab/panelTab";

export default class PanelContainer {
  public onEmpty = new CommonEvent();

  public onTabDrop = new TrackableEvent<Tab, DropArea>();
  public domElement!: HTMLDivElement;

  private tabsPanel!: PanelTabs;
  private panelFrame!: PanelFrame;

  private panels: ObservableArray<Tab>;

  // tslint:disable-next-line:variable-name
  private _activePanel: string = "";
  public get activePanel(): string {
    return this._activePanel;
  }
  public set activePanel(v: string) {
    if (this._activePanel !== v) {
      this._activePanel = v;

      if (this.tabsPanel) {
        this.tabsPanel.setActiveTab(v);
      }

      if (this.panelFrame) {
        this.panelFrame.setActiveTab(v);
      }
    }
  }

  constructor(panels: ObservableArray<Tab>) {
    this.panels = panels;

    this.handlePanelTabsDragOut = this.handlePanelTabsDragOut.bind(this);
    this.handlePanelTabsDrop = this.handlePanelTabsDrop.bind(this);
    this.handlePanelTabsTabClick = this.handlePanelTabsTabClick.bind(this);
  }

  public render(): HTMLDivElement {
    this.domElement = document.createElement("div");
    this.domElement.className = styles.container;

    // this.tabs = this.getTabs();

    this.tabsPanel = new PanelTabs(this.panels);
    this.tabsPanel.onTabDragOut.addListener(this.handlePanelTabsDragOut);
    this.tabsPanel.onTabDrop.addListener(this.handlePanelTabsDrop);
    this.tabsPanel.onTabClick.addListener(this.handlePanelTabsTabClick);

    const tabsPanelContainer = document.createElement("div");
    tabsPanelContainer.classList.add(styles.tabsPanelContainer);
    tabsPanelContainer.appendChild(this.tabsPanel.render());

    this.domElement.appendChild(tabsPanelContainer);

    this.panelFrame = new PanelFrame(this.panels);
    this.domElement.appendChild(this.panelFrame.render());

    this.panelFrame.onTabDrop.addListener((t, s) => {
      this.onTabDrop.propagate(t, s);
    });

    this.panels.forEach(v => {
      if (v.active) {
        this.activePanel = v.panelId;
      }
    });

    if (this._activePanel === "" && this.panels.length > 0) {
      this.activePanel = this.panels.get(0).panelId;
    }

    return this.domElement;
  }

  private handlePanelTabsTabClick(sender: PanelTab) {
    this.activePanel = sender.tab.panelId;
  }

  private handlePanelTabsDragOut(tab: Tab, sender: PanelTabs) {
    const tabIndex = this.panels.first(x => x.panelId === tab.panelId);

    if (tabIndex > -1) {
      this.panels.delete(tabIndex, 1);
    }

    if (!this.panels || this.panels.length === 0) {
      this.onEmpty.propagate({});
    } else if (this.panels && this.panels.length > 0) {
      this.activePanel = this.panels.get(0).panelId;
    }
  }

  private handlePanelTabsDrop(tab: Tab, sender: PanelTabs) {
    this.panels.push(tab);
    this.activePanel = tab.panelId;
  }

  // private getTabs(): ObservableArray<Tab> {
  //   const v = new ObservableArray<Tab>();

  //   if (this.panels) {
  //     this.panels.forEach(p => {
  //       v.push(new Tab(p, p));
  //     });
  //   }

  //   return v;
  // }
}
