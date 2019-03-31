import styles from "./treeViewList.css";

import TreeViewListItem from "./treeViewListItem";
import Item from "./item/item";
import CommonEvent from "@src/common/common/commonEvent";

export default class TreeViewList {
  public onSelect = new CommonEvent<{ item: TreeViewListItem; propagate: boolean }>();

  private itemsElements: Item[] = [];

  constructor(private items: TreeViewListItem[], private padding: number = 0) {}

  public render(): HTMLDivElement {
    const list = document.createElement("div");
    list.classList.add(styles.list);

    const frag = document.createDocumentFragment();

    this.items.forEach(v => {
      const element = new Item(v, this.padding);
      this.itemsElements.push(element);

      element.onSelect.addListener(this.handleElementSelection.bind(this));

      frag.appendChild(element.render());
    });

    list.appendChild(frag);

    return list;
  }

  public selectItem(id: string, propagate = true) {
    for (const item of this.itemsElements) {
      if (item.sublist) {
        item.sublist.selectItem(id, propagate);
      }

      if (item.item.id !== id) {
        continue;
      }

      item.select(propagate);
      break;
    }
  }

  public doUnselection(keepSelectedItemId: string) {
    for (const itemElement of this.itemsElements) {
      if (itemElement.sublist) {
        itemElement.sublist.doUnselection(keepSelectedItemId);
      }

      if (itemElement.isSelected() && itemElement.item.id !== keepSelectedItemId) {
        itemElement.unselect();
      }
    }
  }

  private handleElementSelection(ev: { item: TreeViewListItem; propagate: boolean }) {
    this.doUnselection(ev.item.id);
    this.onSelect.propagate(ev);
  }
}
