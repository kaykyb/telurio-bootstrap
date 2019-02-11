import Label from "./label";

export default class ExtensionManifest {
  public entry: string;
  public name: string;
  public label: Label[];
  public version: string;
  public author: string;
  public permissions: string[];
  public commands: string[];

  constructor(
    entry: string,
    name: string,
    label: Label[],
    version: string,
    author: string,
    permissions: string[],
    commands: string[]
  ) {
    this.entry = entry;
    this.name = name;
    this.label = label;
    this.version = version;
    this.author = author;
    this.permissions = permissions;
    this.commands = commands;
  }
}
