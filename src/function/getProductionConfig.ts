import { Configuration } from 'webpack';
import { IBuildConfig } from './../interface/ibuild-config';
import { getDefaultESLintConfig } from './getDefaultESLintConfig';
import { getDefaultIndexHTMLConfig } from './getDefaultIndexHTMLConfig';
import { getDefaultStatsConfig } from './getDefaultStatsConfig';
import { getDefaultWebpackConfig } from './getDefaultWebpackConfig';

import webpack = require('webpack');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

export const getProductionConfig = (config: IBuildConfig): Configuration => {
    const privateConfig = getDefaultWebpackConfig(config);

    privateConfig.plugins = [
        ...(privateConfig.plugins || []),
        new CleanWebpackPlugin(),
        // don't let content hashes change unexpectedly
        new webpack.HashedModuleIdsPlugin(),
        new CopyWebpackPlugin(config.copyFiles || []),
        new ForkTsCheckerWebpackPlugin({
            ...getDefaultESLintConfig(config),
            // production optimization:
            async: false,
            useTypescriptIncrementalApi: true,
            memoryLimit: 4096,
        }),
        new ForkTsCheckerNotifierWebpackPlugin(
            PnpWebpackPlugin.forkTsCheckerOptions({
                title: 'TypeScript',
                excludeWarnings: config.ignoreWarnings || false,
            }),
        ),
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
            mode: 1,
        }),
        new ManifestPlugin(),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
        }),
    ];

    privateConfig.stats = getDefaultStatsConfig();

    // production optimization:
    privateConfig.optimization = {
        noEmitOnErrors: true,
        minimize: true,
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: true, // Must be set to true if using source-maps in production
                terserOptions: {
                    output: {
                        comments: false,
                    },
                },
            }),
        ],

        runtimeChunk: {
            name: 'runtime',
        },

        splitChunks: {
            chunks: 'async',
            minSize: Infinity,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                vendors: {
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]/,
                    enforce: true,
                    // @ts-ignore
                    name(module, chunks, cacheGroupKey) {
                        let packageNameSplits = module.rawRequest.split('/');
                        let packageName: string = packageNameSplits[0];
                        if (module.rawRequest[0] === '@') {
                            packageName = packageNameSplits[0] + '/' + packageNameSplits[1];
                        }
                        return `${cacheGroupKey}.${packageName}`;
                    },
                    priority: -10,
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
            },
        },
    };

    return privateConfig;
};
