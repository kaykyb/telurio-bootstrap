import ExtensionCommandActivationArgs from "../extensionCommandActivationArgs";
import PanelHostCommunicationArgs from "./panelHostCommunicationArgs";

export interface IExtensionMessageDataKeys {
  cmd: ExtensionCommandActivationArgs;
  messageFromPanel: PanelHostCommunicationArgs;
}

export default class ExtensionMessage<T extends keyof IExtensionMessageDataKeys> {
  constructor(public type: Extract<T, string>, public data: IExtensionMessageDataKeys[T]) {}
}
