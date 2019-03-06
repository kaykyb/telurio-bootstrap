import TelurioBridge from "@src/common/common/extensions/telurioBridge";
import ExtensionCommandActivationArgs from "@src/common/common/extensions/extensionCommandActivationArgs";

// tslint:disable-next-line:no-console
console.log("[ext-test] A extensão ext-test foi iniciada com sucesso.");

const bridge = new TelurioBridge();
bridge.execCommand("cake.doMath", { numberOne: 2, numberTwo: 17 }, (cmd: ExtensionCommandActivationArgs) => {
  console.log("Received! " + cmd.args);
});

bridge.execCommand("cake.doMath", { numberOne: 2, numberTwo: 28 }, (cmd: ExtensionCommandActivationArgs) => {
  console.log("Received! " + cmd.args);
});
