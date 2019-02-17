import Tab from "@src/views/editor/common/classes/tab";

export default class TabUtils {
  public static getTabFromDropData(ev: DragEvent): Tab | undefined {
    if (ev.dataTransfer) {
      const tabJson = ev.dataTransfer.getData("editor/tab");

      if (tabJson !== "") {
        ev.preventDefault();

        return JSON.parse(tabJson) as Tab;
      }
    }

    return undefined;
  }
}
