import { ipcMain, BrowserWindow } from "electron";
import { ENV } from "@src/env";

export default class IpcNodeServiceListener<Args, ReturnValue> {
  constructor(
    private ownerWindow: BrowserWindow,
    public readonly prefixedChannel: string,
    public readonly listener: (args: Args, callback: (returnValue: ReturnValue) => any) => any,
    // private syncReturn = false,
    private ignoreWindowChecking = false
  ) {
    this.handler = this.handler.bind(this);
    ipcMain.addListener(prefixedChannel, this.handler);
  }

  public remove() {
    ipcMain.removeListener(this.prefixedChannel, this.handler);
  }

  private handler(event: Electron.Event, arg: Args) {
    if (!this.ignoreWindowChecking && !this.isCurrentWindow(event.sender)) {
      return;
    }

    this.listener(arg, (rV: ReturnValue) => {
      if (this.ownerWindow) {
        this.ownerWindow.webContents.send(this.prefixedChannel + ENV.IPC_RETURN_COMPLEMENT, rV);
      }
    });
  }

  private isCurrentWindow(webContents: any): boolean {
    if (this.ownerWindow && this.ownerWindow.webContents) {
      if (this.ownerWindow.webContents === webContents) {
        return true;
      }
    }

    return false;
  }
}
