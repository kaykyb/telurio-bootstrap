import PanelManager from "./panels/panelManager";

import styles from "./index.css";

import EditorBrowserService from "./service/editorBrowserService";
import CommonViewBrowserService from "../../common/services/commonViewBrowserService";
import CommonLayoutConfig from "../common/classes/commonLayoutConfig";
import Titlebar from "../../common/component/titlebar/titlebar";

CommonViewBrowserService.init();

// script ----------------------------
const root = document.getElementById("app-root") as HTMLElement;
root.classList.add(styles.root);

let panelManager: PanelManager;
let titlebar: Titlebar;

function start(config: CommonLayoutConfig) {
  document.title = CommonViewBrowserService.i18n.s("editorView.Title");

  titlebar = new Titlebar(true);
  root.appendChild(titlebar.render());

  panelManager = new PanelManager(root, config);
}

start(EditorBrowserService.getLayoutConfigs());
