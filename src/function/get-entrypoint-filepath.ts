import { existsSync } from 'fs';
import { resolve } from 'path';
import { IBuildConfig } from './../interface/ibuild-config';
import { getIndexTSDefaultPath, getIndexTSXDefaultPath } from './config-getters';

export const getEntryPointFilePath = (config: IBuildConfig): string => {
    const indexTSXDefaultPath = getIndexTSXDefaultPath(config);
    const indexTSDefaultPath = getIndexTSDefaultPath(config);
    const defaultIndexTSXExists = existsSync(indexTSXDefaultPath);

    let entryPointFile = indexTSDefaultPath;

    if (defaultIndexTSXExists) {
        entryPointFile = indexTSXDefaultPath;
    }

    if (config.entryPoint) {
        entryPointFile = resolve(config.entryPoint);
    }
    return entryPointFile;
};
