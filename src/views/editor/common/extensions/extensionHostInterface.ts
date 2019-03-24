import ExtensionMessage from "@src/common/common/extensions/sdk/extensionMessage";

export default interface IExtensionHost {
  postMessage(message: ExtensionMessage<any>): void;
}
