export class EditorExtensionBridgeCommand {
  constructor(public action: (args: any[]) => any, public permissionRequired?: string) {}
}

// tslint:disable-next-line: max-classes-per-file
export default class EditorExtensionBridge {
  private commands: { [key: string]: EditorExtensionBridgeCommand } = {};

  public registerCommand(cmd: string, action: (args: any[]) => any, permissionRequired?: string) {
    this.commands[cmd] = new EditorExtensionBridgeCommand(action, permissionRequired);
  }

  public getCommand(cmd: string): EditorExtensionBridgeCommand {
    return this.commands[cmd];
  }
}
