import { resolve } from 'path';
import { RuleSetRule } from 'webpack';
import { defaultInlineImageExtensions, defaultInlineMaxFileSize, defaultRawFileExcludeExtensions, defaultTestCSSTranspileFileExtensions, defaultTestJSTranspileFileExtensions } from '../defaults';
import { IBuildConfig } from './../interface/ibuild-config';
import { getEnableSourceMaps, getInputPath, isProduction } from './config-getters';
import { getCacheIdent } from './get-cache-ident';
import { requireFromContext, resolveFromContext } from './require-from-context';

export const getModuleLoadingRules = (
    config: IBuildConfig,
    styleLoadingRules: Array<RuleSetRule>,
): Array<RuleSetRule> => {
    const transpilationRulesOneOf = [];

    if (config.enableImageInlining) {
        // support for image inlining
        transpilationRulesOneOf.push({
            test: config.inlineImageExtensions || defaultInlineImageExtensions,
            loader: resolveFromContext('url-loader', config),
            options: {
                limit: (config.inlineImageMaxFileSize || defaultInlineMaxFileSize) * 1024,
                name: 'static/assets/[name].[hash:8].[ext]',
            },
        });
    }

    transpilationRulesOneOf.push({
        test: config.testJSTranspileFileExtensions || defaultTestJSTranspileFileExtensions,
        include: resolve(getInputPath(config)),
        loader: require.resolve('babel-loader'),
        options: {
            customize: require.resolve('../loaders/st-customize-babel-loader'),
            babelrc: false,
            configFile: false,
            presets: [require.resolve('../loaders/st-babel-preset')],
            cacheIdentifier: getCacheIdent(isProduction() ? 'production' : 'development', [
                //'babel-plugin-named-asset-import',
                'babel-preset-react-app',
                'react-dev-utils',
                'st-start',
            ]),
            //plugins: [[require.resolve('babel-plugin-named-asset-import')]],
            cacheDirectory: true,
            cacheCompression: false,
            sourceMaps: getEnableSourceMaps(config),
            inputSourceMap: getEnableSourceMaps(config),
            compact: isProduction(),
        },
    });

    transpilationRulesOneOf.push({
        test: config.testCSSTranspileFileExtensions || defaultTestCSSTranspileFileExtensions,
        use: styleLoadingRules,
        // make sure side effects are always considered
        sideEffects: true,
    });

    if (config.enableRawFileImport) {
        // allows for importing files "as is", but only for files with extensions
        // which are not excluded by a RegExp match
        transpilationRulesOneOf.push({
            loader: resolveFromContext('file-loader', config),
            exclude: [
                config.testJSTranspileFileExtensions || defaultTestJSTranspileFileExtensions,
                ...(config.rawFileExcludeImportExtensions || defaultRawFileExcludeExtensions),
            ],
            options: {
                name: 'static/assets/[name].[hash:8].[ext]',
            },
        });
    }

    const moduleLoadingRules = [
        // disable non-standard language features
        { parser: { requireEnsure: false } },
    ];

    if (config.enableLinting) {
        const eslint = requireFromContext('eslint', config);

        // lint and format the input code
        moduleLoadingRules.push({
            // @ts-ignore
            test: config.testJSTranspileFileExtensions || defaultTestJSTranspileFileExtensions,
            enforce: 'pre',
            use: [
                {
                    options: {
                        cache: true,
                        formatter: resolveFromContext('react-dev-utils/eslintFormatter', config),
                        eslintPath: resolveFromContext('eslint', config),
                        ignore: true,
                        baseConfig: (() => {
                            const eslintCli = new eslint.CLIEngine();
                            let eslintConfig;
                            try {
                                eslintConfig = eslintCli.getConfigForFile(
                                    // TODO: Check if it needs to be resolved
                                    config.entryPoint,
                                );
                            } catch (e) {
                                console.error(e);
                                process.exit(1);
                            }
                            return eslintConfig;
                        })(),
                        // TODO: Check if subdirectory is fine
                        resolvePluginsRelativeTo: __dirname,
                        useEslintrc: false,
                    },
                    loader: resolveFromContext('eslint-loader', config),
                },
            ],
            include: getInputPath(config),
        });
    }

    moduleLoadingRules.push({
        // @ts-ignore
        // select one candidate which matches
        oneOf: transpilationRulesOneOf,
    });

    return moduleLoadingRules as Array<RuleSetRule>;
};
