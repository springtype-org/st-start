import { Configuration } from 'webpack';
import { defaultBrotliCompressionOptions, defaultBundleAnalyzerOptions, defaultEnableSourceMapInProduction, defaultGzipCompressionOptions, defaultMinifyOptions, defaultRuntimeChunkOptions, defaultSplitChunksOptions, defaultTerserOptions } from '../defaults';
import { IBuildConfig } from '../interface/ibuild-config';
import { checkDependency } from './check-dependency';
import { getBaseConfig } from './get-base-config';
import { getDefaultIndexHTMLConfig } from './get-default-index-html-config';

export const getProductionConfig = (config: IBuildConfig): Configuration => {
    const webpackConfig = getBaseConfig(config);

    const productionPluginPipeline = [
        ...(webpackConfig.plugins || []),
        new (require('webpack')).HashedModuleIdsPlugin(),
    ];

    if (!config.serverMode) {
        productionPluginPipeline.push(
            new (require('html-webpack-plugin'))({
                ...getDefaultIndexHTMLConfig(config, webpackConfig),
                minify: defaultMinifyOptions,
            }),
        );
    }

    if (config.enableGzipCompression && checkDependency('compression-webpack-plugin')) {
        productionPluginPipeline.push(
            new (require('compression-webpack-plugin'))(defaultGzipCompressionOptions),
        );
    }

    if (config.enableBrotliCompression && checkDependency('brotli-webpack-plugin')) {
        productionPluginPipeline.push(
            new (require('brotli-webpack-plugin'))(defaultBrotliCompressionOptions),
        );
    }

    if (config.enableManifestGeneration && checkDependency('webpack-manifest-plugin')) {
        productionPluginPipeline.push(new (require('webpack-manifest-plugin'))());
    }

    if (config.enableBundleAnalyzer && checkDependency('webpack-bundle-analyzer')) {
        productionPluginPipeline.push(
            new (require('webpack-bundle-analyzer')).BundleAnalyzerPlugin(defaultBundleAnalyzerOptions),
        );
    }

    webpackConfig.plugins = productionPluginPipeline;

    webpackConfig.optimization = {
        noEmitOnErrors: true,
        minimize: true,
        minimizer: [
            // JS uglification, minification and hoisting
            new (require('terser-webpack-plugin'))({
                ...defaultTerserOptions,
                sourceMap: config.enableSourceMapInProduction || defaultEnableSourceMapInProduction,
            }),
            new (require('optimize-css-assets-webpack-plugin'))({}),
        ],
        runtimeChunk: defaultRuntimeChunkOptions,
        splitChunks: defaultSplitChunksOptions,
    };
    return webpackConfig;
};
