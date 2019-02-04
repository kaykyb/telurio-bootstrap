import PanelRow from "../row/panelRow";

export class VerticalDropArgs {
  public rowPos: "top" | "bottom";
  public baseRow: PanelRow;
  public row: PanelRow;

  constructor(rowPos: "top" | "bottom", baseRow: PanelRow, row: PanelRow) {
    this.rowPos = rowPos;
    this.baseRow = baseRow;
    this.row = row;
  }
}
