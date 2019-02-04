import CommonPanelRow from "./panelRow";
import Tab from "./tab";

export default class CommonPanelColumn {
  public rows?: CommonPanelRow[];
  public width: number;
  public panels?: Tab[];

  constructor(width: number, rows?: CommonPanelRow[], panels?: Tab[]) {
    this.panels = panels;
    this.rows = rows;
    this.width = width;
  }
}
