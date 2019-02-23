import TelurioBridge from "@src/common/common/extensions/telurioBridge";

// tslint:disable-next-line:no-console
console.log("[ext-test] A extensão ext-test foi iniciada com sucesso.");

const bridge = new TelurioBridge();
bridge.execCommand("ext-test.test", {});
