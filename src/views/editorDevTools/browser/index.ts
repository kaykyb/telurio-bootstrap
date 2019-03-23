import Commander from "./commander/commander";
import EditorDevToolsBrowserService from "./service/editorDevToolsService";

import styles from "@src/views/common/browser/commonStyles.css";

import CommonViewBrowserService from "@src/views/common/browser/services/commonViewBrowserService";
import Titlebar from "@src/views/common/browser/components/titlebar/titlebar";

async function start() {
  const root = document.getElementById("app-root") as HTMLElement;
  root.classList.add(styles.cRoot);

  const commonService = new CommonViewBrowserService();
  await commonService.start();

  const editorDevToolsService = new EditorDevToolsBrowserService(commonService);

  document.title = commonService.i18n.contents.editorDevToolsView.title;

  const titlebar = new Titlebar(commonService);
  root.appendChild(await titlebar.render());

  const commander = new Commander(editorDevToolsService);
  root.appendChild(commander.render());

  commonService.show();
}

start();
