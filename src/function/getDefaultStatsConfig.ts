export const getDefaultStatsConfig = () => {
    return {
        assets: true,
        assetsSort: '!size',
        builtAt: true,
        cached: true,
        cachedAssets: true,
        entrypoints: true,
        env: true,
        children: false,
        maxModules: 0,
        colors: true
    };
}