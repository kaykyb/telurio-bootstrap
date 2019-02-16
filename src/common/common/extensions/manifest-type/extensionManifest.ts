import Label from "./label";
import ExtensionContributions from "./extensionContributions";

export default class ExtensionManifest {
  constructor(
    public entry: string,
    public name: string,
    public label: Label[],
    public version: string,
    public author: string,
    public permissions: string[],
    public contributions?: ExtensionContributions,
    public settingsFile?: string
  ) {}
}
