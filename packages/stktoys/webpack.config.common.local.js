const webpack = require("webpack");
const config = require("./webpack.config.common");

const outputPath = `${__dirname}/dist`;
config.output.path = outputPath;

module.exports = config;
