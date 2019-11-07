import webpack, { Configuration } from 'webpack';
import { IBuildConfig } from '../interface/ibuild-config';
import { getContextNodeModulesPath } from './config-getters';
import { getBaseConfig } from './get-base-config';
import { getDefaultIndexHTMLConfig } from './get-default-index-html-config';
import { requireFromContext } from './require-from-context';

const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');

export const getDevelopmentConfig = (config: IBuildConfig): Configuration => {
    const webpackConfig = getBaseConfig(config);

    const developmentPluginPipeline = [
        ...(webpackConfig.plugins || []),
        new webpack.HotModuleReplacementPlugin(),
        new CaseSensitivePathsPlugin(),
        new WatchMissingNodeModulesPlugin(getContextNodeModulesPath(config)),
    ];

    if (!config.isNodeJsTarget) {
        developmentPluginPipeline.push(
            new (require('html-webpack-plugin'))({
                ...getDefaultIndexHTMLConfig(config, webpackConfig),
            }),
        );
    }

    if (config.enableManifestGeneration) {
        developmentPluginPipeline.push(new (requireFromContext('webpack-manifest-plugin', config))());
    }

    // development mode uses HotModuleReplacementPlugin which doesn't allow for content hashing
    webpackConfig.output!.filename = (webpackConfig.output!.filename! as string).replace('[contenthash', '[hash');
    webpackConfig.output!.chunkFilename = (webpackConfig.output!.filename! as string).replace('[chunkhash', '[hash');

    webpackConfig.plugins = developmentPluginPipeline;

    return webpackConfig;
};
