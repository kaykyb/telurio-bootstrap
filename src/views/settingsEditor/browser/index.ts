import styles from "@src/common/browser/styles/commonStyles.css";
import MainView from "./editor/mainView/mainView";
import CommonViewBrowserService from "@src/views/common/browser/services/commonViewBrowserService";
import Sidebar from "@src/views/common/browser/components/sidebar/sidebar";
import TreeViewList from "@src/views/common/browser/components/treeViewList/treeViewList";
import TreeViewListItem from "@src/views/common/browser/components/treeViewList/treeViewListItem";
import ScrollableElement from "@src/views/common/browser/components/scrollable-element/scrollableElement";
import ExtensionManifest from "@src/common/common/extensions/manifest-type/extensionManifest";
import StringUtil from "@src/common/common/util/stringUtil";
import CommonManifests from "@src/common/common/extensions/commonManifests";

async function start() {
  const commonService = new CommonViewBrowserService();
  await commonService.start();
  document.title = commonService.i18n.contents.settingsEditorView.title;

  const root = document.getElementById("app-root");

  if (root) {
    root.classList.add(styles.rRoot);

    const listItems: TreeViewListItem[] = [];

    const exts = await commonService.getExtensions();

    const coreItems = getSettingsSectionsFromExtensions(
      CommonManifests.getCoreExtensionManifest(exts, commonService.i18n).extension,
      commonService
    );

    if (coreItems) {
      listItems.push(...coreItems);
    }

    exts.forEach(ext => {
      if (ext.extension.contributions && ext.extension.contributions.settings) {
        const ownList = getSettingsSectionsFromExtensions(ext.extension, commonService);
        listItems.push(new TreeViewListItem(ext.extension.label, ext.extension.name, false, "box", ownList));
      }
    });

    const list = new TreeViewList(listItems);
    const scrollContainer = new ScrollableElement(list.render(), "y");

    const sidebar = new Sidebar(
      commonService.i18n.contents.settingsEditorView.searchBarText,
      scrollContainer.render()
    );
    root.appendChild(sidebar.render());

    const mainView = new MainView(commonService);

    sidebar.onSearchBarTextChange.addListener(s => {
      const availableExts: string[] = [];
      const availableSections: string[] = [];

      // filter main
      mainView.filterSettingsPage(x => {
        const normalizedS = s.replace(" ", "").toLowerCase();
        const labelContains = StringUtil.getAppropriateLabel(
          x.setting.label,
          commonService.i18n.language.code
        )
          .content.replace(" ", "")
          .toLowerCase()
          .includes(normalizedS);

        // optimization
        if (labelContains) {
          availableExts.push(x.owner.name);
          availableSections.push(x.owner.name + "." + x.setting.section);
          return true;
        }

        let descContains = false;

        if (x.setting.description) {
          descContains = StringUtil.getAppropriateLabel(
            x.setting.description,
            commonService.i18n.language.code
          )
            .content.replace(" ", "")
            .toLowerCase()
            .includes(normalizedS);
        }

        if (descContains) {
          availableExts.push(x.owner.name);
          availableSections.push(x.owner.name + "." + x.setting.section);
        }

        return descContains;
      });

      list.filter(x => {
        if (x.sublist) {
          return availableExts.find(ext => x.item.id === ext) !== undefined;
        }

        return availableSections.find(sect => x.item.id === sect) !== undefined;
      });
    });

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
      listItems.push(new TreeViewListItem(label.content, ext.name + "." + s.name, false, s.icon));
    });
  }

  if (listItems.length === 0) {
    return undefined;
  }

  return listItems;
}

start();
