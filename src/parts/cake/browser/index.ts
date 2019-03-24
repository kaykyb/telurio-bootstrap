import styles from "@src/common/browser/styles/commonStyles.css";

import PanelBridge from "@src/common/common/extensions/sdk/panelBridge";
import Topbar from "./topbar/topbar";
import MsgConsole from "./console/console";

const bridge = new PanelBridge();
bridge.applyTheme();

const root = styles.cRoot;
document.body.classList.add(root);

const body = document.body;
body.style.border = "none";

const topbar = new Topbar();
const co = new MsgConsole();

body.appendChild(topbar.render());
body.appendChild(co.render());
