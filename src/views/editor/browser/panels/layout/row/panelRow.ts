import PanelColumn from "../column/panelColumn";
import PanelCel from "../common/cel/panelCel";
import CelResizer from "../common/resizer/celResizer";
import { VerticalDropArgs } from "../common/verticalDropArgs";
import { HorizontalDropArgs } from "../common/horizontalDropArgs";

import * as styles from "./panelRow.css";

import Tab from "@src/views/editor/common/classes/tab";
import DropArea from "@src/views/editor/browser/panels/container/frame/drop-areas/drop-area/dropArea";
import CommonEvent from "@src/common/common/commonEvent";
import ObservableArray from "@src/common/common/observableArray";

export default class PanelRow extends PanelCel {
  public onEmpty = new CommonEvent<PanelRow>();
  public onVerticalTabDrop = new CommonEvent<VerticalDropArgs>();

  public height: number;
  public columns?: PanelColumn[];

  public nextRow?: PanelRow;

  private earlierRow?: PanelRow;

  private parentColumn?: PanelColumn;

  constructor(height: number, columns?: PanelColumn[], panels?: ObservableArray<Tab>) {
    super(panels);
    this.height = height;
    this.columns = columns;

    this.handlePanelTabDrop = this.handlePanelTabDrop.bind(this);
  }

  public render(parentCol?: PanelColumn, nextRow?: PanelRow): HTMLElement {
    this.parentColumn = parentCol;
    this.nextRow = nextRow;
    // this.earlierRow = earlierRow;

    this.domElement = document.createElement("div");
    this.domElement.className = styles.row;

    this.domElement.style.height = this.height + "px";

    if (this.nextRow) {
      this.insertResizer();
    }

    if (this.columns) {
      this.domElement.appendChild(this.getCols(this.columns));
    } else {
      this.appendPanelContainer();
      if (this.panelContainer) {
        this.panelContainer.onEmpty.addListener(() => {
          this.onEmpty.propagate(this);
        });
      }
    }

    return this.domElement;
  }

  public resize(delta: number) {
    this.height += delta;
    this.domElement!.style.height = this.height + "px";
  }

  public prepareForResize() {
    this.height = this.domElement!.offsetHeight;
  }

  protected handlePanelTabDrop(tab: Tab, sender: DropArea): void {
    if (sender.pos === "left" || sender.pos === "right") {
      return this.splitHorizontally(tab, sender);
    }
    return this.splitVertically(tab, sender);
  }

  private splitHorizontally(tab: Tab, sender: DropArea) {
    const width = this.domElement!.offsetWidth;

    const newColTabArray = new ObservableArray<Tab>();
    newColTabArray.push(tab);

    const selfCopy = new PanelColumn(width * 0.75, undefined, this.panels);
    const newCol = new PanelColumn(width * 0.25, undefined, newColTabArray);

    this.removePanels();

    this.columns = sender.pos === "right" ? [selfCopy, newCol] : [newCol, selfCopy];

    // insert columns
    this.domElement!.appendChild(this.getCols(this.columns));
    this.recalcFill();
  }

  private splitVertically(tab: Tab, sender: DropArea) {
    if (this.domElement && (sender.pos === "top" || sender.pos === "bottom")) {
      const height = this.domElement.offsetHeight;
      this.height = height * 0.75;
      this.domElement!.style.height = this.height + "px";

      const newRowTabArray = new ObservableArray<Tab>();
      newRowTabArray.push(tab);

      const newRow = new PanelRow(height * 0.25, undefined, newRowTabArray);

      // not a good solution.
      if (sender.pos === "bottom" && !this.nextRow) {
        this.insertResizer();
      }

      this.onVerticalTabDrop.propagate(new VerticalDropArgs(sender.pos, this, newRow));
    }
  }

