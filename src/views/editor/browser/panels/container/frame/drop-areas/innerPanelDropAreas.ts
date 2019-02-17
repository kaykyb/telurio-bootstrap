import DropArea from "./drop-area/dropArea";
import Tab from "@src/views/editor/common/classes/tab";
import TrackableEvent from "@src/common/common/trackableEvent";

export default class InnerPanelDropAreas {
  public onTabDrop = new TrackableEvent<Tab, DropArea>();

  public render(): HTMLDivElement {
    const div = document.createElement("div");
    const frag = document.createDocumentFragment();

    const rDA = this.getDropArea("right");
    frag.appendChild(rDA.render());

    const lDA = this.getDropArea("left");
    frag.appendChild(lDA.render());

    const tDA = this.getDropArea("top");
    frag.appendChild(tDA.render());

    const bDA = this.getDropArea("bottom");
    frag.appendChild(bDA.render());

    div.appendChild(frag);

    return div;
  }

  private getDropArea(pos: "right" | "left" | "top" | "bottom"): DropArea {
    const dA = new DropArea(pos);

    dA.onTabDrop.addListener((t, s) => {
      this.onTabDrop.propagate(t, s);
    });

    return dA;
  }
}
