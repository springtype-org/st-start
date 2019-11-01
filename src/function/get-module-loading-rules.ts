import { RuleSetRule } from 'webpack';
import { defaultJSTranspileFileExcludes, defaultRawFileExtensions, defaultTestCSSTranspileFileExtensions, defaultTestJSTranspileFileExtensions } from '../defaults';
import { IBuildConfig } from './../interface/ibuild-config';
import { requirePeerDependency } from './require-peer-dependency';

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
                            requirePeerDependency('@babel/preset-env', config),
                            [
                                requirePeerDependency('@babel/preset-typescript', config),
                                {
                                    jsxPragma: 'tsx',
                                },
                            ],
                            [
                                requirePeerDependency('@babel/preset-react', config),
                                {
                                    pragma: 'tsx',
                                    pragmaFrag: 'tsx',
                                    throwIfNamespace: false,
                                },
                            ],
                        ],
                        plugins: [
                            [requirePeerDependency('@babel/plugin-proposal-decorators', config), { legacy: true }],
                            [requirePeerDependency('@babel/plugin-proposal-class-properties', config), { loose: true }],
                            [requirePeerDependency('@babel/plugin-proposal-export-default-from', config)],
                            requirePeerDependency('@babel/plugin-proposal-object-rest-spread', config),
                            requirePeerDependency('@babel/plugin-transform-runtime', config),
                            [requirePeerDependency('babel-plugin-minify-dead-code-elimination', config), { optimizeRawSize: true, keepFnName: true, keepClassName: true }],
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
