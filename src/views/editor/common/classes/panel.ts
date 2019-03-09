import LoadableExtension from "@src/common/common/extensions/loadableExtension";

export default class Panel {
  constructor(public name: string, public owner: LoadableExtension, public htmlFile: string) {}
}
