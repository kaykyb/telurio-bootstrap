import TelurioBridge from "@src/common/common/extensions/telurioBridge";
import ExtensionCommandActivationArgs from "@src/common/common/extensions/extensionCommandActivationArgs";

// tslint:disable-next-line:no-console
console.log("[ext-test] A extensão ext-test foi iniciada com sucesso.");

const bridge = new TelurioBridge();

bridge.addCommandListener("doMath", handleDoMath);

function handleDoMath(cmd: ExtensionCommandActivationArgs) {
  if (cmd.cbCmdId) {
    const sum: number = cmd.args.numberOne + cmd.args.numberTwo;
    bridge.execCommand(cmd.cbCmdId, sum);
  }
}

bridge.execCommand("core.getSetting", "stringToPrint", cmd => {
  console.log("cake.stringToPrint --> ", cmd.args);
});
