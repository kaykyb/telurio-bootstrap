import ExtensionCommandActivationArgs from "../extensionCommandActivationArgs";
import ITheme from "../../theme";
import PanelHostCommunicationArgs from "./panelHostCommunicationArgs";

export interface IPanelMessageTypes {
  theme: ITheme;
  requestTheme: undefined;
  sendMessage: any;
  messageFromHost: any;
}

export default class PanelMessage<T extends keyof IPanelMessageTypes> {
  constructor(public type: Extract<T, string>, public data: IPanelMessageTypes[T]) {}
}
