
import { resolve } from 'path';
import { IBuildConfig } from './../interface/ibuild-config';
import { getContextPath } from './config-getters';
import { execute } from './execute';
import { getPeerDependencies } from './get-peer-dependencies';
import { getInstalledPeerDependencies } from './get-installed-peer-dependencies';

export const installPeerDependencies = (config: IBuildConfig) => {
    const expectedPeerDependencies = getPeerDependencies(config);
    const missingPeerDependencies = [];
    const installedDevDependencies = getInstalledPeerDependencies(config);

    for (let expectedDependency of expectedPeerDependencies) {

        const expectedDependencyParts = expectedDependency.split('@');
        const expectedVersion = expectedDependencyParts[1];
        const expectedPackageName = expectedDependencyParts[0];

        if (!installedDevDependencies[expectedPackageName] || installedDevDependencies[expectedPackageName] !== expectedVersion) {
            missingPeerDependencies.push(expectedDependency);
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
