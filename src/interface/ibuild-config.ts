export interface IBuildConfig {

    // allows for raw file imports like: import "../assets/shader.vert"; defaults to: /\.txt$/i
    rawFileImportExt?: RegExp;
    
    // root directory location, defaults to process.cwd()
    context?: string;

    // list of paths to watch for typechecking, defaults to: ['src']
    typeCheckPaths?: Array<string>;

    // entrypoint file, defaults to src/index.ts or src/index.tsx wether exists
    entryPoint?: string;

    // output path, defaults to: dist
    outputPath?: string;

    // output file name pattern, defaults to: [name].js
    outputFileName?: string;

    // path for public relative imports, defaults to: /
    publicPath?: string;

    // enable eslint checks, defaults to: true
    eslint?: boolean;

    // ignore build warnings, defaults to: false
    ignoreWarnings?: boolean;

    // path to index.html template file, defaults to: src/index.html if existing, else auto-generated
    // can be an ejs template
    indexHTMLTemplate?: string;

    // tells the server, where it runs, like: myapp.test:80, defaults to window.location
    public?: string;

    // allows to configure API proxying, e.g. { '/api': 'http://localhost:3000' }, defaults to: {}
    proxy?: {
        [apiEndpointUrl: string]: string;
    };

    // title of index.html, defaults to: ''
    indexHTMLTitle?: string;

    // defines how the scripts and styles should be injected, defaults to 'body'
    indexHTMLInjectionType?: 'head' | 'body' | false;

    // favicon for the index.html template, defaults to: ''
    indexHTMLFavIcon?: string; 

    // meta tags like: { viewport: 'initial-scale=1' }, defaults to: {}
    indexHTMLMetaTags?: {
        [name: string]: string; 
    };

    // used to render values in index.html dynamically, defaults to: {}
    // e.g { foo: 'abc' }
    // use <%= foo %> in HTML template
    indexHTMLParams?: {
        [name: string]: any;
    },

    // polyfill imports to prepend, defaults to: []
    polyfills?: Array<string>;

    // list of file extensions to consider, defaults to: [".tsx", ".ts", ".js"]
    fileExtensions?: Array<string>;
    
    // default path the devServer tries to load assets from, defaults to: assets
    assetsPath?: string;

    // DevServer listening port, defaults to: 4444
    port?: number;

    // definitions to pass to the code built, defaults to: 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    // can be used for feature flags, service URLs etc.
    definitions?: {
        [key: string]: any;
    };
    
    // allows to copy files from any location to any other location on build, defaults to: []
    copyFiles?: Array<{
      from: string,
      to: string,
      flatten: boolean
    }>;
}