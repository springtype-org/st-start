import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const chalk = require('chalk');

export const getTsConfigPath = () => {

    if (!existsSync('tsconfig.json')) {
        writeFileSync('tsconfig.json', readFileSync(resolve(__dirname, '../tsconfig.json'), 'utf8'));
        console.log(chalk.yellow('! ') + chalk.gray('[stb]') + ':', 'Created local default tsconfig.json.');
    }
    return 'tsconfig.json';
}