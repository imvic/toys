const webpack = require("webpack");
const config = require("./webpack.config.common");

const outputPath = `${__dirname}/../..`;
config.output.path = outputPath;

module.exports = config;
