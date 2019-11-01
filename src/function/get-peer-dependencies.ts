import { featureToPeerDependencyMap, peerDependencies } from '../peer-dependencies';
import { IBuildConfig } from './../interface/ibuild-config';

export const getPeerDependencies = (config: IBuildConfig): Array<string> => {
    let requiredPeerDependencies = featureToPeerDependencyMap.base;

    if (config.enableBrotliCompression) {
        requiredPeerDependencies.push(...featureToPeerDependencyMap.brotliCompression);
    }

    if (config.enableGzipCompression) {
        requiredPeerDependencies.push(...featureToPeerDependencyMap.gzipCompression);
    }

    if (config.enableBundleAnalyzer) {
        requiredPeerDependencies.push(...featureToPeerDependencyMap.dependencyAnalyzer);
    }

    if (config.enableDesktopNotifications) {
        requiredPeerDependencies.push(...featureToPeerDependencyMap.notifications);
    }

    if (config.enableManifestGeneration) {
        requiredPeerDependencies.push(...featureToPeerDependencyMap.manifest);
    }

    if (config.enablePostCSS) {
        requiredPeerDependencies.push(...featureToPeerDependencyMap.postcss);
    }

    if (config.enablePostCSSAutoPrefixing) {
        requiredPeerDependencies.push(...featureToPeerDependencyMap.autoprefixer);
    }

    if (config.enablePostCSSLostGrid) {
        requiredPeerDependencies.push(...featureToPeerDependencyMap.lostGrid);
    }

    if (config.enableRawFileImport) {
        requiredPeerDependencies.push(...featureToPeerDependencyMap.rawLoader);
    }

    if (config.enableSass) {
        requiredPeerDependencies.push(...featureToPeerDependencyMap.sass);
    }

    // substitute dependency names by dependency@version to guarantee comparibility
    requiredPeerDependencies = requiredPeerDependencies.map((peerDependencyName: string) => {
        return `${peerDependencyName}@${peerDependencies[peerDependencyName]}`;
    });

    return requiredPeerDependencies;
};
