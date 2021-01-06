/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
/** PLUGINS */
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLPlugins = require('./lib/html_build');

const isDevMode = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: isDevMode ? 'development' : 'production',
  entry: '/src/main.ts',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, './public'),
    // contentBasePublicPath: '/public/',
    watchContentBase: true,
    hot: true,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    ...HTMLPlugins,
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        enforce: 'pre',
        use: [
          {
            loader: require.resolve('eslint-loader'),
            options: {
              eslintPath: require.resolve('eslint'),
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/public/',
  },
  optimization: {
    minimize: !isDevMode,
    minimizer: [
      // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
      // `...`,
      new CssMinimizerPlugin({
        sourceMap: isDevMode,
      }),
    ],
  },
};