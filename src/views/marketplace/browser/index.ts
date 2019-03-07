import styles from "./index.css";
import Sidebar from "./marketplace/sidebar/sidebar";
import MainView from "./marketplace/main-view/mainView";
import CommonViewBrowserService from "@src/views/common/browser/services/commonViewBrowserService";

function start() {
  const coreService = new CommonViewBrowserService();

  document.title = coreService.i18n.contents.marketplaceView.title;

  const root = document.getElementById("app-root");

  if (root) {
    root.classList.add(styles.root);

    const sidebar = new Sidebar(coreService);
    root.appendChild(sidebar.render());

    const mainView = new MainView(coreService);
    root.appendChild(mainView.render());
  }

  coreService.show();
}

start();
