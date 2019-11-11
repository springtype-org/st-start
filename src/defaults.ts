import { Environment } from './interface/environment';

// --- RUNTIME
export const defaultRuntimeEnvironment: Environment = 'development';

// --- PROJECT LAYOUT

export const defaultCustomConfigFileName = 'st.config.js';
export const defaultInputPath = 'src';
export const defaultOutputPath = 'dist';

// --- DEV SERVER

export const defaultDevServerProtocol = process.env.HTTPS === 'true' ? 'https' : 'http';
export const defaultDevServerHost = process.env.HOST || 'localhost';
export const defaultDevServerPort = process.env.PORT || '4444';

export const defaultDevServerOptions = {
    compress: true,
    hot: true,
    inline: true,
    quiet: true,
    clientLogLevel: 'none',
    // also watch for changes in the assets path
    watchContentBase: true,
    overlay: false,
    historyApiFallback: {
        disableDotRule: true,
    },
    host: defaultDevServerHost,
    // Enable HTTPS if the HTTPS environment variable is set to 'true'
    https: defaultDevServerProtocol === 'http' ? false : true,
};

// --- INDEX HTML

export const defaultIndexHTMLFileName = 'index.html';
export const defaultPublicPath = '';
export const defaultIndexHTMLInjectionType = 'body';
export const defaultIndexHTMLTitle = '';
export const defaultIndexHTMLFavIcon = '';
export const defaultIndexHTMLMetaTags = {};
export const defaultIndexHTMLTemplateParameters = {};

// --- TS/TSX TO JS TRANSPILATION

export const defaultTestJSTranspileFileExtensions = /(\.tsx?|\.js(x|m)?)$/i;
export const defaultJSTranspileFileExcludes = /node_modules/;
export const defaultOutputFileNamePattern = 'static/js/[name].[contenthash:8].js';
export const defaultChunkOutputFileNamePattern = 'static/js/[name].[contenthash:8].chunk.js';
export const defaultModuleResolveFileExtensions = ['.tsx', '.ts', '.js', '.mjs', '.jsx'];
export const defaultIgnoreFilePatterns = [];
export const defaultJSXPragma = 'tsx';
export const defaultCoreJsVersion = 3;

// --- IMAGE INLINING

export const defaultInlineImageExtensions = [/\.gif$/i, /\.jpe?g$/i, /\.png$/i];
export const defaultInlineMaxFileSize = 10; // KiB

// --- CSS, SASS/SCSS, PostCSS

export const defaultTestCSSTranspileFileExtensions = /\.tss\.(css|sass|scss)$/i;
export const defaultTestGlobalCSSTranspileFileExtensions = /\.(css|sass|scss)$/i;
export const defaultCSSOutputFileNamePattern = '[name]-[local]-[hash:base64:5]';

// --- RAW FILE IMPORTS

export const defaultRawFileImportLoaderExtensions = /\.(txt|vert|frag)$/i;

// --- FILE LOADER

export const defaultRawFileExcludeExtensions = [/\.json$/i, /\.html$/i];

// --- DIAGNOSTIC MESSAGES IN TERMINAL

export const defaultStatsConfig = {
    assets: true,
    assetsSort: '!size',
    builtAt: true,
    cached: true,
    cachedAssets: true,
    entrypoints: true,
    env: true,
    children: false,
    maxModules: 0,
    colors: true,
};

// --- PRODUCTION OPTIMIZATIONS

export const defaultGzipCompressionOptions = { test: /\.js(\.map)?$/i };

export const defaultBrotliCompressionOptions = {
    asset: '[path].br[query]',
    test: /\.js(\.map)?$/i,
    threshold: 20,
    minRatio: 0.8,
    mode: 1,
};

export const defaultInlineRuntimeChunks = true;

export const defaultBundleAnalyzerOptions = {
    analyzerMode: 'static',
    reportFilename: 'report.html',
    openAnalyzer: true,
};

export const defaultMinifyOptions = {
    removeComments: true,
    collapseWhitespace: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    removeEmptyAttributes: true,
    removeStyleLinkTypeAttributes: true,
    keepClosingSlash: true,
    minifyJS: true,
    minifyCSS: true,
    minifyURLs: true,
};

export const defaultTerserOptions = {
    cache: true,
    parallel: true,
    terserOptions: {
        parse: {
            ecma: 8,
        },
        compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
        },
        mangle: {
            safari10: true,
        },
        keep_classnames: true,
        keep_fnames: true,
        output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
        },
    },
};

export const defaultRuntimeChunkOptions: any = {
    name: (entrypoint: any) => `runtime-${entrypoint.name}`,
};

export const defaultSplitChunksOptions: any = {
    chunks: 'all',
    name: false,
};

// --- DEBUGGING

export const defaultDevelopmentDevTool = 'eval-source-map';
export const defaultProductionDevTool = 'source-map';
export const defaultEnableSourceMapInProduction = true;
