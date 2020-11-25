const { resolve } = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const { CheckerPlugin } = require('awesome-typescript-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

const commonConfig = {
    mode,
    resolve: {
        extensions: ['.ts', '.js']
    },
    context: resolve(__dirname, 'src'),
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader'
            },
            {
                test: /\.js$/,
                use: ['babel-loader', 'source-map-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ['style-loader', { loader: 'css-loader', options: { importLoaders: 1 } }]
            },
            {
                test: /\.(scss|sass)$/,
                loaders: [
                    'style-loader',
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    'sass-loader'
                ]
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'file-loader?hash=sha512&digest=hex&name=img/[hash].[ext]',
                    'image-webpack-loader?bypassOnDebug&optipng.optimizationLevel=7&gifsicle.interlaced=false'
                ]
            }
        ]
    },
    plugins: [
        new CheckerPlugin(),
        new HtmlWebpackPlugin({ template: 'index.html' })
    ]
};

let config;

if (mode === 'production') {
    config = merge(commonConfig, {
        entry: './index.ts',
        output: {
            filename: 'js/bundle.[hash].min.js',
            path: resolve(__dirname, 'dist'),
            publicPath: '/'
        },
        plugins: []
    });
} else {
    config = merge(commonConfig, {
        entry: [
            'webpack-dev-server/client?http://localhost:8080',
            'webpack/hot/only-dev-server',
            './index.ts'
        ],
        devServer: {
            hot: true
        },
        devtool: 'cheap-module-eval-source-map',
        plugins: [
            new webpack.HotModuleReplacementPlugin()
        ]
    });
}

module.exports = config;
