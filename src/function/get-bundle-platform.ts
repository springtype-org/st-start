import { BundlePlatform } from "../interface/bundle-platform";

export const getBundlePlatform = (): BundlePlatform => {
    return <BundlePlatform> process.env.NODE_PLATFORM;
}