import { existsSync } from 'fs';
import { defaultDevServerHost, defaultDevServerOptions, defaultDevServerPort } from '../defaults';
import { IBuildConfig } from '../interface/ibuild-config';
import { getEnv } from './config-getters';
import { getDevelopmentConfig } from './get-development-config';
import { getEntryPointFilePath } from './get-entrypoint-filepath';
import { getProductionConfig } from './get-production-config';
import { log } from './log';
import { requireFromContext } from './require-from-context';
import { transformStaticStyleFiles } from './transform-static-style-files';
import { getWebpackMode } from './get-webpack-mode';

export const startSingle = async (
    config: IBuildConfig,
    resolve: Function,
    reject: Function,
    taskNr?: number,
): Promise<void> => {

    // make sure to set environment based on NODE_ENV
    config.env = config.env || getEnv();

    const webpackMode = getWebpackMode(config);

    log(`Setting environment for bundling (webpack mode): ${webpackMode}`);

    const webpackConfig = webpackMode === 'production' ? getProductionConfig(config) : getDevelopmentConfig(config);
    const webpack = requireFromContext('webpack', config)(webpackConfig);
    const devServerAlreadyRunning = typeof taskNr !== 'undefined' && taskNr !== 0;
    const entryPointFile = getEntryPointFilePath(config);

    const startDevServer = () => {
        if (devServerAlreadyRunning) {
            log(
                'DevServer has been started already. Falling back to default build mode (first come, first serve).',
                'warning',
            );
        }

        const port = config.port || defaultDevServerPort;
        const devServer = new (requireFromContext('webpack-dev-server', config))(webpack, {
            ...defaultDevServerOptions,
            publicPath: webpackConfig!.output!.publicPath,
            port,
            proxy: config.proxy,
            public: `http://localhost:${port}`,
            disableHostCheck: !!config.proxy || process.env.DANGEROUSLY_DISABLE_HOST_CHECK === 'true',
            contentBase: config.assetsPath || webpackConfig.context,
            stats: webpackConfig.stats,
        });

        devServer.listen(config.port || defaultDevServerPort, config.host || defaultDevServerHost);
    }

    // 1. static style transformation
    await transformStaticStyleFiles(config);

    // 2. TS/JS transformation
    if (!existsSync(entryPointFile)) {
        log(`Entry point file: ${entryPointFile} does not exist. Skipping.`, 'error');
        return;
    }

    if (webpackMode === 'development' && !config.isNodeJsTarget &&
        !devServerAlreadyRunning && config.watchMode !== false) {
        log('Entering DevServer watch mode...');

        startDevServer();
    } else {

        webpack.run((err: any, stats: any) => {
            if (err || stats.hasErrors()) {
                reject(err || stats.toJson('minimal'));
            } else {
                resolve();
            }
        });
    }
};
