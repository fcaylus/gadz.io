const { resolve } = require('path');
const { merge } = require('webpack-merge');
const webpack = require('webpack');
const { CheckerPlugin } = require('awesome-typescript-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

const commonConfig = {
    mode,
    entry: './index.ts',
    resolve: {
        extensions: ['.ts', '.js'],
    },
    context: resolve(__dirname, 'src'),
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader',
            },
            {
                test: /\.js$/,
                use: ['babel-loader', 'source-map-loader'],
                exclude: /node_module/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', { loader: 'css-loader', options: { importLoaders: 1 } }],
            },
            {
                test: /\.(scss|sass)$/,
                use: ['style-loader', { loader: 'css-loader', options: { importLoaders: 1 } }, 'sass-loader'],
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: ['file-loader?hash=sha512&digest=hex&name=img/[hash].[ext]', 'image-webpack-loader?bypassOnDebug'],
            },
        ],
    },
    plugins: [new CheckerPlugin(), new HtmlWebpackPlugin({ template: 'index.html' })],
};

let config;

if (mode === 'production') {
    config = merge(commonConfig, {
        output: {
            filename: 'js/bundle.[contenthash].min.js',
            path: resolve(__dirname, 'dist'),
            publicPath: '/',
        },
    });
} else {
    config = merge(commonConfig, {
        devtool: 'eval-cheap-module-source-map',
        plugins: [new webpack.HotModuleReplacementPlugin(),
    });
}

module.exports = config;
