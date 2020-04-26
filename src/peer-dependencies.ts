import { readFileSync } from "fs";
import { resolve } from "path";

export const getExpectedPeerDependencyVersions = (packageNames: Array<string>) => {

    const packageJSONStStart = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf8'));

    // lookup versions from devDependencies (package.json)
    const devDependencies = {
        ...packageJSONStStart.dependencies,
        ...packageJSONStStart.devDependencies,
    };

    const peerDependencies: {
        [packageName: string]: string;
    } = {};

    for (const packageName of packageNames) {
        peerDependencies[packageName] = devDependencies[packageName];
    }
    return peerDependencies;
}

export const peerDependencies: Array<string> = [

    'webpack',

    // sass
    'node-sass', 'sass-loader',

    // cssImportTypeDeclaration
    'dts-css-modules-loader',
    'css-loader',

    // postcss
    'postcss-loader',
    'postcss-preset-env',
    'postcss-nested',
    'postcss-normalize',
    'postcss-flexbugs-fixes',
    'postcss-safe-parser',
    'browserslist',

    // sass / postcss
    'resolve-url-loader',

    // autoprefixer
    'autoprefixer',

    // brotliCompression
    'brotli-webpack-plugin',

    // manifest
    'webpack-manifest-plugin',

    // dependencyAnalyzer
    'webpack-bundle-analyzer',

    // lostGrid
    'lost',

    // notifications
    'node-notifier',

    // linting
    'eslint',
    'eslint-loader',
    'babel-eslint',
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint/parser',

    // yarnPnp
    'ts-pnp',
    'pnp-webpack-plugin',

    // serviceWorkerScript
    'workbox-webpack-plugin',

    // imageInlining
    'url-loader',

    // postcss, linting, yarnPnp, typeScriptTypeChecking
    'react-dev-utils',

    'typescript',

    // rawLoader
    'raw-loader',
];

export const featureToPeerDependencyMap = {
    webpack: ['webpack'],
    sass: ['sass-loader', 'node-sass', 'resolve-url-loader'],
    cssImportTypeDeclaration: ['dts-css-modules-loader', 'css-loader'],
    postcss: [
        'postcss-loader',
        'postcss-preset-env',
        'postcss-nested',
        'resolve-url-loader',
        'postcss-flexbugs-fixes',
        'postcss-normalize',
        'postcss-safe-parser',
        'browserslist'
    ],
    rawLoader: ['raw-loader'],
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
    typeScriptTypeChecking: ['typescript', 'react-dev-utils']
};