  private getCols(cols: PanelColumn[]): DocumentFragment {
    const rootFrag = document.createDocumentFragment();

    let widerColumnIndex = 0;

    for (let i = 0; i < cols.length; i++) {
      this.insertCol(cols[i], rootFrag, this, cols[i + 1]);

      if (cols[i].width >= cols[widerColumnIndex].width) {
        widerColumnIndex = i;
      }
    }

    cols[widerColumnIndex].fill = true;

    return rootFrag;
  }

  private assignColEvents(col: PanelColumn) {
    col.startResizing = this.handleColStartResize.bind(this);
    col.endResizing = this.handleColEndResize.bind(this);
    col.onHorizontalTabDrop.addListener(this.handleColOnHorizontalTabDrop.bind(this));
    col.onEmpty.addListener(this.removeCol.bind(this));
  }

  private removeCol(col: PanelColumn) {
    if (this.domElement && col.domElement) {
      const index = this.columns!.indexOf(col);

      if (index >= 0) {
        const hasPrevious = index > 0;

        if (hasPrevious) {
          this.columns![index - 1].nextColumn = this.columns![index + 1];
        }

        this.columns!.splice(index, 1);

        if (this.columns!.length === 0) {
          this.onEmpty.propagate(this);
          return;
        }

        this.domElement.removeChild(col.domElement);
        this.recalcFill();
      }
    }
  }

  private insertCol(col: PanelColumn, insertIn: DocumentFragment, parentRow?: PanelRow, nextCol?: PanelColumn) {
    this.assignColEvents(col);
    insertIn.appendChild(col.render(parentRow, nextCol));
  }

  private handleColOnHorizontalTabDrop(args: HorizontalDropArgs) {
    if (this.domElement && this.columns) {
      const baseColIndex = this.columns.indexOf(args.baseCol);

      this.assignColEvents(args.col);

      let nextCol: PanelColumn | undefined;
      let insertBefore: Node | null = args.baseCol.domElement !== undefined ? args.baseCol.domElement : null;

      if (args.colPos === "right") {
        nextCol = this.columns[baseColIndex + 1];
        this.columns.splice(baseColIndex + 1, 0, args.col);
        if (insertBefore) {
          insertBefore = insertBefore.nextSibling;
        }
        args.baseCol.nextColumn = args.col;
      } else {
        nextCol = args.baseCol;
        this.columns.splice(baseColIndex, 0, args.col);

        if (this.columns[baseColIndex - 1]) {
          this.columns[baseColIndex - 1].nextColumn = args.col;
        }
      }

      this.domElement.insertBefore(args.col.render(this, nextCol), insertBefore);
      this.recalcFill();
    }
  }

  private handleResizerPrepareForResize() {
    this.prepareForResize();
    if (this.nextRow) {
      this.nextRow.prepareForResize();
    }

    if (this.startResizing) {
      this.startResizing();
    }
  }

  private handleResizerOnDelta(delta: number) {
    this.resize(delta);
    if (this.nextRow) {
      this.nextRow.resize(-delta);
    }
  }

  private handleResizerMouseUp() {
    if (this.endResizing) {
      this.endResizing();
    }
  }

  private insertResizer() {
    const r = new CelResizer("row");
    r.onPrepareForResize = this.handleResizerPrepareForResize.bind(this);
    r.onDelta = this.handleResizerOnDelta.bind(this);
    r.onMouseUp = this.handleResizerMouseUp.bind(this);

    this.domElement!.appendChild(r.render());
  }

  private recalcFill() {
    if (this.columns) {
      let widerColumnIndex = 0;

      for (let i = 0; i < this.columns.length; i++) {
        if (this.columns[i].fill) {
          this.columns[i].fill = false;
        }

        if (this.columns![i].width >= this.columns[widerColumnIndex].width) {
          widerColumnIndex = i;
        }
      }

      this.columns[widerColumnIndex].fill = true;
    }
  }

  private handleColStartResize() {
    if (this.columns) {
      this.columns
        .filter(x => x.fill)
        .forEach(c => {
          c.prepareForResize();
          // c.fill = false;
        });
    }
  }

  private handleColEndResize() {
    this.recalcFill();
  }
}
