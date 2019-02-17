/** All folders with this name will be compiled by Webpack */
const AUTO_COMPILE_FOLDER_NAME = "+(parts|views)/**/browser";

/** Source files root */
const srcRoot = "src";

/** Dist root */
const distRoot = "dist";

// ----------------------------------------------------------

// webpack plugins
const CopyWebpackPlugin = require("copy-webpack-plugin");

// packages
const path = require("path");
const glob = require("glob");

//const srcPath = path.join(__dirname, srcRoot);
//const distPath = path.join(__dirname, distRoot);

console.log("\n\x1b[46m\x1b[30m\x1b[1m WEBPACK \x1b[0m Procurando arquivos para compilar...");

let toCompile = glob.sync(srcRoot + "/**/" + AUTO_COMPILE_FOLDER_NAME + "/", {
  absolute: false
});

let webpackConfigs = [];

toCompile.forEach(p => {
  const outPath = distRoot + p.slice(srcRoot.length);

  webpackConfigs.push({
    entry: path.join(__dirname, p, "index.ts"),
    devtool: "inline-source-map",
    mode: "production",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/
        },
        {
          test: /\.global.css$/,
          use: [
            {
              loader: "style-loader"
            },
            {
              loader: "css-loader"
            }
          ]
        },
        {
          test: /^((?!\.global).)*.css$/,
          use: [
            {
              loader: "style-loader"
            },
            {
              loader: "css-loader",
              options: {
                sourceMap: true,
                modules: true,
                localIdentName: "[local]___[hash:base64:5]"
              }
            }
          ]
        },
        {
          test: /\.(png|woff|woff2|eot|ttf|svg)$/,
          use: [{ loader: "url-loader?limit=100000" }]
        }
      ]
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
      modules: [path.resolve("./node_modules")],
      alias: {
        "@src": path.resolve("./src")
      }
    },
    output: {
      filename: "bundle.compiled.js",
      path: path.join(__dirname, outPath)
    },
    stats: "errors-only"
  });
});

console.log("\x1b[46m\x1b[30m\x1b[1m WEBPACK \x1b[0m Preparando para compilar...");

module.exports = webpackConfigs;
