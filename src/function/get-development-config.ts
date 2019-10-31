import { Configuration } from 'webpack';
import { IBuildConfig } from '../interface/ibuild-config';
import { checkDependency } from './check-dependency';
import { getBaseConfig } from './get-base-config';
import { getDefaultIndexHTMLConfig } from './get-default-index-html-config';

export const getDevelopmentConfig = (config: IBuildConfig): Configuration => {
    const webpackConfig = getBaseConfig(config);

    const developmentPluginPipeline = [
        ...(webpackConfig.plugins || []),
        new (require('webpack')).HotModuleReplacementPlugin(),
    ];

    if (!config.serverMode) {
        developmentPluginPipeline.push(
            new (require('html-webpack-plugin'))({
                ...getDefaultIndexHTMLConfig(config, webpackConfig),
            }),
        );
    }

    if (config.enableManifestGeneration) {
        developmentPluginPipeline.push(new (checkDependency('webpack-manifest-plugin'))());
    }

    webpackConfig.plugins = developmentPluginPipeline;

    return webpackConfig;
};
