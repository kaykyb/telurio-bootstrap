import styles from "@src/common/browser/styles/commonStyles.css";

import CommonViewBrowserService from "@src/views/common/browser/services/commonViewBrowserService";
import Titlebar from "@src/views/common/browser/components/titlebar/titlebar";

async function start() {
  const root = document.getElementById("app-root") as HTMLElement;
  root.classList.add(styles.rRoot);

  const commonService = new CommonViewBrowserService();
  await commonService.start();

  const titlebar = new Titlebar(commonService);
  root.appendChild(await titlebar.render());

  document.title = commonService.i18n.contents.settingsEditorView.title;
}

start();
