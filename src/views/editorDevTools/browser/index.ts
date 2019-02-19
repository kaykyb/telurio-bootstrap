import Commander from "./commander/commander";
import EditorDevToolsBrowserService from "./service/editorDevToolsService";

import styles from "./index.css";

import CommonViewBrowserService from "@src/views/common/services/commonViewBrowserService";
import Titlebar from "@src/views/common/component/titlebar/titlebar";

(() => {
  const root = document.getElementById("app-root") as HTMLElement;
  root.classList.add(styles.root);

  const coreService = new CommonViewBrowserService();
  const editorDevToolsService = new EditorDevToolsBrowserService(coreService);

  document.title = coreService.i18n.s("editorDevToolsView.Title");

  const titlebar = new Titlebar(coreService, true);
  root.appendChild(titlebar.render());

  const commander = new Commander(editorDevToolsService);
  root.appendChild(commander.render());

  coreService.show();
})();
