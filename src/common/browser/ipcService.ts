import { IpcRenderer } from "electron";

// declare global {
//   // tslint:disable-next-line:interface-name
//   interface Window {
//     ipc?: IpcRenderer;
//   }
// }

// tslint:disable-next-line:interface-name
declare interface Window {
  ipc?: IpcRenderer;
}

export default class IpcService {
  public ipc?: IpcRenderer;

  constructor() {
    if ((window as any).ipc) {
      this.ipc = (window as any).ipc;
    }
  }
}
