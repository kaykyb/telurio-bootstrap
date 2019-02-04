import CommonPanelColumn from "./panelColumn";
import Tab from "./tab";

export default class CommonPanelRow {
  public columns?: CommonPanelColumn[];
  public height: number;
  public panels?: Tab[];

  constructor(height: number, columns?: CommonPanelColumn[], panels?: Tab[]) {
    this.panels = panels;
    this.columns = columns;
    this.height = height;
  }
}
