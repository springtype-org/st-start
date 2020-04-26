import { IBuildConfig } from "../interface/ibuild-config";
import { BundleEnvironment } from "../interface/bundle-environment";

export const getWebpackMode = (config: IBuildConfig): BundleEnvironment => {

    // no need to go through mapping
    if (config.env === "development" || config.env === "production") return config.env;

    const mappedBundleEnvironment: BundleEnvironment = config.environments![config.env!];

    if (!mappedBundleEnvironment || (mappedBundleEnvironment !== "development" && mappedBundleEnvironment !== "production")) {

        throw new Error(`The custom env ${config.env} has no mapping to 'development' or 'production'. 
            Please set an environments mapping in build config when using custom environment names.`);
    }
    return mappedBundleEnvironment;
}