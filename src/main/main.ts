import { app, BrowserWindow } from "electron";
import * as path from "path";
import Editor from "../views/editor/editor";
import Marketplace from "../views/marketplace/marketplace";
import I18nService from "../common/node/services/i18n/i18nService";

// tslint:disable-next-line:no-console
console.log("\n\x1b[46m\x1b[30m\x1b[1m ELECTRON \x1b[0m Processo main iniciado.");

let i18n: I18nService;
let rawI18nJson: string;

const editors: Editor[] = [];

function startEditor() {
  i18n = new I18nService(app.getLocale(), true);
  rawI18nJson = i18n.disposeRawJson() as string;

  const editor = new Editor(i18n, rawI18nJson);
  editors.push(editor);
}

app.on("ready", startEditor);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // OSX
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // OSX
  if (editors.length === 0) {
    startEditor();
  }
});
