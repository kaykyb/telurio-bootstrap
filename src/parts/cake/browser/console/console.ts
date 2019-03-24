import styles from "./console.css";
import PanelBridge from "@src/common/common/extensions/sdk/panelBridge";

export default class MsgConsole {
  public render(): HTMLDivElement {
    const e = document.createElement("div");
    e.classList.add(styles.console);

    const bridge = new PanelBridge();
    bridge.onMessageFromHost.addListener(ev => {
      const msg = document.createElement("div");
      msg.classList.add(styles.message);

      msg.innerText = ev;

      e.appendChild(msg);
    });

    return e;
  }
}
