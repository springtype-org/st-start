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
    return postCSSPlugins;
}