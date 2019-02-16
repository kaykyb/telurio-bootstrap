import Label from "./label";

export default class ExtensionPermission {
  constructor(public name: string, public label: Label, public risk: number) {}
}
