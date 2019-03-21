import styles from "@src/views/common/browser/commonStyles.css";
import Sidebar from "./marketplace/sidebar/sidebar";
import MainView from "./marketplace/main-view/mainView";
import CommonViewBrowserService from "@src/views/common/browser/services/commonViewBrowserService";

async function start() {
  const commonService = new CommonViewBrowserService();
  await commonService.start();
  document.title = commonService.i18n.contents.marketplaceView.title;

  const root = document.getElementById("app-root");

  if (root) {
    root.classList.add(styles.root);

    const sidebar = new Sidebar(commonService);
    root.appendChild(sidebar.render());

    const mainView = new MainView(commonService);
    root.appendChild(await mainView.render());
  }

  commonService.show();
}

start();
