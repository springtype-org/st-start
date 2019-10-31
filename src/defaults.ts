// --- PROJECT LAYOUT

export const defaultCustomConfigFileName = 'st.config.js';
export const defaultInputPath = 'src';
export const defaultOutputPath = 'dist';

// --- DEV SERVER

export const defaultDevServerProtocol = process.env.HTTPS === 'true' ? 'https' : 'http';
export const defaultDevServerHost = process.env.HOST || '0.0.0.0';
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

export const defaultTestJSTranspileFileExtensions = /(\.tsx?|\.js(x|m)?)$/;
export const defaultJSTranspileFileExcludes = /node_modules/;
export const defaultOutputFileNamePattern = '[name].[hash].js';
export const defaultModuleResolveFileExtensions = ['.tsx', '.ts', '.js', '.jsm', '.jsx'];

export const defaultBabelOptions = {
    presets: [
        '@babel/preset-env',
        [
            '@babel/preset-typescript',
            {
                jsxPragma: 'tsx',
            },
        ],
        [
            '@babel/preset-react',
            {
                pragma: 'tsx',
                pragmaFrag: 'tsx',
                throwIfNamespace: false,
            },
        ],
    ],
    plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        ['@babel/plugin-proposal-export-default-from'],
        '@babel/proposal-object-rest-spread',
        '@babel/plugin-transform-runtime',
        ['babel-plugin-minify-dead-code-elimination', { optimizeRawSize: true, keepFnName: true, keepClassName: true }],
    ],
};

// --- CSS, SASS/SCSS, PostCSS

export const defaultTestCSSTranspileFileExtensions = /\.(css|sass|scss)$/;
export const defaultCSSOutputFileNamePattern = '[name]-[local]-[hash:base64:5]';

// --- RAW FILE IMPORTS

export const defaultRawFileExtensions = /\.txt|\.svg$/i;

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

export const defaultBundleAnalyzerOptions = {
    analyzerMode: 'static',
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
        keep_classnames: true,
        keep_fnames: true,
        output: {
            comments: false,
        },
    },
};

export const defaultRuntimeChunkOptions: any = {
    name: 'runtime',
};

export const defaultSplitChunksOptions: any = {
    chunks: 'all',
};

// --- DEBUGGING

export const defaultDevTool = 'cheap-module-source-map';
export const defaultEnableSourceMapInProduction = true;
