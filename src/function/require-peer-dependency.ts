import { resolve } from 'path';
import { IBuildConfig } from './../interface/ibuild-config';
import { getContextPath } from './config-getters';

export const requirePeerDependency = (dependencyName: string, config: IBuildConfig) => {
    return require(resolve(getContextPath(config), 'node_modules', dependencyName));
}