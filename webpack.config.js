const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  resolve: {
    alias: {
      "lit-element": path.resolve("./node_modules/lit-element"),
      "lit-html": path.resolve("./node_modules/lit-html")
    },
    extensions: [".ts", ".tsx", ".js", ".json", ".css", ".scss", ".html"]
  },
  entry: ["babel-polyfill", "./src/index.ts"],
  devServer: {
    historyApiFallback: true,
    port: 8080
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: { ie: "11" } }]],
            plugins: ["@babel/plugin-syntax-dynamic-import"]
          }
        }
      },
      {
        test: /\.ts$/,
        use: {
          loader: "ts-loader"
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
      baseUrl: process.env.NODE_ENV == "development" ? "/" : "/holochain-playground/"
    })
  ]
};
