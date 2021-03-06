import { relative, resolve } from 'path';
import webpack, { Configuration } from 'webpack';
import { defaultChunkOutputFileNamePattern, defaultDevelopmentDevTool, defaultModuleResolveFileExtensions, defaultOutputFileNamePattern, defaultProductionDevTool, defaultPublicPath, defaultStatsConfig } from '../defaults';
import { IBuildConfig } from '../interface/ibuild-config';
import { defaultInputPath } from './../defaults';
import { getContextNodeModulesPath, getContextPath, getDefinitionsStringified, getOutputPath, isDevelopment, isProduction } from './config-getters';
import { getEntryPointFilePath } from './get-entrypoint-filepath';
import { getLegacyDecoratorInject } from './get-legacy-decorator-inject';
import { getModuleLoadingRules } from './get-module-loading-rules';
import { getBundlePlatform } from './get-bundle-platform';
import { log } from './log';
import { notifyOnError } from './notify-on-error';
import { requireFromContext } from './require-from-context';
import { BundlePlatform } from '../interface/bundle-platform';
import { getWebpackMode } from './get-webpack-mode';

export const getBaseConfig = (config: IBuildConfig): Configuration => {
    const webpackConfig: Partial<Configuration> = {};

    if (config.isNodeJsTarget) {
        process.env.NODE_PLATFORM = <BundlePlatform>'nodejs';
    }

    const platform = getBundlePlatform();
    webpackConfig.mode = getWebpackMode(config);
    webpackConfig.context = getContextPath(config);
    webpackConfig.watch = !!config.watchMode;

    if (platform === 'nodejs') {
        webpackConfig.target = 'node';
    }

    const entryPointFile = getEntryPointFilePath(config);
    webpackConfig.bail = isProduction();

    log(`Entrypoint file is: ${entryPointFile}`);

    // also add styles to the process chain
    webpackConfig.entry = {
        main: [entryPointFile]
    };
    let fileName = config.outputFileNamePattern || defaultOutputFileNamePattern;
    let outputPath = config.outputPath ? resolve(config.outputPath) : resolve(webpackConfig.context, getOutputPath(config));
    let chunkFileName = config.outputChunkFileNamePattern || defaultChunkOutputFileNamePattern;

    if (config.singleFileOutput) {
        // override by single file output name
        fileName = config.singleFileOutput;
        outputPath = getContextPath(config);
        // chunkFileName is not set here, because chunking is disabled in singleFileOutput mode
    }

    log(`Output path is: ${outputPath}`);

    webpackConfig.output = {
        pathinfo: isDevelopment(),
        futureEmitAssets: true,
        devtoolModuleFilenameTemplate: isProduction()
            ? info => relative(config.inputPath || defaultInputPath, info.absoluteResourcePath).replace(/\\/g, '/')
            : info => resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
        chunkFilename: chunkFileName,
        path: outputPath,
        filename: fileName,
        globalObject: 'this', // web-worker and node support
        publicPath: config.publicPath || defaultPublicPath,
    };

    const basePlugins = [];

    if (platform !== 'nodejs') {
        // replaces process.env.$key = $val in code
        basePlugins.push(new webpack.DefinePlugin(getDefinitionsStringified(config)));
    }

    basePlugins.push(getLegacyDecoratorInject());

    webpackConfig.plugins = basePlugins;

    if (config.ignoreFilePattern && config.ignoreFileContextPattern) {
        webpackConfig.plugins.push(new webpack.IgnorePlugin(config.ignoreFilePattern, config.ignoreFileContextPattern));
    }

    if (config.enableDesktopNotifications) {
        webpackConfig.plugins.push(
            // beautiful console error reporting
            new (require('friendly-errors-webpack-plugin'))({
                onErrors: (severity: string, errors: Array<any>) => notifyOnError(severity, errors, config),
            }),
        );
    }

    if (config.enableTypeScriptTypeChecking) {
        const ForkTsCheckerWebpackPlugin = requireFromContext('react-dev-utils/ForkTsCheckerWebpackPlugin', config);
        const typescriptFormatter = requireFromContext('react-dev-utils/typescriptFormatter', config);

        new ForkTsCheckerWebpackPlugin({
            typescript: requireFromContext('typescript', config),
            async: isDevelopment(),
            useTypescriptIncrementalApi: true,
            checkSyntacticErrors: true,
            resolveModuleNameModule: (<any>process.versions).pnp ? `${__dirname}/pnp-resolve.js` : undefined,
            resolveTypeReferenceDirectiveModule: (<any>process.versions).pnp
                ? `${__dirname}/pnp-resolve.js`
                : undefined,
            // TODO: Check if path needs to be resolved
            tsconfig: config.typeScriptTypeCheckingConfig,
            reportFiles: [
                '**',
                '!**/__tests__/**',
                '!**/?(*.)(spec|test).*',
                '!**/src/setupProxy.*',
                '!**/src/setupTests.*',
            ],
            silent: true,
            formatter: isProduction() ? typescriptFormatter : undefined,
        });
    }

    const resolvePlugins = [];
    const resolveLoaderPlugins = [];

    if (config.enableYarnPnp) {
        // yarn's ultra-fast pnp module resolution
        const PnpWebpackPlugin = requireFromContext('pnp-webpack-plugin', config);

        // enable yarn plug & play (pnp) support to discover webpack plugins
        resolvePlugins.push(PnpWebpackPlugin);
        resolveLoaderPlugins.push(PnpWebpackPlugin.moduleLoader(module));
    }

    webpackConfig.resolve = {
        modules: ['node_modules', getContextNodeModulesPath(config)],
        extensions: config.moduleResolutionFileExtensions || defaultModuleResolveFileExtensions,
        plugins: resolvePlugins,
    };

    webpackConfig.resolveLoader = {
        modules: ['node_modules', resolve(__dirname, '..', 'loaders')],
        plugins: resolveLoaderPlugins,
    };

    webpackConfig.devtool = config.devTool || isProduction() ? defaultProductionDevTool : defaultDevelopmentDevTool;

    webpackConfig.stats = defaultStatsConfig;

    webpackConfig.module = {
        strictExportPresence: true,
        rules: getModuleLoadingRules(config),
    };

    if (platform === 'browser') {
        webpackConfig.node = {
            module: 'empty',
            dgram: 'empty',
            dns: 'mock',
            fs: 'empty',
            http2: 'empty',
            net: 'empty',
            tls: 'empty',
            child_process: 'empty',
        };
    }

    if (platform === 'nodejs') {
        // provide no polyfills nor mocks at all
        webpackConfig.node = false;
    }

    // no performance reporting, we're using BundleAnalyzer
    webpackConfig.performance = false;

    return webpackConfig;
};
