import PanelManager from "./panels/panelManager";

import styles from "./index.css";

import EditorBrowserService from "./service/editorBrowserService";
import CommonViewBrowserService from "../../common/services/commonViewBrowserService";
import CommonLayoutConfig from "../common/classes/commonLayoutConfig";
import Titlebar from "../../common/component/titlebar/titlebar";
import ExtensionManager from "./extensions/extensionManager";
import IconButton from "../../common/component/titlebar/icon-button/iconButton";

const coreService = new CommonViewBrowserService();
const editorService = new EditorBrowserService(coreService);

// script ----------------------------
const root = document.getElementById("app-root") as HTMLElement;
root.classList.add(styles.root);

let panelManager: PanelManager;
let extManager: ExtensionManager;
let titlebar: Titlebar;

function start(config: CommonLayoutConfig) {
  document.title = coreService.i18n.s("editorView.Title");

  const leftSideElements = document.createElement("div");
  const marketplaceButton = new IconButton("extension");
  leftSideElements.appendChild(marketplaceButton.render());
  marketplaceButton.onClick.addListener(() => {
    editorService.showMarketplace();
  });

  titlebar = new Titlebar(coreService, true, undefined, leftSideElements);
  root.appendChild(titlebar.render());

  panelManager = new PanelManager(root, config);
  extManager = new ExtensionManager(editorService);

  coreService.show();
}

start(editorService.getLayoutConfigs());
