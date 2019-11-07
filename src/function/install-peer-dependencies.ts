import { readFileSync } from 'fs';
import { resolve } from 'path';
import { IBuildConfig } from './../interface/ibuild-config';
import { getContextPath } from './config-getters';
import { execute } from './execute';
import { getPeerDependencies } from './get-peer-dependencies';

export const installPeerDependencies = (config: IBuildConfig) => {
    const peerDependencies = getPeerDependencies(config);
    const missingPeerDependencies = [];
    const devDependencies =
        JSON.parse(readFileSync(resolve(getContextPath(config), 'package.json'), 'utf8')).devDependencies || {};

    for (let dependency of peerDependencies) {
        if (!devDependencies[dependency.split('@^')[0]]) {
            missingPeerDependencies.push(dependency);
        }
    }

    const yarnVersion = execute('npm', ['info', 'yarn', 'version']).trim();

    if (yarnVersion.indexOf('npm') === 0) {
        execute('npm', ['install', '-g', 'yarn']);
    }

    if (missingPeerDependencies.length) {
        // install all required peer dependencies (filtered by features enabled)
        execute('yarn', ['add', ...missingPeerDependencies, '--dev', '--cwd', resolve(getContextPath(config))]);
    }
};
