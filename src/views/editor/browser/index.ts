import PanelManager from "./panels/panelManager";

import styles from "./index.css";

import EditorBrowserService from "./service/editorBrowserService";
import CommonViewBrowserService from "../../common/services/commonViewBrowserService";
import CommonLayoutConfig from "../common/classes/commonLayoutConfig";
import Titlebar from "../../common/component/titlebar/titlebar";
import ExtensionHost from "./extensions/extensionHost";
import IconButton from "../../common/component/titlebar/icon-button/iconButton";

CommonViewBrowserService.init();

// script ----------------------------
const root = document.getElementById("app-root") as HTMLElement;
root.classList.add(styles.root);

let panelManager: PanelManager;
let extHost: ExtensionHost;
let titlebar: Titlebar;

function start(config: CommonLayoutConfig) {
  document.title = CommonViewBrowserService.i18n.s("editorView.Title");

  const leftSideElements = document.createElement("div");
  const marketplaceButton = new IconButton("extension");
  leftSideElements.appendChild(marketplaceButton.render());
  marketplaceButton.onClick.addListener(() => {
    EditorBrowserService.showMarketplace();
  });

  titlebar = new Titlebar(true, undefined, leftSideElements);
  root.appendChild(titlebar.render());

  panelManager = new PanelManager(root, config);
  extHost = new ExtensionHost();

  CommonViewBrowserService.show();
}

start(EditorBrowserService.getLayoutConfigs());
