import EditorExtensionBridgeCommand from "./editorExtensionBridgeCommand";

export default interface ICommandIndex {
  [key: string]: EditorExtensionBridgeCommand<any>;
}
