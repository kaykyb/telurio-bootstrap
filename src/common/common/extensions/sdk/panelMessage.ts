import ExtensionCommandActivationArgs from "../extensionCommandActivationArgs";
import ITheme from "../../theme";

export interface IPanelMessageTypes {
  theme: ITheme;
  requestTheme: undefined;
}

export default class PanelMessage<T extends keyof IPanelMessageTypes> {
  constructor(public type: Extract<T, string>, public data: IPanelMessageTypes[T]) {}
}
