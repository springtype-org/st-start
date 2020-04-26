import { BundleEnvironment } from "../interface/bundle-environment";

export const getCacheIdent = (cacheIdentifier: BundleEnvironment, packages: Array<string>): string => {
    for (const packageName of packages) {
        cacheIdentifier += `:${packageName}@`;
        try {
            cacheIdentifier += require(`${packageName}/package.json`).version;
        } catch (e) {
            // if the package to get a cache ident for is not even installed, this isn't an issue,
            // because there will be no caching for this package anyway
        }
    }
    return cacheIdentifier;
};
