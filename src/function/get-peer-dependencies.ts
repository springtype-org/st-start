import { featureToPeerDependencyMap, peerDependencies, getExpectedPeerDependencyVersions } from '../peer-dependencies';
import { IBuildConfig } from './../interface/ibuild-config';

export const getPeerDependencies = (config: IBuildConfig): Array<string> => {
    let requiredPeerDependencies = [...featureToPeerDependencyMap.webpack];

    if (config.enableSass) {
        requiredPeerDependencies.push(...featureToPeerDependencyMap.sass);
    }

    if (config.enableCssImportTypeDeclaration) {
        requiredPeerDependencies.push(...featureToPeerDependencyMap.cssImportTypeDeclaration);
    }

    if (config.enablePostCSS) {
        requiredPeerDependencies.push(...featureToPeerDependencyMap.postcss);
    }

    if (config.enablePostCSSAutoPrefixing) {
        requiredPeerDependencies.push(...featureToPeerDependencyMap.autoprefixer);
    }

    if (config.enableBrotliCompression) {
        requiredPeerDependencies.push(...featureToPeerDependencyMap.brotliCompression);
    }

    if (config.enableManifestGeneration) {
        requiredPeerDependencies.push(...featureToPeerDependencyMap.manifest);
    }

    if (config.enableBundleAnalyzer) {
        requiredPeerDependencies.push(...featureToPeerDependencyMap.dependencyAnalyzer);
    }

    if (config.enablePostCSSLostGrid) {
        requiredPeerDependencies.push(...featureToPeerDependencyMap.lostGrid);
    }

    if (config.enableDesktopNotifications) {
        requiredPeerDependencies.push(...featureToPeerDependencyMap.notifications);
    }

    if (config.enableLinting) {
        requiredPeerDependencies.push(...featureToPeerDependencyMap.linting);
    }

    if (config.enableYarnPnp) {
        requiredPeerDependencies.push(...featureToPeerDependencyMap.yarnPnp);
    }

    if (config.enableServiceWorkerScript) {
        requiredPeerDependencies.push(...featureToPeerDependencyMap.serviceWorkerScript);
    }

    if (config.enableImageInlining) {
        requiredPeerDependencies.push(...featureToPeerDependencyMap.imageInlining);
    }

    if (config.enableTypeScriptTypeChecking) {
        requiredPeerDependencies.push(...featureToPeerDependencyMap.typeScriptTypeChecking);
    }

    if (config.enableRawFileImport) {
        requiredPeerDependencies.push(...featureToPeerDependencyMap.rawLoader);
    }

    const peerDependencyVersions = getExpectedPeerDependencyVersions(peerDependencies);

    // substitute dependency names by dependency@version to guarantee comparibility
    requiredPeerDependencies = requiredPeerDependencies.map((peerDependencyName: string) => {
        return `${peerDependencyName}@${peerDependencyVersions[peerDependencyName]}`;
    });

    return requiredPeerDependencies;
};
