import PanelTab from "../../browser/panels/container/tabs/tab/panelTab";
import PanelView from "../../browser/panels/container/frame/views/view/panelView";

export default class Tab {
  constructor(
    public panelName: string,
    public panelId: string,
    public panelTitle: string,
    public panelOwnerName: string,
    public args?: any,
    public active: boolean = false
  ) {}
}
