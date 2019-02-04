const path = require("path");
const fs = require("fs-extra");
const glob = require("glob");

const DIST_PATH = path.join(__dirname, "..", "dist");
const SRC_PATH = path.join(__dirname, "..", "src");

state("Procurando arquivos para copiar...");
let filesToCopy = glob.sync("/**/!(*.ts|*.css)", { absolute: true, root: SRC_PATH, nodir: true });
let dirsToCreate = glob.sync("/**/*/", { absolute: true, root: SRC_PATH });

state("Preparando para criar " + dirsToCreate.length + " diretórios...");

dirsToCreate.forEach(dirPath => {
  let dir = path.join(DIST_PATH, dirPath.slice(SRC_PATH.length));
  nState("Criando diretório " + dir);
  fs.mkdirpSync(dir);
});

state("Preparando para copiar " + filesToCopy.length + " arquivos...");

filesToCopy.forEach(filePath => {
  nState("Copiando " + filePath);
  let newPath = path.join(DIST_PATH, filePath.slice(SRC_PATH.length));
  fs.copyFileSync(filePath, newPath);
});

state("Ativos copiados.");

function state(s) {
  console.log("\n\x1b[46m\x1b[30m\x1b[1m COPY-ASSETS \x1b[0m " + s);
}

function nState(s) {
  process.stdout.write("\r\x1b[K");
  process.stdout.write("\x1b[46m\x1b[30m\x1b[1m COPY-ASSETS \x1b[0m " + s);
}
