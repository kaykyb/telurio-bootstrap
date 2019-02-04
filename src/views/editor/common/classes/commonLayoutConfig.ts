import CommonPanelRow from "./panelRow";

export default class CommonLayoutConfig {
  public rootRow: CommonPanelRow;

  constructor(rootRow: CommonPanelRow) {
    this.rootRow = rootRow;
  }
}
