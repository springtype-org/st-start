import { existsSync } from 'fs';
import { resolve } from 'path';
import { Configuration } from 'webpack';
import { babelOptions } from '../defaults';
import { IBuildConfig } from '../interface/ibuild-config';
import { getTsConfigPath } from './get-ts-config-path';
import webpack = require('webpack');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const stringifyDefinitions = (definitions: any = {}): any => {
    for (let name in definitions) {
        definitions[name] = JSON.stringify(definitions[name]);
    }
};

export const getDefaultWebpackConfig = (config: IBuildConfig): Configuration => {
    // @ts-ignore
    const privateConfig: Configuration = {};

    privateConfig.mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
    privateConfig.context = config.context || process.cwd();

    const entryFile = resolve(
        privateConfig.context,
        config.entryPoint || (existsSync('./src/index.tsx') ? './src/index.tsx' : './src/index.ts'),
    );
    const entryFileResolved = resolve(process.cwd(), entryFile);

    privateConfig.entry = {
        main: [entryFileResolved],
    };

    privateConfig.output = {
        path: config.outputPath || resolve(process.cwd(), 'dist'),
        filename: config.outputFileName || '[name].[hash].js',
        publicPath: config.publicPath || '',
    };

    privateConfig.plugins = [
        new webpack.DefinePlugin({
            ...(stringifyDefinitions(config.definitions) || {}),
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
        }),
    ];

    privateConfig.resolve = {
        symlinks: false,
        extensions: config.fileExtensions || ['.tsx', '.ts', '.js'],
    };

    privateConfig.devtool = 'cheap-module-source-map';

    privateConfig.module = {
        rules: [
            {
                test: /.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: require.resolve('babel-loader'),
                        options: babelOptions,
                    },
                    {
                        loader: require.resolve('ts-loader'),
                        options: {
                            transpileOnly: true,
                            configFile: getTsConfigPath(),
                        },
                    },
                ],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: require.resolve('babel-loader'),
                        options: babelOptions,
                    },
                ],
            },
            {
                test: /\.css$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: process.env.NODE_ENV === 'development',
                        },
                    },
                    //{ loader: 'style-loader', options: { injectType: 'linkTag' } },
                    'css-loader',
                ],
            },
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader',
            },
            {
                test: config.rawFileImportExt || /\.txt$/i,
                use: 'raw-loader',
            },
        ],
    };
    return privateConfig;
};
