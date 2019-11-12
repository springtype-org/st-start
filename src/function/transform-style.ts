import { createHash } from 'crypto';
import { readFileSync, writeFileSync } from 'fs';
import { dirname, relative } from 'path';
import { mkdir } from "st-mkdir";
import { IBuildConfig } from './../interface/ibuild-config';
import { getContextPath } from './config-getters';
import { getPostCssConfig } from './get-postcss-plugins';
import { log } from './log';
import { resolveFromContext } from './require-from-context';

export const transformStyle = async (filePath: string, outputPath: string, config: IBuildConfig) => {
    let css = readFileSync(filePath, 'utf8');
    const hashFile = outputPath + '.md5';

    // prepare output path
    mkdir(dirname(outputPath));

    let prevHash;
    try {
        prevHash = readFileSync(hashFile, 'utf8');
    } catch(e) {}

    const contentHash = createHash('md5').update(css).digest("hex");

    if (contentHash === prevHash) {
        return;
    } 

    let map;

    // 1. step: SASS/SCSS transform
    if (config.enableSass) {

        log('Transforming SASS/SCSS to CSS: ' + relative(getContextPath(config), filePath));

        const sass = require(resolveFromContext('node-sass', config));

        const sassResult = sass.renderSync({
            data: css,
            outFile: outputPath,
            sourceMap: true,
            includePaths: ['node_modules', ...(config.staticStyleResolvePaths || [])]
        });

        css = sassResult.css.toString('utf8');
        map = sassResult.map.toString('utf8');
    }

    // 2. step: PostCSS transform
    if (config.enablePostCSS) {

        log('Transforming PostCSS to CSS: ' + relative(getContextPath(config), filePath));

        const postcss = require(resolveFromContext('postcss', config));
        const postCssTransformResult = await postcss(getPostCssConfig(config)).process(css, {
            from: filePath,
            to: outputPath,
        });
        css = postCssTransformResult.css;

        if (postCssTransformResult.map) {
            map = postCssTransformResult.map;
        }
        
    }

    if (map) {
        writeFileSync(outputPath + '.map', map);
    }

    // write-out CSS in any case
    writeFileSync(outputPath, css);

    // write-out hash for content caching 
    writeFileSync(hashFile, contentHash);
};
