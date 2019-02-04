import PanelRow from "../row/panelRow";
import PanelColumn from "../column/panelColumn";

export class HorizontalDropArgs {
  public colPos: "left" | "right";
  public baseCol: PanelColumn;
  public col: PanelColumn;

  constructor(colPos: "left" | "right", baseCol: PanelColumn, col: PanelColumn) {
    this.colPos = colPos;
    this.baseCol = baseCol;
    this.col = col;
  }
}
