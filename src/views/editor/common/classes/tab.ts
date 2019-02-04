export default class Tab {
  public panelId: string;
  public panelTitle: string;
  public active: boolean;

  constructor(panelId: string, panelTitle: string, active: boolean = false) {
    this.panelId = panelId;
    this.panelTitle = panelTitle;
    this.active = active;
  }
}
