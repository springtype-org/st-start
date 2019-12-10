import { Environment } from './environment';

export interface IBuildConfig {

    // --- RUNTIME

    // overrides process.env.NODE_ENV
    env?: Environment; // default: 'development'

    // builds for the Node.js runtime environment, disables DevServer, etc.
    isNodeJsTarget?: boolean; // default: false

    // makes sure DevServer or watch is running (depending on server mode, environment)
    watchMode?: boolean; // default: false

    // --- PROJECT LAYOUT

    // entrypoint file, auto-generated as $outputPath/index.tsx if not existing
    // e.g. "src/alt-index.ts"
    entryPoint?: string; // default: $outputPath/index.ts or $outputPath/index.tsx, wether it exists

    // where to read the sources from
    inputPath?: string; // default: 'src'

    // where to write the bundling results to
    outputPath?: string; // default: 'dist'

    // generates a service worker script for offline (PWA) support
    // it pre-caches the HTML and static files (js, images etc.)
    // that are part of the bundle and keeps them up-to-date
    // only applied in production mode
    enableServiceWorkerScript?: boolean; // default: false

    // configures the build system for single file output, explicitly using the name provided
    // Disables chunking and transpiles the entryPoint directly to the path defined
    // e.g. "dist/background.js"
    singleFileOutput?: string; // default: undefined

    // context directory location of the project ("In which folder to operate?")
    // i.e. this folder may contain the "src" folder
    cwd?: string; // default: process.cwd()

    // files to ignore in the process of bundling
    // e.g. /^\.\/locale$/
    ignoreFilePattern?: RegExp; // default: undefined

    // in which module folder(s) to ignore files in e.g. /moment$/
    ignoreFileContextPattern?: RegExp; // default: undefined

    // activates yarn Plug'n'Play module resolution
    enableYarnPnp?: boolean; // default: false

    // --- TS/TSX TO JS TRANSPILATION

    // enables writing out type information to reflect the types at runtime
    // using https://github.com/leonardfactory/babel-plugin-transform-typescript-metadata
    enableReflectMetadata?: boolean;

    // enables eslint linting and auto-formatting. Requires a .eslintrc.js file to be existing
    // somewhere in the project path
    enableLinting?: boolean; // default: false

    // checks the code for TypeScript typing errors
    enableTypeScriptTypeChecking?: boolean; // default: false

    // path to the "tsconfig.json" file if enableTypeScriptTypeChecking is set
    typeScriptTypeCheckingConfig?: string; // default: undefined

    // pattern to match for files to transpile
    testJSTranspileFileExtensions?: RegExp; // default: /(\.tsx?|\.js(x|m)?)$/

    // output file name patterns
    outputFileNamePattern?: string; // default: static/js/[name].[contenthash:8].js
    outputChunkFileNamePattern?: string; // default: static/js/[name].[contenthash:8].chunk.js

    // list of file extensions to consider for module resolution (import/require dependencies)
    moduleResolutionFileExtensions?: Array<string>; // default: ['.tsx', '.ts', '.js', '.jsm', '.jsx']

    // definitions to pass to the code built
    // can be used for feature flags, service URLs etc.
    definitions?: {
        [key: string]: any;
    }; // default: { 'process.env.NODE_ENV': JSON.stringify(config.env || process.env.NODE_ENV) }

    // --- INDEX HTML

    // path for public relative imports
    publicPath?: string; // default: /

    // path to index.html template file. If not existing, it will be auto-generated.
    // Can be an ejs template too.
    indexHTMLTemplate?: string; // default: index.html

    // title of index.html
    indexHTMLTitle?: string; // default: ''

    // defines how the scripts and styles should be injected
    indexHTMLInjectionType?: 'head' | 'body' | false; // default: 'body'

    // favicon for the index.html template
    indexHTMLFavIcon?: string; // default: ''

    // meta tags like: { viewport: 'initial-scale=1' }
    indexHTMLMetaTags?: {
        [name: string]: string;
    }; // default: {}

    // used to render values in index.html dynamically, e.g { foo: 'abc' }
    // to apply them, use this syntax: <%= foo %> in the index.html template.
    indexHTMLParams?: {
        [name: string]: any;
    }; // default: {}

    // --- DEV SERVER, LIVE RELOAD, HOT MODULE REPLACEMENT (MHR)

    // default path the devServer tries to load assets from
    assetsPath?: string; // default: ''

    // DevServer host
    host?: string; // default: 'localhost'

    // DevServer listening port
    port?: number; // default: 4444

    // tells the server, where it runs, like: myapp.test:80
    publicUrl?: string; // default: window.location

    // allows to configure API proxying, e.g. { '/api': 'http://localhost:3000' }
    proxy?: {
        [apiEndpointUrl: string]: string;
    }; // default: {}

    // --- IMAGE INLINING

