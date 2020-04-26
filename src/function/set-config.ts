import { IBuildConfig } from "../interface/ibuild-config";

export const setConfig = (config: IBuildConfig|Array<IBuildConfig>) => {
    return  (globalThis as any).stConfig = config;
}