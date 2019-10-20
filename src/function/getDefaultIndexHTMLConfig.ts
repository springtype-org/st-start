import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { IBuildConfig } from "../interface/ibuild-config";

const chalk = require('chalk');

export const getDefaultIndexHTMLConfig = (config: IBuildConfig) => {

    const indexHTMLFilePath = config.indexHTMLTemplate || 'index.html';
    const indexHTMLTemplateExists = existsSync(indexHTMLFilePath);

    if (!indexHTMLTemplateExists) {
        writeFileSync(indexHTMLFilePath, readFileSync(resolve(__dirname, '../index.html'), 'utf8'));
        console.log(chalk.yellow('! ') + chalk.gray('[stb]') + ':', 'Created default index.html');
    }

    return {
        inject: config.indexHTMLInjectionType || 'body',
        title: config.indexHTMLTitle || '',
        template: indexHTMLTemplateExists ? config.indexHTMLTemplate : resolve(__dirname, '../index.html' /* path as dist built */),
        favicon: config.indexHTMLFavIcon || '',
        meta: config.indexHTMLMetaTags || {},
        templateParameters: config.indexHTMLParams || {},
        // dynamically imported as needed
        //excludeChunks: [ 'vendors.proxy-polyfill', 'vendors.whatwg-fetch' ]
    }
};