const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const UglifyJS = require("uglifyjs-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");

const outputPath = `${__dirname}/dist`;

module.exports = {
  mode: "production",
  context: __dirname,
  entry: {
    assets: ["react", "react-dom"],
    main: "./index.jsx"
  },
  output: {
    path: outputPath,
    filename: "[name].bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js|jsx$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["es2015", "react", "stage-2"]
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  resolve: {
    extensions: [".js", ".json", ".jsx", ".css"]
  },
  devtool: "source-map",
  plugins: [
    new CleanWebpackPlugin([outputPath]),
    new UglifyJS({
      sourceMap: true
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production")
    }),
    new HtmlWebpackPlugin({
      inlineSource: ".(js|css)$",
      template: "template.html"
    }),
    new HtmlWebpackInlineSourcePlugin()
  ]
};
