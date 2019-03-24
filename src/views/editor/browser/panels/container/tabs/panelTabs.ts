import * as styles from "./panelTabs.css";
import PanelTab from "./tab/panelTab";

import TrackableEvent from "@src/common/common/trackableEvent";
import ObservableArray, { ObservableArrayEvent } from "@src/common/common/observableArray";
import CommonEvent from "@src/common/common/commonEvent";
import ScrollableElement from "@src/views/common/browser/components/scrollable-element/scrollableElement";
import Tab from "@src/views/editor/common/classes/tab";
import EditorBrowserService from "../../../service/editorBrowserService";

export default class PanelTabs {
  public onTabDragOut = new TrackableEvent<Tab, PanelTabs>();
  public onTabDrop = new TrackableEvent<Tab, PanelTabs>();
  public onTabClick = new CommonEvent<PanelTab>();

  private domElement!: HTMLDivElement;
  private dropArea!: HTMLDivElement;

  private panelTabs: PanelTab[] = [];

  private activeTab?: PanelTab;

  // tslint:disable-next-line:variable-name
  private _tabs!: ObservableArray<Tab>;
  public get tabs(): ObservableArray<Tab> {
    return this._tabs;
  }
  public set tabs(v: ObservableArray<Tab>) {
    if (this._tabs) {
      this.removeListenersFromTabArray(this._tabs);
    }
    this.addListenersToTabArray(v);

    this._tabs = v;
  }

  constructor(private readonly editorService: EditorBrowserService, tabs: ObservableArray<Tab>) {
    this._tabs = tabs;
    this.bindMethods();
    this.addListenersToTabArray(this._tabs);
  }

  public render(): HTMLDivElement {
    this.domElement = document.createElement("div");
    this.domElement.classList.add(styles.tabs);

    const frag = document.createDocumentFragment();

    this.tabs.forEach(tab => {
      this.addPanelTab(tab, frag);
    });

    this.dropArea = document.createElement("div");
    this.dropArea.className = styles.dropArea;

    this.dropArea.ondragover = this.onDragOver.bind(this);
    this.dropArea.ondragleave = this.onDragLeave.bind(this);
    this.dropArea.ondragenter = this.onDragEnter.bind(this);
    this.dropArea.ondrop = this.handleDropOnDropArea.bind(this);

    frag.appendChild(this.dropArea);

    this.domElement.appendChild(frag);

    return new ScrollableElement(this.domElement, "x", "4px").render();
  }

  public setActiveTab(tabId: string) {
    if (this.activeTab) {
      this.activeTab.isActive = false;
    }

    this.activeTab = this.panelTabs.filter(x => x.tab.id === tabId)[0];

    if (this.activeTab) {
      this.activeTab.isActive = true;
    }
  }

  private PutTabBefore(tab: PanelTab, before: PanelTab) {
    this.domElement.insertBefore(tab.domElement, before.domElement);
    return;
  }

  private PutTabAfter(tab: PanelTab, after: PanelTab) {
    this.domElement.insertBefore(tab.domElement, after.domElement.nextSibling);
    return;
  }

  private bindMethods() {
    this.handleTabsArrayAfterPush = this.handleTabsArrayAfterPush.bind(this);
    this.handleTabsArrayBeforeDelete = this.handleTabsArrayBeforeDelete.bind(this);
    this.handlePanelTabDragOut = this.handlePanelTabDragOut.bind(this);
    this.handlePanelTabDrop = this.handlePanelTabDrop.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);
  }

  private onDragOver(ev: DragEvent) {
    ev.preventDefault();

    if (ev.dataTransfer) {
      ev.dataTransfer.dropEffect = "move";
    }
  }

  private onDragEnter(ev: DragEvent) {
    this.dropArea.classList.add(styles.dragOver);
  }

  private onDragLeave(ev: DragEvent) {
    this.dropArea.classList.remove(styles.dragOver);
  }

  private addPanelTab(tab: Tab, parent?: HTMLElement | DocumentFragment) {
    const panelTab = new PanelTab(this.editorService, tab);

    panelTab.onTabDragOut.addListener(this.handlePanelTabDragOut);
    panelTab.onTabDrop.addListener(this.handlePanelTabDrop);
    panelTab.onClick.addListener(this.handleTabClick);

    this.panelTabs.push(panelTab);

    // tslint:disable-next-line:no-console

    if (parent) {
      parent.appendChild(panelTab.render());
      return;
    }

    this.domElement.insertBefore(panelTab.render(), this.dropArea);
  }

  private getTabFromDropData(ev: DragEvent): Tab | undefined {
    if (ev.dataTransfer) {
      const tabJson = ev.dataTransfer.getData("editor/tab");

      if (tabJson !== "") {
        ev.preventDefault();

        return JSON.parse(tabJson) as Tab;
      }
    }

    return undefined;
  }

  //#region Event Handlers
  private removeListenersFromTabArray(array: ObservableArray<Tab>) {
    array.onAfterPush.removeListener(this.handleTabsArrayAfterPush);
    array.onBeforeDelete.removeListener(this.handleTabsArrayBeforeDelete);
  }

  private addListenersToTabArray(array: ObservableArray<Tab>) {
    array.onAfterPush.addListener(this.handleTabsArrayAfterPush);
    array.onBeforeDelete.addListener(this.handleTabsArrayBeforeDelete);
  }

  private handleTabClick(pT: PanelTab) {
    this.onTabClick.propagate(pT);
  }

  // Este metódo é responsável apenas por retirar a Tab do array de PanelTab.
  // A transferência do DOMElement para outro tab deve ser realizada no metódo apropriado.
  private handleTabsArrayBeforeDelete(e: ObservableArrayEvent) {
    if (e.targetIndex !== undefined) {
      const element = this.panelTabs[e.targetIndex];
      element.onTabDragOut.removeListener(this.handlePanelTabDragOut, true);
      element.onTabDrop.removeListener(this.handlePanelTabDrop, true);

      element.domElement.remove();

      // remove from the tabs register - workaround to chrome < 72 iframe bug
      this.editorService.panelTabsIndex.splice(this.editorService.panelTabsIndex.indexOf(element), 1);

      this.panelTabs.splice(e.targetIndex, 1);
    }
  }

  // Adiciona a Tab
  private handleTabsArrayAfterPush(e: ObservableArrayEvent) {
    this.addPanelTab(this.tabs.get(e.targetIndex!));
  }

  private handlePanelTabDragOut(tab: Tab) {
    this.onTabDragOut.propagate(tab, this);
  }

  private handlePanelTabDrop(tab: Tab, sender: PanelTab) {
    this.onTabDrop.propagate(tab, this);

    const pTab = this.panelTabs.filter(x => x.tab === tab)[0];

    // Reorder!
    if (pTab) {
      this.PutTabBefore(pTab, sender);
    }

    return;
  }

  private handleDropOnDropArea(ev: DragEvent) {
    this.dropArea.classList.remove(styles.dragOver);
    const tab = this.getTabFromDropData(ev);
    if (tab) {
      this.onTabDrop.propagate(tab, this);
    }
  }
  //#endregion Event Handlers
}
