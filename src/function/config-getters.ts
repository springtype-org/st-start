import { resolve } from 'path';
import { defaultEnableSourceMapInProduction, defaultInputPath, defaultOutputPath, defaultBundleEnvironment } from '../defaults';
import { IBuildConfig } from './../interface/ibuild-config';
import { stringifyDefinitions } from './stringify-definitions';

export const getInputPath = (config: IBuildConfig): string => config.inputPath || defaultInputPath;

export const getOutputPath = (config: IBuildConfig): string => config.outputPath || defaultOutputPath;

export const getContextPath = (config: IBuildConfig): string => config.cwd || process.cwd();

export const getIndexTSDefaultPath = (config: IBuildConfig): string =>
    resolve(getContextPath(config), getInputPath(config), 'index.ts');
export const getIndexTSXDefaultPath = (config: IBuildConfig): string =>
    resolve(getContextPath(config), getInputPath(config), 'index.tsx');

export const getEnv = (): string => {
    return process.env.NODE_ENV as string || defaultBundleEnvironment;
};

export const getDefinitions = (config: IBuildConfig) => {
    const testEnvPrefix = /^ST_/i;
    const definitions: any = {
        PUBLIC_URL: config.publicUrl,
        NODE_ENV: process.env.NODE_ENV,
        NODE_PLATFORM: process.env.NODE_PLATFORM,
    };

    const filteredEnvironmentKeys = Object.keys(process.env).filter((key: string) => testEnvPrefix.test(key));

    for (let key of filteredEnvironmentKeys) {
        definitions[`process.env.${key}`] = process.env[key];
    }

    return {
        ...definitions,
        ...config.definitions,
    };
};

export const getContextNodeModulesPath = (config: IBuildConfig) => resolve(getContextPath(config), 'node_modules');

export const getDefinitionsStringified = (config: IBuildConfig) => {
    return stringifyDefinitions(getDefinitions(config));
};

export const isDevelopment = (): boolean => getEnv() === 'development';
export const isProduction = (): boolean => getEnv() === 'production';

export const getEnableSourceMaps = (config: IBuildConfig): boolean =>
    getEnv() === 'production' ? config.enableSourceMapInProduction || defaultEnableSourceMapInProduction : true;
