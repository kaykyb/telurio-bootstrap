import ExtensionCommandActivationArgs from "../extensionCommandActivationArgs";

export default class ExtensionMessage {
  constructor(type: "cmd", data: ExtensionCommandActivationArgs);
  constructor(public type: string, public data: any) {}
}
