module.exports = [{
    entryPoint: 'src/index2.tsx',
    bundleAnalyzerAutoOpen: false,
    staticStyleEntryPoints: {
        'src/material.static.scss': 'dist/material.static.css'
    },
}, {
    entryPoint: 'src/background.ts',
    enableBundleAnalyzer: false,
    singleFileOutput: 'dist/background.js'
}, {
    isNodeJsTarget: true,
    enableBundleAnalyzer: false,
    entryPoint: 'src/server.ts',
    singleFileOutput: 'dist/server.js'
}];
