import Label from "./label";

export default class ExtensionManifest {
  constructor(
    public entry: string,
    public name: string,
    public label: Label[],
    public version: string,
    public author: string,
    public permissions: string[],
    public commands: string[],
    public settingsFile?: string
  ) {}
}
