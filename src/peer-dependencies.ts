import { resolve } from "path";
import { readFileSync } from "fs";

const getPeerDependencies = (packageNames: Array<string>) => {

    // lookup versions from devDependencies (package.json)
    const devDependencies = 
        JSON.parse(readFileSync(resolve(__dirname, '../package.json'), { encoding: 'utf8' })).devDependencies;

    const peerDependencies: {
        [packageName: string]: string;
    } = {};

    for (const packageName of packageNames) {
        peerDependencies[packageName] = devDependencies[packageName];
    }
    return peerDependencies;
}

export const peerDependencies: {
    [dependencyName: string]: string;
} = getPeerDependencies([

    // sass
    'node-sass', 'sass-loader',

    // cssImportTypeDeclaration
    'dts-css-modules-loader',

    // postcss
    'postcss-loader',
    'postcss-preset-env',
    'postcss-nested',
    'postcss-normalize',
    'postcss-flexbugs-fixes',
    'postcss-safe-parser',

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

    'browserslist'
]);

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
