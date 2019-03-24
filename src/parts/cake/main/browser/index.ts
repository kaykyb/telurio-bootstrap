import TelurioBridge from "@src/common/common/extensions/sdk/telurioBridge";
import ExtensionCommandActivationArgs from "@src/common/common/extensions/extensionCommandActivationArgs";
import PanelRegistrationArgs from "@src/views/editor/common/classes/panelRegistrationArgs";
import Tab from "@src/views/editor/common/classes/tab";

// tslint:disable-next-line:no-console
console.log("Cake!");

const bridge = new TelurioBridge();

bridge.addCommandListener("doMath", handleDoMath);

function handleDoMath(cmd: ExtensionCommandActivationArgs) {
  if (cmd.cbCmdId) {
    const sum: number = cmd.args.numberOne + cmd.args.numberTwo;
    bridge.execCommand(cmd.cbCmdId, sum);
  }
}

bridge.execCommand("core.getSetting", "stringToPrint", cmd => {
  // tslint:disable-next-line: no-console
  console.log("cake.stringToPrint --> ", cmd.args);
});

bridge.execCommand("core.registerPanel", new PanelRegistrationArgs("cake", "browser/browser.html"));

bridge.onPanelMessage.addListener(e => {
  bridge.execCommand("core.editor.getOwnedTabs", undefined, cmd => {
    const tabs = cmd.args as Tab[];

    tabs.forEach(tab => {
      bridge.execCommand("core.editor.sendMessageToTab", { tabId: tab.id, message: e.message });
    });
  });
});
