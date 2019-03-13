import { IpcRenderer } from "electron";
import { ENV } from "@src/env";

export default class IpcBrowserServiceListener<Args, ReturnValue> {
  constructor(
    private readonly ipc: IpcRenderer,
    public readonly prefixedChannel: string,
    public readonly listener: (args: Args, callback: (returnValue: ReturnValue) => any) => any
  ) {
    this.handler = this.handler.bind(this);
    ipc.addListener(prefixedChannel, this.handler);
  }

  public remove() {
    this.ipc.removeListener(this.prefixedChannel, this.handler);
  }

  private handler(event: Electron.Event, arg: Args) {
    this.listener(arg, (rV: ReturnValue) => {
      this.ipc.send(`${this.prefixedChannel}${ENV.IPC_RETURN_COMPLEMENT}`, rV);
    });
  }
}
