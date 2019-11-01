import { IBuildConfig } from './../interface/ibuild-config';
import { execute } from './execute';
import { getPeerDependencies } from './get-peer-dependencies';

export const installPeerDependencies = (config: IBuildConfig) => {

    const peerDependenciesToInstall = getPeerDependencies(config);

    // TODO: Cache

    // make sure yarn is installed locally
    execute('npm', ['i', 'yarn']);

    // install all required peer dependencies (filtered by features enabled)
    execute('yarn', ['add', ...peerDependenciesToInstall, '--dev']);
};