import styles from "./switch.css";
import CommonEvent from "@src/common/common/commonEvent";

export default class Switch {
  public onToggle = new CommonEvent<boolean>();

  private domElement?: HTMLDivElement;

  constructor(private isEnabled: boolean = false) {
    this.toggle = this.toggle.bind(this);
  }

  public render(): HTMLDivElement {
    this.domElement = document.createElement("div");
    this.domElement.classList.add(styles.switchRoot);

    if (this.isEnabled) {
      this.domElement.classList.add(styles.enabled);
    }

    const thumb = document.createElement("div");
    thumb.classList.add(styles.thumb);

    this.domElement.appendChild(thumb);
    this.domElement.addEventListener("click", this.toggle);

    return this.domElement;
  }

  public toggle() {
    this.isEnabled ? this.disable() : this.enable();
  }

  public enable() {
    if (!this.domElement || this.isEnabled) {
      return;
    }

    this.domElement.classList.add(styles.enabled);
    this.isEnabled = true;

    this.onToggle.propagate(true);
  }

  public disable() {
    if (!this.domElement || !this.isEnabled) {
      return;
    }

    this.domElement.classList.remove(styles.enabled);
    this.isEnabled = false;

    this.onToggle.propagate(false);
  }
}
