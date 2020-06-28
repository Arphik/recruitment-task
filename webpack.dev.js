const path = require('path');
const common = require('./webpack.common');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
    mode: "development",
    devtool: "none",
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')   
        // path: __dirname + '/dist'
    },
    plugins: [
        new HtmlWebpackPlugin({
        template: './src/index.html'
        })
    ],
    module: {
        rules: [
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
            }
        ]
    }
});