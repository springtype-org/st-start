import { Configuration } from 'webpack';
import { defaultBrotliCompressionOptions, defaultBundleAnalyzerOptions, defaultEnableSourceMapInProduction, defaultGzipCompressionOptions, defaultMinifyOptions, defaultRuntimeChunkOptions, defaultSplitChunksOptions, defaultTerserOptions } from '../defaults';
import { IBuildConfig } from '../interface/ibuild-config';
import { getBaseConfig } from './get-base-config';
import { getDefaultIndexHTMLConfig } from './get-default-index-html-config';
import { requirePeerDependency } from './require-peer-dependency';

export const getProductionConfig = (config: IBuildConfig): Configuration => {
    const webpackConfig = getBaseConfig(config);

    const productionPluginPipeline = [
        ...(webpackConfig.plugins || []),
        new (requirePeerDependency('webpack', config)).HashedModuleIdsPlugin(),
    ];

    if (!config.serverMode) {
        productionPluginPipeline.push(
            new (requirePeerDependency('html-webpack-plugin', config))({
                ...getDefaultIndexHTMLConfig(config, webpackConfig),
                minify: defaultMinifyOptions,
            }),
        );
    }

    if (config.enableGzipCompression) {
        productionPluginPipeline.push(
            new (requirePeerDependency('compression-webpack-plugin', config))(defaultGzipCompressionOptions),
        );
    }

    if (config.enableBrotliCompression) {
        productionPluginPipeline.push(
            new (requirePeerDependency('brotli-webpack-plugin', config))(defaultBrotliCompressionOptions),
        );
    }

    if (config.enableManifestGeneration) {
        productionPluginPipeline.push(new (requirePeerDependency('webpack-manifest-plugin', config))());
    }

    if (config.enableBundleAnalyzer) {
        productionPluginPipeline.push(
            new (requirePeerDependency('webpack-bundle-analyzer', config)).BundleAnalyzerPlugin(defaultBundleAnalyzerOptions),
        );
    }

    webpackConfig.plugins = productionPluginPipeline;

    webpackConfig.optimization = {
        noEmitOnErrors: true,
        minimize: true,
        minimizer: [
            // JS uglification, minification and hoisting
            new (requirePeerDependency('terser-webpack-plugin', config))({
                ...defaultTerserOptions,
                sourceMap: config.enableSourceMapInProduction || defaultEnableSourceMapInProduction,
            }),
            new (requirePeerDependency('optimize-css-assets-webpack-plugin', config))({}),
        ],
        runtimeChunk: defaultRuntimeChunkOptions,
        splitChunks: defaultSplitChunksOptions,
    };
    return webpackConfig;
};
