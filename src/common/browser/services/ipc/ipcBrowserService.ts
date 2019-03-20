import { IpcRenderer } from "electron";
import IpcBrowserServiceListener from "./ipcBrowserServiceListener";
import { ENV } from "@src/env";

export default class IpcBrowserService<ChannelsArgs, ChannelsReturnValues> {
  private listeners: Array<IpcBrowserServiceListener<any, any>> = [];
  private ipc?: IpcRenderer;

  constructor(public prefix: string) {
    if ((window as any).ipc) {
      this.ipc = (window as any).ipc;
    }
  }

  /**
   * Adds a listener to a channel.
   * @param channel The channels which the listener should be added.
   * @param listener The listener to be added.
   */
  public addListener<C extends keyof ChannelsArgs & keyof ChannelsReturnValues>(
    channel: Extract<C, string>,
    listener: (args: ChannelsArgs[C], callback: (returnValue: ChannelsReturnValues[C]) => any) => any
  ): IpcBrowserServiceListener<ChannelsArgs[C], ChannelsReturnValues[C]> | undefined {
    if (this.ipc) {
      const l = new IpcBrowserServiceListener<ChannelsArgs[C], ChannelsReturnValues[C]>(
        this.ipc,
        `${this.prefix}:${channel}`,
        listener
      );

      this.listeners.push(l);

      return l;
    }
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
  }

  /**
   * Sends a message to the main.
   * @param channel The channel to send the message
   * @param args The arguments object.
   */
  public send<C extends keyof ChannelsArgs & keyof ChannelsReturnValues>(
    channel: Extract<C, string>,
    args?: ChannelsArgs[C]
  ) {
    if (!this.ipc) {
      return;
    }

    this.ipc.send(`${this.prefix}:${channel}`, args);
  }

  // TODO: Add Unique IDs to Callbacks!
  /**
   * Sends a message to the main and waits for the return.
   * @param channel The channel to send the message
   * @param args The arguments object.
   */
  public async sendAndReturn<C extends keyof ChannelsArgs & keyof ChannelsReturnValues>(
    channel: Extract<C, string>,
    args?: ChannelsArgs[C]
  ): Promise<ChannelsReturnValues[C]> {
    if (!this.ipc) {
      throw Error("IpcNotAvailable");
    }

    const promise = new Promise<ChannelsReturnValues[C]>((resolve, reject) => {
      if (!this.ipc) {
        reject("IpcNotAvailable");
        return;
      }

      this.ipc.once(
        `${this.prefix}:${channel}${ENV.IPC_RETURN_COMPLEMENT}`,
        (event: Electron.Event, rV: ChannelsReturnValues[C]) => {
          resolve(rV);
        }
      );

      this.ipc.send(`${this.prefix}:${channel}`, args);
    });

    return promise;
  }
}
