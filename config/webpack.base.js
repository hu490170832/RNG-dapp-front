const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const paths = require("./paths");
const webpack = require("webpack");
/** @type {import('webpack').Configuration} */
module.exports = {
  entry: `${paths.src}/index.tsx`,
  output: {
    publicPath: "/",
    filename: "[name].[contenthash].js",
    clean: true,
  },
  module: {
    rules: [
      {
        use: "babel-loader",
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
      },
      {
        use: [
          "style-loader",
          "css-loader",
          // "postcss-loader",
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
        test: /\.(css|less)$/,
      },
      {
        type: "asset",
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json", ".jsx"],
    alias: {
      "@": paths.src,
      "@c": paths.src + "/components",
      "@m": paths.src + "/model",
      "@s": paths.src + "/services",
      "@t": paths.src + "/types",
      "@a": paths.public + "/assets",
      "@u": paths.src + "/utils",
    },
    fallback: {
      os: false,
      http: false,
      https: false,
      crypto: false,
      assert: false,
      stream: false,
      process: false,
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      // favicon: path.resolve(__dirname, "../public/favicon.ico"),
    }),
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
  ],
};
