import { IBuildConfig } from '../interface/ibuild-config';
import { enableDefaultFeatures } from './enable-default-features';
import { installPeerDependencies } from './install-peer-dependencies';
import { log } from './log';
import { startSingle } from './start-single';

export const start = async (
    runtimeConfiguration: IBuildConfig,
    config: IBuildConfig | Array<IBuildConfig> = {},
    length?: number,
) => {
    return new Promise(async (resolve: Function, reject: Function) => {
        if (Array.isArray(config)) {
            try {
                for (let i = 0; i < config.length; i++) {
                    log(`Building target ${i + 1} / ${config.length}...`);
                    await start(runtimeConfiguration, config[i], config.length);
                }
                log('Done building all targets.');
                resolve();
            } catch (e) {
                reject(e);
            }
        } else {
            try {
                const configuration = { ...config, ...runtimeConfiguration };
                enableDefaultFeatures(configuration);
                log(`Installing required peer dependencies...`);
                // make sure peer dependencies are installed locally
                installPeerDependencies(configuration);
                await startSingle(configuration, resolve, reject);
                if (!length) {
                    log('Done building target.');
                }
                resolve();
            } catch (e) {
                reject(e);
            }
        }
    });
};
