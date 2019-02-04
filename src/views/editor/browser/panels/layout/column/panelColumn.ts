import PanelCel from "../common/cel/panelCel";
import PanelRow from "../row/panelRow";

import CelResizer from "../common/resizer/celResizer";

import * as styles from "./panelcolumn.css";
import Tab from "../../../../common/classes/tab";
import DropArea from "../../container/frame/drop-areas/drop-area/dropArea";
import { VerticalDropArgs } from "../common/verticalDropArgs";
import CommonEvent from "../../../../../../common/common/commonEvent";
import { HorizontalDropArgs } from "../common/horizontalDropArgs";
import ObservableArray from "../../../../../../common/common/observableArray";

export default class PanelColumn extends PanelCel {
  public onEmpty = new CommonEvent<PanelColumn>();
  public onHorizontalTabDrop = new CommonEvent<HorizontalDropArgs>();

  public rows?: PanelRow[];
  public width: number;

  public nextColumn?: PanelColumn;
  private parentRow?: PanelRow;

  constructor(width: number, rows?: PanelRow[], panels?: ObservableArray<Tab>) {
    super(panels);
    this.rows = rows;
    this.width = width;
    this.handlePanelTabDrop = this.handlePanelTabDrop.bind(this);
  }

  public render(parentRow?: PanelRow, nextColumn?: PanelColumn): HTMLElement {
    this.parentRow = parentRow;
    this.nextColumn = nextColumn;

    this.domElement = document.createElement("div");
    this.domElement.className = styles.column;

    this.domElement.style.width = this.width + "px";

    if (this.nextColumn) {
      this.insertResizer();
    }

    if (this.rows) {
      this.domElement.appendChild(this.getRows(this.rows));
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
    this.width += delta;
    this.domElement!.style.width = this.width + "px";
  }

  public prepareForResize() {
    this.width = this.domElement!.offsetWidth;
  }

  protected handlePanelTabDrop(tab: Tab, sender: DropArea): void {
    if (sender.pos === "left" || sender.pos === "right") {
      return this.splitHorizontally(tab, sender);
    }
    return this.splitVertically(tab, sender);
  }

  private splitVertically(tab: Tab, sender: DropArea) {
    const height = this.domElement!.offsetHeight;

    const newRowTabArray = new ObservableArray<Tab>();
    newRowTabArray.push(tab);

    const selfCopy = new PanelRow(height * 0.75, undefined, this.panels);
    const newRow = new PanelRow(height * 0.25, undefined, newRowTabArray);

    this.removePanels();

    this.rows = sender.pos === "bottom" ? [selfCopy, newRow] : [newRow, selfCopy];

    // insert columns
    this.domElement!.appendChild(this.getRows(this.rows));
    this.recalcFill();
  }

  private splitHorizontally(tab: Tab, sender: DropArea) {
    if (this.domElement && (sender.pos === "left" || sender.pos === "right")) {
      const width = this.width;

      this.width = width * 0.75;
      this.domElement!.style.width = this.width + "px";

      const newColTabArray = new ObservableArray<Tab>();
      newColTabArray.push(tab);

      const newCol = new PanelColumn(width * 0.25, undefined, newColTabArray);

      // not a good solution.
      if (sender.pos === "right" && !this.nextColumn) {
        this.insertResizer();
      }

      this.onHorizontalTabDrop.propagate(new HorizontalDropArgs(sender.pos, this, newCol));
    }
  }

  private getRows(rows: PanelRow[]): DocumentFragment {
    const rootFrag = document.createDocumentFragment();

    let widerColumnIndex = 0;

    for (let i = 0; i < rows.length; i++) {
      this.insertRow(rows[i], rootFrag, this, rows[i + 1]);

      if (rows[i].height >= rows[widerColumnIndex].height) {
        widerColumnIndex = i;
      }
    }

    rows[widerColumnIndex].fill = true;

    return rootFrag;
  }

  private assignRowEvents(row: PanelRow) {
    row.startResizing = this.handleRowStartResize.bind(this);
    row.endResizing = this.handleRowEndResize.bind(this);
    row.onVerticalTabDrop.addListener(this.handleRowOnVerticalTabDrop.bind(this));
    row.onEmpty.addListener(this.removeRow.bind(this));
  }

  private removeRow(row: PanelRow) {
    if (this.domElement && row.domElement) {
      const index = this.rows!.indexOf(row);

      if (index >= 0) {
        const hasPrevious = index > 0;

        if (hasPrevious) {
          this.rows![index - 1].nextRow = this.rows![index + 1];
        }

        this.rows!.splice(index, 1);

        if (this.rows!.length === 0) {
          this.onEmpty.propagate(this);
          return;
        }

        this.domElement.removeChild(row.domElement);
        this.recalcFill();
      }
    }
  }

  private insertRow(
    row: PanelRow,
    insertIn: DocumentFragment | HTMLElement,
    parentCol?: PanelColumn,
    nextRow?: PanelRow
  ) {
    this.assignRowEvents(row);
    insertIn.appendChild(row.render(parentCol, nextRow));
  }

  private handleRowOnVerticalTabDrop(args: VerticalDropArgs) {
    if (this.domElement && this.rows) {
      const baseRowIndex = this.rows.indexOf(args.baseRow);

      this.assignRowEvents(args.row);

      let nextRow: PanelRow | undefined;
      let insertBefore: Node | null = args.baseRow.domElement !== undefined ? args.baseRow.domElement : null;

      if (args.rowPos === "bottom") {
        nextRow = this.rows[baseRowIndex + 1];
        this.rows.splice(baseRowIndex + 1, 0, args.row);
        if (insertBefore) {
          insertBefore = insertBefore.nextSibling;
        }
        args.baseRow.nextRow = args.row;
      } else {
        nextRow = args.baseRow;
        this.rows.splice(baseRowIndex, 0, args.row);

        if (this.rows[baseRowIndex - 1]) {
          this.rows[baseRowIndex - 1].nextRow = args.row;
        }
      }

      this.domElement.insertBefore(args.row.render(this, nextRow), insertBefore);
      this.recalcFill();
    }
  }

  private handleResizerPrepareForResize() {
    this.prepareForResize();
    if (this.nextColumn) {
      this.nextColumn.prepareForResize();
    }

    if (this.startResizing) {
      this.startResizing();
    }
  }

  private handleResizerOnDelta(delta: number) {
    this.resize(delta);
    if (this.nextColumn) {
      this.nextColumn.resize(-delta);
    }
  }

  private handleResizerMouseUp() {
    if (this.endResizing) {
      this.endResizing();
    }
  }

  private insertResizer() {
    const r = new CelResizer("col");
    r.onPrepareForResize = this.handleResizerPrepareForResize.bind(this);
    r.onDelta = this.handleResizerOnDelta.bind(this);
    r.onMouseUp = this.handleResizerMouseUp.bind(this);

    this.domElement!.appendChild(r.render());
  }

  private recalcFill() {
    if (this.rows) {
      let tallerRowIndex = 0;

      for (let i = 0; i < this.rows.length; i++) {
        if (this.rows[i].fill) {
          this.rows[i].fill = false;
        }

        if (this.rows[i].height >= this.rows[tallerRowIndex].height) {
          tallerRowIndex = i;
        }
      }

      this.rows[tallerRowIndex].fill = true;
    }
  }

  private handleRowStartResize() {
    if (this.rows) {
      this.rows
        .filter(x => x.fill)
        .forEach(r => {
          r.prepareForResize();
          // r.fill = false;
        });
    }
  }

  private handleRowEndResize() {
    this.recalcFill();
  }
}
