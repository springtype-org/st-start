import { Configuration } from 'webpack';
import { IBuildConfig } from '../interface/ibuild-config';
import { getBaseConfig } from './get-base-config';
import { getDefaultIndexHTMLConfig } from './get-default-index-html-config';
import { requirePeerDependency } from './require-peer-dependency';

export const getDevelopmentConfig = (config: IBuildConfig): Configuration => {
    const webpackConfig = getBaseConfig(config);

    const developmentPluginPipeline = [
        ...(webpackConfig.plugins || []),
        new (requirePeerDependency('webpack', config)).HotModuleReplacementPlugin(),
    ];

    if (!config.serverMode) {
        developmentPluginPipeline.push(
            new (requirePeerDependency('html-webpack-plugin', config))({
                ...getDefaultIndexHTMLConfig(config, webpackConfig),
            }),
        );
    }

    if (config.enableManifestGeneration) {
        developmentPluginPipeline.push(new (requirePeerDependency('webpack-manifest-plugin', config))());
    }

    webpackConfig.plugins = developmentPluginPipeline;

    return webpackConfig;
};
