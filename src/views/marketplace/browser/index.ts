import styles from "./index.css";
import Sidebar from "./marketplace/sidebar/sidebar";
import MainView from "./marketplace/main-view/mainView";
import CommonViewBrowserService from "../../common/services/commonViewBrowserService";

function start() {
  document.title = CommonViewBrowserService.i18n.s("extView.Title");

  const root = document.getElementById("app-root");

  if (root) {
    root.classList.add(styles.root);

    const sidebar = new Sidebar();
    root.appendChild(sidebar.render());

    const mainView = new MainView();
    root.appendChild(mainView.render());
  }
}

CommonViewBrowserService.init();
start();
