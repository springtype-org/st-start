import { RuleSetRule } from 'webpack';
import { defaultCSSOutputFileNamePattern } from '../defaults';
import { IBuildConfig } from './../interface/ibuild-config';
import { getContextNodeModulesPath, getEnableSourceMaps, getInputPath } from './config-getters';
import { getPostCssConfig } from './get-postcss-plugins';
import { resolveFromContext } from './require-from-context';

export const getStyleLoadingRules = (config: IBuildConfig, isTypedStylesheet: boolean = false): Array<RuleSetRule> => {
    
    const styleLoadingRules: Array<RuleSetRule> = [];

    // enables CSS module imports like:
    // import * as style from 'foo.css';
    // console.log(style.bar); // "bar-foo-3hg4z"
    styleLoadingRules.push({
        loader: require.resolve('style-loader'),
    });

    // generates .d.ts files corresponding module declaration files
    // for typed CSS module exports
    if (config.enableCssImportTypeDeclaration && isTypedStylesheet) {
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
            modules: isTypedStylesheet
                ? {
                      mode: 'local',
                      localIdentName: config.cssOutputFileNamePattern || defaultCSSOutputFileNamePattern,
                      hashPrefix: 'st',
                  }
                : false,
            localsConvention: isTypedStylesheet ? 'camelCaseOnly' : 'asIs',
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
                plugins: () => getPostCssConfig(config),
            },
        });
    }

    if (config.enableSass) {
        styleLoadingRules.push({
            loader: resolveFromContext('sass-loader', config),
            options: {
                sourceMap: getEnableSourceMaps(config),
                sassOptions: {
                    includePaths: [getContextNodeModulesPath(config), getInputPath(config)],
                },
            },
        });
    }
    return styleLoadingRules;
};
