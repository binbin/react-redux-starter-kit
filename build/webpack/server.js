import webpack from 'webpack';
import config  from '../../config';
import fs      from 'fs';

const paths   = config.get('utils_paths'),
      globals = config.get('globals');

const webpackConfig = {
  name    : 'server',
  target  : 'node',
  entry   : {
    app : [
      paths.src('entry-points/server')
    ]
  },
  externals: fs.readdirSync('node_modules').filter(function(x) { return x !== '.bin' }),
  output : {
    filename : 'index.js',
    path     : paths.dist('server'),
    libraryTarget : 'commonjs2'
  },
  plugins : [
    new webpack.DefinePlugin(Object.assign(config.get('globals'), {
      __SERVER__ : true,
      __CLIENT__ : false
    })),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin()
  ],
  resolve : {
    extensions : ['', '.js', '.jsx'],
    alias : config.get('utils_aliases')
  },
  module : {
    preLoaders : [
      {
        test : /\.(js|jsx)$/,
        loaders : ['eslint-loader'],
        include : paths.project(config.get('dir_src'))
      }
    ],
    loaders : [
      {
        test    : /\.(js|jsx)$/,
        include :  paths.project(config.get('dir_src')),
        loaders : ['babel?optional[]=runtime&stage=0']
      }
    ]
  },
  eslint : {
    configFile  : paths.project('.eslintrc'),
    failOnError : globals.__PROD__
  }
};

export default webpackConfig;
