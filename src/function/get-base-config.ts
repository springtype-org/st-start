import { existsSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { Configuration } from 'webpack';
import { defaultDevTool, defaultModuleResolveFileExtensions, defaultOutputFileNamePattern, defaultPublicPath, defaultStatsConfig } from '../defaults';
import { IBuildConfig } from '../interface/ibuild-config';
import { checkDependency } from './check-dependency';
import { getContextPath, getEnv, getIndexTSDefaultPath, getIndexTSXDefaultPath, getOutputPath } from './config-getters';
import { getModuleLoadingRules } from './get-module-loading-rules';
import { getStyleLoadingRules } from './get-style-loading-rules';
import { log } from './log';
import { stringifyDefinitions } from './stringify-definitions';

export const getBaseConfig = (config: IBuildConfig): Configuration => {
    const webpackConfig: Partial<Configuration> = {};

    // activate default features
    config.enableSass = config.enableSass !== false;
    config.enablePostCSS = config.enablePostCSS !== false;
    config.enablePostCSSAutoPrefixing = config.enablePostCSSAutoPrefixing !== false;
    config.enablePostCSSLostGrid = config.enablePostCSSLostGrid !== false;
    config.enableRawFileImport = config.enableRawFileImport !== false;
    config.enableBundleAnalyzer = config.enableBundleAnalyzer !== false;
    config.enableDesktopNotifications = config.enableDesktopNotifications !== false;
    config.enableSourceMapInProduction = config.enableSourceMapInProduction !== false;

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
        writeFileSync(entryPointFile, readFileSync(resolve(__dirname, '..', 'index.tsx'), 'utf8'));
        log(`Entry point file did not exist. Created one: ${entryPointFile}`);
    }

    webpackConfig.entry = {
        main: [entryPointFile],
    };

    webpackConfig.output = {
        path: config.outputPath || resolve(webpackConfig.context, getOutputPath(config)),
        filename: config.outputFileNamePattern || defaultOutputFileNamePattern,
        publicPath: config.publicPath || defaultPublicPath,
    };

    webpackConfig.plugins = [
        new (require('webpack')).DefinePlugin({
            ...(stringifyDefinitions(config.definitions) || {}),
            'process.env.NODE_ENV': JSON.stringify(getEnv(config)),
        }),
        new (require('error-overlay-webpack-plugin'))(),
    ];

    if (config.enableDesktopNotifications && checkDependency('node-notifier')) {
        webpackConfig.plugins.push(
            new (require('friendly-errors-webpack-plugin'))({
                onErrors: notifyOnError,
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

export const notifyOnError = (severity: string, errors: Array<any>) => {
    const notificationIcon = resolve(__dirname, '..', 'springtype.png');
    if (severity !== 'error') {
        return;
    }

    let message: Array<string> = errors[0].message.split('\n')[0].split(/: /g);
    let file = errors[0].file || '';

    if (file.indexOf('multi') === 0) {
        const fileSplits = file.split(' ');
        file = fileSplits[fileSplits.length - 1];
    }

    // show desktop notification
    require('node-notifier').notify({
        title: `${errors[0].name}`,
        message: message[message.length - 1],
        subtitle: file,
        icon: notificationIcon,
    });
};
