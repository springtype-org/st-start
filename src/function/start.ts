import { IBuildConfig } from '../interface/ibuild-config';
import { enableDefaultFeatures } from './enable-default-features';
import { installPeerDependencies } from './install-peer-dependencies';
import { log } from './log';
import { startSingle } from './start-single';
import { defaultBundleEnvironment } from '../defaults';
import { readDotEnv } from './read-dot-env';

export const start = async (
    runtimeConfiguration: IBuildConfig,
    config: IBuildConfig | Array<IBuildConfig> = {},
    length?: number,
    taskNr?: number,
) => {
    return new Promise(async (resolve: Function, reject: Function) => {
        if (Array.isArray(config)) {
            try {
                for (let i = 0; i < config.length; i++) {
                    log(`Building target ${i + 1} / ${config.length}...`);
                    await start(runtimeConfiguration, config[i], config.length, i);
                }
                log('Done building all targets.');
                resolve();
            } catch (e) {
                reject(e);
            }
        } else {
            try {
                const configuration = {
                    ...config,
                    ...runtimeConfiguration,
                    // environment should be runtime env (argument provided by -e or --environment), st.config.ts env or default
                    env: runtimeConfiguration.env || config.env || defaultBundleEnvironment
                };

                log(`Setting environment: ${process.env.NODE_ENV}`);

                // set NODE_ENV based on config
                process.env.NODE_ENV = configuration.env;

                // read .env files
                readDotEnv();

                enableDefaultFeatures(configuration);

                log(`Installing missing peer dependencies (based on features enabled in configuration)...`);

                // make sure peer dependencies are installed locally
                installPeerDependencies(configuration);

                await startSingle(configuration, resolve, reject, taskNr);
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
