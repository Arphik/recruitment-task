const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
    // path: __dirname + '/dist'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
            loader: 'babel-loader',
            options:{
                presets: [
                  ['@babel/preset-env', {"targets": { "node": "current" }}]
                ]
            }
        } 
      },
      {
          test: /\.(sass|scss|css|s[ac]ss)$/i,
          use: [
            // Creates `style` nodes from JS strings 
            'style-loader',
            // Translates CSS into CommonJS
            'css-loader',
            // Compiles Sass to CSS
            'sass-loader',
          ]
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.(png|svg|jpg|gif|eot|woff|woff2|ttf)$/,
        use: [
          'file-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif|css)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  devServer:{
      port: 9001
  }
};