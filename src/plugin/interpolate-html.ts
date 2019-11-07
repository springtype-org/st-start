const escapeStringRegexp = require('escape-string-regexp');
export class InterpolateHtmlPlugin {
    constructor(protected htmlWebpackPlugin: any, protected replacements: any) {}
    apply(compiler: any) {
        compiler.hooks.compilation.tap('InterpolateHtmlPlugin', (transpilationResult: any) => {
            this.htmlWebpackPlugin
                .getHooks(transpilationResult)
                .afterTemplateExecution.tap('InterpolateHtmlPlugin', (data: any) => {
                    Object.keys(this.replacements).forEach(key => {
                        const value = this.replacements[key];
                        data.html = data.html.replace(new RegExp('%' + escapeStringRegexp(key) + '%', 'g'), value);
                    });
                });
        });
    }
}
