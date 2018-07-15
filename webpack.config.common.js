const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");

const outputPath = `./dist`;

module.exports = {
  context: __dirname,
  entry: {
    assets: ["react", "react-dom"],
    main: "./index.js"
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
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: "assets",
      // filename: "vendor.js"
      // (Give the chunk a different name)
      minChunks: Infinity
      // (with more entries, this ensures that no other module
      //  goes into the vendor chunk)
    }),
    // new HtmlWebpackPlugin(),
    new CleanWebpackPlugin([outputPath])
  ]
};
