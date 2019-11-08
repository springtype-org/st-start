const babelHelperCreateClassFeaturesPlugin = require('@babel/helper-create-class-features-plugin');
const helperPluginUtils = require('@babel/helper-plugin-utils');
const pluginSyntaxDecorators = require('@babel/plugin-syntax-decorators');

import { legacyVisitor } from './transformer-legacy';

export default helperPluginUtils.declare((api: any, options: any) => {
    api.assertVersion(7);

    const { legacy = false } = options;
    if (typeof legacy !== 'boolean') {
        throw new Error("'legacy' must be a boolean.");
    }

    const { decoratorsBeforeExport } = options;
    if (decoratorsBeforeExport === undefined) {
        if (!legacy) {
            throw new Error(
                "The decorators plugin requires a 'decoratorsBeforeExport' option," +
                    ' whose value must be a boolean. If you want to use the legacy' +
                    " decorators semantics, you can set the 'legacy: true' option.",
            );
        }
    } else {
        if (legacy) {
            throw new Error("'decoratorsBeforeExport' can't be used with legacy decorators.");
        }
        if (typeof decoratorsBeforeExport !== 'boolean') {
            throw new Error("'decoratorsBeforeExport' must be a boolean.");
        }
    }

    if (legacy) {
        return {
            name: 'proposal-decorators',
            inherits: pluginSyntaxDecorators.default,
            manipulateOptions(opts: any) {
                const { generatorOpts } = opts;

                generatorOpts.decoratorsBeforeExport = decoratorsBeforeExport;
            },
            visitor: legacyVisitor,
        };
    }

    return babelHelperCreateClassFeaturesPlugin.createClassFeaturePlugin({
        name: 'proposal-decorators',

        feature: babelHelperCreateClassFeaturesPlugin.FEATURES.decorators,
        // loose: options.loose, Not supported
        manipulateOptions(opts: any) {
            const { generatorOpts, parserOpts } = opts;
            parserOpts.plugins.push(['decorators', { decoratorsBeforeExport }]);
            generatorOpts.decoratorsBeforeExport = decoratorsBeforeExport;
        },
    });
});
