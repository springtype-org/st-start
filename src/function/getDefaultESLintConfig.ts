import { existsSync } from 'fs';
import { IBuildConfig } from '../interface/ibuild-config';
import { getTsConfigPath } from './get-ts-config-path';

const chalk = require('chalk');
export const getDefaultESLintConfig = (config: IBuildConfig) => {
    let esLintConfigExists = existsSync('.eslintrc.js');

    return {

        eslint: config.eslint || true,
        watch: config.typeCheckPaths || 'src',
        tsconfig: getTsConfigPath(),
        eslintOptions: {
            configFile: esLintConfigExists ? '.eslintrc.js' : null
        },
        logger: {
            error(...args: Array<any>) {
                console.error(chalk.red('✖ ') + chalk.gray('[tck]') + ':', ...args);
            },
            warn(...args: Array<any>) {
                console.warn(chalk.yellow('✖ ') + chalk.gray('[tck]') + ':', ...args);
            },
            info(...args: Array<any>) {
                console.warn(chalk.blue('ℹ ') + chalk.gray('[tck]') + ':', ...args);
            }
        },
        formatter: 'codeframe'
    };
};
