import PanelColumn from "./layout/column/panelColumn";
import PanelRow from "./layout/row/panelRow";

import PanelContainer from "./container/panelContainer";

import CommonPanelColumn from "@src/views/editor/common/classes/panelColumn";
import CommonPanelRow from "@src/views/editor/common/classes/panelRow";

import CommonLayoutConfig from "@src/views/editor/common/classes/commonLayoutConfig";
import ObservableArray from "@src/common/common/observableArray";

export default class PanelManager {
  public config!: PanelRow;
  private root: HTMLElement;

  constructor(root: HTMLElement, initialConfig: CommonLayoutConfig) {
    this.root = root;
    this.transformCommonConfig(initialConfig);
    this.render();
  }

  private render() {
    this.root.appendChild(this.config.render(undefined, undefined));
    this.config.fill = true;
  }

  private insertCol(col: PanelColumn, insertIn: DocumentFragment, parentRow?: PanelRow, nextCol?: PanelColumn) {
    insertIn.appendChild(col.render(parentRow, nextCol));
  }

  private transformCommonConfig(initialConfig: CommonLayoutConfig) {
    const rootRow = this.transformCommonRow(initialConfig.rootRow);
    this.config = rootRow;
  }

  private transformCommonCol(cCol: CommonPanelColumn): PanelColumn {
    let col: PanelColumn;

    if (cCol.panels) {
      col = new PanelColumn(cCol.width, undefined, ObservableArray.fromArray(cCol.panels));
    } else {
      col = new PanelColumn(cCol.width, undefined, undefined);
    }

    if (cCol.rows) {
      const rows: PanelRow[] = [];
      cCol.rows.forEach(cRow => {
        rows.push(this.transformCommonRow(cRow));
      });
      col.rows = rows;
    }

    return col;
  }

  private transformCommonRow(cRow: CommonPanelRow): PanelRow {
    let row: PanelRow;
    if (cRow.panels) {
      row = new PanelRow(cRow.height, undefined, ObservableArray.fromArray(cRow.panels));
    } else {
      row = new PanelRow(cRow.height, undefined, undefined);
    }

    if (cRow.columns) {
      const cols: PanelColumn[] = [];
      cRow.columns.forEach(cCol => {
        cols.push(this.transformCommonCol(cCol));
      });
      row.columns = cols;
    }

    return row;
  }
}
