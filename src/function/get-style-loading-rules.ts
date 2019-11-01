import { RuleSetRule } from 'webpack';
import { defaultCSSOutputFileNamePattern } from '../defaults';
import { IBuildConfig } from './../interface/ibuild-config';
import { getEnableSourceMaps } from './config-getters';
import { requirePeerDependency } from './require-peer-dependency';

export const getStyleLoadingRules = (config: IBuildConfig): Array<RuleSetRule> => {
    const postCSSEnvPresetOptions: any = {};

    if (config.enablePostCSSAutoPrefixing) {
        postCSSEnvPresetOptions.autoprefixer = {};
    }

    const postCSSPlugins: Array<any> = [];

    if (config.enablePostCSS) {
        postCSSPlugins.push(requirePeerDependency('postcss-preset-env', config)(postCSSEnvPresetOptions));
        postCSSPlugins.push(requirePeerDependency('postcss-nested', config));
    }

    if (config.enablePostCSSLostGrid) {
        postCSSPlugins.push(requirePeerDependency('lost', config));
    }

    const styleLoadingRules: Array<RuleSetRule> = [
        // enables CSS module imports like:
        // import * as style from 'foo.css';
        // console.log(style.bar); // "bar-foo-3hg4z"
        {
            loader: 'style-loader',
        },
        {
            loader: 'dts-css-modules-loader',
            options: {
                namedExport: true,
                banner: '// This file is generated automatically',
            },
        },

        // enables CSS modules support
        {
            loader: 'css-loader',
            options: {
                modules: {
                    mode: 'local',
                    localIdentName: config.cssOutputFileNamePattern || defaultCSSOutputFileNamePattern,
                    hashPrefix: 'st',
                },
                importLoaders: config.enablePostCSS && config.enableSass ? 2 : 1,
                sourceMap: getEnableSourceMaps(config),
            },
        },
    ];

    if (config.enablePostCSS) {
        styleLoadingRules.push({
            loader: 'postcss-loader',
            options: {
                ident: 'postcss',
                plugins: () => postCSSPlugins,
            },
        });
    }

    if (config.enableSass) {
        styleLoadingRules.push({
            loader: 'sass-loader',
            options: {
                sourceMap: getEnableSourceMaps(config),
            },
        });
    }
    return styleLoadingRules;
};
