import { IBuildConfig } from './../interface/ibuild-config';
import { requireFromContext } from './require-from-context';
export const getPostCssConfig = (config: IBuildConfig): Array<any> => {
    const postCSSEnvPresetOptions: any = {
        stage: 3, // TODO: config!
    };

    if (config.enablePostCSSAutoPrefixing) {
        postCSSEnvPresetOptions.autoprefixer = {
            // TODO: config?
            flexbox: 'no-2009',
        };
    }

    const postCSSPlugins: Array<any> = config.postCSSPlugins || [];

    if (config.enablePostCSS) {
        // TODO: might use postcss-import too? https://github.com/postcss/postcss-import 
        // Beware of import paths then (node_modules) etc.
        postCSSPlugins.push(requireFromContext('postcss-flexbugs-fixes', config));
        postCSSPlugins.push(requireFromContext('postcss-preset-env', config)(postCSSEnvPresetOptions));
        postCSSPlugins.push(requireFromContext('postcss-nested', config));
        postCSSPlugins.push(requireFromContext('postcss-normalize', config));
    }

    if (config.enablePostCSSLostGrid) {
        postCSSPlugins.push(requireFromContext('lost', config));
    }
    return postCSSPlugins;
}