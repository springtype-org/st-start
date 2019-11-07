export const peerDependencies: {
    [dependencyName: string]: string;
} = {

    // !! versions must be prefixed with a ^ !!

    // sass
    'node-sass': '^4.13.0',
    'sass-loader': '^8.0.0',

    // cssImportTypeDeclaration
    'dts-css-modules-loader': '^1.0.1',

    // postcss
    'postcss-loader': '^3.0.0',
    'postcss-preset-env': '^6.7.0',
    'postcss-nested': '^4.1.2',
    'postcss-normalize': '^8.0.1',
    'postcss-flexbugs-fixes': '^4.1.0',
    'postcss-safe-parser': '^4.0.1',

    // sass / postcss
    'resolve-url-loader': '^3.1.0',

    // autoprefixer
    autoprefixer: '^9.7.1',

    // brotliCompression
    'brotli-webpack-plugin': '^1.1.0',

    // manifest
    'webpack-manifest-plugin': '^2.2.0',

    // dependencyAnalyzer
    'webpack-bundle-analyzer': '^3.6.0',

    // lostGrid
    lost: '^8.3.1',

    // notifications
    'node-notifier': '^6.0.0',

    // linting
    eslint: '^6.6.0',
    'eslint-loader': '^3.0.2',
    'babel-eslint': '^10.0.3',
    '@typescript-eslint/eslint-plugin': '^2.6.0',
    '@typescript-eslint/parser': '^2.6.0',

    // yarnPnp
    'ts-pnp': '^1.1.4',
    'pnp-webpack-plugin': '^1.5.0',

    // serviceWorkerScript
    'workbox-webpack-plugin': '^4.3.1',

    // imageInlining
    'url-loader': '^2.2.0',

    // postcss, linting, yarnPnp, typeScriptTypeChecking
    'react-dev-utils': '^9.1.0',

    // typeScriptTypeChecking
    typescript: '^3.6.4',
};

export const featureToPeerDependencyMap = {
    sass: ['sass-loader', 'node-sass', 'resolve-url-loader'],
    cssImportTypeDeclaration: ['dts-css-modules-loader'],
    postcss: [
        'postcss-loader',
        'postcss-preset-env',
        'postcss-nested',
        'resolve-url-loader',
        'postcss-flexbugs-fixes',
        'postcss-normalize',
        'postcss-safe-parser',
    ],
    autoprefixer: ['autoprefixer'],
    brotliCompression: ['brotli-webpack-plugin'],
    manifest: ['webpack-manifest-plugin'],
    dependencyAnalyzer: ['webpack-bundle-analyzer'],
    lostGrid: ['lost'],
    notifications: ['node-notifier'],
    linting: [
        'eslint',
        'eslint-loader',
        'react-dev-utils',
        '@typescript-eslint/eslint-plugin',
        '@typescript-eslint/parser',
        'babel-eslint',
    ],
    yarnPnp: ['pnp-webpack-plugin', 'ts-pnp', 'react-dev-utils'],
    serviceWorkerScript: ['workbox-webpack-plugin'],
    imageInlining: ['url-loader'],
    typeScriptTypeChecking: ['typescript', 'react-dev-utils'],
};
