import Tab from "@src/views/editor/common/classes/tab";

export default class PanelHostCommunicationArgs {
  constructor(public panelName: string, public tab: Tab, public message: any) {}
}
