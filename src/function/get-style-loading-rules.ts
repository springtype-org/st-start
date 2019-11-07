import { RuleSetRule } from 'webpack';
import { defaultCSSOutputFileNamePattern } from '../defaults';
import { IBuildConfig } from './../interface/ibuild-config';
import { getEnableSourceMaps, isProduction } from './config-getters';
import { requireFromContext, resolveFromContext } from './require-from-context';

// TODO: Necessary?
//const MiniCssExtractPlugin = require('mini-css-extract-plugin');

export const getStyleLoadingRules = (config: IBuildConfig): Array<RuleSetRule> => {
    const postCSSEnvPresetOptions: any = {
        stage: 3, // TODO: config!
    };

    if (config.enablePostCSSAutoPrefixing) {
        postCSSEnvPresetOptions.autoprefixer = {
            // TODO: config?
            flexbox: 'no-2009',
        };
    }

    const postCSSPlugins: Array<any> = [];

    if (config.enablePostCSS) {
        postCSSPlugins.push(requireFromContext('postcss-flexbugs-fixes', config));
        postCSSPlugins.push(requireFromContext('postcss-preset-env', config)(postCSSEnvPresetOptions));
        postCSSPlugins.push(requireFromContext('postcss-nested', config));
        postCSSPlugins.push(requireFromContext('postcss-normalize', config));
    }

    if (config.enablePostCSSLostGrid) {
        postCSSPlugins.push(requireFromContext('lost', config));
    }

    const styleLoadingRules: Array<RuleSetRule> = [
        // enables CSS module imports like:
        // import * as style from 'foo.css';
        // console.log(style.bar); // "bar-foo-3hg4z"
        {
            loader: require.resolve('style-loader'),
        },
    ];

    if (isProduction()) {
        // TODO: Fixme: Creates .js files containing CSS when importing CSS in TS
        /*
        styleLoadingRules.push({
            loader: MiniCssExtractPlugin.loader,
            options: {
                chunkFilename: isDevelopment() ? '[id].css' : '[id].[hash].css',
            }
        });
        */
    }

    // generates .d.ts files corresponding module declaration files
    // for typed CSS module exports
    if (config.enableCssImportTypeDeclaration) {
        styleLoadingRules.push({
            // TODO: Implement on our own, it has outdated dependencies
            // generates .d.ts files for CSS module imports
            loader: resolveFromContext('dts-css-modules-loader', config),
            options: {
                namedExport: true,
                banner: '// This file is generated automatically',
            },
        });
    }

    styleLoadingRules.push({
        loader: require.resolve('css-loader'),
        options: {
            // enables CSS modules support
            modules: {
                mode: 'local',
                localIdentName: config.cssOutputFileNamePattern || defaultCSSOutputFileNamePattern,
                hashPrefix: 'st',
            },
            importLoaders: config.enablePostCSS && config.enableSass ? 2 : 1,
            sourceMap: getEnableSourceMaps(config),
        },
    });

    if (config.enablePostCSS || config.enableSass) {
        // rewrites url() tokens in CSS/SCSS/SASS files
        styleLoadingRules.push({
            loader: resolveFromContext('resolve-url-loader', config),
            options: {
                sourceMap: getEnableSourceMaps(config),
            },
        });
    }

    if (config.enablePostCSS) {
        styleLoadingRules.push({
            loader: resolveFromContext('postcss-loader', config),
            options: {
                ident: 'postcss',
                plugins: () => postCSSPlugins,
            },
        });
    }

    if (config.enableSass) {
        styleLoadingRules.push({
            loader: resolveFromContext('sass-loader', config),
            options: {
                sourceMap: getEnableSourceMaps(config),
            },
        });
    }
    return styleLoadingRules;
};
