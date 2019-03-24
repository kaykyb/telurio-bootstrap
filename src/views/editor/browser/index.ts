import PanelManager from "./panels/panelManager";

import styles from "@src/common/browser/styles/commonStyles.css";

import EditorBrowserService from "./service/editorBrowserService";
import CommonViewBrowserService from "@src/views/common/browser/services/commonViewBrowserService";
import CommonLayoutConfig from "../common/classes/commonLayoutConfig";
import Titlebar from "@src/views/common/browser/components/titlebar/titlebar";
import ExtensionManager from "./extensions/extensionManager";
import IconButton from "@src/views/common/browser/components/titlebar/icon-button/iconButton";

async function start() {
  const commonService = new CommonViewBrowserService();
  await commonService.start();

  const editorService = new EditorBrowserService(commonService);

  // script ----------------------------
  const root = document.getElementById("app-root") as HTMLElement;
  root.classList.add(styles.cRoot);

  let extManager: ExtensionManager;
  let titlebar: Titlebar;

  const config = await editorService.getLayoutConfigs();

  document.title = commonService.i18n.contents.editorView.title;

  const leftSideElements = document.createElement("div");

  // hamburguer
  const hamburguerButton = new IconButton("menu");
  const hbElement = hamburguerButton.render();

  hamburguerButton.onClick.addListener(() => {
    const hbElementRect = hbElement.getBoundingClientRect();
    const menuI18n = commonService.i18n.contents.editorView.menu;
    commonService.contextMenu.show(
      [
        {
          icon: "box",
          label: menuI18n.extensionsSubmenu.label,
          subitems: [
            {
              callback: () => editorService.showMarketplace(),
              icon: "package",
              label: menuI18n.extensionsSubmenu.manageExtensions
            }
          ]
        },
        {
          callback: () => editorService.showEditorDevTools(),
          icon: "terminal",
          label: menuI18n.openTelurioDevTools
        }
      ],

      hbElementRect.left,
      hbElementRect.top + hbElementRect.height
    );
  });
  leftSideElements.appendChild(hbElement);

  titlebar = new Titlebar(commonService, undefined, leftSideElements);
  root.appendChild(await titlebar.render());

  editorService.panelManager = new PanelManager(root, config, editorService);
  extManager = new ExtensionManager(editorService);

  commonService.show();
}

start();
