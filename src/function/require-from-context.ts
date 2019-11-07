import { IBuildConfig } from './../interface/ibuild-config';
import { getContextPath } from './config-getters';

const resolve = require('resolve');

export const resolveFromContext = (dependencyName: string, config: IBuildConfig) => {
    return resolve.sync(dependencyName, {
        basedir: getContextPath(config),
    });
};

export const requireFromContext = (dependencyName: string, config: IBuildConfig) => {
    return require(resolveFromContext(dependencyName, config));
};
