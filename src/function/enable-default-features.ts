import { IBuildConfig } from './../interface/ibuild-config';
export const enableDefaultFeatures = (config: IBuildConfig) => {

    // activate default features
    config.enableSass = config.enableSass !== false;
    config.enablePostCSS = config.enablePostCSS !== false;
    config.enablePostCSSAutoPrefixing = config.enablePostCSSAutoPrefixing !== false;
    config.enablePostCSSLostGrid = config.enablePostCSSLostGrid !== false;
    config.enableRawFileImport = config.enableRawFileImport !== false;
    config.enableBundleAnalyzer = config.enableBundleAnalyzer !== false;
    config.enableDesktopNotifications = config.enableDesktopNotifications !== false;
    config.enableSourceMapInProduction = config.enableSourceMapInProduction !== false;
    config.enableGzipCompression = config.enableGzipCompression !== false;
    config.enableRawFileImport = config.enableRawFileImport !== false;
    config.inlineRuntimeChunks = config.inlineRuntimeChunks !== false;
    config.enableCssImportTypeDeclaration = config.enableCssImportTypeDeclaration !== false;
}