import styles from "@src/common/browser/styles/commonStyles.css";

import PanelBridge from "@src/common/common/extensions/sdk/panelBridge";

const root = styles.cRoot;

if (root) {
  const bridge = new PanelBridge();
  bridge.applyTheme();

  document.write("Cake! + " + Math.random());
}
