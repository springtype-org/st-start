interface IScript extends HTMLScriptElement {
    attributes: NamedNodeMap & { src: string };
}

export class InlineChunkHtmlPlugin {
    constructor(protected htmlWebpackPlugin: any, protected tests: Array<any>) {}
    getScriptTag(publicPath: string, assets: any, tag: IScript) {
        if (tag.tagName !== 'script' || !(tag.attributes && tag.attributes.src)) {
            return tag;
        }
        const scriptName = publicPath ? tag.attributes.src.replace(publicPath, '') : tag.attributes.src;
        if (!this.tests.some(test => scriptName.match(test))) {
            return tag;
        }
        const asset = assets[scriptName];
        if (asset == null) {
            return tag;
        }
        return { tagName: 'script', innerHTML: asset.source(), closeTag: true };
    }
    apply(transpiler: any) {
        let publicPath = transpiler.options.output.publicPath || '';
        if (publicPath && !publicPath.endsWith('/')) {
            publicPath += '/';
        }

        transpiler.hooks.compilation.tap('InlineChunkHtmlPlugin', (transpilationResult: any) => {
            const scriptTagProcessor = (tag: IScript) => this.getScriptTag(publicPath, transpilationResult.assets, tag);

            const hooks = this.htmlWebpackPlugin.getHooks(transpilationResult);
            hooks.alterAssetTagGroups.tap('InlineChunkHtmlPlugin', (tagGroups: any) => {
                tagGroups.bodyTags = tagGroups.bodyTags.map(scriptTagProcessor);
                tagGroups.headTags = tagGroups.headTags.map(scriptTagProcessor);
            });
        });
    }
}
