import ExtensionCommandActivationArgs from "../extensionCommandActivationArgs";
import IThemeColors from "../../themes/themeColors";
import PanelHostCommunicationArgs from "./panelHostCommunicationArgs";

export interface IPanelMessageTypes {
  theme: IThemeColors;
  requestTheme: undefined;
  sendMessage: any;
  messageFromHost: any;
}

export default class PanelMessage<T extends keyof IPanelMessageTypes> {
  constructor(public type: Extract<T, string>, public data: IPanelMessageTypes[T]) {}
}
