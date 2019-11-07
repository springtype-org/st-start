const tsPnp = require('ts-pnp');

export const resolveTypeReferenceDirective = (
    typescript: any,
    moduleName: string,
    containingFile: string,
    compilerOptions: any,
    resolutionHost: string,
) => {
    return tsPnp.resolveModuleName(
        moduleName,
        containingFile,
        compilerOptions,
        resolutionHost,
        typescript.resolveTypeReferenceDirective,
    );
};

export const resolveModuleName = (
    typescript: any,
    moduleName: string,
    containingFile: string,
    compilerOptions: any,
    resolutionHost: string,
) => {
    return tsPnp.resolveModuleName(
        moduleName,
        containingFile,
        compilerOptions,
        resolutionHost,
        typescript.resolveModuleName,
    );
};
