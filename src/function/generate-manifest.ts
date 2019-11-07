export const generateManifest = (seed: any, files: Array<any>, entrypoints: any) => {
    const manifestFiles = files.reduce((manifest, file) => {
        manifest[file.name] = file.path;
        return manifest;
    }, seed);
    const entrypointFiles = entrypoints.main.filter(
        (fileName: string) => !fileName.endsWith('.map'),
    );

    return {
        files: manifestFiles,
        entrypoints: entrypointFiles,
    };
};