    // reads the images from disk and inlines them in a JavaScript bundle so you
    // can import them as import * as meme from "./meme.gif"; ...; <img src={meme} />
    // because they are imported as a base64 data URL
    enableImageInlining?: boolean; // default: false

    // specifies the image file extensions to inline
    inlineImageExtensions?: Array<RegExp>; // default: [/\.gif$/i, /\.jpe?g$/i, /\.png$/i]

    // maximum size of image that is suitable for data URL inlining
    // caution: inlining can hugely increase JS output bundle size
    inlineImageMaxFileSize?: number; // default: 10 (KiB)

    // --- RAW FILE IMPORTS

    // allows for raw file imports like: import * as vertexShader from "../assets/shader.vert";
    // necessary for i18n JSON file loading support
    enableRawFileImport?: boolean; // default: true

    // file extensions to NOT recognize as raw files imports, so they get processed well by
    // other loaders internally. All file extensions of testJSTranspileFileExtensions are excluded as well.
    // File extensions that aren't excluded are file-loaded.
    rawFileImportExtensionTest?: RegExp; // default: /\.(txt|vert|frag)$/i

    // --- STYLING, CSS, SASS/SCSS, PostCSS SUPPORT

    // a list of CSS, SASS/SCSS, PostCSS files to process statically and
    // write out to the output path: e.g. src/input.global.scss -> dist/my-output.css
    // transformations apply according to the rest of the configuration (enableSass, ...)
    staticStyleEntryPoints?: {
        [inputPath: string]: string; // input path -> output path
    };

    // paths to look for e.g. SASS/SCSS files to resolve for @import statements
    staticStyleResolvePaths?: Array<string>; // default: ['node_modules']

    // imported as CSS modules (with scoping)
    testCSSTranspileFileExtensions?: RegExp; // default: /\.tss\.(css|sass|scss)$/i

    // matches for global scope CSS/SASS/SCSS/PostCSS that is not imported as CSS modules
    testCSSGlobalTranspileFileExtensions?: RegExp; // default: /\.(css|sass|scss)$/i

    // allows to configure the way, CSS output files are stored
    cssOutputFileNamePattern?: string; // default: '[name]-[local]-[hash:base64:5]'

    // runs node-sass trnasformations on CSS and SASS/SCSS files.
    // allows to use nesting, mixins etc.
    enableSass?: boolean; // default: true

    // runs PostCSS transformations on CSS and SASS/SCSS files.
    // Allows you to use modern CSS features in your code today
    enablePostCSS?: boolean; // default: true

    // automatically vender-prefixes CSS properties for broader support in older browser versions
    // e.g.: animation-start becomes --ms-animation-start
    enablePostCSSAutoPrefixing?: boolean; // default: true

    // activates lostgrid.org support for CSS, SASS/SCSS and PostCSS files
    enablePostCSSLostGrid?: boolean; // default: true

    // generates .d.ts files for each CSS/SASS/SCSS file you import
    // this allows selector names to be auto-completed for imported CSS modules
    enableCssImportTypeDeclaration?: boolean; // default: true

    // --- PWA SUPPORT

    // generates a .manifest file for offline caching in PWA's
    enableManifestGeneration?: boolean; // default: false

    // --- PRODUCTION OPTIMIZATIONS

    // writes out .gz files next to each asset in $outputPath
    // useful for fast file delivery by servers
    enableGzipCompression?: boolean; // default: true

    // writes out .br files next to each asset in $outputPath
    // useful for fast file delivery by servers
    enableBrotliCompression?: boolean; // default: false

    // analyzes the bundled code for size and chunks.
    // generates a graph chart in $outputPath/graph.html and opens it automatically
    enableBundleAnalyzer?: boolean; // default: true

    // enables / disables the auto-opening of the report
    bundleAnalyzerAutoOpen?: boolean; // default: true

    // filename or even relative path
    bundleAnalyzerReportFile?: string; // default: report.html

    // runtime chunk files can be inlined in the index.html instead of being
    // loaded externally
    inlineRuntimeChunks?: boolean; // default: true

    // --- DEBUGGING

    // allows you to debug CSS and TypeScript sources even in production
    // not helpful if you'd like to protect your source code from the eyes of competitors
    enableSourceMapInProduction?: boolean; // default: true

    // sets the type of source mapping technique
    devTool?:
        | 'eval'
        | 'inline-source-map'
        | 'cheap-eval-source-map'
        | 'cheap-source-map'
        | 'cheap-module-eval-source-map'
        | 'cheap-module-source-map'
        | 'eval-source-map'
        | 'source-map'
        | 'nosources-source-map'
        | 'hidden-source-map'
        | 'nosources-source-map'
        | 'inline-cheap-source-map'
        | 'inline-cheap-module-source-map'; // default: 'cheap-module-source-map'

    // enables desktop notifications when errors happen while compilation
    enableDesktopNotifications?: boolean; // default: true
}
