import LoadableExtension from "@src/common/common/extensions/loadableExtension";
import CommonEvent from "@src/common/common/commonEvent";

export default class Panel {
  public onMessage = new CommonEvent<{ panelArgs: any; message: string }>();
  constructor(public name: string, public owner: LoadableExtension, public htmlFile: string) {}
}
