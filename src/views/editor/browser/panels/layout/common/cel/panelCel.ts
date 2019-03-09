import PanelContainer from "@src/views/editor/browser/panels/container/panelContainer";

import * as styles from "./panelCel.css";
import Tab from "@src/views/editor/common/classes/tab";
import DropArea from "@src/views/editor/browser/panels/container/frame/drop-areas/drop-area/dropArea";
import ObservableArray from "@src/common/common/observableArray";
import EditorBrowserService from "@src/views/editor/browser/service/editorBrowserService";
import CommonEvent from "@src/common/common/commonEvent";

export default abstract class PanelCel {
  public onResize = new CommonEvent<{ height: number; width: number }>();
  public startResizing?: () => void;
  public endResizing?: () => void;
  public panels?: ObservableArray<Tab>;
  public domElement?: HTMLElement;

  protected panelContainer?: PanelContainer;

  // tslint:disable-next-line:variable-name
  private _fill: boolean = false;

  constructor(private readonly editorService: EditorBrowserService, panels?: ObservableArray<Tab>) {
    this.panels = panels;
  }

  public get fill(): boolean {
    return this._fill;
  }

  public set fill(v: boolean) {
    this._fill = v;

    if (this.domElement) {
      if (v) {
        this.domElement.classList.add(styles.fill);
      } else if (this.domElement.classList.contains(styles.fill)) {
        this.domElement.classList.remove(styles.fill);
      }
    }
  }

  public getOffsetHeight(): number {
    if (this.domElement) {
      return this.domElement.offsetHeight;
    } else {
      return 0;
    }
  }

  public getOffsetWidth(): number {
    if (this.domElement) {
      return this.domElement.offsetWidth;
    } else {
      return 0;
    }
  }

  protected removePanels() {
    if (this.panels) {
      if (this.domElement && this.panelContainer) {
        this.domElement.removeChild(this.panelContainer.domElement);
      }
      this.panelContainer = undefined;
      this.panels = undefined;
    }
  }

  protected appendPanelContainer() {
    if (this.panels) {
      this.panelContainer = new PanelContainer(this.panels, this.editorService);
      this.panelContainer.onTabDrop.addListener(this.handlePanelTabDrop);
      this.domElement!.append(this.panelContainer.render());
    }
  }

  protected abstract handlePanelTabDrop(tab: Tab, sender: DropArea): void;

  // public sizeBasis: number;

  // constructor(sizeBasis: number) {
  //   this.sizeBasis = sizeBasis;
  // }
}
