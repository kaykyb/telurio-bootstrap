import TelurioBridge from "@src/common/common/extensions/sdk/telurioBridge";
import ExtensionCommandActivationArgs from "@src/common/common/extensions/extensionCommandActivationArgs";

// tslint:disable-next-line:no-console
console.log("Chocolate!");

const bridge = new TelurioBridge();
bridge.execCommand("cake.doMath", { numberOne: 2, numberTwo: 17 }, (cmd: ExtensionCommandActivationArgs) => {
  // tslint:disable-next-line: no-console
  console.log("Received! " + cmd.args);
});

bridge.execCommand("cake.doMath", { numberOne: 2, numberTwo: 28 }, (cmd: ExtensionCommandActivationArgs) => {
  // tslint:disable-next-line: no-console
  console.log("Received! " + cmd.args);
});
