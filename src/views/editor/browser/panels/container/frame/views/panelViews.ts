import ObservableArray, { ObservableArrayEvent } from "@src/common/common/observableArray";
import Tab from "@src/views/editor/common/classes/tab";
import PanelView from "./view/panelView";

export default class PanelViews {
  private domElement!: HTMLDivElement;

  private panelViews: PanelView[] = [];

  private activeTab?: PanelView;

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

  constructor(tabs: ObservableArray<Tab>) {
    this._tabs = tabs;
    this.bindMethods();
    this.addListenersToTabArray(this._tabs);
  }

  public render(): HTMLElement {
    this.domElement = document.createElement("div");

    const frag = document.createDocumentFragment();

    this.tabs.forEach(tab => {
      this.addPanelView(tab, frag);
    });

    this.domElement.appendChild(frag);

    return this.domElement;
  }

  public setActiveTab(tabId: string) {
    if (this.activeTab) {
      this.activeTab.isActive = false;
    }

    this.activeTab = this.panelViews.filter(x => x.tab.panelId === tabId)[0];

    if (this.activeTab) {
      this.activeTab.isActive = true;
    }
  }

  private addPanelView(tab: Tab, parent?: HTMLElement | DocumentFragment) {
    const panelView = new PanelView(tab);

    this.panelViews.push(panelView);

    // tslint:disable-next-line:no-console

    if (parent) {
      parent.appendChild(panelView.render());
      return;
    }

    this.domElement.appendChild(panelView.render());
  }

  private bindMethods() {
    this.handleTabsArrayAfterPush = this.handleTabsArrayAfterPush.bind(this);
    this.handleTabsArrayBeforeDelete = this.handleTabsArrayBeforeDelete.bind(this);
  }

  private removeListenersFromTabArray(array: ObservableArray<Tab>) {
    array.onAfterPush.removeListener(this.handleTabsArrayAfterPush);
    array.onBeforeDelete.removeListener(this.handleTabsArrayBeforeDelete);
  }

  private addListenersToTabArray(array: ObservableArray<Tab>) {
    array.onAfterPush.addListener(this.handleTabsArrayAfterPush);
    array.onBeforeDelete.addListener(this.handleTabsArrayBeforeDelete);
  }

  // Este metódo é responsável apenas por retirar a Tab do array de PanelTab.
  // A transferência do DOMElement para outro tab deve ser realizada no metódo apropriado.
  private handleTabsArrayBeforeDelete(e: ObservableArrayEvent) {
    if (e.targetIndex !== undefined) {
      const element = this.panelViews[e.targetIndex];
      element.domElement.remove();

      this.panelViews.splice(e.targetIndex, 1);
    }
  }

  // Adiciona a Tab
  private handleTabsArrayAfterPush(e: ObservableArrayEvent) {
    this.addPanelView(this.tabs.get(e.targetIndex!));
  }
}
