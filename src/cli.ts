#!/usr/bin/env node

import chalk from 'chalk';
import * as commander from 'commander';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { defaultCustomConfigFileName } from './defaults';
import { log } from './function/log';
import { start } from './function/start';
import { IBuildConfig } from './interface/ibuild-config';
import { readStConfig } from './function/read-st-config';

const packageJson = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf8'));

const program = new commander.Command(packageJson.name)
    .version(packageJson.version)
    .option('-c, --config <configFileName>', 'target a specific config file instead of st.config.js')
    .option('-e, --env <env>', 'development (default) | production - overrides the NODE_ENV env varibale')
    .option('-p, --platform <platform>', 'browser (default) | nodejs - overrides the NODE_PLATFORM env varibale')
    .option('-w, --watch', 'runs in watch mode: watches for changes')
    .option('-i, --info', 'print environment debug info')
    .allowUnknownOption()
    .on('--help', () => {
        console.log();
        console.log(`    If you have any problems, do not hesitate to file an issue:`);
        console.log(`      ${chalk.cyan(packageJson.bugs.url)}`);
        console.log();
    });

(async () => {
    program.parse(process.argv);

    if (program.info) {
        console.log(chalk.bold('\nEnvironment Info:'));

        console.log(
            await require('envinfo').run(
                {
                    System: ['OS', 'CPU'],
                    Binaries: ['Node', 'npm', 'Yarn'],
                    Browsers: ['Chrome', 'Edge', 'Internet Explorer', 'Firefox', 'Safari'],
                    npmPackages: ['springtype'],
                    npmGlobalPackages: ['st-create'],
                },
                {
                    duplicates: true,
                    showNotFound: true,
                },
            ),
        );
    }


    const configFile: string = program.config
        ? resolve(program.config)
        : resolve(process.cwd(), defaultCustomConfigFileName);

    let runtimeConfiguration: IBuildConfig = {};


    // CLI parameters override .env settings

    if (program.platform) {
        if (program.platform === 'nodejs') {
            log('Enabling server mode: Frontend DevServer disabled. Babel runtime set to: nodejs');
            runtimeConfiguration.isNodeJsTarget = true;
        }
        process.env.NODE_PLATFORM = program.platform;
    }

    if (!!program.watch) {
        log('Enabling watch mode: Making sure DevServer or watch is running (depending on server mode, environment).');
        runtimeConfiguration.watchMode = true;
    }

    let configuration: IBuildConfig | Array<IBuildConfig> = {};
    if (existsSync(configFile)) {
        log(`Using local config file: ${configFile}`);

        if (configFile.indexOf('.js') > -1) {
            configuration = require(configFile) || {};
        } else if (configFile.indexOf('.ts') > -1) {
            configuration = await readStConfig(configFile) || {};
        }
    }

    if (program.env) {
        // apply --env or -e environment setting or fallback to shell environment variable
        runtimeConfiguration.env = program.env || process.env.NODE_ENV;
    }

    try {
        start(runtimeConfiguration, configuration);
    } catch (e) {
        log(`Fatal: Uncaught error: ${e.message}. Exiting.`, 'error');
    }
})();
