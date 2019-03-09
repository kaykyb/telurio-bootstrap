import DropArea from "./drop-area/dropArea";
import Tab from "@src/views/editor/common/classes/tab";
import TrackableEvent from "@src/common/common/trackableEvent";

export default class InnerPanelDropAreas {
  public onTabDrop = new TrackableEvent<Tab, DropArea>();

  private domElement?: HTMLDivElement;

  public render(): HTMLDivElement {
    this.domElement = document.createElement("div");
    this.disableDropAreas();
    const frag = document.createDocumentFragment();

    const rDA = this.getDropArea("right");
    frag.appendChild(rDA.render());

    const lDA = this.getDropArea("left");
    frag.appendChild(lDA.render());

    const tDA = this.getDropArea("top");
    frag.appendChild(tDA.render());

    const bDA = this.getDropArea("bottom");
    frag.appendChild(bDA.render());

    this.domElement.appendChild(frag);

    return this.domElement;
  }

  public enableDropAreas() {
    if (this.domElement) {
      this.domElement.style.pointerEvents = "initial";
    }
  }

  public disableDropAreas() {
    if (this.domElement) {
      this.domElement.style.pointerEvents = "none";
    }
  }

  private getDropArea(pos: "right" | "left" | "top" | "bottom"): DropArea {
    const dA = new DropArea(pos);

    dA.onTabDrop.addListener((t, s) => {
      this.onTabDrop.propagate(t, s);
    });

    return dA;
  }
}
