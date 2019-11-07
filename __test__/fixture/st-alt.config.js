module.exports = [{
    entryPoint: 'src/index2.tsx',
    bundleAnalyzerAutoOpen: false
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
