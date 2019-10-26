import { Configuration } from 'webpack';
import { host, port, protocol } from '../defaults';
import { IBuildConfig } from '../interface/ibuild-config';
import { getDefaultStatsConfig } from './getDefaultStatsConfig';
import { getDevelopmentConfig } from './getDevelopmentConfig';
import { getProductionConfig } from './getProductionConfig';

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

export const run = async (config: IBuildConfig, resolve: Function, reject: Function) => {

    const privateConfig =
        process.env.NODE_ENV === 'production'
            ? getProductionConfig(config as Configuration)
            : getDevelopmentConfig(config as Configuration);

    const compiler = webpack(privateConfig);

    const handler = (err: any, stats: any) => {
        if (err || stats.hasErrors()) {
            reject(err || stats.toJson('minimal'));
        } else {
            resolve();
        }
    };

    if (process.env.NODE_ENV === 'development') {
        const server = new WebpackDevServer(compiler, {
            publicPath: privateConfig!.output!.publicPath,
            compress: true, // gzip resources
            hot: true, // HMR
            inline: true,
            port: config.port || port,
            quiet: true,
            clientLogLevel: 'none',
            proxy: config.proxy,
            // allowing to set a custom
            public: config.public,
            // allowing for custom domains
            disableHostCheck: config.proxy || process.env.DANGEROUSLY_DISABLE_HOST_CHECK === 'true',
            contentBase: config.assetsPath || process.cwd(),
            // also watch for changes in the assets path
            watchContentBase: true,
            // show errors in browser view
            overlay: false,
            historyApiFallback: {
                disableDotRule: true,
            },
            // Enable HTTPS if the HTTPS environment variable is set to 'true'
            https: protocol === 'http' ? false : true,
            host,
            stats: getDefaultStatsConfig(),
        });

        server.listen(config.port || port, host, (err: any) => {
            if (err) {
                reject(err);
            }
        });
    } else {
        // production mode
        compiler.run(handler);
    }
};

export const start = async (config: IBuildConfig | Array<IBuildConfig> = {}) => {
    return new Promise(async (resolve: Function, reject: Function) => {
        if (Array.isArray(config)) {
            try {
                console.log('[stb] Provided multiple configurations, building...');
                for (let i = 0; i < config.length; i++) {
                    console.log('[stb] ', i + 1, '/', config.length, '...');
                    await run(config[i], resolve, reject);
                }
                resolve();
            } catch (e) {
                reject(e);
            }
        } else {
            await run(config, resolve, reject);
        }
        console.log('[stb] Done building.');
    });
};
