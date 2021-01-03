/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

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
  plugins: [],
  module: {
    rules: [
      // Linting
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
      // Typescript Transpiling
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      // CSS files
      {
        test: /\.css$/i,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: { sourceMap: isDevMode } },
        ],
      },
      // Checks HTML for hot reloading
      {
        test: /\.html$/,
        loader: "raw-loader"
      }
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