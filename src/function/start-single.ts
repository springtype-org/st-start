import { existsSync } from 'fs';
import { defaultDevServerHost, defaultDevServerOptions, defaultDevServerPort } from '../defaults';
import { IBuildConfig } from '../interface/ibuild-config';
import { getEnv } from './config-getters';
import { getDevelopmentConfig } from './get-development-config';
import { getEntryPointFilePath } from './get-entrypoint-filepath';
import { getProductionConfig } from './get-production-config';
import { log } from './log';
import { requireFromContext } from './require-from-context';

export const startSingle = async (
    config: IBuildConfig,
    resolve: Function,
    reject: Function,
    taskNr?: number,
): Promise<void> => {
    const webpackConfig = getEnv() === 'production' ? getProductionConfig(config) : getDevelopmentConfig(config);
    const webpack = requireFromContext('webpack', config)(webpackConfig);
    const devServerAlreadyRunning = typeof taskNr !== 'undefined' && taskNr !== 0;
    const entryPointFile = getEntryPointFilePath(config);

    if (!existsSync(entryPointFile)) {
        log(`Entry point file: ${entryPointFile} does not exist. Skipping.`, 'error');
        return;
    }

    if (getEnv() === 'development' && !config.isNodeJsTarget && !devServerAlreadyRunning) {
        log('Entering DevServer watch mode...');

        const devServer = new (requireFromContext('webpack-dev-server', config))(webpack, {
            ...defaultDevServerOptions,
            publicPath: webpackConfig!.output!.publicPath,
            port: config.port || defaultDevServerPort,
            proxy: config.proxy,
            public: config.publicUrl,
            disableHostCheck: config.proxy || process.env.DANGEROUSLY_DISABLE_HOST_CHECK === 'true',
            contentBase: config.assetsPath || webpackConfig.context,
            stats: webpackConfig.stats,
        });

        devServer.listen(config.port || defaultDevServerPort, config.host || defaultDevServerHost);
    } else {
        if (devServerAlreadyRunning) {
            log(
                'DevServer has been started already. Falling back to default build mode (first come, first serve).',
                'warning',
            );
        }

        webpack.run((err: any, stats: any) => {
            if (err || stats.hasErrors()) {
                reject(err || stats.toJson('minimal'));
            } else {
                resolve();
            }
        });
    }
};
