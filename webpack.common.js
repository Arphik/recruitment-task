const path = require('path');

module.exports = {
    devtool: "none",
    entry: './src/index.js',
    module: {
        rules: [
        {
            test: /\.js$/,
            use: {
                loader: 'babel-loader',
                options:{
                    presets: ['@babel/preset-env']
                }
            } 
        },
        {
            test: /\.html$/i,
            loader: 'html-loader',
        },
        {
            test: /\.(png|svg|jpg|gif|eot|woff|woff2|ttf)$/,
            use: {
                loader: 'file-loader',
                options: {
                    name: '[name].[hash].[ext]',
                    outputPath: 'images'
                }
            },
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
    }
};