import { RuleSetRule } from 'webpack';
import { defaultJSTranspileFileExcludes, defaultRawFileExtensions, defaultTestCSSTranspileFileExtensions, defaultTestJSTranspileFileExtensions } from '../defaults';
import { IBuildConfig } from './../interface/ibuild-config';

export const getModuleLoadingRules = (
    config: IBuildConfig,
    styleLoadingRules: Array<RuleSetRule>,
): Array<RuleSetRule> => {
    const moduleLoadingRules = [
        {
            test: config.testJSTranspileFileExtensions || defaultTestJSTranspileFileExtensions,
            exclude: defaultJSTranspileFileExcludes,
            use: [
                {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            [
                                '@babel/preset-typescript',
                                {
                                    jsxPragma: 'tsx',
                                },
                            ],
                            [
                                '@babel/preset-react',
                                {
                                    pragma: 'tsx',
                                    pragmaFrag: 'tsx',
                                    throwIfNamespace: false,
                                },
                            ],
                        ],
                        plugins: [
                            ['@babel/plugin-proposal-decorators', { legacy: true }],
                            ['@babel/plugin-proposal-class-properties', { loose: true }],
                            ['@babel/plugin-proposal-export-default-from'],
                            '@babel/plugin-proposal-object-rest-spread',
                            '@babel/plugin-transform-runtime',
                            ['babel-plugin-minify-dead-code-elimination', { optimizeRawSize: true, keepFnName: true, keepClassName: true }],
                        ],
                    },
                },
            ],
        },
        {
            test: config.testCSSTranspileFileExtensions || defaultTestCSSTranspileFileExtensions,
            use: styleLoadingRules,
        },
    ];

    if (config.enableRawFileImport) {
        moduleLoadingRules.push({
            test: config.rawFileImportExt || defaultRawFileExtensions,
            use: [{
                loader: 'raw-loader'
            }],
        });
    }
    return moduleLoadingRules as Array<RuleSetRule>;
};
