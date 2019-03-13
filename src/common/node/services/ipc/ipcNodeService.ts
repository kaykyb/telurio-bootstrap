import { BrowserWindow, ipcMain } from "electron";
import IpcNodeServiceListener from "./ipcNodeServiceListener";
import { ENV } from "@src/env";

export class IpcNodeService<ChannelsArgs, ChannelsReturnValues> {
  private listeners: Array<IpcNodeServiceListener<any, any>> = [];
  private callbacks: Array<{ channel: string; callback: (event: Electron.Event, rV: any) => void }> = [];

  constructor(public ownerWindow: BrowserWindow, public prefix: string) {}

  /**
   * Adds a listener to a channel which return value is sent asynchorouns.
   * @param channel The channels which the listener should be added.
   * @param listener The listener to be added.
   */
  public addListener<C extends keyof ChannelsArgs & keyof ChannelsReturnValues>(
    channel: Extract<C, string>,
    listener: (args: ChannelsArgs[C], callback: (returnValue: ChannelsReturnValues[C]) => any) => any,
    ignoreWindowChecking = false
  ): IpcNodeServiceListener<ChannelsArgs[C], ChannelsReturnValues[C]> | undefined {
    const l = new IpcNodeServiceListener<ChannelsArgs[C], ChannelsReturnValues[C]>(
      this.ownerWindow,
      `${this.prefix}:${channel}`,
      listener,
      ignoreWindowChecking
    );

    this.listeners.push(l);

    return l;
  }

  /**
   * Removes a listener from a channel.
   * @param channel The channels which the listener should be removed from.
   * @param listener The listener to be removed.
   */
  public removeListener<C extends keyof ChannelsArgs & keyof ChannelsReturnValues>(
    channel: Extract<C, string>,
    listener: (args: ChannelsArgs[C], callback: (returnValue: ChannelsReturnValues[C]) => any) => any
  ) {
    const listenerToRemove = this.listeners.find(
      x => x.prefixedChannel === `${this.prefix}:${channel}` && x.listener === listener
    );

    if (listenerToRemove) {
      listenerToRemove.remove();

      const index = this.listeners.indexOf(listenerToRemove);

      if (index < 0) {
        return;
      }

      this.listeners.splice(index, 1);
    }
  }

  /**
   * Removes all listeners from all channels.
   */
  public removeAllListeners() {
    this.listeners.forEach(listener => listener.remove());
    this.callbacks.forEach(cb => ipcMain.removeListener(cb.channel, cb.callback));
  }

  /**
   * Sends a message to the browser.
   * @param channel The channel to send the message
   * @param args The arguments object.
   */
  public send<C extends keyof ChannelsArgs & keyof ChannelsReturnValues>(
    channel: Extract<C, string>,
    args?: ChannelsArgs[C]
  ) {
    this.ownerWindow.webContents.send(`${this.prefix}:${channel}`, args);
  }

  /**
   * Sends a message to the browser and waits for the return.
   * @param channel The channel to send the message
   * @param args The arguments object.
   */
  public async sendAndReturn<C extends keyof ChannelsArgs & keyof ChannelsReturnValues>(
    channel: Extract<C, string>,
    args?: ChannelsArgs[C]
  ): Promise<ChannelsReturnValues[C]> {
    const prefixedCallbackChannel = `${this.prefix}:${channel}${ENV.IPC_RETURN_COMPLEMENT}`;

    const promise = new Promise<ChannelsReturnValues[C]>(resolve => {
      const callback = (event: Electron.Event, rV: ChannelsReturnValues[C]) => {
        if (this.isCurrentWindow(event.sender)) {
          resolve(rV);
          this.callbacks.splice(
            this.callbacks.findIndex(x => x.callback === callback && x.channel === prefixedCallbackChannel),
            1
          );
        }
      };

      this.callbacks.push({ channel: prefixedCallbackChannel, callback });
      ipcMain.once(prefixedCallbackChannel, callback);

      this.ownerWindow.webContents.send(`${this.prefix}:${channel}`, args);
    });

    return promise;
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
