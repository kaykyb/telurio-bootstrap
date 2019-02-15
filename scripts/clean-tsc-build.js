// Remove o lixo gerado pelo compilador do TypeScript na dist/browser para manter somente o bundle.js
const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");
const glob = require("glob");

const BROWSER_DIST = path.join(__dirname, "..", "dist");

// remove all js files except bundle.js from dist/browser
function cleanBrowser() {
  state("Preparando para limpar " + BROWSER_DIST);
  state("Limpando lixo do compilador...");

  rimraf.sync(BROWSER_DIST + "/**/browser/**/!(*.compiled).js"); // remove unecessary tsc .js files
  state("Removendo diretórios vazios compilados...");

  // remove empty dirs
  let browserFolders = glob.sync("/**/browser/", {
    absolute: true,
    root: BROWSER_DIST
  }); // get browser folders

  browserFolders.forEach(bF => {
    state("Preparando para limpar " + bF);
    let dirs = [];
    let paths = fs.readdirSync(bF);
    paths.forEach(p => {
      let nP = path.join(bF, p);
      if (fs.lstatSync(nP).isDirectory()) dirs.push(nP);
    });

    dirs.forEach(dir => {
      try {
        state("Tentando apagar o diretório: " + dir);
        fs.rmdirSync(dir);
      } catch (error) {
        state("Diretório populado. Pulando...");
      }
    });
  });

  state("Limpeza concluída.");
}

function state(s) {
  console.log("\x1b[46m\x1b[30m\x1b[1m CLEAN-TSC-BUILD \x1b[0m " + s);
}

cleanBrowser();
