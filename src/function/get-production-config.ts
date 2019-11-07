import { basename, resolve } from 'path';
import { Configuration } from 'webpack';
import { defaultBrotliCompressionOptions, defaultBundleAnalyzerOptions, defaultEnableSourceMapInProduction, defaultGzipCompressionOptions, defaultMinifyOptions, defaultRuntimeChunkOptions, defaultSplitChunksOptions, defaultTerserOptions } from '../defaults';
import { IBuildConfig } from '../interface/ibuild-config';
import { InlineChunkHtmlPlugin } from '../plugin/inline-chunk-html';
import { InterpolateHtmlPlugin } from '../plugin/interpolate-html';
import { defaultChunkOutputFileNamePattern, defaultOutputFileNamePattern } from './../defaults';
import { getDefinitions, getEnableSourceMaps, getOutputPath, isProduction } from './config-getters';
import { generateManifest } from './generate-manifest';
import { getBaseConfig } from './get-base-config';
import { getDefaultIndexHTMLConfig } from './get-default-index-html-config';
import { requireFromContext } from './require-from-context';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

export const getProductionConfig = (config: IBuildConfig): Configuration => {
    const webpackConfig = getBaseConfig(config);

    const productionPluginPipeline = [
        ...(webpackConfig.plugins || []),
        new (require('webpack')).HashedModuleIdsPlugin(),
    ];

    if (!config.isNodeJsTarget) {
        productionPluginPipeline.push(
            new HtmlWebpackPlugin({
                ...getDefaultIndexHTMLConfig(config, webpackConfig),
                minify: defaultMinifyOptions,
            }),
        );

        if (config.inlineRuntimeChunks) {
            productionPluginPipeline.push(new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]));
        }

        productionPluginPipeline.push(new InterpolateHtmlPlugin(HtmlWebpackPlugin, getDefinitions(config)));

        productionPluginPipeline.push(
            new MiniCssExtractPlugin({
                filename: defaultOutputFileNamePattern,
                chunkFilename: defaultChunkOutputFileNamePattern,
            }),
        );

        if (config.enableManifestGeneration) {
            productionPluginPipeline.push(
                new (require('webpack-manifest-plugin'))({
                    fileName: 'asset-manifest.json',
                    publicPath: config.publicPath,
                    generate: generateManifest,
                }),
            );
        }

        if (config.enableServiceWorkerScript) {
            const WorkboxWebpackPlugin = requireFromContext('workbox-webpack-plugin', config);

            productionPluginPipeline.push(
                new WorkboxWebpackPlugin.GenerateSW({
                    clientsClaim: true,
                    exclude: [/\.map$/, /asset-manifest\.json$/],
                    importWorkboxFrom: 'cdn',
                    navigateFallback: config.publicUrl + '/index.html',
                    navigateFallbackBlacklist: [new RegExp('^/_'), new RegExp('/[^/?]+\\.[^/]+$')],
                }),
            );
        }
    }

    if (config.enableGzipCompression) {
        productionPluginPipeline.push(
            new (requireFromContext('compression-webpack-plugin', config))(defaultGzipCompressionOptions),
        );
    }

    if (config.enableBrotliCompression) {
        productionPluginPipeline.push(
            new (requireFromContext('brotli-webpack-plugin', config))(defaultBrotliCompressionOptions),
        );
    }

    if (config.enableBundleAnalyzer) {
        let reportFileName = config.bundleAnalyzerReportFile || defaultBundleAnalyzerOptions.reportFilename;
        if (config.singleFileOutput) {
            reportFileName = `${reportFileName.replace('.html', '')}_${basename(config.singleFileOutput)}.html`;
        }

        reportFileName = resolve(getOutputPath(config), reportFileName);

        productionPluginPipeline.push(
            new (requireFromContext('webpack-bundle-analyzer', config)).BundleAnalyzerPlugin({
                ...defaultBundleAnalyzerOptions,
                reportFileName,
                openAnalyzer: config.bundleAnalyzerAutoOpen,
            }),
        );
    }

    webpackConfig.plugins = productionPluginPipeline;

    const cssAssetOptimizationProcessorOptions = {
        map: getEnableSourceMaps(config)
            ? {
                  inline: false,
                  annotation: true,
              }
            : false,
    };

    if (config.enablePostCSS) {
        // @ts-ignore
        cssAssetOptimizationProcessorOptions.parser = requireFromContext('postcss-safe-parser', config);
    }

    webpackConfig.optimization = {
        minimize: isProduction(),
        minimizer: [
            new (require('optimize-css-assets-webpack-plugin'))({
                cssProcessorOptions: cssAssetOptimizationProcessorOptions,
            }),
            // JS uglification, minification and hoisting
            new (require('terser-webpack-plugin'))({
                ...defaultTerserOptions,
                sourceMap: config.enableSourceMapInProduction || defaultEnableSourceMapInProduction,
            }),
        ],
        runtimeChunk: config.singleFileOutput ? false : defaultRuntimeChunkOptions,
        splitChunks: config.singleFileOutput ? false : defaultSplitChunksOptions,
    };
    return webpackConfig;
};
