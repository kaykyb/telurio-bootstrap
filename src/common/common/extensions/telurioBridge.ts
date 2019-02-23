import ExtensionMessage from "./extensionMessage";
import CommonEvent from "../commonEvent";
import ExtensionCommandActivationArgs from "./extensionCommandActivationArgs";

/**
 * The bridge to communicate with the Telurio Editor
 */
export default class TelurioBridge {
  // public onCommandActivation = new CommonEvent<ExtensionCommandActivationArgs>();

  private commandListeners: Array<{
    cmd: string;
    listener: (cmd: ExtensionCommandActivationArgs) => any;
  }> = [];
  private registeredCallbacksIds: string[] = [];

  constructor() {
    this.handleWindowMessage = this.handleWindowMessage.bind(this);
    this.handleCommandActivation = this.handleCommandActivation.bind(this);

    window.addEventListener("message", this.handleWindowMessage);
  }

  public addCommandListener(cmd: string, listener: (cmd: ExtensionCommandActivationArgs) => any) {
    this.commandListeners.push({ cmd, listener });
  }

  public removeCommandListener(cmd: string, listener: (cmd: ExtensionCommandActivationArgs) => any) {
    const index = this.commandListeners.indexOf({ cmd, listener });
    this.commandListeners.splice(index, 1);
  }

  /**
   * Executes a command.
   * @param cmd The command to execute.
   * @param arg The argument object to send.
   */
  public execCommand(cmd: string, arg: any, returnCallback?: (cmd: ExtensionCommandActivationArgs) => any) {
    let cbId;

    if (returnCallback) {
      cbId = this.getCbId();
      this.addCommandListener("!returnCallback." + cbId, returnCallback);
    }

    window.top.postMessage(
      new ExtensionMessage("cmd", new ExtensionCommandActivationArgs(cmd, arg, cbId)),
      "*"
    );
  }

  private getCbId(): string {
    const cb = Math.random().toString();
    if (this.registeredCallbacksIds.indexOf(cb) > 0) {
      return this.getCbId();
    }

    this.registeredCallbacksIds.push(cb);
    return cb;
  }

  //#region Event Handlers
  private handleWindowMessage(ev: MessageEvent) {
    const data = ev.data as ExtensionMessage;
    switch (data.type) {
      case "cmd":
        const cmd = data.data as ExtensionCommandActivationArgs;
        this.handleCommandActivation(cmd);
        break;

      default:
        break;
    }
  }

  private handleCommandActivation(cmd: ExtensionCommandActivationArgs) {
    const cmdListeners = this.commandListeners.filter(x => (x.cmd = cmd.cmd));
    cmdListeners.forEach(c => {
      c.listener(cmd);
    });
  }
}
