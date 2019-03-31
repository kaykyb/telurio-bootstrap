import styles from "./topbar.css";
import PanelBridge from "@src/common/common/extensions/sdk/panelBridge";

export default class Topbar {
  public render(): HTMLDivElement {
    const bridge = new PanelBridge();

    const e = document.createElement("div");
    e.classList.add(styles.topbar);

    const input = document.createElement("input");
    input.placeholder = "Digite a mensagem...";

    e.appendChild(input);

    const button = document.createElement("button");
    button.textContent = "Enviar";

    e.appendChild(button);

    button.onclick = () => {
      bridge.sendMessage(input.value);
      input.value = "";
    };

    return e;
  }
}
