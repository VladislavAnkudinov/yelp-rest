var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function (x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function (mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

var jobModule = {
  loaders: [
    {
      test: /\.js$/,
      loader: 'babel',
      query: {
        presets: ['es2015', 'stage-0']
      }
    },
    {
      loader: 'json-loader',
      test: /\.json$/
    }
  ]
};

var jobs = fs.readdirSync(path.join('src', 'test'))
  .map(function (filename) {
    return {
      target: 'node',
      devtool: 'source-map',
      entry: './' + path.join('src', 'test', filename),
      output: {
        path: path.join(__dirname, 'bld', 'test'),
        filename: filename
      },
      module: jobModule,
      externals: nodeModules
    };
  });

jobs.push({
  target: 'node',
  devtool: 'source-map',
  entry: './' + path.join('src', 'server.js'),
  output: {
    path: path.join(__dirname, 'bld'),
    filename: 'server.js'
  },
  module: jobModule,
  externals: nodeModules
});

module.exports = jobs;
