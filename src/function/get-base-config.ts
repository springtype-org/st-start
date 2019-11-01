import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { Configuration } from 'webpack';
import { defaultDevTool, defaultModuleResolveFileExtensions, defaultOutputFileNamePattern, defaultPublicPath, defaultStatsConfig } from '../defaults';
import { IBuildConfig } from '../interface/ibuild-config';
import { getContextPath, getEnv, getIndexTSDefaultPath, getIndexTSXDefaultPath, getInputPath, getOutputPath } from './config-getters';
import { getModuleLoadingRules } from './get-module-loading-rules';
import { getStyleLoadingRules } from './get-style-loading-rules';
import { log } from './log';
import { notifyOnError } from './notify-on-error';
import { requirePeerDependency } from './require-peer-dependency';
import { stringifyDefinitions } from './stringify-definitions';

export const getBaseConfig = (config: IBuildConfig): Configuration => {
    const webpackConfig: Partial<Configuration> = {};


    webpackConfig.mode = getEnv(config);
    webpackConfig.context = getContextPath(config);
    webpackConfig.watch = !!config.watchMode;

    const indexTSXDefaultPath = getIndexTSXDefaultPath(config);
    const indexTSDefaultPath = getIndexTSDefaultPath(config);
    const defaultIndexTSXExists = existsSync(indexTSXDefaultPath);

    let entryPointFile = indexTSDefaultPath;

    if (defaultIndexTSXExists) {
        entryPointFile = indexTSXDefaultPath;
    }

    if (config.entryPoint) {
        entryPointFile = resolve(config.entryPoint);
    }

    if (!existsSync(entryPointFile)) {
        if (!existsSync(getInputPath(config))) {
            mkdirSync(getInputPath(config));
        }

        writeFileSync(entryPointFile, readFileSync(resolve(__dirname, '..', 'index.tsx'), 'utf8'));
        log(`Entry point file did not exist. Created one: ${entryPointFile}`);
    }

    webpackConfig.resolveLoader = {

        // resolve loaders from local directory
        modules: [resolve(getContextPath(config), 'node_modules')]
    };

    webpackConfig.entry = {
        main: [entryPointFile],
    };

    webpackConfig.output = {
        path: config.outputPath || resolve(webpackConfig.context, getOutputPath(config)),
        filename: config.outputFileNamePattern || defaultOutputFileNamePattern,
        publicPath: config.publicPath || defaultPublicPath,
    };

    webpackConfig.plugins = [
        new (requirePeerDependency('webpack', config)).DefinePlugin({
            ...(stringifyDefinitions(config.definitions) || {}),
            'process.env.NODE_ENV': JSON.stringify(getEnv(config)),
        }),
        new (requirePeerDependency('error-overlay-webpack-plugin', config))(),
    ];

    if (config.enableDesktopNotifications) {
        webpackConfig.plugins.push(
            new (requirePeerDependency('friendly-errors-webpack-plugin', config))({
                onErrors: (severity: string, errors: Array<any>) => notifyOnError(severity, errors, config),
            }),
        );
    }

    webpackConfig.resolve = {
        extensions: config.moduleResolutionFileExtensions || defaultModuleResolveFileExtensions,
    };

    webpackConfig.devtool = config.devTool || defaultDevTool;

    webpackConfig.stats = defaultStatsConfig;

    webpackConfig.module = {
        rules: getModuleLoadingRules(config, getStyleLoadingRules(config)),
    };
    return webpackConfig;
};
