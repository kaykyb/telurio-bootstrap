import styles from "@src/common/browser/styles/commonStyles.css";
import MainView from "./editor/mainView/mainView";
import CommonViewBrowserService from "@src/views/common/browser/services/commonViewBrowserService";
import Sidebar from "@src/views/common/browser/components/sidebar/sidebar";
import TreeViewList from "@src/views/common/browser/components/treeViewList/treeViewList";
import TreeViewListItem from "@src/views/common/browser/components/treeViewList/treeViewListItem";
import ScrollableElement from "@src/views/common/browser/components/scrollable-element/scrollableElement";
import { CORE_EXTENSION_MANIFEST } from "@src/common/common/extensions/commonManifests";
import ExtensionManifest from "@src/common/common/extensions/manifest-type/extensionManifest";
import StringUtil from "@src/common/common/util/stringUtil";

async function start() {
  const commonService = new CommonViewBrowserService();
  await commonService.start();
  document.title = commonService.i18n.contents.settingsEditorView.title;

  const root = document.getElementById("app-root");

  if (root) {
    root.classList.add(styles.rRoot);

    const listItems: TreeViewListItem[] = [];

    const coreItems = getSettingsSectionsFromExtensions(CORE_EXTENSION_MANIFEST.extension, commonService);

    if (coreItems) {
      listItems.push(...coreItems);
    }

    const exts = await commonService.getExtensions();
    exts.forEach(ext => {
      const ownList = getSettingsSectionsFromExtensions(ext.extension, commonService);
      const label = StringUtil.getAppropriateLabel(ext.extension.label, commonService.i18n.language.code);
      listItems.push(new TreeViewListItem(label.content, ext.extension.name, false, "box", ownList));
    });

    const list = new TreeViewList(listItems);
    const scrollContainer = new ScrollableElement(list.render(), "y");

    const sidebar = new Sidebar(
      commonService.i18n.contents.settingsEditorView.searchBarText,
      scrollContainer.render()
    );
    root.appendChild(sidebar.render());

    const mainView = new MainView(commonService);

    list.onSelect.addListener(ev => {
      if (ev.propagate) {
        mainView.scrollSectionIntoView(ev.item.id);
      }
    });

    mainView.onSectionIntoViewChanged.addListener(ev => {
      list.selectItem(ev, false);
    });

    root.appendChild(await mainView.render());
  }

  commonService.show();
}

function getSettingsSectionsFromExtensions(
  ext: ExtensionManifest,
  commonService: CommonViewBrowserService
): TreeViewListItem[] | undefined {
  const listItems: TreeViewListItem[] = [];

  // default settings
  if (ext.contributions && ext.contributions.settingsSections) {
    const sections = ext.contributions.settingsSections;
    sections.forEach(s => {
      const label = StringUtil.getAppropriateLabel(s.label, commonService.i18n.language.code);
      listItems.push(new TreeViewListItem(label.content, ext.name + "." + s.name, false, "box"));
    });
  }

  if (listItems.length === 0) {
    return undefined;
  }

  return listItems;
}

start();
