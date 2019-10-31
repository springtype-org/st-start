import { RuleSetRule } from 'webpack';
import { defaultBabelOptions, defaultJSTranspileFileExcludes, defaultRawFileExtensions, defaultTestCSSTranspileFileExtensions, defaultTestJSTranspileFileExtensions } from '../defaults';
import { IBuildConfig } from './../interface/ibuild-config';
import { checkDependency } from './check-dependency';

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
                    loader: require.resolve('babel-loader'),
                    options: defaultBabelOptions,
                },
            ],
        },
        {
            test: config.testCSSTranspileFileExtensions || defaultTestCSSTranspileFileExtensions,
            use: styleLoadingRules,
        },
    ];

    if (config.enableRawFileImport && checkDependency('raw-loader')) {
        moduleLoadingRules.push({
            test: config.rawFileImportExt || defaultRawFileExtensions,
            use: [{
                loader: 'raw-loader'
            }],
        });
    }
    return moduleLoadingRules as Array<RuleSetRule>;
};
