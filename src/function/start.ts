import { IBuildConfig } from '../interface/ibuild-config';
import { log } from './log';
import { startSingle } from './start-single';

export const start = async (config: IBuildConfig | Array<IBuildConfig> = {}) => {
    return new Promise(async (resolve: Function, reject: Function) => {
        if (Array.isArray(config)) {
            try {
                for (let i = 0; i < config.length; i++) {
                    log(`Building target ${i + 1} / ${config.length}...`);

                    await startSingle(config[i], resolve, reject);
                }
                log('Done building all targets.');
                resolve();
            } catch (e) {
                reject(e);
            }
        } else {
            try {
                await startSingle(config, resolve, reject);
                log('Done building target.');
                resolve();
            } catch (e) {
                reject(e);
            }
        }
    });
};
