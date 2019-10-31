module.exports = {
    proxy: {
        '/api': 'http://localhost:9999/api'
    }
}; // must statisfy: IBuildConfig | Array<IBuildConfig>