import PanelManager from "./panels/panelManager";

import styles from "./index.css";

import EditorBrowserService from "./service/editorBrowserService";
import CommonViewBrowserService from "@src/views/common/browser/services/commonViewBrowserService";
import CommonLayoutConfig from "../common/classes/commonLayoutConfig";
import Titlebar from "@src/views/common/browser/components/titlebar/titlebar";
import ExtensionManager from "./extensions/extensionManager";
import IconButton from "@src/views/common/browser/components/titlebar/icon-button/iconButton";

const commonService = new CommonViewBrowserService();
const editorService = new EditorBrowserService(commonService);

// script ----------------------------
const root = document.getElementById("app-root") as HTMLElement;
root.classList.add(styles.root);

let panelManager: PanelManager;
let extManager: ExtensionManager;
let titlebar: Titlebar;

function start(config: CommonLayoutConfig) {
  document.title = commonService.i18n.contents.editorView.title;

  const leftSideElements = document.createElement("div");

  // mktplace btn
  const marketplaceButton = new IconButton("extension");
  marketplaceButton.onClick.addListener(() => {
    editorService.showMarketplace();
  });
  leftSideElements.appendChild(marketplaceButton.render());

  // telurio editor devtools
  const devToolsBtn = new IconButton("build");
  devToolsBtn.onClick.addListener(() => {
    editorService.showEditorDevTools();
  });
  leftSideElements.appendChild(devToolsBtn.render());

  titlebar = new Titlebar(commonService, undefined, leftSideElements);
  root.appendChild(titlebar.render());

  panelManager = new PanelManager(root, config, editorService);
  extManager = new ExtensionManager(editorService);

  commonService.show();
}

start(editorService.getLayoutConfigs());
