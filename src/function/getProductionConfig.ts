import { Configuration } from "webpack";
import { IBuildConfig } from './../interface/ibuild-config';
import { getDefaultIndexHTMLConfig } from './getDefaultIndexHTMLConfig';
import { getDefaultStatsConfig } from './getDefaultStatsConfig';
import { getDefaultWebpackConfig } from './getDefaultWebpackConfig';

import webpack = require("webpack");

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const PnpWebpackPlugin = require("pnp-webpack-plugin");
const CompressionPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

export const getProductionConfig = (config: IBuildConfig): Configuration => {
    
    const privateConfig = getDefaultWebpackConfig(config);

    privateConfig.plugins = [
        ...privateConfig.plugins || [],
        new CleanWebpackPlugin(),
        // don't let content hashes change unexpectedly
        new webpack.HashedModuleIdsPlugin(),
        new CopyWebpackPlugin(config.copyFiles || []),
        new ForkTsCheckerWebpackPlugin({
            eslint: config.eslint || true,
            // production optimization:
            async: false,
            useTypescriptIncrementalApi: true,
            memoryLimit: 4096
        }),
        new ForkTsCheckerNotifierWebpackPlugin(PnpWebpackPlugin.forkTsCheckerOptions({
            title: 'TypeScript', excludeWarnings: config.ignoreWarnings || false 
        })),
        new HtmlWebpackPlugin({
            ...getDefaultIndexHTMLConfig(config),
            // production optimization:
            hash: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            },
        }),
        new webpack.HashedModuleIdsPlugin(), 
        new CompressionPlugin({ test: /\.js(\.map)?$/i }), // prepare compressed versions 
        new BrotliPlugin({
            asset: '[path].br[query]',
            test: /\.js(\.map)?$/i,
            threshold: 20,
            minRatio: 0.8,
            mode: 1
          }),
        new ManifestPlugin(),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static'
        }), 
    ];

    privateConfig.stats = getDefaultStatsConfig();

    // production optimization:
    privateConfig.optimization = {
        noEmitOnErrors: true,
        minimize: true,
        minimizer: [new TerserPlugin({
            cache: true,
            parallel: true,
            sourceMap: true, // Must be set to true if using source-maps in production
            terserOptions: {
                output: {
                    comments: false
                  }
            }
        })],
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name(module) {
                        // get the name. E.g. node_modules/packageName/not/this/part.js
                        // or node_modules/packageName
                        const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

                        // npm package names are URL-safe, but some servers don't like @ symbols
                        return `npm.${packageName.replace('@', '')}`;
                    },
                },
            },
        }
    };

    return privateConfig;
};