import { existsSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { defaultIndexHTMLFavIcon, defaultIndexHTMLFileName, defaultIndexHTMLInjectionType, defaultIndexHTMLMetaTags, defaultIndexHTMLTemplateParameters, defaultIndexHTMLTitle } from '../defaults';
import { IBuildConfig } from '../interface/ibuild-config';
import { getInputPath, getContextPath } from './config-getters';
import { log } from './log';

export const getDefaultIndexHTMLConfig = (config: IBuildConfig) => {

    let indexHTMLFilePath;
    let contextPath = getContextPath(config);

    if (config.indexHTMLTemplate) {
        indexHTMLFilePath = resolve(
            contextPath,
            config.indexHTMLTemplate,
        );
    } else {
        indexHTMLFilePath = resolve(
            contextPath,
            getInputPath(config),
            defaultIndexHTMLFileName,
        );
    }

    const indexHTMLTemplateExists = existsSync(indexHTMLFilePath);

    if (!indexHTMLTemplateExists && !config.isNodeJsTarget) {
        writeFileSync(indexHTMLFilePath, readFileSync(resolve(__dirname, '..', 'index.html'), 'utf8'));
        log('Created default index.html file because it did not exist yet.');
    }

    return {
        inject: config.indexHTMLInjectionType || defaultIndexHTMLInjectionType,
        title: config.indexHTMLTitle || defaultIndexHTMLTitle,
        template: indexHTMLFilePath,
        favicon: config.indexHTMLFavIcon || defaultIndexHTMLFavIcon,
        meta: config.indexHTMLMetaTags || defaultIndexHTMLMetaTags,
        templateParameters: config.indexHTMLParams || defaultIndexHTMLTemplateParameters,
    };
};
