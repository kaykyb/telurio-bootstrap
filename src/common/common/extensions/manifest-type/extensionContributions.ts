import ExtensionPermission from "./extensionPermission";
import ExtensionCommand from "./extensionCommand";

export default class ExtensionContributions {
  constructor(
    public commands?: ExtensionCommand[],
    public permissions?: ExtensionPermission[]
  ) {}
}
