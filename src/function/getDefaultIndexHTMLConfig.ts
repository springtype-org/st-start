import { existsSync } from "fs";
import { resolve } from "path";
import { IBuildConfig } from "../interface/ibuild-config";

const chalk = require('chalk');

export const getDefaultIndexHTMLConfig = (config: IBuildConfig) => {

    const indexHTMLTemplateExists = existsSync(config.indexHTMLTemplate!);

    if (!indexHTMLTemplateExists) {
        console.log(chalk.yellow('! ') + chalk.gray('[stb]') + ':', 'No index.html template found, using default one.');
    }

    return {
        inject: config.indexHTMLInjectionType || 'body',
        title: config.indexHTMLTitle || '',
        template: indexHTMLTemplateExists ? config.indexHTMLTemplate : resolve(__dirname, '../index.html' /* path as dist built */),
        favicon: config.indexHTMLFavIcon || '',
        meta: config.indexHTMLMetaTags || {},
        templateParameters: config.indexHTMLParams || {}
    }
};