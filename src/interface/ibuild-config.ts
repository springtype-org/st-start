export interface IBuildConfig {


    // --- RUNTIME

    // overrides process.env.NODE_ENV
    env?: 'production' | 'development';

    // disables the frontend DevServer (only watch mode enabled) 
    serverMode?: boolean;

    // makes sure DevServer or watch is running (depending on server mode, environment)
    watchMode?: boolean;
    

    // --- PROJECT LAYOUT

    // path to look for sources
    inputPath?: string; // default: 'src'

    // output path
    outputPath?: string; // default: 'dist'

    // context directory location of the project ("In which folder to operate?")
    context?: string; // default: process.cwd()

    // entrypoint file, auto-generated as $outputPath/index.tsx if not existing
    entryPoint?: string; // default: $outputPath/index.ts or $outputPath/index.tsx, wether it exists


    // --- TS/TSX TO JS TRANSPILATION 

    testJSTranspileFileExtensions?: RegExp; // default: /(\.tsx?|\.js(x|m)?)$/

    // output file name pattern
    outputFileNamePattern?: string; // default: [name].[hash].js

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

    // DevServer listening port
    port?: number; // default: 4444

    // tells the server, where it runs, like: myapp.test:80
    public?: string; // default: window.location

    // allows to configure API proxying, e.g. { '/api': 'http://localhost:3000' }
    proxy?: {
        [apiEndpointUrl: string]: string;
    }; // default: {}


    // --- RAW FILE IMPORTS

    // allows for raw file imports like: import * as vertexShader from "../assets/shader.vert";
    // necessary for i18n JSON file loading support
    enableRawFileImport?: boolean; // default: true

    // file extensions to recognize as raw files.
    // Be careful not to confuse with module dependency file extensions like .ts, .tsx, .css etc.!
    rawFileImportExt?: RegExp; // default: /\.txt|\.svg$/i


    // --- STYLING, CSS, SASS/SCSS, PostCSS SUPPORT

    testCSSTranspileFileExtensions?: RegExp; // default: /\.(css|sass|scss)$/

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


    // --- PWA SUPPORT

    // generates a .manifest file for offline caching in PWA's
    enableManifestGeneration?: boolean; // default: false


    // --- PRODUCTION OPTIMIZATIONS

    // writes out .gz files next to each asset in $outputPath
    // useful for fast file delivery by servers
    enableGzipCompression?: boolean; // default: false

    // writes out .br files next to each asset in $outputPath
    // useful for fast file delivery by servers
    enableBrotliCompression?: boolean; // default: false

    // analyzes the bundled code for size and chunks.
    // generates a graph chart in $outputPath/graph.html and opens it automatically
    enableBundleAnalyzer?: boolean; // default: true


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
