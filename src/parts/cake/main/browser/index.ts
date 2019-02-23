import TelurioBridge from "@src/common/common/extensions/telurioBridge";
import ExtensionCommandActivationArgs from "@src/common/common/extensions/extensionCommandActivationArgs";

// tslint:disable-next-line:no-console
console.log("[ext-test] A extensão ext-test foi iniciada com sucesso.");

const bridge = new TelurioBridge();

// bridge.onCommandActivation.addListener((cmd: ExtensionCommandActivationArgs) => {
//   console.log(`CMD ACTIVATADION:`, cmd);
//   switch (cmd.cmd) {
//     case "doMath":
//       handleDoMath(cmd);
//       break;

//     default:
//       break;
//   }
// });

bridge.addCommandListener("doMath", handleDoMath);

function handleDoMath(cmd: ExtensionCommandActivationArgs) {
  if (cmd.cbCmdId) {
    const sum: number = cmd.args.numberOne + cmd.args.numberTwo;
    bridge.execCommand(cmd.cbCmdId, sum);
  }
}
