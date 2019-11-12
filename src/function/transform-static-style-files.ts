import { resolve } from 'path';
import { IBuildConfig } from './../interface/ibuild-config';
import { getContextPath } from './config-getters';
import { transformStyle } from './transform-style';
export const transformStaticStyleFiles = async(config: IBuildConfig) => {

    const staticStyleEntryPointFiles = config.staticStyleEntryPoints ? config.staticStyleEntryPoints : {};

    // 1. static style entry point transpilation
    for (let staticStyleFileEntryPoint in staticStyleEntryPointFiles) {
        const staticStyleFileOutputPath = resolve(
            getContextPath(config),
            staticStyleEntryPointFiles[staticStyleFileEntryPoint],
        );
        staticStyleFileEntryPoint = resolve(getContextPath(config), staticStyleFileEntryPoint);

        await transformStyle(staticStyleFileEntryPoint, staticStyleFileOutputPath, config);
    }
};
