import { resolve } from 'path';
import { defaultEnableSourceMapInProduction, defaultInputPath, defaultOutputPath } from '../defaults';
import { IBuildConfig } from '../interface/ibuild-config';

export const getPeerDependencyNotInstalledErrorMessage = (peerDependency: string): string => {
    return `Peer dependency '${peerDependency}' is not installed. Make sure to run: yarn add ${peerDependency}`;
};

export const getInputPath = (config: IBuildConfig): string => config.inputPath || defaultInputPath;

export const getOutputPath = (config: IBuildConfig): string => config.outputPath || defaultOutputPath;

export const getContextPath = (config: IBuildConfig): string => config.context || process.cwd();

export const getIndexTSDefaultPath = (config: IBuildConfig): string =>
    resolve(getContextPath(config), getInputPath(config), 'index.ts');
export const getIndexTSXDefaultPath = (config: IBuildConfig): string =>
    resolve(getContextPath(config), getInputPath(config), 'index.tsx');

export const getEnv = (config: IBuildConfig): 'development' | 'production' => {
    const env = config.env || process.env.NODE_ENV;

    return env === 'production' ? 'production' : 'development';
};

export const getEnableSourceMaps = (config: IBuildConfig): boolean =>
    getEnv(config) === 'production' ? config.enableSourceMapInProduction || defaultEnableSourceMapInProduction : true;
