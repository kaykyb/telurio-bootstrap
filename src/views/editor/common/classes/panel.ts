import LoadableExtension from "@src/common/common/extensions/loadableExtension";
import CommonEvent from "@src/common/common/commonEvent";
import Tab from "./tab";

export default class Panel {
  public onMessage = new CommonEvent<{ tab: Tab; message: string }>();
  constructor(public name: string, public owner: LoadableExtension, public htmlFile: string) {}
}
